import React from 'react';
import type { Task, Project } from '../types/Project';

interface TaskBoardProps {
  project: Project;
  tasks: Task[];
  onBackToProjects: () => void;
  onAddTask: () => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({
  project,
  tasks,
  onBackToProjects,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}) => {
  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const cycleTaskStatus = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    let newStatus: 'backlog' | 'pending' | 'in-progress' | 'review' | 'completed';
    switch (task.status) {
      case 'backlog':
        newStatus = 'pending';
        break;
      case 'pending':
        newStatus = 'in-progress';
        break;
      case 'in-progress':
        newStatus = 'review';
        break;
      case 'review':
        newStatus = 'completed';
        break;
      case 'completed':
        newStatus = 'backlog';
        break;
      default:
        newStatus = 'backlog';
    }

    onUpdateTask(taskId, { status: newStatus, updatedAt: new Date() });
  };

  const columns = [
    { id: 'backlog', title: 'Backlog', status: 'backlog', color: 'blue' },
    { id: 'pending', title: 'To Do', status: 'pending', color: 'blue' },
    { id: 'in-progress', title: 'In Progress', status: 'in-progress', color: 'yellow' },
    { id: 'review', title: 'Review', status: 'review', color: 'purple' },
    { id: 'completed', title: 'Completed', status: 'completed', color: 'green' },
  ];

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBackToProjects}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Back to Projects
              </button>
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: project.color }}
              ></div>
              <div>
                <h1 className="text-3xl font-bold text-white">{project.name}</h1>
                <p className="text-gray-400">{project.description}</p>
              </div>
            </div>
            <button
              onClick={onAddTask}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Add Task
            </button>
          </div>
        </div>

        {/* 5 Column Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(column.status);
            
            return (
              <div key={column.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 min-h-96">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{column.title}</h3>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
                    {columnTasks.length}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`bg-white border border-gray-200 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:border-blue-500 hover:shadow-md hover:-translate-y-0.5 ${
                        task.status === 'completed' ? 'opacity-75' : ''
                      }`}
                      onClick={() => cycleTaskStatus(task.id)}
                    >
                      <h4 className={`text-gray-900 font-medium mb-2 text-sm ${
                        task.status === 'completed' ? 'line-through' : ''
                      }`}>
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {task.status === 'completed' 
                            ? `Completed ${task.updatedAt.toLocaleDateString()}`
                            : task.createdAt.toLocaleDateString()
                          }
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteTask(task.id);
                          }}
                          className="text-red-500 hover:text-red-600 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {columnTasks.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm">No {column.title.toLowerCase()} tasks</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TaskBoard;
