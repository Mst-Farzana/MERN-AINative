import express, { Request, Response } from 'express';
import { Appointment } from '../models/Appointment.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const from = typeof req.query.from === 'string' ? new Date(req.query.from) : new Date();
    const to =
      typeof req.query.to === 'string'
        ? new Date(req.query.to)
        : new Date(from.getTime() + 7 * 24 * 60 * 60 * 1000);
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()))
      return res.status(400).json({ message: 'Invalid date range' });
    const appointments = await Appointment.find({ startAt: { $gte: from, $lt: to } })
      .sort({ startAt: 1 })
      .lean();
    return res.json({ success: true, data: appointments });
  } catch (error: unknown) {
    console.error('Appointment list error:', error);
    return res.status(500).json({ message: 'Unable to load appointments' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      clientId,
      clientName,
      clientEmail,
      service,
      startAt,
      durationMinutes = 45,
      notes = '',
    } = req.body;
    const start = new Date(startAt);
    if (
      typeof clientName !== 'string' ||
      !clientName.trim() ||
      typeof service !== 'string' ||
      !service.trim() ||
      Number.isNaN(start.getTime())
    )
      return res
        .status(400)
        .json({ message: 'Client, service and a valid start time are required' });
    const end = new Date(start.getTime() + Number(durationMinutes) * 60 * 1000);
    const conflict = await Appointment.findOne({
      status: { $nin: ['Cancelled'] },
      startAt: { $lt: end, $gte: new Date(start.getTime() - 8 * 60 * 60 * 1000) },
    });
    if (conflict)
      return res.status(409).json({ message: 'This time slot is already booked', conflict });
    const appointment = await Appointment.create({
      clientId,
      clientName: clientName.trim(),
      clientEmail,
      service: service.trim(),
      startAt: start,
      durationMinutes,
      notes,
      status: 'Pending',
    });
    return res.status(201).json({ success: true, data: appointment });
  } catch (error: unknown) {
    console.error('Appointment create error:', error);
    return res.status(500).json({ message: 'Unable to create appointment' });
  }
});

router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const allowed = [
      'clientName',
      'clientEmail',
      'service',
      'startAt',
      'durationMinutes',
      'status',
      'paymentStatus',
      'notes',
    ];
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowed.includes(key))
    );
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    return res.json({ success: true, data: appointment });
  } catch (error: unknown) {
    console.error('Appointment update error:', error);
    return res.status(500).json({ message: 'Unable to update appointment' });
  }
});

export default router;
