const db = require('mongoose');

async function dbConnect(DBURL) {
  try {
    await db.connect(DBURL);
    console.log('connected successfully');
  } catch (error) {
    console.log(error);
  }
}

module.exports = dbConnect;
