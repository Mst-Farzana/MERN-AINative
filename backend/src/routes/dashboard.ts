import express from 'express';
import { Order } from '../models/Order.js';

const router = express.Router();

// Dashboard Stats
router.get('/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Today's orders
    const todayOrders = await Order.aggregate([
      { $match: { orderDate: { $gte: today } } },
      { $group: { _id: null, count: { $sum: 1 }, total: { $sum: '$orderAmount' } } },
    ]);

    // This month orders
    const monthOrders = await Order.aggregate([
      { $match: { orderDate: { $gte: thisMonth } } },
      { $group: { _id: null, count: { $sum: 1 }, total: { $sum: '$orderAmount' } } },
    ]);

    // Total orders
    const totalOrders = await Order.aggregate([
      { $group: { _id: null, count: { $sum: 1 }, total: { $sum: '$orderAmount' } } },
    ]);

    // Status counts
    const pendingCount = await Order.countDocuments({ status: 'Pending' });
    const processingCount = await Order.countDocuments({ status: 'Processing' });
    const deliveredCount = await Order.countDocuments({ status: 'Delivered' });

    // Monthly conversions (last 7 months)
    const monthlyData = await Order.aggregate([
      {
        $group: {
          _id: { $month: '$orderDate' },
          count: { $sum: 1 },
          total: { $sum: '$orderAmount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Category-wise revenue
    const categoryRevenue = await Order.aggregate([
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.category',
          revenue: { $sum: { $multiply: ['$products.price', '$products.quantity'] } },
        },
      },
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .sort({ orderDate: -1 })
      .limit(10)
      .select('customerName deliveryAddress phone paymentMethod orderAmount status orderDate');

    res.json({
      success: true,
      data: {
        todayOrders: todayOrders[0] || { count: 0, total: 0 },
        monthOrders: monthOrders[0] || { count: 0, total: 0 },
        totalOrders: totalOrders[0] || { count: 0, total: 0 },
        statusCounts: {
          pending: pendingCount,
          processing: processingCount,
          delivered: deliveredCount,
        },
        monthlyData,
        categoryRevenue,
        recentOrders,
      },
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;
