const protect = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
module.exports = router;

const { registerUser } = require("../controllers/authController");



// Example protected route



router.post("/register", registerUser);

router.get("/dashboard", protect, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}, you are authenticated!` });
});


module.exports = router;
