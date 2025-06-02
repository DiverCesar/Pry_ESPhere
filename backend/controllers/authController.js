const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Registrar un usuario
async function register(req, res) {
  try {
    const { nombre, edad, departamento, email, password } = req.body;
    // Validaciones mínimas
    if (!nombre || !edad || !departamento || !email || !password) {
      return res.status(400).json({ mensaje: 'Faltan campos requeridos.' });
    }

    // ¿Ya existe un usuario con ese email?
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ mensaje: 'El email ya está registrado.' });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    const newUser = new User({
      nombre,
      edad,
      departamento,
      email,
      password: hashedPassword,
      // role queda por defecto 'user'
    });

    const saved = await newUser.save();

    // Generar JWT
    const token = jwt.sign(
      { id: saved._id, role: saved.role, email: saved.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(201).json({ mensaje: 'Usuario registrado con éxito', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error en el servidor.' });
  }
}

// Login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ mensaje: 'Email o contraseña faltantes.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas.' });
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ mensaje: 'Login exitoso', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error en el servidor.' });
  }
}

module.exports = { register, login };