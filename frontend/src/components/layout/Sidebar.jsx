import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  BarChart3,
  Settings,
  Zap,
  PlusCircle,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Transactions", path: "/transactions", icon: FileText },
    { name: "Reports", path: "/reports", icon: BarChart3 },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <aside className="hidden md:block w-64 glass-card border-r border-neon-green/10">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-neon-green/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-linear-to-br from-neon-green to-neon-aqua">
              <Zap size={20} className="text-dark-900 dark:text-white" />
            </div>
            <h2 className="text-xl font-bold gradient-text">ExpenseTracker</h2>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-3 rounded-xl transition-all duration-300 group ${
                      isActive
                        ? "bg-linear-to-r from-neon-green to-neon-aqua text-dark-900 font-semibold shadow-neon-green"
                        : "text-gray-300 hover:bg-dark-700 hover:text-neon-green hover:border-neon-green/30 border border-transparent"
                    }`}
                  >
                    <Icon size={20} className="mr-3" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-neon-green/10">
          <Link to="/transactions">
            <button className="w-full flex items-center justify-center p-3 bg-linear-to-r from-neon-green to-neon-aqua text-white border-2 border-white/80 hover:border-white rounded-xl font-semibold hover:shadow-neon-green transition-all duration-300 btn-glow">
              <PlusCircle size={20} className="mr-2" />
              Add Transaction
            </button>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
