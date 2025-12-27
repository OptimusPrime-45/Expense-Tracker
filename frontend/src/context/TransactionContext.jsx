import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { transactionAPI, categoryAPI } from '../api';
import { toast } from 'react-hot-toast';

const TransactionContext = createContext();

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

// Reducer for managing transactions state
const transactionReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(transaction =>
          transaction._id === action.payload._id ? action.payload : transaction
        )
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(transaction => transaction._id !== action.payload)
      };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category =>
          category._id === action.payload._id ? action.payload : category
        )
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category._id !== action.payload)
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export const TransactionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, {
    transactions: [],
    categories: [],
    loading: false,
    error: null
  });

  // Fetch transactions
  const fetchTransactions = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await transactionAPI.getTransactions();
      dispatch({ type: 'SET_TRANSACTIONS', payload: response.data });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch transactions';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Add transaction
  const addTransaction = async (transactionData) => {
    try {
      const response = await transactionAPI.addTransaction(transactionData);
      dispatch({ type: 'ADD_TRANSACTION', payload: response.data });
      toast.success('Transaction added successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add transaction';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Update transaction
  const updateTransaction = async (id, transactionData) => {
    try {
      const response = await transactionAPI.updateTransaction(id, transactionData);
      dispatch({ type: 'UPDATE_TRANSACTION', payload: response.data });
      toast.success('Transaction updated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update transaction';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    try {
      await transactionAPI.deleteTransaction(id);
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
      toast.success('Transaction deleted successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete transaction';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getCategories();
      dispatch({ type: 'SET_CATEGORIES', payload: response.data });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch categories';
      toast.error(message);
    }
  };

  // Add category
  const addCategory = async (categoryData) => {
    try {
      const response = await categoryAPI.addCategory(categoryData);
      dispatch({ type: 'ADD_CATEGORY', payload: response.data });
      toast.success('Category added successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add category';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Update category
  const updateCategory = async (id, categoryData) => {
    try {
      const response = await categoryAPI.updateCategory(id, categoryData);
      dispatch({ type: 'UPDATE_CATEGORY', payload: response.data });
      toast.success('Category updated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update category';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Delete category
  const deleteCategory = async (id) => {
    try {
      await categoryAPI.deleteCategory(id);
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
      toast.success('Category deleted successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete category';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Export transactions to CSV
  const exportToCSV = async () => {
    try {
      const response = await transactionAPI.exportToCSV();
      
      // Create a blob from the response
      const blob = new Blob([response.data], { type: 'text/csv' });
      
      // Create a download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Transactions exported successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to export transactions';
      toast.error(message);
      return { success: false, message };
    }
  };

  const value = {
    ...state,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    exportToCSV
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};