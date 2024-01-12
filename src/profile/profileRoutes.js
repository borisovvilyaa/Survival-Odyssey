// src/profile/profileRoutes.js
const express = require('express');
const auth = require('../auth/firebase');
const admin = require('firebase-admin');
require('dotenv').config();


const serviceAccount = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:process.env.FIREBASE_DATABASE_URL,
});

const database = admin.database();



const router = express.Router();

const authenticateUser = (req, res, next) => {
  const user = auth.currentUser;

  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).json({ error: 'User not authenticated' });
  }
};

router.use(authenticateUser);

router.get('/profile-data', async (req, res) => {
  try {
    const user = req.user;

    const userReference = database.ref('users').child(user.uid).child('nickname');
    const snapshot = await userReference.once('value');

    if (snapshot.exists()) {
      const nickname = snapshot.val();
      res.status(200).json({
        email: user.email,
        photoURL: user.photoURL || null,
        registrationTime: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime,
        nickname: nickname,
      });
    } else {
      res.status(401).json({ error: 'Nickname not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

router.get('/profile-data/islogined', (req, res) => {
    const user = auth.currentUser;
  
    if (user) {
      res.status(200).json({ isLoggedin: true });
    } else {
      res.status(200).json({ isLoggedin: false });
    }
  });
router.post('/profile-data/logout', (req, res) => {
    auth.signOut()
      .then(() => {
        res.status(200).json({ message: 'Logout successful' });
      })
      .catch((error) => {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
});

router.get('/profile-data/search', async (req, res) => {
  try {
    const nickname = req.query.nickname;

    if (!nickname) {
      return res.status(400).json({ error: 'Nickname parameter is missing' });
    }

    const usersSnapshot = await database.ref('users').orderByChild('nickname').equalTo(nickname).once('value');

    if (usersSnapshot.exists()) {
      const userUID = Object.keys(usersSnapshot.val())[0];
      const userReference = database.ref('users').child(userUID);
      const userSnapshot = await userReference.once('value');

      const userData = userSnapshot.val();

      // Fetch additional metadata from Firebase Authentication
      const authUser = await admin.auth().getUser(userUID);

      res.status(200).json({
        data: userData,
        email: userData.email,
        registrationTime: userData.registrationTime,
        lastSignInTime: authUser.metadata.lastSignInTime,
        creationTime: authUser.metadata.creationTime,
        nickname: userData.nickname,
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
