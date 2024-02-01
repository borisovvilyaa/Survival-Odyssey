const express = require('express');
const { signInWithEmailAndPassword, onAuthStateChanged } = require('firebase/auth');
const auth = require('./firebase');

const router = express.Router();

// Middleware to handle Firebase authentication
const authenticateUser = (req, res, next) => {
  const user = req.user;

  if (user) {
    next();
  } else {
    res.status(401).json({ error: 'User not authenticated' });
  }
};

// Example signup route (uncomment if needed)
// router.post('/signup', (req, res) => {
//   const { email, password } = req.body;

//   createUserWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       const user = userCredential.user;
//       res.status(200).json({ user });
//     })
//     .catch((error) => {
//       const errorMessage = error.message;
//       res.status(500).json({ error: errorMessage });
//     });
// });

// Signin route
router.post('/signin', (req, res) => {
  const { email, password } = req.body;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      res.status(200).json({ user });
    })
    .catch((error) => {
      const errorMessage = error.message;
      res.status(500).json({ error: errorMessage });
    });
});

// Listener for auth state changes (you may want to place this appropriately within your application)
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log(uid);
  } else {
    console.log('User signed out');
  }
});

module.exports = router;
