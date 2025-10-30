import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Search, Plus, Eye, MapPin, Calendar, Users } from 'lucide-react';

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
  },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
    case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Low': return 'bg-blue-100 text-blue-800 border-blue-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
    case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Assigned': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Pending': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function WorkorderManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Workorder Management</CardTitle>
              <CardDescription>Manage and track all workorders</CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Workorder
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Workorder</DialogTitle>
                  <DialogDescription>Generate a workorder from prioritized complaints</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="complaint">Complaint ID</Label>
                    <Input id="complaint" placeholder="CPL-XXXX" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crew">Assign Crew</Label>
                    <Select>
                      <SelectTrigger id="crew">
                        <SelectValue placeholder="Select crew" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="crew-a">Crew A (Available)</SelectItem>
                        <SelectItem value="crew-b">Crew B (Available)</SelectItem>
                        <SelectItem value="crew-c">Crew C (Busy)</SelectItem>
                        <SelectItem value="crew-d">Crew D (Available)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select>
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" placeholder="Additional instructions..." />
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                    <Button onClick={() => setIsCreateDialogOpen(false)}>Create Workorder</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search workorders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Workorders Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workorder ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockWorkorders.map((workorder) => (
                <TableRow key={workorder.id}>
                  <TableCell>
                    <div>
                      <div>{workorder.id}</div>
                      <div className="text-xs text-gray-500">{workorder.complaint}</div>
                    </div>
                  </TableCell>
                  <TableCell>{workorder.type}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">{workorder.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getPriorityColor(workorder.priority)}>
                      {workorder.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(workorder.status)}>
                      {workorder.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">{workorder.assignedTo}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">{workorder.eta}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
