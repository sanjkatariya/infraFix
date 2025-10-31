import { useState } from 'react';
import { Button } from '@/components/ui/button';

const mockWorkorders = [
  {
    id: 'WO-1001',
    complaint: 'CPL-5432',
    type: 'Pothole',
    location: 'Main St & 5th Ave',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'Crew A',
    eta: '2 hours',
    created: '2025-10-27 09:00',
    progress: 60,
  },
  {
    id: 'WO-1002',
    complaint: 'CPL-5431',
    type: 'Streetlight',
    location: 'Park Road, Sector 12',
    priority: 'Medium',
    status: 'Assigned',
    assignedTo: 'Crew B',
    eta: '4 hours',
    created: '2025-10-27 08:30',
    progress: 30,
  },
  {
    id: 'WO-1003',
    complaint: 'CPL-5430',
    type: 'Water Leak',
    location: 'Central Plaza',
    priority: 'Critical',
    status: 'In Progress',
    assignedTo: 'Crew C',
    eta: '1 hour',
    created: '2025-10-27 07:15',
    progress: 80,
  },
  {
    id: 'WO-1004',
    complaint: 'CPL-5429',
    type: 'Garbage',
    location: 'Market Street',
    priority: 'Low',
    status: 'Pending',
    assignedTo: 'Unassigned',
    eta: '-',
    created: '2025-10-26 16:45',
    progress: 0,
  },
  {
    id: 'WO-1005',
    complaint: 'CPL-5428',
    type: 'Drainage',
    location: 'Highway Junction',
    priority: 'High',
    status: 'Completed',
    assignedTo: 'Crew A',
    eta: 'Completed',
    created: '2025-10-26 14:00',
    progress: 100,
  },
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
    case 'Completed': return 'bg-green-100 text-green-800';
    case 'In Progress': return 'bg-blue-100 text-blue-800';
    case 'Assigned': return 'bg-purple-100 text-purple-800';
    case 'Pending': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function AdminWorkorders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredWorkorders = mockWorkorders.filter(wo => {
    const matchesSearch = wo.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         wo.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         wo.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || wo.status.toLowerCase().replace(' ', '-') === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Workorders</h1>
        <p className="text-gray-600">Manage and track all workorders</p>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search workorders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <Button className="flex items-center gap-2">
              <span>➕</span>
              Create Workorder
            </Button>
          </div>
        </div>
      </div>

      {/* Workorders List */}
      <div className="space-y-4">
        {filteredWorkorders.map((workorder) => (
          <div key={workorder.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg">{workorder.id}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(workorder.priority)}`}>
                    {workorder.priority}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(workorder.status)}`}>
                    {workorder.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  Complaint: <span className="text-gray-900">{workorder.complaint}</span> • Type: <span className="text-gray-900">{workorder.type}</span>
                </div>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <span>👁️</span>
                View Details
              </Button>
            </div>

            {/* Progress Bar */}
            {workorder.progress > 0 && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="text-gray-900">{workorder.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      workorder.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${workorder.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <span>📍</span>
                <span>{workorder.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span>👥</span>
                <span>{workorder.assignedTo}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span>📅</span>
                <span>ETA: {workorder.eta}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredWorkorders.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🔍</span>
          </div>
          <h3 className="text-lg mb-2">No workorders found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}
