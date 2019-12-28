const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

//auth
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//user
router.route('/').get(userController.getAllUsers);
router.route('/:id').get(authController.protect, userController.getUser);

module.exports = router;
