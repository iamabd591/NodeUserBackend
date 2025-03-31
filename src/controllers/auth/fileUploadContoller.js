const { cloudinary } = require("../../../config/utils");
const User = require("../../model/auth/authModel");

const uploadProfileFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { email } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!existingUser.isVerified) {
      return res
        .status(400)
        .json({ error: "Please Verify Your Account To Upload Profile" });
    }

    if (existingUser.isBan) {
      return res.status(400).json({
        error: "Your Account is Ban Contact Customer Support Service",
      });
    }
    cloudinary.uploader
      .upload_stream({ folder: "profile_pictures" }, async (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error);
          return res
            .status(500)
            .json({ error: `Image upload failed ${error.message}` });
        }

        existingUser.profileUrl = result.secure_url;
        await existingUser.save();

        res.status(200).json({
          message: "Profile updated successfully",
          profileUrl: result.secure_url,
        });
      })
      .end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
};

module.exports = {
  uploadProfileFile,
};
