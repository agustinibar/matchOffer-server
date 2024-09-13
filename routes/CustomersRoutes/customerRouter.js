const { Router } = require('express');
const { registerCustomer, loginCustomer, getCustomerDetails, updateCustomerFavorites } = require('../../controllers/customerController');
const { verifyToken } = require('../../handlers/customerAuthHandler');

const customerRouter = Router();

// Rutas
customerRouter.post('/login', loginCustomer);
customerRouter.post('/register', registerCustomer);
customerRouter.get('/me', verifyToken, getCustomerDetails);
customerRouter.put('/favorites', verifyToken, updateCustomerFavorites);

module.exports = {
    customerRouter
}