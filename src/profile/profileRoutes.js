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
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const database = admin.database();
const router = express.Router();

// Middleware to check authentication
function authenticateUser(req, res, next) {
  const user = auth.currentUser;

  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).json({ error: 'User not authenticated' });
  }
}

// Routes requiring authentication
router.get('/profile-data', authenticateUser, async (req, res) => {
  try {
    const user = req.user;

    // Получение данных пользователя
    const userReference = database.ref('users').child(user.uid);
    const userSnapshot = await userReference.once('value');

    if (!userSnapshot.exists()) {
      return res.status(401).json({ error: 'User not found' });
    }

    const userData = userSnapshot.val();
    const nickname = userData.nickname || '';
    const totalGameTime = userData.totalGameTime || 0;
    const baseBalance = userData.baseBalance || 0;
    const donateBalance = userData.donateBalance || 0;
    const kills = userData.kills || 0;
    const death = userData.death || 0;
    const role = userData.role || 0;


    const friendsList = userData.friends && userData.friends.uids ? userData.friends.uids.filter(uid => uid !== null) : [];

    res.status(200).json({
      email: user.email,
      photoURL: user.photoURL || null,
      registrationTime: user.metadata.creationTime,
      lastSignInTime: user.metadata.lastSignInTime,
      nickname: nickname,
      totalGameTime: totalGameTime,
      baseBalance: baseBalance,
      donateBalance: donateBalance,
      kills: kills,
      death: death,
      friends: friendsList,
      role: role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/profile-data/islogined', authenticateUser, (req, res) => {
  const user = auth.currentUser;

  if (user) {
    res.status(200).json({ isLoggedin: true });
  } else {
    res.status(200).json({ isLoggedin: false });
  }
});

router.post('/profile-data/logout', authenticateUser, (req, res) => {
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

      // Fetch friend nicknames
      const friendNicknames = await Promise.all(
        (userData.friends && userData.friends.uids) || []
      );

      res.status(200).json({
        lastSignInTime: authUser.metadata.lastSignInTime,
        creationTime: authUser.metadata.creationTime,
        nickname: userData.nickname,
        kills: userData.kills,
        deaths: userData.deaths,
        totalGameTime: userData.totalGameTime,

        friends: friendNicknames,
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/profile-data/search-by-uid', async (req, res) => {
  try {
    const uid = req.query.uid;

    if (!uid) {
      return res.status(400).json({ error: 'UID parameter is missing' });
    }

    const userSnapshot = await database.ref('users').child(uid).once('value');

    if (userSnapshot.exists()) {
      const userData = userSnapshot.val();
      
      res.status(200).json({
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

router.get('/profile-data/search-by-nickname', async (req, res) => {
  try {
    const nickname = req.query.nickname;

    if (!nickname) {
      return res.status(400).json({ error: 'Nickname parameter is missing' });
    }

    const usersSnapshot = await database.ref('users').orderByChild('nickname').equalTo(nickname).once('value');

    if (usersSnapshot.exists()) {
      const userUID = Object.keys(usersSnapshot.val())[0];

      res.status(200).json({
        uid: userUID,
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.post('/profile-data/addtofriend/:uid', authenticateUser, async (req, res) => {
  try {
    const friendUid = req.params.uid;
    const myUid = req.user.uid;

    // Check if the friend UID is provided
    if (!friendUid) {
      return res.status(400).json({ error: 'Friend UID parameter is missing' });
    }

    // Check if the friend UID exists in the database
    const friendSnapshot = await database.ref('users').child(friendUid).once('value');
    if (!friendSnapshot.exists()) {
      return res.status(404).json({ error: 'Friend not found' });
    }

    // Update the friend list for the currently authenticated user
    const myUserReference = database.ref('users').child(myUid);
    const myUserSnapshot = await myUserReference.once('value');
    const myUserData = myUserSnapshot.val();

    if (!myUserData.friends) {
      myUserData.friends = { uids: [] };
    }

    if (!myUserData.friends.uids.includes(friendUid)) {
      myUserData.friends.uids.push(friendUid);
    }

    await myUserReference.update({ friends: myUserData.friends });

    res.status(200).json({ message: 'Friend added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.post('/profile-data/removefriend/:uid', authenticateUser, async (req, res) => {
  try {
    const friendUid = req.params.uid;
    const myUid = req.user.uid;

    // Check if the friend UID is provided
    if (!friendUid) {
      return res.status(400).json({ error: 'Friend UID parameter is missing' });
    }

    // Check if the friend UID exists in the database
    const friendSnapshot = await database.ref('users').child(friendUid).once('value');
    if (!friendSnapshot.exists()) {
      return res.status(404).json({ error: 'Friend not found' });
    }

    // Remove the friend from the friend list for the currently authenticated user
    const myUserReference = database.ref('users').child(myUid);
    const myUserSnapshot = await myUserReference.once('value');
    const myUserData = myUserSnapshot.val();

    if (myUserData.friends && myUserData.friends.uids) {
      myUserData.friends.uids = myUserData.friends.uids.filter(uid => uid !== friendUid);
    }

    await myUserReference.update({ friends: myUserData.friends });

    res.status(200).json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
