import express, { Request, Response } from 'express';
import { Order } from '../models/Order.js';

const router = express.Router();
router.get('/', async (_req: Request, res: Response) => {
  try {
    return res.json({ success: true, data: await Order.find().sort({ orderDate: -1 }).lean() });
  } catch {
    return res.status(500).json({ message: 'Unable to load orders' });
  }
});
router.post('/', async (req: Request, res: Response) => {
  try {
    const order = await Order.create(req.body);
    return res.status(201).json({ success: true, data: order });
  } catch {
    return res.status(400).json({ message: 'Unable to create order' });
  }
});
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.json({ success: true, data: order });
  } catch {
    return res.status(400).json({ message: 'Unable to update order' });
  }
});
export default router;
