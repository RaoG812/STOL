const { URLSearchParams } = require('url');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const XATA_API_KEY = 'xau_sAKUOpYM0Fnw1YdpiK3cvVEubLpocjh12'; // Replace with your actual Xata API key
const DATABASE_URL = 'https://raog812-s-workspace-ot2f70.ap-southeast-2.xata.sh/db/stol-db:main';

// Helper function to fetch from Xata
const xataFetch = async (url, options) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Endpoint to handle Telegram authentication
module.exports = async (req, res) => {
  try {
    const { query_id, user } = req.body;

    // Validate the Telegram data
    if (!query_id || !user) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    const { id, first_name, last_name, username } = user;

    // Check if the user already exists in the database
    const checkUserOptions = {
      method: 'POST',
      headers: { Authorization: `Bearer ${XATA_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        columns: ["first_name", "last_name", "telegram_id", "telegram_username"],
        filter: {
          "telegram_id": id
        }
      })
    };
    const checkUser = await xataFetch(`${DATABASE_URL}/tables/stol/query`, checkUserOptions);

    if (checkUser.records && checkUser.records.length > 0) {
      // User exists, handle redirect or response accordingly
      return res.redirect('https://stol-app.vercel.app'); // Replace with your post-login URL
    } else {
      // User does not exist, insert new record
      const insertUserOptions = {
        method: 'POST',
        headers: { Authorization: `Bearer ${XATA_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name,
          last_name,
          telegram_id: id,
          telegram_username: username
        })
      };
      await xataFetch(`${DATABASE_URL}/tables/stol/data?columns=id`, insertUserOptions);

      // Redirect to a different page after successful login
      res.redirect('https://stol-app.vercel.app'); // Replace with your post-login URL
    }
  } catch (error) {
    console.error('Error handling authentication:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
