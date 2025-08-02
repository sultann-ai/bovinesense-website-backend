import Product from '../models/Product.js';
import { deleteFromCloudinary } from '../middleware/imageUpload.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by slug
export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create product
export const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    
    // If banner image was uploaded, add the Cloudinary URL to the data
    if (req.cloudinaryResult) {
      productData.bannerImage = req.cloudinaryResult.url;
    }
    
    // If screenshots were uploaded, add the Cloudinary URLs to the data
    if (req.cloudinaryResults) {
      productData.screenshots = req.cloudinaryResults.map(result => result.url);
    }
    
    const product = new Product(productData);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const productData = { ...req.body };
    
    // If banner image was uploaded, add the Cloudinary URL to the data
    if (req.cloudinaryResult) {
      productData.bannerImage = req.cloudinaryResult.url;
    }
    
    // If screenshots were uploaded, append them to existing screenshots
    if (req.cloudinaryResults && req.cloudinaryResults.length > 0) {
      const newScreenshotUrls = req.cloudinaryResults.map(result => result.url);
      
      // Append new screenshots to existing array (don't replace)
      productData.screenshots = [...(product.screenshots || []), ...newScreenshotUrls];
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true, runValidators: true }
    );
    
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // If product has a banner image, extract public ID and delete from Cloudinary
    if (product.bannerImage) {
      try {
        // Extract public ID from Cloudinary URL
        const urlParts = product.bannerImage.split('/');
        const publicIdWithExt = urlParts[urlParts.length - 1];
        const publicId = `zyninlabs/${publicIdWithExt.split('.')[0]}`;
        await deleteFromCloudinary(publicId);
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary:', cloudinaryError);
        // Continue with deletion even if Cloudinary deletion fails
      }
    }
    
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product screenshots only
export const getProductScreenshots = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id, 'screenshots');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ screenshots: product.screenshots || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add screenshots to existing product
export const addProductScreenshots = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // If new screenshots were uploaded, add them to existing ones
    if (req.cloudinaryResults && req.cloudinaryResults.length > 0) {
      const newScreenshotUrls = req.cloudinaryResults.map(result => result.url);
      
      // Add new screenshots to existing array
      product.screenshots = [...(product.screenshots || []), ...newScreenshotUrls];
      
      await product.save();
      
      res.json({ 
        message: `Added ${newScreenshotUrls.length} screenshots`,
        added: newScreenshotUrls,
        total: product.screenshots.length,
        screenshots: product.screenshots
      });
    } else {
      res.status(400).json({ message: 'No screenshot files provided' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove specific screenshot by index
export const removeProductScreenshot = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const index = parseInt(req.params.index);
    if (isNaN(index) || index < 0 || index >= product.screenshots.length) {
      return res.status(400).json({ message: 'Invalid screenshot index' });
    }

    const removedUrl = product.screenshots[index];
    
    // Remove screenshot from array
    product.screenshots.splice(index, 1);
    
    // Optional: Delete from Cloudinary
    try {
      if (removedUrl) {
        const urlParts = removedUrl.split('/');
        const publicIdWithExt = urlParts[urlParts.length - 1];
        const publicId = `zyninlabs/${publicIdWithExt.split('.')[0]}`;
        await deleteFromCloudinary(publicId);
      }
    } catch (cloudinaryError) {
      console.error('Error deleting screenshot from Cloudinary:', cloudinaryError);
      // Continue even if Cloudinary deletion fails
    }
    
    await product.save();
    
    res.json({ 
      message: 'Screenshot removed successfully',
      removed: removedUrl,
      remainingCount: product.screenshots.length,
      screenshots: product.screenshots
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
