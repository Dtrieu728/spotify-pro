import React from "react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <input
      type="text"
      placeholder="Search playlists..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      style={{ marginBottom: '20px', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
    />
  );
};

export default SearchBar;
