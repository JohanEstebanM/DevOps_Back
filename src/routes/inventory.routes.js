const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stock.controller');
const movementController = require('../controllers/movement.controller');

// Stock routes
router.get('/variants/:variant_id/stock', stockController.getStockByVariant);
router.get('/warehouses/:warehouse_id/stock', stockController.getStockByWarehouse);
router.post('/stock/transfer', stockController.transferStock);

// Movement routes
router.get('/variants/:variant_id/movements', movementController.getByVariant);
router.get('/warehouses/:warehouse_id/movements', movementController.getByWarehouse);

module.exports = router;