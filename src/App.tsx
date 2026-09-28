import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { FilterBar } from './components/FilterBar';
import { VendorCard } from './components/VendorCard';
import { InteractiveMap } from './components/InteractiveMap';
import { VendorProfileModal } from './components/VendorProfileModal';
import { BookingPaymentModal } from './components/BookingPaymentModal';
import { DirectMessagingModal } from './components/DirectMessagingModal';
import { QRModal } from './components/QRModal';
import { QRScannerModal } from './components/QRScannerModal';
import { LocationModal } from './components/LocationModal';
import { VendorRegistrationModal } from './components/VendorRegistrationModal';
import { InfoDrawer } from './components/InfoDrawer';
import { NotificationsModal } from './components/NotificationsModal';
import { ReportModal } from './components/ReportModal';
import { BottomNav } from './components/BottomNav';
import { CategoriesView } from './components/CategoriesView';
import { SavedVendorsView } from './components/SavedVendorsView';
import { VendorDashboard } from './components/VendorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { PopularSpotsCardSection } from './components/PopularSpotsCardSection';
import {
  Sparkles,
  MapPin,
  ShieldCheck,
  PlusCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  SearchX,
  CreditCard,
  QrCode
} from 'lucide-react';
import { getTranslation } from './utils/translations';

const MainContent: React.FC = () => {
  const {
    role,
    setRole,
    lang,
    activeTab,
    setActiveTab,
    filteredVendors,
    selectedCity,
    selectedArea,
    setIsRegistrationModalOpen,
    setIsInfoDrawerOpen,
    setIsQRScannerOpen,
    cities,
    setSelectedCity,
    resetFilters,
    leads,
    filters
  } = useApp();

  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Customer past bookings if in customer hub
  const customerLeads = leads;

  const showPopularSpots = !filters.query && (!filters.category || ['tea_stall', 'pan_parlour', 'beauty_parlour'].includes(filters.category));

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Body depending on activeTab */}
      <main className="flex-1 pb-20 md:pb-12">
        {activeTab === 'home' && (
          <>
            {/* Hero Search Section */}
            <HeroSearch />

            {/* Popular Tea Stall, Pan Parlour & Beauty Parlour Card Section */}
            {showPopularSpots && <PopularSpotsCardSection />}

            {/* Filter Bar with List/Map View Mode */}
            <FilterBar
              viewMode={viewMode}
              setViewMode={setViewMode}
              resultCount={filteredVendors.length}
            />

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {viewMode === 'map' ? (
                /* Interactive Map View */
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Interactive GPS & Pin Search · {selectedArea ? `${selectedArea}, ` : ''}{selectedCity}
                    </span>
                    <button
                      onClick={() => setViewMode('list')}
                      className="text-sky-600 hover:underline font-semibold"
                    >
                      Switch back to Card List
                    </button>
                  </div>
                  <InteractiveMap vendors={filteredVendors} />
                </div>
              ) : (
                /* List View */
                <div className="space-y-8">
                  {/* Empty state when no vendors match filter */}
                  {filteredVendors.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-8 sm:p-12 text-center space-y-4 max-w-xl mx-auto my-8">
                      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                        <SearchX className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {getTranslation(lang, 'noVendorsFound')}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {getTranslation(lang, 'noVendorsDesc')}
                      </p>
                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                          onClick={resetFilters}
                          className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold"
                        >
                          Clear Filters
                        </button>
                        <button
                          onClick={() => setIsRegistrationModalOpen(true)}
                          className="w-full sm:w-auto px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-sm"
                        >
                          Register Business Free
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Vendor Cards Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredVendors.map((vendor) => (
                        <VendorCard key={vendor.id} vendor={vendor} />
                      ))}
                    </div>
                  )}

                  {/* Register Business Callout CTA */}
                  <div className="relative bg-gradient-to-r from-sky-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 overflow-hidden shadow-xl">
                    <div className="relative z-10 max-w-2xl space-y-3 text-left">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 bg-sky-950/80 px-3 py-1 rounded-full border border-sky-800 inline-block">
                        Free Business Listing
                      </span>
                      <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                        Are you an electrician, plumber, AC technician or local contractor in Gujarat?
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        Join over 4,500+ verified Gujarat local service professionals. Get your unique QR code display, receive direct customer phone calls, and accept advance bookings.
                      </p>
                      <div className="pt-2 flex items-center flex-wrap gap-3">
                        <button
                          onClick={() => setIsRegistrationModalOpen(true)}
                          className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-lg transition-transform active:scale-95 flex items-center gap-2"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>Register Your Business — Free</span>
                        </button>

                        <button
                          onClick={() => {
                            setRole('vendor');
                            setActiveTab('portal');
                          }}
                          className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs sm:text-sm transition-colors"
                        >
                          Vendor Login / Portal
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Browse Gujarat Cities SEO Discovery Strip */}
                  <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 text-left space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Popular Gujarat Service Hubs
                    </h4>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {cities.slice(0, 10).map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setSelectedCity(c.name)}
                          className={`px-3 py-1.5 rounded-xl border transition-colors ${
                            selectedCity === c.name
                              ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-300 font-bold'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          {c.name} ({c.gujaratiName})
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Tab: Categories */}
        {activeTab === 'categories' && <CategoriesView />}

        {/* Tab: Map View standalone */}
        {activeTab === 'map' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Interactive Map Directory · {selectedCity}
              </h2>
              <span className="text-xs text-slate-500">
                {filteredVendors.length} pins loaded
              </span>
            </div>
            <InteractiveMap vendors={filteredVendors} />
          </div>
        )}

        {/* Tab: Saved Vendors */}
        {activeTab === 'saved' && <SavedVendorsView />}

        {/* Tab: Portal / Dashboard */}
        {activeTab === 'portal' && (
          <>
            {role === 'vendor' && <VendorDashboard />}
            {role === 'admin' && <AdminDashboard />}
            {role === 'customer' && (
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left animate-fade-in">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Customer Account Hub
                  </h3>
                  <p className="text-xs text-slate-500">
                    View your active service bookings, advance payment receipts, and switch management roles.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <button
                      onClick={() => setRole('vendor')}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold"
                    >
                      Switch to Vendor Dashboard
                    </button>
                    <button
                      onClick={() => setRole('admin')}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl font-semibold"
                    >
                      Switch to Admin Console
                    </button>
                  </div>
                </div>

                {/* Booking History */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    My Service Appointments ({customerLeads.length})
                  </h4>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {customerLeads.map((item) => (
                      <div key={item.id} className="py-3 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">
                            {item.service}
                          </div>
                          <div className="text-slate-500 text-[11px]">
                            {item.preferredDate} ({item.preferredTime}) · {item.customerArea}
                          </div>
                          {item.paymentRef && (
                            <div className="text-emerald-600 font-medium text-[10px]">
                              Advance Paid: ₹{item.advancePaid} · Ref: {item.paymentRef}
                            </div>
                          )}
                        </div>

                        <span className="px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider bg-slate-100 text-slate-700">
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Vox Business Vault
            </span>
            <span>·</span>
            <span>Gujarat Local Services Marketplace</span>
          </div>

          <p className="text-slate-400 max-w-xl mx-auto">
            Find and hire verified electricians, plumbers, carpenters, and technicians across Ahmedabad, Surat, Vadodara, Rajkot, Gandhinagar, and all of Gujarat.
          </p>

          <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-4">
            <span>Engineered by <strong>CodeTech</strong></span>
            <span>·</span>
            <span>Lead Developer: <strong>Sachin Sheth</strong></span>
            <span>·</span>
            <button
              onClick={() => setIsInfoDrawerOpen(true)}
              className="text-sky-600 hover:underline font-semibold"
            >
              App Info
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Nav */}
      <BottomNav />

      {/* Global Modals */}
      <VendorProfileModal />
      <BookingPaymentModal />
      <DirectMessagingModal />
      <QRModal />
      <QRScannerModal />
      <LocationModal />
      <VendorRegistrationModal />
      <InfoDrawer />
      <NotificationsModal />
      <ReportModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
