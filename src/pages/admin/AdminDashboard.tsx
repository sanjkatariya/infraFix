import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const statsData = [
  { title: 'Total Complaints', value: '1,247', change: '+12%', icon: '⚠️', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { title: 'Active Workorders', value: '89', change: '+5%', icon: '⏰', color: 'text-orange-600', bgColor: 'bg-orange-50' },
  { title: 'Completed Today', value: '34', change: '+18%', icon: '✅', color: 'text-green-600', bgColor: 'bg-green-50' },
  { title: 'Avg Resolution Time', value: '3.2 days', change: '-8%', icon: '📈', color: 'text-purple-600', bgColor: 'bg-purple-50' },
];

const recentComplaints = [
  { id: 'CPL-5433', type: 'Pothole', location: 'Main St & 5th Ave', priority: 'High', status: 'Under Review', time: '2 hours ago' },
  { id: 'CPL-5432', type: 'Streetlight', location: 'Park Road, Sector 12', priority: 'Medium', status: 'Assigned', time: '3 hours ago' },
  { id: 'CPL-5431', type: 'Water Leak', location: 'Central Plaza', priority: 'Critical', status: 'In Progress', time: '4 hours ago' },
  { id: 'CPL-5430', type: 'Garbage', location: 'Market Street', priority: 'Low', status: 'Pending', time: '5 hours ago' },
  { id: 'CPL-5429', type: 'Drainage', location: 'Highway Junction', priority: 'Medium', status: 'Under Review', time: '6 hours ago' },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Critical': return 'bg-red-100 text-red-800';
    case 'High': return 'bg-orange-100 text-orange-800';
    case 'Medium': return 'bg-yellow-100 text-yellow-800';
    case 'Low': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'In Progress': return 'bg-blue-100 text-blue-800';
    case 'Assigned': return 'bg-purple-100 text-purple-800';
    case 'Under Review': return 'bg-yellow-100 text-yellow-800';
    case 'Pending': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function AdminDashboard() {
  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of infrastructure management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {statsData.map((stat) => {
          return (
            <div key={stat.title} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.title}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Complaints */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl">Recent Complaints</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
          </div>
          <div className="space-y-4">
            {recentComplaints.map((complaint) => (
              <div key={complaint.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{complaint.id}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${getPriorityColor(complaint.priority)}`}>
                      {complaint.priority}
                    </span>
                  </div>
                  <div className="mb-1">{complaint.type}</div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <span>📍</span>
                    {complaint.location}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-2 py-1 rounded text-xs mb-1 ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </div>
                  <div className="text-xs text-gray-500">{complaint.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl mb-6">Quick Stats</h2>
          
          <div className="space-y-6">
            {/* Priority Distribution */}
            <div>
              <div className="text-sm text-gray-600 mb-3">Complaints by Priority</div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Critical</span>
                    <span>23</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>High</span>
                    <span>45</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '36%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Medium</span>
                    <span>67</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '54%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Low</span>
                    <span>112</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Distribution */}
            <div>
              <div className="text-sm text-gray-600 mb-3">Top Categories</div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm">Potholes</span>
                  </div>
                  <span className="text-sm">487</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span className="text-sm">Streetlights</span>
                  </div>
                  <span className="text-sm">312</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm">Water Leaks</span>
                  </div>
                  <span className="text-sm">234</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span className="text-sm">Garbage</span>
                  </div>
                  <span className="text-sm">156</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
