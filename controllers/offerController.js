const Offer = require('../models/Offer');
const CompanyUser = require('../models/CompanyUser');
const cloudinary = require('cloudinary').v2;

// Crear una nueva oferta
exports.createOffer = async (req, res) => {
  const { title, description, price, category, image } = req.body; 
  const companyId = req.user.id; 

  try {
    const company = await CompanyUser.findById(companyId);

    if (!company) {
      return res.status(404).json({ message: 'Empresa no encontrada' });
    }

    // Subir imagen a Cloudinary
    let imageUrl = '';
    if (image) {
      const result = await cloudinary.uploader.upload(image, {
        folder: 'offers'
      });
      imageUrl = result.secure_url;
    }

    const offer = new Offer({
      title,
      description,
      price,
      category,
      image: imageUrl, // Guardar la URL de la imagen en la oferta
      company: companyId
    });

    await offer.save();

    res.status(201).json({ message: 'Oferta creada exitosamente', offer });
  } catch (error) {
    console.error('Error al crear la oferta:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener todas las ofertas
exports.getOffers = async (req, res) => {
    try {
      const offers = await Offer.find()
  
      if (offers.length === 0) {
        return res.status(404).json({ message: 'No se encontraron ofertas' });
      }
  
      res.status(200).json(offers);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las ofertas' });
    }
  };

  // Obtener oferta por ID
exports.getOfferById = async (req, res) => {
    const { offerId } = req.params;
    
  
    try {
      const offer = await Offer.findById(offerId);
      
      const company = await CompanyUser.findById({ _id: offer.company });
      if (!offer) {
        return res.status(404).json({ message: 'Oferta no encontrada' });
      }
  
      res.status(200).json({offer, company});
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la oferta' });
    }
  };

  // Actualizar una oferta
exports.updateOffer = async (req, res) => {
    const { offerId } = req.params;
    const { title, description, price, category } = req.body;
    const companyId = req.user.id; // Empresa autenticada
  
    try {
      const offer = await Offer.findById(offerId);
  
      if (!offer) {
        return res.status(404).json({ message: 'Oferta no encontrada' });
      }
  
      // Verificar que la oferta pertenece a la empresa autenticada
      if (offer.company.toString() !== companyId) {
        return res.status(403).json({ message: 'No autorizado para actualizar esta oferta' });
      }
  
      // Actualizar los campos de la oferta
      offer.title = title || offer.title;
      offer.description = description || offer.description;
      offer.price = price || offer.price;
      offer.category = category || offer.category;
  
      await offer.save();
  
      res.status(200).json({ message: 'Oferta actualizada exitosamente', offer });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la oferta' });
    }
  };

  // Eliminar una oferta
exports.deleteOffer = async (req, res) => {
    const { offerId } = req.params;
    const companyId = req.user.id; // Empresa autenticada
  
    try {
      const offer = await Offer.findById(offerId);
  
      if (!offer) {
        return res.status(404).json({ message: 'Oferta no encontrada' });
      }
  
      // Verificar que la oferta pertenece a la empresa autenticada
      if (offer.company.toString() !== companyId) {
        return res.status(403).json({ message: 'No autorizado para eliminar esta oferta' });
      }
  
      await offer.remove();
  
      res.status(200).json({ message: 'Oferta eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la oferta' });
    }
  };

