const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      organization,
      username,
      email,
      password,
      role,
    } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //generate rendom token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // create new user
    const newUser = new User({
      firstName,
      lastName,
      organization,
      username,
      email,
      password: hashedPassword,
      role,
      verificationToken,
    });

    await newUser.save();

    const verficationUrl = `http://localhost:3000/auth/verify-email?token=${verificationToken}`;
    await sendEmail(
      email,
      "Verify Your Email",
      `Click to verify:${verficationUrl}`
    );

    res.status(201).json({
      message:
        "User registered successfully. Please check your email to verify your account.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Invalid or Missing token!." });
    }

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ message: "User not found in our system" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "User is alredy verified with us." });
    }

    user.isVerified = true;
    user.verificationToken = null; //remove token after use
    await user.save();

    // Optionally: Redirect to frontend confirmation page with prefilled data
    // e.g., http://frontend.com/account-verified?email=user.organizationEmail&username=user.username

    res.status(200).json({
      message: "Activation successfull. Please Login to continue",
      user: {
        email: user.email,
        userName: user.username,
      },
    });
  } catch (error) {
    console.error("error for verification email ---->>", error);
    res
      .status(500)
      .json({ message: "Server error during email verification." });
  }
};

module.exports = { registerUser, verifyEmail };
