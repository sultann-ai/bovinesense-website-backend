import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
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
  image: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  linkedin: {
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

export default mongoose.model('TeamMember', teamMemberSchema);