const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    organization: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [
        "student",
        "analyst",
        "cxo",
        "data engineer",
        "data scientist",
        "devops",
        "engineer",
        "fullstack developer",
        "director",
        "product manager",
        "system architect",
        "others",
      ],
      required: true,
    },
    isVerified: {
      type: Boolean,
      enum: [0, 1], // 0 - Not Veryfied, 1 - Verified
      default: 0, // Account is Not Veryfied by default
    },
    verificationToken: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      defaultValue: Date.NOW,
    },
    updateAt: {
      type: Date,
      defaultValue: Date.NOW,
    },
  }
  // {
  //   timestamps: true,
  // }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
