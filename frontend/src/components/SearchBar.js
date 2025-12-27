import React from 'react';
import './SearchBar.css';

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search vehicles by title..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;

