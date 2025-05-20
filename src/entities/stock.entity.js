const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: "Stock",
  tableName: "stock",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    product_variant_id: {
      type: "int"
    },
    warehouse_id: {
      type: "int"
    },
    quantity: {
      type: "int",
      default: 0
    },
    created_at: {
      type: "timestamp",
      createDate: true
    },
    updated_at: {
      type: "timestamp",
      updateDate: true
    }
  },
  relations: {
    product_variant: {
      type: "many-to-one",
      target: "ProductVariant",
      joinColumn: {
        name: "product_variant_id"
      }
    },
    warehouse: {
      type: "many-to-one",
      target: "Warehouse",
      joinColumn: {
        name: "warehouse_id"
      }
    }
  },
  uniques: [
    {
      name: "UNIQUE_STOCK",
      columns: ["product_variant_id", "warehouse_id"]
    }
  ],
  checks: [
    {
      expression: "quantity >= 0"
    }
  ]
});