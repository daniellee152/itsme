const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');
const { OAuth2Client } = require('google-auth-library');

exports.signup = catchAsync(async (req, res, next) => {
  // 1) if user is existed
  const exsitUser = await User.find({ email: req.body.email });

  if (exsitUser) {
    return next(new AppError('Email is already used', 404));
  }

  // 2) User is not exsited, updata user and send token
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(201).json({
    status: 'success',
    token,
    user: newUser
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide an email and password', 400));
  }
  // 2) Check if user exits and password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email and password', 401));
  }
  // 3) If everything is oke, send it to client
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  res.status(200).json({
    status: 'success',
    token
  });
});

exports.googleSignup = catchAsync(async (req, res, next) => {
  // 1) Verify and get payload of google Auth
  const client = new OAuth2Client(
    '595159769075-feo109969di1tvgkb1s9vg6rkct98hv3.apps.googleusercontent.com'
  );
  const ticket = await client.verifyIdToken({
    idToken: req.body.token,
    audience:
      '595159769075-feo109969di1tvgkb1s9vg6rkct98hv3.apps.googleusercontent.com'
  });
  const payload = ticket.getPayload();
  const googleID = payload.sub;

  // 2) User is exits
  const exsitUser = await User.findOne({ googleID });
  if (exsitUser) {
    const token = jwt.sign({ id: exsitUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
    return res.status(200).json({
      status: 'success',
      user: exsitUser,
      token
    });
  }

  // 3) User is not exits
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    googleID: googleID
  });
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  res.status(200).json({
    status: 'success',
    user: newUser,
    token
  });
});

exports.googleLogin = catchAsync(async (req, res, next) => {
  // 1) Verify and get payload of google Auth
  const client = new OAuth2Client(
    '595159769075-feo109969di1tvgkb1s9vg6rkct98hv3.apps.googleusercontent.com'
  );
  const ticket = await client.verifyIdToken({
    idToken: req.body.token,
    audience:
      '595159769075-feo109969di1tvgkb1s9vg6rkct98hv3.apps.googleusercontent.com'
  });
  const payload = ticket.getPayload();
  const googleID = payload.sub;

  // 2) Check if  googId is correct
  const user = await await User.findOne({ googleID });
  if (!user) {
    return next(new AppError('Please sign up!', 404));
  }
  // 3) If oke, send token to client
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  res.status(200).json({
    status: 'success',
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) getting token and check of its there
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization;
  }
  if (!token) {
    return next(
      new AppError('You are not logged in. Please log in to get access', 401)
    );
  }

  // 2) Verification Token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exits
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does no longer exits', 401)
    );
  }

  // 4) Check if user changed password after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again', 401)
    );
  }
  //GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get User based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }
  // 2)Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a patch request with your new password and password confirm to: ${resetURL}. 
  \n If you did't forget your password, please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 mins)',
      message
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('there was an error sending an email. try again later', 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is a user, set the new pass
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) update passwordChangedAt property for user

  // 4) log the user in, send jwt
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(200).json({
    status: 'success',
    token
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await (await User.findById(req.user.id)).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }
  // 3) If so, update password (User.findByIdAdnUpdate will not work as intented)
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  //4)Log user in, send JWT
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(200).json({
    status: 'success',
    token
  });
});
