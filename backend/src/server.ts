import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import aiRoutes from './routes/ai.js';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import connectDB from './shared/db/connectDb.js';

import { requireAuth } from './middleware/auth.js';
import appointmentRoutes from './routes/appointments.js';
import customerRoutes from './routes/customers.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payments.js';
import productRoutes from './routes/products.js';

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL?.split(',') || ['http://localhost:5173'],
    credentials: true,
  })
);
// Stripe must receive the untouched request body for webhook signature verification.
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
// Routes
// Keep authentication under a dedicated namespace so auth middleware and rate limits can be applied consistently.
app.use('/api/auth', authRoutes);
app.use('/api/ai', requireAuth, aiRoutes);
app.use('/api/dashboard', requireAuth, dashboardRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/customers', requireAuth, customerRoutes);
app.use('/api/appointments', requireAuth, appointmentRoutes);
app.use('/api/products', requireAuth, productRoutes);
app.use('/api/orders', requireAuth, orderRoutes);

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to AI Native MERN Backend!',
    version: '1.0.0',
  });
});

// Start Server
const PORT = env.PORT;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔗 http://localhost:${PORT}`);
  });
};

startServer().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown startup error';
  console.error(`❌ Backend startup failed: ${message}`);
  process.exitCode = 1;
});
