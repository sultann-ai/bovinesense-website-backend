import mongoose from 'mongoose';

const founderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  linkedin: {
    type: String,
    default: ''
  },
  twitter: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Founder', founderSchema);