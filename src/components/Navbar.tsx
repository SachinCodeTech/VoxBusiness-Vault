import React, { useState } from 'react';
import {
  MapPin,
  Bell,
  Info,
  Globe,
  Briefcase,
  ShieldCheck,
  PlusCircle,
  Menu,
  X,
  ChevronDown,
  QrCode,
  Bookmark,
  Store,
  Layers,
  Search,
  PhoneCall,
  CheckCircle2,
  Lock,
  LogOut,
  Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/translations';
import { UserRole, Language } from '../types';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    lang,
    setLang,
    selectedCity,
    selectedArea,
    setIsLocationModalOpen,
    setIsInfoDrawerOpen,
    setIsNotificationsModalOpen,
    setIsRegistrationModalOpen,
    setIsQRScannerOpen,
    unreadNotifsCount,
    activeTab,
    setActiveTab,
    favorites,
    isAdminAuthenticated,
    isVendorAuthenticated,
    requestRoleChange,
    logoutAdmin,
    logoutVendor,
    adminSession,
    vendorSession
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  return (
    <header className="sticky top-0 z-40 w-full transition-colors">
      {/* 1. Institutional Top Micro-Utility Strip */}
      <div className="bg-slate-950 text-slate-300 border-b border-slate-800/80 text-[11px] leading-tight select-none w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-8 flex items-center justify-between gap-2 sm:gap-4">
          {/* Trust Guarantee & Verification Notice */}
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 shrink-0 text-[10.5px] sm:text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Gujarat Directory</span>
            </span>
            <span className="text-slate-600 hidden xs:inline" aria-hidden="true">·</span>
            <span className="text-slate-400 truncate text-[10px] sm:text-[11px] hidden xs:inline">
              100% Direct Connect · Zero Brokerage · Aadhaar & GST Verified
            </span>
          </div>

          {/* Quick Coverage & Language Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-1.5 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Coverage:</span>
              <span className="text-slate-300 font-medium">Ahmedabad · Surat · Vadodara · Rajkot</span>
            </div>

            <div className="h-3 w-px bg-slate-800 hidden md:block" aria-hidden="true" />

            {/* Language Selector */}
            <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-900 border border-slate-800 rounded px-1 py-0.5" role="group" aria-label="Language selection">
              <Globe className="w-3 h-3 text-slate-400 shrink-0" />
              {(
                [
                  { code: 'en', label: 'EN' },
                  { code: 'gu', label: 'ગુજ' },
                  { code: 'hi', label: 'હિં' }
                ] as const
              ).map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setLang(code as Language)}
                  className={`px-1 sm:px-1.5 py-0.5 rounded text-[9.5px] sm:text-[10px] font-semibold transition-all ${
                    lang === code
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  aria-pressed={lang === code}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Executive Header Bar */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-17 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Identity & Location Selector */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 min-w-0">
            {/* Primary Brand Logo & Monogram */}
            <button
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left group flex items-center gap-2 sm:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-lg p-0.5 shrink-0"
            >
              {/* Premium Geometric Monogram */}
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-900 dark:from-sky-600 dark:via-indigo-600 dark:to-blue-700 flex items-center justify-center text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10 group-hover:scale-[1.02] transition-transform shrink-0">
                <span className="font-bold text-sm sm:text-base tracking-tight font-sans">VB</span>
                {/* Micro Verified Indicator */}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
              </div>

              {/* Typographic Wordmark & Domain Authority */}
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] xs:text-[16px] sm:text-[17px] font-bold tracking-tight text-slate-950 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors leading-tight truncate">
                    Vox Business Vault
                  </span>
                </div>
                <div className="hidden xs:flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 leading-none">
                  <span className="font-medium text-sky-600 dark:text-sky-400 uppercase tracking-wider text-[9.5px]">
                    Gujarat Registry
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Verified Services</span>
                </div>
              </div>
            </button>

            {/* Architected Gujarat Location Trigger */}
            <div className="h-7 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" aria-hidden="true" />

            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="group flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/80 hover:bg-slate-100/90 dark:bg-slate-800/60 dark:hover:bg-slate-800 transition-all text-left shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              title="Change Gujarat City & Area"
              aria-label={`Location: ${selectedArea ? `${selectedArea}, ${selectedCity}` : selectedCity}. Click to change.`}
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-sky-100/80 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 flex items-center justify-center shrink-0">
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.2]" />
              </div>
              <div className="hidden sm:block truncate max-w-[130px] md:max-w-[180px]">
                <span className="block text-[9.5px] uppercase font-semibold tracking-wider text-slate-400 dark:text-slate-500 leading-none mb-0.5">
                  Gujarat City
                </span>
                <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200 truncate leading-tight group-hover:text-sky-600 dark:group-hover:text-sky-400">
                  {selectedArea ? `${selectedArea}, ${selectedCity}` : selectedCity}
                </span>
              </div>
              {/* Mobile-only compact location text */}
              <span className="sm:hidden text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[65px] xs:max-w-[85px]">
                {selectedCity}
              </span>
              <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 shrink-0 ml-0.5 transition-transform group-hover:translate-y-0.5" />
            </button>
          </div>

          {/* Desktop Primary Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            <button
              onClick={() => setActiveTab('home')}
              className={`relative px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-colors ${
                activeTab === 'home'
                  ? 'text-sky-600 dark:text-sky-400 bg-sky-50/80 dark:bg-sky-950/60'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
              }`}
            >
              Find Services
              {activeTab === 'home' && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-sky-600 dark:bg-sky-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`relative px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-colors ${
                activeTab === 'categories'
                  ? 'text-sky-600 dark:text-sky-400 bg-sky-50/80 dark:bg-sky-950/60'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
              }`}
            >
              Categories
              {activeTab === 'categories' && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-sky-600 dark:bg-sky-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`relative px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-colors ${
                activeTab === 'map'
                  ? 'text-sky-600 dark:text-sky-400 bg-sky-50/80 dark:bg-sky-950/60'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
              }`}
            >
              Gujarat Map
              {activeTab === 'map' && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-sky-600 dark:bg-sky-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`relative px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'saved'
                  ? 'text-sky-600 dark:text-sky-400 bg-sky-50/80 dark:bg-sky-950/60'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <span>Saved</span>
              {favorites.length > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {favorites.length}
                </span>
              )}
              {activeTab === 'saved' && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-sky-600 dark:bg-sky-400 rounded-full" />
              )}
            </button>
          </nav>

          {/* Right Action Suite: Role Switcher, Scanners, Alerts, CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
            {/* Multi-role Switcher Segmented Control */}
            <div
              className="hidden md:flex items-center bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold"
              role="radiogroup"
              aria-label="User View Mode"
            >
              <button
                onClick={() => {
                  setRole('customer');
                  setActiveTab('home');
                }}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  role === 'customer'
                    ? 'bg-white dark:bg-slate-700 text-slate-950 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                role="radio"
                aria-checked={role === 'customer'}
              >
                Customer
              </button>
              <button
                onClick={() => {
                  const allowed = requestRoleChange('vendor');
                  if (allowed) setActiveTab('portal');
                }}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  role === 'vendor'
                    ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                role="radio"
                aria-checked={role === 'vendor'}
                title={isVendorAuthenticated ? `Logged in: ${vendorSession?.businessName}` : 'Vendor Hub (Authentication Required)'}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Vendor Hub</span>
                {!isVendorAuthenticated && <Lock className="w-3 h-3 text-slate-400" />}
              </button>
              <button
                onClick={() => {
                  const allowed = requestRoleChange('admin');
                  if (allowed) setActiveTab('portal');
                }}
                className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  role === 'admin'
                    ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                role="radio"
                aria-checked={role === 'admin'}
                title={isAdminAuthenticated ? 'Admin Console (Authenticated)' : 'Admin Route Security (Password Required)'}
              >
                {isAdminAuthenticated ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <Lock className="w-3 h-3 text-slate-400" />
                )}
                <span>Admin</span>
              </button>
            </div>

            {/* Quick Session Logout Buttons for Admin/Vendor */}
            {role === 'admin' && isAdminAuthenticated && (
              <button
                onClick={logoutAdmin}
                className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/80 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
                title="Lock / Logout Admin Session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit Admin</span>
              </button>
            )}
            {role === 'vendor' && isVendorAuthenticated && (
              <button
                onClick={logoutVendor}
                className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 transition-colors"
                title="Logout Vendor Hub"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit Hub</span>
              </button>
            )}

            {/* Quick QR Scanner Trigger */}
            <button
              onClick={() => setIsQRScannerOpen(true)}
              className="p-2 sm:p-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-600 transition-colors hidden sm:flex items-center justify-center shrink-0"
              title="Scan Vendor QR Code"
              aria-label="Scan Vendor QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* Notifications Bell */}
            <button
              onClick={() => setIsNotificationsModalOpen(true)}
              className="relative p-2 sm:p-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              title="Notifications & Live Updates"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] sm:min-w-[18px] sm:h-[18px] bg-rose-600 text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none ring-2 ring-white dark:ring-slate-900 shadow-xs">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {/* CodeTech Info Drawer Trigger */}
            <button
              onClick={() => setIsInfoDrawerOpen(true)}
              className="p-2 sm:p-2.5 rounded-xl border border-sky-200/80 dark:border-sky-900/60 text-sky-600 dark:text-sky-400 bg-sky-50/60 dark:bg-sky-950/40 hover:bg-sky-100/80 dark:hover:bg-sky-900/60 transition-colors shrink-0"
              title="CodeTech Project Details & Documentation"
              aria-label="Open project info"
            >
              <Info className="w-4 h-4 stroke-[2.2]" />
            </button>

            {/* High-Impact Executive CTA: Register Business */}
            <button
              onClick={() => setIsRegistrationModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>List Your Business</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Mobile Executive Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-4 space-y-4 shadow-xl animate-fade-in text-sm">
          {/* Mobile Role Switcher */}
          <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <span>Select Portal Mode</span>
              <span className="text-[10px] text-slate-400 font-normal">Role Security</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => {
                  setRole('customer');
                  setActiveTab('home');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-2 px-2 rounded-xl text-xs font-semibold text-center transition-all ${
                  role === 'customer'
                    ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => {
                  const allowed = requestRoleChange('vendor');
                  if (allowed) setActiveTab('portal');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-2 px-1.5 rounded-xl text-xs font-semibold text-center transition-all flex items-center justify-center gap-1 ${
                  role === 'vendor'
                    ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {!isVendorAuthenticated && <Lock className="w-3 h-3 text-slate-400 shrink-0" />}
                <span>Vendor Hub</span>
              </button>
              <button
                onClick={() => {
                  const allowed = requestRoleChange('admin');
                  if (allowed) setActiveTab('portal');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-2 px-1.5 rounded-xl text-xs font-semibold text-center transition-all flex items-center justify-center gap-1 ${
                  role === 'admin'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {isAdminAuthenticated ? (
                  <ShieldCheck className="w-3 h-3 text-indigo-500 shrink-0" />
                ) : (
                  <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                )}
                <span>Admin</span>
              </button>
            </div>

            {/* Active Session Status & Logout in Mobile Drawer */}
            {role === 'admin' && isAdminAuthenticated && (
              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Session Active</span>
                </span>
                <button
                  onClick={() => {
                    logoutAdmin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Lock Session</span>
                </button>
              </div>
            )}
            {role === 'vendor' && isVendorAuthenticated && (
              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 truncate max-w-[180px]">
                  {vendorSession?.businessName}
                </span>
                <button
                  onClick={() => {
                    logoutVendor();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 shrink-0"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <button
              onClick={() => {
                setActiveTab('home');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left py-2.5 px-3 rounded-xl font-medium flex items-center justify-between transition-colors ${
                activeTab === 'home'
                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-bold'
                  : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>Find Services & Providers</span>
              <Search className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => {
                setActiveTab('categories');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left py-2.5 px-3 rounded-xl font-medium flex items-center justify-between transition-colors ${
                activeTab === 'categories'
                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-bold'
                  : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>All 24 Gujarat Categories</span>
              <Layers className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => {
                setActiveTab('map');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left py-2.5 px-3 rounded-xl font-medium flex items-center justify-between transition-colors ${
                activeTab === 'map'
                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-bold'
                  : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>Interactive Gujarat Map</span>
              <MapPin className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => {
                setActiveTab('saved');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left py-2.5 px-3 rounded-xl font-medium flex items-center justify-between transition-colors ${
                activeTab === 'saved'
                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-bold'
                  : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>Saved Favorite Vendors ({favorites.length})</span>
              <Bookmark className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => {
                setIsQRScannerOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 px-3 rounded-xl font-medium flex items-center justify-between text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span>Scan Vendor QR Code</span>
              <QrCode className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Mobile Registration CTA */}
          <div className="pt-2">
            <button
              onClick={() => {
                setIsRegistrationModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold text-sm shadow flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register Your Gujarat Business (Free)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

