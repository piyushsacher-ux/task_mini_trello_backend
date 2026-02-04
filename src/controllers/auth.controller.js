const { authService } = require("../services");

const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);

    // TEMP: return OTP for testing (later replace with email)
    res.status(201).json({
      success: true,
      message: "User registered. Verify OTP.",
      data: {
        userId: result.user._id,
        otp: result.otp
      }
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
    await authService.verifyRegisterOtp(req.body);

    res.json({
      success: true,
      message: "Account verified successfully"
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
      token
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

const forgotPassword = async (req,res)=>{
 const result = await authService.forgotPassword(req.body);
 res.json({ success:true, data:result });
};

const resetPassword = async(req,res)=>{
 await authService.resetPassword(req.body);
 res.json({ success:true, message:"Password reset successful" });
};


module.exports = {
  register,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword
};
