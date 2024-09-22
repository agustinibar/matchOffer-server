const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { router } = require('./routes');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB conectado');
    })
    .catch(err => {
        console.log('Error al conectar a MongoDB: ', err);
    });
    
// Ruta de prueba
app.get('/', (req, res) => {
    res.send('MatchOffers API funcionando');
});

app.use(router)



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
