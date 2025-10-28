import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

const complaintData = [
  { month: 'Jan', complaints: 120, resolved: 108 },
  { month: 'Feb', complaints: 145, resolved: 132 },
  { month: 'Mar', complaints: 98, resolved: 89 },
  { month: 'Apr', complaints: 167, resolved: 150 },
  { month: 'May', complaints: 134, resolved: 121 },
  { month: 'Jun', complaints: 156, resolved: 142 },
]

const priorityData = [
  { name: 'High', value: 45 },
  { name: 'Medium', value: 78 },
  { name: 'Low', value: 34 },
]

const COLORS = ['#ef4444', '#f59e0b', '#10b981']

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Complaint trends and insights</p>
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Complaints Over Time</CardTitle>
            <CardDescription>Monthly complaint volume and resolution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={complaintData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="complaints" fill="#3b82f6" name="Complaints" />
                <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Resolution Trend</CardTitle>
            <CardDescription>Complaint resolution rate over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={complaintData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="complaints" stroke="#3b82f6" name="Complaints" />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" name="Resolved" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
            <CardDescription>Complaints by priority level</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
            <CardDescription>Performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <span className="font-medium">Average Resolution Time</span>
                <span className="text-2xl font-bold text-blue-600">3.2 days</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="font-medium">Resolution Rate</span>
                <span className="text-2xl font-bold text-green-600">90.1%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                <span className="font-medium">Citizen Satisfaction</span>
                <span className="text-2xl font-bold text-purple-600">4.6/5</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

