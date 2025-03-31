const UserPreferences = require("../../model/preferences/user_PreferencesModel");
const User = require("../../model/auth/authModel");
const validator = require("validator");

const addPreferences = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, preferences } = req.body;

    if (!email || !preferences) {
      return res.status(400).json({ error: "Required Fields Are Missing" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Email Format Is Not Valid" });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ error: "User Not Found" });
    }

    if (existingUser.isBan) {
      return res.status(403).json({ error: "Your Account Is Banned" });
    }

    if (!existingUser.isVerified) {
      return res.status(403).json({ error: "Your Account Is Not Verified" });
    }

    const preference = await UserPreferences.findOneAndUpdate(
      { userId: existingUser._id },
      { ...preferences, userId: existingUser._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res
      .status(200)
      .json({ message: "Preferences Added Successfully", preference });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Internal Server Error: ${error.message}` });
  }
};

const getPreferences = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Required Field Is Missing" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Email Format Is Not Valid" });
    }

    const existingUser = await User.findOne({ email }).select("_id");

    if (!existingUser) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const userPreferences = await UserPreferences.findOne({
      userId: existingUser._id,
    });

    if (!userPreferences) {
      return res.status(404).json({ message: "User Has No Preferences" });
    }
    return res
      .status(200)
      .json({ message: "User Preferences", preferences: userPreferences });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Internal Server Error: ${error.message}` });
  }
};

const updatePreferences = async (req, res) => {
  //   console.log(req.body);
  try {
    const { email, preferences } = req.body;

    if (!email || !preferences) {
      return res.status(400).json({ error: "Required Fields Are Missing" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Email Format Is Not Valid" });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ error: "User Not Found" });
    }

    if (existingUser.isBan) {
      return res.status(403).json({ error: "Your Account Is Banned" });
    }

    if (!existingUser.isVerified) {
      return res.status(403).json({ error: "Your Account Is Not Verified" });
    }

    const updatedPreferences = await UserPreferences.findOneAndUpdate(
      { userId: existingUser._id },
      { $set: preferences },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      message: "Preferences Updated Successfully",
      preferences: updatedPreferences,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Internal Server Error: ${error.message}` });
  }
};

const deletePreferences = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Required Fields Are Missing" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Email Format Is Not Valid" });
    }

    const existingUser = await User.findOne({ email });
    console.log(existingUser);

    if (!existingUser) {
      return res.status(404).json({ error: "User Not Found" });
    }
    console.log(existingUser._id);
    const preference = await UserPreferences.findByIdAndDelete(
      existingUser._id
    );
    return res
      .status(200)
      .json({ message: "Preferences Deleted Successfully", preference });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Internal Server Error: ${error.message}` });
  }
};

module.exports = {
  addPreferences,
  getPreferences,
  deletePreferences,
  updatePreferences,
};
