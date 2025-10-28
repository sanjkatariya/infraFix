import { useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Clock, AlertCircle, MapPin, Calendar, FileText } from 'lucide-react'

export default function CitizenStatus() {
  const [searchParams] = useSearchParams()
  const complaintId = searchParams.get('complaint') || 'C-1001'
  
  // Mock complaint data
  const complaint = {
    id: complaintId,
    description: 'Pothole on Main Street',
    status: 'in-progress',
    priority: 'High',
    submittedDate: '2024-01-15',
    location: 'Main Street, Block 5',
    assignedCrew: 'Crew Alpha',
    estimatedCompletion: '2024-01-18',
    updates: [
      {
        date: '2024-01-16',
        message: 'Complaint prioritized and assigned to crew',
      },
      {
        date: '2024-01-17',
        message: 'Workorder created - Crew dispatched to location',
      },
    ],
  }
  
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'resolved':
        return {
          icon: <CheckCircle2 className="w-6 h-6 text-green-500" />,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          label: 'Resolved',
        }
      case 'in-progress':
        return {
          icon: <Clock className="w-6 h-6 text-blue-500" />,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          label: 'In Progress',
        }
      default:
        return {
          icon: <AlertCircle className="w-6 h-6 text-yellow-500" />,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          label: 'Pending',
        }
    }
  }
  
  const statusInfo = getStatusInfo(complaint.status)
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Complaint Status</h1>
        <p className="text-gray-600 mt-1">Track your complaint progress</p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{complaint.id}</CardTitle>
              <CardDescription>{complaint.description}</CardDescription>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${statusInfo.bgColor}`}>
              {statusInfo.icon}
              <span className={`font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Location</p>
                <p className="text-sm text-gray-600">{complaint.location}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Submitted</p>
                <p className="text-sm text-gray-600">{complaint.submittedDate}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Priority</p>
                <p className="text-sm text-gray-600">{complaint.priority}</p>
              </div>
            </div>
            
            {complaint.assignedCrew && (
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Assigned Crew</p>
                  <p className="text-sm text-gray-600">{complaint.assignedCrew}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Timeline */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Status Updates</h3>
            <div className="space-y-4">
              {complaint.updates.map((update, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                    {index < complaint.updates.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-medium text-gray-900">{update.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{update.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {complaint.status === 'in-progress' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Estimated Completion:</strong> {complaint.estimatedCompletion}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

