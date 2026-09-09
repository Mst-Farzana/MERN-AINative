import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    products: [
      {
        name: String,
        category: String,
        price: Number,
        quantity: Number,
      },
    ],
    orderAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'Online', 'Card'],
      default: 'COD',
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model('Order', orderSchema);
