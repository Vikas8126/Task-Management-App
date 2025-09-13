import React from 'react';
import { TaskStats } from '../types/Task';

interface StatsPanelProps {
  stats: TaskStats;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  const statItems = [
    {
      label: 'Total Tasks',
      value: stats.total,
      color: 'text-gray-300',
      bgColor: 'bg-gray-700 bg-opacity-50',
      icon: '📊'
    },
    {
      label: 'Pending',
      value: stats.pending,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      icon: '⏳'
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      icon: '🔄'
    },
    {
      label: 'Completed',
      value: stats.completed,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      icon: '✅'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold gradient-text mb-6">Dashboard</h2>
        <div className="space-y-4">
          {statItems.map((item, index) => (
            <div 
              key={item.label}
              className={`${item.bgColor} rounded-lg p-4 border border-gray-600 border-opacity-30 hover:border-gray-500 hover:border-opacity-50 transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-gray-300 font-medium">{item.label}</span>
                </div>
                <span className={`text-2xl font-bold ${item.color}`}>
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Ring */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Completion Rate</h3>
        <div className="relative w-32 h-32 mx-auto">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-700"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-blue-500"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeDasharray={`${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-400">
              {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
