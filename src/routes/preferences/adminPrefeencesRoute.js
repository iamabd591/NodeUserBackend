const {
  getAllPreferences,
  managePreferences,
} = require("../../controllers/preferences/preferencesController");
const express = require("express");
const preferencesRouter = express.Router();

preferencesRouter.post("/get_all_preferences", getAllPreferences);
preferencesRouter.post("/manage_preferences", managePreferences);

module.exports = preferencesRouter;
