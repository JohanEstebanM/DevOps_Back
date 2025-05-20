const pool = require('../config/database');

class MovementModel {
  async create(movementData) {
    const { product_variant_id, from_warehouse_id, to_warehouse_id, quantity, user_id, notes } = movementData;
    const query = `
      INSERT INTO movements 
      (product_variant_id, from_warehouse_id, to_warehouse_id, quantity, user_id, notes) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `;
    const result = await pool.query(query, [
      product_variant_id, 
      from_warehouse_id, 
      to_warehouse_id, 
      quantity, 
      user_id, 
      notes
    ]);
    return result.rows[0];
  }

  async findByVariant(variantId) {
    const query = `
      SELECT m.*, 
        w1.name as from_warehouse_name, 
        w2.name as to_warehouse_name,
        pv.variant_code,
        p.name as product_name
      FROM movements m
      JOIN warehouses w1 ON m.from_warehouse_id = w1.id
      JOIN warehouses w2 ON m.to_warehouse_id = w2.id
      JOIN product_variants pv ON m.product_variant_id = pv.id
      JOIN products p ON pv.product_id = p.id
      WHERE m.product_variant_id = $1
      ORDER BY m.created_at DESC
    `;
    const result = await pool.query(query, [variantId]);
    return result.rows;
  }

  async findByWarehouse(warehouseId) {
    const query = `
      SELECT m.*, 
        w1.name as from_warehouse_name, 
        w2.name as to_warehouse_name,
        pv.variant_code,
        p.name as product_name
      FROM movements m
      JOIN warehouses w1 ON m.from_warehouse_id = w1.id
      JOIN warehouses w2 ON m.to_warehouse_id = w2.id
      JOIN product_variants pv ON m.product_variant_id = pv.id
      JOIN products p ON pv.product_id = p.id
      WHERE m.from_warehouse_id = $1 OR m.to_warehouse_id = $1
      ORDER BY m.created_at DESC
    `;
    const result = await pool.query(query, [warehouseId]);
    return result.rows;
  }
}

module.exports = new MovementModel();