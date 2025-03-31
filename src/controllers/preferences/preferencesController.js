const AdminPreferences = require("../../model/preferences/admin_PreferencesModel");
const User = require("../../model/auth/authModel");
const validator = require("validator");

const getAllPreferences = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Required Fields Are Missing" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Email Format Is Not Valid" });
    }

    const existingUsers = await User.find({ email });
    if (!existingUsers || existingUsers?.length === 0) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const admin = existingUsers[0];
    if (admin?.role !== "admin" || admin?.isBan === true) {
      return res.status(400).json({ error: "Only Admin Can Do CRUD OP" });
    }

    const preferences = await AdminPreferences.find({});
    return res.status(200).json({ message: `Admin Preferences:`, preferences });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Internal Server Error: ${error.message}` });
  }
};

const managePreferences = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Required Fields Are Missing" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Email Format Is Not Valid" });
    }

    const existingUsers = await User.find({ email });
    if (!existingUsers || existingUsers.length === 0) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const admin = existingUsers[0];
    if (admin?.role !== "admin" || admin?.isBan === true) {
      return res.status(400).json({ error: "Only Admin Can Do CRUD OP" });
    }

    const preferences = await AdminPreferences.findOneAndUpdate(
      { adminId: admin?._id },
      { ...req.body.preferences, adminId: admin?._id },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      message: preferences
        ? `Preferences Updated Successfully`
        : "Couldn't create admin preference.",
      preferences,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Internal Server Error: ${error.message}` });
  }
};

module.exports = {
  getAllPreferences,
  managePreferences,
};
