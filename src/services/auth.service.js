const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utils");
const { User, Otp } = require("../models");
const { ERROR_CODES, createError } = require("../errors");

const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });

  if (existing) throw createError(ERROR_CODES.USER_ALREADY_EXISTS);

  const existingUsername = await User.findOne({name, isDeleted: false });
  if (existingUsername) {
    throw createError(ERROR_CODES.USERNAME_ALREADY_EXISTS);
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hash,
  });

  // generate OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  const otpHash = await bcrypt.hash(otp, 10);

  await Otp.create({
    userId: user._id,
    type: "register",
    otpHash,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  const verificationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });

  await sendMail({
    to: email,
    subject: "Verify your account",
    text: `Your OTP is ${otp}. Valid for 5 minutes.`,
  });

  return { verificationToken };

};

const verifyRegisterOtp = async ({ userId, otp }) => {
  const otpDoc = await Otp.findOne({
    userId,
    type: "register"
  });

  if (!otpDoc) throw createError(ERROR_CODES.OTP_EXPIRED);

  const valid = await bcrypt.compare(otp, otpDoc.otpHash);

  if (!valid) throw createError(ERROR_CODES.INVALID_OTP);

  await User.findByIdAndUpdate(userId, { isVerified: true });

  await Otp.deleteOne({ _id: otpDoc._id });
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email, isDeleted: false });

  if (!user) throw createError(ERROR_CODES.INVALID_CREDENTIALS);

  if (!user.isVerified) throw createError(ERROR_CODES.VERIFY_ACCOUNT);

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw createError(ERROR_CODES.INVALID_CREDENTIALS);

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return token;
};

const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email, isDeleted: false });

  if (!user) throw createError(ERROR_CODES.USER_NOT_FOUND);

  const otp = crypto.randomInt(100000, 999999).toString();
  const otpHash = await bcrypt.hash(otp, 10);

  await Otp.create({
    userId: user._id,
    type: "forgot",
    otpHash,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  return { userId: user._id, otp };
};

const resetPassword = async ({ userId, otp, newPassword }) => {
  const otpDoc = await Otp.findOne({ userId, type: "forgot" });

  if (!otpDoc) throw createError(ERROR_CODES.OTP_EXPIRED);

  const valid = await bcrypt.compare(otp, otpDoc.otpHash);

  if (!valid) throw createError(ERROR_CODES.INVALID_OTP);

  const hash = await bcrypt.hash(newPassword, 10);

  await User.findByIdAndUpdate(userId, { password: hash });

  await Otp.deleteOne({ _id: otpDoc._id });
};

module.exports = {
  registerUser,
  verifyRegisterOtp,
  loginUser,
  forgotPassword,
  resetPassword,
};
