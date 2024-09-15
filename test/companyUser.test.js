const request = require('supertest');
const app = require('../index'); 
const mongoose = require('mongoose');

let token; 
let companyId;

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

describe('Testing CompanyUser Routes', () => {
  it('should get company details', async () => {
    const res = await request(app)
      .get('/companies/me')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id');
    companyId = res.body._id; // Guarda el ID para otros tests
  });

  it('should update company details', async () => {
    const res = await request(app)
      .put(`/companies/${companyId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        companyName: 'Nombre Actualizado'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.company).toHaveProperty('companyName', 'Nombre Actualizado');
  });

  // Agrega más tests según sea necesario
});
