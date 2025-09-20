import { Task, ITask } from '../models/Task';
import { Project } from '../models/Project';

export class TaskService {
  // Get all tasks
  static async getAllTasks(): Promise<ITask[]> {
    try {
      const tasks = await Task.find().sort({ createdAt: -1 });
      return tasks;
    } catch (error) {
      throw new Error(`Failed to fetch tasks: ${error}`);
    }
  }

  // Get tasks by project ID
  static async getTasksByProjectId(projectId: string): Promise<ITask[]> {
    try {
      const tasks = await Task.find({ projectId }).sort({ createdAt: -1 });
      return tasks;
    } catch (error) {
      throw new Error(`Failed to fetch tasks for project: ${error}`);
    }
  }

  // Get task by ID
  static async getTaskById(id: string): Promise<ITask | null> {
    try {
      const task = await Task.findById(id);
      return task;
    } catch (error) {
      throw new Error(`Failed to fetch task: ${error}`);
    }
  }

  // Create new task
  static   async createTask(
    title: string,
    description: string,
    projectId: string,
    status: 'new' | 'in-progress' | 'blocked' | 'completed' = 'new'
  ): Promise<ITask> {
    try {
      // Verify project exists
      const project = await Project.findById(projectId);
      if (!project) {
        throw new Error('Project not found');
      }

      const task = new Task({
        title,
        description,
        status,
        projectId,
      });
      
      const savedTask = await task.save();
      return savedTask;
    } catch (error) {
      throw new Error(`Failed to create task: ${error}`);
    }
  }

  // Update task
  static async updateTask(
    id: string,
    updates: Partial<{
      title: string;
      description: string;
      status: 'new' | 'in-progress' | 'blocked' | 'completed';
      projectId: string;
    }>
  ): Promise<ITask | null> {
    try {
      // If updating projectId, verify the new project exists
      if (updates.projectId) {
        const project = await Project.findById(updates.projectId);
        if (!project) {
          throw new Error('Project not found');
        }
      }

      const task = await Task.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
      return task;
    } catch (error) {
      throw new Error(`Failed to update task: ${error}`);
    }
  }

  // Delete task
  static async deleteTask(id: string): Promise<boolean> {
    try {
      const deletedTask = await Task.findByIdAndDelete(id);
      return !!deletedTask;
    } catch (error) {
      throw new Error(`Failed to delete task: ${error}`);
    }
  }

  // Get tasks by status
  static async getTasksByStatus(
    status: 'new' | 'in-progress' | 'blocked' | 'completed'
  ): Promise<ITask[]> {
    try {
      const tasks = await Task.find({ status }).populate('projectId').sort({ createdAt: -1 });
      return tasks;
    } catch (error) {
      throw new Error(`Failed to fetch tasks by status: ${error}`);
    }
  }

  // Update task status
  static async updateTaskStatus(
    id: string,
    status: 'new' | 'in-progress' | 'blocked' | 'completed'
  ): Promise<ITask | null> {
    try {
      const task = await Task.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
      return task;
    } catch (error) {
      throw new Error(`Failed to update task status: ${error}`);
    }
  }

  // Search tasks
  static async searchTasks(query: string): Promise<ITask[]> {
    try {
      const tasks = await Task.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
        ],
      }).populate('projectId').sort({ createdAt: -1 });
      return tasks;
    } catch (error) {
      throw new Error(`Failed to search tasks: ${error}`);
    }
  }
}
