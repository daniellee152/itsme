const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

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
