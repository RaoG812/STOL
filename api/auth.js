import fetch from 'node-fetch';

const XATA_API_KEY = 'xau_sAKUOpYM0Fnw1YdpiK3cvVEubLpocjh12';  // Replace with your actual API key
const API_URL = 'https://raog812-s-workspace-ot2f70.ap-southeast-2.xata.sh/db/stol-db:main/tables/stol/data';
const AUTH_HEADER = { Authorization: `Bearer ${XATA_API_KEY}`, 'Content-Type': 'application/json' };

// Function to check if a user is already in the database
async function checkUserExists(telegramId) {
  const response = await fetch(`${API_URL}?filter=telegram_id=${telegramId}`, {
    method: 'GET',
    headers: AUTH_HEADER
  });

  const data = await response.json();
  return data.length > 0;  // Returns true if user exists
}

// Function to insert a new user into the database
async function insertUser(userData) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: AUTH_HEADER,
    body: JSON.stringify(userData)
  });

  const data = await response.json();
  return data;  // Returns the inserted record
}

// Main handler for authentication
export default async function handler(req, res) {
  try {
    // Extract user data from request
    const userData = req.body;  // Ensure that req.body contains the necessary fields

    // Check if user already exists
    const userExists = await checkUserExists(userData.telegram_id);

    if (!userExists) {
      // If user does not exist, insert them into the database
      const insertedUser = await insertUser(userData);
      res.status(201).json(insertedUser);  // Return the inserted user record
    } else {
      res.status(200).json({ message: 'User already logged in' });
    }
  } catch (err) {
    console.error('Error processing request:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
