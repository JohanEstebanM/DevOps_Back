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
}

const AppDataSource = require('../config/data-source');
module.exports = new ProductVariantModel();