const redis = require("../../../clients/redisClient");
const User = require("../../model/auth/authModel");
const Blog = require("../../model/blog/blogModel");

const addBlog = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "Missing blog data" });
    }

    const { userId, ...blogData } = req.body;
    const user = await User.findById(userId);

    if (!user || (user.role !== "author" && user.role !== "admin")) {
      return res.status(403).json({ error: "Permission denied" });
    }

    const newBlog = await Blog.create({ ...blogData, author: userId });

    return res
      .status(201)
      .json({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Internal server error: ${error.message}` });
  }
};

const getAllBlog = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const redisKey = `paginatedBlogs:${page}:${limit}`;
    const cachedData = await redis.get(redisKey);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const totalBlogs = await Blog.countDocuments();
    const totalPages = Math.ceil(totalBlogs / limit);

    const blogs = await Blog.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("author", "name email");

    const responseData = { blogs, page, limit, totalPages, totalBlogs };
    await redis.set(redisKey, JSON.stringify(responseData));

    return res.status(200).json(responseData);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Internal Server Error: ${error.message}` });
  }
};

const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;
    const redisKey = `blog:${blogId}`;

    const cachedData = await redis.get(redisKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const blog = await Blog.findById(blogId).populate("author", "name email");
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    await redis.set(redisKey, JSON.stringify(blog));

    return res.status(200).json(blog);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Internal Server Error: ${error.message}` });
  }
};

const updateBlog = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "Missing blog data" });
    }

    const { userId, blogId, ...blogData } = req.body;
    const user = await User.findById(userId);

    if (!user || (user.role !== "author" && user.role !== "admin")) {
      return res.status(403).json({ error: "Permission denied" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { ...blogData, authorId: userId },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    await redis.del(`blog:${blogId}`);
    await redis.del("paginatedBlogs");

    return res
      .status(200)
      .json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Internal Server Error: ${error.message}` });
  }
};
const deleteBlog = async (req, res) => {
  try {
    const { userId, blogId } = req.body;

    if (!userId || !blogId) {
      return res.status(400).json({ error: "Missing credentials" });
    }

    const user = await User.findById(userId);
    if (!user || (user.role !== "author" && user.role !== "admin")) {
      return res.status(403).json({ error: "Permission denied" });
    }

    const deletedBlog = await Blog.findByIdAndDelete(blogId);
    if (!deletedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    await redis.del(`blog:${blogId}`);
    await redis.del("paginatedBlogs");

    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Internal Server Error: ${error.message}` });
  }
};

module.exports = {
  addBlog,
  getAllBlog,
  deleteBlog,
  updateBlog,
  getBlogById,
};
