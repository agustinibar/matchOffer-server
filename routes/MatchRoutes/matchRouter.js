const { Router } = require('express');
const { createMatch, getMatchesForCompany, getMatchesForCustomer, getMatchesByOfferId } = require('../../controllers/matchController');
const { verifyToken } = require('../../handlers/auth');


const matchRouter = Router();

// Rutas para crear y obtener matches
matchRouter.post('/create', verifyToken, createMatch);
matchRouter.get('/customer', verifyToken, getMatchesForCustomer);
matchRouter.get('/company', verifyToken, getMatchesForCompany);
matchRouter.get('/:offerId', getMatchesByOfferId);

module.exports = {
    matchRouter
}