import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      min: 2,
      max: 50,
      default: "",
    },
    picturePath: {
      type: String,
      default: "",
    },
    userPicturePath: {
      type: String,
      default: "",
    },
    likes: {
      type: Map,
      of: Boolean,
    },
    location: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);
export default Post;
