const { StatusCodes } = require('http-status-codes');
const userService = require('../../services/user/userService');

const userController = {};

userController.createUser = async (req, res) => {
   try {
      const newUser = await userService.createUser(req.body);
      res.status(StatusCodes.OK).json({ message: '사용자가 생성되었습니다.', user: newUser });
   } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
   }
};

module.exports = userController;
