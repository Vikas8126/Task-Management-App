import React from 'react';

interface NavbarProps {
  totalTasks: number;
  completedTasks: number;
}

const Navbar: React.FC<NavbarProps> = ({ totalTasks, completedTasks }) => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold gradient-text">
              TaskFlow
            </h1>
          </div>

          {/* Navigation Items - Empty for now */}
          <div className="flex items-center space-x-6">
            {/* Future navigation items can go here */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;