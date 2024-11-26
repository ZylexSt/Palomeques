const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para servir archivos estáticos (HTML, CSS, JS)
app.use(express.static('frontend'));

// Ruta base
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/frontend/index.html');
});

// Servidor en escucha
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
