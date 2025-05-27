require('dotenv').config();
const path = require('path');

const { DataSource } = require('typeorm');

const ssl = process.env.DATABASE_SSL === 'true' ||
  process.env.DATABASE_SSL === '1' ||
  process.env.DATABASE_URL?.includes('sslmode=require');

const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
  entities: [path.join(__dirname, "../entities/*.js")],
  ssl: ssl ? { rejectUnauthorized: false } : false,
});


async function createInitialRoles() {
  await AppDataSource.initialize();
  console.log('Conexión a la base de datos establecida');

  const roleRepository = AppDataSource.getRepository("Role");

  const initialRoles = [
    {
      name: "administrador",
    },
    {
      name: "operativo",
    },
    {
      name: "operador",
    }
  ];

  try {
    // Verificar si ya existen roles
    const existingRoles = await roleRepository.find();
    if (existingRoles.length > 0) {
      console.log('Los roles iniciales ya existen');
      process.exit(0);
    }

    // Crear roles
    for (const roleData of initialRoles) {
      const role = roleRepository.create(roleData);
      await roleRepository.save(role);
      console.log(`Rol creado: ${role.name}`);
    }

    console.log('Migración de roles completada');
    process.exit(0);
  } catch (error) {
    console.error('Error en la migración:', error);
    process.exit(1);
  }
}

createInitialRoles();