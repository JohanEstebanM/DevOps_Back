class ProductModel {
  constructor() {
    this.repository = AppDataSource.getRepository("Product");
  }

  async create({ name, description, category_id, image_url }) {
    const product = this.repository.create({ 
      name, 
      description, 
      category_id, 
      image_url 
    });
    return await this.repository.save(product);
  }

  async findAll() {
    return await this.repository.find({
      relations: ['category']
    });
  }

  async findById(id) {
    return await this.repository.findOne({
      where: { id },
      relations: ['category']
    });
  }

  async update(id, { name, description, category_id, image_url }) {
    await this.repository.update(id, { 
      name, 
      description, 
      category_id, 
      image_url 
    });
    return this.findById(id);
  }

  async delete(id) {
    await this.repository.delete(id);
  }
}

const AppDataSource = require('../config/data-source');
module.exports = new ProductModel();