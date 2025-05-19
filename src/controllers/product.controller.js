const productModel = require('../models/product.model');

class ProductController {
  async create(req, res) {
    try {
      const { name, description, category_id, image_url } = req.body;
      const product = await productModel.create({ 
        name, 
        description, 
        category_id, 
        image_url 
      });
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: "Error creating product" });
    }
  }

  async getAll(req, res) {
    try {
      const products = await productModel.findAll();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Error fetching products" });
    }
  }

  async getById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const product = await productModel.findById(id);
      product ? res.json(product) : res.status(404).json({ error: "Product not found" });
    } catch (error) {
      res.status(500).json({ error: "Error fetching product" });
    }
  }

  async update(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { name, description, category_id, image_url } = req.body;
      const product = await productModel.update(id, { 
        name, 
        description, 
        category_id, 
        image_url 
      });
      product ? res.json(product) : res.status(404).json({ error: "Product not found" });
    } catch (error) {
      res.status(500).json({ error: "Error updating product" });
    }
  }

  async delete(req, res) {
    try {
      const id = parseInt(req.params.id);
      await productModel.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Error deleting product" });
    }
  }
}

module.exports = new ProductController();