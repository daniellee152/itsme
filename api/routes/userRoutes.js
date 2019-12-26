const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

//auth
router.post('/signup', authController.signup);
router.post('/login', authController.login);

//user
router.route('/').get(userController.getAllUsers);
router.route('/:id').get(authController.protect, userController.getUser);

module.exports = router;
