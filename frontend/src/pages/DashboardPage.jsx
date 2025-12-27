import React, { useEffect } from "react";
import { useTransactions } from "../context/TransactionContext";
import { useAuth } from "../context/AuthContext";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  Calendar,
  Target,
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { transactions, categories, fetchTransactions, fetchCategories } =
    useTransactions();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate financial summary
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Get recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Group transactions by category
  const transactionsByCategory = transactions.reduce((acc, transaction) => {
    const transactionCategoryId =
      typeof transaction.category === "object"
        ? transaction.category._id
        : transaction.category;
    const category = categories.find(
      (c) => c._id === transactionCategoryId
    ) || { name: "Unknown" };
    const categoryId = category._id || "unknown";

    if (!acc[categoryId]) {
      acc[categoryId] = {
        category: category.name,
        amount: 0,
        count: 0,
        color: category.color || "#000000",
      };
    }

    acc[categoryId].amount +=
      transaction.type === "expense" ? transaction.amount : 0;
    acc[categoryId].count += 1;

    return acc;
  }, {});

  // Calculate this month's expenses
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const monthlyExpenses = transactions
    .filter(
      (t) =>
        t.type === "expense" &&
        new Date(t.date).getMonth() === thisMonth &&
        new Date(t.date).getFullYear() === thisYear
    )
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            Welcome back, {user?.name || "User"}!
          </h1>
          <p className="text-gray-300 mt-1">
            Here's what's happening with your finances today.
          </p>
        </div>
        <Button onClick={() => navigate("/transactions")}>
          <Plus size={18} className="mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          glow
          className="p-6 hover:scale-105 transition-transform duration-300"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-linear-to-br from-neon-green/20 to-neon-aqua/20 border border-neon-green/30">
              <Wallet className="text-neon-green" size={28} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">Balance</p>
              <p
                className={`text-2xl font-bold text-white ${
                  balance >= 0 ? "text-neon-green" : "text-red-400"
                }`}
              >
                ${balance.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>

        <Card
          glow
          className="p-6 hover:scale-105 transition-transform duration-300"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-linear-to-br from-green-500/20 to-neon-green/20 border border-green-500/30">
              <TrendingUp className="text-green-400" size={28} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">Total Income</p>
              <p className="text-2xl font-bold text-white">
                ${totalIncome.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>

        <Card
          glow
          className="p-6 hover:scale-105 transition-transform duration-300"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-linear-to-br from-red-500/20 to-pink-500/20 border border-red-500/30">
              <TrendingDown className="text-red-400" size={28} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">
                Total Expenses
              </p>
              <p className="text-2xl font-bold text-white">
                ${totalExpenses.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>

        <Card
          glow
          className="p-6 hover:scale-105 transition-transform duration-300"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-linear-to-br from-neon-aqua/20 to-purple-500/20 border border-neon-aqua/30">
              <Calendar className="text-neon-aqua" size={28} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">This Month</p>
              <p className="text-2xl font-bold text-white">
                ${monthlyExpenses.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card glow className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">
              Recent Transactions
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/transactions")}
            >
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => {
                const transactionCategoryId =
                  typeof transaction.category === "object"
                    ? transaction.category._id
                    : transaction.category;
                const category =
                  categories.find((c) => c._id === transactionCategoryId) ||
                  (typeof transaction.category === "object"
                    ? transaction.category
                    : { name: "Unknown" });
                const isIncome = transaction.type === "income";

                return (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between p-4 hover:bg-neon-green/5 dark:hover:bg-neon-green/5 rounded-xl transition-colors border border-transparent hover:border-neon-green/20"
                  >
                    <div className="flex items-center">
                      <div
                        className={`p-2.5 rounded-xl ${
                          isIncome
                            ? "bg-green-500/20 border border-green-500/30"
                            : "bg-red-500/20 border border-red-500/30"
                        }`}
                      >
                        {isIncome ? (
                          <TrendingUp className="text-green-400" size={18} />
                        ) : (
                          <TrendingDown className="text-red-400" size={18} />
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="font-semibold text-white">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-gray-300">
                          {category.name} •{" "}
                          {format(new Date(transaction.date), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`font-bold text-lg ${
                        isIncome ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {isIncome ? "+" : ""}${transaction.amount.toFixed(2)}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-300 text-center py-8">
                No transactions yet. Add your first transaction to get started!
              </p>
            )}
          </div>
        </Card>

        {/* Expenses by Category */}
        <Card glow className="p-6">
          <h2 className="text-xl font-bold text-white mb-6">
            Expenses by Category
          </h2>

          <div className="space-y-4">
            {Object.values(transactionsByCategory).length > 0 ? (
              Object.values(transactionsByCategory)
                .sort((a, b) => b.amount - a.amount)
                .map((item, index) => {
                  const percentage =
                    totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0;

                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded-full mr-3 border-2 border-white/20"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="font-medium text-white">
                            {item.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-300">
                            {percentage.toFixed(1)}%
                          </span>
                          <span className="font-bold text-white">
                            ${item.amount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="w-full bg-dark-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: item.color,
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })
            ) : (
              <p className="text-gray-300 text-center py-8">
                No expense data available. Add expense transactions to see
                category breakdown.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
