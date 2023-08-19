import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({
        status: "failed",
        error: "User does not exist.",
        success: false,
      });
    }

    const newPost = new Post({
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description: req.body.description,
      userPicturePath: user.picturePath,
      picturePath: req.file?.originalname,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const posts = await Post.find();
    return res.status(200).json({
      data: { posts },
      success: true,
    });
  } catch (err) {
    return res.status(409).json({
      error: err.message,
      success: false,
    });
  }
};

export const getFeedPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    return res.status(200).json({
      data: { posts },
      success: true,
    });
  } catch (err) {
    return res.status(404).json({
      error: err.message,
      success: false,
    });
  }
};
export const getUserPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ userId: req.params.userId });
    return res.status(200).json({
      data: { posts },
      success: true,
    });
  } catch (err) {
    return res.status(404).json({
      error: err.message,
      success: false,
    });
  }
};
export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    const isLiked = post.likes.get(req.body.userId);

    if (isLiked) {
      post.likes.delete(req.body.userId);
    } else {
      post.likes.set(req.body.userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        likes: post.likes,
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      data: { post: updatedPost },
      success: true,
    });
  } catch (err) {
    return res.status(404).json({
      error: err.message,
      success: false,
    });
  }
};
