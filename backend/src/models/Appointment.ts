import mongoose from 'mongoose';

export interface IAppointment {
  clientId?: mongoose.Types.ObjectId;
  clientName: string;
  clientEmail?: string;
  service: string;
  startAt: Date;
  durationMinutes: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  paymentStatus: 'Unpaid' | 'Paid' | 'Refunded';
  notes?: string;
}

const appointmentSchema = new mongoose.Schema<IAppointment>(
  {
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    clientName: { type: String, required: true, trim: true },
    clientEmail: { type: String, trim: true, lowercase: true },
    service: { type: String, required: true, trim: true },
    startAt: { type: Date, required: true },
    durationMinutes: { type: Number, required: true, min: 15, max: 480 },
    status: {
      type: String,
      enum: ['Confirmed', 'Pending', 'Cancelled', 'Completed'],
      default: 'Pending',
    },
    paymentStatus: { type: String, enum: ['Unpaid', 'Paid', 'Refunded'], default: 'Unpaid' },
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

appointmentSchema.index({ startAt: 1, status: 1 });

export const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);
