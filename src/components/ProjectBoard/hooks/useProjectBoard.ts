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

export const useProjectBoard = (_projects: Project[], tasks: Task[]) => {
  const getTaskCountForProject = (projectId: string): number => {
    return tasks.filter(task => task.projectId === projectId).length;
  };

  const getCompletedTasksForProject = (projectId: string): number => {
    return tasks.filter(task => task.projectId === projectId && task.status === 'completed').length;
  };

  const getProjectProgress = (projectId: string): number => {
    const totalTasks = getTaskCountForProject(projectId);
    const completedTasks = getCompletedTasksForProject(projectId);
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const getProjectStats = (projectId: string) => {
    const totalTasks = getTaskCountForProject(projectId);
    const completedTasks = getCompletedTasksForProject(projectId);
    const progress = getProjectProgress(projectId);

    return {
      totalTasks,
      completedTasks,
      progress,
    };
  };

  return {
    getTaskCountForProject,
    getCompletedTasksForProject,
    getProjectProgress,
    getProjectStats,
  };
};
