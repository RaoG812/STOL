const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = 3000;
const TOKEN = '7441738058:AAFp4LGoZ6ODDcTanz7pcUoPtbQBg0V_6aw';  // Replace with your bot token

app.use(bodyParser.urlencoded({ extended: false }));

function checkSignature(query) {
    const secret = crypto.createHash('sha256').update(TOKEN).digest();
    const hash = query.hash;
    delete query.hash;
    const dataCheckString = Object.keys(query)
        .sort()
        .map(k => (`${k}=${query[k]}`))
        .join('\n');
    const hmac = crypto.createHmac('sha256', secret)
        .update(dataCheckString)
        .digest('hex');
    return hmac === hash;
}

app.get('/auth', (req, res) => {
    const isValid = checkSignature(req.query);
    if (isValid) {
        const user = req.query;
        res.send(`<h1>Sign in as ${user.first_name}</h1>`);
    } else {
        res.send('Invalid login');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
