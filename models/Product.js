import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  fullDescription: {
    type: String,
    required: true
  },
  bannerImage: {
    type: String,
    required: true
  },
  features: [{
    type: String,
    trim: true
  }],
  screenshots: [{
    type: String
  }],
  githubLink: {
    type: String,
    default: ''
  },
  liveLink: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model('Product', productSchema);