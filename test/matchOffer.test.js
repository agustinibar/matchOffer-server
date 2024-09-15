const request = require('supertest');
const app = require('../index'); 
const mongoose = require('mongoose');

let token; 
let matchOfferId;

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

describe('Testing MatchOffer Routes', () => {
  it('should create a new match offer', async () => {
    const res = await request(app)
      .post('/matchoffers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Oferta de Prueba',
        description: 'Descuento del 15%',
        company: '66e31606e18f238aa3098fc0', // ID de una empresa válida
        price: 100
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('matchOffer');
    matchOfferId = res.body.matchOffer._id; // Guarda el ID para otros tests
  });

  it('should get all match offers', async () => {
    const res = await request(app)
      .get('/matchoffers')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get match offer by ID', async () => {
    const res = await request(app)
      .get(`/matchoffers/${matchOfferId}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', matchOfferId);
  });

  it('should update a match offer', async () => {
    const res = await request(app)
      .put(`/matchoffers/${matchOfferId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Oferta Actualizada'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.matchOffer).toHaveProperty('title', 'Oferta Actualizada');
  });

  it('should delete a match offer', async () => {
    const res = await request(app)
      .delete(`/matchoffers/${matchOfferId}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Oferta eliminada exitosamente');
  });
});
