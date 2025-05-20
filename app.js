require('dotenv').config();
require('reflect-metadata');
const express = require('express');
const cors = require('cors');
const AppDataSource = require('./src/config/data-source');
const authRoutes = require('./src/routes/auth.routes');
const categoryRoutes = require('./src/routes/category.routes');
const warehouseRoutes = require('./src/routes/warehouse.routes');
const productRoutes = require('./src/routes/product.routes');
const productVariantRoutes = require('./src/routes/product-variant.routes');
const inventoryRoutes = require('./src/routes/inventory.routes');
const stockRoutes = require('./src/routes/stock.routes');

const app = express();

// Configuración CORS
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/products', productRoutes);
app.use('/api/product-variants', productVariantRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/stock', stockRoutes);

// Inicialización
AppDataSource.initialize()
  .then(async () => {
    console.log('Database connected');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Database connection failed', error);
    process.exit(1);
  });

module.exports = app;