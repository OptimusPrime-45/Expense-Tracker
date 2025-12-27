import Transaction from '../models/Transaction.js';

// Get all transactions for a logged-in user
// GET /api/transactions
export const getTransactions = async (req, res) => {
    try {
        // Find all transaction that belong to the currently logged-in user (req.user.id)
        // Popoulate the 'category' field to include the category name from the Category model
        // Sort transactions by date in descending order (i.e., most recent first)
        const transactions = await Transaction.find({user: req.user._id})
        .populate('category', 'name')
        .sort({date: -1}); 

        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({message: 'Server Error'});
    }

}

export const addTransaction = async (req, res) => {
    try {
        const {description, amount, date, type, category} = req.body;

        // Basic validation
        if (!description || !amount || !date || !type || !category) {
            return res.status(400).json({message: 'All fields are required'});
        }

        const transaction = new Transaction({
            user: req.user._id, // Associate transaction with the logged-in user
            description,
            amount,
            date,
            type,
            category
        })

        const createdTransaction = await transaction.save();

        // Populate the newly created transaction before sending it in the response
        const populatedTransaction = await Transaction.findById(createdTransaction._id).populate('category', 'name');
        res.status(201).json(populatedTransaction);
    } catch (error) {
        console.error('Error adding transaction:', error);
        res.status(500).json({message: 'Server Error'});
    }
}

// Update a transaction
// PUT /api/transactions/:id
// Only the owner of the transaction can update it
export const updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        // Check if the logged-in user is the owner of the transaction
        if (transaction.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Update the transaction fields from the request body
        transaction.description = req.body.description || transaction.description;
        transaction.amount = req.body.amount !== undefined ? req.body.amount : transaction.amount;
        transaction.date = req.body.date || transaction.date;
        transaction.type = req.body.type || transaction.type;
        transaction.category = req.body.category || transaction.category;

        const updatedTransaction = await transaction.save();

        // Populate the updated transaction before sending it in the response
        const populatedTransaction = await Transaction.findById(updatedTransaction._id).populate('category', 'name'); 
        res.json(populatedTransaction); 
    } catch (error) {
        console.error(`Error in updateTransaction: ${error.message}`);
        res.status(500).json({ message: "Server Error" });
    }
}

// Delete a transaction
// DELETE /api/transactions/:id
// Only the owner of the transaction can delete it
export const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        // Check if the logged-in user is the owner of the transaction
        if (transaction.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await transaction.deleteOne();
        res.json({ message: "Transaction deleted" });
    } catch (error) {
        console.error(`Error in deleteTransaction: ${error.message}`);
        res.status(500).json({ message: "Server Error" });
    }
}

// Export transactions as CSV
// GET /api/transactions/export/csv
export const exportTransactionsCSV = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id })
            .populate('category', 'name')
            .sort({ date: -1 });

        // CSV Header
        const csvHeader = 'Date,Description,Type,Category,Amount\n';
        
        // CSV Rows
        const csvRows = transactions.map(transaction => {
            const date = new Date(transaction.date).toISOString().split('T')[0];
            const description = `"${transaction.description.replace(/"/g, '""')}"`;
            const type = transaction.type;
            const category = transaction.category?.name || 'Unknown';
            const amount = transaction.amount.toFixed(2);
            
            return `${date},${description},${type},${category},${amount}`;
        }).join('\n');

        const csv = csvHeader + csvRows;

        // Set headers for CSV download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="transactions_${new Date().toISOString().split('T')[0]}.csv"`);
        res.send(csv);
    } catch (error) {
        console.error('Error exporting transactions:', error);
        res.status(500).json({ message: 'Server Error' });
    }
}