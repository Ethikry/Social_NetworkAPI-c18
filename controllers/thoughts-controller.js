const { User, Thought } = require("../models");

const thoughtsController = {
  async getAllThought(req, res) {
    try {
      const dbThoughtData = await Thought.find({})
        .select("-__v")
        .sort({ createdAt: -1 });
      res.json(dbThoughtData);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  },

  async getThoughtById(req, res) {
    try {
      const dbThoughtData = await Thought.findOne({
        _id: req.params.thoughtId,
      }).select("-__v");
      if (!dbThoughtData) {
        return res.status(404).json({
          message: `No thought found with ID of ${req.params.thoughtId}`,
        });
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  },

  async addThought(req, res) {
    try {
      const dbThoughtData = await Thought.create(req.body);
      await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $push: { thoughts: dbThoughtData._id } },
        { new: true, runValidators: true }
      );
      res.json(dbThoughtData);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  },

  async addReaction(req, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $push: { reactions: req.body } },
        { new: true, runValidators: true }
      );
      if (!dbThoughtData) {
        return res.status(404).json({
          message: `No thought found with ID of ${req.params.thoughtId}`,
        });
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  },

  async updateThought(req, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { new: true, runValidators: true }
      );
      if (!dbThoughtData) {
        return res.status(404).json({
          message: `No thought found with ID of ${req.params.thoughtId}`,
        });
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  },

  async removeThought(req, res) {
    try {
      const deletedThought = await Thought.findOneAndDelete({
        _id: req.params.thoughtId,
      });
      if (!deletedThought) {
        return res.status(404).json({
          message: `No thought found with ID of ${req.params.thoughtId}`,
        });
      }
      res.json(deletedThought);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  },

  async removeReaction(req, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );
      if (!dbThoughtData) {
        return res.status(404).json({
          message: `No thought found with ID of ${req.params.thoughtId}`,
        });
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  },
};

module.exports = thoughtsController;
