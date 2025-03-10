const { StatusCodes } = require('http-status-codes');
const userService = require('../../services/user/userService');
const User = require('../../models/user.model');

const userController = {};

userController.createUser = async (req, res) => {
   try {
      const newUser = await userService.createUser(req.body);
      res.status(StatusCodes.OK).json({ message: '사용자가 생성되었습니다.', user: newUser });
   } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
   }
};

userController.getUser = async (req, res) => {
   try {
      const { userId } = req;
      const user = await User.findById(userId);
      if (user) {
         return res.status(StatusCodes.OK).json({ status: 'success', user });
      }
      throw new Error('토큰 정보가 유효하지 않습니다.');
   } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
   }
};

module.exports = userController;
