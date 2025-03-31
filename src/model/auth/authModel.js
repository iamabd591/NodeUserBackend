const mongoose = require("mongoose");
const newUser = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
      minlength: 4,
    },
    email: {
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      required: true,
      unique: true,
      type: String,
    },
    password: {
      required: true,
      type: String,
      minlength: 8,
    },
    bio: {
      type: String,
      default: "",
    },
    role: {
      enum: ["user", "admin", "author"],
      default: "user",
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBan: {
      type: Boolean,
      default: false,
    },
    ipAddress: {
      trim: true,
      type: String,
      required: true,
    },
    profileUrl: {
      trim: true,
      type: String,
      default: "",
    },
    location: {
      lat: Number,
      lon: Number,
      city: String,
      region: String,
      country: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", newUser);
module.exports = User;
