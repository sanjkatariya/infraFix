type Page = 'dashboard' | 'workorders' | 'analytics' | 'resources';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard' as Page, label: 'Dashboard', icon: '📊' },
  { id: 'workorders' as Page, label: 'Workorders', icon: '📋' },
  { id: 'analytics' as Page, label: 'Analytics', icon: '📈' },
  { id: 'resources' as Page, label: 'Resources', icon: '👥' },
];

export default function Sidebar({ currentPage, onPageChange, onLogout }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">🛠️</span>
          </div>
          <div>
            <h1 className="text-lg">InfraFix</h1>
            <p className="text-xs text-gray-500">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <span className="text-xl">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
