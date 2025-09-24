const User = require("./User");
const Blog = require("./Blog");
const Like = require("./Like");
const Comment = require("./Comment");

// Blog belongs to a User
Blog.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Blog, { foreignKey: "userId" });

// Comment associations
Comment.belongsTo(User, { foreignKey: "userId" });
Comment.belongsTo(Blog, { foreignKey: "blogId" });
User.hasMany(Comment, { foreignKey: "userId" });
Blog.hasMany(Comment, { foreignKey: "blogId" });

// Like associations
Like.belongsTo(User, { foreignKey: "userId" }); // A like belongs to a user
Like.belongsTo(Blog, { foreignKey: "blogId" }); // A like belongs to a blog
User.hasMany(Like, { foreignKey: "userId" });   // A user can have many likes
Blog.hasMany(Like, { foreignKey: "blogId" });   // A blog can have many likes

// Removed many-to-many associations as direct hasMany/belongsTo are more appropriate for aggregation
// User.belongsToMany(Blog, { through: Like, foreignKey: "userId" });
// Blog.belongsToMany(User, { through: Like, foreignKey: "blogId" });

module.exports = { User, Blog, Like, Comment };
