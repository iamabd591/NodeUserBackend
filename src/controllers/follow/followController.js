const Follow = require("../../model/follow/followModel");
const redis = require("../../../clients/redisClient");
const User = require("../../model/auth/authModel");

const toggleFollow = async (req, res) => {
  try {
    const { userId, followId } = req.body;

    if (!userId || !followId) {
      return res.status(400).json({ error: "Credentials are missing" });
    }

    if (userId === followId) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    const [userExists, followerExists] = await Promise.all([
      User.findById(userId),
      User.findById(followId),
    ]);

    if (!followerExists) {
      return res.status(400).json({ error: "Follow user not found" });
    }

    if (!userExists) {
      return res.status(400).json({ error: "User not found" });
    }

    const existingFollow = await Follow.findOne({
      follower: userId,
      following: followId,
    });

    if (existingFollow) {
      await Follow.findOneAndDelete({
        follower: userId,
        following: followId,
      });

      await Promise.all([
        redis.del(`followers:${userId}`),
        redis.del(`followings:${followId}`),
      ]);

      return res.status(200).json({ message: "User unfollowed successfully" });
    }

    await Follow.create({ follower: userId, following: followId });

    await Promise.all([
      redis.del(`followers:${followId}`),
      redis.del(`followings:${userId}`),
    ]);

    return res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Internal server error: ${error.message}` });
  }
};

const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const cacheKey = `followers:${userId}`;
    const { page = 1, limit = 10 } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "Credentials are missing" });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(400).json({ error: "User not found" });
    }

    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const totalFollowers = await Follow.countDocuments({ following: userId });

    const followers = await Follow.find({ following: userId })
      .populate("follower", "name email")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const userFollowers = { followers, totalFollowers };

    await redis.set(cacheKey, JSON.stringify(userFollowers));

    return res.status(200).json(userFollowers);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Internal server error: ${error.message}` });
  }
};

const getFollowings = async (req, res) => {
  try {
    const { userId } = req.params;
    const cacheKey = `followings:${userId}`;
    const { page = 1, limit = 10 } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "Credentials are missing" });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(400).json({ error: "User not found" });
    }

    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const totalFollowings = await Follow.countDocuments({ follower: userId });

    const following = await Follow.find({ follower: userId })
      .populate("following", "name email")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const userFollowing = { following, totalFollowings };

    await redis.set(cacheKey, JSON.stringify(userFollowing));

    return res.status(200).json(userFollowing);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Internal server error: ${error.message}` });
  }
};

module.exports = {
  toggleFollow,
  getFollowers,
  getFollowings,
};
