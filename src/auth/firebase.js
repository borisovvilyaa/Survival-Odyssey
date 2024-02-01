// src/auth/firebase.js
const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const firebaseConfig = require('../../conf/conf');

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


module.exports = auth;
