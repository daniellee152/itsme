const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  title: String,
  routeName: String,
  items: [
    {
      name: String,
      imageUrl: String,
      price: Number
    }
  ]
});

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
