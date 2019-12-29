const Shop = require('../models/shopModel');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

//////////******* CONNECT TO MONGODB *******//////////
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful'));

// Read Json files
const collections = fs.readFileSync('shop_data.json', 'utf-8');

// Import Data to DB
const importData = async () => {
  try {
  } catch (err) {
    console.log(err);
  }
};
