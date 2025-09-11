const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPasswordPage,
  resetPassword,
  deleteUser
} = require("../controllers/authController");

// Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.post("/forgot-password", forgotPassword);
router.get("/reset-password", resetPasswordPage);
router.post("/reset-password", resetPassword);
router.delete("/user/:userId", protect, deleteUser);

router.get("/dashboard", protect, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}, you are authenticated!` });
});

module.exports = router;
