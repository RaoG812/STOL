const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./auth'); // Import auth.js

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes); // Use routes defined in auth.js

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
