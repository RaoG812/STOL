const express = require('express');
const session = require('express-session');
const TelegramLoginWidget = require('telegram-login-widget');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session management
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } // Use true if using HTTPS
}));

// Serve static files
app.use(express.static('public'));

// Endpoint to handle Telegram login
app.get('/auth', (req, res) => {
    const user = req.query;

    // Validate the Telegram login
    if (TelegramLoginWidget.validateLogin(user)) {
        // Save user information in session
        req.session.user = user;
        res.redirect('/Home_Screen1.html'); // Redirect to the home page or wherever you need
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
