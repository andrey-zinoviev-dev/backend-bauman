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
  },
  name: {
    type: String,
    minlength: 3,
    required: true,
  }
})

module.exports = mongoose.model('User', userSchema);