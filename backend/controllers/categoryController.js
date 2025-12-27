import { Category } from '../models/Category.js';

// Get all categories for a logged-in user
// GET /api/categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Add a new category
// POST /api/categories
export const addCategory = async (req, res) => {
    try {
        const { name, icon, color } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const category = new Category({
            user: req.user._id,
            name,
            icon: icon || 'default',
            color: color || '#000000'
        });

        const createdCategory = await category.save();
        res.status(201).json(createdCategory);
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update a category
// PUT /api/categories/:id
export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Check if the logged-in user is the owner of the category
        if (category.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        category.name = req.body.name || category.name;
        category.icon = req.body.icon !== undefined ? req.body.icon : category.icon;
        category.color = req.body.color || category.color;

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (error) {
        console.error(`Error in updateCategory: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete a category
// DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Check if the logged-in user is the owner of the category
        if (category.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'Category deleted' });
    } catch (error) {
        console.error(`Error in deleteCategory: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};
