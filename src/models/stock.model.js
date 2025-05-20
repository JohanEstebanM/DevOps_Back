const pool = require('../config/data-source');

class StockModel {
  async findByVariantAndWarehouse(variantId, warehouseId) {
    const query = 'SELECT * FROM stock WHERE product_variant_id = $1 AND warehouse_id = $2';
    const result = await pool.query(query, [variantId, warehouseId]);
    return result.rows[0];
  }

  async createOrUpdate(variantId, warehouseId, quantity) {
    // Verificar si ya existe un registro
    const existing = await this.findByVariantAndWarehouse(variantId, warehouseId);
    
    if (existing) {
      // Actualizar cantidad
      const query = 'UPDATE stock SET quantity = $1 WHERE id = $2 RETURNING *';
      const result = await pool.query(query, [quantity, existing.id]);
      return result.rows[0];
    } else {
      // Crear nuevo registro
      const query = 'INSERT INTO stock (product_variant_id, warehouse_id, quantity) VALUES ($1, $2, $3) RETURNING *';
      const result = await pool.query(query, [variantId, warehouseId, quantity]);
      return result.rows[0];
    }
  }

  async getStockByVariant(variantId) {
    const query = 'SELECT s.*, w.name as warehouse_name FROM stock s JOIN warehouses w ON s.warehouse_id = w.id WHERE product_variant_id = $1';
    const result = await pool.query(query, [variantId]);
    return result.rows;
  }

  async getStockByWarehouse(warehouseId) {
    const query = 'SELECT s.*, pv.variant_code, p.name as product_name FROM stock s JOIN product_variants pv ON s.product_variant_id = pv.id JOIN products p ON pv.product_id = p.id WHERE warehouse_id = $1';
    const result = await pool.query(query, [warehouseId]);
    return result.rows;
  }
}

module.exports = new StockModel();