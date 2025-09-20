import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { projectAPI, taskAPI } from '../../services/api';
import Navbar from '../Navbar/Navbar';
import AddTaskModal from '../AddTaskModal/AddTaskModal';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';
import './index.css';

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
  createdAt: Date;
  updatedAt: Date;
}

function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      loadProjectData();
    }
  }, [projectId]);

  const loadProjectData = async () => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      const [projectData, tasksData] = await Promise.all([
        projectAPI.getById(projectId),
        taskAPI.getByProjectId(projectId)
      ]);
      setProject(projectData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to load project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (title: string, description: string, taskProjectId?: string) => {
    const targetProjectId = taskProjectId || projectId;
    if (!targetProjectId) return;
    
    try {
      const newTask = await taskAPI.create(title, description, targetProjectId);
      setTasks([...tasks, newTask]);
      setShowAddTaskModal(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      const updatedTask = await taskAPI.updateStatus(taskId, newStatus);
      setTasks(tasks.map(task => 
        task.id === taskId ? updatedTask : task
      ));
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await taskAPI.delete(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const deleteProject = async () => {
    if (!projectId) return;
    
    try {
      await projectAPI.delete(projectId);
      navigate('/');
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  if (loading) {
    return (
      <div className="project-detail-loading">
        <Navbar 
          totalTasks={0} 
          completedTasks={0} 
          onSearch={(query) => console.log('Search:', query)}
        />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-detail-error">
        <Navbar 
          totalTasks={0} 
          completedTasks={0} 
          onSearch={(query) => console.log('Search:', query)}
        />
        <div className="error-container">
          <h2>Project not found</h2>
          <button 
            className="btn-primary" 
            onClick={() => navigate('/')}
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const columns = [
    { id: 'new', title: 'New Task', status: 'new' as const },
    { id: 'in-progress', title: 'In Progress', status: 'in-progress' as const },
    { id: 'blocked', title: 'Blocked', status: 'blocked' as const },
    { id: 'completed', title: 'Completed', status: 'completed' as const }
  ];

  return (
    <div className="project-detail">
      <Navbar 
        totalTasks={tasks.length} 
        completedTasks={getTasksByStatus('completed').length}
        onSearch={(query) => console.log('Search:', query)} 
      />
      
      <div className="project-detail-container">
        <div className="project-detail-header">
          <div className="project-detail-header-left">
            <button 
              className="back-button"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={20} />
              Back to Projects
            </button>
            <div className="project-info">
              <div 
                className="project-color-indicator"
                style={{ backgroundColor: project.color }}
              ></div>
              <div>
                <h1 className="project-title">{project.name}</h1>
                <p className="project-description">{project.description}</p>
              </div>
            </div>
          </div>
          
          <div className="project-detail-header-actions">
            <button 
              className="add-task-button"
              onClick={() => setShowAddTaskModal(true)}
            >
              <Plus size={20} />
              Add Task
            </button>
            
            <button 
              className="delete-project-button"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 size={20} />
              Delete Project
            </button>
          </div>
        </div>

        <div className="kanban-board">
          {columns.map(column => (
            <div key={column.id} className="kanban-column">
              <div className="column-header">
                <h3 className="column-title">{column.title}</h3>
                <span className="task-count">
                  {getTasksByStatus(column.status).length}
                </span>
              </div>
              
              <div className="column-content">
                {getTasksByStatus(column.status).map(task => (
                  <div key={task.id} className="task-card">
                    <div className="task-header">
                      <h4 className="task-title">{task.title}</h4>
                      <button 
                        className="delete-task-btn"
                        onClick={() => deleteTask(task.id)}
                      >
                        ×
                      </button>
                    </div>
                    <p className="task-description">{task.description}</p>
                    <div className="task-actions">
                      {column.status !== 'new' && (
                        <button 
                          className="move-left-btn"
                          onClick={() => {
                            const statuses: Task['status'][] = ['new', 'in-progress', 'blocked', 'completed'];
                            const currentIndex = statuses.indexOf(column.status);
                            if (currentIndex > 0) {
                              updateTaskStatus(task.id, statuses[currentIndex - 1]);
                            }
                          }}
                        >
                          ←
                        </button>
                      )}
                      {column.status !== 'completed' && (
                        <button 
                          className="move-right-btn"
                          onClick={() => {
                            const statuses: Task['status'][] = ['new', 'in-progress', 'blocked', 'completed'];
                            const currentIndex = statuses.indexOf(column.status);
                            if (currentIndex < statuses.length - 1) {
                              updateTaskStatus(task.id, statuses[currentIndex + 1]);
                            }
                          }}
                        >
                          →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddTaskModal && (
        <AddTaskModal
          isOpen={showAddTaskModal}
          projects={[project]}
          selectedProjectId={project.id}
          onAddTask={addTask}
          onClose={() => setShowAddTaskModal(false)}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          project={project}
          tasks={tasks}
          onConfirm={deleteProject}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}

export default ProjectDetail;
