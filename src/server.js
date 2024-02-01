const express = require('express');
const cors = require('cors');
const authRoutes = require('./auth/authRoutes');
const profileRoutes = require('./profile/profileRoutes');
const newsRoutes = require('./news/newsRoutes');
const promocodeRoutes = require('./promocode/promocodeRoutes');
const rankingRoutes = require('./ranking/rankingRoutes');

const figlet = require('figlet');


const server = express();
const PORT = process.env.PORT || 3000;

server.use(express.json());
server.use(cors());

// Routes
server.use('/api', authRoutes);
server.use('/api', profileRoutes);
server.use('/api', newsRoutes);
server.use('/api', promocodeRoutes);
server.use('/api', rankingRoutes);



// Error handling middleware
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Display a startup message with ASCII art
figlet('BACK BY BORUSOV', (err, data) => {
  if (err) {
    console.log('Error loading ASCII art.');
    return;
  }
  console.log(data);
  console.log(`Server is running on http://localhost:${PORT}`);
});

server.listen(PORT);
