import React from 'react';
import {
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
  ArrowRight,
  Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';

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

export const CategoriesView: React.FC = () => {
  const { categories, setFilters, setActiveTab, selectedCity, lang } = useApp();

  const handleSelectSub = (categoryId: string, subId: string) => {
    setFilters((prev) => ({
      ...prev,
      category: categoryId,
      subcategory: subId,
      query: ''
    }));
    setActiveTab('home');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left animate-fade-in">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          All Service Categories in Gujarat
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore specialized technicians, home repair professionals & verified businesses in {selectedCity}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const IconComp = iconMap[cat.iconName] || Wrench;

          return (
            <div
              key={cat.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-slate-800 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {cat.gujaratiName} · {cat.subcategories.length} Subcategories
                    </p>
                  </div>
                </div>

                <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {cat.subcategories.map((sub) => (
                    <div key={sub.id} className="pt-2.5 first:pt-0">
                      <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200 mb-1">
                        <span>{sub.name}</span>
                        <button
                          onClick={() => handleSelectSub(cat.id, sub.id)}
                          className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-0.5"
                        >
                          <span>Explore</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                        {sub.services.map((svc, i) => (
                          <span
                            key={i}
                            className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md"
                          >
                            {svc}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setFilters((prev) => ({
                    ...prev,
                    category: cat.id,
                    subcategory: '',
                    query: ''
                  }));
                  setActiveTab('home');
                }}
                className="mt-6 w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View All {cat.name}s in {selectedCity}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
