const Comment = require("../models/Comment");
const Blog = require("../models/Blog");
const User = require("../models/User");

// ADD comment
exports.addComment = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const { content } = req.body; // Changed 'text' to 'content'

    const blog = await Blog.findByPk(blogId);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const comment = await Comment.create({
      content, // Changed 'text' to 'content'
      blogId,
      userId: req.user.id,
    });

    res.status(201).json({ message: "Comment added", comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET comments for a blog
exports.getComments = async (req, res) => {
  try {
    const blogId = req.params.blogId;

    const comments = await Comment.findAll({
      where: { blogId },
      include: [{ model: User, attributes: ["id", "username"] }],
      order: [["createdAt", "DESC"]],
    });

    // Map comments to include author name
    const commentsWithAuthor = comments.map(comment => ({
      ...comment.toJSON(),
      author: comment.User ? comment.User.username : 'Anonymous',
    }));

    res.json(commentsWithAuthor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.commentId);

    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (comment.userId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await comment.destroy();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
