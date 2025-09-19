import { useState } from 'react';

interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export const useAddTaskModal = (projects: Project[], selectedProjectId?: string) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(selectedProjectId || '');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    if (!selectedProjectId) {
      setProjectId('');
    }
  };

  const validateForm = () => {
    return title.trim() !== '' && projectId !== '';
  };

  const getSelectedProject = () => {
    return projects.find(p => p.id === projectId);
  };

  return {
    title,
    description,
    projectId,
    setTitle,
    setDescription,
    setProjectId,
    resetForm,
    validateForm,
    getSelectedProject,
  };
};
