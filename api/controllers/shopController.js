const Shop = require('../models/shopModel');
const catchAsync = require('../utils/catchAsync');

exports.getCollections = catchAsync(async (req, res, next) => {
  const collections = await Shop.find();
  res.status(200).json({
    status: 'success',
    data: collections
  });
});

exports.createCollections = catchAsync(async (req, res, next) => {
  const newCollection = await Shop.create(req.body);

  res.status(200).json({
    status: 'success',
    data: newCollection
  });
});

exports.getCollection = catchAsync(async (req, res, next) => {});
