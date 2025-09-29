import { useState, useEffect, useCallback } from 'react';
import { projectAPI, taskAPI } from '../services/api';

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
  status: 'new' | 'in-progress' | 'blocked' | 'completed';
  projectId: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface SearchResults {
  projects: Project[];
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

interface UseSearchProps {
  debounceMs?: number;
  allProjects?: Project[]; // Add this for local fallback
}

export const useSearch = ({ debounceMs = 300, allProjects = [] }: UseSearchProps = {}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults>({
    projects: [],
    tasks: [],
    isLoading: false,
    error: null,
  });
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Local project search fallback
  const searchProjectsLocally = useCallback((query: string, projects: Project[]): Project[] => {
    if (!query.trim()) return [];
    
    const lowercaseQuery = query.toLowerCase();
    return projects.filter(project => 
      project.name.toLowerCase().includes(lowercaseQuery) ||
      project.description.toLowerCase().includes(lowercaseQuery)
    );
  }, []);

  // Debounced search function
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults({
        projects: [],
        tasks: [],
        isLoading: false,
        error: null,
      });
      return;
    }

    setSearchResults(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Try API search first, fallback to local search for projects
      const [projects, tasks] = await Promise.all([
        projectAPI.search(query).catch(error => {
          console.warn('Project API search failed, using local search:', error);
          return searchProjectsLocally(query, allProjects);
        }),
        taskAPI.search(query).catch(error => {
          console.warn('Task search failed:', error);
          return []; // Return empty array if task search fails
        }),
      ]);

      setSearchResults({
        projects,
        tasks,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Search failed',
      }));
    }
  }, [allProjects, searchProjectsLocally]);

  // Debounce effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, performSearch, debounceMs]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSearchFocus = useCallback(() => {
    setIsSearchFocused(true);
  }, []);

  const handleSearchBlur = useCallback(() => {
    // Delay blur to allow clicking on search results
    setTimeout(() => {
      setIsSearchFocused(false);
    }, 200);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults({
      projects: [],
      tasks: [],
      isLoading: false,
      error: null,
    });
  }, []);

  const hasResults = searchResults.projects.length > 0 || searchResults.tasks.length > 0;
  const showResults = isSearchFocused && (hasResults || searchQuery.trim().length > 0);

  return {
    searchQuery,
    searchResults,
    isSearchFocused,
    showResults,
    handleSearchChange,
    handleSearchFocus,
    handleSearchBlur,
    clearSearch,
  };
};
