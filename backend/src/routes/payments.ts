import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import { env } from '../config/env.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const stripe = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY) : null;

const getStripe = () => {
  if (!stripe) {
    throw new Error('Stripe is not configured on the server');
  }
  return stripe;
};

router.get('/config', (_req: Request, res: Response) => {
  if (!env.STRIPE_PUBLISHABLE_KEY) {
    return res.status(503).json({ message: 'Stripe is not configured on the server' });
  }

  return res.json({ publishableKey: env.STRIPE_PUBLISHABLE_KEY });
});

router.post('/create-checkout-session', requireAuth, async (req: Request, res: Response) => {
  try {
    const {
      serviceName,
      amount,
      currency = 'usd',
      customerEmail,
      bookingId,
      appointmentDate,
    } = req.body;

    if (typeof serviceName !== 'string' || !serviceName.trim()) {
      return res.status(400).json({ message: 'serviceName is required' });
    }

    if (typeof amount !== 'number' || !Number.isInteger(amount) || amount < 50) {
      return res
        .status(400)
        .json({ message: 'amount must be an integer in the smallest currency unit' });
    }

    if (customerEmail !== undefined && typeof customerEmail !== 'string') {
      return res.status(400).json({ message: 'customerEmail must be a valid email string' });
    }

    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      customer_email: customerEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: typeof currency === 'string' ? currency.toLowerCase() : 'usd',
            product_data: { name: serviceName.trim() },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: typeof bookingId === 'string' ? bookingId : '',
        appointmentDate: typeof appointmentDate === 'string' ? appointmentDate : '',
      },
      success_url: `${env.CLIENT_URL}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.CLIENT_URL}/?payment=cancelled`,
    });

    return res.status(201).json({
      sessionId: session.id,
      checkoutUrl: session.url,
    });
  } catch (error: unknown) {
    console.error('Stripe checkout session error:', error);
    return res.status(500).json({ message: 'Unable to create payment session' });
  }
});

router.post('/webhook', (req: Request, res: Response) => {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    return res.status(503).json({ message: 'Stripe webhook is not configured on the server' });
  }

  const signature = req.headers['stripe-signature'];
  if (typeof signature !== 'string' || !Buffer.isBuffer(req.body)) {
    return res.status(400).json({ message: 'Invalid Stripe webhook request' });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(req.body, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (error: unknown) {
    console.error('Stripe webhook signature verification failed:', error);
    return res.status(400).json({ message: 'Invalid webhook signature' });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`Stripe payment completed: ${session.id}`);
      // Persist booking/payment confirmation here when the booking model is added.
      break;
    }
    case 'checkout.session.expired':
      console.log(`Stripe checkout expired: ${event.data.object.id}`);
      break;
    default:
      break;
  }

  return res.json({ received: true });
});

export default router;
