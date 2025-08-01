import BlogPost from '../models/BlogPost.js';

// Get all blog posts
export const getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(blogPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get blog post by ID
export const getBlogPostById = async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(blogPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get blog post by slug
export const getBlogPostBySlug = async (req, res) => {
  try {
    const blogPost = await BlogPost.findOne({ slug: req.params.slug });
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(blogPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create blog post
export const createBlogPost = async (req, res) => {
  try {
    const blogPost = new BlogPost(req.body);
    const savedBlogPost = await blogPost.save();
    res.status(201).json(savedBlogPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update blog post
export const updateBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(blogPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete blog post
export const deleteBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
