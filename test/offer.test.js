const request = require('supertest');
const app = require('../index'); 
const mongoose = require('mongoose');

let token; 

beforeAll(async () => {
  // Lógica para obtener el token antes de ejecutar los tests
  const loginResponse = await request(app)
    .post('/auth/login')
    .send({ email: 'empresa@correo.com', password: 'contraseña' });

  token = loginResponse.body.token;
});

afterAll(async () => {
  // Cierra la conexión a la base de datos después de los tests
  await mongoose.connection.close();
});

describe('Testing Offer Routes', () => {
  let offerId;

  it('should create a new offer', async () => {
    const res = await request(app)
      .post('/offers/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Nueva Oferta',
        description: 'Descuento del 20%',
        price: 150,
        category: 'Ropa'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('offer');
    offerId = res.body.offer._id; // Guarda el ID de la oferta para otros tests
  });

  it('should get all offers', async () => {
    const res = await request(app)
      .get('/offers')
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get offer by ID', async () => {
    const res = await request(app)
      .get(`/offers/${offerId}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', offerId);
  });

  it('should update an offer', async () => {
    const res = await request(app)
      .put(`/offers/${offerId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Oferta Actualizada'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.offer).toHaveProperty('title', 'Oferta Actualizada');
  });

  it('should delete an offer', async () => {
    const res = await request(app)
      .delete(`/offers/${offerId}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Oferta eliminada exitosamente');
  });
});
