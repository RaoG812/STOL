const express = require('express');
const session = require('express-session');
const TelegramLoginWidget = require('telegram-login-widget');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3000;
const botToken = process.env.TELEGRAM_BOT_TOKEN; // Make sure to set this environment variable

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session management
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Use true if using HTTPS
}));

// Serve static files
app.use(express.static('public'));

// Function to validate Telegram login
function validateTelegramLogin(data) {
    const secret = crypto.createHmac('sha256', botToken).update(data.hash).digest('hex');
    const sortedData = Object.keys(data).filter(key => key !== 'hash').sort().map(key => `${key}=${data[key]}`).join('\n');
    const checkString = crypto.createHmac('sha256', botToken).update(sortedData).digest('hex');

    return checkString === secret;
}

// Endpoint to handle Telegram login
app.get('/auth', (req, res) => {
    const user = req.query;

    // Validate the Telegram login
    if (validateTelegramLogin(user)) {
        // Save user information in session
        req.session.user = user;
        res.redirect('/home'); // Redirect to the home page or wherever you need
    } else {
        res.status(401).send('Unauthorized');
    }
});

// Endpoint to serve the home page after login
app.get('/home', (req, res) => {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.send(`Welcome ${req.session.user.first_name}`);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
