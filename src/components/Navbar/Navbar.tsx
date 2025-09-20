import React from "react";
import { Search, Bell } from "lucide-react";
import { useNavbar } from "./hooks/useNavbar";
import "./index.css";

interface NavbarProps {
  totalTasks: number;
  completedTasks: number;
  onSearch: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  totalTasks,
  completedTasks,
  onSearch,
}) => {
  const {
    isSearchFocused,
    searchQuery,
    handleSearchFocus,
    handleSearchBlur,
    handleSearchChange,
  } = useNavbar();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleSearchChange(value);
    onSearch(value);
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
          <div>
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
          </div>
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
