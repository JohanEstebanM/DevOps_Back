const productVariantModel = require('../models/product-variant.model');
const stockModel = require('../models/stock.model');

class ProductVariantController {
  async create(req, res) {
    try {
      const { product_id, variant_code, attributes, price } = req.body;
      const variant = await productVariantModel.create({
        product_id,
        variant_code,
        attributes,
        price
      });
      res.status(201).json(variant);
    } catch (error) {
      res.status(500).json({ error: "Error creating product variant" });
    }
  }

  async getAll(req, res) {
    try {
      const variants = await productVariantModel.findAll();
      res.json(variants);
    } catch (error) {
      res.status(500).json({ error: "Error fetching product variants" });
    }
  }

  async getById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const variant = await productVariantModel.findById(id);
      variant ? res.json(variant) : res.status(404).json({ error: "Product variant not found" });
    } catch (error) {
      res.status(500).json({ error: "Error fetching product variant" });
    }
  }

  async getByProductId(req, res) {
    try {
      const product_id = parseInt(req.params.product_id);
      const variants = await productVariantModel.findByProductId(product_id);
      res.json(variants);
    } catch (error) {
      res.status(500).json({ error: "Error fetching product variants" });
    }
  }

  async update(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { product_id, variant_code, attributes, price } = req.body;
      const variant = await productVariantModel.update(id, {
        product_id,
        variant_code,
        attributes,
        price
      });
      variant ? res.json(variant) : res.status(404).json({ error: "Product variant not found" });
    } catch (error) {
      res.status(500).json({ error: "Error updating product variant" });
    }
  }

  async delete(req, res) {
    try {
      const id = parseInt(req.params.id);
      await productVariantModel.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Error deleting product variant" });
    }
  }
  async getByIdWithStock(req, res) {
    try {
      const id = parseInt(req.params.id);
      const variantRepository = getRepository(ProductVariant);
      const variant = await variantRepository.findOne(id, {
        relations: ['stocks', 'stocks.warehouse']
      });

      variant ? res.json(variant) : res.status(404).json({ error: "Product variant not found" });
    } catch (error) {
      res.status(500).json({ error: "Error fetching product variant with stock" });
    }
  }

  async getByWarehouse(req, res) {
    try {
      const warehouseId = parseInt(req.params.warehouse_id);
      const variantRepository = getRepository(ProductVariant);
      const variants = await variantRepository
        .createQueryBuilder('variant')
        .innerJoinAndSelect('variant.stocks', 'stock', 'stock.warehouse_id = :warehouseId AND stock.quantity > 0', { warehouseId })
        .innerJoinAndSelect('variant.product', 'product')
        .getMany();

      res.json(variants);
    } catch (error) {
      res.status(500).json({ error: "Error fetching product variants by warehouse" });
    }
  }
}

module.exports = new ProductVariantController();