require('dotenv').config();
const { DataSource } = require('typeorm');
const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: true,
  entities: [__dirname + "/../entities/*.js"],
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  }
});

async function createInitialRoles() {
  await AppDataSource.initialize();
  console.log('Conexión a la base de datos establecida');

  const roleRepository = AppDataSource.getRepository("Role");
  
  const initialRoles = [
    {
      name: "operativo",
    },
    {
      name: "operador",
    },
    {
      name: "administrador",
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