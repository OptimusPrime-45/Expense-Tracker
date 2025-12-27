import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Moon, Sun, User, LogOut, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="glass-card sticky top-0 z-50 border-b border-neon-green/10">
      <div className="flex items-center justify-between px-6 py-4 md:px-8">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-linear-to-br from-neon-green to-neon-aqua">
            <Zap size={24} className="text-dark-900 dark:text-white" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">ExpenseTracker</h1>
        </div>

        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-dark-700/50 border border-white/80 text-neon-green hover:border-neon-green hover:shadow-neon-green transition-all duration-300"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="text-white" size={20} /> : <Moon className="text-white" size={20} />}
          </button>

          {/* User Menu */}
          <div className="relative group">
            <button className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-dark-700/50 border border-neon-aqua/20 text-white hover:border-neon-aqua hover:shadow-neon-aqua transition-all duration-300">
              <div className="p-1 rounded-full bg-linear-to-r from-neon-green to-neon-aqua">
                <User size={16} className="text-dark-900" />
              </div>
              <span className="hidden md:inline font-medium">
                {user?.name || "User"}
              </span>
            </button>

            <div className="absolute right-0 mt-2 w-48 glass-card rounded-xl shadow-glass py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2.5 text-sm text-white hover:bg-neon-green/10 transition-colors"
              >
                <LogOut size={16} className="mr-2 text-neon-green" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
