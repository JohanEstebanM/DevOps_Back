const AppDataSource = require('../config/data-source');

class WarehouseController {
  async create(req, res) {
    try {
      const { name, phone, email, location, max_capacity, open_hours, coordinates } = req.body;
      
      const warehouseRepository = AppDataSource.getRepository("Warehouse");
      const newWarehouse = warehouseRepository.create({
        name,
        phone,
        email,
        location,
        max_capacity,
        open_hours,
        coordinates
      });
      
      const savedWarehouse = await warehouseRepository.save(newWarehouse);
      res.status(201).json(savedWarehouse);
    } catch (error) {
      if (error.code === '23505') { // Violación de unique constraint
        res.status(400).json({ error: "El email de la bodega ya está registrado" });
      } else {
        console.error(error);
        res.status(500).json({ error: "Error al crear la bodega" });
      }
    }
  }

  async getAll(req, res) {
    try {
      const warehouseRepository = AppDataSource.getRepository("Warehouse");
      const warehouses = await warehouseRepository.find();
      res.json(warehouses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener las bodegas" });
    }
  }

  async getById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const warehouseRepository = AppDataSource.getRepository("Warehouse");
      const warehouse = await warehouseRepository.findOneBy({ id });
      
      if (!warehouse) {
        return res.status(404).json({ error: "Bodega no encontrada" });
      }
      
      res.json(warehouse);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener la bodega" });
    }
  }

  async update(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { name, phone, email, location, max_capacity, open_hours, coordinates } = req.body;
      
      const warehouseRepository = AppDataSource.getRepository("Warehouse");
      const warehouse = await warehouseRepository.findOneBy({ id });
      
      if (!warehouse) {
        return res.status(404).json({ error: "Bodega no encontrada" });
      }
      
      warehouseRepository.merge(warehouse, {
        name,
        phone,
        email,
        location,
        max_capacity,
        open_hours,
        coordinates
      });
      
      const updatedWarehouse = await warehouseRepository.save(warehouse);
      res.json(updatedWarehouse);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al actualizar la bodega" });
    }
  }

  async delete(req, res) {
    try {
      const id = parseInt(req.params.id);
      const warehouseRepository = AppDataSource.getRepository("Warehouse");
      const result = await warehouseRepository.delete(id);
      
      if (result.affected === 0) {
        return res.status(404).json({ error: "Bodega no encontrada" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al eliminar la bodega" });
    }
  }
}

module.exports = new WarehouseController();