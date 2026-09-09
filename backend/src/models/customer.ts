import mongoose from 'mongoose';

export interface ICustomer {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  status: 'Active' | 'New' | 'Inactive';
  appointments: number;
  notes?: string;
}

const customerSchema = new mongoose.Schema<ICustomer>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, default: '' },
    service: { type: String, trim: true, default: 'Initial consultation' },
    status: { type: String, enum: ['Active', 'New', 'Inactive'], default: 'New' },
    appointments: { type: Number, default: 0, min: 0 },
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

customerSchema.index({ email: 1 }, { unique: true });
customerSchema.index({ name: 'text', email: 'text', service: 'text' });

export const Customer = mongoose.model<ICustomer>('Customer', customerSchema);
