// src/index.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const restaurantsRouter = require('./routes/restaurants'); // ✅ Ruta corregida
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.get('/', (req, res) => {
  res.send('API de Tattler funcionando 🚀');
});

app.use('/api/restaurants', restaurantsRouter);

// Middleware de manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Conectar a la base de datos y arrancar el servidor
connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to DB:', err);
    process.exit(1);
  });
