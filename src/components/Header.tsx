import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="relative z-20 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text">
            TaskFlow
          </h1>
          <p className="text-xl text-gray-300 font-light">
            Streamline your productivity with intelligent task management
          </p>
          <div className="flex justify-center items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
