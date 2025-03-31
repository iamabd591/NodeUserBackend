const User = require("../../model/auth/authModel");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const {
  saveOtp,
  otpCache,
  getClientIp,
  sendOtpToEmail,
  getUserLocation,
} = require("../../../config/utils");

const signUp = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Required fields are missing" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "Email is already registered" });
  }

  const userIp = getClientIp(req);
  // console.log("Detected User IP:", userIp);
  const userLocation = await getUserLocation(userIp);
  // console.log("User Location:", userLocation);

  try {
    const hashPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({
      name,
      email,
      isBan: false,
      ipAddress: userIp,
      password: hashPassword,
      role: role ? role : "user",
      location: userLocation
        ? {
            country: userLocation.country,
            region: userLocation.regionName,
            city: userLocation.city,
            lon: userLocation.lon,
            lat: userLocation.lat,
          }
        : null,
    });

    await newUser.save();

    return res
      .status(200)
      .json({ message: "Sign up successful. Please verify your account" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Internal Server Error: ${error.message}` });
  }
};

const getOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email Is Required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Email Format Is Invalid" });
  }

  const existingtUser = await User.findOne({ email });
  if (!existingtUser) {
    return res.status(404).json({ error: "User Not Foumd" });
  }

  if (existingtUser.isVerified) {
    return res.status(400).json({ error: "User All Ready Verified" });
  }
  try {
    const otp = saveOtp(email);
    const isSend = await sendOtpToEmail(email, otp);
    if (isSend) {
      return res.status(200).json({ message: `OTP Send To Email ${email}` });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Internal Server Error ${error.message}` });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Required Fileds Are Missing" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Email Format Is Invalid" });
  }

  const existingtUser = await User.findOne({ email });

  if (!existingtUser) {
    return res.status(404).json({ error: "User Not Found" });
  }

  if (existingtUser.isVerified === true) {
    return res.status(400).json({ error: "Account Is Already Verified" });
  }
  try {
    const otpData = otpCache.get(email);

    if (!otpData) {
      return res.status(404).json({ error: "OTP Not Found" });
    }

    if (otpData.otp !== otp) {
      return res.status(400).json({ error: "OTP Is Invalid" });
    }
    console.log("Otp Verified");
    existingtUser.isVerified = true;
    await existingtUser.save();
    otpCache.delete(email);
    return res.status(200).json({ message: "User Verified Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Internal Server Error ${error.message}` });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Required Fileds Are Missing" });
  }
  const userExist = await User.findOne({ email });
  if (!userExist) {
    return res.status(404).json({ error: "Email Not Found" });
  }
  if (!userExist.isVerified) {
    return res
      .status(400)
      .json({ error: "Please Verified Your Account To Sign In" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password Must Be 8 Characters Long" });
  }
  const isMatchPassword = await bcryptjs.compare(password, userExist.password);
  if (!isMatchPassword) {
    return res.status(404).json({ error: "Invalid Password" });
  }
  try {
    const { password, ...userData } = userExist.toObject();
    return res
      .status(200)
      .json({ message: "Login Successfully", data: userData });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Inetrnal Server error ${error.messsage}` });
  }
};

const resetPassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({ error: "Required Fileds Are Missing" });
  }
  const userExist = await User.findOne({ email });
  if (!userExist) {
    return res.status(404).json({ error: "User Not Found" });
  }

  if (!userExist.isVerified) {
    return res
      .status(400)
      .json({ error: "Please Verified Your Account To Reset Password" });
  }
  const validatePassword = await bcryptjs.compare(
    oldPassword,
    userExist.password
  );
  if (!validatePassword) {
    return res.status(404).json({ error: "Invalid Old Password" });
  }
  try {
    const newHashPassword = await bcryptjs.hash(newPassword, 10);
    userExist.password = newHashPassword;
    await userExist.save();
    return res.status(200).json({ message: "Password Updated Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Internal Server Error ${error.message}` });
  }
};

const resetEmail = async (req, res) => {
  const { oldEmail, newEmail, password } = req.body;
  if (!oldEmail || !newEmail || !password) {
    return res.status(400).json({ error: "Required Fileds Are Missing" });
  }
  if (oldEmail === newEmail) {
    return res.status(400).json({ error: "Old And New Email is Same" });
  }
  const email = oldEmail;
  const userExist = await User.findOne({ email });
  if (!userExist) {
    return res.status(404).json({ error: "User Not Found" });
  }

  if (!userExist.isVerified) {
    return res
      .status(400)
      .json({ error: "Please Verified Your Account To Reset Email" });
  }

  const validatePassword = await bcryptjs.compare(password, userExist.password);
  if (!validatePassword) {
    return res.status(404).json({ error: "Invalid Old Password" });
  }
  try {
    userExist.email = newEmail;
    await userExist.save();
    return res.status(200).json({ message: "Email Updated Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Internal Server Error ${error.message}` });
  }
};

const deleteUser = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "User Email Is Required " });
  }
  const userExist = await User.findOne({ email });
  if (!userExist) {
    return res.status(404).json({ error: "User Not Found" });
  }

  try {
    await User.findByIdAndDelete(userExist.id);
    return res.status(200).json({ message: "User Deleted Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Internal Server Error ${error.message}` });
  }
};

const toggleBanUser = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Required Field Is Missing" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid Email Format" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ error: "User Not Found" });
    }

    existingUser.isBan = !existingUser.isBan;
    await existingUser.save();

    const message = existingUser.isBan
      ? "User Banned Successfully"
      : "User Unbanned Successfully";

    return res.status(200).json({ message });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Internal Server Error: ${error.message}` });
  }
};

module.exports = {
  signUp,
  signIn,
  getOtp,
  verifyOtp,
  deleteUser,
  resetEmail,
  resetPassword,
  toggleBanUser,
};
