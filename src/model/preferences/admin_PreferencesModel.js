const mongoose = require("mongoose");
const admin_New_Preferences = mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    age: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
    },
    height: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
    },
    gender: {
      type: [String],
      required: true,
    },
    language: {
      type: [String],
      required: true,
    },
    obsession: {
      type: [String],
      required: true,
    },
    religion: {
      type: [String],
      required: true,
    },
    profession: {
      type: [String],
      required: true,
    },
    phobias: {
      type: [{ text: String, activeIconUrl: String, inactiveIconUrl: String }],
      required: true,
    },
    family: {
      maritalStatus: {
        type: [String],
        required: true,
      },
      familyPlans: {
        type: [String],
        required: true,
      },
    },
    contact: {
      videoCall: {
        type: [String],
        required: true,
      },
      audioCall: {
        type: [String],
        required: true,
      },
      chat: {
        type: [String],
        required: true,
      },
      inperson: {
        type: [String],
        required: true,
      },
    },
  },
  { timestamps: true }
);

const AdminPreferences = mongoose.model(
  "AdminPreferences",
  admin_New_Preferences
);
module.exports = AdminPreferences;
