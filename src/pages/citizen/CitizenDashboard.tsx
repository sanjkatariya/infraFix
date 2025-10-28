import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { PlusCircle, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

export default function CitizenDashboard() {
  const userComplaints = [
    {
      id: 'C-1001',
      description: 'Pothole on Main Street',
      status: 'in-progress',
      submittedDate: '2024-01-15',
      priority: 'High',
    },
    {
      id: 'C-1002',
      description: 'Broken streetlight',
      status: 'resolved',
      submittedDate: '2024-01-10',
      resolvedDate: '2024-01-14',
    },
    {
      id: 'C-1003',
      description: 'Drainage issue',
      status: 'pending',
      submittedDate: '2024-01-20',
    },
  ]
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
    }
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your complaints and infrastructure issues</p>
        </div>
        <Link to="/citizen/complaint">
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            File New Complaint
          </Button>
        </Link>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userComplaints.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {userComplaints.filter(c => c.status === 'resolved').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {userComplaints.filter(c => c.status === 'in-progress').length}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* My Complaints */}
      <Card>
        <CardHeader>
          <CardTitle>My Complaints</CardTitle>
          <CardDescription>Track the status of your submitted complaints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userComplaints.map((complaint) => (
              <div key={complaint.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  {getStatusIcon(complaint.status)}
                  <div>
                    <p className="font-medium">{complaint.id}</p>
                    <p className="text-sm text-gray-500">{complaint.description}</p>
                    <p className="text-xs text-gray-400 mt-1">Submitted: {complaint.submittedDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(complaint.status)}`}>
                    {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1).replace('-', ' ')}
                  </span>
                  <Link to={`/citizen/status?complaint=${complaint.id}`}>
                    <Button variant="outline" size="sm">View Details</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

