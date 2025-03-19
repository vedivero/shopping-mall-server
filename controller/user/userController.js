const { StatusCodes } = require('http-status-codes');
const userService = require('../../services/user/userService');

const userController = {};

/**
 * 새로운 사용자 생성
 * @route POST /user/regist
 * @param {Object} req - 요청 객체 (body에 사용자 정보 포함)
 * @param {Object} res - 응답 객체
 * @returns {Object} 생성된 사용자 정보 또는 오류 메시지
 */
userController.createUser = async (req, res) => {
   try {
      const newUser = await userService.createUser(req.body);
      res.status(StatusCodes.OK).json({ message: '사용자가 생성되었습니다.', user: newUser });
   } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
   }
};

/**
 * 이메일 중복 확인
 * @route POST /user/check-email
 * @param {Object} req - 요청 객체 (body에 email 포함)
 * @param {Object} res - 응답 객체
 * @returns {Object} { exists: true/false } (이메일 중복 여부)
 */
userController.checkEmailExists = async (req, res) => {
   try {
      const { email } = req.body;
      const existingUser = await userService.getUserByEmail(email);
      res.status(StatusCodes.OK).json({ exists: !!existingUser });
   } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
   }
};

/**
 * 사용자 정보 조회
 * @route GET /user/me
 * @param {Object} req - 요청 객체 (userId를 포함한 인증된 요청)
 * @param {Object} res - 응답 객체
 * @returns {Object} 사용자 정보 또는 오류 메시지
 */
userController.getUser = async (req, res) => {
   try {
      const { userId } = req;
      const user = await userService.getUserById(userId);
      res.status(StatusCodes.OK).json({ status: 'success', user });
   } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
   }
};

module.exports = userController;
