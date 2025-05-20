const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stock.controller');

// Esta es la ruta para hacer un movimiento de stock
router.post('/transfer', stockController.transferStock);

// Puedes tener otras rutas como:
router.get('/variant/:variant_id', stockController.getStockByVariant);
router.get('/warehouse/:warehouse_id', stockController.getStockByWarehouse);
router.post('/add', stockController.addStock);

module.exports = router;
