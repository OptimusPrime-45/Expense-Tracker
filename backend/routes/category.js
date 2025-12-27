import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { categoryValidation, validate } from '../middleware/validator.js';
import {
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Define routes for base path /api/categories
router.route('/')
    // GET /api/categories - Retrieve all categories
    .get(getCategories)
    // POST /api/categories - Create a new category
    .post(categoryValidation, validate, addCategory);

// Define routes for specific category by ID: /api/categories/:id
router.route('/:id')
    // PUT /api/categories/:id - Update a category by ID
    .put(categoryValidation, validate, updateCategory)
    // DELETE /api/categories/:id - Delete a category by ID
    .delete(deleteCategory);

export default router;
