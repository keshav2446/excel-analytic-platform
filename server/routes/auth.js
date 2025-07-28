const express = require("express");
const router = express.Router();
const { registerUser, loginUser, verifyEmail } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

// Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify", verifyEmail);

router.get("/dashboard", protect, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}, you are authenticated!` });
});

module.exports = router;
