const fetch = require('node-fetch');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end(); // Method Not Allowed
    }

    const XATA_API_KEY = process.env.XATA_API_KEY; // Use environment variables
    const XATA_ENDPOINT = 'https://RaoG812-s-workspace-ot2f70.ap-southeast-2.xata.sh/db/stol-db:main/tables/stol';

    const { id, first_name, last_name, username } = req.body;

    try {
        // Check if the user already exists
        const checkResponse = await fetch(`${XATA_ENDPOINT}?filter[telegram_id]=${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${XATA_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        const existingUser = await checkResponse.json();

        if (existingUser.data.length > 0) {
            return res.status(200).json({ status: 'success', message: 'User already logged in' });
        }

        // Insert new user
        const postResponse = await fetch(XATA_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${XATA_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_name,
                last_name,
                telegram_id: id,
                telegram_username: username
            })
        });
        const result = await postResponse.json();

        return res.status(200).json(result);

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
