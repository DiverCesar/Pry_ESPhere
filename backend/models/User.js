const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
  nombre: { type: String, required: true },
  edad: { type: Number, required: true },
  departamento: { type: String, required: true },
  fotoURL: { type: String },       // guardaremos URL o base64
  ubicacion: {
    lat: { type: Number },
    lng: { type: Number }
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = model('User', userSchema);