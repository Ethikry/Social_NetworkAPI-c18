const { User, Thought } = require("../models");

const usersController = {
  async getAllUser(req, res) {
    try {
      const dbUserData = await User.find({}).select("-__v").sort({ _id: -1 });
      res.json(dbUserData);
    } catch (err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  async getUserById({ params }, res) {
    try {
      const dbUserData = await User.findOne({ _id: params.userId })
        .populate({
          path: "thoughts",
          select: "-__v",
        })
        .populate({
          path: "friends",
          select: "-__v",
        })
        .select("-__v");
      if (!dbUserData) {
        return res
          .status(404)
          .json({ message: `No user found with ID of ${params.userId}` });
      }
      res.json(dbUserData);
    } catch (err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  async addUser({ params, body }, res) {
    try {
      console.log(params);
      const dbUserData = await User.create(body);
      console.log(dbUserData);
      res.json(dbUserData);
    } catch (err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  async addFriend({ params, body }, res) {
    try {
      const dbFriendData = await User.findOneAndUpdate(
        { _id: params.userId },
        { $push: { friends: params.friendId } },
        { new: true, runValidators: true }
      );
      if (!dbFriendData) {
        return res
          .status(404)
          .json({ message: `No user found with ID of ${params.userId}` });
      }
      res.json(dbFriendData);
    } catch (err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  async updateUser({ params, body }, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: params.userId },
        { $set: body },
        { new: true, runValidators: true }
      );
      if (!dbUserData) {
        return res
          .status(404)
          .json({ message: `No user found with ID of ${params.userId}` });
      }
      res.json(dbUserData);
    } catch (err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  async removeUser({ params }, res) {
    try {
      const deletedUser = await User.findOneAndDelete({ _id: params.userId });
      if (!deletedUser) {
        return res
          .status(404)
          .json({ message: `No user found with ID of ${params.userId}` });
      }
      await Thought.deleteMany({ _id: { $in: deletedUser.thoughts } });
      res.json({ message: "User and thoughts have been deleted" });
    } catch (err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  async removeFriend({ params }, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true }
      );
      if (!dbUserData) {
        return res
          .status(404)
          .json({ message: `No user found with ID of ${params.userId}` });
      }
      res.json(dbUserData);
    } catch (err) {
      console.error(err);
      res.sendStatus(400);
    }
  },
};

module.exports = usersController;
