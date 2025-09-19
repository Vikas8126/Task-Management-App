import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import ProjectBoard from './components/ProjectBoard/ProjectBoard';
import AddProjectModal from './components/AddProjectModal/AddProjectModal';
import AddTaskModal from './components/AddTaskModal/AddTaskModal';
import NotificationModal from './components/NotificationModal/NotificationModal';
import { projectAPI, taskAPI } from './services/api';

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
  status: 'backlog' | 'pending' | 'in-progress' | 'review' | 'completed';
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load data from API on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Loading data from API...');
      
      // Load projects first
      console.log('Fetching projects...');
      const projectsData = await projectAPI.getAll();
      console.log('Projects loaded successfully:', projectsData);
      setProjects(projectsData);
      
      // Load tasks second
      console.log('Fetching tasks...');
      const tasksData = await taskAPI.getAll();
      console.log('Tasks loaded successfully:', tasksData);
      setTasks(tasksData);
      
      console.log('All data loaded successfully!');
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (name: string, description: string, color: string) => {
    try {
      const newProject = await projectAPI.create(name, description, color);
      setProjects([...projects, newProject]);
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project. Please try again.');
    }
  };

  const addTask = async (title: string, description: string, projectId: string) => {
    try {
      const newTask = await taskAPI.create(title, description, projectId);
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create task. Please try again.');
    }
  };

  const handleAddTask = () => {
    if (projects.length === 0) {
      setShowNotification(true);
      return;
    }
    setShowAddTaskModal(true);
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#ffffff', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: '#6b7280' }}>Loading TaskFlow...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#111827' }}>
      <Navbar 
        totalTasks={totalTasks} 
        completedTasks={completedTasks} 
        onSearch={(query) => console.log('Search:', query)} 
      />
      
      <ProjectBoard
        projects={projects}
        tasks={tasks}
        onProjectClick={(projectId) => console.log('Project clicked:', projectId)}
        onAddProject={() => setShowAddProjectModal(true)}
        onAddTask={handleAddTask}
      />

      <AddProjectModal
        isOpen={showAddProjectModal}
        onClose={() => setShowAddProjectModal(false)}
        onAddProject={addProject}
      />

      <AddTaskModal
        isOpen={showAddTaskModal}
        projects={projects}
        onClose={() => setShowAddTaskModal(false)}
        onAddTask={addTask}
      />

      <NotificationModal
        isOpen={showNotification}
        title="No Projects Available"
        message="Please create a project first before adding tasks."
        icon="📁"
        primaryAction={{
          label: "Create Project",
          onClick: () => {
            setShowNotification(false);
            setShowAddProjectModal(true);
          }
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => setShowNotification(false)
        }}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
}

export default App;