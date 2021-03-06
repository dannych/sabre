const micro = require('micro');
const path = require('path');

require('dotenv').config({
    path: path.resolve(process.cwd(), './.env.production')
});

const server = micro(require('../src'));

server.listen(3000);