const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { User, Otp } = require("../models");

const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });

  if (existing) throw new Error("User already exists");

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hash
  });

  // generate OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  const otpHash = await bcrypt.hash(otp, 10);

  await Otp.create({
    userId: user._id,
    type: "register",
    otpHash,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 mins
  });

  

  return { user, otp }; // otp only for now (email later)
};

module.exports = {
  registerUser
};
