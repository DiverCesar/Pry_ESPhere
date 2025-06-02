// 1. Helmet primero
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

// 2. CORS / JSON / etc.
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 3. Sirvo la carpeta build de React (si corresponde)
// app.use(express.static(path.join(__dirname, 'client/build')));

// 4. Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// 5. Para producción: redirigir todo lo que no sea /api a index.html
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client/build/index.html'));
// });

// 6. Conexión a MongoDB y arranque del servidor
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
  })
  .catch(err => console.error('Error conectando a MongoDB:', err));