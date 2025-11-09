import { useState, useEffect } from 'react';
import { X, Save, Tag, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { notesAPI } from '../utils/api';

// Utility function to normalize tags (convert string to array)
const normalizeTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  }
  return [];
};

const UpdateNoteModal = ({ isOpen, onClose, note, onSuccess, categories }) => {
  const { masterPassword } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'personal',
    tags: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && note) {
      loadNoteData();
    }
  }, [isOpen, note]);

  const loadNoteData = async () => {
    try {
      setIsDecrypting(true);
      const response = await notesAPI.decrypt(note.id, masterPassword);
      
      const content = response.data?.note || 
                     response.data?.decrypted_content || 
                     response.data?.content ||
                     response.note || 
                     response.decrypted_content || 
                     response.content;
      
      const tagsArray = normalizeTags(note.tags);
      
      setFormData({
        title: note.title || '',
        content: content || '',
        category: note.category || 'personal',
        tags: tagsArray.join(', '),
      });
    } catch (error) {
      console.error('Failed to load note:', error);
      toast.error('Failed to load note content');
    } finally {
      setIsDecrypting(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      await notesAPI.update(note.id, {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        tags: tagsArray,
      }, masterPassword);
      
      toast.success('Note updated successfully!');
      onSuccess();
    } catch (error) {
      console.error('Failed to update note:', error);
      toast.error('Failed to update note');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !note) return null;

  const availableCategories = categories.filter(cat => cat.id !== 'all');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl my-8">
        <div className="border-b border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Edit Note</h2>
          <button onClick={onClose} disabled={isLoading} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {isDecrypting ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 ${errors.title ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:ring-2 focus:ring-primary-500 outline-none`}
                  disabled={isLoading}
                />
                {errors.title && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableCategories.map((category) => {
                    const Icon = category.icon;
                    const isSelected = formData.category === category.id;
                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: category.id })}
                        disabled={isLoading}
                        className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 ${isSelected ? `border-${category.color}-500 bg-${category.color}-50 dark:bg-${category.color}-900/20` : 'border-slate-200 dark:border-slate-700'}`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{category.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Content *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={12}
                  className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 ${errors.content ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-mono text-sm`}
                  disabled={isLoading}
                />
                {errors.content && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.content}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tags</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="work, important, ideas"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  disabled={isLoading}
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button type="button" onClick={onClose} disabled={isLoading} className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold">
                  Cancel
                </button>
                <button type="submit" disabled={isLoading} className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
                  {isLoading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Saving...</> : <><Save className="w-5 h-5" />Save Changes</>}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default UpdateNoteModal;
