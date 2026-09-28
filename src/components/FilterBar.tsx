import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Clock,
  Star,
  SlidersHorizontal,
  RotateCcw,
  List,
  Map as MapIcon,
  ChevronDown,
  Navigation,
  Check,
  X,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/translations';

interface FilterBarProps {
  viewMode: 'list' | 'map';
  setViewMode: (mode: 'list' | 'map') => void;
  resultCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  viewMode,
  setViewMode,
  resultCount
}) => {
  const {
    lang,
    filters,
    setFilters,
    resetFilters,
    categories,
    selectedCity,
    userCoords
  } = useApp();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isRatingMenuOpen, setIsRatingMenuOpen] = useState(false);
  const [isDistanceMenuOpen, setIsDistanceMenuOpen] = useState(false);

  const ratingMenuRef = useRef<HTMLDivElement>(null);
  const distanceMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ratingMenuRef.current && !ratingMenuRef.current.contains(event.target as Node)) {
        setIsRatingMenuOpen(false);
      }
      if (distanceMenuRef.current && !distanceMenuRef.current.contains(event.target as Node)) {
        setIsDistanceMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCategoryObj = categories.find((c) => c.id === filters.category);

  // Active filter count calculation
  let activeFilterCount = 0;
  if (filters.verifiedOnly) activeFilterCount++;
  if (filters.openNowOnly) activeFilterCount++;
  if (filters.minRating > 0) activeFilterCount++;
  if (filters.maxDistanceKm > 0) activeFilterCount++;
  if (filters.subcategory) activeFilterCount++;
  if (filters.category) activeFilterCount++;

  const ratingOptions = [
    { label: 'Any Rating', value: 0 },
    { label: '3.5+ Stars', value: 3.5 },
    { label: '4.0+ Stars', value: 4.0 },
    { label: '4.5+ Stars', value: 4.5 },
    { label: '4.8+ Top Rated', value: 4.8 }
  ];

  const distanceOptions = [
    { label: 'All Gujarat (Any)', value: 0 },
    { label: 'Within 5 km', value: 5 },
    { label: 'Within 10 km', value: 10 },
    { label: 'Within 25 km', value: 25 },
    { label: 'Within 50 km', value: 50 }
  ];

  return (
    <div className="py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 sticky top-16 z-20 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Filters Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Dynamic Filter Chips and Controls */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {/* 1. Verified Only Status Chip */}
            <button
              onClick={() =>
                setFilters((prev) => ({ ...prev, verifiedOnly: !prev.verifiedOnly }))
              }
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                filters.verifiedOnly
                  ? 'bg-sky-600 text-white shadow-xs scale-[1.02]'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{getTranslation(lang, 'filterVerified')}</span>
            </button>

            {/* 2. Available Now / Open Now Status Toggle */}
            <button
              onClick={() =>
                setFilters((prev) => ({ ...prev, openNowOnly: !prev.openNowOnly }))
              }
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 relative ${
                filters.openNowOnly
                  ? 'bg-emerald-600 text-white shadow-xs scale-[1.02]'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span className="relative flex h-2 w-2">
                {filters.openNowOnly && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  filters.openNowOnly ? 'bg-white' : 'bg-emerald-500'
                }`}></span>
              </span>
              <Clock className="w-3.5 h-3.5" />
              <span>Available Now</span>
            </button>

            {/* 3. Min Rating Dynamic Dropdown */}
            <div className="relative shrink-0" ref={ratingMenuRef}>
              <button
                onClick={() => {
                  setIsRatingMenuOpen(!isRatingMenuOpen);
                  setIsDistanceMenuOpen(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  filters.minRating > 0
                    ? 'bg-amber-500 text-white shadow-xs scale-[1.02]'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${filters.minRating > 0 ? 'fill-white' : 'fill-amber-400 text-amber-500'}`} />
                <span>
                  {filters.minRating > 0 ? `${filters.minRating}★+ Rating` : 'Min Rating'}
                </span>
                <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
              </button>

              {isRatingMenuOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-44 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-1.5 z-40 animate-fade-in text-xs">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Filter by Min Rating
                  </div>
                  {ratingOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setFilters((prev) => ({ ...prev, minRating: opt.value }));
                        setIsRatingMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left font-medium transition-colors ${
                        filters.minRating === opt.value
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                        <span>{opt.label}</span>
                      </span>
                      {filters.minRating === opt.value && <Check className="w-3.5 h-3.5 text-amber-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Distance Range Dynamic Dropdown */}
            <div className="relative shrink-0" ref={distanceMenuRef}>
              <button
                onClick={() => {
                  setIsDistanceMenuOpen(!isDistanceMenuOpen);
                  setIsRatingMenuOpen(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  filters.maxDistanceKm > 0
                    ? 'bg-indigo-600 text-white shadow-xs scale-[1.02]'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>
                  {filters.maxDistanceKm > 0 ? `< ${filters.maxDistanceKm} km` : 'Distance Range'}
                </span>
                <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
              </button>

              {isDistanceMenuOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-1.5 z-40 animate-fade-in text-xs">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Radius from {userCoords ? 'GPS' : selectedCity}
                  </div>
                  {distanceOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setFilters((prev) => ({ ...prev, maxDistanceKm: opt.value }));
                        setIsDistanceMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left font-medium transition-colors ${
                        filters.maxDistanceKm === opt.value
                          ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {filters.maxDistanceKm === opt.value && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Subcategories (if category selected) */}
            {selectedCategoryObj && selectedCategoryObj.subcategories.length > 0 && (
              <select
                value={filters.subcategory}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, subcategory: e.target.value }))
                }
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-0 focus:ring-1 focus:ring-sky-500 shrink-0"
              >
                <option value="">All {selectedCategoryObj.name} Services</option>
                {selectedCategoryObj.subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            )}

            {/* More Filters Panel Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                isExpanded || activeFilterCount > 0
                  ? 'bg-slate-900 text-white dark:bg-slate-700 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>More Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Clear All Reset Button */}
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="p-1.5 rounded-xl text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1 shrink-0 font-medium"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>

          {/* Right: Results Count + Sort + List/Map Segmented Control */}
          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <span className="text-xs text-slate-500">
              <strong className="text-slate-900 dark:text-white tabular-nums">{resultCount}</strong>{' '}
              verified providers
            </span>

            {/* Sort Dropdown */}
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sortBy: e.target.value as any
                }))
              }
              className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1.5 rounded-xl border-0 focus:ring-1 focus:ring-sky-500"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="rating">Top Rated (⭐)</option>
              <option value="distance">Nearest Distance</option>
              <option value="price_low">Starting Price (Lowest)</option>
            </select>

            {/* List / Map Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'map'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Interactive Map View"
              >
                <MapIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Advanced Filters Tray */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 animate-fade-in grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Dynamic Min Rating Selector */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                <span>Minimum Customer Rating</span>
              </label>
              <div className="flex items-center gap-1 flex-wrap">
                {ratingOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        minRating: prev.minRating === opt.value ? 0 : opt.value
                      }))
                    }
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      filters.minRating === opt.value
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Distance Range Selector */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-indigo-500" />
                <span>Distance Range ({userCoords ? 'GPS Live' : `${selectedCity} Center`})</span>
              </label>
              <div className="flex items-center gap-1 flex-wrap">
                {distanceOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        maxDistanceKm: prev.maxDistanceKm === opt.value ? 0 : opt.value
                      }))
                    }
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      filters.maxDistanceKm === opt.value
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability & Verification Quick Toggles */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
                <span>Verification & Availability Status</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, openNowOnly: !prev.openNowOnly }))
                  }
                  className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-all ${
                    filters.openNowOnly
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  <span>Open Now</span>
                </button>

                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, verifiedOnly: !prev.verifiedOnly }))
                  }
                  className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-all ${
                    filters.verifiedOnly
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Aadhaar/GST Verified</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
