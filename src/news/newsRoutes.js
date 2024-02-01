const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const router = express.Router();

// Initialize PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Error connecting to PostgreSQL', err));

// Endpoint to get all news articles
router.get('/news', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM news_articles');
    const newsList = result.rows;

    res.status(200).json(newsList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to get a specific news article by ID
router.get('/news/id/:id', async (req, res) => {
  try {
    const newsId = req.params.id;

    const result = await pool.query('SELECT * FROM news_articles WHERE article_id = $1', [newsId]);
    const news = result.rows[0];

    if (news) {
      res.status(200).json(news);
    } else {
      res.status(404).json({ error: 'News not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
