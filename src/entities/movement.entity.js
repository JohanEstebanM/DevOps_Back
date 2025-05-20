const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: "Movement",
  tableName: "movements",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    product_variant_id: {
      type: "int"
    },
    from_warehouse_id: {
      type: "int"
    },
    to_warehouse_id: {
      type: "int"
    },
    quantity: {
      type: "int"
    },
    user_id: {
      type: "int"
    },
    notes: {
      type: "text",
      nullable: true
    },
    created_at: {
      type: "timestamp",
      createDate: true
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
    from_warehouse: {
      type: "many-to-one",
      target: "Warehouse",
      joinColumn: {
        name: "from_warehouse_id"
      }
    },
    to_warehouse: {
      type: "many-to-one",
      target: "Warehouse",
      joinColumn: {
        name: "to_warehouse_id"
      }
    }
  },
  checks: [
    {
      expression: "quantity > 0"
    }
  ]
});