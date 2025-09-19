interface Task {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'pending' | 'in-progress' | 'review' | 'completed';
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const useTaskBoard = (tasks: Task[]) => {
  const getTasksByStatus = (status: string): Task[] => {
    return tasks.filter(task => task.status === status);
  };

  const cycleTaskStatus = (
    taskId: string, 
    currentTasks: Task[], 
    onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  ) => {
    const task = currentTasks.find(t => t.id === taskId);
    if (!task) return;

    let newStatus: 'backlog' | 'pending' | 'in-progress' | 'review' | 'completed';
    switch (task.status) {
      case 'backlog':
        newStatus = 'pending';
        break;
      case 'pending':
        newStatus = 'in-progress';
        break;
      case 'in-progress':
        newStatus = 'review';
        break;
      case 'review':
        newStatus = 'completed';
        break;
      case 'completed':
        newStatus = 'backlog';
        break;
      default:
        newStatus = 'backlog';
    }

    onUpdateTask(taskId, { status: newStatus, updatedAt: new Date() });
  };

  const getColumnConfig = () => [
    { id: 'backlog', title: 'Backlog', status: 'backlog', color: 'blue' },
    { id: 'pending', title: 'To Do', status: 'pending', color: 'blue' },
    { id: 'in-progress', title: 'In Progress', status: 'in-progress', color: 'yellow' },
    { id: 'review', title: 'Review', status: 'review', color: 'purple' },
    { id: 'completed', title: 'Completed', status: 'completed', color: 'green' },
  ];

  return {
    getTasksByStatus,
    cycleTaskStatus,
    getColumnConfig,
  };
};
