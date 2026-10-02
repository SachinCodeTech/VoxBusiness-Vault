import React from 'react';
import { Home, Grid, Map, Heart, User, QrCode } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsQRScannerOpen,
    role,
    favorites,
    isAdminAuthenticated,
    isVendorAuthenticated,
    requestRoleChange
  } = useApp();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe">
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-2">
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            activeTab === 'home'
              ? 'text-sky-600 dark:text-sky-400 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Home</span>
        </button>

        {/* Categories */}
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            activeTab === 'categories'
              ? 'text-sky-600 dark:text-sky-400 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Services</span>
        </button>

        {/* Center: QR Scan trigger */}
        <button
          onClick={() => setIsQRScannerOpen(true)}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] -mt-5"
          title="Scan Vendor QR"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-sky-600/30">
            <QrCode className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 mt-1">Scan QR</span>
        </button>

        {/* Saved Favorites */}
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] relative transition-colors ${
            activeTab === 'saved'
              ? 'text-sky-600 dark:text-sky-400 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Saved</span>
          {favorites.length > 0 && (
            <span className="absolute top-1 right-3 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {favorites.length}
            </span>
          )}
        </button>

        {/* Role Portal / Dashboard */}
        <button
          onClick={() => {
            if (role === 'admin' && !isAdminAuthenticated) {
              requestRoleChange('admin');
              return;
            }
            if (role === 'vendor' && !isVendorAuthenticated) {
              requestRoleChange('vendor');
              return;
            }
            setActiveTab('portal');
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            activeTab === 'portal'
              ? 'text-sky-600 dark:text-sky-400 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1 capitalize">
            {role === 'customer' ? 'My Hub' : role}
          </span>
        </button>
      </div>
    </div>
  );
};
