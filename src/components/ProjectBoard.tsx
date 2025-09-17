import React from 'react';
import type { Project, Task } from '../types/Project';

interface ProjectBoardProps {
  projects: Project[];
  tasks: Task[];
  onProjectClick: (projectId: string) => void;
  onAddProject: () => void;
  onAddTask: () => void;
}

const ProjectBoard: React.FC<ProjectBoardProps> = ({
  projects,
  tasks,
  onProjectClick,
  onAddProject,
  onAddTask,
}) => {
  const getTaskCountForProject = (projectId: string) => {
    return tasks.filter(task => task.projectId === projectId).length;
  };

  const getCompletedTasksForProject = (projectId: string) => {
    return tasks.filter(task => task.projectId === projectId && task.status === 'completed').length;
  };

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-end mb-6">
            <div className="flex gap-4">
              <button
                onClick={onAddTask}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                Add Task
              </button>
              <button
                onClick={onAddProject}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                Add Project
              </button>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No projects yet</h3>
            <p className="text-gray-500 mb-6">Create your first project to get started!</p>
            <button
              onClick={onAddProject}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              Create First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => {
              const totalTasks = getTaskCountForProject(project.id);
              const completedTasks = getCompletedTasksForProject(project.id);
              const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

              return (
                <div
                  key={project.id}
                  onClick={() => onProjectClick(project.id)}
                  className="bg-white border border-gray-200 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:border-blue-500 hover:shadow-lg hover:-translate-y-1"
                >
                  {/* Project Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: project.color }}
                    ></div>
                    <span className="text-sm text-gray-500">
                      {totalTasks} tasks
                    </span>
                  </div>

                  {/* Project Info */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Progress</span>
                      <span className="text-sm font-medium text-gray-700">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Task Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {completedTasks}/{totalTasks} completed
                    </span>
                    <span className="text-gray-400">
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </span>
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
