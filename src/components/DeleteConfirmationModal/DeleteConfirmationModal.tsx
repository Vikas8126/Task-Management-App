import React from 'react';
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
  status: 'backlog' | 'pending' | 'in-progress' | 'review' | 'completed';
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  project: Project;
  associatedTasks: Task[];
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  project,
  associatedTasks,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const taskCount = associatedTasks.length;

  return (
    <div className="delete-confirmation-modal-overlay" onClick={onCancel}>
      <div className="delete-confirmation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="delete-confirmation-modal-header">
          <span className="delete-confirmation-modal-icon">⚠️</span>
          <h3 className="delete-confirmation-modal-title">Delete Project</h3>
        </div>

        <p className="delete-confirmation-modal-message">
          Are you sure you want to delete this project? This action cannot be undone.
        </p>

        {/* Project Info */}
        <div className="delete-confirmation-modal-project-info">
          <div className="delete-confirmation-modal-project-header">
            <div
              className="delete-confirmation-modal-project-color"
              style={{ backgroundColor: project.color }}
            />
            <span className="delete-confirmation-modal-project-name">
              {project.name}
            </span>
          </div>
          <p className="delete-confirmation-modal-project-description">
            {project.description}
          </p>
        </div>

        {/* Associated Tasks Warning */}
        {taskCount > 0 && (
          <div className="delete-confirmation-modal-tasks-section">
            <div className="delete-confirmation-modal-warning">
              <p className="delete-confirmation-modal-warning-text">
                🗑️ This will also delete {taskCount} associated task{taskCount !== 1 ? 's' : ''}:
              </p>
            </div>

            <div className="delete-confirmation-modal-tasks-list">
              {associatedTasks.map((task) => (
                <div key={task.id} className="delete-confirmation-modal-task-item">
                  <div className="delete-confirmation-modal-task-info">
                    <div className="delete-confirmation-modal-task-title">
                      {task.title}
                    </div>
                    <div className="delete-confirmation-modal-task-status">
                      Status: {task.status.replace('-', ' ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {taskCount === 0 && (
          <div className="delete-confirmation-modal-warning">
            <p className="delete-confirmation-modal-warning-text">
              ℹ️ This project has no associated tasks.
            </p>
          </div>
        )}

        <div className="delete-confirmation-modal-actions">
          <button
            onClick={onCancel}
            className="delete-confirmation-modal-cancel-btn"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="delete-confirmation-modal-delete-btn"
          >
            Delete Project {taskCount > 0 && `& ${taskCount} Task${taskCount !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
