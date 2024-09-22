const MatchOffer = require('../models/MatchOffer');
const Customer = require('../models/CustomerUser');
const Offer = require('../models/Offer');

// Crear un nuevo match entre cliente y oferta
exports.createMatch = async (req, res) => {
  const { offerId } = req.body;
  const customerId = req.user.id; // Cliente autenticado

  try {
    // Verificar si el cliente y la oferta existen
    const customer = await Customer.findById(customerId);
    const offer = await Offer.findById(offerId);

    if (!customer || !offer) {
      return res.status(404).json({ message: 'Cliente u oferta no encontrados' });
    }

    // Verificar si ya existe un match
    const existingMatch = await MatchOffer.findOne({ customer: customerId, offer: offerId });
    if (existingMatch) {
      return res.status(400).json({ message: 'El match ya existe' });
    }

    // Crear un nuevo match
    const matchOffer = new MatchOffer({
      customer: customerId,
      offer: offerId
    });

    await matchOffer.save();

    res.status(201).json({ message: 'Match creado exitosamente', matchOffer });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el match' });
  }
};

// Obtener todos los matches de un cliente autenticado
exports.getMatchesForCustomer = async (req, res) => {
    const customerId = req.user.id;
  
    try {
      const matches = await MatchOffer.find({ customer: customerId }).populate('offer');
      
      if (!matches) {
        return res.status(404).json({ message: 'No se encontraron matches para este cliente' });
      }
  
      res.status(200).json(matches);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los matches' });
    }
  };

  // Obtener todos los matches de una empresa autenticada
exports.getMatchesForCompany = async (req, res) => {
    const companyId = req.user.id; // Empresa autenticada
  
    try {
      const matches = await MatchOffer.find()
  
      // Filtrar para asegurarse de que solo se devuelven los matches que pertenecen a la empresa
      const filteredMatches = matches.filter(match => match.offer !== null);
  
      if (filteredMatches.length === 0) {
        return res.status(404).json({ message: 'No se encontraron matches para esta empresa' });
      }
  
      res.status(200).json(filteredMatches);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los matches de la empresa' });
    }
  };
  