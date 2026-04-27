import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import packRoutes from './routes/packs.js';
import productRoutes from './routes/products.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
await connectDB();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/packs', packRoutes);
app.use('/api/products', productRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'StudyBox AI Backend API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      generatePack: 'POST /api/packs/generate',
      getPacks: 'GET /api/packs',
      getPack: 'GET /api/packs/:id',
      getProducts: 'GET /api/products',
      getProduct: 'GET /api/products/:id',
      createProduct: 'POST /api/products',
      updateProduct: 'PATCH /api/products/:id',
      deleteProduct: 'DELETE /api/products/:id',
    },
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║     StudyBox AI Backend Server         ║
║     Started on port ${PORT}                ║
╚════════════════════════════════════════╝

📍 API: http://localhost:${PORT}
📚 Health: http://localhost:${PORT}/api/health
🎓 Generate Pack: POST http://localhost:${PORT}/api/packs/generate
  `);
});
