import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { registerValidation, loginValidation, validate } from '../middleware/validator.js';

const router = express.Router();

// Register route
// POST /api/auth/register
router.post('/register', registerValidation, validate, registerUser);

// Login route
// POST /api/auth/login
router.post('/login', loginValidation, validate, loginUser);

export default router;