const categoryModel = require('../models/category.model');

class CategoryController {
  async create(req, res) {
    try {
      const { name } = req.body;
      const category = await categoryModel.create(name);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: "Error creating category" });
    }
  }

  async getAll(req, res) {
    try {
      const categories = await categoryModel.findAll();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Error fetching categories" });
    }
  }

  async getById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const category = await categoryModel.findById(id);
      category ? res.json(category) : res.status(404).json({ error: "Category not found" });
    } catch (error) {
      res.status(500).json({ error: "Error fetching category" });
    }
  }

  async update(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { name } = req.body;
      const category = await categoryModel.update(id, name);
      category ? res.json(category) : res.status(404).json({ error: "Category not found" });
    } catch (error) {
      res.status(500).json({ error: "Error updating category" });
    }
  }

  async delete(req, res) {
    try {
      const id = parseInt(req.params.id);
      await categoryModel.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Error deleting category" });
    }
  }
}

module.exports = new CategoryController();