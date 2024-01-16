const express = require('express');
const { Client } = require('pg');
require('dotenv').config();

const router = express.Router();

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

client.connect()
  .then(() => console.log('Подключено к PostgreSQL'))
  .catch(err => console.error('Ошибка подключения к PostgreSQL', err));

router.get('/news', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM news');
    const newsList = result.rows;

    res.status(200).json(newsList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/news/id/:id', async (req, res) => {
  try {
    const newsId = req.params.id;

    const result = await client.query('SELECT * FROM news WHERE id = $1', [newsId]);
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
