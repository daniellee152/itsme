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
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 3,
    select: false //not include in the ouput
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm a password'],
    validate: {
      // this only works on CREATE and SAVE
      validator: function(el) {
        return el === this.password;
      },
      message: 'Password are not the same'
    }
  }
});

//middleware hash password bwt gettting data and save data to database
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  //hash pass with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = function(loginPassword, dbPassword) {
  return bcrypt.compare(loginPassword, dbPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
