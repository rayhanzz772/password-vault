import { useState, useEffect } from "react";
import {
  X,
  AlertTriangle,
  Trash2,
  Lock,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { getCategoryIcon, getCategoryGradient } from "../utils/categoryIcons";

const DeleteVaultModal = ({
  isOpen,
  onClose,
  vaultItem,
  onDelete,
  isDeleting,
}) => {
  const [step, setStep] = useState(1);
  const [masterPassword, setMasterPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setMasterPassword("");
      setShowPassword(false);
      setConfirmText("");
      setError("");
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (confirmText.toLowerCase() !== "delete") {
      setError('Please type "DELETE" to confirm');
      return;
    }
    setError("");
    setStep(2);
  };

  const handleDelete = async () => {
    if (!masterPassword) {
      setError("Master password is required");
      return;
    }

    setError("");
    const result = await onDelete(vaultItem, masterPassword);

    if (result.success) {
      onClose();
    } else {
      setError(
        result.error || "Failed to delete. Please check your master password."
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (step === 1) {
        handleConfirm();
      } else {
        handleDelete();
      }
    }
  };

  if (!isOpen || !vaultItem) return null;

  const CategoryIcon = getCategoryIcon(
    vaultItem?.category || vaultItem?.category_name
  );
  const categoryGradient = getCategoryGradient(
    vaultItem?.category || vaultItem?.category_name
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="relative bg-gradient-to-br from-red-500 via-red-600 to-rose-700 p-4 sm:p-6">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center border-2 border-white/30">
                <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-white">
                  Delete Password
                </h2>
                <p className="text-red-100 text-xs sm:text-sm">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg sm:rounded-xl transition-colors disabled:opacity-50 flex-shrink-0"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all ${
                step === 1
                  ? "bg-red-500 text-white scale-110"
                  : "bg-green-500 text-white"
              }`}
            >
              {step === 1 ? (
                "1"
              ) : (
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </div>
            <div
              className={`h-1 w-10 sm:w-12 rounded-full transition-all ${
                step === 2 ? "bg-red-500" : "bg-slate-200 dark:bg-slate-700"
              }`}
            ></div>
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all ${
                step === 2
                  ? "bg-red-500 text-white scale-110"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-500"
              }`}
            >
              2
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 border-red-200 dark:border-red-900/50">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${categoryGradient} rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0`}
                  >
                    <CategoryIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-base sm:text-lg truncate">
                      {vaultItem.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate">
                      {vaultItem.username}
                    </p>
                    {vaultItem.category_name && (
                      <span className="inline-block mt-1.5 sm:mt-2 px-2 py-0.5 sm:py-1 text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg">
                        {vaultItem.category_name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Warning Message */}
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-900/50 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                <div className="flex gap-2 sm:gap-3">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1.5 sm:space-y-2">
                    <p className="font-semibold text-sm sm:text-base text-red-900 dark:text-red-100">
                      Warning: Permanent Deletion
                    </p>
                    <ul className="text-xs sm:text-sm text-red-800 dark:text-red-200 space-y-1">
                      <li className="flex items-center gap-1.5 sm:gap-2">
                        <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        This password will be permanently deleted
                      </li>
                      <li className="flex items-center gap-1.5 sm:gap-2">
                        <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        You cannot undo this action
                      </li>
                      <li className="flex items-center gap-1.5 sm:gap-2">
                        <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        All encrypted data will be removed
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Confirmation Input */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Type{" "}
                  <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded font-mono font-bold text-xs sm:text-sm">
                    DELETE
                  </span>{" "}
                  to confirm
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => {
                    setConfirmText(e.target.value);
                    setError("");
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Type 'DELETE' here"
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border-2 ${
                    error
                      ? "border-red-500 focus:ring-red-500"
                      : confirmText.toLowerCase() === "DELETE"
                      ? "border-green-500 focus:ring-green-500"
                      : "border-slate-300 dark:border-slate-600 focus:ring-red-500"
                  } bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:border-transparent transition-all outline-none`}
                  autoFocus
                />
                {error && (
                  <p className="mt-2 text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {error}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                <button
                  onClick={onClose}
                  disabled={isDeleting}
                  className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all disabled:opacity-50 order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={confirmText.toLowerCase() !== "delete"}
                  className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl font-semibold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg order-1 sm:order-2"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Master Password */}
          {step === 2 && (
            <div className="space-y-3 sm:space-y-4">
              {/* Security Notice */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-900/50 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                <div className="flex gap-2 sm:gap-3">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm sm:text-base text-blue-900 dark:text-blue-100 mb-1">
                      Master Password Required
                    </p>
                    <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200">
                      Enter your master password to authorize this deletion.
                      This ensures only you can delete your passwords.
                    </p>
                  </div>
                </div>
              </div>

              {/* Master Password Input */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Master Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={masterPassword}
                    onChange={(e) => {
                      setMasterPassword(e.target.value);
                      setError("");
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your master password"
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base rounded-xl border-2 ${
                      error
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-300 dark:border-slate-600 focus:ring-red-500"
                    } bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:border-transparent transition-all outline-none`}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
                    ) : (
                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
                    )}
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {error}
                  </p>
                )}
              </div>

              {/* Final Confirmation */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-900/50 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-100 text-center font-medium">
                  🔒 Last chance! Click "Delete Forever" to permanently remove
                  this password.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  disabled={isDeleting}
                  className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all disabled:opacity-50 order-2 sm:order-1"
                >
                  Back
                </button>
                <button
                  onClick={handleDelete}
                  disabled={!masterPassword || isDeleting}
                  className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl font-semibold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2 order-1 sm:order-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      Delete Forever
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteVaultModal;
