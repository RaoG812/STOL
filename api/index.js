const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Middleware
app.use(bodyParser.json());

// Endpoint to handle Telegram auth data
app.post('/auth', async (req, res) => {
    const { id, first_name, last_name, username } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE telegram_id = $1', [id]);

        if (result.rows.length === 0) {
            // Insert new user
            await pool.query(
                'INSERT INTO users (telegram_id, first_name, last_name, username) VALUES ($1, $2, $3, $4)',
                [id, first_name, last_name, username || null]
            );
            res.status(201).send('User added to the database.');
        } else {
            res.status(200).send('User already exists in the database.');
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
