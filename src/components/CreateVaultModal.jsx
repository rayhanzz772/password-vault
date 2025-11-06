import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Eye, 
  EyeOff, 
  Copy, 
  RefreshCw, 
  Lock,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { vaultAPI, categoriesAPI } from '../utils/api';
import { generatePassword, calculatePasswordStrength } from '../utils/passwordGenerator';

const CreateVaultModal = ({ isOpen, onClose, onSuccess }) => {
  const { masterPassword } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    note: '',
    category_id: '',
  });

  const [categories, setCategories] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [breachWarning, setBreachWarning] = useState(null);
  const [errors, setErrors] = useState({});

  // Password generator state
  const [showGenerator, setShowGenerator] = useState(false);
  const [generatorOptions, setGeneratorOptions] = useState({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  // Fetch categories on mount
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const data = await categoriesAPI.getAll();
      console.log('📂 Categories API response:', data);
      
      // Handle different response structures
      let categoryList = [];
      if (Array.isArray(data)) {
        categoryList = data;
      } else if (data.categories && Array.isArray(data.categories)) {
        categoryList = data.categories;
      } else if (data.data && Array.isArray(data.data)) {
        categoryList = data.data;
      } else if (data.data && data.data.categories && Array.isArray(data.data.categories)) {
        categoryList = data.data.categories;
      }
      
      console.log('📋 Processed category list:', categoryList);
      
      // Use fetched categories or fallback
      if (categoryList.length > 0) {
        setCategories(categoryList);
      } else {
        // Fallback categories if API returns empty
        setCategories([
          { id: 1, name: 'Work' },
          { id: 2, name: 'Personal' },
          { id: 3, name: 'Finance' },
          { id: 4, name: 'Social' },
          { id: 5, name: 'Game' },
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Fallback categories if API fails
      setCategories([
        { id: 1, name: 'Work' },
        { id: 2, name: 'Personal' },
        { id: 3, name: 'Finance' },
        { id: 4, name: 'Social' },
        { id: 5, name: 'Game' },
      ]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setBreachWarning(null);
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword(generatorOptions);
    setFormData((prev) => ({ ...prev, password: newPassword }));
    toast.success('Password generated!');
  };

  const handleCopyPassword = () => {
    if (formData.password) {
      navigator.clipboard.writeText(formData.password);
      toast.success('Password copied!');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    if (!formData.category_id) {
      newErrors.category_id = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!masterPassword) {
      toast.error('Master password not found. Please log in again.');
      return;
    }

    setIsLoading(true);
    setBreachWarning(null);

    try {
      const result = await vaultAPI.create(formData, masterPassword);
      
      // Check for breach warning in response
      if (result.message && result.message.includes('ditemukan')) {
        setBreachWarning(result.message);
        toast.warning('Password breach detected!');
        setIsLoading(false);
        return; // Keep modal open
      }

      toast.success('Password saved successfully!');
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Failed to create vault:', error);
      const errorMsg = error.response?.data?.message || 'Failed to save password';
      
      // Check if error message contains breach warning
      if (errorMsg.includes('ditemukan')) {
        setBreachWarning(errorMsg);
        toast.warning('Password breach detected!');
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      username: '',
      password: '',
      note: '',
      category_id: '',
    });
    setErrors({});
    setBreachWarning(null);
    setShowGenerator(false);
    onClose();
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  Add New Password
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Securely store your credentials
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Breach Warning */}
          {breachWarning && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-6 mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-800 dark:text-red-300 mb-1">
                  ⚠️ Security Warning
                </h4>
                <p className="text-sm text-red-700 dark:text-red-400">
                  {breachWarning}
                </p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Gmail Account"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.name
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-slate-300 dark:border-slate-600 focus:ring-primary-500'
                } bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:border-transparent transition-all outline-none`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Username / Email <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.username
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-slate-300 dark:border-slate-600 focus:ring-primary-500'
                } bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:border-transparent transition-all outline-none`}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username}</p>
              )}
            </div>

            {/* Password Field with Generator */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowGenerator(!showGenerator)}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                >
                  {showGenerator ? 'Hide Generator' : 'Generate Password'}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter a strong password"
                  className={`w-full px-4 py-3 pr-24 rounded-xl border ${
                    errors.password
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-300 dark:border-slate-600 focus:ring-primary-500'
                  } bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:border-transparent transition-all outline-none font-mono`}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-slate-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyPassword}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>

              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      Strength:
                    </span>
                    <span className={`text-xs font-semibold ${
                      passwordStrength.color === 'red' ? 'text-red-600' :
                      passwordStrength.color === 'orange' ? 'text-orange-600' :
                      passwordStrength.color === 'yellow' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passwordStrength.color === 'red' ? 'bg-red-500' :
                        passwordStrength.color === 'orange' ? 'bg-orange-500' :
                        passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Password Generator */}
              {showGenerator && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  <div className="space-y-3">
                    {/* Length Slider */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Length
                        </label>
                        <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                          {generatorOptions.length}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="8"
                        max="32"
                        value={generatorOptions.length}
                        onChange={(e) =>
                          setGeneratorOptions((prev) => ({
                            ...prev,
                            length: parseInt(e.target.value),
                          }))
                        }
                        className="w-full"
                      />
                    </div>

                    {/* Options Checkboxes */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: 'uppercase', label: 'Uppercase (A-Z)' },
                        { key: 'lowercase', label: 'Lowercase (a-z)' },
                        { key: 'numbers', label: 'Numbers (0-9)' },
                        { key: 'symbols', label: 'Symbols (!@#$)' },
                      ].map((option) => (
                        <label
                          key={option.key}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={generatorOptions[option.key]}
                            onChange={(e) =>
                              setGeneratorOptions((prev) => ({
                                ...prev,
                                [option.key]: e.target.checked,
                              }))
                            }
                            className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>

                    {/* Generate Button */}
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Generate Password
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.category_id
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-slate-300 dark:border-slate-600 focus:ring-primary-500'
                } bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:border-transparent transition-all outline-none`}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="mt-1 text-sm text-red-500">{errors.category_id}</p>
              )}
            </div>

            {/* Note Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Note <span className="text-slate-400">(Optional)</span>
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Add any additional notes..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none resize-none"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Save Password
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

export default CreateVaultModal;
