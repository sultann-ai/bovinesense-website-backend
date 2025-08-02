import BlogPost from '../models/BlogPost.js';
import { deleteFromCloudinary } from '../middleware/imageUpload.js';

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
    const blogPostData = { ...req.body };
    
    // If cover image was uploaded, add the Cloudinary URL to the data
    if (req.cloudinaryResult) {
      blogPostData.coverImage = req.cloudinaryResult.url;
    }
    
    const blogPost = new BlogPost(blogPostData);
    const savedBlogPost = await blogPost.save();
    res.status(201).json(savedBlogPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update blog post
export const updateBlogPost = async (req, res) => {
  try {
    const blogPostData = { ...req.body };
    
    // If cover image was uploaded, add the Cloudinary URL to the data
    if (req.cloudinaryResult) {
      blogPostData.coverImage = req.cloudinaryResult.url;
    }
    
    const blogPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      blogPostData,
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
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    // If blog post has a cover image, extract public ID and delete from Cloudinary
    if (blogPost.coverImage) {
      try {
        // Extract public ID from Cloudinary URL
        const urlParts = blogPost.coverImage.split('/');
        const publicIdWithExt = urlParts[urlParts.length - 1];
        const publicId = `zyninlabs/${publicIdWithExt.split('.')[0]}`;
        await deleteFromCloudinary(publicId);
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary:', cloudinaryError);
        // Continue with deletion even if Cloudinary deletion fails
      }
    }
    
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
