import React, { useState, useEffect } from 'react';
import type { Project, Task } from './types/Project';
import Navbar from './components/Navbar';
import ProjectBoard from './components/ProjectBoard';
import TaskBoard from './components/TaskBoard';
import AddProjectModal from './components/AddProjectModal';
import AddTaskModal from './components/AddTaskModal';

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    const savedTasks = localStorage.getItem('tasks');
    
    if (savedProjects) {
      const parsedProjects = JSON.parse(savedProjects);
      setProjects(parsedProjects.map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      })));
    }
    
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      setTasks(parsedTasks.map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
      })));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addProject = (name: string, description: string, color: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      description,
      color,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProjects([...projects, newProject]);
  };

  const addTask = (title: string, description: string, projectId: string) => {
    const newTask: Task = {
        id: Date.now().toString(),
      title,
      description,
        status: 'backlog',
      projectId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleProjectClick = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const handleBackToProjects = () => {
    setSelectedProjectId(null);
  };

  const handleAddTask = () => {
    if (projects.length === 0) {
      alert('Please create a project first before adding tasks.');
      return;
    }
    setShowAddTaskModal(true);
  };

  const selectedProject = selectedProjectId 
    ? projects.find(p => p.id === selectedProjectId)
    : null;

  const selectedProjectTasks = selectedProjectId 
    ? tasks.filter(t => t.projectId === selectedProjectId)
    : [];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar 
        totalTasks={totalTasks} 
        completedTasks={completedTasks} 
        onSearch={(query) => console.log('Search:', query)} 
      />
      
      {selectedProject ? (
        <TaskBoard
          project={selectedProject}
          tasks={selectedProjectTasks}
          onBackToProjects={handleBackToProjects}
          onAddTask={() => setShowAddTaskModal(true)}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
        />
      ) : (
        <ProjectBoard
          projects={projects}
          tasks={tasks}
          onProjectClick={handleProjectClick}
          onAddProject={() => setShowAddProjectModal(true)}
          onAddTask={handleAddTask}
        />
      )}

      <AddProjectModal
        isOpen={showAddProjectModal}
        onClose={() => setShowAddProjectModal(false)}
        onAddProject={addProject}
      />

      <AddTaskModal
        isOpen={showAddTaskModal}
        projects={projects}
        selectedProjectId={selectedProjectId}
        onClose={() => setShowAddTaskModal(false)}
        onAddTask={addTask}
      />
    </div>
  );
}

export default App;