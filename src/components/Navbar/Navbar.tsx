import React from "react";
import { Search, Bell, X } from "lucide-react";
import { useSearch } from "../../hooks/useSearch";
import SearchResults from "../SearchResults/SearchResults";
import "./index.css";

interface NavbarProps {
  totalTasks: number;
  completedTasks: number;
  onProjectClick?: (projectId: string) => void;
  onTaskClick?: (taskId: string) => void;
  projects?: Array<{
    id: string;
    name: string;
    description: string;
    color: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

const Navbar: React.FC<NavbarProps> = ({
  totalTasks,
  onProjectClick,
  onTaskClick,
  projects = [],
}) => {
  const {
    searchQuery,
    searchResults,
    isSearchFocused,
    showResults,
    handleSearchChange,
    handleSearchFocus,
    handleSearchBlur,
    clearSearch,
  } = useSearch({ allProjects: projects });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleSearchChange(value);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Logo */}
        <div>
          <h1 className="navbar-logo">TaskFlow</h1>
        </div>

        {/* Search */}
        <div className="navbar-search-container">
          <div className="navbar-search-wrapper">
            <Search className="navbar-search-icon" />
            <input
              type="text"
              placeholder="Search projects and tasks..."
              className="navbar-search-input"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />
            {searchQuery && (
              <button
                className="navbar-search-clear"
                onClick={clearSearch}
                type="button"
              >
                <X className="clear-icon" />
              </button>
            )}
          </div>
          
          {showResults && (
            <SearchResults
              projects={searchResults.projects}
              tasks={searchResults.tasks}
              isLoading={searchResults.isLoading}
              error={searchResults.error}
              onProjectClick={onProjectClick}
              onTaskClick={onTaskClick}
            />
          )}
        </div>

        {/* Controls */}
        <div className="navbar-stats">
          <button className="navbar-notification-btn">
            <Bell style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
            {totalTasks > 0 && (
              <span className="navbar-notification-dot"></span>
            )}
          </button>

          <div className="navbar-avatar">
            V
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
