const express = require('express');
const { companiesRouter } = require('./CompaniesRoutes/companiesRouter');
const { customerRouter } = require('./CustomersRoutes/customerRouter');
const { offersRouter } = require('./OffersRoutes/offersRouter');
const { matchRouter } = require('./MatchRoutes/matchRouter');

const router = express.Router();

router.use('/companies', companiesRouter);
router.use('/customer', customerRouter);
router.use('/match', matchRouter);
router.use('/offers', offersRouter);

module.exports = {
    router
}