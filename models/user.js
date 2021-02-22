const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      default: 'Username',
    },
    name: String,
    images: {
      type: Array,
      default: {
        url: 'https://via.placeholder.com/300x300.png?text=User%20image',
        public_id: Date.now(),
      },
    },
    about: {
      type: String,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
