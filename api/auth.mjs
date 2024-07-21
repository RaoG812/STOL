import fetch from 'node-fetch';

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
export default async (req, res) => {
  try {
    const { query_id, user } = req.body;

    // Validate the Telegram data
    if (!query_id || !user) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    const { id, first_name, last_name, username } = user;

    // Check if the user already exists in the database
    const checkUser = await xataFetch(`${DATABASE_URL}/tables/stol/data?where={"telegram_id":"${id}"}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${XATA_API_KEY}`, 'Content-Type': 'application/json' }
    });

    if (checkUser.length > 0) {
      // User exists, handle redirect or response accordingly
      return res.redirect('https://your-redirect-url.com'); // Replace with your post-login URL
    } else {
      // User does not exist, insert new record
      await xataFetch(`${DATABASE_URL}/tables/stol/data?columns=id`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${XATA_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name,
          last_name,
          telegram_id: id,
          telegram_username: username
        })
      });

      // Redirect to a different page after successful login
      res.redirect('https://your-redirect-url.com'); // Replace with your post-login URL
    }
  } catch (error) {
    console.error('Error handling authentication:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
