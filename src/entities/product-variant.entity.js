const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: "ProductVariant",
  tableName: "product_variants",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    product_id: {
      type: "int",
      nullable: false
    },
    variant_code: {
      type: "varchar",
      length: 100,
      nullable: false,
      unique: true
    },
    attributes: {
      type: "jsonb",
      nullable: false
    },
    price: {
      type: "decimal",
      precision: 10,
      scale: 2,
      default: 0.00,
      nullable: false
    }
  },
  relations: {
    product: {
      type: "many-to-one",
      target: "Product",
      joinColumn: {
        name: "product_id",
        referencedColumnName: "id"
      },
      inverseSide: "variants"
    }
  }
});