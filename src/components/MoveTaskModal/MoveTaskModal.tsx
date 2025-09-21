import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { formatDate, getRelativeDate } from '../../utils/dateUtils';
import './index.css';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'new' | 'in-progress' | 'blocked' | 'completed';
  projectId: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ViewTaskModalProps {
  isOpen: boolean;
  task: Task | null;
  onSave: (taskId: string, updates: { title?: string; description?: string; status?: Task['status']; dueDate?: Date }) => void;
  onDelete: (taskId: string) => void;
  onClose: () => void;
}

const ViewTaskModal: React.FC<ViewTaskModalProps> = ({
  isOpen,
  task,
  onSave,
  onDelete,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Task['status']>('new');
  const [dueDate, setDueDate] = useState('');

  // Update form when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '');
    }
  }, [task]);

  const statusOptions = [
    { value: 'new', label: 'New Task' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'blocked', label: 'Blocked' },
    { value: 'completed', label: 'Completed' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task) {
      const updates: { title?: string; description?: string; status?: Task['status']; dueDate?: Date } = {};
      
      if (title !== task.title) updates.title = title;
      if (description !== task.description) updates.description = description;
      if (status !== task.status) updates.status = status;
      
      const dueDateObj = dueDate ? new Date(dueDate) : undefined;
      const taskDueDate = task.dueDate ? new Date(task.dueDate) : undefined;
      
      if (dueDateObj?.getTime() !== taskDueDate?.getTime()) {
        updates.dueDate = dueDateObj;
      }
      
      // Only save if there are changes
      if (Object.keys(updates).length > 0) {
        onSave(task.id, updates);
      }
    }
    onClose();
  };

  const handleDelete = () => {
    if (task) {
      onDelete(task.id);
    }
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen || !task) return null;

  return (
    <div className="move-task-modal-overlay">
      <div className="move-task-modal">
        <div className="move-task-modal-header">
          <h3 className="move-task-modal-title">View Task</h3>
          <button 
            className="move-task-modal-close-btn"
            onClick={handleClose}
          >
            ×
          </button>
        </div>

        <div className="move-task-modal-body">
          <form onSubmit={handleSubmit} className="move-task-modal-form">
            <div className="move-task-modal-field">
              <label className="move-task-modal-label">
                Task Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="move-task-modal-input"
                required
              />
            </div>

            <div className="move-task-modal-field">
              <label className="move-task-modal-label">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="move-task-modal-textarea"
                rows={3}
              />
            </div>

            <div className="move-task-modal-field">
              <label className="move-task-modal-label">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Task['status'])}
                className="move-task-modal-select"
                required
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="move-task-modal-field">
              <label className="move-task-modal-label">
                Due Date (Optional)
              </label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="move-task-modal-input"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <div className="move-task-modal-dates">
              <div className="move-task-modal-date-item">
                <Calendar size={14} />
                <span>Created: {formatDate(task.createdAt)}</span>
              </div>
              {task.dueDate && (
                <div className="move-task-modal-date-item">
                  <Clock size={14} />
                  <span>Current Due: {formatDate(task.dueDate)}</span>
                  <span className="move-task-modal-relative-date">({getRelativeDate(task.dueDate)})</span>
                </div>
              )}
            </div>

            <div className="move-task-modal-actions">
              <button
                type="button"
                onClick={handleClose}
                className="move-task-modal-cancel-btn"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="move-task-modal-delete-btn"
              >
                Delete
              </button>
              <button
                type="submit"
                className="move-task-modal-save-btn"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewTaskModal;
