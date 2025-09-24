const Like = require("../models/Like");
const Blog = require("../models/Blog");
const User = require("../models/User");

// LIKE a blog (toggle like/unlike)
exports.likeBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const userId = req.user.id;

    // check if blog exists
    const blog = await Blog.findByPk(blogId);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    // check if user already liked
    const existingLike = await Like.findOne({
      where: { blogId, userId },
    });

    if (existingLike) {
      // If like exists, unlike it
      await existingLike.destroy();
      res.json({ message: "Blog unliked" });
    } else {
      // If no like exists, like it
      const like = await Like.create({
        blogId,
        userId,
      });
      res.status(201).json({ message: "Blog liked", like });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// UNLIKE a blog - This function is no longer needed as likeBlog now handles toggling
// exports.unlikeBlog = async (req, res) => {
//   try {
//     const blogId = req.params.blogId;
//     const like = await Like.findOne({
//       where: { blogId, userId: req.user.id },
//     });
//     if (!like) {
//       return res.status(400).json({ error: "You haven’t liked this blog" });
//     }
//     await like.destroy();
//     res.json({ message: "Blog unliked" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// GET likes for a blog
exports.getLikes = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const userId = req.user ? req.user.id : null; // Get userId if authenticated

    const likes = await Like.findAll({
      where: { blogId },
      // Removed include: [{ model: User, attributes: ["id", "username"] }], as User is not directly associated to Like for this query
    });

    const userLiked = userId ? likes.some(like => like.userId === userId) : false;

    res.json({ total: likes.length, userLiked });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
