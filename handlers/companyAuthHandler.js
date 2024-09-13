const jwt = require('jsonwebtoken');
const CompanyUser = require('../models/CompanyUser');

exports.verifyToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await CompanyUser.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    next();
  } catch (error) {
    console.error('Error en verifyToken:', error); // Agrega este log para ver más detalles del error
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
