const express = require('express');
const dotenv = require('dotenv');
const app = express();

dotenv.config();


// Ping route
app.get('/ping', (req, res) => {
    res.send('Pong!');
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log('Server started on port 3000');
});
