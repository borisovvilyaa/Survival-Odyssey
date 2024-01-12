// src/auth/authRoutes.js
const express = require('express');
const { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } = require('firebase/auth');
const auth = require('./firebase');

const router = express.Router();

//only for example!!

// router.post('/signup', (req, res) => {
//   const { email, password } = req.body;

//   createUserWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       const user = userCredential.user;
//       res.status(200).json({ user });
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       res.status(500).json({ error: errorMessage });
//     });
// });

router.post('/signin', (req, res) => {
  const { email, password } = req.body;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      res.status(200).json({ user });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      res.status(500).json({ error: errorMessage });
    });
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log(uid);
  } else {
    console.log('User signed out');
  }
});

module.exports = router;
