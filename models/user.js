import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3
  },
  password: {
    type: String,
    required: true
  },
  accountType: {
    type: String,
    required: true
  },
  name: String,
  email: String,
  pronouns: String,
  profilePicture: String,
  cohort: String,
})

export default mongoose.model('User', schema)