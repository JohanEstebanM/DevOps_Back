require('dotenv').config();
require('reflect-metadata');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const AppDataSource  = require('./src/config/data-source');
const logger = require('./src/config/logger');

// Importación de rutas
const authRoutes = require('./src/routes/auth.routes');
const categoryRoutes = require('./src/routes/category.routes');
const warehouseRoutes = require('./src/routes/warehouse.routes');
const productRoutes = require('./src/routes/product.routes');
const productVariantRoutes = require('./src/routes/product-variant.routes');
const inventoryRoutes = require('./src/routes/inventory.routes');
const stockRoutes = require('./src/routes/stock.routes');
const errorHandler = require('./src/middlewares/errorHandler');
const notFoundHandler = require('./src/middlewares/notFoundHandler');

class App {
  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.port = process.env.PORT || 3000;
    this.env = process.env.NODE_ENV || 'development';

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  async initializeDatabase() {
    try {
      await AppDataSource.initialize();
      logger.info('🟢 Database connected');

      if (this.env === 'development') {
        await AppDataSource.synchronize();
        logger.warn('🟡 Database synchronized - Solo para desarrollo!');
      }
    } catch (error) {
      logger.error('🔴 Database connection failed', error);
      process.exit(1);
    }
  }

  initializeMiddlewares() {
    // Seguridad
    this.app.use(helmet());
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: true
    }));

    // Logging
    if (this.env !== 'test') {
      this.app.use(morgan(this.env === 'development' ? 'dev' : 'combined', { 
        stream: { write: (message) => logger.info(message.trim()) } 
      }));
    }

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 200, // Límite por IP
      standardHeaders: true,
      legacyHeaders: false,
      message: 'Demasiadas solicitudes desde esta IP'
    });
    this.app.use(limiter);

    // Body parsers
    this.app.use(express.json({ limit: '10kb' }));
    this.app.use(express.urlencoded({ extended: true }));
  }

  initializeRoutes() {
    // API Routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/categories', categoryRoutes);
    this.app.use('/api/warehouses', warehouseRoutes);
    this.app.use('/api/products', productRoutes);
    this.app.use('/api/product-variants', productVariantRoutes);
    this.app.use('/api/inventory', inventoryRoutes);
    this.app.use('/api/stock', stockRoutes);

    // Health Check
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        message: 'API is running',
        timestamp: new Date().toISOString(),
        environment: this.env
      });
    });
  }

  initializeErrorHandling() {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  async start() {
    if (this.env !== 'test') {
      await this.initializeDatabase();
    }

    this.server.listen(this.port, () => {
      logger.info(`🚀 Server running on port ${this.port} | Environment: ${this.env}`);
    });

    process.on('SIGTERM', this.shutdown.bind(this));
    process.on('SIGINT', this.shutdown.bind(this));
  }

  async shutdown() {
    logger.info('🛑 Shutting down server...');
    this.server.close(async () => {
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
        logger.info('🔴 Database connection closed');
      }
      logger.info('🛑 Server stopped');
      process.exit(0);
    });
  }

  getServer() {
    return this.app;
  }
}

// Modo de ejecución
if (require.main === module) {
  const application = new App();
  application.start();
}

// Exportación para testing
module.exports = new App().getServer();