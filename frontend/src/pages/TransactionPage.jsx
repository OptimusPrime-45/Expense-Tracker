import React, { useEffect, useState } from "react";
import { useTransactions } from "../context/TransactionContext";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Select from "../components/common/Select";
import {
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  Download,
  Search,
  X,
} from "lucide-react";
import { format } from "date-fns";

const TransactionPage = () => {
  const {
    transactions,
    categories,
    fetchTransactions,
    fetchCategories,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    exportToCSV,
  } = useTransactions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all"); // all, income, expense
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "expense",
    category: "",
    date: format(new Date(), "yyyy-MM-dd"),
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setFormData({
      description: "",
      amount: "",
      type: "expense",
      category: "",
      date: format(new Date(), "yyyy-MM-dd"),
    });
    setErrors({});
    setEditingTransaction(null);
  };

  const openModal = (transaction = null) => {
    if (transaction) {
      setEditingTransaction(transaction);
      const categoryId =
        typeof transaction.category === "object"
          ? transaction.category._id
          : transaction.category;
      setFormData({
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        category: categoryId,
        date: format(new Date(transaction.date), "yyyy-MM-dd"),
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    let result;
    if (editingTransaction) {
      result = await updateTransaction(editingTransaction._id, transactionData);
    } else {
      result = await addTransaction(transactionData);
    }

    if (result.success) {
      closeModal();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      await deleteTransaction(id);
    }
  };

  // Filter and search transactions
  const filterTransactions = (transactionsList) => {
    return transactionsList.filter((transaction) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const descriptionMatch = transaction.description
          .toLowerCase()
          .includes(query);
        const amountMatch = transaction.amount.toString().includes(query);
        const categoryName =
          typeof transaction.category === "object"
            ? transaction.category.name.toLowerCase()
            : categories
                .find((c) => c._id === transaction.category)
                ?.name.toLowerCase() || "";
        const categoryMatch = categoryName.includes(query);

        if (!descriptionMatch && !amountMatch && !categoryMatch) {
          return false;
        }
      }
      return true;
    });
  };

  // Filter transactions based on type and search
  const allFilteredTransactions = filterTransactions(transactions);
  const expenseTransactions = filterTransactions(
    transactions.filter((t) => t.type === "expense")
  );
  const incomeTransactions = filterTransactions(
    transactions.filter((t) => t.type === "income")
  );

  // Get transactions to display based on search type filter
  const getDisplayTransactions = (type) => {
    if (searchType === "all") return true;
    return searchType === type;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold gradient-text">Transactions</h1>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={exportToCSV}>
            <Download size={16} className="mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => openModal()}>
            <Plus size={16} className="mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <Card glow className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by description, amount, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-lg border-2 border-neon-green/20 bg-dark-700/50 text-white placeholder:text-gray-400 focus:border-neon-aqua focus:ring-2 focus:ring-neon-aqua/50 transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-neon-green transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSearchType("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                searchType === "all"
                  ? "bg-linear-to-r from-neon-green to-neon-aqua text-dark-900"
                  : "bg-dark-700/50 text-gray-300 hover:bg-dark-700 border border-neon-green/20"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSearchType("income")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                searchType === "income"
                  ? "bg-green-500 text-white"
                  : "bg-dark-700/50 text-gray-300 hover:bg-dark-700 border border-green-500/20"
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setSearchType("expense")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                searchType === "expense"
                  ? "bg-red-500 text-white"
                  : "bg-dark-700/50 text-gray-300 hover:bg-dark-700 border border-red-500/20"
              }`}
            >
              Expenses
            </button>
          </div>
        </div>
        {searchQuery && (
          <div className="mt-4 text-sm text-gray-300">
            Found{" "}
            <span className="text-neon-green font-semibold">
              {allFilteredTransactions.length}
            </span>{" "}
            transaction(s) matching "{searchQuery}"
          </div>
        )}
      </Card>

      {/* Income Transactions */}
      {getDisplayTransactions("income") && (
        <Card glow className="p-6">
          <div className="flex items-center mb-6">
            <div className="p-2.5 rounded-xl bg-green-500/20 border border-green-500/30 mr-3">
              <TrendingUp className="text-green-400" size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">Income</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neon-green/10">
              <thead className="bg-dark-700/30">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neon-green/10">
                {incomeTransactions.length > 0 ? (
                  incomeTransactions.map((transaction) => {
                    const transactionCategoryId =
                      typeof transaction.category === "object"
                        ? transaction.category._id
                        : transaction.category;
                    const category =
                      categories.find((c) => c._id === transactionCategoryId) ||
                      (typeof transaction.category === "object"
                        ? transaction.category
                        : { name: "Unknown" });

                    return (
                      <tr
                        key={transaction._id}
                        className="hover:bg-neon-green/5 transition-colors"
                      >
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {transaction.description}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                          {category.name}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                          {format(new Date(transaction.date), "MMM dd, yyyy")}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-green-400">
                          +${transaction.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openModal(transaction)}
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(transaction._id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-8 text-center text-sm text-gray-400"
                    >
                      {searchQuery
                        ? "No income transactions found matching your search"
                        : "No income transactions yet"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Expense Transactions */}
      {getDisplayTransactions("expense") && (
        <Card glow className="p-6">
          <div className="flex items-center mb-6">
            <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/30 mr-3">
              <TrendingDown className="text-red-400" size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">Expenses</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neon-green/10">
              <thead className="bg-dark-700/30">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neon-green/10">
                {expenseTransactions.length > 0 ? (
                  expenseTransactions.map((transaction) => {
                    const transactionCategoryId =
                      typeof transaction.category === "object"
                        ? transaction.category._id
                        : transaction.category;
                    const category =
                      categories.find((c) => c._id === transactionCategoryId) ||
                      (typeof transaction.category === "object"
                        ? transaction.category
                        : { name: "Unknown" });

                    return (
                      <tr
                        key={transaction._id}
                        className="hover:bg-neon-green/5 transition-colors"
                      >
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {transaction.description}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                          {category.name}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                          {format(new Date(transaction.date), "MMM dd, yyyy")}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-red-400">
                          -${transaction.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openModal(transaction)}
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(transaction._id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-8 text-center text-sm text-gray-400"
                    >
                      {searchQuery
                        ? "No expense transactions found matching your search"
                        : "No expense transactions yet"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card glow className="w-full max-w-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold gradient-text mb-6">
                {editingTransaction ? "Edit Transaction" : "Add Transaction"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={errors.description}
                />

                <Input
                  label="Amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  error={errors.amount}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </Select>

                  <Select
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    error={errors.category}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <Input
                  label="Date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                />

                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="secondary" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingTransaction ? "Update" : "Add"} Transaction
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TransactionPage;
