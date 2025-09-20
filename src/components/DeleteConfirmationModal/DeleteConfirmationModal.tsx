import React from 'react';
import { AlertTriangle } from 'lucide-react';
import './index.css';

interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'new' | 'in-progress' | 'blocked' | 'completed';
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  project: Project | null;
  tasks: Task[];
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  project,
  tasks,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !project) return null;

  const projectTasks = tasks.filter(task => task.projectId === project.id);
  const completedTasks = projectTasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = projectTasks.filter(task => task.status === 'in-progress').length;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <div className="delete-modal-header">
          <div className="delete-modal-icon">
            <AlertTriangle size={24} />
          </div>
          <h2 className="delete-modal-title">Delete Project</h2>
        </div>

        <div className="delete-modal-content">
          <p className="delete-modal-warning">
            Are you sure you want to delete <strong>"{project.name}"</strong>?
          </p>
          
          <p className="delete-modal-description">
            This action cannot be undone. All tasks associated with this project will also be deleted.
          </p>

          {projectTasks.length > 0 && (
            <div className="delete-modal-tasks-summary">
              <h3 className="delete-modal-tasks-title">Tasks that will be deleted:</h3>
              <div className="delete-modal-tasks-stats">
                <span className="delete-modal-task-stat">
                  <span className="delete-modal-task-count">{projectTasks.length}</span>
                  <span className="delete-modal-task-label">Total Tasks</span>
                </span>
                <span className="delete-modal-task-stat">
                  <span className="delete-modal-task-count">{completedTasks}</span>
                  <span className="delete-modal-task-label">Completed</span>
                </span>
                <span className="delete-modal-task-stat">
                  <span className="delete-modal-task-count">{inProgressTasks}</span>
                  <span className="delete-modal-task-label">In Progress</span>
                </span>
              </div>
            </div>
          )}

          {projectTasks.length === 0 && (
            <div className="delete-modal-empty-state">
              <p className="delete-modal-empty-text">This project has no tasks.</p>
            </div>
          )}
        </div>

        <div className="delete-modal-actions">
          <button 
            className="delete-modal-cancel-btn"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className="delete-modal-confirm-btn"
            onClick={onConfirm}
          >
            Delete Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;