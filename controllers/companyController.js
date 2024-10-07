const Company = require('../models/CompanyUser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2;

// Registrar nueva empresa
exports.registerCompanyUser = async (req, res) => {
  const { name, email, password, profileImage } = req.body;
  console.log('Profile image received:', profileImage);
  try {
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let uploadedImage;
    try {
      if (profileImage) {
        console.log('Subiendo imagen a Cloudinary...');
        uploadedImage = await cloudinary.uploader.upload(profileImage, {
          folder: 'profiles',
        });
        console.log('Imagen subida exitosamente:', uploadedImage.secure_url);
      }
    } catch (uploadError) {
      console.error('Error al subir imagen a Cloudinary:', uploadError);
      return res.status(500).json({ error: 'Error al subir la imagen a Cloudinary', details: uploadError.message });
    }

    const company = new Company({
      name,
      email,
      password: hashedPassword,
      type: 'company',
      profileImage: uploadedImage ? uploadedImage.secure_url : null,
    });

    await company.save();

    const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token, company });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar la empresa' });
  }
};

// Iniciar sesión de la empresa
exports.loginCompanyUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Company.findOne({ email });

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
    const company = await Company.findById(req.user.id).select('-password');

    if (!company) {
      return res.status(404).json({ message: 'Empresa no encontrada' });
    }

    // Solo hacer populate si hay ofertas
    if (company.offers.length > 0) {
      await company.populate('offers');
    }

    // Se incluye la URL de la imagen de Cloudinary en la respuesta
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};