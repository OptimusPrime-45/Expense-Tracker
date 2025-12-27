import User from '../models/User.js';

// Get user profile
// GET /api/users/profile
export const getUserProfile = async (req, res) => {
    try {
        // The user ID is assumed to be available in req.user.id after authentication middleware
        // Fetch user from database
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return user profile data
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        })
    } catch (error) {
        console.error(`Error in getUserProfile: ${error.message}`);
        res.status(500).json({ message: "Server Error" });
    }
}

// Update user profile
// PUT /api/users/profile
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user fields if provided in request body
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        // If a new password is provided, update it
        // The 'pre-save' hook in the User model will handle hashing
        if (req.body.password) {
            user.password = req.body.password;
        }

        // Save updated user to database
        const updatedUser = await user.save();

        // Return updated user profile data
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        });
        // IMPORTANT: Do not send the token or password back in the response
        // This is handled in the authController during login or registration
    } catch (error) {
        console.error(`Error in updateUserProfile: ${error.message}`);
        res.status(500).json({ message: "Server Error" });
    }
}

// Delete user profile
// DELETE /api/users/profile
export const deleteUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.findByIdAndDelete(req.user._id);
        res.json({ message: "User account deleted successfully" });
    } catch (error) {
        console.error(`Error in deleteUserProfile: ${error.message}`);
        res.status(500).json({ message: "Server Error" });
    }
}