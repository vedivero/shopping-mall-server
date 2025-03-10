const express = require('express');
const router = express.Router();
const userController = require('../controller/user/userController');

router.post('/regist', userController.createUser);

module.exports = router;
