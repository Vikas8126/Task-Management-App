import React from 'react';
import './index.css';

interface NotificationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  icon?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  title,
  message,
  icon = '⚠️',
  primaryAction,
  secondaryAction,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="notification-modal-overlay" onClick={onClose}>
      <div className="notification-modal" onClick={(e) => e.stopPropagation()}>
        <div className="notification-modal-icon">{icon}</div>
        <h3 className="notification-modal-title">{title}</h3>
        <p className="notification-modal-message">{message}</p>
        
        <div className="notification-modal-actions">
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="notification-modal-btn notification-modal-btn-secondary"
            >
              {secondaryAction.label}
            </button>
          )}
          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              className="notification-modal-btn notification-modal-btn-primary"
            >
              {primaryAction.label}
            </button>
          )}
          {!primaryAction && !secondaryAction && (
            <button
              onClick={onClose}
              className="notification-modal-btn notification-modal-btn-secondary"
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
