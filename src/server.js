const express = require('express');
const path = require('path');
const app = express();
const PORT = 4000;

// Importação das rotas
const eventosRoutes = require('./routes/eventosRoutes');
const trilhasRoutes = require('./routes/trilhasRoutes');
const biodiversidadeRoutes = require('./routes/biodiversidadeRoutes');
const authRoutes = require('./routes/authRoutes');

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));
app.use(express.json());

// Injeção de dependência das rotas no Express
app.use('/api/eventos', eventosRoutes);
app.use('/api/trilhas', trilhasRoutes);
app.use('/api/biodiversidade', biodiversidadeRoutes);
app.use('/api/login', authRoutes);

app.listen(PORT, () => {
    console.log(`Servidor do Terê Verde Online rodando na porta ${PORT}!`);
    console.log(`Acesse: http://localhost:${PORT}`);
});