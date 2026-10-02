import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  MapPin,
  X,
  Zap,
  Wrench,
  AirVent,
  Hammer,
  Tv,
  Sparkles,
  Paintbrush,
  Droplets,
  ShieldCheck,
  Car,
  Scissors,
  Truck,
  Sun,
  UtensilsCrossed,
  Gem,
  Shirt,
  Briefcase,
  Music,
  Home,
  Coffee,
  Leaf,
  Stethoscope,
  Pill,
  HeartPulse,
  GraduationCap,
  School,
  Smile,
  Baby,
  Cake,
  Activity,
  ChevronRight,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/translations';

// Map icon names to Lucide components
const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Zap,
  Wrench,
  AirVent,
  Hammer,
  Tv,
  Sparkles,
  Paintbrush,
  Droplets,
  ShieldCheck,
  Car,
  Scissors,
  Truck,
  Sun,
  UtensilsCrossed,
  Gem,
  Shirt,
  Briefcase,
  Music,
  Home,
  Coffee,
  Leaf,
  Stethoscope,
  Pill,
  HeartPulse,
  GraduationCap,
  School,
  Smile,
  Baby,
  Cake,
  Activity
};

export const HeroSearch: React.FC = () => {
  const {
    lang,
    selectedCity,
    selectedArea,
    setIsLocationModalOpen,
    filters,
    setFilters,
    categories,
    vendors,
    setActiveTab,
    setSelectedVendorForProfile
  } = useApp();

  const [inputVal, setInputVal] = useState(filters.query);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (val: string) => {
    setInputVal(val);
    setFilters((prev) => ({ ...prev, query: val }));
    setShowSuggestions(val.trim().length > 0);
  };

  const handleSelectSuggestion = (val: string, categoryId?: string) => {
    setInputVal(val);
    setFilters((prev) => ({
      ...prev,
      query: val,
      category: categoryId || prev.category
    }));
    setShowSuggestions(false);
  };

  // Suggestion matches: matching vendors, categories, services
  const matchingVendors = vendors.filter((v) =>
    v.businessName.toLowerCase().includes(inputVal.toLowerCase()) ||
    v.services.some((s) => s.toLowerCase().includes(inputVal.toLowerCase()))
  ).slice(0, 4);

  const matchingCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(inputVal.toLowerCase()) ||
    c.subcategories.some((sub) => sub.name.toLowerCase().includes(inputVal.toLowerCase()))
  ).slice(0, 3);

  const popularSearches = [
    { label: 'Tea Stall (ચા ની કીટલી)', category: 'tea_stall' },
    { label: 'Pan Parlour (પાન પાર્લર)', category: 'pan_parlour' },
    { label: 'Beauty Parlour (બ્યુટી પાર્લર)', category: 'beauty_parlour' },
    { label: 'Hair Saloon', category: 'hair_salon' },
    { label: 'Doctor Clinic', category: 'clinic' },
    { label: 'Medical Store', category: 'medical_store' },
    { label: 'AC Repair', category: 'ac_services' },
    { label: 'Electrician', category: 'electrician' },
    { label: 'Plumber', category: 'plumber' }
  ];

  // Prioritize high-traffic Gujarat categories including tea_stall, pan_parlour, beauty_parlour
  const prioritizedCategoryOrder = [
    'tea_stall',
    'pan_parlour',
    'beauty_parlour',
    'hair_salon',
    'clinic',
    'medical_store',
    'ac_services',
    'electrician',
    'solar_energy',
    'catering_farsan',
    'plumber',
    'cleaning'
  ];

  const popularGridCategories = [...categories].sort((a, b) => {
    const indexA = prioritizedCategoryOrder.indexOf(a.id);
    const indexB = prioritizedCategoryOrder.indexOf(b.id);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return 0;
  }).slice(0, 10);

  return (
    <div id="hero-search-section" className="relative pt-6 pb-8 md:pt-10 md:pb-12 bg-gradient-to-b from-sky-50/70 via-slate-50/40 to-white dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 border-b border-slate-100 dark:border-slate-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Geographic location label */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs mb-4">
          <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {selectedArea ? `${selectedArea}, ${selectedCity}` : selectedCity}, Gujarat
          </span>
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline font-bold ml-1 pl-1.5 border-l border-slate-200 dark:border-slate-700"
          >
            Change
          </button>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-3xl mx-auto leading-tight text-balance">
          Find Trusted Local Services Near You
        </h1>
        <p className="mt-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          {getTranslation(lang, 'tagline')} — quickly, simply, and directly.
        </p>

        {/* Main Big Search Box */}
        <div ref={containerRef} className="mt-5 sm:mt-8 max-w-2xl mx-auto relative z-30">
          <div className="relative flex items-center bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-900/5 border border-slate-200/90 dark:border-slate-700 p-1.5 transition-all focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-transparent">
            <div className="pl-2.5 sm:pl-3 text-slate-400 shrink-0">
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <input
              type="text"
              value={inputVal}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setShowSuggestions(inputVal.trim().length > 0)}
              placeholder="Search vendor, shop, business or service..."
              className="w-full px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-base bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden min-w-0"
            />

            {inputVal && (
              <button
                onClick={() => {
                  setInputVal('');
                  setFilters((prev) => ({ ...prev, query: '' }));
                  setShowSuggestions(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg mr-1 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => {
                setFilters((prev) => ({ ...prev, query: inputVal }));
                setShowSuggestions(false);
              }}
              className="px-3.5 sm:px-5 py-2 sm:py-2.5 bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shrink-0 shadow-sm"
            >
              Search
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {showSuggestions && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden text-left divide-y divide-slate-100 dark:divide-slate-700/80 animate-fade-in z-50">
              {matchingVendors.length > 0 && (
                <div className="p-3">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-2">
                    Verified Businesses & Shops
                  </div>
                  {matchingVendors.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVendorForProfile(v);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center justify-between group transition-colors"
                    >
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-sky-600">
                          {v.businessName}
                        </div>
                        <div className="text-xs text-slate-500">
                          {v.area}, {v.city} · ⭐ {v.rating}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600" />
                    </button>
                  ))}
                </div>
              )}

              {matchingCategories.length > 0 && (
                <div className="p-3 bg-slate-50/50 dark:bg-slate-800/50">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-2">
                    Services & Categories
                  </div>
                  {matchingCategories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleSelectSuggestion(c.name, c.id)}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-white dark:hover:bg-slate-700 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 font-medium transition-colors"
                    >
                      <span>
                        {c.name} ({c.gujaratiName})
                      </span>
                      <span className="text-[11px] text-sky-600 font-semibold">View All</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Popular Searches Tags */}
          <div className="mt-3 flex items-center justify-center flex-wrap gap-2 text-xs">
            <span className="text-slate-400 text-[11px] flex items-center gap-1 font-medium">
              <TrendingUp className="w-3 h-3 text-sky-500" /> Popular:
            </span>
            {popularSearches.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setInputVal(item.label);
                  setFilters((prev) => ({
                    ...prev,
                    query: item.label,
                    category: item.category
                  }));
                }}
                className="px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-800/80 hover:bg-sky-50 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Category Grid */}
        <div className="mt-8 sm:mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {getTranslation(lang, 'popularCategories')}
            </h2>
            <button
              onClick={() => setActiveTab('categories')}
              className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>{getTranslation(lang, 'viewAllCategories')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-1.5 sm:gap-2.5">
            {popularGridCategories.map((cat) => {
              const IconComp = iconMap[cat.iconName] || Wrench;
              const isSelected = filters.category === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setFilters((prev) => ({
                      ...prev,
                      category: prev.category === cat.id ? '' : cat.id
                    }));
                  }}
                  className={`flex flex-col items-center justify-between p-2 sm:p-2.5 rounded-2xl border transition-all text-center group min-h-[76px] sm:min-h-[84px] ${
                    isSelected
                      ? 'bg-sky-600 border-sky-600 text-white shadow-md shadow-sky-600/20 scale-[1.02]'
                      : 'bg-white dark:bg-slate-800/90 border-slate-200/80 dark:border-slate-700/80 hover:border-sky-300 dark:hover:border-sky-500 text-slate-700 dark:text-slate-200 hover:shadow-xs'
                  }`}
                >
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-1 transition-colors shrink-0 ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-sky-50 dark:bg-slate-700 text-sky-600 dark:text-sky-400 group-hover:bg-sky-100'
                    }`}
                  >
                    <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-semibold tracking-tight leading-[1.15] line-clamp-2 w-full text-center px-0.5 min-h-[22px] sm:min-h-[24px] flex items-center justify-center">
                    {lang === 'gu' ? cat.gujaratiName : cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
