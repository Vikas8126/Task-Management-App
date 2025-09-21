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
  const [dueDate, setDueDate] = useState('');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
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
    dueDate,
    setTitle,
    setDescription,
    setProjectId,
    setDueDate,
    resetForm,
    validateForm,
    getSelectedProject,
  };
};
