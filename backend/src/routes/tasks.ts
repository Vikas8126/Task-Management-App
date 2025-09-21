import express, { Request, Response } from 'express';
import { TaskService } from '../services/TaskService';

const router = express.Router();

// GET /api/tasks - Get all tasks
router.get('/', async (req: Request, res: Response) => {
  try {
    const tasks = await TaskService.getAllTasks();
    return res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch tasks',
    });
  }
});

// GET /api/tasks/project/:projectId - Get tasks by project ID
router.get('/project/:projectId', async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const tasks = await TaskService.getTasksByProjectId(projectId);
    return res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch tasks for project',
    });
  }
});

// GET /api/tasks/:id - Get task by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await TaskService.getTaskById(id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    return res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch task',
    });
  }
});

// POST /api/tasks - Create new task
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description, projectId, status, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required',
      });
    }

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required',
      });
    }

    const task = await TaskService.createTask(
      title.trim(),
      description?.trim() || '',
      projectId,
      status || 'new',
      dueDate ? new Date(dueDate) : undefined
    );

    return res.status(201).json({
      success: true,
      data: task,
      message: 'Task created successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create task',
    });
  }
});

// PUT /api/tasks/:id - Update task
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status, projectId } = req.body;

    const updates: any = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (status !== undefined) updates.status = status;
    if (projectId !== undefined) updates.projectId = projectId;

    const task = await TaskService.updateTask(id, updates);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    return res.json({
      success: true,
      data: task,
      message: 'Task updated successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update task',
    });
  }
});

// PATCH /api/tasks/:id/status - Update task status only
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    const task = await TaskService.updateTaskStatus(id, status);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    return res.json({
      success: true,
      data: task,
      message: 'Task status updated successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update task status',
    });
  }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await TaskService.deleteTask(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    return res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete task',
    });
  }
});

// GET /api/tasks/search/:query - Search tasks
router.get('/search/:query', async (req: Request, res: Response) => {
  try {
    const { query } = req.params;
    const tasks = await TaskService.searchTasks(query);
    return res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to search tasks',
    });
  }
});

export default router;