import React, { useState } from 'react';
import {
  Coffee,
  Leaf,
  Sparkles,
  Phone,
  MessageCircle,
  MapPin,
  Star,
  CheckCircle2,
  Heart,
  QrCode,
  ArrowRight,
  Clock,
  Flame,
  Award,
  ExternalLink,
  Share2,
  Zap,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Vendor } from '../types';

export const PopularSpotsCardSection: React.FC = () => {
  const {
    vendors,
    selectedCity,
    setFilters,
    setActiveTab,
    setSelectedVendorForProfile,
    setSelectedVendorForQR,
    setSelectedVendorForBooking,
    toggleFavorite,
    isFavorite,
    trackVendorMetric
  } = useApp();

  const [copiedVendorId, setCopiedVendorId] = useState<string | null>(null);

  const [selectedSubTab, setSelectedSubTab] = useState<'all' | 'tea_stall' | 'pan_parlour' | 'beauty_parlour'>('all');

  // Filter vendors belonging to the 3 popular categories
  const targetCategoryIds = ['tea_stall', 'pan_parlour', 'beauty_parlour'];

  const allPopularVendors = vendors.filter((v) => targetCategoryIds.includes(v.categoryId));

  // Filter by subTab if selected
  const tabFiltered = selectedSubTab === 'all'
    ? allPopularVendors
    : allPopularVendors.filter((v) => v.categoryId === selectedSubTab);

  // Match current city first, or show all if none in city
  const cityMatches = tabFiltered.filter((v) => v.city.toLowerCase() === selectedCity.toLowerCase());
  const displayedVendors = cityMatches.length > 0 ? cityMatches : tabFiltered;

  // Counts for tabs
  const teaCount = allPopularVendors.filter((v) => v.categoryId === 'tea_stall').length;
  const panCount = allPopularVendors.filter((v) => v.categoryId === 'pan_parlour').length;
  const beautyCount = allPopularVendors.filter((v) => v.categoryId === 'beauty_parlour').length;

  const handleCall = (e: React.MouseEvent, vendor: Vendor) => {
    e.stopPropagation();
    trackVendorMetric(vendor.id, 'calls');
    window.location.href = `tel:${vendor.phone.replace(/\s+/g, '')}`;
  };

  const handleWhatsApp = (e: React.MouseEvent, vendor: Vendor) => {
    e.stopPropagation();
    trackVendorMetric(vendor.id, 'whatsapp');
    const msg = encodeURIComponent(
      `Hello ${vendor.ownerName}, I saw your business "${vendor.businessName}" on Vox Business Vault popular directory. I would like to enquire about your services in ${vendor.area}, ${vendor.city}.`
    );
    window.open(`https://wa.me/${vendor.whatsapp}?text=${msg}`, '_blank');
  };

  const handleOpenQR = (e: React.MouseEvent, vendor: Vendor) => {
    e.stopPropagation();
    trackVendorMetric(vendor.id, 'qrScans');
    setSelectedVendorForQR(vendor);
  };

  const handleShare = async (e: React.MouseEvent, vendor: Vendor) => {
    e.stopPropagation();
    trackVendorMetric(vendor.id, 'qrScans');
    const shareUrl = `${window.location.origin}?v=${vendor.qrToken || vendor.id}`;
    const shareTitle = `${vendor.businessName} - Vox Business Vault`;
    const shareText = `Check out ${vendor.businessName} in ${vendor.area}, ${vendor.city} on Vox Business Vault:`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      }
      setCopiedVendorId(vendor.id);
      setTimeout(() => setCopiedVendorId(null), 2400);
    } catch {
      const waMsg = encodeURIComponent(`${shareText} ${shareUrl}`);
      window.open(`https://api.whatsapp.com/send?text=${waMsg}`, '_blank');
    }
  };

  const handleQuickBook = (e: React.MouseEvent, vendor: Vendor) => {
    e.stopPropagation();
    trackVendorMetric(vendor.id, 'views');
    setSelectedVendorForBooking(vendor);
  };

  const handleCategoryClick = (catId: string) => {
    setFilters((prev) => ({
      ...prev,
      category: catId,
      subcategory: '',
      query: ''
    }));
    setActiveTab('home');
  };

  return (
    <section className="mt-8 mb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Gujarat Daily Favorites · લોકપ્રિય ગુજરાત સ્પોટ્સ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Popular Tea Stall, Pan Parlour & Beauty Parlour
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Explore Gujarat's highest rated kadak chai tapris, royal mukhwas pan parlours, and bridal makeover studios with verified ratings and direct contacts.
          </p>
        </div>

        {/* View All In Directory */}
        <button
          onClick={() => {
            setFilters((prev) => ({
              ...prev,
              category: selectedSubTab === 'all' ? 'tea_stall' : selectedSubTab
            }));
            setActiveTab('home');
          }}
          className="self-start md:self-auto text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 flex items-center gap-1.5 group"
        >
          <span>Explore All in {selectedCity}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* 3 Prominent Hero Category Shortcut Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Tea Stall Card */}
        <div
          onClick={() => setSelectedSubTab('tea_stall')}
          className={`relative overflow-hidden rounded-3xl p-5 border cursor-pointer transition-all duration-300 group ${
            selectedSubTab === 'tea_stall'
              ? 'bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 text-white border-amber-500 shadow-lg shadow-amber-900/20 scale-[1.01]'
              : 'bg-gradient-to-br from-amber-50 via-white to-amber-100/40 dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 border-amber-200/80 dark:border-amber-900/40 hover:border-amber-400 text-slate-900 dark:text-white'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 dark:text-amber-400 flex items-center justify-center">
              <Coffee className="w-6 h-6" />
            </div>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
              selectedSubTab === 'tea_stall'
                ? 'bg-amber-800 text-amber-100 border-amber-700'
                : 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
            }`}>
              {teaCount} Verified Stalls
            </span>
          </div>
          <h3 className="mt-3 text-base sm:text-lg font-bold">
            Popular Tea Stall & Chai Tapri
          </h3>
          <p className={`text-xs mt-1 ${selectedSubTab === 'tea_stall' ? 'text-amber-100' : 'text-slate-500 dark:text-slate-400'}`}>
            ચા ની કીટલી · Slow-boiled ginger cardamom kadak chai, fresh Amul bun maska, and hot samosas.
          </p>
          <div className="mt-3 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
            <span className="flex items-center gap-1">Starting from ₹20</span>
            <span className="group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
              Filter Tea Stalls <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Pan Parlour Card */}
        <div
          onClick={() => setSelectedSubTab('pan_parlour')}
          className={`relative overflow-hidden rounded-3xl p-5 border cursor-pointer transition-all duration-300 group ${
            selectedSubTab === 'pan_parlour'
              ? 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 text-white border-emerald-500 shadow-lg shadow-emerald-900/20 scale-[1.01]'
              : 'bg-gradient-to-br from-emerald-50 via-white to-emerald-100/40 dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900 border-emerald-200/80 dark:border-emerald-900/40 hover:border-emerald-400 text-slate-900 dark:text-white'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
              selectedSubTab === 'pan_parlour'
                ? 'bg-emerald-800 text-emerald-100 border-emerald-700'
                : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
            }`}>
              {panCount} Verified Parlours
            </span>
          </div>
          <h3 className="mt-3 text-base sm:text-lg font-bold">
            Popular Pan Parlour & Mukhwas
          </h3>
          <p className={`text-xs mt-1 ${selectedSubTab === 'pan_parlour' ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'}`}>
            પાન પાર્લર · Calcutta silver leaf meetha pan, Banarasi Maghai, fire ice pan, and roasted digestive mukhwas.
          </p>
          <div className="mt-3 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <span className="flex items-center gap-1">Starting from ₹30</span>
            <span className="group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
              Filter Pan Parlours <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Beauty Parlour Card */}
        <div
          onClick={() => setSelectedSubTab('beauty_parlour')}
          className={`relative overflow-hidden rounded-3xl p-5 border cursor-pointer transition-all duration-300 group ${
            selectedSubTab === 'beauty_parlour'
              ? 'bg-gradient-to-br from-pink-600 via-rose-700 to-rose-900 text-white border-pink-500 shadow-lg shadow-pink-900/20 scale-[1.01]'
              : 'bg-gradient-to-br from-pink-50 via-white to-pink-100/40 dark:from-pink-950/20 dark:via-slate-900 dark:to-slate-900 border-pink-200/80 dark:border-pink-900/40 hover:border-pink-400 text-slate-900 dark:text-white'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
              selectedSubTab === 'beauty_parlour'
                ? 'bg-pink-800 text-pink-100 border-pink-700'
                : 'bg-pink-100 dark:bg-pink-900/50 text-pink-800 dark:text-pink-300 border-pink-200 dark:border-pink-800'
            }`}>
              {beautyCount} Verified Studios
            </span>
          </div>
          <h3 className="mt-3 text-base sm:text-lg font-bold">
            Popular Beauty Parlour & Bridal
          </h3>
          <p className={`text-xs mt-1 ${selectedSubTab === 'beauty_parlour' ? 'text-pink-100' : 'text-slate-500 dark:text-slate-400'}`}>
            બ્યુટી પાર્લર · HD & airbrush bridal makeovers, herbal radiance facials, painless waxing, and nail art.
          </p>
          <div className="mt-3 flex items-center justify-between text-xs font-bold text-pink-600 dark:text-pink-400">
            <span className="flex items-center gap-1">Starting from ₹199</span>
            <span className="group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
              Filter Beauty Studios <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Segmented Category Filter Pill Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 dark:bg-slate-800/90 rounded-2xl">
          <button
            onClick={() => setSelectedSubTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSubTab === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            🔥 All Hotspots ({allPopularVendors.length})
          </button>
          <button
            onClick={() => setSelectedSubTab('tea_stall')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              selectedSubTab === 'tea_stall'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" /> Tea Stalls ({teaCount})
          </button>
          <button
            onClick={() => setSelectedSubTab('pan_parlour')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              selectedSubTab === 'pan_parlour'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" /> Pan Parlours ({panCount})
          </button>
          <button
            onClick={() => setSelectedSubTab('beauty_parlour')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              selectedSubTab === 'beauty_parlour'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Beauty Parlours ({beautyCount})
          </button>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing {displayedVendors.length} spots in {cityMatches.length > 0 ? selectedCity : 'Gujarat'}
        </span>
      </div>

      {/* Popular Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedVendors.map((vendor) => {
          const isFav = isFavorite(vendor.id);
          const isTea = vendor.categoryId === 'tea_stall';
          const isPan = vendor.categoryId === 'pan_parlour';
          const isBeauty = vendor.categoryId === 'beauty_parlour';

          return (
            <div
              key={vendor.id}
              onClick={() => setSelectedVendorForProfile(vendor)}
              className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 hover:shadow-xl hover:shadow-slate-900/5 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Banner Strip */}
                <div className="relative w-[calc(100%+2.5rem)] h-36 -mx-5 -mt-5 mb-4 bg-slate-900 overflow-hidden">
                  <img
                    src={vendor.bannerUrl || vendor.photos[0]}
                    alt={vendor.businessName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-black/20 to-transparent" />

                  {/* Top Category Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                      isTea
                        ? 'bg-amber-950/90 text-amber-200 border-amber-600/40'
                        : isPan
                        ? 'bg-emerald-950/90 text-emerald-200 border-emerald-600/40'
                        : 'bg-pink-950/90 text-pink-200 border-pink-600/40'
                    }`}>
                      {isTea && <Coffee className="w-3 h-3 text-amber-400" />}
                      {isPan && <Leaf className="w-3 h-3 text-emerald-400" />}
                      {isBeauty && <Sparkles className="w-3 h-3 text-pink-400" />}
                      <span>{isTea ? 'Tea Stall' : isPan ? 'Pan Parlour' : 'Beauty Parlour'}</span>
                    </span>

                    <span className="text-[10px] font-bold bg-slate-900/80 backdrop-blur-md text-white px-2 py-0.5 rounded-md border border-white/20">
                      {vendor.area}, {vendor.city}
                    </span>
                  </div>

                  {/* Top Right Quick Actions */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleShare(e, vendor)}
                      title="Share spot profile"
                      className="w-7 h-7 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center border border-white/20 transition-colors relative"
                    >
                      {copiedVendorId === vendor.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={(e) => handleOpenQR(e, vendor)}
                      title="Quick QR Token"
                      className="w-7 h-7 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center border border-white/20 transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(vendor.id);
                      }}
                      title="Save to favorites"
                      className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-colors ${
                        isFav
                          ? 'bg-rose-500 text-white border-rose-500'
                          : 'bg-slate-900/80 hover:bg-slate-900 text-white border-white/20'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Bottom Rating and Experience */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-1 bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded-md shadow-xs text-[11px]">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{vendor.rating.toFixed(1)}</span>
                      <span className="text-[10px] font-semibold text-slate-900 opacity-80">({vendor.reviewCount})</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-200 bg-slate-950/70 backdrop-blur-sm px-2 py-0.5 rounded-md">
                      <Clock className="w-3 h-3 text-sky-400" />
                      <span>{vendor.businessHours.openTime} - {vendor.businessHours.closeTime}</span>
                    </div>
                  </div>
                </div>

                {/* Business Info */}
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
                        {vendor.businessName}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                        <span>Prop. {vendor.ownerName}</span>
                        <span>·</span>
                        <span>{vendor.experienceYears} Years in Gujarat</span>
                      </p>
                    </div>

                    <span className="text-xs font-extrabold text-sky-600 dark:text-sky-400 whitespace-nowrap bg-sky-50 dark:bg-sky-950/60 px-2 py-1 rounded-lg border border-sky-100 dark:border-sky-900">
                      ₹{vendor.startingPrice}+
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed pt-1">
                    {vendor.description}
                  </p>

                  {/* Specialty Tags */}
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {vendor.services.slice(0, 3).map((svc, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60 truncate max-w-[200px]"
                      >
                        {svc}
                      </span>
                    ))}
                    {vendor.services.length > 3 && (
                      <span className="text-[10px] font-bold text-slate-400 self-center">
                        +{vendor.services.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Direct CTA Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  {/* Quick Book Primary Button */}
                  <button
                    onClick={(e) => handleQuickBook(e, vendor)}
                    className="flex-1 py-2 bg-gradient-to-r from-sky-600 via-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/20 active:scale-95 transition-all"
                  >
                    <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    <span>Quick Book</span>
                  </button>

                  <button
                    onClick={() => setSelectedVendorForProfile(vendor)}
                    className="px-3 py-2 bg-sky-50 hover:bg-sky-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-sky-700 dark:text-sky-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                    title="View full menu, photos and location"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Details</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={(e) => handleCall(e, vendor)}
                    className="py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5 fill-current" />
                    <span>Call Direct</span>
                  </button>
                  <button
                    onClick={(e) => handleWhatsApp(e, vendor)}
                    className="py-1.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-emerald-200 dark:border-emerald-800 transition-colors active:scale-95"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
