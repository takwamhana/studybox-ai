import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import connectDB, { isDatabaseConnected } from './config/database.js';
import packRoutes from './routes/packs.js';
import generateRoutes from './routes/generate.js';
import productRoutes from './routes/products.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Validate environment variables
if (!process.env.JWT_SECRET) {
  console.error('⚠️  JWT_SECRET not set in environment variables');
  process.exit(1);
}

// Connect to MongoDB
await connectDB();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:8080',
        'http://localhost:8082',
        'http://localhost:3000',
        process.env.FRONTEND_URL,
      ].filter(Boolean);

      const isLocalhostDevOrigin = typeof origin === 'string' && /^http:\/\/localhost:\d+$/.test(origin);

      if (!origin || allowedOrigins.includes(origin) || isLocalhostDevOrigin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: isDatabaseConnected() ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Return a clear error instead of hanging/crashing when DB is down
app.use('/api', (req, res, next) => {
  if (req.path === '/health') {
    return next();
  }

  if (!isDatabaseConnected()) {
    return res.status(503).json({
      error: 'Database unavailable',
      message: 'Cannot process requests while MongoDB is disconnected',
    });
  }

  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/generate-pack', generateRoutes);
app.use('/api/packs', packRoutes);
app.use('/api/products', productRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'StudyBox AI Backend API',
    version: '2.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        refresh: 'POST /api/auth/refresh',
        me: 'GET /api/auth/me (protected)',
      },
      users: {
        profile: 'GET /api/users/:id (protected)',
        updateProfile: 'PATCH /api/users/:id (protected)',
        changePassword: 'PATCH /api/users/:id/password (protected)',
        badges: 'GET /api/users/:id/badges (protected)',
        statistics: 'GET /api/users/:id/statistics (protected)',
      },
      packs: {
        generate: 'POST /api/packs/generate (protected)',
        userPacks: 'GET /api/packs/user (protected)',
        savePack: 'POST /api/packs/:id/save (protected)',
        allPacks: 'GET /api/packs',
        getPack: 'GET /api/packs/:id',
      },
      products: {
        getProducts: 'GET /api/products',
        getProduct: 'GET /api/products/:id',
        createProduct: 'POST /api/products',
        updateProduct: 'PATCH /api/products/:id',
        deleteProduct: 'DELETE /api/products/:id',
      },
      health: 'GET /api/health',
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
