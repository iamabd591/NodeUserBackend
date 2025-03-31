const redis = require("../../../clients/redisClient");
const User = require("../../model/auth/authModel");

const getAllusers = async (req, res) => {
  try {
    let { page = 1, limit = 20 } = req.body;
    page = parseInt(page);
    limit = parseInt(limit);
    const totalUsers = await User.countDocuments();
    const totalPage = Math.ceil(totalUsers / limit);

    const allUsers = await User.find({})
      .skip((page - 1) * limit)
      .limit(limit);

    const redisKey = "paginatedUsers";
    const cacheData = await redis.get(redisKey);

    if (cacheData) {
      return res.status(200).json(JSON.parse(cacheData));
    }

    const response = {
      message: `All Users`,
      currentPage: page,
      users: allUsers,
      totalUsers,
      totalPage,
      limit,
    };

    await redis.set(redisKey, JSON.stringify(response));
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Internal Server Error ${error.message}` });
  }
};

module.exports = {
  getAllusers,
};
