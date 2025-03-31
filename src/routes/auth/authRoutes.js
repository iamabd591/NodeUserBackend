const {
  resetPassword,
  resetEmail,
  deleteUser,
  verifyOtp,
  signIn,
  signUp,
  getOtp,
  toggleBanUser,
} = require("../../controllers/auth/authControllers.js");

const express = require("express");
const authRouter = express.Router();

authRouter.post("/signUp", signUp);
authRouter.post("/signIn", signIn);
authRouter.post("/get-otp", getOtp);
authRouter.post("/isBan", toggleBanUser);
authRouter.delete("/delete", deleteUser);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/reset-email", resetEmail);
authRouter.post("/reset-passwrod", resetPassword);

module.exports = authRouter;
