const { authService } = require("../services");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "OTP sent to email",
      verificationToken: result.verificationToken,
    });
  } catch (err) {
     next(err);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    await authService.verifyRegisterOtp({
      userId: req.verifyUserId,
      otp: req.body.otp,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Account verified",
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const token = await authService.loginUser(req.body);

    res.status(StatusCodes.OK).json({
      success: true,
      token
    });
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const result = await authService.forgotPassword(req.body);

    res.status(StatusCodes.OK).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(req.body);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Password reset successful"
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
};
