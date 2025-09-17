import React, { useState } from 'react';
import type { Project } from '../types/Project';

interface AddTaskModalProps {
  isOpen: boolean;
  projects: Project[];
  selectedProjectId?: string;
  onClose: () => void;
  onAddTask: (title: string, description: string, projectId: string) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  projects,
  selectedProjectId,
  onClose,
  onAddTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(selectedProjectId || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && projectId) {
      onAddTask(title.trim(), description.trim(), projectId);
      setTitle('');
      setDescription('');
      if (!selectedProjectId) {
        setProjectId('');
      }
      onClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    if (!selectedProjectId) {
      setProjectId('');
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-md mx-4 shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Task</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description..."
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
              rows={3}
            />
          </div>

          {!selectedProjectId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                required
              >
                <option value="">Choose a project...</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedProjectId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project
              </label>
              <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: projects.find(p => p.id === selectedProjectId)?.color }}
                />
                <span className="text-gray-900">
                  {projects.find(p => p.id === selectedProjectId)?.name}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-200"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
