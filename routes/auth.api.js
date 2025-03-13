const express = require('express');
const router = express.Router();
const authController = require('../controller/auth/authController');

router.post('/login', authController.loginWithEmail);
router.post('/google', authController.loginWithGoogle);

module.exports = router;
