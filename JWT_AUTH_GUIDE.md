# JWT Authentication Implementation

## Overview
The admin authentication system has been upgraded from a simple hardcoded password check to a robust JWT (JSON Web Token) based authentication system with proper user management.

## New Features

### 1. Admin Model (`models/Admin.js`)
- **Fields:**
  - `username`: Unique username for login
  - `email`: Unique email address
  - `password`: Hashed password (automatically encrypted before saving)
  - `role`: Admin role (`admin` or `super-admin`)
  - `isActive`: Account status flag
  - `lastLogin`: Timestamp of last successful login
  - `timestamps`: Auto-generated `createdAt` and `updatedAt` fields

- **Methods:**
  - `comparePassword()`: Compare plain text password with hashed password
  - `updateLastLogin()`: Update the last login timestamp

### 2. JWT Authentication Middleware (`middleware/auth.js`)
- **`verifyToken`**: Middleware to verify JWT tokens and authenticate requests
- **`requireSuperAdmin`**: Additional middleware to check for super-admin privileges

### 3. Enhanced Admin Controller (`controllers/admin.controller.js`)
- **`adminLogin`**: Authenticate with username/email and password, returns JWT token
- **`getAdminProfile`**: Get authenticated admin's profile information
- **`changePassword`**: Allow authenticated admin to change their password
- **`adminLogout`**: Logout endpoint (token should be removed client-side)

### 4. Updated Admin Routes (`routes/admin.routes.js`)
- **Public routes:**
  - `POST /admin/login` - Admin login
- **Protected routes (require authentication):**
  - `GET /admin/profile` - Get admin profile
  - `POST /admin/logout` - Logout
  - `PUT /admin/change-password` - Change password

## Environment Variables Required

Add these to your `.env` file:

```env
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters
JWT_EXPIRES_IN=24h
INITIAL_ADMIN_PASSWORD=your_secure_admin_password
```

## API Usage Examples

### 1. Admin Login
```bash
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "your_password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "username": "admin",
    "email": "admin@bovinesense.com",
    "role": "super-admin",
    "lastLogin": "2025-08-01T10:30:00.000Z"
  }
}
```

### 2. Authenticated Requests
Include the JWT token in the Authorization header:

```bash
GET /api/admin/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Protected Routes
The following routes now require authentication:

**Blog Management:**
- `POST /api/blog` - Create blog post
- `PUT /api/blog/:id` - Update blog post
- `DELETE /api/blog/:id` - Delete blog post

**Product Management:**
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

**Contact Management:**
- `GET /api/contact` - Get all contacts (admin only)
- `DELETE /api/contact/:id` - Delete contact

## Setup Instructions

### 1. Create Initial Admin User
Run the following command to create the initial admin user:

```bash
npm run create-admin
```

This will create a super-admin user with:
- Username: `admin`
- Email: `admin@bovinesense.com`
- Password: Set via `INITIAL_ADMIN_PASSWORD` env variable or defaults to `admin123`

### 2. Security Considerations

**JWT Secret:**
- Use a strong, random JWT secret (minimum 32 characters)
- Never commit the JWT secret to version control
- Store it securely in environment variables

**Password Security:**
- Passwords are automatically hashed using bcrypt with salt rounds
- Minimum password length is enforced (6 characters)
- Always validate current password before allowing changes

**Token Expiration:**
- Tokens have a default expiration of 24 hours
- Adjust `JWT_EXPIRES_IN` environment variable as needed
- Implement token refresh mechanism if longer sessions are required

### 3. Frontend Integration

**Login Flow:**
1. Send POST request to `/api/admin/login` with credentials
2. Store the returned JWT token securely (localStorage, httpOnly cookies, etc.)
3. Include token in Authorization header for all subsequent requests

**Token Management:**
```javascript
// Store token after login
localStorage.setItem('adminToken', response.data.token);

// Include in API requests
const token = localStorage.getItem('adminToken');
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Handle token expiration
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);
```

## Migration from Old System

The old hardcoded password system has been completely replaced. To migrate:

1. Run `npm run create-admin` to create the initial admin user
2. Update your frontend to use the new login endpoint
3. Implement JWT token storage and header management
4. Update admin dashboard to handle authentication states

## Error Handling

The system returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common error codes:
- `400`: Bad Request (missing/invalid input)
- `401`: Unauthorized (invalid/expired token, wrong credentials)
- `403`: Forbidden (insufficient privileges)
- `500`: Server Error

## Testing

You can test the authentication system using tools like Postman or curl:

```bash
# Login
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test protected route
curl -X GET http://localhost:5000/api/admin/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
