import express, { Request, Response } from 'express';
import { Customer } from '../models/customer.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const query = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const status = typeof req.query.status === 'string' ? req.query.status : '';
    const filter: Record<string, unknown> = {};
    if (query)
      filter.$or = [
        { name: new RegExp(query, 'i') },
        { email: new RegExp(query, 'i') },
        { service: new RegExp(query, 'i') },
      ];
    if (status && ['Active', 'New', 'Inactive'].includes(status)) filter.status = status;
    const customers = await Customer.find(filter).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, data: customers });
  } catch (error: unknown) {
    console.error('Customer list error:', error);
    return res.status(500).json({ message: 'Unable to load clients' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone = '', service = 'Initial consultation', notes = '' } = req.body;
    if (
      typeof name !== 'string' ||
      !name.trim() ||
      typeof email !== 'string' ||
      !email.includes('@')
    )
      return res.status(400).json({ message: 'A valid name and email are required' });
    const customer = await Customer.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone,
      service,
      notes,
      status: 'New',
    });
    return res.status(201).json({ success: true, data: customer });
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 11000)
      return res.status(409).json({ message: 'A client with this email already exists' });
    console.error('Customer create error:', error);
    return res.status(500).json({ message: 'Unable to create client' });
  }
});

router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const allowed = ['name', 'email', 'phone', 'service', 'status', 'notes'];
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowed.includes(key))
    );
    const customer = await Customer.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!customer) return res.status(404).json({ message: 'Client not found' });
    return res.json({ success: true, data: customer });
  } catch (error: unknown) {
    console.error('Customer update error:', error);
    return res.status(500).json({ message: 'Unable to update client' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Client not found' });
    return res.json({ success: true, message: 'Client deleted' });
  } catch (error: unknown) {
    console.error('Customer delete error:', error);
    return res.status(500).json({ message: 'Unable to delete client' });
  }
});

export default router;
