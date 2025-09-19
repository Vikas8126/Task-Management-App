import { useState } from 'react';

export const useNavbar = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return {
    isSearchFocused,
    searchQuery,
    handleSearchFocus,
    handleSearchBlur,
    handleSearchChange,
    clearSearch,
  };
};
