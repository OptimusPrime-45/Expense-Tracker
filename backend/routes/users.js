import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { updateProfileValidation, validate } from '../middleware/validator.js';
import {
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
} from '../controllers/userController.js';

const router = express.Router();

// Apply authentication middleware to all routes in this router
router.use(protect);

// Routes for user profile
router.route('/profile')
    .get(getUserProfile)
    .put(updateProfileValidation, validate, updateUserProfile)
    .delete(deleteUserProfile);

export default router;
