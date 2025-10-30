

const crews = [
  {
    id: 'CREW-A',
    name: 'Crew Alpha',
    leader: 'John Smith',
    members: 4,
    status: 'Active',
    location: 'Main St & 5th Ave',
    phone: '+1 (555) 0101',
    completedToday: 5,
    equipment: ['Asphalt Mixer', 'Compactor', 'Safety Gear'],
  },
  {
    id: 'CREW-B',
    name: 'Crew Beta',
    leader: 'Sarah Johnson',
    members: 3,
    status: 'Active',
    location: 'Park Road, Sector 12',
    phone: '+1 (555) 0102',
    completedToday: 3,
    equipment: ['Ladder Truck', 'Electrical Tools', 'Safety Harness'],
  },
  {
    id: 'CREW-C',
    name: 'Crew Charlie',
    leader: 'Mike Davis',
    members: 5,
    status: 'Active',
    location: 'Central Plaza',
    phone: '+1 (555) 0103',
    completedToday: 4,
    equipment: ['Excavator', 'Pipe Wrench', 'Welding Equipment'],
  },
  {
    id: 'CREW-D',
    name: 'Crew Delta',
    leader: 'Emma Wilson',
    members: 3,
    status: 'Available',
    location: 'Base Station',
    phone: '+1 (555) 0104',
    completedToday: 6,
    equipment: ['Garbage Truck', 'Cleaning Tools', 'Protective Gear'],
  },
];

const vehicles = [
  { id: 'VH-001', type: 'Utility Truck', status: 'In Use', assignedTo: 'Crew Alpha', maintenance: 'Due in 15 days' },
  { id: 'VH-002', type: 'Ladder Truck', status: 'In Use', assignedTo: 'Crew Beta', maintenance: 'Up to date' },
  { id: 'VH-003', type: 'Excavator', status: 'In Use', assignedTo: 'Crew Charlie', maintenance: 'Up to date' },
  { id: 'VH-004', type: 'Garbage Truck', status: 'Available', assignedTo: 'Unassigned', maintenance: 'Scheduled tomorrow' },
  { id: 'VH-005', type: 'Van', status: 'Maintenance', assignedTo: 'Workshop', maintenance: 'In progress' },
];

const inventory = [
  { item: 'Asphalt Mix', quantity: 450, unit: 'kg', status: 'Good', reorderLevel: 200 },
  { item: 'LED Streetlights', quantity: 78, unit: 'units', status: 'Good', reorderLevel: 50 },
  { item: 'Water Pipes (3")', quantity: 120, unit: 'meters', status: 'Good', reorderLevel: 100 },
  { item: 'Concrete Mix', quantity: 340, unit: 'kg', status: 'Good', reorderLevel: 300 },
  { item: 'Safety Cones', quantity: 35, unit: 'units', status: 'Low', reorderLevel: 50 },
  { item: 'Reflective Tape', quantity: 12, unit: 'rolls', status: 'Critical', reorderLevel: 20 },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-800';
    case 'Available': return 'bg-blue-100 text-blue-800';
    case 'Off Duty': return 'bg-gray-100 text-gray-800';
    case 'In Use': return 'bg-blue-100 text-blue-800';
    case 'Maintenance': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getInventoryStatusColor = (status: string) => {
  switch (status) {
    case 'Good': return 'bg-green-100 text-green-800';
    case 'Low': return 'bg-yellow-100 text-yellow-800';
    case 'Critical': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function Resources() {
  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Resources</h1>
        <p className="text-gray-600">Manage crews, vehicles, and inventory</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <div className="text-2xl mb-1">4</div>
          <div className="text-sm text-gray-600">Total Crews</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
          <div className="text-2xl mb-1">3</div>
          <div className="text-sm text-gray-600">Active Crews</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🚚</span>
            </div>
          </div>
          <div className="text-2xl mb-1">5</div>
          <div className="text-sm text-gray-600">Total Vehicles</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
          </div>
          <div className="text-2xl mb-1">6</div>
          <div className="text-sm text-gray-600">Inventory Items</div>
        </div>
      </div>

      {/* Crew Management */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl">Crew Management</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add New Crew
          </button>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {crews.map((crew) => (
            <div key={crew.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg">{crew.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(crew.status)}`}>
                      {crew.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{crew.id} • Leader: {crew.leader}</p>
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                  <span className="text-xl">👥</span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span>👥</span>
                  <span className="text-gray-600">Members:</span>
                  <span>{crew.members}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>📍</span>
                  <span className="text-gray-600">Location:</span>
                  <span>{crew.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>📞</span>
                  <span className="text-gray-600">Contact:</span>
                  <span>{crew.phone}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="text-xs text-gray-600 mb-2">Equipment</div>
                <div className="flex flex-wrap gap-2">
                  {crew.equipment.map((item, index) => (
                    <span key={index} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="text-sm">
                  <span className="text-gray-600">Completed Today:</span>
                  <span className="ml-2 text-green-600">{crew.completedToday}</span>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vehicles & Inventory Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Vehicles */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl">Vehicles</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
          </div>
          <div className="space-y-3">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                    <span className="text-xl">🚚</span>
                  </div>
                  <div>
                    <div className="text-sm mb-1">{vehicle.id} • {vehicle.type}</div>
                    <div className="text-xs text-gray-500">{vehicle.assignedTo}</div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(vehicle.status)}`}>
                  {vehicle.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl">Inventory</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700">Manage Stock</button>
          </div>
          <div className="space-y-3">
            {inventory.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span>🔧</span>
                    <span className="text-sm">{item.item}</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${getInventoryStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Quantity: {item.quantity} {item.unit}</span>
                  <span>Reorder at: {item.reorderLevel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
