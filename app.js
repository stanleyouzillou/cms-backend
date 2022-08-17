const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

fs.readdirSync('./routes').map((r) =>
  app.use('/api/v1', require('./routes/' + r))
);

module.exports = app;
