const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema(
  {
    metaTitle: {
      type: String,
      required: true,
    },
    metaDescription: {
      type: String,
      required: true,
    },
    metaTags: {
      type: [String],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    images: { type: [String], required: true },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
