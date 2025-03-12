const express = require('express');
const router = express.Router();
const userController = require('../controller/user/userController');
const authController = require('../controller/auth/authController');

router.post('/regist', userController.createUser);
router.get('/me', authController.authenticate, userController.getUser);

module.exports = router;
