const { authService } = require("../services");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "OTP sent to email",
      verificationToken: result.verificationToken,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const verifyOtp = async (req, res) => {
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
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const token = await authService.loginUser(req.body);

    res.status(StatusCodes.OK).json({
      success: true,
      token
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const result = await authService.forgotPassword(req.body);

    res.status(StatusCodes.OK).json({
      success: true,
      data: result
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    await authService.resetPassword(req.body);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Password reset successful"
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  register,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
};
