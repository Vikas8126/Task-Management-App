import React from 'react';
import { Folder, CheckSquare, Clock, AlertCircle, Square } from 'lucide-react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
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
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface SearchResultsProps {
  projects: Project[];
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  onProjectClick?: (projectId: string) => void;
  onTaskClick?: (taskId: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  projects,
  tasks,
  isLoading,
  error,
  onProjectClick,
  onTaskClick,
}) => {
  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckSquare className="status-icon completed" />;
      case 'in-progress':
        return <Clock className="status-icon in-progress" />;
      case 'blocked':
        return <AlertCircle className="status-icon blocked" />;
      default:
        return <Square className="status-icon new" />;
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'in-progress':
        return '#3b82f6';
      case 'blocked':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  if (isLoading) {
    return (
      <div className="search-results">
        <div className="search-results-loading">
          <LoadingSpinner size="small" text="Searching..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-results">
        <div className="search-results-error">
          <AlertCircle className="error-icon" />
          <p>Search failed: {error}</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0 && tasks.length === 0) {
    return (
      <div className="search-results">
        <div className="search-results-empty">
          <p>No results found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results">
      {projects.length > 0 && (
        <div className="search-results-section">
          <h3 className="search-results-section-title">
            <Folder className="section-icon" />
            Projects ({projects.length})
          </h3>
          <div className="search-results-list">
            {projects.map((project) => (
              <div
                key={project.id}
                className="search-result-item project-item"
                onClick={() => onProjectClick?.(project.id)}
              >
                <div
                  className="project-color-indicator"
                  style={{ backgroundColor: project.color }}
                />
                <div className="search-result-content">
                  <h4 className="search-result-title">{project.name}</h4>
                  <p className="search-result-description">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tasks.length > 0 && (
        <div className="search-results-section">
          <h3 className="search-results-section-title">
            <CheckSquare className="section-icon" />
            Tasks ({tasks.length})
          </h3>
          <div className="search-results-list">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="search-result-item task-item"
                onClick={() => onTaskClick?.(task.id)}
              >
                <div className="task-status-indicator">
                  {getStatusIcon(task.status)}
                </div>
                <div className="search-result-content">
                  <h4 className="search-result-title">{task.title}</h4>
                  <p className="search-result-description">{task.description}</p>
                  <div className="search-result-meta">
                    <span
                      className="task-status"
                      style={{ color: getStatusColor(task.status) }}
                    >
                      {task.status.replace('-', ' ')}
                    </span>
                    {task.dueDate && (
                      <span className="task-due-date">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
