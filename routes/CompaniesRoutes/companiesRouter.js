const { Router } = require('express');
const { registerCompanyUser, loginCompanyUser, getCompanyDetails } = require('../../controllers/companyController');
const { verifyToken } = require('../../handlers/companyAuthHandler');

const companiesRouter = Router();

// Ruta para registrar una nueva empresa
companiesRouter.post('/register', registerCompanyUser);

// Ruta para iniciar sesión
companiesRouter.post('/login', loginCompanyUser);

// Ruta para obtener detalles de la empresa (solo para usuarios autenticados)
companiesRouter.get('/me', verifyToken, getCompanyDetails);

module.exports = {
    companiesRouter
}