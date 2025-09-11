const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } = require("../utils/resendEmail");
const express = require("express");
const router = express.Router();

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

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // create new user with email verification required
    const newUser = new User({
      firstName,
      lastName,
      organization,
      username,
      email,
      password: hashedPassword,
      role,
      isVerified: false, // Require email verification
      verificationToken,
    });

    await newUser.save();

    // Send verification email using Resend API
    try {
      await sendVerificationEmail(email, verificationToken);
      res.status(201).json({
        message: "User registered successfully. Please check your email to verify your account.",
        email: email
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Delete the user if email sending fails
      await User.findByIdAndDelete(newUser._id);
      return res.status(500).json({
        message: "Registration failed. Could not send verification email. Please try again."
      });
    }
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

    // Send welcome email after successful verification
    try {
      await sendWelcomeEmail(user.email, user.firstName);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the verification if welcome email fails
    }

    res.status(200).json({
      message: "Email verification successful! Welcome email sent. Please login to continue.",
      user: {
        email: user.email,
        userName: user.username,
        firstName: user.firstName
      },
    });
  } catch (error) {
    console.error("error for verification email ---->>", error);
    res
      .status(500)
      .json({ message: "Server error during email verification." });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({ 
        message: "Please verify your email first", 
        needsVerification: true,
        email: user.email 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = verificationToken;
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken);
      res.status(200).json({
        message: "Verification email sent successfully. Please check your email.",
        email: email
      });
    } catch (emailError) {
      console.error('Failed to resend verification email:', emailError);
      return res.status(500).json({
        message: "Failed to send verification email. Please try again."
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUserId = req.user.id; // From auth middleware

    // Check if user exists
    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    // Security check: Users can only delete their own account
    // or if they have admin privileges (you can modify this logic as needed)
    if (requestingUserId !== userId) {
      return res.status(403).json({ 
        message: "Forbidden: You can only delete your own account" 
      });
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    // TODO: Also delete related data (Excel files, analyses, etc.)
    // You might want to add cascade deletion for related documents

    res.status(200).json({
      message: "User account deleted successfully",
      deletedUser: {
        id: userToDelete._id,
        email: userToDelete.email,
        username: userToDelete.username
      }
    });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({ 
        message: "If an account with that email exists, a password reset link has been sent." 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    
    // Set reset token and expiration (1 hour)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset email
    try {
      await sendPasswordResetEmail(email, resetToken);
      res.status(200).json({
        message: "If an account with that email exists, a password reset link has been sent.",
        email: email
      });
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
      // Clear the reset token if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      
      return res.status(500).json({
        message: "Failed to send password reset email. Please try again."
      });
    }
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      message: "Password reset successful. You can now login with your new password.",
      user: {
        email: user.email,
        username: user.username
      }
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: "Server error" });
  }
};

const resetPasswordPage = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).send(`
        <html>
          <head><title>Invalid Reset Link</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1>Invalid Reset Link</h1>
            <p>The password reset link is invalid or missing the token.</p>
          </body>
        </html>
      `);
    }

    // Check if token is valid
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).send(`
        <html>
          <head><title>Invalid or Expired Reset Link</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1>Invalid or Expired Reset Link</h1>
            <p>The password reset link is invalid or has expired.</p>
            <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/forgot-password">Request a new reset link</a></p>
          </body>
        </html>
      `);
    }

    // Return a simple password reset form
    res.send(`
      <html>
        <head>
          <title>Reset Password - Excel Analytics Platform</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 500px; margin: 50px auto; padding: 20px; }
            .form-group { margin-bottom: 15px; }
            label { display: block; margin-bottom: 5px; font-weight: bold; }
            input[type="password"] { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
            button { background-color: #007bff; color: white; padding: 12px 30px; border: none; border-radius: 4px; cursor: pointer; }
            button:hover { background-color: #0056b3; }
            .message { margin-top: 15px; padding: 10px; border-radius: 4px; }
            .error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
            .success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
          </style>
        </head>
        <body>
          <h1>Reset Your Password</h1>
          <p>Enter your new password below:</p>
          <form id="resetForm">
            <div class="form-group">
              <label for="password">New Password:</label>
              <input type="password" id="password" name="password" required minlength="6">
            </div>
            <div class="form-group">
              <label for="confirmPassword">Confirm Password:</label>
              <input type="password" id="confirmPassword" name="confirmPassword" required minlength="6">
            </div>
            <button type="submit">Reset Password</button>
          </form>
          <div id="message"></div>
          
          <script>
            document.getElementById('resetForm').addEventListener('submit', async function(e) {
              e.preventDefault();
              
              const password = document.getElementById('password').value;
              const confirmPassword = document.getElementById('confirmPassword').value;
              const messageDiv = document.getElementById('message');
              
              if (password !== confirmPassword) {
                messageDiv.innerHTML = '<div class="message error">Passwords do not match!</div>';
                return;
              }
              
              if (password.length < 6) {
                messageDiv.innerHTML = '<div class="message error">Password must be at least 6 characters long!</div>';
                return;
              }
              
              try {
                const response = await fetch('/api/auth/reset-password', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    token: '${token}',
                    password: password
                  })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                  messageDiv.innerHTML = '<div class="message success">' + data.message + '</div>';
                  document.getElementById('resetForm').style.display = 'none';
                } else {
                  messageDiv.innerHTML = '<div class="message error">' + data.message + '</div>';
                }
              } catch (error) {
                messageDiv.innerHTML = '<div class="message error">An error occurred. Please try again.</div>';
              }
            });
          </script>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Reset password page error:', err);
    res.status(500).send(`
      <html>
        <head><title>Server Error</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1>Server Error</h1>
          <p>An error occurred while processing your request.</p>
        </body>
      </html>
    `);
  }
};

module.exports = { registerUser, verifyEmail, loginUser, resendVerificationEmail, deleteUser, forgotPassword, resetPassword, resetPasswordPage };
