const UserProfile = require("../models/UserProfile");
const User = require("../models/User");
const mongoose = require('mongoose');

// Create a new user profile
exports.createProfile = async (req, res) => {
    try {
        const { userId, ...profileData } = req.body;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let userProfile = new UserProfile({
            user: userId,
            ...profileData
        });
        userProfile = await userProfile.save();

        // Update user document with reference to the new profile
        user.userProfile = userProfile._id;
        await user.save();

        res.status(201).json(userProfile);
    } catch (error) {
        console.error('Error creating profile:', error);
        res.status(400).json({ message: error.message });
    }
};

// Read user profile
exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const userProfile = await UserProfile.findOne({ user: userId });

        if (!userProfile) {
            return res.status(404).json({ message: "User profile not found" });
        }

        res.status(200).json(userProfile);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const updateData = req.body;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const userProfile = await UserProfile.findOneAndUpdate(
            { user: userId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!userProfile) {
            return res.status(404).json({ message: "User profile not found" });
        }

        res.status(200).json(userProfile);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(400).json({ message: error.message });
    }
};

// Delete user profile
exports.deleteProfile = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const userProfile = await UserProfile.findOneAndDelete({ user: userId });

        if (!userProfile) {
            return res.status(404).json({ message: "User profile not found" });
        }

        // Remove reference from user document
        await User.findByIdAndUpdate(userId, { $unset: { userProfile: 1 } });

        res.status(200).json({ message: "User profile deleted successfully" });
    } catch (error) {
        console.error('Error deleting profile:', error);
        res.status(500).json({ message: "Server error" });
    }
};

