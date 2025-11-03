import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const statsData = [
  { title: 'Total Complaints', value: '1,247', change: '+12%', icon: AlertCircle, color: 'text-blue-600' },
  { title: 'Active Workorders', value: '89', change: '+5%', icon: Clock, color: 'text-orange-600' },
  { title: 'Completed Today', value: '34', change: '+18%', icon: CheckCircle, color: 'text-green-600' },
  { title: 'Avg Resolution Time', value: '3.2 days', change: '-8%', icon: TrendingUp, color: 'text-purple-600' },
];

const weeklyData = [
  { day: 'Mon', complaints: 45, resolved: 32 },
  { day: 'Tue', complaints: 52, resolved: 38 },
  { day: 'Wed', complaints: 38, resolved: 45 },
  { day: 'Thu', complaints: 61, resolved: 42 },
  { day: 'Fri', complaints: 48, resolved: 51 },
  { day: 'Sat', complaints: 35, resolved: 28 },
  { day: 'Sun', complaints: 28, resolved: 25 },
];

const categoryData = [
  { name: 'Potholes', value: 487, color: '#3b82f6' },
  { name: 'Streetlights', value: 312, color: '#f59e0b' },
  { name: 'Water Leaks', value: 234, color: '#10b981' },
  { name: 'Garbage', value: 156, color: '#8b5cf6' },
  { name: 'Others', value: 58, color: '#6b7280' },
];

export default function AnalyticsOverview() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                    {stat.change}
                  </span> from last week
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Weekly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Trends</CardTitle>
            <CardDescription>Complaints vs Resolved</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="complaints" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Complaint Categories</CardTitle>
            <CardDescription>Distribution by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) => `${props.name} ${((props.percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Priority Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Priority Distribution</CardTitle>
          <CardDescription>Current active complaints by priority</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[
              { priority: 'Critical', count: 23 },
              { priority: 'High', count: 45 },
              { priority: 'Medium', count: 67 },
              { priority: 'Low', count: 112 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="priority" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
