// src/server.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./auth/authRoutes');
const profileRoutes = require('./profile/profileRoutes');

const server = express();
const PORT = 3000;

server.use(express.json());
server.use(cors());

server.use('/api', authRoutes);
server.use('/api', profileRoutes);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

server.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});