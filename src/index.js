const express = require ('express')
const path = require('path')
const cors = require('cors')
const {serverConfig, logger} = require ('./config')
const {connectToDatabase} = require('./config/db')
const apiRoutes = require ('./routes')
const { errorHandler } = require('./middlewares/error-handler')
const app = express();

// CORS configuration (allow all origins in development, keep credentials and headers)
const corsOptions = {
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl) or any origin in dev
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Middleware for parsing JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded bodies

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('/api',apiRoutes);

// 404 handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found', data: null });
});

// Centralized error handler (ensure it's the last middleware)
app.use(errorHandler);

// Initialize database connection and start server
async function startServer() {
  try {
    await connectToDatabase();
    // Ensure Sequelize models are synced (create tables if they don't exist)
    try {
      const db = require('./models');
      await db.sequelize.sync();
      console.log('[DB] Models synchronized successfully.');
    } catch (syncErr) {
      console.error('[DB] Failed to sync models:', syncErr.message);
      // Do not exit; continue to start server to surface errors per-request
    }
    app.listen(serverConfig.PORT, () => {
      console.log(`Connected to PORT : ${serverConfig.PORT} Successfully`);
      //logger.info(`Server running on PORT: ${serverConfig.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();