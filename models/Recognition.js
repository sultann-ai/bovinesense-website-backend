import mongoose from 'mongoose';

const recognitionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  section: {
    type: String,
    enum: ['trusted', 'recognitions'],
    default: 'trusted'
  },
  website: {
    type: String,
    default: '',
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Recognition', recognitionSchema);
