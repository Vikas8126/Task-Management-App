import React, { useState } from 'react';
import Navbar from './components/Navbar';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'pending' | 'in-progress' | 'review' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask,
        description: '',
        status: 'backlog',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setTasks([...tasks, task]);
      setNewTask('');
    }
  };

  const updateTaskStatus = (id: string, newStatus: 'pending' | 'in-progress' | 'completed') => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { 
            ...task, 
            status: newStatus,
            updatedAt: new Date()
          }
        : task
    ));
  };

  const cycleTaskStatus = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
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
        return { ...task, status: newStatus, updatedAt: new Date() };
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar totalTasks={tasks.length} completedTasks={completedTasks} />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
      <div>
                <h1 className="text-3xl font-bold text-white mb-2">Task Board</h1>
                <p className="text-gray-400">Manage your tasks across different stages</p>
              </div>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add a new task..."
                  className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 w-64"
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                />
                <button
                  onClick={addTask}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>

          {/* 5 Column Board */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Backlog Column */}
            <div className="bg-gray-800 rounded-lg p-4 min-h-96">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Backlog</h3>
                <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-sm">
                  {getTasksByStatus('backlog').length}
                </span>
              </div>
              <div className="space-y-3">
                {getTasksByStatus('backlog').map((task) => (
                  <div
                    key={task.id}
                    className="bg-gray-700 p-3 rounded-lg border border-gray-600 hover:border-blue-500 transition-colors cursor-pointer"
                    onClick={() => cycleTaskStatus(task.id)}
                  >
                    <h4 className="text-white font-medium mb-2 text-sm">{task.title}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {task.createdAt.toLocaleDateString()}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTask(task.id);
                        }}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
                {getTasksByStatus('backlog').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No backlog tasks</p>
                  </div>
                )}
              </div>
            </div>

            {/* To Do Column */}
            <div className="bg-gray-800 rounded-lg p-4 min-h-96">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">To Do</h3>
                <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-sm">
                  {getTasksByStatus('pending').length}
                </span>
              </div>
              <div className="space-y-3">
                {getTasksByStatus('pending').map((task) => (
                  <div
                    key={task.id}
                    className="bg-gray-700 p-3 rounded-lg border border-gray-600 hover:border-blue-500 transition-colors cursor-pointer"
                    onClick={() => cycleTaskStatus(task.id)}
                  >
                    <h4 className="text-white font-medium mb-2 text-sm">{task.title}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {task.createdAt.toLocaleDateString()}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTask(task.id);
                        }}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
                {getTasksByStatus('pending').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No pending tasks</p>
                  </div>
                )}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="bg-gray-800 rounded-lg p-4 min-h-96">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">In Progress</h3>
                <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-sm">
                  {getTasksByStatus('in-progress').length}
                </span>
              </div>
              <div className="space-y-3">
                {getTasksByStatus('in-progress').map((task) => (
                  <div
                    key={task.id}
                    className="bg-gray-700 p-3 rounded-lg border border-gray-600 hover:border-yellow-500 transition-colors cursor-pointer"
                    onClick={() => cycleTaskStatus(task.id)}
                  >
                    <h4 className="text-white font-medium mb-2 text-sm">{task.title}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {task.createdAt.toLocaleDateString()}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTask(task.id);
                        }}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
                {getTasksByStatus('in-progress').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No tasks in progress</p>
                  </div>
                )}
              </div>
            </div>

            {/* Review Column */}
            <div className="bg-gray-800 rounded-lg p-4 min-h-96">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Review</h3>
                <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-sm">
                  {getTasksByStatus('review').length}
                </span>
              </div>
              <div className="space-y-3">
                {getTasksByStatus('review').map((task) => (
                  <div
                    key={task.id}
                    className="bg-gray-700 p-3 rounded-lg border border-gray-600 hover:border-purple-500 transition-colors cursor-pointer"
                    onClick={() => cycleTaskStatus(task.id)}
                  >
                    <h4 className="text-white font-medium mb-2 text-sm">{task.title}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {task.createdAt.toLocaleDateString()}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTask(task.id);
                        }}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
                {getTasksByStatus('review').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No tasks in review</p>
                  </div>
                )}
              </div>
            </div>

            {/* Completed Column */}
            <div className="bg-gray-800 rounded-lg p-4 min-h-96">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Completed</h3>
                <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-sm">
                  {getTasksByStatus('completed').length}
                </span>
      </div>
              <div className="space-y-3">
                {getTasksByStatus('completed').map((task) => (
                  <div
                    key={task.id}
                    className="bg-gray-700 p-3 rounded-lg border border-gray-600 hover:border-green-500 transition-colors cursor-pointer opacity-75"
                    onClick={() => cycleTaskStatus(task.id)}
                  >
                    <h4 className="text-white font-medium mb-2 text-sm line-through">{task.title}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Completed {task.updatedAt.toLocaleDateString()}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTask(task.id);
                        }}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        ×
        </button>
                    </div>
                  </div>
                ))}
                {getTasksByStatus('completed').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No completed tasks</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;