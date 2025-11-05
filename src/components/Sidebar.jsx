import { NavLink } from 'react-router-dom';
import { 
  LayoutGrid, 
  Briefcase, 
  Wallet, 
  Users, 
  Activity,
  Plus,
  Gamepad2
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ onNewPassword }) => {
  const categories = [
    { name: 'All', icon: LayoutGrid, path: '/app', count: 0 },
    { name: 'Work', icon: Briefcase, path: '/app/work', count: 0 },
    { name: 'Game', icon: Gamepad2, path: '/app/game', count: 0 },
    { name: 'Finance', icon: Wallet, path: '/app/finance', count: 0 },
    { name: 'Social', icon: Users, path: '/app/social', count: 0 },
  ];

  const secondaryLinks = [
    { name: 'Activity Logs', icon: Activity, path: '/app/logs' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full">
      {/* Add New Button */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewPassword}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>New Password</span>
        </motion.button>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          <p className="px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Categories
          </p>
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <NavLink
                key={category.path}
                to={category.path}
                end={category.path === '/app'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon 
                        className={`w-5 h-5 ${
                          isActive 
                            ? 'text-primary-600 dark:text-primary-400' 
                            : 'text-slate-500 dark:text-slate-500'
                        }`} 
                      />
                      <span className="font-medium text-sm">
                        {category.name}
                      </span>
                    </div>
                    {category.count > 0 && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {category.count}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="my-4 mx-3 border-t border-slate-200 dark:border-slate-800"></div>

        {/* Secondary Links */}
        <nav className="space-y-1 px-3">
          <p className="px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Other
          </p>
          {secondaryLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon 
                      className={`w-5 h-5 ${
                        isActive 
                          ? 'text-primary-600 dark:text-primary-400' 
                          : 'text-slate-500 dark:text-slate-500'
                      }`} 
                    />
                    <span className="font-medium text-sm">
                      {link.name}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Vault Unlocked
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            All passwords encrypted
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
