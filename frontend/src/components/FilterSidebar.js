import React, { useState } from 'react';
import SearchBar from './SearchBar';
import FilterBar from './FilterBar';
import './FilterSidebar.css';

const FilterSidebar = ({ filters, makes, years, onFilterChange, onClear, isOpen, onToggle }) => {
  return (
    <>
      {/* Mobile toggle button */}
      <button className="sidebar-toggle" onClick={onToggle}>
        {isOpen ? '✕' : '☰'} Filters
      </button>

      {/* Sidebar overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onToggle}></div>}

      {/* Sidebar */}
      <aside className={`filter-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>🔍 Filters</h2>
          <button className="sidebar-close" onClick={onToggle}>✕</button>
        </div>

        <div className="sidebar-content">
          <div className="sidebar-section">
            <h3>Search</h3>
            <SearchBar
              value={filters.search}
              onChange={(value) => onFilterChange({ search: value })}
            />
          </div>

          <div className="sidebar-section">
            <h3>Filters</h3>
            <FilterBar
              filters={filters}
              makes={makes}
              years={years}
              onChange={onFilterChange}
              onClear={onClear}
            />
          </div>

          <div className="sidebar-footer">
            <button onClick={onClear} className="clear-all-btn">
              Clear All Filters
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;

