const protect = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
module.exports = router;

const { registerUser, loginUser, verifyEmail, resendVerificationEmail, deleteUser, forgotPassword, resetPassword, resetPasswordPage } = require("../controllers/authController");



// Example protected route



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
