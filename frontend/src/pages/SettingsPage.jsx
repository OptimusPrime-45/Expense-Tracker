import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTransactions } from "../context/TransactionContext";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { useTheme } from "../context/ThemeContext";
import { User, Key, Palette, Bell, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const { user, updateProfile, deleteProfile } = useAuth();
  const {
    addCategory,
    updateCategory,
    deleteCategory,
    categories,
    fetchCategories,
  } = useTransactions();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Profile state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // Password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Category state
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    color: "#3B82F6",
    icon: "default",
  });

  const [editingCategory, setEditingCategory] = useState(null);
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [categoryErrors, setCategoryErrors] = useState({});

  // Handle profile update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const newErrors = {};
    if (!profileForm.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!profileForm.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
      newErrors.email = "Email is invalid";
    }

    if (Object.keys(newErrors).length > 0) {
      setProfileErrors(newErrors);
      return;
    }

    const result = await updateProfile(profileForm);
    if (result.success) {
      setProfileErrors({});
    }
  };

  // Handle password update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const newErrors = {};
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    if (!passwordForm.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setPasswordErrors(newErrors);
      return;
    }

    const result = await updateProfile({ password: passwordForm.newPassword });
    if (result.success) {
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({});
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      const result = await deleteProfile();
      if (result.success) {
        navigate("/login");
      }
    }
  };

  // Handle category form changes
  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle category submit
  const handleCategorySubmit = async (e) => {
    e.preventDefault();

    if (!categoryForm.name.trim()) {
      setCategoryErrors({ name: "Category name is required" });
      return;
    }

    const categoryData = {
      name: categoryForm.name,
      color: categoryForm.color,
      icon: categoryForm.icon,
    };

    if (editingCategory) {
      // Update existing category
      await updateCategory(editingCategory._id, categoryData);
    } else {
      // Add new category
      await addCategory(categoryData);
    }

    // Reset form
    setCategoryForm({
      name: "",
      color: "#3B82F6",
      icon: "default",
    });
    setEditingCategory(null);
    setCategoryErrors({});
  };

  // Handle edit category
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      color: category.color || "#3B82F6",
      icon: category.icon || "default",
    });
  };

  // Handle delete category
  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(id);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: "",
      color: "#3B82F6",
      icon: "default",
    });
    setCategoryErrors({});
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold gradient-text">Settings</h1>

      {/* Profile Settings */}
      <Card glow className="p-6">
        <div className="flex items-center mb-6">
          <User className="text-neon-green mr-3" size={20} />
          <h2 className="text-xl font-bold text-white">Profile Settings</h2>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={profileForm.name}
            onChange={(e) =>
              setProfileForm((prev) => ({ ...prev, name: e.target.value }))
            }
            error={profileErrors.name}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={profileForm.email}
            onChange={(e) =>
              setProfileForm((prev) => ({ ...prev, email: e.target.value }))
            }
            error={profileErrors.email}
          />

          <div className="pt-4">
            <Button type="submit">Update Profile</Button>
          </div>
        </form>
      </Card>

      {/* Password Settings */}
      <Card glow className="p-6">
        <div className="flex items-center mb-6">
          <Key className="text-neon-aqua mr-3" size={20} />
          <h2 className="text-xl font-bold text-white">Password Settings</h2>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            label="Current Password"
            name="currentPassword"
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) =>
              setPasswordForm((prev) => ({
                ...prev,
                currentPassword: e.target.value,
              }))
            }
            error={passwordErrors.currentPassword}
          />

          <Input
            label="New Password"
            name="newPassword"
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm((prev) => ({
                ...prev,
                newPassword: e.target.value,
              }))
            }
            error={passwordErrors.newPassword}
          />

          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) =>
              setPasswordForm((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            error={passwordErrors.confirmPassword}
          />

          <div className="pt-4">
            <Button type="submit">Update Password</Button>
          </div>
        </form>
      </Card>

      {/* Appearance Settings */}
      <Card glow className="p-6">
        <div className="flex items-center mb-6">
          <Palette className="text-neon-green mr-3" size={20} />
          <h2 className="text-xl font-bold text-white">Appearance</h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white">Dark Mode</h3>
            <p className="text-sm text-gray-300">
              Toggle between light and dark themes
            </p>
          </div>
          <Button
            variant={isDarkMode ? "primary" : "outline"}
            onClick={toggleTheme}
          >
            {isDarkMode ? "Enabled" : "Disabled"}
          </Button>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card glow className="p-6">
        <div className="flex items-center mb-6">
          <Bell className="text-neon-aqua mr-3" size={20} />
          <h2 className="text-xl font-bold text-white">Notifications</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white">Email Notifications</h3>
              <p className="text-sm text-gray-300">Receive email updates</p>
            </div>
            <Button variant="outline">Enabled</Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white">Push Notifications</h3>
              <p className="text-sm text-gray-300">
                Receive push notifications
              </p>
            </div>
            <Button variant="outline">Disabled</Button>
          </div>
        </div>
      </Card>

      {/* Category Management */}
      <Card glow className="p-6">
        <div className="flex items-center mb-6">
          <Palette className="text-neon-green mr-3" size={20} />
          <h2 className="text-xl font-bold text-white">Category Management</h2>
        </div>

        <form onSubmit={handleCategorySubmit} className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Category Name"
              name="name"
              value={categoryForm.name}
              onChange={handleCategoryChange}
              error={categoryErrors.name}
            />

            <div>
              <label className="block text-sm font-semibold text-white mb-1">
                Color
              </label>
              <div className="flex items-center">
                <input
                  type="color"
                  name="color"
                  value={categoryForm.color}
                  onChange={handleCategoryChange}
                  className="w-10 h-10 border-2 border-neon-green/20 rounded cursor-pointer bg-dark-700/30 backdrop-blur-sm"
                />
                <span className="ml-2 text-sm text-gray-300">
                  {categoryForm.color}
                </span>
              </div>
            </div>

            <div className="flex items-end">
              {editingCategory ? (
                <div className="flex space-x-2">
                  <Button type="submit">Update Category</Button>
                  <Button variant="secondary" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button type="submit">Add Category</Button>
              )}
            </div>
          </div>
        </form>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neon-green/10">
            <thead className="bg-dark-700/30">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Color
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neon-green/10">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr
                    key={category._id}
                    className="hover:bg-neon-green/5 transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-3"
                          style={{
                            backgroundColor: category.color || "#000000",
                          }}
                        ></div>
                        <span className="text-sm font-medium text-white">
                          {category.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                      {category.color || "#000000"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCategory(category)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteCategory(category._id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-4 py-4 text-center text-sm text-gray-400"
                  >
                    No categories yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Danger Zone */}
      <div className="rounded-2xl p-6 border-2 border-red-500/30 bg-red-950/30 dark:bg-red-950/30 backdrop-blur-md shadow-lg transition-all duration-300">
        <div className="flex items-center mb-6">
          <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 mr-3">
            <Trash2 className="text-red-400" size={20} />
          </div>
          <h2 className="text-xl font-bold text-white">Danger Zone</h2>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg bg-red-950/20 dark:bg-red-950/20 border border-red-500/20">
          <div>
            <h3 className="font-semibold text-white">Delete Account</h3>
            <p className="text-sm text-gray-300 mt-1">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>
          </div>
          <Button
            variant="danger"
            onClick={handleDeleteAccount}
            className="whitespace-nowrap"
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
