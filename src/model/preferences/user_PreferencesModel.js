const mongoose = require("mongoose");

const userPreferencesSchema = new mongoose.Schema(
  {
    userId: {
      ref: "User",
      index: true,
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    age: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    language: {
      type: Object,
      required: true,
    },
    obsession: {
      type: Object,
      required: true,
    },
    religion: {
      type: String,
      required: true,
    },
    profession: {
      type: String,
      required: true,
    },
    phobias: {
      type: Object,
      required: true,
    },
    family: {
      maritalStatus: {
        type: String,
        required: true,
      },
      familyPlans: {
        type: String,
        required: true,
      },
    },
    contact: {
      videoCall: {
        type: String,
        required: true,
      },
      audioCall: {
        type: String,
        required: true,
      },
      chat: {
        type: String,
        required: true,
      },
      inperson: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

const UserPreferences = mongoose.model(
  "UserPreferences",
  userPreferencesSchema
);
module.exports = UserPreferences;
