import React from 'react';
import { useAddProjectModal } from './hooks/useAddProjectModal';
import './index.css';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (name: string, description: string, color: string) => void;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose, onAddProject }) => {
  const {
    name,
    description,
    selectedColor,
    colors,
    setName,
    setDescription,
    setSelectedColor,
    resetForm,
    validateForm,
  } = useAddProjectModal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onAddProject(name.trim(), description.trim(), selectedColor);
      resetForm();
      onClose();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="add-project-modal-overlay">
      <div className="add-project-modal">
        <h2 className="add-project-modal-title">Create New Project</h2>
        
        <form onSubmit={handleSubmit} className="add-project-modal-form">
          <div className="add-project-modal-field">
            <label className="add-project-modal-label">
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name..."
              className="add-project-modal-input"
              required
            />
          </div>

          <div className="add-project-modal-field">
            <label className="add-project-modal-label">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description..."
              className="add-project-modal-textarea"
              rows={3}
            />
          </div>

          <div className="add-project-modal-field">
            <label className="add-project-modal-label">
              Project Color
            </label>
            <div className="add-project-modal-color-grid">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`add-project-modal-color-btn ${
                    selectedColor === color ? 'selected' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="add-project-modal-actions">
            <button
              type="button"
              onClick={handleClose}
              className="add-project-modal-cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="add-project-modal-submit-btn"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;
