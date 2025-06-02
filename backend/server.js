// PRY_ESPHERE/backend/server.js (solo API)

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();

// — Helmet + CSP (tal como lo tenías) — 
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        connectSrc: ["'self'", "https://pryesphere-production.up.railway.app", "ws://localhost:*"],
        imgSrc: ["'self'", "data:", "blob:"],
      },
    },
  })
);

// — CORS abierto a todos — 
app.use(cors());

// — Parseo de JSON — 
app.use(express.json({ limit: '10mb' }));

// — Rutas de la API — 
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// — Conexión a MongoDB (sin useNewUrlParser / useUnifiedTopology, ya no hacen falta) —
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));