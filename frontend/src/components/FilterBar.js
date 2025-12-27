import React from 'react';
import './FilterBar.css';

const FilterBar = ({ filters, makes, years, onChange, onClear }) => {
  const hasActiveFilters = filters.year || filters.make || filters.minYear || filters.maxYear;

  return (
    <div className="filter-bar">
      <div className="filter-row">
        <div className="filter-group">
          <label htmlFor="make-filter">Make:</label>
          <select
            id="make-filter"
            value={filters.make}
            onChange={(e) => onChange({ make: e.target.value })}
            className="filter-select"
          >
            <option value="">All Makes</option>
            {makes.map(make => (
              <option key={make} value={make}>{make}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="year-filter">Year:</label>
          <select
            id="year-filter"
            value={filters.year}
            onChange={(e) => onChange({ year: e.target.value })}
            className="filter-select"
          >
            <option value="">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="min-year">Min Year:</label>
          <input
            id="min-year"
            type="number"
            placeholder="Min"
            value={filters.minYear}
            onChange={(e) => onChange({ minYear: e.target.value })}
            className="filter-input"
            min="1900"
            max={new Date().getFullYear() + 1}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="max-year">Max Year:</label>
          <input
            id="max-year"
            type="number"
            placeholder="Max"
            value={filters.maxYear}
            onChange={(e) => onChange({ maxYear: e.target.value })}
            className="filter-input"
            min="1900"
            max={new Date().getFullYear() + 1}
          />
        </div>

        {hasActiveFilters && (
          <button onClick={onClear} className="clear-filters-btn">
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;

