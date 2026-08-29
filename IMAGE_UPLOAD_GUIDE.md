# Image Upload Implementation Guide

## Overview
The image upload functionality has been refactored to use a reusable middleware approach with Multer and Cloudinary integration. This eliminates the need for a separate upload route and provides a more streamlined way to handle image uploads across different entities.

## Features
- **Automatic image validation**: Only image files are allowed
- **Size limits**: 5MB maximum file size
- **Cloudinary integration**: Automatic upload to Cloudinary with optimization
- **Automatic cleanup**: Images are deleted from Cloudinary when entities are removed
- **Flexible field names**: Support for different image field names across models

## Middleware Functions

### `handleImageUpload(fieldName)`
Handles single image upload for a specific field.

**Parameters:**
- `fieldName` (string): The name of the form field containing the image (default: 'image')

**Returns:** Array of middleware functions for multer upload and Cloudinary processing

### `handleMultipleImageUpload(fieldName, maxCount)`
Handles multiple image uploads for a specific field.

**Parameters:**
- `fieldName` (string): The name of the form field containing the images (default: 'images')
- `maxCount` (number): Maximum number of images allowed (default: 5)

**Returns:** Array of middleware functions for multer upload and Cloudinary processing

### `deleteFromCloudinary(publicId)`
Helper function to delete images from Cloudinary.

**Parameters:**
- `publicId` (string): The Cloudinary public ID of the image to delete

## Usage Examples

### In Routes
```javascript
import { handleImageUpload } from '../middleware/imageUpload.js';

// Single image upload
router.post('/', handleImageUpload('image'), createTeamMember);
router.put('/:id', handleImageUpload('coverImage'), updateBlogPost);

// Multiple images upload
router.post('/', handleMultipleImageUpload('gallery', 10), createProject);
```

### In Controllers
```javascript
// For single image
export const createEntity = async (req, res) => {
  try {
    const entityData = { ...req.body };
    
    // Check if image was uploaded
    if (req.cloudinaryResult) {
      entityData.image = req.cloudinaryResult.url;
    }
    
    const entity = new Entity(entityData);
    const savedEntity = await entity.save();
    res.status(201).json(savedEntity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// For multiple images
export const createEntityWithGallery = async (req, res) => {
  try {
    const entityData = { ...req.body };
    
    // Check if images were uploaded
    if (req.cloudinaryResults) {
      entityData.gallery = req.cloudinaryResults.map(result => result.url);
    }
    
    const entity = new Entity(entityData);
    const savedEntity = await entity.save();
    res.status(201).json(savedEntity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
```

### Frontend Form Submission
```javascript
// Create FormData object
const formData = new FormData();
formData.append('name', 'John Doe');
formData.append('title', 'Developer');
formData.append('image', imageFile); // File from input

// Submit to API
fetch('/api/team', {
  method: 'POST',
  body: formData
});
```

## Implementation Status

The following entities have been updated to use the new image upload middleware:

### ✅ Completed
- **Team Members** (`/api/team`)
  - Field: `image`
  - Routes: POST, PUT with image upload support
  
- **Blog Posts** (`/api/blog`)
  - Field: `coverImage`
  - Routes: POST, PUT with image upload support (requires authentication)
  
- **Projects** (`/api/projects`)
  - Field: `image`
  - Routes: POST, PUT with image upload support
  
- **Founders** (`/api/founders`)
  - Field: `image`
  - Routes: POST, PUT with image upload support
  
- **Products** (`/api/products`)
  - Field: `bannerImage`
  - Routes: POST, PUT with image upload support (requires authentication)

### 🗑️ Removed
- Upload controller (`controllers/upload.controller.js`)
- Upload routes (`routes/upload.routes.js`)
- Upload route registration in `server.js`

## Configuration

### Cloudinary Settings
The middleware uses the following Cloudinary configuration:
- **Folder**: `bovinesense`
- **Transformation**: Limited to 1200x800px with auto quality
- **Format**: Auto-optimized based on content

### File Restrictions
- **Allowed types**: Images only (checked via MIME type)
- **Size limit**: 5MB maximum
- **Storage**: Memory storage (files are not saved to disk)

## Error Handling
- Invalid file types return a 400 error
- File size exceeded returns a 413 error
- Cloudinary upload failures return a 500 error
- Missing files are handled gracefully (operation continues without image)

## Security Features
- File type validation based on MIME type
- Size limits to prevent abuse
- Memory storage prevents disk space issues
- Automatic cleanup on entity deletion
