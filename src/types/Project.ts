export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'pending' | 'in-progress' | 'review' | 'completed';
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}
