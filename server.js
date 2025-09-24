require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./src/config/database');

const authRoutes = require('./src/routes/authRoutes');
const blogRoutes = require('./src/routes/blogRoutes');
const commentRoutes = require('./src/routes/commentRoutes');
const likeRoutes = require('./src/routes/likeRoutes');

// Models
const User = require('./src/models/User');
const Blog = require('./src/models/Blog');
const Comment = require('./src/models/Comment');
const Like = require('./src/models/Like');
const associations = require('./src/models/associations');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);

app.get('/', (req, res) => {
  res.send('🚀 Express server running with Sequelize + PostgreSQL (Blogs Setup)');
});

// Start server after DB sync
async function startServer() {
  await connectDB();
  await sequelize.sync({ alter: true }); // creates/updates tables
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

startServer();
