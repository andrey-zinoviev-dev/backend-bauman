const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: URL,
    required: true,
  },
  assortment: {
    type: Array
  },
});

module.exports = mongoose.model('Service', serviceSchema);