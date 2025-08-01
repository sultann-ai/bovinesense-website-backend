import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    trim: true
  },
  services: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    features: [{
      type: String,
      trim: true
    }]
  }]
}, {
  timestamps: true
});

export default mongoose.model('Service', serviceSchema);