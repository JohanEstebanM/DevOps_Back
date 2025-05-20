const AppDataSource = require('../config/data-source');
const Movement = require('../entities/movement.entity');

class MovementController {
  async getByVariant(req, res) {
    try {
      const variantId = parseInt(req.params.variant_id);
      if (isNaN(variantId)) return res.status(400).json({ error: "Invalid variant ID" });

      const movementRepository = AppDataSource.getRepository(Movement);
      const movements = await movementRepository.find({
        where: { product_variant_id: variantId },
        relations: ['from_warehouse', 'to_warehouse', 'product_variant'],
        order: { created_at: 'DESC' }
      });

      res.json(movements);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching movements for variant" });
    }
  }

  async getByWarehouse(req, res) {
    try {
      const warehouseId = parseInt(req.params.warehouse_id);
      if (isNaN(warehouseId)) return res.status(400).json({ error: "Invalid warehouse ID" });

      const movementRepository = AppDataSource.getRepository(Movement);
      const movements = await movementRepository
        .createQueryBuilder("movement")
        .leftJoinAndSelect("movement.from_warehouse", "from_warehouse")
        .leftJoinAndSelect("movement.to_warehouse", "to_warehouse")
        .leftJoinAndSelect("movement.product_variant", "product_variant")
        .where("movement.from_warehouse_id = :id OR movement.to_warehouse_id = :id", { id: warehouseId })
        .orderBy("movement.created_at", "DESC")
        .getMany();

      res.json(movements);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching movements for warehouse" });
    }
  }
}

module.exports = new MovementController();
