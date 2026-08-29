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

const handleUploadErrors = (uploadMiddleware) => (req, res, next) => {
  uploadMiddleware(req, res, (error) => {
    if (error) {
      const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
      return res.status(status).json({
        success: false,
        message: error.message || 'Invalid image upload'
      });
    }
    next();
  });
};

// Middleware to upload image to Cloudinary
const uploadToCloudinary = async (req, res, next) => {
  try {
    // If no file is uploaded, continue to next middleware
    if (!req.file) {
      return next();
    }

    console.log('Cloudinary config check:', {
      cloud_name: cloudinary.config().cloud_name,
      api_key: cloudinary.config().api_key,
      api_secret: cloudinary.config().api_secret ? 'exists' : 'missing'
    });

    const { cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret } = cloudinary.config();
    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(503).json({
        success: false,
        message: 'Image uploads are not configured. Add Cloudinary credentials to the backend .env file.'
      });
    }

    // Use the configured API credentials so uploads do not depend on an
    // unsigned upload preset existing in the Cloudinary account.
    const uploadOptions = {
      folder: 'bovinesense'
    };

    console.log('Upload options:', uploadOptions);

    // Upload using buffer stream
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('Cloudinary stream error:', error);
            reject(error);
          } else {
            console.log('Cloudinary upload success:', result.public_id);
            resolve(result);
          }
        }
      ).end(req.file.buffer);
    });

    // Attach the Cloudinary result to the request object
    req.cloudinaryResult = {
      url: result.secure_url,
      publicId: result.public_id
    };

    next();
  } catch (error) {
    console.error('Cloudinary upload error:', error);
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
    handleUploadErrors(upload.single(fieldName)),
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
          const uploadOptions = { folder: 'bovinesense' };

          return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              uploadOptions,
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve({
                    url: result.secure_url,
                    publicId: result.public_id
                  });
                }
              }
            ).end(file.buffer);
          });
        });

        const cloudinaryResults = await Promise.all(uploadPromises);
        req.cloudinaryResults = cloudinaryResults;

        next();
      } catch (error) {
        console.error('Multiple images upload error:', error);
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
        const uploadOptions = { folder: 'bovinesense' };

        // Handle single banner image
        if (req.files['image'] && req.files['image'][0]) {
          const file = req.files['image'][0];
          
          const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              uploadOptions,
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            ).end(file.buffer);
          });

          req.cloudinaryResult = {
            url: result.secure_url,
            publicId: result.public_id
          };
        }

        // Handle multiple screenshots
        if (req.files['screenshots'] && req.files['screenshots'].length > 0) {
          const uploadPromises = req.files['screenshots'].map(async (file) => {
            return new Promise((resolve, reject) => {
              cloudinary.uploader.upload_stream(
                uploadOptions,
                (error, result) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve({
                      url: result.secure_url,
                      publicId: result.public_id
                    });
                  }
                }
              ).end(file.buffer);
            });
          });

          const cloudinaryResults = await Promise.all(uploadPromises);
          req.cloudinaryResults = cloudinaryResults;
        }

        next();
      } catch (error) {
        console.error('Mixed images upload error:', error);
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
