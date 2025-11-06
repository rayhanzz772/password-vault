import { useState, useEffect, useRef } from 'react';
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
import UpdateVaultModal from '../components/UpdateVaultModal';

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
  const [isFiltering, setIsFiltering] = useState(false); // Separate state for filter operations
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDecryptModalOpen, setIsDecryptModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedVault, setSelectedVault] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch passwords on mount and when refresh trigger, search, or category changes
  useEffect(() => {
    const isInitialLoad = passwords.length === 0 && isLoading;
    fetchPasswords(isInitialLoad);
  }, [refreshTrigger, searchQuery, selectedCategory]);

  const fetchPasswords = async (isInitialLoad = false) => {
    try {
      // Only show full loading on initial load, use filtering state for filter changes
      if (isInitialLoad) {
        setIsLoading(true);
      } else {
        setIsFiltering(true);
      }
      
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
      setIsFiltering(false);
    }
  };

  const handleCreateSuccess = () => {
    fetchPasswords(); // Refresh list
  };

  const handleDecrypt = (vault) => {
    setSelectedVault(vault);
    setIsDecryptModalOpen(true);
  };

  const handleUpdateClick = (vault) => {
    setSelectedVault(vault);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSuccess = () => {
    fetchPasswords(); // Refresh list after update
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

  // Locked Vault State
  if (!masterPassword) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
            Vault is Locked
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Your vault is currently locked. Please unlock it with your master password to access your encrypted passwords.
          </p>
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              💡 Tip: Click the "Unlock Vault" button in the sidebar to enter your master password.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-3">
            All Passwords
            {isFiltering && (
              <span className="inline-flex items-center gap-2 text-sm font-normal text-primary-600 dark:text-primary-400">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Filtering...
              </span>
            )}
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
            key={password.id || `password-${index}`} 
            password={password} 
            onCopy={handleCopy}
            onDecrypt={handleDecrypt}
            onUpdate={handleUpdateClick}
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

      {/* Update Modal */}
      <UpdateVaultModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedVault(null);
        }}
        vaultItem={selectedVault}
        onSuccess={handleUpdateSuccess}
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
const PasswordCard = ({ password, onCopy, onDecrypt, onUpdate, onDelete, isDeleting }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group relative"
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
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-all"
            >
              <MoreVertical className="w-4 h-4 text-slate-500" />
            </button>
            
            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-10">
                <button
                  onClick={() => {
                    onUpdate(password);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(password);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  disabled={isDeleting}
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>
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
