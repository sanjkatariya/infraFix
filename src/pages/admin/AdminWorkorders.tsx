import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, XCircle, MapPin, Users } from 'lucide-react'

export default function AdminWorkorders() {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  
  const workorders = [
    {
      id: 'WO-001',
      complaintId: 'C-1001',
      description: 'Fix pothole on Main Street',
      priority: 'High',
      status: 'in-progress',
      assignedCrew: 'Crew Alpha',
      location: 'Main Street, Block 5',
      createdAt: '2024-01-15',
      estimatedCompletion: '2024-01-18',
    },
    {
      id: 'WO-002',
      complaintId: 'C-1002',
      description: 'Repair streetlight on Park Avenue',
      priority: 'Medium',
      status: 'pending',
      assignedCrew: 'Crew Beta',
      location: 'Park Avenue, Block 2',
      createdAt: '2024-01-16',
      estimatedCompletion: '2024-01-20',
    },
    {
      id: 'WO-003',
      complaintId: 'C-1003',
      description: 'Clear drainage blockage',
      priority: 'High',
      status: 'completed',
      assignedCrew: 'Crew Gamma',
      location: 'River Road, Block 10',
      createdAt: '2024-01-10',
      completedAt: '2024-01-14',
    },
  ]
  
  const filteredWorkorders = workorders.filter(wo => {
    if (filter === 'all') return true
    if (filter === 'active') return wo.status !== 'completed'
    return wo.status === 'completed'
  })
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-500" />
      default:
        return <XCircle className="w-5 h-5 text-yellow-500" />
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workorders</h1>
          <p className="text-gray-600 mt-1">Manage and track workorders</p>
        </div>
        <Button>Create Workorder</Button>
      </div>
      
      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'active' ? 'default' : 'outline'}
          onClick={() => setFilter('active')}
        >
          Active
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          onClick={() => setFilter('completed')}
        >
          Completed
        </Button>
      </div>
      
      {/* Workorders List */}
      <div className="grid gap-4">
        {filteredWorkorders.map((wo) => (
          <Card key={wo.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{wo.id}</CardTitle>
                  <CardDescription>{wo.description}</CardDescription>
                </div>
                {getStatusIcon(wo.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{wo.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{wo.assignedCrew}</span>
                </div>
                <div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    wo.priority === 'High' ? 'bg-red-100 text-red-800' :
                    wo.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {wo.priority} Priority
                  </span>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Complaint: {wo.complaintId} • Created: {wo.createdAt}
                </p>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

