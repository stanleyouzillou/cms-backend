const dotenv = require('dotenv');
const http = require('http');

dotenv.config();

const app = require('./app');
const dbConnnect = require('./config/dbConfig');
const User = require('./models/User');

const PORT = process.env.PORT || 8000;
const DB_URL = process.env.DB_URL.replace('<password>', process.env.PASSWORD);

dbConnnect(DB_URL);
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
