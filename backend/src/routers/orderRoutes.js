import express from 'express';
import Order from '../models/orderModel.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin routes
router.get('/admin', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

router.put('/admin/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const order = await Order.updateStatus(req.params.id, req.body.status);
    res.json(order);
  } catch (err) {
    res.status(404).json({ message: 'Order not found' });
  }
});

// User routes
router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.findByUser(req.user._id);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user orders' });
  }
});

export default router;