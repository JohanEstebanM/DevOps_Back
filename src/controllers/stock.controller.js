const AppDataSource = require('../config/data-source');
const Stock = require('../entities/stock.entity');
const Movement = require('../entities/movement.entity');

class StockController {
  async getStockByVariant(req, res) {
    try {
      const variantId = parseInt(req.params.variant_id);
      if (isNaN(variantId)) return res.status(400).json({ error: "Invalid variant ID" });

      const stockRepository = AppDataSource.getRepository(Stock);
      const stock = await stockRepository.find({
        where: { product_variant_id: variantId },
        relations: ['warehouse']
      });

      res.json(stock);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching stock for variant" });
    }
  }

  async getStockByWarehouse(req, res) {
    try {
      const warehouseId = parseInt(req.params.warehouse_id);
      if (isNaN(warehouseId)) return res.status(400).json({ error: "Invalid warehouse ID" });

      const stockRepository = AppDataSource.getRepository(Stock);
      const stock = await stockRepository.find({
        where: { warehouse_id: warehouseId },
        relations: ['product_variant']
      });

      res.json(stock);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching stock for warehouse" });
    }
  }

  async transferStock(req, res) {
    const { variant_id, from_warehouse_id, to_warehouse_id, quantity, user_id, notes } = req.body;

    if (!variant_id || !from_warehouse_id || !to_warehouse_id || !quantity || quantity <= 0) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const originStock = await queryRunner.manager.findOne(Stock, {
        where: { product_variant_id: variant_id, warehouse_id: from_warehouse_id }
      });

      if (!originStock || originStock.quantity < quantity) {
        throw new Error("Insufficient stock in origin warehouse");
      }

      originStock.quantity -= quantity;
      await queryRunner.manager.save(Stock, originStock);

      let destinationStock = await queryRunner.manager.findOne(Stock, {
        where: { product_variant_id: variant_id, warehouse_id: to_warehouse_id }
      });

      if (!destinationStock) {
        // Crea objeto literal, no uses create()
        destinationStock = {
          product_variant_id: variant_id,
          warehouse_id: to_warehouse_id,
          quantity: 0
        };
      }

      destinationStock.quantity += quantity;
      await queryRunner.manager.save(Stock, destinationStock);

      // Crea objeto literal para movement, no uses create()
      const movement = {
        product_variant_id: variant_id,
        from_warehouse_id,
        to_warehouse_id,
        quantity,
        user_id,
        notes
      };

      await queryRunner.manager.save(Movement, movement);

      await queryRunner.commitTransaction();
      res.status(201).json(movement);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error);
      res.status(500).json({ error: error.message || "Error transferring stock" });
    } finally {
      await queryRunner.release();
    }
  }

  async addStock(req, res) {
    const { variant_id, warehouse_id, quantity } = req.body;

    if (!variant_id || !warehouse_id || !quantity || quantity <= 0) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const stock = await queryRunner.manager.findOne(Stock, {
        where: { product_variant_id: variant_id, warehouse_id }
      });

      if (stock) {
        stock.quantity += quantity;
        // Pasa la entidad al método save junto con el target
        await queryRunner.manager.save(Stock, stock);
      } else {
        // Crea un objeto literal simple
        const newStock = {
          product_variant_id: variant_id,
          warehouse_id,
          quantity
        };
        await queryRunner.manager.save(Stock, newStock);
      }

      await queryRunner.commitTransaction();
      res.status(201).json({ message: "Stock added successfully" });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error);
      res.status(500).json({ error: error.message || "Error adding stock" });
    } finally {
      await queryRunner.release();
    }
  }


}

module.exports = new StockController();
