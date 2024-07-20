const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../')));

// Telegram login authentication
app.get('/auth', async (req, res) => {
    try {
        const { id, first_name, last_name, username, photo_url, auth_date, hash } = req.query;
        // Perform server-side validation here if necessary
        // Redirect to the Home_Screen1.html or handle the user data as needed
        res.redirect('/Home_Screen1.html');
    } catch (error) {
        console.error('Error during Telegram authentication:', error);
        res.status(500).send('Authentication failed');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
