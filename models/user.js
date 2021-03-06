const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    validate: {
      validator (value){
        return /[a-zA-Z0-9_-]+\@\w+\.\w+/.test(value);
      },
      message: (link) => {
        `${link.value} не подходит под формат почты`;
      },
      required: [true, 'Необходима почта'],
    }
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  ordersList: {
    type: Array,
    minlength: 0,
  }
})

module.exports = mongoose.model('User', userSchema);