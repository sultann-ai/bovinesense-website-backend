import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';

// Load environment variables
dotenv.config();

const createInitialAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bovinesense');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create initial admin user
    const admin = new Admin({
      username: 'admin',
      email: 'admin@bovinesense.com',
      password: process.env.INITIAL_ADMIN_PASSWORD || 'admin123',
      role: 'super-admin'
    });

    await admin.save();
    console.log('Initial admin user created successfully');
    console.log(`Username: ${admin.username}`);
    console.log(`Email: ${admin.email}`);
    console.log('Password: Set via INITIAL_ADMIN_PASSWORD env variable or default "admin123"');

  } catch (error) {
    console.error('Error creating initial admin:', error);
  } finally {
    // Close database connection
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
};

// Run the script
createInitialAdmin();
