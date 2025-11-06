import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Eye, 
  Copy, 
  MoreVertical, 
  Globe, 
  Lock,
  Star,
  Trash2,
  Edit
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { vaultAPI } from '../utils/api';
import CreateVaultModal from '../components/CreateVaultModal';
import DecryptModal from '../components/DecryptModal';
import DeleteVaultModal from '../components/DeleteVaultModal';

const Passwords = () => {
  const { 
    refreshTrigger, 
    openCreateModal, 
    searchQuery, 
    selectedCategory 
  } = useOutletContext();
  const { masterPassword } = useAuth();
  const [passwords, setPasswords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDecryptModalOpen, setIsDecryptModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVault, setSelectedVault] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch passwords on mount and when refresh trigger, search, or category changes
  useEffect(() => {
    fetchPasswords();
  }, [refreshTrigger, searchQuery, selectedCategory]);

  const fetchPasswords = async () => {
    try {
      setIsLoading(true);
      
      // Build filters object
      const filters = {};
      if (selectedCategory) {
        filters.category = selectedCategory;
      }
      if (searchQuery) {
        filters.search = searchQuery;
      }
      
      console.log('🔍 Fetching with filters:', filters);
      const data = await vaultAPI.getAll(filters);
      console.log('📦 Vault API response:', data);
      
      // Handle different response structures
      let vaultList = [];
      if (Array.isArray(data)) {
        vaultList = data;
      } else if (data.vaults && Array.isArray(data.vaults)) {
        vaultList = data.vaults;
      } else if (data.data && Array.isArray(data.data)) {
        vaultList = data.data;
      } else if (data.data && data.data.vaults && Array.isArray(data.data.vaults)) {
        vaultList = data.data.vaults;
      }
      
      console.log('📋 Processed vault list:', vaultList);
      setPasswords(vaultList);
    } catch (error) {
      console.error('Failed to fetch passwords:', error);
      toast.error('Failed to load passwords');
      setPasswords([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    fetchPasswords(); // Refresh list
  };

  const handleDecrypt = (vault) => {
    setSelectedVault(vault);
    setIsDecryptModalOpen(true);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleDeleteClick = (vault) => {
    setSelectedVault(vault);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async (vault, password) => {
    try {
      setDeletingId(vault.id);
      console.log('🗑️ Deleting vault:', vault.id);
      
      await vaultAPI.delete(vault.id, password);
      
      toast.success('Password deleted successfully!');
      fetchPasswords(); // Refresh list
      return { success: true };
    } catch (error) {
      console.error('Failed to delete:', error);
      const errorMsg = error.response?.data?.message || 'Failed to delete password';
      return { success: false, error: errorMsg };
    } finally {
      setDeletingId(null);
    }
  };

  // Empty State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading passwords...</p>
        </div>
      </div>
    );
  }

  if (passwords.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Lock className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
            No Passwords Yet
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Your vault is empty. Start securing your passwords by adding your first entry.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            Add First Password
          </motion.button>
          
          {/* Info Card */}
          <div className="mt-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 border border-primary-100 dark:border-primary-800">
            <div className="flex items-start gap-3 text-left">
              <Lock className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">
                  🔒 End-to-End Encrypted
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  All passwords are encrypted with AES-256-CBC using your master password.
                  Only you can decrypt them.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Password List View (for when there are passwords)
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
            All Passwords
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {passwords.length} {passwords.length === 1 ? 'password' : 'passwords'} stored securely
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add Password</span>
        </motion.button>
      </div>

      {/* Password Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {passwords.map((password, index) => (
          <PasswordCard 
            key={password.id || index} 
            password={password} 
            onCopy={handleCopy}
            onDecrypt={handleDecrypt}
            onDelete={handleDeleteClick}
            isDeleting={deletingId === password.id}
          />
        ))}
      </div>

      {/* Decrypt Modal */}
      <DecryptModal
        isOpen={isDecryptModalOpen}
        onClose={() => setIsDecryptModalOpen(false)}
        vaultItem={selectedVault}
      />

      {/* Delete Modal */}
      <DeleteVaultModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedVault(null);
        }}
        vaultItem={selectedVault}
        onDelete={handleDeleteConfirm}
        isDeleting={deletingId !== null}
      />
    </div>
  );
};

// Password Card Component
const PasswordCard = ({ password, onCopy, onDecrypt, onDelete, isDeleting }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white">
              {password.name || password.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {password.username}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {password.isFavorite && (
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          )}
          <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-all">
            <MoreVertical className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Password Field - Encrypted */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm text-slate-700 dark:text-slate-300">
            ••••••••••••
          </span>
          <button
            onClick={() => onDecrypt(password)}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Decrypt password"
          >
            <Eye className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onDecrypt(password)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
        <button 
          onClick={() => onDelete(password)}
          disabled={isDeleting}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? (
            <>
              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              Delete
            </>
          )}
        </button>
      </div>

      {/* Metadata */}
      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{password.category_name || 'Uncategorized'}</span>
          <span>Updated at {password.lastUpdated || password.updated_at || 'recently'}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Passwords;
