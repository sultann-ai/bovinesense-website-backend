import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create multer upload instance
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Middleware to upload image to Cloudinary
const uploadToCloudinary = async (req, res, next) => {
  try {
    // If no file is uploaded, continue to next middleware
    if (!req.file) {
      return next();
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'zyninlabs',
      transformation: [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto' }
      ]
    });

    // Attach the Cloudinary result to the request object
    req.cloudinaryResult = {
      url: result.secure_url,
      publicId: result.public_id
    };

    next();
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Image upload failed', 
      error: error.message 
    });
  }
};

// Helper function to handle single image upload
export const handleImageUpload = (fieldName = 'image') => {
  return [
    upload.single(fieldName),
    uploadToCloudinary
  ];
};

// Helper function to handle multiple image uploads
export const handleMultipleImageUpload = (fieldName = 'images', maxCount = 5) => {
  return [
    upload.array(fieldName, maxCount),
    async (req, res, next) => {
      try {
        // If no files are uploaded, continue to next middleware
        if (!req.files || req.files.length === 0) {
          return next();
        }

        const uploadPromises = req.files.map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = `data:${file.mimetype};base64,${b64}`;

          const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'zyninlabs',
            transformation: [
              { width: 1200, height: 800, crop: 'limit' },
              { quality: 'auto' }
            ]
          });

          return {
            url: result.secure_url,
            publicId: result.public_id
          };
        });

        const cloudinaryResults = await Promise.all(uploadPromises);
        req.cloudinaryResults = cloudinaryResults;

        next();
      } catch (error) {
        return res.status(500).json({ 
          success: false, 
          message: 'Multiple images upload failed', 
          error: error.message 
        });
      }
    }
  ];
};

// Helper function to handle mixed uploads (single + multiple)
export const handleMixedImageUpload = () => {
  return [
    upload.fields([
      { name: 'image', maxCount: 1 },      // Single banner image
      { name: 'screenshots', maxCount: 10 } // Multiple screenshots
    ]),
    async (req, res, next) => {
      try {
        // Handle single banner image
        if (req.files['image'] && req.files['image'][0]) {
          const file = req.files['image'][0];
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = `data:${file.mimetype};base64,${b64}`;

          const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'zyninlabs',
            transformation: [
              { width: 1200, height: 800, crop: 'limit' },
              { quality: 'auto' }
            ]
          });

          req.cloudinaryResult = {
            url: result.secure_url,
            publicId: result.public_id
          };
        }

        // Handle multiple screenshots
        if (req.files['screenshots'] && req.files['screenshots'].length > 0) {
          const uploadPromises = req.files['screenshots'].map(async (file) => {
            const b64 = Buffer.from(file.buffer).toString('base64');
            const dataURI = `data:${file.mimetype};base64,${b64}`;

            const result = await cloudinary.uploader.upload(dataURI, {
              folder: 'zyninlabs',
              transformation: [
                { width: 1200, height: 800, crop: 'limit' },
                { quality: 'auto' }
              ]
            });

            return {
              url: result.secure_url,
              publicId: result.public_id
            };
          });

          const cloudinaryResults = await Promise.all(uploadPromises);
          req.cloudinaryResults = cloudinaryResults;
        }

        next();
      } catch (error) {
        return res.status(500).json({ 
          success: false, 
          message: 'Mixed images upload failed', 
          error: error.message 
        });
      }
    }
  ];
};

// Helper function to delete image from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

export default {
  handleImageUpload,
  handleMultipleImageUpload,
  handleMixedImageUpload,
  deleteFromCloudinary
};
