const express = require('express');
const authController = require('../controllers/authController'); // Import the whole authController
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/me', authenticate, authController.getMe); // New route to get authenticated user details

module.exports = router;
