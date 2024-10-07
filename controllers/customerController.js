const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/CustomerUser');

// Registrar cliente
exports.registerCustomer = async (req, res) => {
  const { name, email, password, image } = req.body; // Se recibe la imagen

  try {
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Subir imagen a Cloudinary si se proporciona
    let imageUrl = '';
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'user_profiles', 
      });
      imageUrl = uploadResponse.secure_url; 
    }

    const customer = new Customer({
      name,
      email,
      password: hashedPassword,
      image: imageUrl, 
      type: 'customer'
    });

    await customer.save();

    const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token, customer });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el cliente' });
  }
};


// Iniciar sesión del cliente
exports.loginCustomer = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si el cliente existe
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Crear token
    const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ token, customer });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener detalles del cliente autenticado
exports.getCustomerDetails = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).select('-password');

    if (!customer) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Actualizar Favoritos del Cliente
exports.updateCustomerFavorites = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    const { offerId } = req.body;
    if (!customer.favorites.includes(offerId)) {
      customer.favorites.push(offerId);
    }

    await customer.save();
    res.status(200).json({ message: 'Favoritos actualizados', customer });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};


