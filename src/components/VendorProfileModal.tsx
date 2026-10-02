import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Phone,
  MessageCircle,
  Navigation,
  Star,
  CheckCircle2,
  Heart,
  QrCode,
  Share2,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  Send,
  MessageSquare,
  Shield,
  CreditCard,
  Briefcase,
  Play,
  Pause,
  Video,
  Camera,
  Plus,
  Maximize2,
  ArrowLeft,
  Volume2,
  VolumeX,
  Sparkles,
  Upload,
  Film,
  Image as ImageIcon,
  Check,
  Globe,
  Building2,
  Store,
  Mail,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/translations';
import { Review } from '../types';

export const VendorProfileModal: React.FC = () => {
  const {
    lang,
    role,
    selectedVendorForProfile,
    setSelectedVendorForProfile,
    setSelectedVendorForBooking,
    setSelectedVendorForChat,
    setSelectedVendorForQR,
    toggleFavorite,
    isFavorite,
    trackVendorMetric,
    reviews,
    addReview,
    setReportingVendor,
    setIsReportModalOpen,
    updateVendorMedia
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'media' | 'reviews'>('overview');

  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedSnapForLightbox, setSelectedSnapForLightbox] = useState<string | null>(null);

  // Add media modal state
  const [showAddMediaDialog, setShowAddMediaDialog] = useState(false);
  const [newSnapUrl, setNewSnapUrl] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newBannerUrl, setNewBannerUrl] = useState('');
  const [mediaSavedNotice, setMediaSavedNotice] = useState(false);

  // Review Form State
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Close with ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedSnapForLightbox) {
          setSelectedSnapForLightbox(null);
        } else if (showAddMediaDialog) {
          setShowAddMediaDialog(false);
        } else {
          setSelectedVendorForProfile(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSnapForLightbox, showAddMediaDialog, setSelectedVendorForProfile]);

  // Lock background scroll only when modal is active
  useEffect(() => {
    if (selectedVendorForProfile) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow || '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedVendorForProfile]);

  if (!selectedVendorForProfile) return null;
  const vendor = selectedVendorForProfile;
  const isFav = isFavorite(vendor.id);
  const vendorReviews = reviews.filter((r) => r.vendorId === vendor.id);

  // Full banner URL fallback
  const fullBannerUrl =
    vendor.bannerUrl ||
    vendor.photos[0] ||
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&auto=format&fit=crop&q=80';

  // Default live snaps if not present
  const currentSnaps = vendor.currentSnaps && vendor.currentSnaps.length > 0
    ? vendor.currentSnaps
    : [
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80'
      ];

  // Default live business video clip (short work demonstration)
  const liveVideoUrl = vendor.liveVideoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-an-electrician-connecting-wires-41584-large.mp4';

  const handleCall = () => {
    trackVendorMetric(vendor.id, 'calls');
    window.location.href = `tel:${vendor.phone.replace(/\s+/g, '')}`;
  };

  const handleWhatsApp = () => {
    trackVendorMetric(vendor.id, 'whatsapp');
    const msg = encodeURIComponent(
      `Hello ${vendor.ownerName}, I found "${vendor.businessName}" on Vox Business Vault Gujarat. I want to inquire about your services.`
    );
    window.open(`https://wa.me/${vendor.whatsapp}?text=${msg}`, '_blank');
  };

  const handleDirections = () => {
    trackVendorMetric(vendor.id, 'directions');
    const destination = encodeURIComponent(`${vendor.businessName}, ${vendor.address}, ${vendor.city}, Gujarat`);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
  };

  const handleShare = async () => {
    trackVendorMetric(vendor.id, 'qrScans');
    if (navigator.share) {
      try {
        await navigator.share({
          title: vendor.businessName,
          text: `Check out ${vendor.businessName} on Vox Business Vault Gujarat:`,
          url: window.location.href
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Profile link copied to clipboard!');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    addReview(vendor.id, newReviewName.trim(), newReviewRating, newReviewComment.trim());
    setNewReviewName('');
    setNewReviewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3500);
  };

  // Handle local snap file upload
  const handleSnapFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64Url = event.target.result as string;
          updateVendorMedia(vendor.id, {
            snaps: [base64Url, ...currentSnaps]
          });
          setMediaSavedNotice(true);
          setTimeout(() => setMediaSavedNotice(false), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle local video file upload
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64Url = event.target.result as string;
          updateVendorMedia(vendor.id, {
            videoUrl: base64Url
          });
          setMediaSavedNotice(true);
          setTimeout(() => setMediaSavedNotice(false), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle local banner file upload
  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64Url = event.target.result as string;
          updateVendorMedia(vendor.id, {
            bannerUrl: base64Url
          });
          setMediaSavedNotice(true);
          setTimeout(() => setMediaSavedNotice(false), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSnaps = newSnapUrl.trim()
      ? [newSnapUrl.trim(), ...currentSnaps]
      : currentSnaps;

    updateVendorMedia(vendor.id, {
      bannerUrl: newBannerUrl.trim() || vendor.bannerUrl || fullBannerUrl,
      snaps: updatedSnaps,
      videoUrl: newVideoUrl.trim() || vendor.liveVideoUrl || liveVideoUrl
    });

    setNewSnapUrl('');
    setNewVideoUrl('');
    setNewBannerUrl('');
    setShowAddMediaDialog(false);
    setMediaSavedNotice(true);
    setTimeout(() => setMediaSavedNotice(false), 3000);
  };

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div
      onClick={(e) => {
        // Close on clicking backdrop
        if (e.target === e.currentTarget) {
          setSelectedVendorForProfile(null);
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-hidden"
    >
      {/* 1. VIEWPORT-ANCHORED FLOATING CLOSE BUTTON (Guaranteed Accessible Anywhere, Any Screen Size) */}
      <button
        onClick={() => setSelectedVendorForProfile(null)}
        className="fixed top-3 right-3 sm:top-5 sm:right-6 z-[90] w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white shadow-2xl border-2 border-white/40 flex items-center justify-center cursor-pointer transition-all active:scale-90 hover:scale-105"
        aria-label="Close card"
        title="Close Profile (Esc)"
      >
        <X className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* 2. VIEWPORT-ANCHORED FLOATING BACK BUTTON (Top Left) */}
      <button
        onClick={() => setSelectedVendorForProfile(null)}
        className="fixed top-3 left-3 sm:top-5 sm:left-6 z-[90] h-11 px-3.5 sm:h-12 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white shadow-2xl border-2 border-white/40 flex items-center gap-1.5 cursor-pointer transition-all active:scale-90 text-xs font-bold"
        aria-label="Back"
        title="Go Back (Esc)"
      >
        <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        <span>Back</span>
      </button>

      {/* MODAL MAIN CARD CONTAINER */}
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl h-[100dvh] sm:h-auto sm:max-h-[92vh] sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col relative">

        {/* STICKY TOP APP BAR INSIDE CARD */}
        <div className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 sm:px-5 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs shrink-0">
          {/* Back / Close button (Large touch target) */}
          <button
            onClick={() => setSelectedVendorForProfile(null)}
            className="min-h-[44px] min-w-[44px] px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95 shrink-0"
            aria-label="Close Vendor Profile"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {/* Centered Business Title */}
          <div className="text-center min-w-0 flex-1 px-1">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
              {vendor.businessName}
            </h3>
            <span className="text-[10px] text-slate-500 truncate block">
              {vendor.area}, {vendor.city} · Gujarat
            </span>
          </div>

          {/* Top Right Quick Actions: Share, Favorite, and Close Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors"
              title="Share profile"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => toggleFavorite(vendor.id)}
              className={`w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 flex items-center justify-center transition-colors ${
                isFav ? 'text-rose-500' : 'text-slate-700 dark:text-slate-200'
              }`}
              title="Save to favorites"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={() => setSelectedVendorForProfile(null)}
              className="min-h-[44px] min-w-[44px] px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-600 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 border border-rose-200 dark:border-rose-800"
              title="Close modal"
              aria-label="Close Profile"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* SCROLLABLE INNER BODY */}
        <div className="overflow-y-auto flex-1 text-left overscroll-contain">

          {/* FULL BANNER OF VENDOR (Edge-to-edge, High Resolution) */}
          <div className="relative w-full h-56 sm:h-72 bg-slate-900 overflow-hidden group">
            <img
              src={fullBannerUrl}
              alt={`${vendor.businessName} full official banner`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&auto=format&fit=crop&q=80';
              }}
            />
            {/* Gradient Overlays for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-black/40" />

            {/* Banner Top Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900/85 backdrop-blur-md text-white px-2.5 py-1 rounded-lg border border-white/20 shadow-md">
                Official Business
              </span>

              {/* Operating Model Label */}
              {vendor.businessType === 'online' && (
                <span className="text-[10px] font-bold text-purple-200 bg-purple-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-purple-500/40 flex items-center gap-1 shadow-md">
                  <Globe className="w-3 h-3 text-purple-400" />
                  Online Business
                </span>
              )}
              {vendor.businessType === 'hybrid' && (
                <span className="text-[10px] font-bold text-indigo-200 bg-indigo-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-indigo-500/40 flex items-center gap-1 shadow-md">
                  <Store className="w-3 h-3 text-indigo-400" />
                  Hybrid Business
                </span>
              )}
              {vendor.businessType === 'physical' && (
                <span className="text-[10px] font-bold text-sky-200 bg-sky-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-sky-500/40 flex items-center gap-1 shadow-md">
                  <Building2 className="w-3 h-3 text-sky-400" />
                  Physical Shop / Office
                </span>
              )}

              <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-600/90 backdrop-blur-md text-white px-2 py-1 rounded-lg border border-sky-400/30 flex items-center gap-1 shadow-md">
                <Shield className="w-3 h-3" />
                Gujarat Registered
              </span>
              {vendor.isFeatured && (
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950/90 backdrop-blur-md px-2 py-1 rounded-lg border border-amber-500/40 flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3 h-3 fill-current" />
                  Featured
                </span>
              )}
            </div>

            {/* Quick Button to update banner / snaps for vendors */}
            <div className="absolute top-3 right-3 sm:right-16">
              <button
                onClick={() => setShowAddMediaDialog(true)}
                className="px-3 py-1.5 bg-black/60 hover:bg-black/85 backdrop-blur-md text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-white/25 transition-all shadow-md active:scale-95"
                title="Add current work snaps or live video clip"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>+ Add Snap / Video</span>
              </button>
            </div>

            {/* Bottom Banner Content overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 text-white">
              <div>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-sky-300">
                  {vendor.businessType === 'online'
                    ? `Gujarat Base: ${vendor.city} · Serving All Gujarat & Pan-India`
                    : `${vendor.city}${vendor.area ? ` · ${vendor.area}` : ''}${vendor.businessType === 'hybrid' ? ' (Store + Online)' : ''}`}
                </span>
                <h2 className="text-lg sm:text-2xl font-extrabold text-white drop-shadow-md leading-tight line-clamp-1">
                  {vendor.businessName}
                </h2>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-300 block">Starting from</span>
                <span className="text-base sm:text-xl font-black text-emerald-400">
                  ₹{vendor.startingPrice || 199}
                </span>
              </div>
            </div>
          </div>

          {/* SUCCESS NOTIFICATION WHEN MEDIA IS UPDATED */}
          {mediaSavedNotice && (
            <div className="mx-4 mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-200 animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Live media updated successfully! Customers can now view your current work snaps and video.</span>
            </div>
          )}

          {/* VENDOR HEADER DETAILS (Logo + Credentials + Direct Action Bar) */}
          <div className="p-4 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 -mt-10 sm:-mt-12 relative z-10">
              <div className="flex items-start gap-3.5">
                {/* Logo with verified badge */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-800 shadow-xl shrink-0">
                  <img
                    src={vendor.logoUrl}
                    alt={vendor.businessName}
                    className="w-full h-full object-cover"
                  />
                  {vendor.verificationStatus === 'verified' && (
                    <div className="absolute bottom-1 right-1 bg-sky-600 text-white p-1 rounded-full shadow-md border border-white">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div className="pt-2 sm:pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">
                      Prop. {vendor.ownerName}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500">
                      {vendor.experienceYears} Years Exp.
                    </span>
                  </div>

                  {/* Ratings & Reviews */}
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center text-amber-500 font-bold text-sm">
                      <Star className="w-4 h-4 fill-current mr-1" />
                      <span>{vendor.rating}</span>
                    </div>
                    <span className="text-xs text-slate-400">
                      ({vendor.reviewCount} customer reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Verified Trust Badges */}
              <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-center">
                {vendor.isPhoneVerified && (
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-1" title="Phone number ownership confirmed">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Phone Verified
                  </span>
                )}
                {(vendor.isEmailVerified || vendor.email) && (
                  <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-xl border border-blue-200 dark:border-blue-800 flex items-center gap-1" title="Official business email verified">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    Email Verified
                  </span>
                )}
                {(vendor.isIdentityVerified || vendor.isDocsVerified) && (
                  <span className="text-[11px] font-bold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/60 px-2.5 py-1 rounded-xl border border-violet-200 dark:border-violet-800 flex items-center gap-1" title="Business registration documents verified">
                    <ShieldCheck className="w-3.5 h-3.5 text-violet-600" />
                    Identity Verified
                  </span>
                )}
                {vendor.businessType !== 'online' && vendor.showPublicAddress !== false && vendor.isLocationVerified && (
                  <span className="text-[11px] font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1 rounded-xl border border-sky-200 dark:border-sky-800 flex items-center gap-1" title="Physical premises inspected and verified">
                    <MapPin className="w-3.5 h-3.5 text-sky-600" />
                    Location Verified
                  </span>
                )}
              </div>
            </div>

            {/* DIRECT ACTION BUTTONS (CALL · WHATSAPP · ROUTE/WEBSITE · QR) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <button
                onClick={handleCall}
                className="py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-transform active:scale-95"
              >
                <Phone className="w-4 h-4 fill-current" />
                <span>Call Now</span>
              </button>

              <button
                onClick={handleWhatsApp}
                className="py-3 px-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-transform active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp</span>
              </button>

              {/* 3rd Action: Website for Online, Route for Physical, Safe Fallback */}
              {vendor.businessType === 'online' ? (
                vendor.websiteUrl ? (
                  <a
                    href={vendor.websiteUrl.startsWith('http') ? vendor.websiteUrl : `https://${vendor.websiteUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-transform active:scale-95"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Visit Website</span>
                  </a>
                ) : (
                  <button
                    onClick={() => setSelectedVendorForBooking(vendor)}
                    className="py-3 px-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-transform active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enquire</span>
                  </button>
                )
              ) : vendor.showPublicAddress !== false && (vendor.address || vendor.lat) ? (
                <button
                  onClick={handleDirections}
                  className="py-3 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <Navigation className="w-4 h-4 text-sky-600" />
                  <span>Route</span>
                </button>
              ) : vendor.websiteUrl ? (
                <a
                  href={vendor.websiteUrl.startsWith('http') ? vendor.websiteUrl : `https://${vendor.websiteUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <Globe className="w-4 h-4 text-sky-600" />
                  <span>Website</span>
                </a>
              ) : (
                <button
                  onClick={() => setSelectedVendorForBooking(vendor)}
                  className="py-3 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <Send className="w-4 h-4 text-sky-600" />
                  <span>Enquire</span>
                </button>
              )}

              <button
                onClick={() => setSelectedVendorForQR(vendor)}
                className="py-3 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <QrCode className="w-4 h-4 text-slate-700 dark:text-slate-200" />
                <span>Scan QR</span>
              </button>
            </div>

            {/* BOOK SERVICE & DIRECT CHAT BAR */}
            <div className="p-4 bg-sky-50/80 dark:bg-sky-950/40 rounded-2xl border border-sky-100 dark:border-sky-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-sky-900 dark:text-sky-200 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-sky-600" />
                  Guaranteed Doorstep Service Booking
                </div>
                <div className="text-[11px] text-sky-700/80 dark:text-sky-300">
                  Book with verified ₹199 advance token · 100% refund guarantee
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedVendorForChat(vendor)}
                  className="px-3.5 py-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
                  <span>Direct Chat</span>
                </button>

                <button
                  onClick={() => setSelectedVendorForBooking(vendor)}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  Book Appointment
                </button>
              </div>
            </div>

            {/* PROFILE TABS: Overview | Live Snaps & Video | Services | Reviews */}
            <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-2.5 transition-colors whitespace-nowrap relative ${
                  activeTab === 'overview'
                    ? 'text-sky-600 dark:text-sky-400 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Overview & Hours
                {activeTab === 'overview' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('media')}
                className={`pb-2.5 transition-colors whitespace-nowrap relative flex items-center gap-1.5 ${
                  activeTab === 'media'
                    ? 'text-sky-600 dark:text-sky-400 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Video className="w-3.5 h-3.5 text-sky-600" />
                <span>Live Snaps & Video ({currentSnaps.length + 1})</span>
                {activeTab === 'media' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`pb-2.5 transition-colors whitespace-nowrap relative ${
                  activeTab === 'services'
                    ? 'text-sky-600 dark:text-sky-400 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Services & Rates ({vendor.services.length})
                {activeTab === 'services' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2.5 transition-colors whitespace-nowrap relative ${
                  activeTab === 'reviews'
                    ? 'text-sky-600 dark:text-sky-400 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Reviews ({vendorReviews.length})
                {activeTab === 'reviews' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full" />
                )}
              </button>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    About Business
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {vendor.description}
                  </p>
                </div>

                {/* Live Business Media Preview Teaser Card */}
                <div
                  onClick={() => setActiveTab('media')}
                  className="p-4 bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/40 dark:to-indigo-950/40 rounded-2xl border border-sky-200/80 dark:border-sky-800 flex items-center justify-between cursor-pointer hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>Live Business Video & Work Snaps</span>
                        <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-red-600 text-white rounded">
                          Live
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {currentSnaps.length} verified work snaps · 1 live demonstration clip
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-sky-600 font-bold group-hover:translate-x-1 transition-transform">
                    View Showcase →
                  </span>
                </div>

                {/* Business Hours Card */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Business Hours: {vendor.businessHours.days}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {vendor.businessHours.openTime} – {vendor.businessHours.closeTime}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Open Now</span>
                  </div>
                </div>

                {/* Location & Online Destination Card */}
                {vendor.businessType === 'online' ? (
                  <div className="p-4 bg-purple-50/70 dark:bg-purple-950/40 rounded-2xl border border-purple-200/80 dark:border-purple-800 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            Online Business — Digital & Remote Services
                          </span>
                          <span className="text-[10px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded-md">
                            No Walk-In Counter
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                          This verified business operates 100% digitally. Connect directly via their official website, online platform, WhatsApp, or request an instant quotation.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/60">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                          Gujarat Base (HQ)
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {vendor.city}, Gujarat
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/60">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                          Supported Service Regions
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {vendor.serviceRegions && vendor.serviceRegions.length > 0
                            ? vendor.serviceRegions.join(', ')
                            : 'All Gujarat & India'}
                        </span>
                      </div>
                    </div>

                    {/* Online Destination Links */}
                    {(vendor.websiteUrl || vendor.appStoreUrl || vendor.email) && (
                      <div className="pt-1 flex flex-wrap items-center gap-2">
                        {vendor.websiteUrl && (
                          <a
                            href={vendor.websiteUrl.startsWith('http') ? vendor.websiteUrl : `https://${vendor.websiteUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span>Visit Official Website</span>
                            <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                          </a>
                        )}

                        {vendor.appStoreUrl && (
                          <a
                            href={vendor.appStoreUrl.startsWith('http') ? vendor.appStoreUrl : `https://${vendor.appStoreUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors border border-white/10"
                          >
                            <span>Open Web/Mobile App</span>
                            <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                          </a>
                        )}

                        {vendor.email && (
                          <a
                            href={`mailto:${vendor.email}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5 text-blue-600" />
                            <span>{vendor.email}</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Physical or Hybrid Business Location & Channels */
                  <div className="space-y-3">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {vendor.businessType === 'hybrid' ? 'Physical Premises & Storefront' : 'Physical Store / Office Address'}
                            </span>
                            {vendor.showPublicAddress === false && (
                              <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
                                Address Private
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                            {vendor.showPublicAddress === false ? (
                              <span className="italic text-slate-500">
                                Exact premises address kept private by vendor. Provided upon confirmed enquiry or appointment.
                              </span>
                            ) : (
                              <span>
                                {vendor.address ? `${vendor.address}, ` : ''}{vendor.area ? `${vendor.area}, ` : ''}{vendor.city}, Gujarat{vendor.pincode ? ` - ${vendor.pincode}` : ''}
                              </span>
                            )}
                          </div>

                          {vendor.serviceAtCustomerLocation && (
                            <div className="mt-1.5 text-[11px] text-sky-600 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Doorstep on-site service available across {vendor.city}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Additional Online Channels Card for Hybrid Business */}
                    {vendor.businessType === 'hybrid' && (
                      <div className="p-3.5 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200/80 dark:border-indigo-800 text-xs space-y-2">
                        <div className="flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-200">
                          <Store className="w-4 h-4 text-indigo-600" />
                          <span>Hybrid Channels: In-Store & Nationwide Delivery</span>
                        </div>
                        <div className="text-slate-600 dark:text-slate-300 text-[11px]">
                          Supported Service & Shipping Coverage: <strong>{vendor.serviceRegions?.join(', ') || 'All Gujarat & India'}</strong>
                        </div>
                        {vendor.websiteUrl && (
                          <div className="pt-1">
                            <a
                              href={vendor.websiteUrl.startsWith('http') ? vendor.websiteUrl : `https://${vendor.websiteUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                            >
                              <Globe className="w-3.5 h-3.5" />
                              <span>{vendor.websiteUrl}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: LIVE BUSINESS SNAPS & VERY SHORT VIDEO */}
            {activeTab === 'media' && (
              <div className="space-y-6">
                
                {/* 1. Very Short Video of Live Business */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-sky-600" />
                      <span>Live Business Video Clip</span>
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Short on-site demonstration reel
                    </span>
                  </div>

                  <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 aspect-video shadow-lg border border-slate-200 dark:border-slate-800 group">
                    <video
                      ref={videoRef}
                      src={liveVideoUrl}
                      className="w-full h-full object-cover"
                      loop
                      muted={isMuted}
                      playsInline
                      poster={currentSnaps[0] || vendor.logoUrl}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />

                    {/* Custom Video Controls Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-between p-3 pointer-events-none">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-wider uppercase bg-red-600 text-white px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          Live Business Clip
                        </span>

                        <button
                          type="button"
                          onClick={() => setIsMuted(!isMuted)}
                          className="pointer-events-auto p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                          title={isMuted ? 'Unmute' : 'Mute'}
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                      </div>

                      <div className="flex items-center justify-between pointer-events-auto">
                        <button
                          type="button"
                          onClick={toggleVideoPlayback}
                          className="px-4 py-2 rounded-xl bg-white/95 text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-lg hover:bg-white active:scale-95 transition-all"
                        >
                          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                          <span>{isPlaying ? 'Pause Clip' : 'Play Live Work Video'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowAddMediaDialog(true)}
                          className="px-3 py-1.5 rounded-xl bg-black/60 text-white hover:bg-black/80 font-medium text-xs flex items-center gap-1"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Change Video</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Current Business Snaps */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-sky-600" />
                      <span>Current Business Snaps & Work Gallery ({currentSnaps.length})</span>
                    </h4>

                    <button
                      onClick={() => setShowAddMediaDialog(true)}
                      className="text-xs text-sky-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Snap</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {currentSnaps.map((snap, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedSnapForLightbox(snap)}
                        className="group relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 cursor-pointer shadow-xs hover:shadow-md transition-all"
                      >
                        <img
                          src={snap}
                          alt={`${vendor.businessName} work snap ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Maximize2 className="w-5 h-5 drop-shadow-md" />
                        </div>
                        <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-sm text-white text-[9px] px-1.5 py-0.5 rounded font-medium">
                          Snap #{idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SERVICES & RATES */}
            {activeTab === 'services' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-500">
                  All services include standard inspection, genuine materials guarantee, and labor warranty.
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
                  {vendor.services.map((service, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-white dark:bg-slate-800/40 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-sky-500" />
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {service}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          From ₹{vendor.startingPrice ? vendor.startingPrice + idx * 80 : 199}
                        </span>
                        <button
                          onClick={() => setSelectedVendorForBooking(vendor)}
                          className="px-3 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-sky-600 hover:text-white rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="space-y-3">
                  {vendorReviews.length === 0 ? (
                    <div className="text-center py-6 text-sm text-slate-400">
                      No customer reviews yet. Be the first to review!
                    </div>
                  ) : (
                    vendorReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {rev.customerName}
                            </span>
                            {rev.userCity && (
                              <span className="text-[11px] text-slate-400 ml-1.5">
                                · {rev.userCity}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center text-amber-500 text-xs">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            ))}
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {rev.comment}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Write Review Form */}
                <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                    Write a Verified Customer Review
                  </h4>

                  {reviewSubmitted ? (
                    <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Thank you! Your review has been recorded.
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                          Select Rating (1 to 5 Stars)
                        </label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setNewReviewRating(star)}
                              className="p-1 text-amber-400 hover:scale-110 transition-transform"
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  star <= newReviewRating ? 'fill-current' : 'text-slate-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <input
                        type="text"
                        required
                        placeholder="Your Name (e.g. Ramesh Patel)"
                        value={newReviewName}
                        onChange={(e) => setNewReviewName(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />

                      <textarea
                        required
                        rows={2}
                        placeholder="Describe your service experience, punctuality, and work quality..."
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />

                      <button
                        type="submit"
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Review</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* Bottom Report / Flag Link */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Found incorrect phone number or duplicate profile?</span>
              <button
                onClick={() => {
                  setReportingVendor(vendor);
                  setIsReportModalOpen(true);
                }}
                className="text-rose-500 hover:underline flex items-center gap-1 font-medium"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Report Listing</span>
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM STICKY BAR FOR THUMB CLOSE / ACTIONS */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-lg shrink-0">
          <button
            onClick={() => setSelectedVendorForProfile(null)}
            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-transform active:scale-98 border border-slate-300 dark:border-slate-700"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
            <span>Close Profile Card</span>
          </button>

          <button
            onClick={() => setSelectedVendorForBooking(vendor)}
            className="flex-1 py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98"
          >
            <CreditCard className="w-4 h-4" />
            <span>Book Service</span>
          </button>
        </div>

        {/* LIGHTBOX FOR CURRENT BUSINESS SNAP */}
        {selectedSnapForLightbox && (
          <div
            onClick={() => setSelectedSnapForLightbox(null)}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          >
            <div className="relative max-w-3xl max-h-[90vh] flex flex-col items-center">
              <button
                onClick={() => setSelectedSnapForLightbox(null)}
                className="absolute -top-12 right-0 p-2 text-white hover:text-slate-300 bg-white/20 rounded-full"
              >
                <X className="w-6 h-6 stroke-[2.5]" />
              </button>
              <img
                src={selectedSnapForLightbox}
                alt="Enlarged business snap"
                className="max-w-full max-h-[80vh] rounded-2xl object-contain shadow-2xl"
              />
              <span className="text-white text-xs mt-3">
                {vendor.businessName} · Work Site Snap
              </span>
            </div>
          </div>
        )}

        {/* ADD MEDIA MODAL DIALOG (For Vendor to add Snaps, Video, Banner) */}
        {showAddMediaDialog && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowAddMediaDialog(false);
            }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          >
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 text-left max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Camera className="w-5 h-5 text-sky-600" />
                    <span>Add Business Snaps & Video</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload live work photos, workshop snaps, and a live demonstration clip
                  </p>
                </div>
                <button
                  onClick={() => setShowAddMediaDialog(false)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>

              {/* Direct File Uploads & URLs */}
              <form onSubmit={handleSaveMedia} className="space-y-4">
                
                {/* 1. Current Work Snap Upload */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-sky-600" />
                    <span>1. Current Work Photo / Snap</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <label className="px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleSnapFileUpload}
                      />
                    </label>
                    <span className="text-xs text-slate-400">or enter image URL:</span>
                  </div>

                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={newSnapUrl}
                    onChange={(e) => setNewSnapUrl(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                {/* 2. Short Live Video Upload */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Film className="w-4 h-4 text-red-500" />
                    <span>2. Very Short Video of Live Business</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <label className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Video Clip</span>
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={handleVideoFileUpload}
                      />
                    </label>
                    <span className="text-xs text-slate-400">or enter MP4 video URL:</span>
                  </div>

                  <input
                    type="url"
                    placeholder="https://assets.mixkit.co/... or .mp4 file"
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                {/* 3. Full Header Banner Upload */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>3. Update Full Header Banner</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <label className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Wide Banner</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleBannerFileUpload}
                      />
                    </label>
                    <span className="text-xs text-slate-400">or enter banner URL:</span>
                  </div>

                  <input
                    type="url"
                    placeholder="https://... (panoramic 16:9 banner photo)"
                    value={newBannerUrl}
                    onChange={(e) => setNewBannerUrl(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddMediaDialog(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md active:scale-95"
                  >
                    Save & Update Showcase
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
