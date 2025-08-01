import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  liveDemoLink: {
    type: String,
    default: ''
  },
  githubLink: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    required: true
  },
  screenshots: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true
  }],
  features: [{
    type: String,
    trim: true
  }],
  technologies: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    enum: ['Web Development', 'Mobile Development', 'AI/ML', 'Data Science', 'DevOps', 'Other'],
    default: 'Other'
  }
}, {
  timestamps: true
});

// Add indexes for better performance
projectSchema.index({ title: 'text', description: 'text', tags: 'text' });
projectSchema.index({ category: 1 });
projectSchema.index({ createdAt: -1 });

export default mongoose.model('Project', projectSchema);
