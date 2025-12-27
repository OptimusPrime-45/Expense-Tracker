import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { transactionValidation, validate } from '../middleware/validator.js';
import {
    getTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    exportTransactionsCSV
} from '../controllers/transactionController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Export route - must be before /:id route to avoid conflict
router.get('/export/csv', exportTransactionsCSV);

// Define routes for base path /api/transactions
router.route('/')
// GET /api/transactions - Retrieve all transactions
    .get(getTransactions)
// POST /api/transactions - Create a new transaction
    .post(transactionValidation, validate, addTransaction);

// Define routes for specific transaction by ID: /api/transactions/:id
router.route('/:id')
// PUT /api/transactions/:id - Update a transaction by ID
    .put(transactionValidation, validate, updateTransaction)
// DELETE /api/transactions/:id - Delete a transaction by ID
    .delete(deleteTransaction);

export default router;