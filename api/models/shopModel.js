const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  title: {
    type: String,
    required: ['true', 'Collection need a title']
  },
  routeName: String,
  items: [
    {
      name: {
        type: String,
        required: ['true', 'Item need to have a name']
      },
      imageUrl: String,
      price: {
        type: Number,
        required: ['true', 'An item need to have a price']
      }
    }
  ]
});

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
