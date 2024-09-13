const CompanyUser = require('../models/CompanyUser');
const jwt = require('jsonwebtoken');

// Registrar nueva empresa
exports.registerCompanyUser = async (req, res) => {
  const { companyName, email, password } = req.body;

  try {
    let user = await CompanyUser.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    user = new CompanyUser({ companyName, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, company: user });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Iniciar sesión de la empresa
exports.loginCompanyUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await CompanyUser.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, company: user });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener detalles de la empresa
exports.getCompanyDetails = async (req, res) => {
  try {
    // Buscar empresa sin hacer populate
    const company = await CompanyUser.findById(req.user.id);

    if (!company) {
      return res.status(404).json({ message: 'Empresa no encontrada' });
    }

    // Solo hacer populate si hay ofertas
    if (company.offers.length > 0) {
      await company.populate('offers');
    }

    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};