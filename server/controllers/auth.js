import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: passwordHash,
      picturePath: req.file?.originalname,
      friends: req.body.friends,
      location: req.body.location,
      occupation: req.body.occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    const savedUser = await newUser.save();
    return res.status(201).json({
      data: { user: savedUser },
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
      success: false,
    });
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        status: "failed",
        error: "User does not exist.",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid credentials",
        success: false,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    // create copy of object to delete password field
    const userCopy = user.toObject();
    delete userCopy.password;

    return res.status(200).json({
      data: {
        token,
        user: userCopy,
      },
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
      success: false,
    });
  }
};
