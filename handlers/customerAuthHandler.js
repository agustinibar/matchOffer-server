const jwt = require('jsonwebtoken');
const Customer = require('../models/CustomerUser'); 

exports.verifyToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token' });
  }

  try {
    // Decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar el cliente por ID en la colección Customer
    req.user = await Customer.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    next(); // Pasar al siguiente middleware si el token es válido y el cliente existe
  } catch (error) {
    console.error('Error en verifyToken:', error); 
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
