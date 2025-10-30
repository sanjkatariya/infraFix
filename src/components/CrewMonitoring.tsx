import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import { Users, MapPin, CheckCircle, Clock } from 'lucide-react';

const crews = [
  {
    id: 'CREW-A',
    name: 'Crew Alpha',
    members: 4,
    status: 'Active',
    location: 'Main St & 5th Ave',
    currentTask: 'WO-1001 - Pothole Repair',
    completedToday: 5,
    totalAssigned: 8,
    efficiency: 87,
  },
  {
    id: 'CREW-B',
    name: 'Crew Beta',
    members: 3,
    status: 'Active',
    location: 'Park Road, Sector 12',
    currentTask: 'WO-1002 - Streetlight Repair',
    completedToday: 3,
    totalAssigned: 6,
    efficiency: 92,
  },
  {
    id: 'CREW-C',
    name: 'Crew Charlie',
    members: 5,
    status: 'Active',
    location: 'Central Plaza',
    currentTask: 'WO-1003 - Water Leak Fix',
    completedToday: 4,
    totalAssigned: 7,
    efficiency: 78,
  },
  {
    id: 'CREW-D',
    name: 'Crew Delta',
    members: 3,
    status: 'Available',
    location: 'Base Station',
    currentTask: 'Awaiting Assignment',
    completedToday: 6,
    totalAssigned: 6,
    efficiency: 95,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-800 border-green-200';
    case 'Available': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Off Duty': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getEfficiencyColor = (efficiency: number) => {
  if (efficiency >= 90) return 'text-green-600';
  if (efficiency >= 75) return 'text-blue-600';
  if (efficiency >= 60) return 'text-orange-600';
  return 'text-red-600';
};

export default function CrewMonitoring() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Crews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">4</div>
            <p className="text-xs text-muted-foreground">All teams</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Now</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">3</div>
            <p className="text-xs text-muted-foreground">Working on tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Completed Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">18</div>
            <p className="text-xs text-muted-foreground">Across all crews</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Avg Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">88%</div>
            <p className="text-xs text-muted-foreground">Overall performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Crew Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {crews.map((crew) => (
          <Card key={crew.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-600 text-white">
                      {crew.name.split(' ')[1][0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{crew.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {crew.members} members
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(crew.status)}>
                  {crew.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Location */}
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{crew.location}</span>
              </div>

              {/* Current Task */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Current Task</div>
                <div className="text-sm">{crew.currentTask}</div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Today's Progress</span>
                  <span>{crew.completedToday}/{crew.totalAssigned}</span>
                </div>
                <Progress value={(crew.completedToday / crew.totalAssigned) * 100} />
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="text-sm">{crew.completedToday}</div>
                    <div className="text-xs text-gray-500">Completed</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className={`text-sm ${getEfficiencyColor(crew.efficiency)}`}>
                      {crew.efficiency}%
                    </div>
                    <div className="text-xs text-gray-500">Efficiency</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
