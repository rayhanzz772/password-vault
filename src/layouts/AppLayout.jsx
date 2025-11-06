import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import CreateVaultModal from '../components/CreateVaultModal';
import UnlockVaultModal from '../components/UnlockVaultModal';

const AppLayout = () => {
  const location = useLocation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCreateSuccess = () => {
    setRefreshTrigger(prev => prev + 1); // Trigger refresh in child components
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleUnlock = () => {
    setIsUnlockModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <Sidebar 
          onNewPassword={() => setIsCreateModalOpen(true)}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          onUnlock={handleUnlock}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar 
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Outlet context={{ 
              refreshTrigger, 
              openCreateModal: () => setIsCreateModalOpen(true),
              searchQuery,
              selectedCategory,
              onSearchChange: handleSearch,
              onCategoryChange: handleCategoryChange
            }} />
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay - Future Enhancement */}
      {/* Can add mobile sidebar toggle here */}

      {/* Global Create Vault Modal */}
      <CreateVaultModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Unlock Vault Modal */}
      <UnlockVaultModal
        isOpen={isUnlockModalOpen}
        onClose={() => setIsUnlockModalOpen(false)}
      />
    </div>
  );
};

export default AppLayout;
