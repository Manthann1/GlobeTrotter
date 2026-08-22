import React, { useState } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, LayoutGrid } from 'lucide-react';

/**
 * Reusable SearchFilterToolbar — matches the wireframe pattern
 * (Search bar + Group by + Filter + Sort by) used across multiple screens.
 */
export default function SearchFilterToolbar({
  searchValue = '',
  onSearchChange,
  placeholder = 'Search...',
  groupByOptions = [],
  sortByOptions = [],
  onGroupByChange,
  onSortByChange,
  onFilterToggle,
  selectedGroupBy = '',
  selectedSortBy = '',
  className = '',
}) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {/* Search Input */}
      <div className="relative flex-1 min-w-[180px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#757682] pointer-events-none" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2 bg-[#f3f4f5] border border-[#c5c5d3] rounded-lg text-sm font-['Inter'] text-[#191c1d] focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] transition-all"
        />
      </div>

      {/* Group By */}
      {groupByOptions.length > 0 && (
        <div className="relative">
          <select
            value={selectedGroupBy}
            onChange={(e) => onGroupByChange?.(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 bg-white border border-[#c5c5d3] rounded-lg text-xs font-bold font-['Inter'] text-[#444651] cursor-pointer hover:border-[#00236f] transition-colors"
          >
            <option value="">Group by</option>
            {groupByOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <LayoutGrid className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#757682] pointer-events-none" />
        </div>
      )}

      {/* Filter Button */}
      <button
        onClick={() => {
          setShowFilters(!showFilters);
          onFilterToggle?.(!showFilters);
        }}
        className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-bold font-['Inter'] transition-colors ${
          showFilters
            ? 'bg-[#00236f] text-white border-[#00236f]'
            : 'bg-white text-[#444651] border-[#c5c5d3] hover:border-[#00236f]'
        }`}
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        Filter
      </button>

      {/* Sort By */}
      {sortByOptions.length > 0 && (
        <div className="relative">
          <select
            value={selectedSortBy}
            onChange={(e) => onSortByChange?.(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 bg-white border border-[#c5c5d3] rounded-lg text-xs font-bold font-['Inter'] text-[#444651] cursor-pointer hover:border-[#00236f] transition-colors"
          >
            <option value="">Sort by</option>
            {sortByOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ArrowUpDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#757682] pointer-events-none" />
        </div>
      )}
    </div>
  );
}
