const jwt = require('jsonwebtoken');
const CompanyUser = require('../models/CompanyUser');
const Customer = require('../models/CustomerUser');

exports.verifyToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar si es un cliente o una empresa
    let user = await Customer.findById(decoded.id).select('-password');
    if (!user) {
      user = await CompanyUser.findById(decoded.id).select('-password');
    }

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};