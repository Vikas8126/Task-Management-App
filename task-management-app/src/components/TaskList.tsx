import React from 'react';
import { Task, TaskStatus } from '../types/Task';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  filter: TaskStatus | 'all';
  onFilterChange: (filter: TaskStatus | 'all') => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  filter,
  onFilterChange,
  onUpdateTask,
  onDeleteTask
}) => {
  const filters = [
    { key: 'all' as const, label: 'All Tasks', count: tasks.length },
    { key: 'pending' as const, label: 'Pending', count: tasks.filter(t => t.status === 'pending').length },
    { key: 'in-progress' as const, label: 'In Progress', count: tasks.filter(t => t.status === 'in-progress').length },
    { key: 'completed' as const, label: 'Completed', count: tasks.filter(t => t.status === 'completed').length },
  ];

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="card">
        <div className="flex flex-wrap gap-2">
          {filters.map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => onFilterChange(filterOption.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                filter === filterOption.key
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'glass text-gray-300 hover:text-gray-100 hover:bg-gray-700 hover:bg-opacity-50'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span>{filterOption.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  filter === filterOption.key
                    ? 'bg-blue-500/30 text-blue-100'
                    : 'bg-gray-600 text-gray-400'
                }`}>
                  {filterOption.count}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              {filter === 'all' ? 'No tasks yet' : `No ${filter.replace('-', ' ')} tasks`}
            </h3>
            <p className="text-gray-400">
              {filter === 'all' 
                ? 'Create your first task to get started!' 
                : `Try switching to a different filter or create a new task.`
              }
            </p>
          </div>
        ) : (
          tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
              index={index}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
