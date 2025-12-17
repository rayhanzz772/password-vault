import { AlertTriangle, ShieldAlert, X } from "lucide-react";

const PasswordWarningModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">
          Important Warning!
        </h2>

        {/* Content */}
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex gap-3">
              <div>
                <p className="font-semibold text-red-900 dark:text-red-200 mb-2">
                  Your Master Password Cannot Be Recovered!
                </p>
                <p className="text-sm text-red-800 dark:text-red-300">
                  If you forget your master password, there is{" "}
                  <strong>NO WAY</strong> to recover your encrypted data. All
                  your passwords and notes will be permanently lost.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <p className="font-medium text-gray-900 dark:text-white">
              Please ensure you:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">
                  ✓
                </span>
                <span>
                  Write down your master password in a secure location
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">
                  ✓
                </span>
                <span>
                  Store it in a physical safe or secure password manager
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">
                  ✓
                </span>
                <span>Never share it with anyone</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">
                  ✓
                </span>
                <span>Remember: We cannot reset or recover your password</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-medium"
          >
            Go Back
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl hover:from-primary-700 hover:to-purple-700 transition-all font-medium shadow-lg shadow-primary-500/30"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordWarningModal;
