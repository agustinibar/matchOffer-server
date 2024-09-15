const request = require('supertest');
const app = require('../index'); 
const mongoose = require('mongoose');

let token; 
let customerId;

beforeAll(async () => {
  // Lógica para obtener el token antes de ejecutar los tests
  const loginResponse = await request(app)
    .post('/auth/login')
    .send({ email: 'customer@correo.com', password: 'contraseña' });

  token = loginResponse.body.token;
});

afterAll(async () => {
  // Cierra la conexión a la base de datos después de los tests
  await mongoose.connection.close();
});

describe('Testing Customer Routes', () => {
  it('should register a new customer', async () => {
    const res = await request(app)
      .post('/customers/register')
      .send({
        name: 'Cliente de Prueba',
        email: 'cliente@correo.com',
        password: 'contraseña'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    customerId = res.body.customer._id; // Guarda el ID para otros tests
  });

  it('should login a customer', async () => {
    const res = await request(app)
      .post('/customers/login')
      .send({
        email: 'cliente@correo.com',
        password: 'contraseña'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should get customer details', async () => {
    const res = await request(app)
      .get('/customers/me')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', customerId);
  });

  it('should update customer favorites', async () => {
    const res = await request(app)
      .put('/customers/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({
        offerId: '60c72b2f9b1e8e4f2b8b4567' // ID de una oferta válida
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Favoritos actualizados');
  });

  // Agrega más tests según sea necesario
});
