import mongoose from 'mongoose';

const transactionSchema = mongoose.Schema(
  {
    // Link to the user who created this transaction
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Establishes a relationship with the 'User' model
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      trim: true, // Removes any whitespace from the beginning and end
    },
    amount: {
      type: Number,
      required: [true, 'Please add an amount'],
    },
    // The type of transaction: either income or an expense
    type: {
      type: String,
      required: true,
      enum: ['income', 'expense'], // Value must be one of these two options
    },
    // Link to the category for this transaction
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Category', // Establishes a relationship with the 'Category' model
      icon: { type: String },
      color: { type: String },
    },
    date: {
      type: Date,
      required: [true, 'Please add a date'],
    },
  },
  {
    // Automatically add 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;

