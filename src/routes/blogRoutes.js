const express = require("express");
const { authenticate } = require("../middleware/authMiddleware");
const blogController = require("../controllers/blogController");

const router = express.Router();
router.post("/", authenticate, blogController.createBlog);
router.get("/", blogController.getAllBlogs);
router.get("/my", authenticate, blogController.getMyBlogs);
router.get("/:id", authenticate, blogController.getBlogById);
router.put("/:id", authenticate, blogController.updateBlog);
router.delete("/:id", authenticate, blogController.deleteBlog);

module.exports = router;

