import React, { useEffect, useState } from "react";
import { useTransactions } from "../context/TransactionContext";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";

const ReportsPage = () => {
  const { transactions, categories, fetchTransactions, fetchCategories } =
    useTransactions();
  const [timeRange, setTimeRange] = useState("month");
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Filter transactions based on time range
    const now = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(0); // All time
    }

    const filtered = transactions.filter((t) => new Date(t.date) >= startDate);
    setFilteredTransactions(filtered);
  }, [transactions, timeRange]);

  // Calculate financial summary for filtered transactions
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Prepare data for expense by category chart
  const expenseByCategoryData = categories
    .map((category) => {
      const categoryExpenses = filteredTransactions
        .filter((t) => {
          const transactionCategoryId =
            typeof t.category === "object" ? t.category._id : t.category;
          return t.type === "expense" && transactionCategoryId === category._id;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        name: category.name,
        value: categoryExpenses,
        color: category.color || "#000000",
      };
    })
    .filter((item) => item.value > 0);

  // Prepare data for income vs expense over time
  const incomeExpenseOverTime = [];
  const currentDate = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - i);

    const monthTransactions = filteredTransactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === date.getMonth() &&
        transactionDate.getFullYear() === date.getFullYear()
      );
    });

    const income = monthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    incomeExpenseOverTime.push({
      name: format(date, "MMM yyyy"),
      Income: income,
      Expense: expense,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold gradient-text">Reports</h1>
        <div className="flex space-x-2">
          <Button
            variant={timeRange === "week" ? "primary" : "outline"}
            size="sm"
            onClick={() => setTimeRange("week")}
          >
            Week
          </Button>
          <Button
            variant={timeRange === "month" ? "primary" : "outline"}
            size="sm"
            onClick={() => setTimeRange("month")}
          >
            Month
          </Button>
          <Button
            variant={timeRange === "year" ? "primary" : "outline"}
            size="sm"
            onClick={() => setTimeRange("year")}
          >
            Year
          </Button>
          <Button
            variant={timeRange === "all" ? "primary" : "outline"}
            size="sm"
            onClick={() => setTimeRange("all")}
          >
            All Time
          </Button>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card glow className="p-6">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">Income</h3>
          <p className="text-3xl font-bold text-green-400">
            ${totalIncome.toFixed(2)}
          </p>
        </Card>

        <Card glow className="p-6">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">Expenses</h3>
          <p className="text-3xl font-bold text-red-400">
            ${totalExpenses.toFixed(2)}
          </p>
        </Card>

        <Card glow className="p-6">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">Balance</h3>
          <p
            className={`text-3xl font-bold text-gray-300 ${
              balance >= 0 ? "text-neon-green" : "text-red-400"
            }`}
          >
            ${balance.toFixed(2)}
          </p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense by Category */}
        <Card glow className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">
            Expenses by Category
          </h3>
          {expenseByCategoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseByCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {expenseByCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`$${value.toFixed(2)}`, "Amount"]}
                  contentStyle={{
                    backgroundColor: "#1a1f3a",
                    border: "1px solid #00ff87",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-400">No expense data available</p>
            </div>
          )}
        </Card>

        {/* Income vs Expense Over Time */}
        <Card glow className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">
            Income vs Expense
          </h3>
          {incomeExpenseOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={incomeExpenseOverTime}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  formatter={(value) => [`$${value.toFixed(2)}`, "Amount"]}
                  contentStyle={{
                    backgroundColor: "#1a1f3a",
                    border: "1px solid #00ff87",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Bar dataKey="Income" fill="#10B981" />
                <Bar dataKey="Expense" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-400">No data available</p>
            </div>
          )}
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card glow className="p-6">
        <h3 className="text-xl font-bold text-white mb-6">
          Category Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neon-green/10">
            <thead className="bg-dark-700/30">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neon-green/10">
              {expenseByCategoryData.length > 0 ? (
                expenseByCategoryData
                  .sort((a, b) => b.value - a.value)
                  .map((category, index) => {
                    const percentage =
                      totalExpenses > 0
                        ? (category.value / totalExpenses) * 100
                        : 0;
                    return (
                      <tr
                        key={index}
                        className="hover:bg-neon-green/5 transition-colors"
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-3"
                              style={{ backgroundColor: category.color }}
                            ></div>
                            <span className="text-sm font-medium text-white">
                              {category.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                          ${category.value.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-24 bg-dark-700 rounded-full h-2 mr-2">
                              <div
                                className="bg-linear-to-r from-neon-green to-neon-aqua h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-300">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-4 py-8 text-center text-sm text-gray-400"
                  >
                    No expense data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage;
