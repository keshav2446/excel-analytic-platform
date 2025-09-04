const express = require("express");
const router = express.Router();
<<<<<<< HEAD
module.exports = router;

const { registerUser, loginUser, verifyEmail, resendVerificationEmail, deleteUser, forgotPassword, resetPassword, resetPasswordPage } = require("../controllers/authController");
=======
const { registerUser, loginUser, verifyEmail } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
>>>>>>> 3aa6953d9b7f40763de79664e18d5fedcfacc8e6

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
