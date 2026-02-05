const { authService } = require("../services");

const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "OTP sent to email",
      verificationToken: result.verificationToken
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    await authService.verifyRegisterOtp({
      userId: req.verifyUserId,
      otp: req.body.otp
    });

    res.json({
      success: true,
      message: "Account verified"
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};


const login = async (req, res) => {
  try {
    const token = await authService.loginUser(req.body);

    res.json({
      success: true,
      token,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  const result = await authService.forgotPassword(req.body);
  res.json({ success: true, data: result });
};

const resetPassword = async (req, res) => {
  await authService.resetPassword(req.body);
  res.json({ success: true, message: "Password reset successful" });
};

module.exports = {
  register,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
};
