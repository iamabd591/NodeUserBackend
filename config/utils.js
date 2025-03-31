const cloudinary = require("cloudinary").v2;
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const axios = require("axios");
const otpCache = new Map();
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.MAILER_HOST,
  port: process.env.MAILER_PORT,
  secure: process.env.MAILER_SECURE,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS,
  },
});

const sendOtpToEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.MAILER_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

const generateOtp = () => crypto.randomInt(100000, 999999).toString();

const saveOtp = (email) => {
  const otp = generateOtp();
  const expiry = Date.now() + 10 * 60 * 1000;
  otpCache.set(email, { otp, expiry });

  console.log(`Generated OTP for ${email}: ${otp}`);
  return otp;
};

const getClientIp = (req) => {
  let ip =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.socket?.remoteAddress;

  if (ip.startsWith("::ffff:")) {
    ip = ip.replace("::ffff:", "");
  }

  return ip;
};

const getUserLocation = async (ip) => {
  try {
    if (
      !ip ||
      ip.startsWith("192.168") ||
      ip.startsWith("10.") ||
      ip === "127.0.0.1" ||
      ip === "::1"
    ) {
      return null;
    }

    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    console.log("Location Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user location: ${error.message}`);
    return null;
  }
};

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = {
  getUserLocation,
  sendOtpToEmail,
  cloudinary,
  getClientIp,
  saveOtp,
  otpCache,
};
