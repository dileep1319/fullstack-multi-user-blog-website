// const { Blog, User } = require("../models");
const Blog = require("../models/Blog");
const User = require("../models/User");
const Comment = require("../models/Comment"); // Import Comment model
const Like = require("../models/Like");       // Import Like model
const { sequelize } = require("../config/database"); // Import sequelize instance
// CREATE BLOG
exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    const blog = await Blog.create({
      title,
      content,
      userId: req.user.id, // req.user comes from auth middleware
    });

    // After creating the blog, fetch it again with associations to return a complete object
    const newBlog = await Blog.findByPk(blog.id, {
      include: [{ model: User, attributes: ["id", "username"] }],
    });

    if (!newBlog) return res.status(500).json({ error: "Failed to retrieve created blog" });

    const blogWithAuthor = {
      ...newBlog.toJSON(),
      author: newBlog.User ? newBlog.User.username : 'Anonymous',
      commentCount: 0, // Newly created blog has 0 comments
      likesCount: 0,    // Newly created blog has 0 likes
    };

    res.status(201).json({ message: "Blog created", blog: blogWithAuthor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET ALL BLOGS
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      include: [
        { model: User, attributes: ["id", "username", "email"] },
        {
          model: Comment,
          attributes: [], // We only need the count, not the actual comments
          duplicating: false, // Prevent duplicate blogs when joining comments
        },
        {
          model: Like,
          attributes: [], // We only need the count, not the actual likes
          duplicating: false, // Prevent duplicate blogs when joining likes
        },
      ],
      attributes: {
        include: [
          [sequelize.fn('COUNT', sequelize.col('Comments.id')), 'commentCount'],
          [sequelize.fn('COUNT', sequelize.col('Likes.id')), 'likesCount'], // Changed to likesCount
          [sequelize.literal(`EXISTS(SELECT 1 FROM \"Likes\" WHERE \"Likes\".\"blogId\" = \"Blog\".\"id\" AND \"Likes\".\"userId\" = ${req.user ? req.user.id : 0})`), 'isLiked'],
        ],
      },
      group: ['Blog.id', 'User.id'], // Group by Blog and User to get correct counts
    });

    const blogsWithAuthor = blogs.map(blog => {
      console.log('Blog createdAt (getAllBlogs):', blog.createdAt); // Added console log
      return {
        ...blog.toJSON(),
        author: blog.User ? blog.User.username : 'Anonymous',
        commentCount: blog.dataValues.commentCount || 0, // Ensure commentCount is a number
        likesCount: blog.dataValues.likesCount || 0,       // Ensure likesCount is a number
        isLiked: blog.dataValues.isLiked, // Include isLiked status
      };
    });

    res.json(blogsWithAuthor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET MY BLOGS
exports.getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      where: { userId: req.user.id },
      include: [
        { model: User, attributes: ["id", "username"] },
        {
          model: Comment,
          attributes: [],
          duplicating: false,
        },
        {
          model: Like,
          attributes: [],
          duplicating: false,
        },
      ],
      attributes: {
        include: [
          [sequelize.fn('COUNT', sequelize.col('Comments.id')), 'commentCount'],
          [sequelize.fn('COUNT', sequelize.col('Likes.id')), 'likesCount'],
        ],
      },
      group: ['Blog.id', 'User.id'],
    });

    const blogsWithAuthorAndCounts = blogs.map(blog => ({
      ...blog.toJSON(),
      author: blog.User ? blog.User.username : 'Anonymous',
      commentCount: blog.dataValues.commentCount || 0,
      likesCount: blog.dataValues.likesCount || 0,
    }));

    res.json(blogsWithAuthorAndCounts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET BLOG BY ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ["id", "username"] },
        {
          model: Comment,
          attributes: [],
          duplicating: false,
        },
        {
          model: Like,
          attributes: [],
          duplicating: false,
        },
      ],
      attributes: {
        include: [
          [sequelize.fn('COUNT', sequelize.col('Comments.id')), 'commentCount'],
          [sequelize.fn('COUNT', sequelize.col('Likes.id')), 'likesCount'],
          [sequelize.literal(`EXISTS(SELECT 1 FROM \"Likes\" WHERE \"Likes\".\"blogId\" = \"Blog\".\"id\" AND \"Likes\".\"userId\" = ${req.user ? req.user.id : 0})`), 'isLiked'],
        ],
      },
      group: ['Blog.id', 'User.id'],
    });

    if (!blog) return res.status(404).json({ error: "Blog not found" });

    console.log('Blog createdAt (getBlogById):', blog.createdAt); // Added console log

    const blogWithAuthor = {
      ...blog.toJSON(),
      author: blog.User ? blog.User.username : 'Anonymous',
      commentCount: blog.dataValues.commentCount || 0,
      likesCount: blog.dataValues.likesCount || 0,
      isLiked: blog.dataValues.isLiked,
    };

    res.json(blogWithAuthor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE BLOG
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);

    if (!blog) return res.status(404).json({ error: "Blog not found" });

    // Check ownership
    if (blog.userId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    await blog.save();

    res.json({ message: "Blog updated", blog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE BLOG
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);

    if (!blog) return res.status(404).json({ error: "Blog not found" });

    // Check ownership
    if (blog.userId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await blog.destroy();

    res.json({ message: "Blog deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
