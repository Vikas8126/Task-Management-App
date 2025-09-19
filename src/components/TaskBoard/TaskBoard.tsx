import React from 'react';
import { useTaskBoard } from './hooks/useTaskBoard';
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

interface TaskBoardProps {
  project: Project;
  tasks: Task[];
  onBackToProjects: () => void;
  onAddTask: () => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({
  project,
  tasks,
  onBackToProjects,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}) => {
  const { getTasksByStatus, cycleTaskStatus, getColumnConfig } = useTaskBoard(tasks);

  const handleTaskClick = (taskId: string) => {
    cycleTaskStatus(taskId, tasks, onUpdateTask);
  };

  const columns = getColumnConfig();

  return (
    <div className="task-board-container">
      <div className="container">
        {/* Header */}
        <div className="task-board-header">
          <div className="task-board-header-content">
            <div className="task-board-header-left">
              <button onClick={onBackToProjects} className="task-board-back-btn">
                ← Back to Projects
              </button>
              <div
                className="task-board-project-color"
                style={{ backgroundColor: project.color }}
              ></div>
              <div className="task-board-project-info">
                <h1>{project.name}</h1>
                <p>{project.description}</p>
              </div>
            </div>
            <button onClick={onAddTask} className="task-board-add-btn">
              Add Task
            </button>
          </div>
        </div>

        {/* 5 Column Board */}
        <div className="task-board-columns">
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(column.status);
            
            return (
              <div key={column.id} className="task-board-column">
                <div className="task-board-column-header">
                  <h3 className="task-board-column-title">{column.title}</h3>
                  <span className="task-board-column-count">
                    {columnTasks.length}
                  </span>
                </div>
                
                <div className="task-board-tasks">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`task-board-task-card ${
                        task.status === 'completed' ? 'completed' : ''
                      }`}
                      onClick={() => handleTaskClick(task.id)}
                    >
                      <h4 className={`task-board-task-title ${
                        task.status === 'completed' ? 'completed' : ''
                      }`}>
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="task-board-task-description">
                          {task.description}
                        </p>
                      )}
                      <div className="task-board-task-footer">
                        <span className="task-board-task-date">
                          {task.status === 'completed' 
                            ? `Completed ${task.updatedAt.toLocaleDateString()}`
                            : task.createdAt.toLocaleDateString()
                          }
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteTask(task.id);
                          }}
                          className="task-board-task-delete"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {columnTasks.length === 0 && (
                    <div className="task-board-empty-column">
                      <p>No {column.title.toLowerCase()} tasks</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TaskBoard;
