import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useProjectBoard } from './hooks/useProjectBoard';
import { formatDate } from '../../utils/dateUtils';
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

interface ProjectBoardProps {
  projects: Project[];
  tasks: Task[];
  onAddProject: () => void;
  onAddTask: () => void;
}

const ProjectBoard: React.FC<ProjectBoardProps> = ({
  projects,
  tasks,
  onAddProject,
  onAddTask,
}) => {
  const navigate = useNavigate();
  const { getProjectStats } = useProjectBoard(projects, tasks);

  return (
    <div className="project-board-container">
      <div className="container">
        {/* Header */}
        <div className="project-board-header">
          <div className="project-board-actions">
            <button onClick={onAddTask} className="project-board-btn project-board-btn-primary">
              <span className="project-board-btn-icon">+</span>
              Add Task
            </button>
            <button onClick={onAddProject} className="project-board-btn project-board-btn-secondary">
              <span className="project-board-btn-icon">+</span>
              Add Project
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="project-board-empty-state">
            <div className="project-board-empty-icon">📁</div>
            <h3 className="project-board-empty-title">No projects yet</h3>
            <p className="project-board-empty-description">Create your first project to get started!</p>
            <button onClick={onAddProject} className="project-board-btn project-board-btn-secondary">
              <span className="project-board-btn-icon">+</span>
              Create First Project
            </button>
          </div>
        ) : (
          <div className="project-board-grid">
            {projects.map((project) => {
              const { totalTasks, completedTasks, progress } = getProjectStats(project.id);

              return (
                <div
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="project-board-card"
                >
                  {/* Left Side - Project Info */}
                  <div className="project-board-card-left">
                    <div className="project-board-card-header">
                      <div
                        className="project-board-card-color"
                        style={{ backgroundColor: project.color }}
                      ></div>
                      <div className="project-board-card-info">
                        <h3 className="project-board-card-title">
                          {project.name}
                        </h3>
                        <p className="project-board-card-description">
                          {project.description}
                        </p>
                        <div className="project-board-card-date">
                          <Calendar size={14} />
                          <span>Created: {formatDate(project.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Stats and Progress */}
                  <div className="project-board-card-right">
                    <div className="project-board-card-stats">
                      <span className="project-board-card-task-count">
                        {totalTasks} tasks
                      </span>
                      <span className="project-board-card-completion">
                        {completedTasks}/{totalTasks} completed
                      </span>
                    </div>
                    
                    <div className="project-board-progress-container">
                      <div className="project-board-progress-header">
                        <span className="project-board-progress-label">Progress</span>
                        <span className="project-board-progress-percentage">{progress}%</span>
                      </div>
                      <div className="project-board-progress-bar">
                        <div
                          className="project-board-progress-fill"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectBoard;
