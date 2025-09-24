const express = require("express");
const { addComment, getComments, deleteComment } = require("../controllers/commentController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:blogId", authenticate, addComment); // Changed to match frontend's POST /api/comments/:blogId
router.get("/:blogId", getComments); // Changed to match frontend's GET /api/comments/:blogId
router.delete("/:commentId", authenticate, deleteComment);

module.exports = router;
