// src/auth/firebase.js
const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const firebaseConfig = require('../../conf/conf');

// Add the `firebaseConfig` as options when initializing the app
const app = initializeApp(firebaseConfig, 'login'); // Replace 'your-app-name' with a unique identifier for your app
const auth = getAuth(app);

module.exports = auth;
