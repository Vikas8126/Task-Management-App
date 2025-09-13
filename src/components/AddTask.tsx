import React, { useState } from 'react';

interface AddTaskProps {
  onAddTask: (title: string, description: string) => void;
}

const AddTask: React.FC<AddTaskProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask(title.trim(), description.trim());
      setTitle('');
      setDescription('');
      setIsExpanded(false);
    }
  };

  return (
    <div className="card animate-slide-up">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="input-field w-full text-lg"
              onFocus={() => setIsExpanded(true)}
            />
          </div>
          <button
            type="submit"
            disabled={!title.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100"
          >
            <span className="flex items-center space-x-2">
              <span>Add Task</span>
              <span className="text-lg">+</span>
            </span>
          </button>
        </div>

        {isExpanded && (
          <div className="animate-slide-down">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description (optional)"
              className="input-field w-full resize-none"
              rows={3}
            />
          </div>
        )}

        {isExpanded && (
          <div className="flex justify-end space-x-3 animate-slide-down">
            <button
              type="button"
              onClick={() => {
                setIsExpanded(false);
                setDescription('');
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddTask;
