import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AlertCircle, Wrench, Users } from 'lucide-react';

const mapLocations = [
  { id: 1, type: 'complaint', priority: 'High', location: 'Main St & 5th Ave', top: '35%', left: '25%' },
  { id: 2, type: 'complaint', priority: 'Critical', location: 'Central Plaza', top: '50%', left: '60%' },
  { id: 3, type: 'complaint', priority: 'Medium', location: 'Park Road', top: '28%', left: '70%' },
  { id: 4, type: 'workorder', crew: 'Crew A', location: 'Main St & 5th Ave', top: '37%', left: '27%' },
  { id: 5, type: 'workorder', crew: 'Crew B', location: 'Park Road', top: '30%', left: '72%' },
  { id: 6, type: 'workorder', crew: 'Crew C', location: 'Central Plaza', top: '52%', left: '62%' },
];

export default function MapView() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Interactive Map</CardTitle>
          <CardDescription>Real-time view of complaints and crew locations</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mock Map */}
          <div className="relative w-full h-[600px] bg-gradient-to-br from-blue-100 via-green-50 to-blue-50 rounded-lg border-2 border-gray-200 overflow-hidden">
            {/* Map Background with Grid */}
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}></div>

            {/* Mock Streets */}
            <div className="absolute top-[35%] left-0 right-0 h-2 bg-gray-300"></div>
            <div className="absolute top-[50%] left-0 right-0 h-2 bg-gray-300"></div>
            <div className="absolute top-0 bottom-0 left-[25%] w-2 bg-gray-300"></div>
            <div className="absolute top-0 bottom-0 left-[60%] w-2 bg-gray-300"></div>

            {/* Locations */}
            {mapLocations.map((location) => (
              <div
                key={location.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ top: location.top, left: location.left }}
              >
                {location.type === 'complaint' ? (
                  <>
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white
                      ${location.priority === 'Critical' ? 'bg-red-500' : ''}
                      ${location.priority === 'High' ? 'bg-orange-500' : ''}
                      ${location.priority === 'Medium' ? 'bg-yellow-500' : ''}
                      ${location.priority === 'Low' ? 'bg-blue-500' : ''}
                    `}>
                      <AlertCircle className="h-4 w-4 text-white" />
                    </div>
                    <div className="absolute left-10 top-0 bg-white rounded-lg shadow-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      <div className="text-xs">
                        <div>Complaint</div>
                        <div className="text-gray-500">{location.location}</div>
                        <Badge variant="outline" className="text-xs mt-1">
                          {location.priority}
                        </Badge>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg border-2 border-white animate-pulse">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div className="absolute left-12 top-0 bg-white rounded-lg shadow-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      <div className="text-xs">
                        <div>{location.crew}</div>
                        <div className="text-gray-500">{location.location}</div>
                        <Badge variant="outline" className="text-xs mt-1 bg-green-50">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 space-y-2">
              <div className="text-sm">Legend</div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span>Critical</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                <span>High Priority</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span>Active Crew</span>
              </div>
            </div>

            {/* Stats Overlay */}
            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <div>
                  <div className="text-xs text-gray-500">Active Complaints</div>
                  <div>89</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="text-xs text-gray-500">Active Workorders</div>
                  <div>34</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                <div>
                  <div className="text-xs text-gray-500">Crews Deployed</div>
                  <div>3</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Map Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-2 text-gray-600">
            <li>• <strong>Real-time tracking:</strong> Monitor crew locations and active complaints</li>
            <li>• <strong>Heat maps:</strong> Identify high-complaint areas (requires GIS integration)</li>
            <li>• <strong>Route optimization:</strong> Plan efficient crew deployment</li>
            <li>• <strong>Interactive pins:</strong> Hover over markers for details</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
