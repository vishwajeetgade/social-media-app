import User from "../models/User.js";

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id, { password: 0 });

    if (!user) {
      return res.status(404).json({
        status: "failed",
        error: "User does not exist.",
        success: false,
      });
    }

    return res.status(200).json({
      data: { user },
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
      success: false,
    });
  }
};

export const getUserFriends = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id, { password: 0 });

    if (!user) {
      return res.status(404).json({
        status: "failed",
        error: "User does not exist.",
        success: false,
      });
    }

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id, { password: 0 }))
    );

    return res.status(200).json({
      data: { friends },
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
      success: false,
    });
  }
};

export const addRemoveFriend = async (req, res, next) => {
  try {
    const data = await Promise.all([
      User.findById(req.params.id, { password: 0 }),
      User.findById(req.params.friendId, { password: 0 }),
    ]);
    const user = data[0];
    const friend = data[1];

    if (!user) {
      return res.status(404).json({
        status: "failed",
        error: "User does not exist.",
        success: false,
      });
    }
    if (!friend) {
      return res.status(404).json({
        status: "failed",
        error: "Friend does not exist.",
        success: false,
      });
    }

    if (user.friends.includes(req.params.friendId)) {
      user.friends = user.friends.filter((id) => id !== req.params.friendId);
      friend.friends = friend.friends.filter((id) => id !== req.params.id);
    } else {
      user.friends.push(req.params.friendId);
      friend.friends.push(req.params.id);
    }

    await Promise.all([user.save(), friend.save()]);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id, { password: 0 }))
    );

    return res.status(200).json({
      data: { friends },
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
      success: false,
    });
  }
};
