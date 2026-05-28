const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  currency: { 
    type: String, 
    default: 'INR' 
  },
  category: {
    type: String,
    enum: ['streaming', 'music', 'software', 'gaming', 'news', 'other'],
    default: 'other'
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly', 'weekly'],
    default: 'monthly'
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'paused'],
    default: 'active'
  },
  nextBillingDate: { 
    type: Date, 
    required: true 
  },
  reminder: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', SubscriptionSchema);