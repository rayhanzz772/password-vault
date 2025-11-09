import { useState, useEffect } from 'react';
import { X, Eye, Copy, Edit, Trash2, Lock, Calendar, Tag, FileText, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { notesAPI } from '../utils/api';
import { getCategoryIcon, getCategoryGradient } from '../utils/categoryIcons';

// Utility function to normalize tags (convert string to array)
const normalizeTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  }
  return [];
};

const ViewNoteModal = ({ isOpen, onClose, note, onEdit, onDelete, categories }) => {
  const { masterPassword } = useAuth();
  
  const [decryptedContent, setDecryptedContent] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptError, setDecryptError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [canRetry, setCanRetry] = useState(true);
  const [retryCountdown, setRetryCountdown] = useState(0);

  useEffect(() => {
    if (isOpen && note) {
      decryptNote();
      setRetryCount(0);
      setCanRetry(true);
      setRetryCountdown(0);
    } else {
      setDecryptedContent('');
      setDecryptError('');
      setRetryCount(0);
      setCanRetry(true);
      setRetryCountdown(0);
    }
  }, [isOpen, note]);

  // Countdown effect for retry cooldown
  useEffect(() => {
    if (retryCountdown > 0) {
      const timer = setTimeout(() => {
        setRetryCountdown(retryCountdown - 1);
        if (retryCountdown - 1 === 0) {
          setCanRetry(true);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [retryCountdown]);

  const decryptNote = async () => {
    if (!note || !masterPassword || !canRetry) return;

    try {
      setIsDecrypting(true);
      setDecryptError('');
      
      const response = await notesAPI.decrypt(note.id, masterPassword);
      
      const content = response.data?.note || 
                     response.data?.decrypted_content || 
                     response.data?.content ||
                     response.note || 
                     response.decrypted_content || 
                     response.content;
      
      setDecryptedContent(content || '');
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error('Failed to decrypt note:', error);
      
      // Increment retry count
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);
      
      // Handle specific error messages
      let errorMessage = 'Failed to decrypt note. Please check your master password.';
      let shouldCooldown = false;
      let cooldownSeconds = 5;
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 429 || data?.message?.toLowerCase().includes('too many')) {
          errorMessage = 'Too many decrypt attempts. Please wait before trying again.';
          toast.error('Too many attempts - Please wait');
          shouldCooldown = true;
          cooldownSeconds = 60;
        } else if (status === 401 || data?.message?.toLowerCase().includes('incorrect') || data?.message?.toLowerCase().includes('invalid')) {
          errorMessage = 'Incorrect master password. Please try again.';
          toast.error('Incorrect password');
          if (newRetryCount >= 3) {
            shouldCooldown = true;
            cooldownSeconds = Math.min(5 * Math.pow(2, newRetryCount - 3), 60); 
            errorMessage += ` (${newRetryCount} failed attempts - please wait ${cooldownSeconds}s)`;
          }
        } else if (status === 404) {
          errorMessage = 'Note not found.';
          toast.error('Note not found');
        } else if (data?.message) {
          errorMessage = data.message;
          toast.error(data.message);
        } else {
          toast.error('Failed to decrypt');
        }
      } else if (error.message) {
        errorMessage = error.message;
        toast.error('Failed to decrypt');
      } else {
        toast.error('Failed to decrypt');
      }
      
      // Apply cooldown if needed
      if (shouldCooldown) {
        setCanRetry(false);
        setRetryCountdown(cooldownSeconds);
      }
      
      setDecryptError(errorMessage);
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleCopy = () => {
    if (decryptedContent) {
      navigator.clipboard.writeText(decryptedContent);
      toast.success('Note content copied to clipboard!');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen || !note) return null;

  // Backend returns category_name, try to match by name first, then by ID
  const categoryData = categories.find(cat => cat.name.toLowerCase() === note.category_name?.toLowerCase()) ||
                       categories.find(cat => cat.id === note.category_id) ||
                       categories.find(cat => cat.id === note.category) ||
                       categories[1];
  const Icon = getCategoryIcon(categoryData?.name);
  const gradient = getCategoryGradient(categoryData?.name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl my-8">
        {/* Header */}
        <div className={`bg-gradient-to-r ${gradient} p-6 flex items-center justify-between`}>
          <div className="flex-1 mr-4">
            <div className="flex items-center gap-3 mb-2">
              <Icon className="w-6 h-6 text-white" />
              <span className="text-white/80 text-sm font-medium">{categoryData?.name}</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              {note.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Calendar className="w-4 h-4" />
              <span>Created: {formatDate(note.created_at)}</span>
            </div>
            {note.updated_at && note.updated_at !== note.created_at && (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Calendar className="w-4 h-4" />
                <span>Updated: {formatDate(note.updated_at)}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Lock className="w-4 h-4" />
              <span>Encrypted</span>
            </div>
          </div>

          {/* Tags */}
          {(() => {
            const tags = normalizeTags(note.tags);
            return tags.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm rounded-lg"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Decrypted Content */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Content</span>
              </div>
              {decryptedContent && (
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-all flex items-center gap-2 text-sm"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              )}
            </div>

            <div className="min-h-[200px] p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl">
              {isDecrypting ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Decrypting note...</p>
                  </div>
                </div>
              ) : decryptError ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 dark:text-red-400 mb-4">{decryptError}</p>
                                      
                    {!canRetry && retryCountdown > 0 ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
                          <Lock className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Please wait {retryCountdown}s before retrying
                          </span>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={decryptNote}
                        disabled={!canRetry}
                        className="text-sm text-primary-600 dark:text-primary-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Try Again
                      </button>
                    )}
                  </div>
                </div>
              ) : decryptedContent ? (
                <pre className="whitespace-pre-wrap break-words text-slate-800 dark:text-white font-mono text-sm">
                  {decryptedContent}
                </pre>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <p className="text-slate-500 dark:text-slate-400">The content was encrypted</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(note);
              }}
              className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-all flex items-center justify-center gap-2"
            >
              <Edit className="w-5 h-5" />
              Edit Note
            </button>
            <button
              onClick={() => {
                onClose();
                onDelete(note);
              }}
              className="px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewNoteModal;
