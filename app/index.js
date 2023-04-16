const express = require('express');
const dotenv = require('dotenv');
const metar = require('./src/routes/metar')
const app = express();

dotenv.config();


// Ping route
app.get('/ping', async (req, res) => {
    res.send('Pong!');
});

app.get('/metar', metar);

// Start the server
app.listen(process.env.PORT, () => {
    console.log('Server started on port 3000');
});