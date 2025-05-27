const request = require('supertest');
const AppDataSource = require('../src/config/data-source');;
const app = require('../app');
const bcrypt = require('bcrypt');

describe('POST /api/warehouses', () => {
  let token;
  let testUser;
  let random;
  let warehouse;

  beforeAll(async () => {
    // Inicializar DB
    await AppDataSource.initialize();
    await AppDataSource.synchronize();

    const hashedPassword = await bcrypt.hash('test', 10);
    const userRepository = AppDataSource.getRepository("User");

    const randomCC = Math.random().toString(36).substring(2, 12).toUpperCase();
    random = randomCC;
    const user = userRepository.create({
      cc: randomCC,
      name: 'Test User',
      email: 'test' + randomCC + '@test.com',
      password: hashedPassword,
      role_id: 3
    });

    const savedUser = await userRepository.save(user);
    testUser = savedUser;
  });

  afterAll(async () => {
    //cerrar conexión
    AppDataSource.destroy();
  });

  // valida que el login sea válido
  it('Validate Login', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'test' })
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    token = response.body.token;
  });

  // valida crear nueva bodega y enviando token de autenticación
  it('should create a new warehouse with valid token', async () => {
    const newWarehouse = {
      name: "Bodega Test",
      phone: "+123456789",
      email: "bodega" + random + "@test.com",
      location: "Calle 123",
      max_capacity: 1000,
      open_hours: "8:00 AM - 6:00 PM",
      coordinates: [6.251151, -75.572925]
    };

    const response = await request(app)
      .post('/api/warehouses')
      .set('Authorization', `Bearer ${token}`)
      .send(newWarehouse)
      .expect(201);

    expect(response.body).toMatchObject({
      name: newWarehouse.name,
      email: newWarehouse.email
    });

    warehouse = response.body;
  });

  // valida crear nueva bodega sin enviar token y que falle por autenticación
  it('should create a new warehouse with valid token', async () => {
    const newWarehouse = {
      name: "Bodega Test",
      phone: "+123456789",
      email: "bodega" + random + "@test.com",
      location: "Calle 123",
      max_capacity: 1000,
      open_hours: "8:00 AM - 6:00 PM",
      coordinates: [6.251151, -75.572925]
    };

    await request(app)
      .post('/api/warehouses')
      .send(newWarehouse)
      .expect(401);
  });

  // valida detalle de bodega
  it('Validate warehouse detail', async () => {
    const response = await request(app)
      .get('/api/warehouses/' + warehouse.id)
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(200);

    expect(response.body).toMatchObject({
      name: warehouse.name,
      email: warehouse.email
    });
  });

  // valida eliminar bodega 
  it('Delete warehouse', async () => {
    await request(app)
      .delete('/api/warehouses/' + warehouse.id)
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(204);
  });
});