import express, { Request, Response } from 'express';
import { Product } from '../models/Product.js';

const router = express.Router();
router.get('/', async (_req: Request, res: Response) => {
  try {
    return res.json({ success: true, data: await Product.find().sort({ createdAt: -1 }).lean() });
  } catch {
    return res.status(500).json({ message: 'Unable to load services' });
  }
});
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, category, price, stock = 0, description = '' } = req.body;
    if (
      typeof name !== 'string' ||
      !name.trim() ||
      typeof category !== 'string' ||
      typeof price !== 'number'
    )
      return res.status(400).json({ message: 'Name, category and numeric price are required' });
    return res
      .status(201)
      .json({
        success: true,
        data: await Product.create({ name: name.trim(), category, price, stock, description }),
      });
  } catch {
    return res.status(500).json({ message: 'Unable to create service' });
  }
});
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: 'Service not found' });
    return res.json({ success: true, data: product });
  } catch {
    return res.status(500).json({ message: 'Unable to update service' });
  }
});
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Service not found' });
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ message: 'Unable to delete service' });
  }
});
export default router;
