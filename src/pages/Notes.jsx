import { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  Grid,
  List,
  Filter,
  Lock,
  LockOpen,
  Calendar,
  Tag,
  Eye,
  Edit,
  Trash2,
  X,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { notesAPI, categoriesAPI } from '../utils/api';
import { getCategoryIcon, getCategoryGradient } from '../utils/categoryIcons';
import CreateNoteModal from '../components/CreateNoteModal';
import ViewNoteModal from '../components/ViewNoteModal';
import UpdateNoteModal from '../components/UpdateNoteModal';
import DeleteNoteModal from '../components/DeleteNoteModal';

const normalizeTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  }
  return [];
};

const Notes = () => {
  const { masterPassword } = useAuth();

  const isVaultLocked = !masterPassword;

  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [showFilters, setShowFilters] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    if (!isVaultLocked) {
      fetchCategories();
    }
  }, [isVaultLocked]);

  const fetchCategories = async () => {
    try {
      const data = await categoriesAPI.getAll();

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

      setCategories(categoryList);
      console.log(categoryList)
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Failed to load categories');
      setCategories([]);
    }
  };

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const response = await notesAPI.getAll();
      const notesData = response.data || response.notes || response || [];
      const normalizedNotes = (Array.isArray(notesData) ? notesData : []).map(note => ({
        ...note,
        tags: normalizeTags(note.tags)
      }));
      setNotes(normalizedNotes);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      toast.error('Failed to load notes');
      setNotes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isVaultLocked) {
      fetchNotes();
    }
  }, [isVaultLocked]);

  useEffect(() => {
    let filtered = notes;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(note => {
        if (note.category_id === selectedCategory) return true;

        const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);
        if (selectedCategoryData && note.category_name?.toLowerCase() === selectedCategoryData.name.toLowerCase()) {
          return true;
        }

        if (note.category === selectedCategory) return true;

        return false;
      });
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(note =>
        note.title?.toLowerCase().includes(query) ||
        note.preview?.toLowerCase().includes(query) ||
        note.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredNotes(filtered);
  }, [notes, selectedCategory, searchQuery, categories]);

  const getCategoryData = (categoryNameOrId) => {
    let category = categories.find(cat => cat.name.toLowerCase() === categoryNameOrId?.toLowerCase());
    if (!category) {
      category = categories.find(cat => cat.id === categoryNameOrId);
    }
    return category || categories[0];
  };

  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return notes.length;

    return notes.filter(note => {
      if (note.category_id === categoryId) return true;

      const categoryData = categories.find(cat => cat.id === categoryId);
      if (categoryData && note.category_name?.toLowerCase() === categoryData.name.toLowerCase()) {
        return true;
      }

      if (note.category === categoryId) return true;

      return false;
    }).length;
  };

  const categoryFilters = [
    { id: 'all', name: 'All Notes' },
    ...categories
  ];

  const handleView = (note) => {
    setSelectedNote(note);
    setShowViewModal(true);
  };

  const handleEdit = (note) => {
    setSelectedNote(note);
    setShowUpdateModal(true);
  };

  const handleDelete = (note) => {
    setSelectedNote(note);
    setShowDeleteModal(true);
  };

  const handleCreateSuccess = () => {
    fetchNotes();
    setShowCreateModal(false);
  };

  const handleUpdateSuccess = () => {
    fetchNotes();
    setShowUpdateModal(false);
  };

  const handleDeleteSuccess = () => {
    fetchNotes();
    setShowDeleteModal(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };


  if (isVaultLocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <Lock className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-3">
              Notes Locked
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-2">
              Your secret notes are protected
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Unlock your vault with your master password to access your encrypted notes
            </p>
          </div>

          {/* Info Cards */}
          <div className="space-y-3 mb-8">
            <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-1">
                  End-to-End Encrypted
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  All notes are encrypted with your master password
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-1">
                  Zero-Knowledge Security
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Only you can decrypt and read your notes
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-1">
                  Private Notes Storage
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Store personal thoughts, ideas, and sensitive information
                </p>
              </div>
            </div>
          </div>

          {/* Unlock Instruction */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-4 text-center">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Tip:</strong> Click the <strong>"Unlock Vault"</strong> button in the sidebar to access your notes
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-3">
                <FileText className="w-8 h-8" />
                Secret Notes
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Securely store your private notes and thoughts
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Note
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes by title, content, or tags..."
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-slate-800 dark:text-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid'
                    ? 'bg-primary-500 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list'
                    ? 'bg-primary-500 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 text-slate-700 dark:text-slate-300"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Category Filters */}
          {showFilters && (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-6">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {categoryFilters.map((category) => {
                  const Icon = getCategoryIcon(category.name);
                  const gradient = getCategoryGradient(category.name);
                  const count = getCategoryCount(category.id);
                  const isSelected = selectedCategory === category.id;

                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${isSelected
                          ? `bg-gradient-to-r ${gradient} text-white shadow-lg`
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      {category.name}
                      <span className={`px-2 py-0.5 rounded-full text-xs ${isSelected
                          ? 'bg-white/20'
                          : 'bg-slate-200 dark:bg-slate-600'
                        }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notes Display */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading notes...</p>
            </div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-md">
              <FileText className="w-20 h-20 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                {searchQuery || selectedCategory !== 'all' ? 'No notes found' : 'No notes yet'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {searchQuery || selectedCategory !== 'all'
                  ? 'Try adjusting your filters or search query'
                  : 'Create your first encrypted note to get started'}
              </p>
              {!searchQuery && selectedCategory === 'all' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Note
                </button>
              )}
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => {
              // Backend returns category_name, fallback to category_id or category
              const categoryData = getCategoryData(note.category_name || note.category_id || note.category);
              const Icon = getCategoryIcon(categoryData?.name);
              const gradient = getCategoryGradient(categoryData?.name);

              return (
                <div
                  key={note.id}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all overflow-hidden group"
                >
                  {/* Header */}
                  <div className={`bg-gradient-to-r ${gradient} p-4 flex items-center justify-between`}>
                    <div className="flex items-center gap-2 text-white">
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{categoryData?.name}</span>
                    </div>
                    <Lock className="w-4 h-4 text-white/70" />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2 line-clamp-2">
                      {note.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                      {note.preview || 'Click to view encrypted content'}
                    </p>

                    {/* Tags */}
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {note.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-lg"
                          >
                            #{tag}
                          </span>
                        ))}
                        {note.tags.length > 3 && (
                          <span className="px-2 py-1 text-slate-500 text-xs">
                            +{note.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(note.updated_at || note.created_at)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(note)}
                        className="flex-1 px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(note)}
                        className="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(note)}
                        className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            {filteredNotes.map((note) => {
              // Backend returns category_name, fallback to category_id or category
              const categoryData = getCategoryData(note.category_name || note.category_id || note.category);
              const Icon = getCategoryIcon(categoryData?.name);
              const gradient = getCategoryGradient(categoryData?.name);

              return (
                <div
                  key={note.id}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all p-4 flex items-center gap-4"
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-1 truncate">
                      {note.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Icon className="w-3 h-3" />
                        {categoryData?.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(note.updated_at || note.created_at)}
                      </span>
                      {note.tags && note.tags.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {note.tags.length} tags
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleView(note)}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all flex items-center gap-2 text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(note)}
                      className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(note)}
                      className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateNoteModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
        categories={categories}
      />

      <ViewNoteModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        note={selectedNote}
        onEdit={handleEdit}
        onDelete={handleDelete}
        categories={categories}
      />

      <UpdateNoteModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        note={selectedNote}
        onSuccess={handleUpdateSuccess}
        categories={categories}
      />

      <DeleteNoteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        note={selectedNote}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
};

export default Notes;
