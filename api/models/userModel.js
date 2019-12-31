const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    // required: [true, 'Please provide your password'],
    minlength: 3,
    select: false //not include in the ouput
  },
  confirmPassword: {
    type: String,
    // required: [true, 'Please provide your password'],
    validate: {
      // this only works on CREATE and SAVE
      validator: function(el) {
        return el === this.password;
      },
      message: 'Password are not the same'
    }
  },
  googleID: String,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
});

//middleware hash password bwt gettting data and save data to database
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  //hash pass with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

//middleware to update passwordChangedAt before save
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

/////////**************GLOBAL METHOD FOR USER OBJECT**************//////////
userSchema.methods.correctPassword = function(loginPassword, dbPassword) {
  return bcrypt.compare(loginPassword, dbPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimestamp;
  }
  // False means not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
