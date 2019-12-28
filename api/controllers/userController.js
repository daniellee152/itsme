const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    users
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const { email, name } = await User.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    user: {
      email,
      name
    }
  });
});
