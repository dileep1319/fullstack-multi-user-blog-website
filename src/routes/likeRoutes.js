const express = require("express");
const { likeBlog, unlikeBlog, getLikes } = require("../controllers/likeController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

// Frontend expects POST /api/likes/:blogId to toggle like
router.post("/:blogId", authenticate, likeBlog); // Renamed from '/like' to match frontend
// Frontend expects GET /api/likes/:blogId for likes count
router.get("/:blogId", getLikes); // Renamed from '/likes' to match frontend
// Assuming unlike will be handled by the same POST route with logic in controller
// If a separate unlike is needed, it would be another POST or DELETE to the same /:blogId endpoint.

module.exports = router;
