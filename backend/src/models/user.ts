import bcrypt from 'bcryptjs';
import mongoose, { Document } from 'mongoose';

// ১. ইন্টারফেস তৈরি করা (TypeScript-এর জন্য)
export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: 'admin' | 'delivery' | 'user';
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'delivery', 'user'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// পাসওয়ার্ড হ্যাশ করা
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// পাসওয়ার্ড চেক করার মেথড
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ২. মডেল এক্সপোর্ট করার সময় IUser ইন্টারফেস ব্যবহার করা
export const User = mongoose.model<IUser>('User', userSchema);
