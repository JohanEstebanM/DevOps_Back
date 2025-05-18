const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: "Role",
  tableName: "roles",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    name: {
      type: "varchar",
      length: 50,
      unique: true
    }
  }
});