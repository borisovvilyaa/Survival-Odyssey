// src/profile/profileRoutes.js
const express = require('express');
const auth = require('../auth/firebase');

const router = express.Router();

router.get('/profile-data', (req, res) => {
  const user = auth.currentUser;

  if (user) {
    res.status(200).json({
      email: user.email,
      uid: user.uid,
      photoURL: user.photoURL || null,
      registrationTime: user.metadata.creationTime,
      lastSignInTime: user.metadata.lastSignInTime,
    });
  } else {
    res.status(401).json({ error: 'User not authenticated' });
  }
});

router.get('/profile-data/islogined', (req, res) => {
    const user = auth.currentUser;
  
    if (user) {
      res.status(200).json({ isLoggedin: true });
    } else {
      res.status(200).json({ isLoggedin: false });
    }
  });
router.post('/logout', (req, res) => {
    auth.signOut()
      .then(() => {
        res.status(200).json({ message: 'Logout successful' });
      })
      .catch((error) => {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
});
module.exports = router;
