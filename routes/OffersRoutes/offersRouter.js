const { Router } = require('express');
const { verifyToken } = require('../../handlers/auth');
const { createOffer, getOfferById, updateOffer, deleteOffer, getOffers, getNearbyOffers } = require('../../controllers/offerController');

const offersRouter = Router();

offersRouter.post('/create', verifyToken, createOffer);
offersRouter.get('/', getOffers);
offersRouter.get('/nearby', getNearbyOffers);
offersRouter.get('/:offerId', getOfferById);
offersRouter.put('/:offerId', verifyToken, updateOffer);
offersRouter.delete('/:offerId', verifyToken, deleteOffer);

module.exports = {
    offersRouter
}