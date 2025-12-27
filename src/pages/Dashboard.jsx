import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock, LogOut, Plus, Key, Shield, Activity } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const stats = [
    {
      label: "Total Passwords",
      value: "0",
      icon: Key,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Strong Passwords",
      value: "0",
      icon: Shield,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Recent Activity",
      value: "0",
      icon: Activity,
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Lock className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Vault Password
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {theme === "light" ? "🌙" : "☀️"}
              </button>

              {/* User Email */}
              <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                {user?.email}
              </span>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to Your Vault! 🎉
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your passwords are secure and encrypted. Start adding your first
            password.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} p-2.5 shadow-lg`}
                  >
                    <Icon className="w-full h-full text-white" />
                  </div>
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-12 border-2 border-dashed border-gray-300 dark:border-gray-700 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            No Passwords Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Your vault is empty. Start securing your passwords by adding your
            first entry.
          </p>

          <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
            <Plus className="w-5 h-5" />
            Add First Password
          </button>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-primary-50 dark:bg-primary-900/20 rounded-xl p-6 border border-primary-200 dark:border-primary-800"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                🔒 Your Vault is Secure
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All your passwords are encrypted with AES-256-GCM using your
                master password. Your master password never leaves this device
                and is only stored in memory during your session.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
