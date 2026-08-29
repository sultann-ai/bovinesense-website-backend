import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

// Import routes
import foundersRoutes from './routes/founders.routes.js';
import teamRoutes from './routes/team.routes.js';
import servicesRoutes from './routes/services.routes.js';
import partnersRoutes from './routes/partners.routes.js';
import projectsRoutes from './routes/projects.routes.js';
import productsRoutes from './routes/products.routes.js';
import blogRoutes from './routes/blog.routes.js';
import contactRoutes from './routes/contact.routes.js';
import adminRoutes from './routes/admin.routes.js';
import recognitionsRoutes from './routes/recognitions.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// CORS configuration with whitelisted URLs
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://bovinesense.com',
    'https://www.bovinesense.com',
    'https://bovinesense.vercel.app',
    'https://www.bovinesense.vercel.app',
    'https://bovinehq.com',
    'https://www.bovinehq.com',
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//log the requests path and method
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.path}`);
  next();
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bovinesense')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/founders', foundersRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/partners', partnersRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recognitions', recognitionsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});