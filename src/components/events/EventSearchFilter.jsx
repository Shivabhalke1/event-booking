import React from 'react';
import { Search, Tag, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';

const CATEGORIES = ['All', 'Tech', 'Music', 'Workshop', 'Sports'];

export const EventSearchFilter = ({ filters, onFilterChange, onReset }) => {
  const handleInputChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  const hasActiveFilters =
    filters.category !== 'All' ||
    Boolean(filters.searchQuery) ||
    Boolean(filters.maxPrice) ||
    filters.sortBy !== 'date_asc';

  return (
    <div className="search-filter-bar">
      <div className="filter-row">
        {/* Search Input */}
        <div className="form-group">
          <label className="form-label">Search Events</label>
          <div className="input-icon-wrapper">
            <Search size={18} />
            <input
              type="text"
              className="form-input"
              placeholder="Search by title, venue, or keyword..."
              value={filters.searchQuery || ''}
              onChange={(e) => handleInputChange('searchQuery', e.target.value)}
            />
          </div>
        </div>

        {/* Category Dropdown */}
        <div className="form-group">
          <label className="form-label">Category</label>
          <div className="input-icon-wrapper">
            <Tag size={18} />
            <select
              className="form-select"
              value={filters.category || 'All'}
              onChange={(e) => handleInputChange('category', e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Max Price Filter */}
        <div className="form-group">
          <label className="form-label">Max Price (₹)</label>
          <div className="input-icon-wrapper">
            <SlidersHorizontal size={18} />
            <select
              className="form-select"
              value={filters.maxPrice || ''}
              onChange={(e) => handleInputChange('maxPrice', e.target.value)}
            >
              <option value="">Any Price</option>
              <option value="0">Free Only (₹0)</option>
              <option value="500">Under ₹500</option>
              <option value="1000">Under ₹1,000</option>
              <option value="2000">Under ₹2,000</option>
            </select>
          </div>
        </div>

        {/* Sort By Dropdown */}
        <div className="form-group">
          <label className="form-label">Sort Order</label>
          <div className="input-icon-wrapper">
            <ArrowUpDown size={18} />
            <select
              className="form-select"
              value={filters.sortBy || 'date_asc'}
              onChange={(e) => handleInputChange('sortBy', e.target.value)}
            >
              <option value="date_asc">Earliest Date</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="form-group" style={{ alignSelf: 'flex-end' }}>
            <button
              onClick={onReset}
              className="btn btn-secondary btn-sm"
              style={{ height: '42px', padding: '0 1rem' }}
              title="Reset all filters"
            >
              <X size={16} /> Reset
            </button>
          </div>
        )}
      </div>

      {/* Quick Category Chips */}
      <div className="category-chips">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`chip ${filters.category === cat ? 'active' : ''}`}
            onClick={() => handleInputChange('category', cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventSearchFilter;
