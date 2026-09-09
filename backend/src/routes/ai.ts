import express from 'express';
import { Order } from '../models/Order.js';
import { generateDashboardInsight } from '../services/geminiService.js';

const router = express.Router();

router.get('/dashboard-insights', async (_req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [todayOrders, monthOrders, totalOrders, statusCounts, categoryRevenue, recentOrders] =
      await Promise.all([
        Order.aggregate([
          { $match: { orderDate: { $gte: today } } },
          { $group: { _id: null, count: { $sum: 1 }, total: { $sum: '$orderAmount' } } },
        ]),
        Order.aggregate([
          { $match: { orderDate: { $gte: thisMonth } } },
          { $group: { _id: null, count: { $sum: 1 }, total: { $sum: '$orderAmount' } } },
        ]),
        Order.aggregate([
          { $group: { _id: null, count: { $sum: 1 }, total: { $sum: '$orderAmount' } } },
        ]),
        Promise.all([
          Order.countDocuments({ status: 'Pending' }),
          Order.countDocuments({ status: 'Processing' }),
          Order.countDocuments({ status: 'Delivered' }),
        ]),
        Order.aggregate([
          { $unwind: '$products' },
          {
            $group: {
              _id: '$products.category',
              revenue: { $sum: { $multiply: ['$products.price', '$products.quantity'] } },
            },
          },
          { $project: { _id: 0, category: '$_id', revenue: 1 } },
          { $sort: { revenue: -1 } },
          { $limit: 10 },
        ]),
        Order.find()
          .sort({ orderDate: -1 })
          .limit(10)
          .select('customerName orderAmount status orderDate -_id')
          .lean(),
      ]);

    const insights = await generateDashboardInsight({
      todayOrders: todayOrders[0] || { count: 0, total: 0 },
      monthOrders: monthOrders[0] || { count: 0, total: 0 },
      totalOrders: totalOrders[0] || { count: 0, total: 0 },
      statusCounts: {
        pending: statusCounts[0],
        processing: statusCounts[1],
        delivered: statusCounts[2],
      },
      categoryRevenue,
      recentOrders,
    });

    return res.json({ success: true, data: insights });
  } catch (error: unknown) {
    console.error('AI dashboard insights error:', error);
    const message = error instanceof Error ? error.message : 'Unable to generate AI insights';
    const status = message === 'GEMINI_API_KEY is not configured' ? 503 : 500;
    return res.status(status).json({ message });
  }
});

export default router;
