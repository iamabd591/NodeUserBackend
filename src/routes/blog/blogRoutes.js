const express = require("express");
const {
  addBlog,
  getAllBlog,
  deleteBlog,
  updateBlog,
  getBlogById,
} = require("../../controllers/blog/blogController");
const blogRouter = express.Router();

blogRouter.post("/add_blog", addBlog);
blogRouter.post("/update_blog", updateBlog);
blogRouter.post("/delete_blog", deleteBlog);
blogRouter.get("/get_all_blogs", getAllBlog);
blogRouter.get("/blog/:blogId", getBlogById);

module.exports = blogRouter;
