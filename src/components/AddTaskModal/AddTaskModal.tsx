import React from 'react';
import { useAddTaskModal } from './hooks/useAddTaskModal';
import './index.css';

interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AddTaskModalProps {
  isOpen: boolean;
  projects: Project[];
  selectedProjectId?: string;
  onClose: () => void;
  onAddTask: (title: string, description: string, projectId: string, dueDate?: Date) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  projects,
  selectedProjectId,
  onClose,
  onAddTask,
}) => {
  const {
    title,
    description,
    projectId,
    dueDate,
    setTitle,
    setDescription,
    setProjectId,
    setDueDate,
    resetForm,
    validateForm,
    getSelectedProject,
  } = useAddTaskModal(projects, selectedProjectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const dueDateObj = dueDate ? new Date(dueDate) : undefined;
      onAddTask(title.trim(), description.trim(), projectId, dueDateObj);
      resetForm();
      onClose();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const selectedProject = getSelectedProject();

  return (
    <div className="add-task-modal-overlay">
      <div className="add-task-modal">
        <h2 className="add-task-modal-title">Create New Task</h2>
        
        <form onSubmit={handleSubmit} className="add-task-modal-form">
          <div className="add-task-modal-field">
            <label className="add-task-modal-label">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="add-task-modal-input"
              required
            />
          </div>

          <div className="add-task-modal-field">
            <label className="add-task-modal-label">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description..."
              className="add-task-modal-textarea"
              rows={3}
            />
          </div>

          <div className="add-task-modal-field">
            <label className="add-task-modal-label">
              Due Date (Optional)
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="add-task-modal-input"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div className="add-task-modal-field">
            <label className="add-task-modal-label">
              Select Project
            </label>
            {selectedProjectId && selectedProject ? (
              // Show selected project (when coming from project view)
              <div className="add-task-modal-project-preview">
                <div
                  className="add-task-modal-project-color"
                  style={{ backgroundColor: selectedProject.color }}
                />
                <span className="add-task-modal-project-name">
                  {selectedProject.name}
                </span>
              </div>
            ) : (
              // Show project selection dropdown (when coming from main view)
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="add-task-modal-select"
                required
              >
                <option value="">Choose a project...</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {projects.length === 0 && (
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#fef3c7', 
              border: '1px solid #f59e0b', 
              borderRadius: '0.5rem',
              color: '#92400e',
              fontSize: '0.875rem'
            }}>
              ⚠️ No projects available. Please create a project first.
            </div>
          )}

          <div className="add-task-modal-actions">
            <button
              type="button"
              onClick={handleClose}
              className="add-task-modal-cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="add-task-modal-submit-btn"
              disabled={!validateForm() || projects.length === 0}
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
