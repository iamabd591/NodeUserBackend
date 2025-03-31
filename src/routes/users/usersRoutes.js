const {
  toggleFollow,
  getFollowers,
  getFollowings,
} = require("../../controllers/follow/followController");

const {
  addPreferences,
  getPreferences,
  updatePreferences,
  deletePreferences,
} = require("../../controllers/preferences/userPreferencesControllers");
const { getAllusers } = require("../../controllers/users/usersContoller");
const express = require("express");
const userRouter = express.Router();

userRouter.get("/get_all_users", getAllusers);
userRouter.post("/toggle_follow", toggleFollow);
userRouter.post("/add_preferences", addPreferences);
userRouter.post("/get_preferences", getPreferences);
userRouter.post("/delete_preferences", deletePreferences);
userRouter.post("/update_preferences", updatePreferences);
userRouter.get("/get_user_followers/:userId", getFollowers);
userRouter.get("/get_user_followings/:userId", getFollowings);

module.exports = userRouter;
