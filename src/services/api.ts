const API_BASE_URL = 'https://task-management-app-4njn.onrender.com/api';

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

// API Response interface
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Project API calls
export const projectAPI = {
  // Get all projects
  async getAll(): Promise<Project[]> {
    try {
      console.log('Fetching projects from:', `${API_BASE_URL}/projects`);
      const response = await fetch(`${API_BASE_URL}/projects`);
      console.log('Projects response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<Project[]> = await response.json();
      console.log('Projects API response:', result);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch projects');
      }
      
      const projects = result.data?.map(project => {
        console.log('Processing project:', project);
        return {
          ...project,
          createdAt: new Date(project.createdAt),
          updatedAt: new Date(project.updatedAt),
        };
      }) || [];
      
      console.log('Processed projects:', projects);
      return projects;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  // Get project by ID
  async getById(id: string): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`);
    const result: ApiResponse<Project> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch project');
    }
    
    if (!result.data) {
      throw new Error('Project not found');
    }

    return {
      ...result.data,
      createdAt: new Date(result.data.createdAt),
      updatedAt: new Date(result.data.updatedAt),
    };
  },

  // Create new project
  async create(name: string, description: string, color: string): Promise<Project> {
    try {
      console.log('Creating project:', { name, description, color });
      console.log('API URL:', `${API_BASE_URL}/projects`);
      
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, color }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result: ApiResponse<Project> = await response.json();
      console.log('API Response:', result);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to create project');
      }

      if (!result.data) {
        throw new Error('No project data returned');
      }

      return {
        ...result.data,
        createdAt: new Date(result.data.createdAt),
        updatedAt: new Date(result.data.updatedAt),
      };
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  // Update project
  async update(id: string, updates: Partial<{ name: string; description: string; color: string }>): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    const result: ApiResponse<Project> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to update project');
    }

    if (!result.data) {
      throw new Error('No project data returned');
    }

    return {
      ...result.data,
      createdAt: new Date(result.data.createdAt),
      updatedAt: new Date(result.data.updatedAt),
    };
  },

  // Get associated tasks for deletion confirmation
  async getAssociatedTasks(id: string): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}/tasks`);
    const result: ApiResponse<Task[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch associated tasks');
    }
    
    return result.data?.map(task => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    })) || [];
  },

  // Delete project
  async delete(id: string): Promise<{ deletedProject: boolean; deletedTasks: number }> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
    });

    const result: ApiResponse<{ deletedProject: boolean; deletedTasks: number }> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to delete project');
    }

    return result.data || { deletedProject: false, deletedTasks: 0 };
  },

  // Get project statistics
  async getStats(id: string): Promise<{
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    pendingTasks: number;
    progress: number;
  }> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}/stats`);
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch project stats');
    }
    
    return result.data;
  },

  // Search projects
  async search(query: string): Promise<Project[]> {
    const response = await fetch(`${API_BASE_URL}/projects/search/${encodeURIComponent(query)}`);
    const result: ApiResponse<Project[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to search projects');
    }
    
    return result.data?.map(project => ({
      ...project,
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt),
    })) || [];
  },
};

// Task API calls
export const taskAPI = {
  // Get all tasks
  async getAll(): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    const result: ApiResponse<Task[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch tasks');
    }
    
    return result.data?.map(task => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    })) || [];
  },

  // Get tasks by project ID
  async getByProjectId(projectId: string): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/tasks/project/${projectId}`);
    const result: ApiResponse<Task[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch tasks for project');
    }
    
    return result.data?.map(task => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    })) || [];
  },

  // Create new task
  async create(title: string, description: string, projectId: string, dueDate?: Date): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, projectId, dueDate }),
    });

    const result: ApiResponse<Task> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to create task');
    }

    if (!result.data) {
      throw new Error('No task data returned');
    }

    return {
      ...result.data,
      createdAt: new Date(result.data.createdAt),
      updatedAt: new Date(result.data.updatedAt),
      dueDate: result.data.dueDate ? new Date(result.data.dueDate) : undefined,
    };
  },

  // Update task
  async update(id: string, updates: Partial<Task>): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    const result: ApiResponse<Task> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to update task');
    }

    if (!result.data) {
      throw new Error('No task data returned');
    }

    return {
      ...result.data,
      createdAt: new Date(result.data.createdAt),
      updatedAt: new Date(result.data.updatedAt),
      dueDate: result.data.dueDate ? new Date(result.data.dueDate) : undefined,
    };
  },

  // Update task status
  async updateStatus(id: string, status: Task['status']): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    const result: ApiResponse<Task> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to update task status');
    }

    if (!result.data) {
      throw new Error('No task data returned');
    }

    return {
      ...result.data,
      createdAt: new Date(result.data.createdAt),
      updatedAt: new Date(result.data.updatedAt),
      dueDate: result.data.dueDate ? new Date(result.data.dueDate) : undefined,
    };
  },

  // Delete task
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });

    const result: ApiResponse<void> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to delete task');
    }
  },

  // Search tasks
  async search(query: string): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/tasks/search/${encodeURIComponent(query)}`);
    const result: ApiResponse<Task[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to search tasks');
    }
    
    return result.data?.map(task => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    })) || [];
  },
};
