import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  Navigation,
  Star,
  CheckCircle2,
  Heart,
  QrCode,
  Share2,
  Clock,
  Sparkles,
  ShieldCheck,
  Zap,
  Check
} from 'lucide-react';
import { Vendor } from '../types';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/translations';

interface VendorCardProps {
  vendor: Vendor & { distanceKm?: number };
}

export const VendorCard: React.FC<VendorCardProps> = ({ vendor }) => {
  const {
    lang,
    toggleFavorite,
    isFavorite,
    trackVendorMetric,
    setSelectedVendorForProfile,
    setSelectedVendorForQR,
    setSelectedVendorForBooking
  } = useApp();

  const [copiedShare, setCopiedShare] = useState(false);
  const isFav = isFavorite(vendor.id);

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackVendorMetric(vendor.id, 'calls');
    window.location.href = `tel:${vendor.phone.replace(/\s+/g, '')}`;
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackVendorMetric(vendor.id, 'whatsapp');
    const msg = encodeURIComponent(
      `Hello ${vendor.ownerName}, I found your business "${vendor.businessName}" on Vox Business Vault. I would like to enquire about your services in ${vendor.area}, ${vendor.city}.`
    );
    window.open(`https://wa.me/${vendor.whatsapp}?text=${msg}`, '_blank');
  };

  const handleDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackVendorMetric(vendor.id, 'directions');
    const destination = encodeURIComponent(`${vendor.businessName}, ${vendor.address}, ${vendor.city}, Gujarat`);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    trackVendorMetric(vendor.id, 'qrScans');
    const shareUrl = `${window.location.origin}?v=${vendor.qrToken || vendor.id}`;
    const shareTitle = `${vendor.businessName} - Vox Business Vault`;
    const shareText = `Discover ${vendor.businessName} (${vendor.categoryId.replace('_', ' ')}, ${vendor.area}, ${vendor.city}) on Vox Business Vault Gujarat:`;

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

    // Fallback: copy to clipboard with instant visual feedback
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2400);
    } catch {
      // Fallback directly to WhatsApp share
      const waMsg = encodeURIComponent(`${shareText} ${shareUrl}`);
      window.open(`https://api.whatsapp.com/send?text=${waMsg}`, '_blank');
    }
  };

  const handleQuickBook = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackVendorMetric(vendor.id, 'views');
    setSelectedVendorForBooking(vendor);
  };

  return (
    <div
      onClick={() => setSelectedVendorForProfile(vendor)}
      className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 hover:shadow-xl hover:shadow-slate-900/5 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
    >
      <div>
        {/* Vendor Banner Strip */}
        <div className="relative -mx-5 -mt-5 mb-4 h-32 bg-slate-900 overflow-hidden">
          <img
            src={
              vendor.bannerUrl ||
              vendor.photos[0] ||
              'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80'
            }
            alt={vendor.businessName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

          {/* Banner Media Badges */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900/85 backdrop-blur-md text-white px-2 py-0.5 rounded-md border border-white/20">
              {vendor.city}
            </span>
            {vendor.isFeatured && (
              <span className="text-[10px] font-bold text-amber-300 bg-amber-950/90 backdrop-blur-md px-2 py-0.5 rounded-md border border-amber-500/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-current" />
                Featured
              </span>
            )}
            {vendor.verificationStatus === 'verified' && (
              <span className="text-[10px] font-bold text-sky-200 bg-sky-950/90 backdrop-blur-md px-2 py-0.5 rounded-md border border-sky-500/40 flex items-center gap-1 relative overflow-hidden">
                <span className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                <ShieldCheck className="w-3 h-3 text-sky-400 fill-sky-950 animate-pulse-glow" />
                <span>Verified</span>
              </span>
            )}
          </div>

          <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
            {vendor.currentSnaps && vendor.currentSnaps.length > 0 && (
              <span className="text-[10px] font-bold bg-black/70 backdrop-blur-md text-white px-2 py-0.5 rounded-md flex items-center gap-1">
                <span>📸</span> {vendor.currentSnaps.length} Snaps
              </span>
            )}
            {vendor.liveVideoUrl && (
              <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                <span>▶</span> Live Clip
              </span>
            )}
          </div>
        </div>

        {/* Top Header: Logo + Title + Badges */}
        <div className="flex items-start gap-4">
          {/* Logo / Thumbnail */}
          <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
            <img
              src={vendor.logoUrl}
              alt={vendor.businessName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // styled fallback container
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {vendor.isFeatured && (
              <div className="absolute top-1 left-1 bg-amber-500 text-white p-1 rounded-md shadow-xs">
                <Sparkles className="w-3 h-3" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight group-hover:text-sky-600 transition-colors line-clamp-1">
                {vendor.businessName}
              </h3>
              {/* Header Action Buttons (Share & Favorite) */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={handleShare}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-sky-600 relative group/share"
                  title="Share profile"
                >
                  {copiedShare ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(vendor.id);
                  }}
                  className={`p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 ${
                    isFav ? 'text-rose-500' : 'text-slate-400 hover:text-rose-400'
                  }`}
                  title={isFav ? 'Remove from favorites' : 'Save vendor'}
                >
                  <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Zero-Pill Unboxed Metadata with Subtle Typographic Separators */}
            <div className="mt-1 flex items-center flex-wrap gap-x-2 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">
                {vendor.categoryId.replace('_', ' ')}
              </span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
              <span>{vendor.area}, {vendor.city}</span>
              {vendor.distanceKm !== undefined && (
                <>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                  <span className="font-semibold text-sky-600 dark:text-sky-400">
                    {vendor.distanceKm} km away
                  </span>
                </>
              )}
            </div>

            {/* Verification Status & Rating Row */}
            <div className="mt-2 flex items-center flex-wrap gap-x-3 gap-y-1 text-xs">
              {vendor.verificationStatus === 'verified' && (
                <div className="relative inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-sky-50 via-sky-100/70 to-indigo-50 dark:from-sky-950/70 dark:via-sky-900/50 dark:to-indigo-950/60 border border-sky-200/90 dark:border-sky-800/80 text-sky-700 dark:text-sky-300 font-bold shadow-xs overflow-hidden group/verified">
                  {/* Subtle Shimmer Sweep */}
                  <span className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 dark:via-white/15 to-transparent pointer-events-none" />

                  {/* Pulsing Shield Icon Container */}
                  <div className="relative flex items-center justify-center shrink-0">
                    <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-sky-400 opacity-40" />
                    <span className="relative flex items-center justify-center animate-pulse-glow rounded-full p-0.5 bg-sky-500/10">
                      <ShieldCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 fill-sky-100 dark:fill-sky-950/90 stroke-[2.2]" />
                    </span>
                  </div>

                  <span className="tracking-tight text-[11px]">Verified Business</span>
                </div>
              )}

              <div className="flex items-center gap-1 text-slate-800 dark:text-slate-200 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{vendor.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal">({vendor.reviewCount})</span>
              </div>

              {/* Live Open / Closed indicator */}
              <div className="flex items-center gap-1 text-xs">
                <span
                  className={`w-2 h-2 rounded-full ${
                    vendor.businessHours.isOpenToday ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                />
                <span
                  className={`font-medium ${
                    vendor.businessHours.isOpenToday
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-slate-500'
                  }`}
                >
                  {vendor.businessHours.isOpenToday ? 'Open Now' : 'Closed'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Short Description */}
        <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
          {vendor.description}
        </p>

        {/* Services highlights unboxed */}
        <div className="mt-3 flex items-center flex-wrap gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          {vendor.services.slice(0, 3).map((service, idx) => (
            <span
              key={idx}
              className="bg-slate-100/80 dark:bg-slate-800/80 px-2 py-0.5 rounded-md text-slate-700 dark:text-slate-300"
            >
              {service}
            </span>
          ))}
          {vendor.services.length > 3 && (
            <span className="text-slate-400 font-medium pl-1">
              +{vendor.services.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Starting Price + Quick Book Primary CTA + 1-Tap Contact Actions */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
        {/* Row 1: Starting Price, QR & Share + Quick Book Primary Button */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">
                Starting from
              </span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                ₹{vendor.startingPrice || 199}
              </span>
            </div>

            <div className="relative flex items-center gap-0.5 pl-2 border-l border-slate-200 dark:border-slate-800">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedVendorForQR(vendor);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="View QR Code"
              >
                <QrCode className="w-4 h-4" />
              </button>

              <button
                onClick={handleShare}
                className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors relative"
                title="Share listing via Web Share / WhatsApp"
              >
                {copiedShare ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
              </button>

              {copiedShare && (
                <div className="absolute -top-7 left-0 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-20 flex items-center gap-1 animate-fade-in">
                  <Check className="w-3 h-3 text-emerald-400" />
                  Link Copied!
                </div>
              )}
            </div>
          </div>

          {/* Quick Book Primary Action Button */}
          <button
            onClick={handleQuickBook}
            className="h-9 px-3.5 sm:px-4 rounded-xl bg-gradient-to-r from-sky-600 via-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/20 hover:shadow-lg hover:shadow-sky-600/30 active:scale-95 transition-all shrink-0"
            title={`Quick book appointment with ${vendor.businessName}`}
          >
            <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>Quick Book</span>
          </button>
        </div>

        {/* Row 2: 1-Tap Connect Actions (Call, WhatsApp, Map) */}
        <div className="grid grid-cols-3 gap-2">
          {/* Call Now */}
          <button
            onClick={handleCall}
            className="h-8.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors active:scale-95"
            title={`Call ${vendor.phone}`}
          >
            <Phone className="w-3.5 h-3.5 fill-current" />
            <span>Call</span>
          </button>

          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="h-8.5 px-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>

          {/* Directions */}
          <button
            onClick={handleDirections}
            className="h-8.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95"
            title="Directions"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Map</span>
          </button>
        </div>
      </div>
    </div>
  );
};
