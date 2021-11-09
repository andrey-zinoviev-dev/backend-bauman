const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderContent: {
    type: String,
    required: true
  },
  orderTime: {
    type: Object,
    required: true
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