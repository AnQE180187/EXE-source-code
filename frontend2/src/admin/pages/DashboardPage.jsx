import React from 'react';
import { Users, Calendar, FileText, Flag } from 'lucide-react';

const StatCard = ({ icon, label, value, color }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md flex items-center`}>
    <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
      {icon}
    </div>
    <div className="ml-4">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<Users size={24} />} label="Total Users" value="1,250" color="blue" />
        <StatCard icon={<Calendar size={24} />} label="Total Events" value="340" color="purple" />
        <StatCard icon={<FileText size={24} />} label="Total Posts" value="2,890" color="green" />
        <StatCard icon={<Flag size={24} />} label="Open Reports" value="12" color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h2>
          {/* Placeholder for activity feed */}
          <p className="text-gray-500">Activity feed will be here.</p>
        </div>

        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">System Overview</h2>
          {/* Placeholder for a chart */}
          <div className="h-64 bg-gray-200 rounded-md flex items-center justify-center">
            <p className="text-gray-500">Main chart will be here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
