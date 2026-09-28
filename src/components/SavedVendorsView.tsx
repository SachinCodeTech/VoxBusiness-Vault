import React from 'react';
import { Heart, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VendorCard } from './VendorCard';

export const SavedVendorsView: React.FC = () => {
  const { vendors, favorites, setActiveTab } = useApp();

  const savedList = vendors.filter((v) => favorites.includes(v.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left animate-fade-in">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
          <Heart className="w-7 h-7 text-rose-500 fill-current" />
          <span>Saved Vendors & Frequent Services</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Quickly access your trusted electricians, plumbers, AC technicians and repair partners in Gujarat
        </p>
      </div>

      {savedList.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No Saved Vendors Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Tap the heart icon on any vendor card to save your favorite local businesses for instant 1-tap booking.
          </p>
          <button
            onClick={() => setActiveTab('home')}
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm inline-flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Discover Nearby Gujarat Services</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedList.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      )}
    </div>
  );
};
