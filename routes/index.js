const express = require('express');
const { companiesRouter } = require('./CompaniesRoutes/companiesRouter');
const { customerRouter } = require('./CustomersRoutes/customerRouter');
const { offersRouter } = require('./OffersRoutes/offersRouter');
const { matchRouter } = require('./MatchRoutes/matchRouter');
const  cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dznlsgy6h', 
    api_key: '969128831313338', 
    api_secret:'qg8yaHi5_Dml3J4dp2nCQ5Ry1Xo'
})
const router = express.Router();


router.use('/companies', companiesRouter);
router.use('/customer', customerRouter);
router.use('/match', matchRouter);
router.use('/offers', offersRouter);

module.exports = {
    router
}