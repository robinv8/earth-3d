'use client';

import { useEffect, useState } from 'react';
import { 
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
  BarChart, Bar
} from 'recharts';

// Sample data for network activity
const networkData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  traffic: Math.floor(Math.random() * 1000) + 500,
  latency: Math.floor(Math.random() * 50) + 20
}));

// Sample data for region distribution
const regionData = [
  { name: 'North America', value: 35 },
  { name: 'Europe', value: 30 },
  { name: 'Asia', value: 25 },
  { name: 'Others', value: 10 }
];

// Colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Sample data for hourly traffic by region
const trafficByRegion = Array.from({ length: 12 }, (_, i) => ({
  hour: `${i * 2}:00`,
  'North America': Math.floor(Math.random() * 500) + 200,
  'Europe': Math.floor(Math.random() * 400) + 150,
  'Asia': Math.floor(Math.random() * 300) + 100,
}));

export default function Dashboard() {
  const [data, setData] = useState(networkData);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1)];
        const lastHour = parseInt(prev[prev.length - 1].hour);
        newData.push({
          hour: `${(lastHour + 1) % 24}:00`,
          traffic: Math.floor(Math.random() * 1000) + 500,
          latency: Math.floor(Math.random() * 50) + 20
        });
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Header */}
        <div className="col-span-full bg-gray-800 rounded-lg p-6">
          <h1 className="text-3xl font-bold">Global Data Dashboard</h1>
          <p className="text-gray-400">Real-time visualization of global metrics</p>
        </div>

        {/* Statistics Cards */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Global Traffic</h2>
          <div className="text-4xl font-bold text-blue-400">1.2M</div>
          <p className="text-gray-400">Active connections</p>
          <div className="h-32 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.slice(-10)}>
                <Area type="monotone" dataKey="traffic" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Active Regions</h2>
          <div className="text-4xl font-bold text-green-400">24</div>
          <p className="text-gray-400">Across all continents</p>
          <div className="h-32 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={40}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Response Time</h2>
          <div className="text-4xl font-bold text-purple-400">
            {data[data.length - 1].latency}ms
          </div>
          <p className="text-gray-400">Average global latency</p>
          <div className="h-32 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.slice(-10)}>
                <Line type="monotone" dataKey="latency" stroke="#a855f7" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Network Activity Chart */}
        <div className="col-span-full lg:col-span-2 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Network Activity</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hour" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#F3F4F6'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="traffic" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Traffic Distribution */}
        <div className="col-span-full lg:col-span-1 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Regional Traffic</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficByRegion} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hour" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#F3F4F6'
                  }}
                />
                <Bar dataKey="North America" stackId="a" fill="#0088FE" />
                <Bar dataKey="Europe" stackId="a" fill="#00C49F" />
                <Bar dataKey="Asia" stackId="a" fill="#FFBB28" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
