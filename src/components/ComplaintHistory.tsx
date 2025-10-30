import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { MapPin, Calendar, Star, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

const complaints = [
  {
    id: 'CPL-5433',
    category: 'Pothole',
    description: 'Large pothole on Main Street causing traffic issues',
    location: 'Main St & 5th Ave',
    status: 'In Progress',
    progress: 60,
    submittedDate: '2025-10-27',
    workorderId: 'WO-1001',
    assignedCrew: 'Crew A',
    eta: '2 hours',
    updates: [
      { date: '2025-10-27 10:30', message: 'Workorder created and assigned to Crew A' },
      { date: '2025-10-27 09:45', message: 'Complaint prioritized as High' },
      { date: '2025-10-27 09:00', message: 'Complaint received and under review' },
    ],
  },
  {
    id: 'CPL-5410',
    category: 'Streetlight',
    description: 'Street light not working near park entrance',
    location: 'Park Road, Sector 12',
    status: 'Completed',
    progress: 100,
    submittedDate: '2025-10-25',
    workorderId: 'WO-0987',
    assignedCrew: 'Crew B',
    eta: 'Completed',
    updates: [
      { date: '2025-10-26 14:00', message: 'Work completed and verified' },
      { date: '2025-10-26 10:30', message: 'Crew arrived on site' },
      { date: '2025-10-25 16:00', message: 'Workorder created' },
    ],
  },
  {
    id: 'CPL-5389',
    category: 'Garbage',
    description: 'Overflowing garbage bins near market',
    location: 'Market Street',
    status: 'Pending',
    progress: 20,
    submittedDate: '2025-10-24',
    workorderId: null,
    assignedCrew: null,
    eta: 'Awaiting assignment',
    updates: [
      { date: '2025-10-24 11:00', message: 'Complaint received and classified' },
    ],
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
    case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function ComplaintHistory() {
  return (
    <div className="space-y-4">
      {complaints.map((complaint) => (
        <Card key={complaint.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle className="text-lg">{complaint.id}</CardTitle>
                  <Badge variant="outline" className={getStatusColor(complaint.status)}>
                    {complaint.status}
                  </Badge>
                </div>
                <CardDescription>{complaint.category}</CardDescription>
              </div>
              {complaint.status === 'Completed' && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Star className="mr-2 h-4 w-4" />
                      Feedback
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Share Your Feedback</DialogTitle>
                      <DialogDescription>
                        How satisfied are you with the resolution of complaint {complaint.id}?
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Rating</Label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              className="text-2xl hover:scale-110 transition-transform"
                            >
                              ⭐
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="feedback">Comments</Label>
                        <Textarea
                          id="feedback"
                          placeholder="Share your experience..."
                          rows={4}
                        />
                      </div>
                      <Button className="w-full">Submit Feedback</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Description */}
            <p className="text-sm text-gray-600">{complaint.description}</p>

            {/* Location and Date */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin className="h-4 w-4" />
                {complaint.location}
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Calendar className="h-4 w-4" />
                Submitted: {complaint.submittedDate}
              </div>
            </div>

            {/* Progress Bar */}
            {complaint.status !== 'Pending' && (
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="text-gray-600">{complaint.progress}%</span>
                </div>
                <Progress value={complaint.progress} />
              </div>
            )}

            {/* Workorder Info */}
            {complaint.workorderId && (
              <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Workorder:</span>
                  <span>{complaint.workorderId}</span>
                </div>
                {complaint.assignedCrew && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Assigned to:</span>
                    <span>{complaint.assignedCrew}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">ETA:</span>
                  <span>{complaint.eta}</span>
                </div>
              </div>
            )}

            {/* Timeline */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  View Updates Timeline
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Complaint Timeline</DialogTitle>
                  <DialogDescription>{complaint.id}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {complaint.updates.map((update, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                        {index < complaint.updates.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-300 my-1"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="text-xs text-gray-500 mb-1">{update.date}</div>
                        <div className="text-sm">{update.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ))}

      {/* Empty State */}
      {complaints.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg mb-2">No Complaints Yet</h3>
            <p className="text-gray-600 text-sm">
              Submit your first complaint to start tracking infrastructure issues
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
