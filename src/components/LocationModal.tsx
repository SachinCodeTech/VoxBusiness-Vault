import React, { useState } from 'react';
import { X, MapPin, Navigation, Search, Check, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LocationModal: React.FC = () => {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    cities,
    selectedCity,
    setSelectedCity,
    selectedArea,
    setSelectedArea,
    requestUserLocation,
    isDetectingLocation
  } = useApp();

  const [citySearch, setCitySearch] = useState('');
  const [areaSearch, setAreaSearch] = useState('');
  const [tempCity, setTempCity] = useState(selectedCity);

  React.useEffect(() => {
    if (!isLocationModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLocationModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocationModalOpen, setIsLocationModalOpen]);

  if (!isLocationModalOpen) return null;

  const currentCityObj = cities.find(
    (c) => c.name.toLowerCase() === tempCity.toLowerCase()
  ) || cities[0];

  const filteredCities = cities.filter(
    (c) =>
      c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
      c.gujaratiName.includes(citySearch) ||
      c.hindiName.includes(citySearch)
  );

  const filteredAreas = (currentCityObj?.areas || []).filter((a) =>
    a.toLowerCase().includes(areaSearch.toLowerCase())
  );

  const handleApply = (areaName?: string) => {
    setSelectedCity(tempCity);
    setSelectedArea(areaName !== undefined ? areaName : '');
    setIsLocationModalOpen(false);
  };

  const handleUseGPS = async () => {
    await requestUserLocation();
    setIsLocationModalOpen(false);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsLocationModalOpen(false);
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[88vh] relative">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-600" />
              Select Gujarat Location
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              India → Gujarat State Exclusive Network
            </p>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors"
            aria-label="Close location selector"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* GPS Auto-Detect Button */}
        <div className="p-4 bg-sky-50/70 dark:bg-sky-950/40 border-b border-sky-100 dark:border-sky-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center">
              <Navigation className={`w-4 h-4 ${isDetectingLocation ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Use My Current Location
              </div>
              <div className="text-[11px] text-slate-500">
                Auto-detect closest Gujarat city and local distance
              </div>
            </div>
          </div>
          <button
            onClick={handleUseGPS}
            disabled={isDetectingLocation}
            className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 disabled:opacity-50"
          >
            {isDetectingLocation ? 'Detecting...' : 'Detect GPS'}
          </button>
        </div>

        {/* Two-Column Selector: City on Left, Areas on Right */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800 flex-1 overflow-hidden">
          {/* Step 1: Select City */}
          <div className="p-4 flex flex-col h-[280px] md:h-[380px] overflow-hidden">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              1. Select City ({filteredCities.length})
            </div>
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                placeholder="Search city (e.g. Surat, Rajkot)"
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 rounded-lg border-0 focus:ring-1 focus:ring-sky-500 text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>
            <div className="overflow-y-auto space-y-1 flex-1 pr-1">
              {filteredCities.map((city) => {
                const isSelected = tempCity.toLowerCase() === city.name.toLowerCase();
                return (
                  <button
                    key={city.id}
                    onClick={() => setTempCity(city.name)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-sky-600 text-white font-bold shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
                    }`}
                  >
                    <div>
                      <span>{city.name}</span>
                      <span className={`ml-2 text-[10px] ${isSelected ? 'text-sky-100' : 'text-slate-400'}`}>
                        {city.gujaratiName}
                      </span>
                    </div>
                    {isSelected ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Select Area */}
          <div className="p-4 flex flex-col h-[280px] md:h-[380px] overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                2. Select Area in {tempCity}
              </div>
              <button
                onClick={() => handleApply('')}
                className="text-[11px] font-semibold text-sky-600 hover:underline"
              >
                All {tempCity}
              </button>
            </div>
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={areaSearch}
                onChange={(e) => setAreaSearch(e.target.value)}
                placeholder={`Search area in ${tempCity}...`}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-1 focus:ring-sky-500 text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>
            <div className="overflow-y-auto space-y-1 flex-1 pr-1">
              <button
                onClick={() => handleApply('')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                  selectedCity === tempCity && (!selectedArea || selectedArea === '')
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <span>Entire {tempCity} (All Localities)</span>
                {selectedCity === tempCity && (!selectedArea || selectedArea === '') && (
                  <Check className="w-4 h-4" />
                )}
              </button>

              {filteredAreas.map((area) => {
                const isSelected = selectedCity === tempCity && selectedArea === area;
                return (
                  <button
                    key={area}
                    onClick={() => handleApply(area)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-sky-600 text-white font-bold shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{area}</span>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Selected: <strong className="text-slate-900 dark:text-white">{tempCity}</strong>
            {selectedArea ? ` › ${selectedArea}` : ' (All areas)'}
          </div>
          <button
            onClick={() => handleApply(selectedArea)}
            className="px-5 py-2 bg-slate-900 dark:bg-sky-600 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
};
