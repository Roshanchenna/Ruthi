const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/userProfileController');

// Create a new user profile
router.post('/create', userProfileController.createProfile);

// Update a user profile by ID
router.put('/:userId', userProfileController.updateProfile);

// Delete a user profile by ID
router.delete('/:userId', userProfileController.deleteProfile);

router.get('/:userId', userProfileController.getUserProfile);

module.exports = router;
