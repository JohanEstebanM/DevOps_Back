const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');
const warehouseController = require('../controllers/warehouses.controller');

// Solo administradores pueden crear, actualizar y eliminar bodegas
router.post('/', authMiddleware, roleMiddleware('administrador'), warehouseController.create);
router.get('/', warehouseController.getAll);
router.get('/:id', warehouseController.getById);
router.put('/:id', authMiddleware, roleMiddleware('administrador'), warehouseController.update);
router.delete('/:id', authMiddleware, roleMiddleware('administrador'), warehouseController.delete);

module.exports = router;