import { useState } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Workorders from './Workorders';
import Analytics from './Analytics';
import Resources from './Resources';

type Page = 'dashboard' | 'workorders' | 'analytics' | 'resources';

interface AdminAppProps {
  onLogout: () => void;
}

export default function AdminApp({ onLogout }: AdminAppProps) {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'workorders':
        return <Workorders />;
      case 'analytics':
        return <Analytics />;
      case 'resources':
        return <Resources />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onLogout={onLogout}
      />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
}
