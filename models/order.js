const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderContent: {
    type: Array,
    required: true,
    default: [],
  },
  orderTime: {
    type: Object,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'pending',
  }
});

module.exports = mongoose.model('Order', orderSchema);