import React from 'react';
import { FiUsers, FiBriefcase, FiCheckCircle, FiClock } from 'react-icons/fi';

const Dashboard = () => {
  // Mock data - will be replaced with real API calls
  const stats = [
    {
      name: 'Total Candidates',
      value: '124',
      icon: FiUsers,
      change: '+12%',
      color: 'bg-blue-500'
    },
    {
      name: 'Active Jobs',
      value: '8',
      icon: FiBriefcase,
      change: '+2',
      color: 'bg-green-500'
    },
    {
      name: 'Shortlisted',
      value: '32',
      icon: FiCheckCircle,
      change: '+8',
      color: 'bg-purple-500'
    },
    {
      name: 'Interviews Today',
      value: '5',
      icon: FiClock,
      change: '2 pending',
      color: 'bg-orange-500'
    }
  ];

  const recentCandidates = [
    { id: 1, name: 'John Doe', position: 'Software Engineer', score: 92, status: 'Shortlisted' },
    { id: 2, name: 'Jane Smith', position: 'Product Manager', score: 88, status: 'Interview' },
    { id: 3, name: 'Mike Johnson', position: 'UX Designer', score: 85, status: 'Screening' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Candidates */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Candidates</h3>
        </div>
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-600 dark:text-gray-400">
                <th className="pb-3">Name</th>
                <th className="pb-3">Position</th>
                <th className="pb-3">Match Score</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentCandidates.map((candidate) => (
                <tr key={candidate.id} className="border-t dark:border-gray-700">
                  <td className="py-3 font-medium text-gray-900 dark:text-gray-100">{candidate.name}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">{candidate.position}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded ${
                      candidate.score >= 90 ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                      candidate.score >= 80 ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                      'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                    }`}>
                      {candidate.score}%
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm">
                      {candidate.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-primary-600 text-white p-6 rounded-lg hover:bg-primary-700 transition-colors">
          <FiUsers size={32} className="mb-2" />
          <h4 className="font-semibold">Add Candidate</h4>
          <p className="text-sm opacity-90 mt-1">Upload resume and create profile</p>
        </button>
        <button className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition-colors">
          <FiBriefcase size={32} className="mb-2" />
          <h4 className="font-semibold">Post Job</h4>
          <p className="text-sm opacity-90 mt-1">Create new job posting</p>
        </button>
        <button className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition-colors">
          <FiClock size={32} className="mb-2" />
          <h4 className="font-semibold">Schedule Interview</h4>
          <p className="text-sm opacity-90 mt-1">Set up candidate interviews</p>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
