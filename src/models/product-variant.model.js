class ProductVariantModel {
  constructor() {
    this.repository = AppDataSource.getRepository("ProductVariant");
  }

  async create({ product_id, variant_code, attributes, price }) {
    const variant = this.repository.create({ 
      product_id, 
      variant_code, 
      attributes, 
      price 
    });
    return await this.repository.save(variant);
  }

  async findAll() {
    return await this.repository.find({
      relations: ['product']
    });
  }

  async findById(id) {
    return await this.repository.findOne({
      where: { id },
      relations: ['product']
    });
  }

  async findByProductId(product_id) {
    return await this.repository.find({
      where: { product_id },
      relations: ['product']
    });
  }

  async update(id, { product_id, variant_code, attributes, price }) {
    await this.repository.update(id, { 
      product_id, 
      variant_code, 
      attributes, 
      price 
    });
    return this.findById(id);
  }

  async delete(id) {
    await this.repository.delete(id);
  }

   async findByIdWithStock(id) {
    const variantQuery = 'SELECT * FROM product_variants WHERE id = $1';
    const variantResult = await pool.query(variantQuery, [id]);
    
    if (variantResult.rows.length === 0) {
      return null;
    }
    
    const variant = variantResult.rows[0];
    const stockQuery = 'SELECT s.*, w.name as warehouse_name FROM stock s JOIN warehouses w ON s.warehouse_id = w.id WHERE product_variant_id = $1';
    const stockResult = await pool.query(stockQuery, [id]);
    
    variant.stock = stockResult.rows;
    return variant;
  }

  async getVariantsByWarehouse(warehouseId) {
    const query = `
      SELECT pv.*, s.quantity, p.name as product_name
      FROM product_variants pv
      JOIN stock s ON pv.id = s.product_variant_id
      JOIN products p ON pv.product_id = p.id
      WHERE s.warehouse_id = $1 AND s.quantity > 0
    `;
    const result = await pool.query(query, [warehouseId]);
    return result.rows;
  }
}

const AppDataSource = require('../config/data-source');
module.exports = new ProductVariantModel();