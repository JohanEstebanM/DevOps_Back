class CategoryModel {
  constructor() {
    this.repository = AppDataSource.getRepository("Category");
  }

  async create(name) {
    const category = this.repository.create({ name });
    return await this.repository.save(category);
  }

  async findAll() {
    return await this.repository.find();
  }

  async findById(id) {
    return await this.repository.findOneBy({ id });
  }

  async update(id, name) {
    await this.repository.update(id, { name });
    return this.findById(id);
  }

  async delete(id) {
    await this.repository.delete(id);
  }
}

const AppDataSource = require('../config/data-source');
module.exports = new CategoryModel();