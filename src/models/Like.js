// src/models/Like.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Blog = require('./Blog');

const Like = sequelize.define('Like', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  }
}, {
  tableName: 'Likes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});


module.exports = Like;
