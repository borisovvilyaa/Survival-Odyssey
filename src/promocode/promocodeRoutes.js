const express = require('express');
const {
    Pool
} = require('pg');
const fetch = require('node-fetch');
const router = express.Router();
const admin = require('firebase-admin'); // Import Firebase admin SDK

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const database = admin.database();

// Endpoint to check promo code and nickname
router.get('/check-promocode/:nickname/:promoCode', async (req, res) => {
    try {
        // Extract parameters
        const promoCode = req.params.promoCode;
        const nickname = req.params.nickname;

        // Connect to the database using a connection pool
        const client = await pool.connect();

        try {
            // Check if the promo code exists in the promocodes table
            const promoCodeQuery = await client.query('SELECT * FROM promocodes WHERE promocode = $1', [promoCode]);

            if (promoCodeQuery.rows.length === 0) {
                // Promo code not found
                return res.status(400).json({
                    error: 'Promo code not found'
                });
            }

            const promoCodeData = promoCodeQuery.rows[0];
            const currentDate = new Date();
            console.log(promoCodeData);

            // Check promo code validity
            if (currentDate < promoCodeData.startdate || currentDate > promoCodeData.expirationdate || promoCodeData.quantity <= 0) {
                // Promo code not currently active or has no remaining uses
                return res.status(400).json({
                    error: 'Promo code is not currently active or has no remaining uses'
                });
            }

            // Check if the nickname exists using an external API
            const apiUrl = `${process.env.API_HOST}/api/profile-data/search?nickname=${nickname}`;
            const apiResponse = await fetch(apiUrl);

            if (apiResponse.status !== 200) {
                // Nickname not found or invalid response from external API
                return res.status(400).json({
                    error: 'Nickname not found or invalid response from external API'
                });
            }

            const checkNicknameQuery = await client.query('SELECT * FROM user_promo_submissions WHERE nickname = $1 AND promo_id = $2', [nickname, promoCodeData.id]);

            if (checkNicknameQuery.rows.length > 0) {
                // Nickname has already used this promo code
                return res.status(400).json({
                    error: 'Nickname has already used this promo code'
                });
            }

            // Both promo code and nickname are valid
            console.log('OK: Promo code and nickname are valid');
            await client.query('UPDATE promocodes SET quantity = quantity - 1 WHERE promocode = $1', [promoCode]);

            // Insert a record into the user_promo_submissions table
            await client.query('INSERT INTO user_promo_submissions (nickname, promo_id) VALUES ($1, $2)', [nickname, promoCodeData.id]);




            console.log(nickname);
            const uidApiUrl = `${process.env.API_HOST}/api/profile-data/search-by-nickname?nickname=${nickname}`;
            console.log(uidApiUrl);
            const uidApiResponse = await fetch(uidApiUrl);
            const dataUid = await uidApiResponse.json()
            console.log(dataUid);

            if (uidApiResponse.status !== 200) {
                // Nickname not found or invalid response from external API
                return res.status(400).json({
                    error: 'Nickname not found or invalid response from external API'
                });
            }

            const userFirebasePath = `/users/${dataUid.uid}`;
            console.log('userFirebasePath:', userFirebasePath);

            const userFirebaseSnapshot = await database.ref(userFirebasePath).once('value');
            const userFirebaseData = userFirebaseSnapshot.val();
            console.log('userFirebaseData:', userFirebaseData);

            if (!userFirebaseData) {
                // Handle the case where userFirebaseData is null
                console.error('User data not found');
                return res.status(400).json({
                    error: 'User data not found'
                });
            }




            // Assuming the promo code gives 50 coins, you can adjust this value accordingly
            const promoCoinsToAdd = promoCodeData.quantity;

            // Use optional chaining to safely access donateBalance
            const currentDonateBalance = userFirebaseData.donateBalance ?? 0;
            const updatedDonateBalance = currentDonateBalance + promoCoinsToAdd;

            // Use optional chaining to safely access baseBalance
            const currentBaseBalance = userFirebaseData.baseBalance ?? 0;
            const updatedBaseBalance = currentBaseBalance; // No change in baseBalance

            await database.ref(userFirebasePath).update({
                donateBalance: updatedDonateBalance,
                baseBalance: updatedBaseBalance, // Update baseBalance if needed
            });

            return res.status(200).json({
                message: 'Promotion code successfully applied'
            });


        } finally {
            // Release the database connection
            client.release();
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
});

module.exports = router;