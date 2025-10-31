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
  { name: 'Potholes', count: 487, percentage: 39, trend: '+12%', color: 'bg-blue-500' },
  { name: 'Streetlights', count: 312, percentage: 25, trend: '+8%', color: 'bg-orange-500' },
  { name: 'Water Leaks', count: 234, percentage: 19, trend: '-5%', color: 'bg-green-500' },
  { name: 'Garbage', count: 156, percentage: 12, trend: '+3%', color: 'bg-purple-500' },
  { name: 'Others', count: 58, percentage: 5, trend: '+1%', color: 'bg-gray-500' },
];

const performanceMetrics = [
  { label: 'Average Response Time', value: '2.4 hours', change: '-15%', improved: true },
  { label: 'Average Resolution Time', value: '3.2 days', change: '-8%', improved: true },
  { label: 'Citizen Satisfaction', value: '4.3/5.0', change: '+12%', improved: true },
  { label: 'Workorder Completion Rate', value: '87%', change: '+5%', improved: true },
];

export default function AdminAnalytics() {
  const maxComplaint = Math.max(...weeklyData.map(d => Math.max(d.complaints, d.resolved)));

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Analytics</h1>
        <p className="text-gray-600">Insights and performance metrics</p>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {performanceMetrics.map((metric) => (
          <div key={metric.label} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-2">{metric.label}</div>
            <div className="text-2xl mb-2">{metric.value}</div>
            <div className="flex items-center gap-1">
              {metric.improved ? (
                <span className="text-green-600">📈</span>
              ) : (
                <span className="text-red-600">📉</span>
              )}
              <span className={`text-sm ${metric.improved ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change}
              </span>
              <span className="text-sm text-gray-500">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Weekly Trends Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl mb-6">Weekly Trends</h2>
          <div className="space-y-4">
            {weeklyData.map((day) => (
              <div key={day.day}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">{day.day}</span>
                  <div className="flex gap-4">
                    <span className="text-red-600">Complaints: {day.complaints}</span>
                    <span className="text-green-600">Resolved: {day.resolved}</span>
                  </div>
                </div>
                <div className="flex gap-1 h-8">
                  <div
                    className="bg-red-200 rounded flex items-center justify-center text-xs"
                    style={{ width: `${(day.complaints / maxComplaint) * 100}%` }}
                  >
                    {day.complaints > 40 && day.complaints}
                  </div>
                  <div
                    className="bg-green-200 rounded flex items-center justify-center text-xs"
                    style={{ width: `${(day.resolved / maxComplaint) * 100}%` }}
                  >
                    {day.resolved > 40 && day.resolved}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-200 rounded"></div>
              <span>Complaints</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-200 rounded"></div>
              <span>Resolved</span>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl mb-6">Complaint Categories</h2>
          <div className="space-y-6">
            {categoryData.map((category) => (
              <div key={category.name}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 ${category.color} rounded-full`}></div>
                    <span>{category.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">{category.count}</span>
                    <span className={`text-sm ${category.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {category.trend}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`${category.color} h-2 rounded-full`}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl mb-6">Key Insights</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl mb-2">📈</div>
            <h3 className="mb-2">Peak Hours</h3>
            <p className="text-sm text-gray-600">Most complaints are received between 8 AM - 11 AM on weekdays</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="mb-2">Fast Response</h3>
            <p className="text-sm text-gray-600">Critical complaints are resolved 23% faster than last quarter</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="mb-2">High Accuracy</h3>
            <p className="text-sm text-gray-600">AI classification accuracy improved to 94% this month</p>
          </div>
        </div>
      </div>
    </div>
  );
}
