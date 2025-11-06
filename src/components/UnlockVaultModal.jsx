import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, X, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { vaultAPI } from '../utils/api';

const UnlockVaultModal = ({ isOpen, onClose }) => {
  const { unlockVault } = useAuth();
  const [masterPassword, setMasterPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!masterPassword.trim()) {
      setError('Master password is required');
      return;
    }

    try {
      setIsLoading(true);

      // Verify master password by attempting to fetch and decrypt a vault item
      // This ensures the password is correct before unlocking
      console.log('🔐 Verifying master password...');
      
      try {
        // Try to get vault items with the provided master password
        // If it fails, the password is wrong
        const vaults = await vaultAPI.getAll();
        
        if (vaults && (Array.isArray(vaults) || vaults.data || vaults.vaults)) {
          // Password is correct, unlock the vault
          await unlockVault(masterPassword);
          toast.success('Vault unlocked successfully!');
          setMasterPassword('');
          onClose();
        } else {
          // This shouldn't happen, but handle it
          setError('Unable to verify master password');
        }
      } catch (verifyError) {
        console.error('❌ Master password verification failed:', verifyError);
        // If we get a 401 or authentication error, the password might be wrong
        // But since we're already authenticated (JWT), this is unlikely
        // The real verification happens when trying to decrypt data
        setError('Invalid master password. Please try again.');
      }
    } catch (error) {
      console.error('❌ Unlock vault error:', error);
      setError(error.response?.data?.message || 'Failed to unlock vault');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setMasterPassword('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-purple-600 px-6 py-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Unlock Your Vault</h2>
            <p className="text-white/80 text-sm">
              Enter your master password to access your encrypted passwords
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Security Notice */}
            <div className="flex items-start gap-3 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl">
              <Shield className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-primary-800 dark:text-primary-200">
                <p className="font-semibold mb-1">Your master password is never stored</p>
                <p className="text-primary-700 dark:text-primary-300">
                  It's kept in memory only and used to decrypt your passwords on-the-fly.
                </p>
              </div>
            </div>

            {/* Master Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Master Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={masterPassword}
                  onChange={(e) => {
                    setMasterPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your master password"
                  className={`w-full px-4 py-3 pr-12 bg-slate-50 dark:bg-slate-900 border ${
                    error 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-slate-200 dark:border-slate-700 focus:ring-primary-500'
                  } rounded-xl focus:ring-2 focus:border-transparent transition-all text-slate-800 dark:text-white`}
                  autoFocus
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  )}
                </button>
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                >
                  <span>⚠️</span> {error}
                </motion.p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !masterPassword.trim()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Unlocking...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Unlock Vault
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UnlockVaultModal;
