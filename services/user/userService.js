const User = require('../../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const BACKEND_URL = process.env.BACKEND_URL;

/**
 * 새로운 사용자를 생성하는 서비스 함수
 * @param {Object} userData 사용자 데이터 (email, password, name)
 * @returns {Object} 생성된 사용자 객체
 * @throws {Error} 이메일 중복 시 오류 발생
 */
const createUser = async (userData) => {
   const { email, password, name, level } = userData;

   const existingUser = await User.findOne({ email });
   if (existingUser) {
      throw new Error('이미 존재하는 이메일입니다.');
   }

   const salt = await bcrypt.genSaltSync(10);
   const hashedPassword = await bcrypt.hash(password, salt);

   const newUser = new User({
      email,
      password: hashedPassword,
      name,
      level: level ? level : 'customer',
   });
   await newUser.save();
   await sendVerificationEmail(email);

   return newUser;
};

/**
 * 이메일 인증 메일 전송
 * @param {string} email 사용자 이메일
 */
const sendVerificationEmail = async (email) => {
   const token = jwt.sign({ email }, JWT_SECRET_KEY, { expiresIn: '1h' });

   const verificationLink = `${BACKEND_URL}/api/auth/verify/email?token=${token}`;

   const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
         user: process.env.EMAIL_ADDRESS,
         pass: process.env.EMAIL_PASSWORD,
      },
   });

   const mailOptions = {
      from: EMAIL_ADDRESS,
      to: email,
      subject: '이메일 인증 요청',
      html: `<p>이메일 인증을 완료하려면 아래 링크를 클릭하세요:</p>
             <a href="${verificationLink}">${verificationLink}</a>
             <p>이 링크는 1시간 후 만료됩니다.</p>`,
   };

   await transporter.sendMail(mailOptions);
};

/**
 * 이메일로 사용자 조회
 * @param {String} email 이메일 주소
 * @returns {Object|null} 사용자 객체 또는 null
 */
const getUserByEmail = async (email) => {
   return await User.findOne({ email });
};

/**
 * 사용자 ID로 사용자 정보를 조회하는 서비스 함수
 * @param {String} userId 사용자 ID
 * @returns {Object} 사용자 객체
 * @throws {Error} 사용자 정보가 유효하지 않은 경우
 */
const getUserById = async (userId) => {
   const user = await User.findById(userId);
   if (!user) {
      throw new Error('토큰 정보가 유효하지 않습니다.');
   }
   return user;
};

module.exports = { getUserByEmail, createUser, getUserById };
