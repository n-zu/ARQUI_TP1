const Client = require('hot-shots');

const hotshotsClient = new Client({
    host: 'graphite',
    port: 8125,
    prefix: 'internal_api_',
});

module.exports = hotshotsClient;