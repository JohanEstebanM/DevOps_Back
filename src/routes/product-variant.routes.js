const express = require('express');
const router = express.Router();
const productVariantController = require('../controllers/product-variant.controller');

router.post('/', productVariantController.create);
router.get('/', productVariantController.getAll);
router.get('/:id', productVariantController.getById);
router.get('/product/:product_id', productVariantController.getByProductId);
router.put('/:id', productVariantController.update);
router.delete('/:id', productVariantController.delete);
router.get('/:id/stock', productVariantController.getByIdWithStock);
router.get('/warehouses/:warehouse_id', productVariantController.getByWarehouse);

module.exports = router;