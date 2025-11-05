import { motion } from 'framer-motion';
import { 
  Plus, 
  Eye, 
  Trash2, 
  Edit, 
  Lock, 
  Unlock,
  Download,
  Upload,
  Shield,
  Clock
} from 'lucide-react';

const ActivityLogs = () => {
  // Mock data - replace with actual API data
  const activities = [
    {
      id: 1,
      type: 'create',
      title: 'Created new password',
      description: 'Netflix Account',
      timestamp: '2 hours ago',
      icon: Plus,
      color: 'green'
    },
    {
      id: 2,
      type: 'decrypt',
      title: 'Decrypted password',
      description: 'Gmail - work@example.com',
      timestamp: '5 hours ago',
      icon: Eye,
      color: 'blue'
    },
    {
      id: 3,
      type: 'edit',
      title: 'Updated password',
      description: 'Facebook Account',
      timestamp: '1 day ago',
      icon: Edit,
      color: 'yellow'
    },
    {
      id: 4,
      type: 'delete',
      title: 'Deleted password',
      description: 'Old Reddit Account',
      timestamp: '2 days ago',
      icon: Trash2,
      color: 'red'
    },
    {
      id: 5,
      type: 'lock',
      title: 'Locked vault',
      description: 'Vault secured successfully',
      timestamp: '3 days ago',
      icon: Lock,
      color: 'purple'
    },
    {
      id: 6,
      type: 'unlock',
      title: 'Unlocked vault',
      description: 'Vault accessed',
      timestamp: '3 days ago',
      icon: Unlock,
      color: 'green'
    }
  ];

  const getIconColor = (color) => {
    const colors = {
      green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
      blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
      red: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
      purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
            Activity Logs
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track all actions performed in your vault
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
        >
          <Download className="w-5 h-5" />
          <span className="hidden sm:inline">Export Logs</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Eye}
          label="Total Views"
          value="24"
          color="blue"
        />
        <StatCard
          icon={Plus}
          label="Created"
          value="8"
          color="green"
        />
        <StatCard
          icon={Edit}
          label="Modified"
          value="12"
          color="yellow"
        />
        <StatCard
          icon={Trash2}
          label="Deleted"
          value="3"
          color="red"
        />
      </div>

      {/* Activity Timeline */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-semibold text-slate-800 dark:text-white">
            Recent Activity
          </h2>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getIconColor(activity.color)}`}>
                  <activity.icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-white">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {activity.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5" />
                      {activity.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Empty State (show when no logs) */}
      {activities.length === 0 && (
        <div className="flex items-center justify-center min-h-[40vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-slate-400" />
            </div>
            
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
              No Activity Yet
            </h2>
            
            <p className="text-slate-600 dark:text-slate-400">
              Your activity logs will appear here once you start using the vault.
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color }) => {
  const getColorClass = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      yellow: 'from-yellow-500 to-yellow-600',
      red: 'from-red-500 to-red-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm"
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`w-8 h-8 bg-gradient-to-br ${getColorClass(color)} rounded-lg flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
        {value}
      </div>
      <div className="text-xs text-slate-600 dark:text-slate-400">
        {label}
      </div>
    </motion.div>
  );
};

export default ActivityLogs;
