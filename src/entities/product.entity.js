const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: "Product",
  tableName: "products",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    name: {
      type: "varchar",
      length: 255,
      nullable: false
    },
    description: {
      type: "text",
      nullable: true
    },
    category_id: {
      type: "int",
      nullable: true
    },
    image_url: {
      type: "varchar",
      length: 255,
      nullable: true
    },
    created_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP"
    }
  },
  relations: {
    category: {
      type: "many-to-one",
      target: "Category",
      joinColumn: {
        name: "category_id",
        referencedColumnName: "id"
      },
      inverseSide: "products"
    }
  }
});