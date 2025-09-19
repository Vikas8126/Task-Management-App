import { Project, IProject } from '../models/Project';
import { Task } from '../models/Task';

export class ProjectService {
  // Get all projects
  static async getAllProjects(): Promise<IProject[]> {
    try {
      const projects = await Project.find().sort({ createdAt: -1 });
      return projects;
    } catch (error) {
      throw new Error(`Failed to fetch projects: ${error}`);
    }
  }

  // Get project by ID
  static async getProjectById(id: string): Promise<IProject | null> {
    try {
      const project = await Project.findById(id);
      return project;
    } catch (error) {
      throw new Error(`Failed to fetch project: ${error}`);
    }
  }

  // Create new project
  static async createProject(
    name: string,
    description: string,
    color: string
  ): Promise<IProject> {
    try {
      const project = new Project({
        name,
        description,
        color,
      });
      
      const savedProject = await project.save();
      return savedProject;
    } catch (error) {
      throw new Error(`Failed to create project: ${error}`);
    }
  }

  // Update project
  static async updateProject(
    id: string,
    updates: Partial<{ name: string; description: string; color: string }>
  ): Promise<IProject | null> {
    try {
      const project = await Project.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
      return project;
    } catch (error) {
      throw new Error(`Failed to update project: ${error}`);
    }
  }

  // Get tasks associated with project (for deletion confirmation)
  static async getAssociatedTasks(id: string) {
    try {
      const tasks = await Task.find({ projectId: id }).select('title description status');
      return tasks;
    } catch (error) {
      throw new Error(`Failed to fetch associated tasks: ${error}`);
    }
  }

  // Delete project and all its tasks
  static async deleteProject(id: string): Promise<{ deletedProject: boolean; deletedTasks: number }> {
    try {
      // Count tasks before deletion
      const taskCount = await Task.countDocuments({ projectId: id });
      
      // Delete all tasks associated with this project
      const taskDeletionResult = await Task.deleteMany({ projectId: id });
      
      // Delete the project
      const deletedProject = await Project.findByIdAndDelete(id);
      
      return {
        deletedProject: !!deletedProject,
        deletedTasks: taskDeletionResult.deletedCount || 0,
      };
    } catch (error) {
      throw new Error(`Failed to delete project: ${error}`);
    }
  }

  // Get project statistics
  static async getProjectStats(id: string) {
    try {
      const totalTasks = await Task.countDocuments({ projectId: id });
      const completedTasks = await Task.countDocuments({ 
        projectId: id, 
        status: 'completed' 
      });
      const inProgressTasks = await Task.countDocuments({ 
        projectId: id, 
        status: 'in-progress' 
      });
      const pendingTasks = await Task.countDocuments({ 
        projectId: id, 
        status: 'pending' 
      });

      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        totalTasks,
        completedTasks,
        inProgressTasks,
        pendingTasks,
        progress,
      };
    } catch (error) {
      throw new Error(`Failed to get project stats: ${error}`);
    }
  }
}
