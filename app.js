const express = require('express');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } = require('firebase/auth');
const firebaseConfig = require('./conf'); // Import configuration from conf.js

// Firebase initialization
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const server = express();
const PORT = 3000;

server.use(express.json());

// Registering new users
server.post('/signup', (req, res) => {
  const { email, password } = req.body;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // User successfully registered
      const user = userCredential.user;
      console.log(user);
      res.status(200).send(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
      res.status(500).send(errorMessage);
    });
});

// Logging in existing users
server.post('/signin', (req, res) => {
  const { email, password } = req.body;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // User successfully logged in
      const user = userCredential.user;
      console.log(user);

      // Send a JSON response indicating successful login
      res.status(200).json({ user });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);

      // Send a JSON response indicating the error
      res.status(500).json({ error: errorMessage });
    });
});

// Authentication state observer
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User logged in
    const uid = user.uid;
    console.log(uid);
  } else {
    // User signed out
    console.log('User signed out');
  }
});

server.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'profile.html'));
});

// Endpoint to retrieve user data for the profile page
server.get('/profile-data', (req, res) => {
  const user = auth.currentUser;

  if (user) {
    // Send user data as JSON response, including photoURL, registration time, and last sign-in time
    res.status(200).json({
      email: user.email,
      uid: user.uid,
      photoURL: user.photoURL || null,
      registrationTime: user.metadata.creationTime,
      lastSignInTime: user.metadata.lastSignInTime,
      // Add more user data as needed
    });
  } else {
    // If the user is not authenticated, send an error response
    res.status(401).json({ error: 'User not authenticated' });
  }
});

server.get('/signin', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
