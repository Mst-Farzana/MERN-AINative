import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { Appointment } from '../models/Appointment.js';
import { Customer } from '../models/customer.js';
import connectDB from '../shared/db/connectDb.js';

// MCP stdio reserves stdout for JSON-RPC messages; keep database logs on stderr.
console.log = console.error;

const server = new McpServer({ name: 'schedulr-booking', version: '1.0.0' });
const textResult = (value: unknown) => ({
  content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }],
});

server.registerTool(
  'list_clients',
  {
    title: 'List clients',
    description: 'Search Schedulr clients by name, email, or service.',
    inputSchema: {
      search: z.string().optional(),
      status: z.enum(['Active', 'New', 'Inactive']).optional(),
    },
  },
  async ({ search, status }) => {
    const filter: Record<string, unknown> = {};
    if (search)
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { service: new RegExp(search, 'i') },
      ];
    if (status) filter.status = status;
    const clients = await Customer.find(filter).sort({ createdAt: -1 }).limit(50).lean();
    return textResult(clients);
  }
);

server.registerTool(
  'list_appointments',
  {
    title: 'List appointments',
    description: 'List appointments in an ISO date range for schedule planning.',
    inputSchema: { from: z.string(), to: z.string() },
  },
  async ({ from, to }) => {
    const start = new Date(from);
    const end = new Date(to);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
      return textResult({ error: 'from and to must be valid ISO dates' });
    const appointments = await Appointment.find({ startAt: { $gte: start, $lt: end } })
      .sort({ startAt: 1 })
      .lean();
    return textResult(appointments);
  }
);

server.registerTool(
  'create_appointment',
  {
    title: 'Create appointment',
    description:
      'Create a pending appointment after checking the requested time slot for conflicts.',
    inputSchema: {
      clientName: z.string().min(1),
      clientEmail: z.string().email().optional(),
      service: z.string().min(1),
      startAt: z.string(),
      durationMinutes: z.number().int().min(15).max(480).default(45),
      notes: z.string().optional(),
    },
  },
  async ({ clientName, clientEmail, service, startAt, durationMinutes, notes }) => {
    const start = new Date(startAt);
    if (Number.isNaN(start.getTime()))
      return textResult({ error: 'startAt must be a valid ISO date' });
    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
    const conflict = await Appointment.findOne({
      status: { $nin: ['Cancelled'] },
      startAt: { $lt: end, $gte: new Date(start.getTime() - 8 * 60 * 60 * 1000) },
    }).lean();
    if (conflict) return textResult({ error: 'This time slot is already booked', conflict });
    const appointment = await Appointment.create({
      clientName,
      clientEmail,
      service,
      startAt: start,
      durationMinutes,
      notes,
      status: 'Pending',
    });
    return textResult(appointment);
  }
);

await connectDB();
const transport = new StdioServerTransport();
await server.connect(transport);
