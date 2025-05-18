const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    id_cc: {
      type: "varchar",
      length: 20,
      unique: true
    },
    name: {
      type: "varchar",
      length: 100
    },
    email: {
      type: "varchar",
      length: 100,
      unique: true
    },
    password: {
      type: "varchar",
      length: 255
    },
    phone: {
      type: "varchar",
      length: 20,
      nullable: true
    },
    status: {
      type: "boolean",
      default: true
    },
    warehouse_id: {
      type: "int",
      nullable: true
    },
    role_id: {
      type: "int"
    }
  },
  relations: {
    warehouse: {
      type: "many-to-one",
      target: "Warehouse",
      joinColumn: {
        name: "warehouse_id"
      }
    },
    role: {
      type: "many-to-one",
      target: "Role",
      joinColumn: {
        name: "role_id"
      }
    }
  }
});