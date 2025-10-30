import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { LogOut, LayoutDashboard, ClipboardList, Users as UsersIcon, Map } from 'lucide-react';
import AnalyticsOverview from './AnalyticsOverview';
import WorkorderManagement from './WorkorderManagement';
import CrewMonitoring from './CrewMonitoring';
import MapView from './MapView';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">🛠️</span>
            </div>
            <div>
              <h1 className="text-xl">InfraFix Admin</h1>
              <p className="text-sm text-gray-500">Infrastructure Management Portal</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="dashboard">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="workorders">
              <ClipboardList className="h-4 w-4 mr-2" />
              Workorders
            </TabsTrigger>
            <TabsTrigger value="crew">
              <UsersIcon className="h-4 w-4 mr-2" />
              Crew
            </TabsTrigger>
            <TabsTrigger value="map">
              <Map className="h-4 w-4 mr-2" />
              Map
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AnalyticsOverview />
          </TabsContent>

          <TabsContent value="workorders">
            <WorkorderManagement />
          </TabsContent>

          <TabsContent value="crew">
            <CrewMonitoring />
          </TabsContent>

          <TabsContent value="map">
            <MapView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
