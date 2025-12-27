import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { useTheme } from "../context/ThemeContext";
import { Lock, Mail, Zap, Moon, Sun } from "lucide-react";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

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

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate("/");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden ${
        isDarkMode ? "" : "bg-gray-50"
      }`}
    >
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 z-20 p-3 rounded-xl transition-all duration-300 ${
          isDarkMode
            ? "bg-dark-700/50 border border-neon-green/30 text-neon-green hover:border-neon-green hover:shadow-neon-green"
            : "bg-white border border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-lg"
        }`}
        aria-label="Toggle theme"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-green/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-aqua/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="mx-auto bg-linear-to-br from-neon-green to-neon-aqua rounded-2xl p-4 w-20 h-20 flex items-center justify-center mb-6 shadow-neon-green">
            <Zap className="text-dark-900" size={40} />
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Welcome Back
          </h1>
          <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
            Sign in to your{" "}
            <span className="text-neon-green font-semibold">
              ExpenseTracker
            </span>{" "}
            account
          </p>
        </div>

        <Card glow className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="you@example.com"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
            />

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-neon-green/30 bg-dark-700 text-neon-green focus:ring-neon-aqua"
                />
                <label
                  htmlFor="remember-me"
                  className={`ml-2 block text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-neon-aqua hover:text-neon-green transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <Button type="submit" className="w-full mt-6">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-neon-green hover:text-neon-aqua transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <p
            className={`text-xs ${
              isDarkMode ? "text-gray-500" : "text-gray-600"
            }`}
          >
            &copy; 2025 ExpenseTracker. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
