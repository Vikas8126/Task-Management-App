import { useState } from 'react';

export const useAddProjectModal = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');

  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#EC4899', // Pink
    '#6B7280', // Gray
  ];

  const resetForm = () => {
    setName('');
    setDescription('');
    setSelectedColor('#3B82F6');
  };

  const validateForm = () => {
    return name.trim() !== '';
  };

  return {
    name,
    description,
    selectedColor,
    colors,
    setName,
    setDescription,
    setSelectedColor,
    resetForm,
    validateForm,
  };
};
