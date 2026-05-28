const Subscription = require('../models/Subscription');

exports.getAll = async (req, res) => {
  try {
    const { status, category } = req.query;
    let query = { user: req.user.id };
    if (status) query.status = status;
    if (category) query.category = category;

    const subs = await Subscription.find(query).sort({ createdAt: -1 });
    const totalMonthly = subs
      .filter(s => s.status === 'active')
      .reduce((sum, s) => sum + (s.billingCycle === 'yearly' ? s.amount / 12 : s.amount), 0);

    res.json({ success: true, count: subs.length, totalMonthly: Math.round(totalMonthly), data: subs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const sub = await Subscription.create({ ...req.body, user: req.user.id });
    res.status(201).json({ success: true, data: sub });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const sub = await Subscription.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!sub) return res.status(404).json({ message: 'Subscription not found' });
    res.json({ success: true, data: sub });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const sub = await Subscription.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    if (!sub) return res.status(404).json({ message: 'Subscription not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};