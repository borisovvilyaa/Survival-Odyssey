// src/ranking/rankingRoutes.js
const express = require('express');
const admin = require('firebase-admin');

require('dotenv').config();

const database = admin.database();
const router = express.Router();

async function fetchRankingData(orderByChild) {
  try {
    const usersSnapshot = await database.ref('users').orderByChild(orderByChild).once('value');

    if (usersSnapshot.exists()) {
      const promises = [];

      usersSnapshot.forEach((user) => {
        const userUID = user.key;
        const userData = user.val();

        // Fetch additional metadata from Firebase Authentication
        const authUserPromise = admin.auth().getUser(userUID);

        // Push a promise to the array
        promises.push(authUserPromise.then((authUser) => {
          return {
            nickname: userData.nickname,
            kills: userData.kills || 0,
            deaths: userData.deaths || 0,
            lastSignInTime: authUser.metadata.lastSignInTime,
            creationTime: authUser.metadata.creationTime,
          };
        }));
      });

      // Wait for all promises to resolve before sending the response
      const rankingData = await Promise.all(promises);

      return rankingData;
    } else {
      return [];
    }
  } catch (error) {
    console.error(error);
    throw new Error('Internal server error');
  }
}

router.get('/ranking', async (req, res) => {
  try {
    const rankingData = await fetchRankingData('kills');
    res.status(200).json({ ranking: rankingData.reverse() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/ranking/deaths', async (req, res) => {
  try {
    const rankingData = await fetchRankingData('deaths');
    res.status(200).json({ ranking: rankingData.reverse() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/ranking/kills', async (req, res) => {
  try {
    const rankingData = await fetchRankingData('kills');
    res.status(200).json({ ranking: rankingData.reverse() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
