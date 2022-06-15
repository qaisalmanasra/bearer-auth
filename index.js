'use strict';
require('dotenv').config();
let PORT = process.env.PORT || 3001;
const server = require('./src/server');

// Start up DB Server
const { db } = require('./src/auth/models/index.js');
db.sync().then(() => {
    server.startup(PORT);
  })
    .catch(console.error);
    