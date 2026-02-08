const express = require("express");
const router = express.Router();
const { authController } = require("../controllers");
const { authValidator } = require("../validators");
const { validate,verifyToken,authMiddleware } = require("../middleware");


router.post(
  "/register",
  validate(authValidator.registerSchema),
  authController.register,
);


router.post(
  "/verify-otp",
  verifyToken,
  validate(authValidator.verifyOtpSchema),
  authController.verifyOtp,
);


router.post(
  "/login",
  validate(authValidator.loginSchema),
  authController.login,
);

router.post(
  "/forgot-password",
  validate(authValidator.forgotSchema),
  authController.forgotPassword,
);

router.post(
  "/reset-password",
  verifyToken,
  validate(authValidator.resetPasswordSchema),
  authController.resetPassword,
);

router.post("/logout", authMiddleware, authController.logout);

module.exports = router;
