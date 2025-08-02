# Simplified Image Upload System

## Why Multer is Still Necessary
Multer is required because:
- Express.js **cannot** parse `multipart/form-data` by default
- File uploads from HTML forms use `multipart/form-data` encoding
- Without Multer, `req.file` would be `undefined`

## Simplified Flow

### 1. Frontend sends image with field name "image"
```javascript
const formData = new FormData();
formData.append('name', 'Partner Name');
formData.append('website', 'https://example.com');
formData.append('image', fileInput.files[0]); // Always use "image" field name
```

### 2. Backend middleware processes the upload
```javascript
// Route
router.post('/', handleImageUpload('image'), createPartner);

// Middleware automatically:
// 1. Multer parses the file from 'image' field
// 2. Uploads to Cloudinary
// 3. Attaches result to req.cloudinaryResult
```

### 3. Controller saves the URL
```javascript
export const createPartner = async (req, res) => {
  try {
    const partnerData = { ...req.body };
    
    // If image was uploaded, save Cloudinary URL to 'logo' field in database
    if (req.cloudinaryResult) {
      partnerData.logo = req.cloudinaryResult.url;
    }
    
    const partner = new Partner(partnerData);
    const savedPartner = await partner.save();
    res.status(201).json(savedPartner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
```

## Update Without Changing Image

### Option 1: Don't send image field (Recommended)
```javascript
// Frontend - Update without image
const formData = new FormData();
formData.append('name', 'Updated Partner Name');
formData.append('website', 'https://newwebsite.com');
// Don't append 'image' field

fetch('/api/partners/123', {
  method: 'PUT',
  body: formData
});
```

### Option 2: Send existing URL (Will be ignored)
```javascript
// Frontend - Send existing URL
const formData = new FormData();
formData.append('name', 'Updated Partner Name');
formData.append('image', 'https://res.cloudinary.com/existing-url.jpg'); // Ignored by multer

fetch('/api/partners/123', {
  method: 'PUT',
  body: formData
});
```

**Result**: In both cases, since no actual file is sent in the 'image' field, `req.file` will be undefined, `req.cloudinaryResult` will be undefined, and the existing logo URL in the database won't be changed.

## Field Mapping
| Frontend Field | Database Field | Entity |
|----------------|----------------|---------|
| `image` | `image` | Team Member |
| `image` | `coverImage` | Blog Post |
| `image` | `image` | Project |
| `image` | `image` | Founder |
| `image` | `bannerImage` | Product |
| `image` | `logo` | Partner |

## Why This Approach is Simple
1. **Consistent frontend**: Always use "image" field name
2. **No file handling**: Multer handles all file parsing
3. **Automatic upload**: Cloudinary upload happens automatically
4. **Graceful updates**: No image = no change to existing image
5. **Easy cleanup**: Images deleted when entities are removed
