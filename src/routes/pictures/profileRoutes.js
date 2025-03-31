const {
  uploadProfileFile,
} = require("../../controllers/auth/fileUploadContoller");
const upload = require("../../../middleware/upload");
const express = require("express");
const profileRouther = express.Router();

profileRouther.post(
  "/upload-profile",
  upload.single("profile"),
  uploadProfileFile
);
module.exports = profileRouther;
