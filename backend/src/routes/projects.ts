import express, { Request, Response } from 'express';
import { ProjectService } from '../services/ProjectService';

const router = express.Router();

// GET /api/projects - Get all projects
router.get('/', async (req: Request, res: Response) => {
  try {
    const projects = await ProjectService.getAllProjects();
    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch projects',
    });
  }
});

// GET /api/projects/search/:query - Search projects (must be before /:id route)
router.get('/search/:query', async (req: Request, res: Response) => {
  try {
    const { query } = req.params;
    const projects = await ProjectService.searchProjects(query);
    return res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to search projects',
    });
  }
});

// GET /api/projects/:id - Get project by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await ProjectService.getProjectById(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    return res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch project',
    });
  }
});

// POST /api/projects - Create new project
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, color } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Project name is required',
      });
    }

    const project = await ProjectService.createProject(
      name.trim(),
      description?.trim() || '',
      color || '#3B82F6'
    );

    return res.status(201).json({
      success: true,
      data: project,
      message: 'Project created successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create project',
    });
  }
});

// PUT /api/projects/:id - Update project
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, color } = req.body;

    const updates: any = {};
    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description.trim();
    if (color !== undefined) updates.color = color;

    const project = await ProjectService.updateProject(id, updates);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    return res.json({
      success: true,
      data: project,
      message: 'Project updated successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update project',
    });
  }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await ProjectService.deleteProject(id);

    if (!deleted.deletedProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    return res.json({
      success: true,
      data: deleted,
      message: `Project and ${deleted.deletedTasks} associated task(s) deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete project',
    });
  }
});

// GET /api/projects/:id/stats - Get project statistics
router.get('/:id/stats', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const stats = await ProjectService.getProjectStats(id);

    return res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch project stats',
    });
  }
});

// GET /api/projects/:id/tasks - Get associated tasks for deletion confirmation
router.get('/:id/tasks', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tasks = await ProjectService.getAssociatedTasks(id);

    return res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch associated tasks',
    });
  }
});

export default router;
