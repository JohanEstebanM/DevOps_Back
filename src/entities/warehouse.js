const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: "Warehouse",
  tableName: "warehouses",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    name: {
      type: "varchar",
      length: 100
    },
    phone: {
      type: "varchar",
      length: 20
    },
    email: {
      type: "varchar",
      length: 100,
      unique: true
    },
    location: {
      type: "varchar",
      length: 255
    },
    max_capacity: {
      type: "int"
    },
    open_hours: {
      type: "varchar",
      length: 100
    },
    coordinates: {
      type: "json"
    }
  }
});