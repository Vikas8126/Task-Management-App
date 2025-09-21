// Date utility functions for TaskFlow

export const isTaskPastDue = (task: { dueDate?: Date; status: string }): boolean => {
  if (!task.dueDate || task.status === 'completed') {
    return false;
  }
  
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today
  
  return new Date(task.dueDate) < today;
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const getRelativeDate = (date: Date): string => {
  const now = new Date();
  const diffInMs = date.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Tomorrow';
  } else if (diffInDays === -1) {
    return 'Yesterday';
  } else if (diffInDays > 0) {
    return `In ${diffInDays} days`;
  } else {
    return `${Math.abs(diffInDays)} days ago`;
  }
};
