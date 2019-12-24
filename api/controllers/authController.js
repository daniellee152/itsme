const User = require('./../models/userModel');

exports.signup = async (req, res, next) => {
  const newUser = await User.create(req.body);

  try {
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser
      }
    });
  } catch (err) {
    console.log(err);
  }
};
