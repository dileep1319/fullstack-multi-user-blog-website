// src/models/Blog.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Blog = sequelize.define('Blog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true, // Temporarily allow null for existing data
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true, // Temporarily allow null for existing data
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'Blogs',
  timestamps: true,
  // Removed explicit createdAt and updatedAt field remapping to use Sequelize's default camelCase
});

module.exports = Blog;
