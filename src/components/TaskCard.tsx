import React, { useState } from 'react';
import { Task, TaskStatus } from '../types/Task';

interface TaskCardProps {
  task: Task;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  index: number;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdateTask, onDeleteTask, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);

  const handleStatusChange = (newStatus: TaskStatus) => {
    onUpdateTask(task.id, { status: newStatus });
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onUpdateTask(task.id, { 
        title: editTitle.trim(), 
        description: editDescription.trim() 
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setIsEditing(false);
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'in-progress':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'completed':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      default:
        return 'text-dark-400 bg-dark-600/50 border-dark-600/50';
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'in-progress':
        return '🔄';
      case 'completed':
        return '✅';
      default:
        return '📝';
    }
  };

  return (
    <div 
      className={`task-card`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="input-field w-full text-lg font-semibold"
                autoFocus
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="input-field w-full resize-none"
                rows={2}
                placeholder="Add a description (optional)"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveEdit}
                  className="btn-primary text-sm px-4 py-2"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="btn-secondary text-sm px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-100 group-hover:text-white transition-colors">
                {task.title}
              </h3>
              {task.description && (
                <p className="text-gray-300 group-hover:text-gray-200 transition-colors">
                  {task.description}
                </p>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>Created: {task.createdAt.toLocaleDateString()}</span>
                {task.updatedAt.getTime() !== task.createdAt.getTime() && (
                  <span>Updated: {task.updatedAt.toLocaleDateString()}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="flex items-center space-x-2 ml-4">
            {/* Status Badge */}
            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(task.status)}`}>
              <span className="flex items-center space-x-1">
                <span>{getStatusIcon(task.status)}</span>
                <span className="capitalize">{task.status.replace('-', ' ')}</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500 hover:bg-opacity-10 rounded-lg transition-all duration-200"
                title="Edit task"
              >
                ✏️
              </button>
              <button
                onClick={() => onDeleteTask(task.id)}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500 hover:bg-opacity-10 rounded-lg transition-all duration-200"
                title="Delete task"
              >
                🗑️
              </button>
            </div>
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="mt-4 pt-4 border-t border-gray-700 border-opacity-50">
          <div className="flex flex-wrap gap-2">
            {(['pending', 'in-progress', 'completed'] as TaskStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  task.status === status
                    ? getStatusColor(status)
                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-700 hover:bg-opacity-50'
                }`}
              >
                {getStatusIcon(status)} {status.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
