import React, { useState, useRef, useEffect } from 'react';
import {
  TrendingUp,
  Phone,
  MessageCircle,
  Navigation,
  QrCode,
  Users,
  Eye,
  CreditCard,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  Share2,
  Calendar,
  AlertCircle,
  ExternalLink,
  PlusCircle,
  BarChart3,
  Layers,
  Sparkles,
  Camera,
  Video,
  Upload,
  Image as ImageIcon,
  Film,
  Trash2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Check,
  Maximize2,
  Mail,
  RefreshCw,
  Globe,
  Building2,
  Store,
  SlidersHorizontal,
  ShieldCheck,
  MapPin,
  Lock,
  Smartphone,
  LogOut
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { useApp } from '../context/AppContext';
import { Vendor } from '../types';
import { retryFailedLeadNotification } from '../utils/leadNotificationService';

export const VendorDashboard: React.FC = () => {
  const {
    vendors,
    leads,
    updateLeadStatus,
    setSelectedVendorForQR,
    setSelectedVendorForProfile,
    setIsRegistrationModalOpen,
    registerVendor,
    updateVendorMedia,
    updateVendorProfile,
    logoutVendor,
    vendorSession
  } = useApp();

  const [selectedVendorId, setSelectedVendorId] = useState<string>(
    vendorSession?.vendorId || vendors[0]?.id || ''
  );

  useEffect(() => {
    if (vendorSession?.vendorId) {
      setSelectedVendorId(vendorSession.vendorId);
    }
  }, [vendorSession?.vendorId]);
  const [activeTab, setActiveTab] = useState<'analytics' | 'leads' | 'media' | 'qr' | 'business-model'>('analytics');
  const [metricFilter, setMetricFilter] = useState<'all' | 'views' | 'calls' | 'whatsapp'>('all');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [timeRange, setTimeRange] = useState<'6m' | '7d'>('6m');
  
  // Media inputs state
  const [newSnapInput, setNewSnapInput] = useState('');
  const [newVideoInput, setNewVideoInput] = useState('');
  const [newBannerInput, setNewBannerInput] = useState('');
  const [mediaSavedMsg, setMediaSavedMsg] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const dashboardVideoRef = useRef<HTMLVideoElement>(null);

  // Business Operating Type & Channel management state
  const [profileBusinessType, setProfileBusinessType] = useState<'physical' | 'online' | 'hybrid'>('physical');
  const [profileWebsiteUrl, setProfileWebsiteUrl] = useState('');
  const [profileAppStoreUrl, setProfileAppStoreUrl] = useState('');
  const [profilePrimaryChannel, setProfilePrimaryChannel] = useState<'website' | 'whatsapp' | 'email' | 'app'>('website');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileWhatsapp, setProfileWhatsapp] = useState('');
  const [profileServiceRegions, setProfileServiceRegions] = useState('All Gujarat, Pan-India');
  const [profileAddress, setProfileAddress] = useState('');
  const [profileArea, setProfileArea] = useState('');
  const [profileCity, setProfileCity] = useState('');
  const [profilePincode, setProfilePincode] = useState('');
  const [profileShowPublicAddress, setProfileShowPublicAddress] = useState(true);
  const [profileSavedMsg, setProfileSavedMsg] = useState<string | null>(null);
  const [profileErrorMsg, setProfileErrorMsg] = useState<string | null>(null);

  // If no vendors exist in directory
  if (vendors.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center animate-fade-in">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-8 sm:p-12 shadow-sm space-y-5">
          <div className="w-16 h-16 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center mx-auto">
            <BarChart3 className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Vendor Portal & Analytics Hub
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
              Register your local Gujarat business or create a listing to visualize monthly inquiry trends, call volumes, and profile views.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsRegistrationModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register Your Gujarat Business (Free)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const vendor = vendors.find((v) => v.id === selectedVendorId) || vendors[0];
  const vendorLeads = leads.filter((l) => l.vendorId === vendor.id);

  // Synchronize profile settings form state when vendor changes
  useEffect(() => {
    if (vendor) {
      setProfileBusinessType(vendor.businessType || 'physical');
      setProfileWebsiteUrl(vendor.websiteUrl || '');
      setProfileAppStoreUrl(vendor.appStoreUrl || '');
      setProfilePrimaryChannel(vendor.primaryOnlineChannel || 'website');
      setProfileEmail(vendor.email || '');
      setProfileWhatsapp(vendor.whatsapp || '');
      setProfileServiceRegions(
        vendor.serviceRegions && vendor.serviceRegions.length > 0 ? vendor.serviceRegions.join(', ') : 'All Gujarat, Pan-India'
      );
      setProfileAddress(vendor.address || '');
      setProfileArea(vendor.area || '');
      setProfileCity(vendor.city || '');
      setProfilePincode(vendor.pincode || '');
      setProfileShowPublicAddress(vendor.showPublicAddress !== false);
      setProfileSavedMsg(null);
      setProfileErrorMsg(null);
    }
  }, [vendor.id]);

  const handleSaveProfileSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSavedMsg(null);
    setProfileErrorMsg(null);

    // Validation
    if (profileBusinessType === 'physical') {
      if (!profileAddress.trim()) {
        setProfileErrorMsg('Physical business requires a valid street address.');
        return;
      }
    } else if (profileBusinessType === 'online') {
      if (!profileWebsiteUrl.trim() && !profileEmail.trim() && !profileWhatsapp.trim()) {
        setProfileErrorMsg('Online business requires at least one digital channel (website, business email, or WhatsApp Business).');
        return;
      }
    }

    const regions = profileServiceRegions
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);

    const res = updateVendorProfile(vendor.id, {
      businessType: profileBusinessType,
      websiteUrl: profileWebsiteUrl.trim() || undefined,
      appStoreUrl: profileAppStoreUrl.trim() || undefined,
      primaryOnlineChannel: profileBusinessType !== 'physical' ? profilePrimaryChannel : undefined,
      email: profileEmail.trim() || undefined,
      whatsapp: profileWhatsapp.replace(/\D/g, ''),
      serviceRegions: profileBusinessType !== 'physical' ? (regions.length > 0 ? regions : ['All Gujarat', 'Pan-India']) : ['Gujarat'],
      showPublicAddress: profileBusinessType === 'online' ? false : profileShowPublicAddress,
      address: profileBusinessType === 'online' ? undefined : (profileAddress.trim() || undefined),
      area: profileBusinessType === 'online' ? undefined : (profileArea.trim() || undefined),
      city: profileCity.trim() || vendor.city,
      pincode: profileBusinessType === 'online' ? undefined : (profilePincode.trim() || undefined),
    });

    if (res.success) {
      setProfileSavedMsg('Business operating model and contact channels saved successfully.');
      setTimeout(() => setProfileSavedMsg(null), 5000);
    } else {
      setProfileErrorMsg(res.error || 'Failed to update business settings.');
    }
  };

  // Profile completion calculation
  let completionScore = 50;
  if (vendor.photos.length > 0) completionScore += 10;
  if (vendor.currentSnaps && vendor.currentSnaps.length > 0) completionScore += 10;
  if (vendor.liveVideoUrl) completionScore += 10;
  if (vendor.services.length >= 3) completionScore += 10;
  if (vendor.verificationStatus === 'verified') completionScore += 10;

  // Breakdown dataset for Recharts Line Chart & Bar Chart
  const viewsBase = Math.max(vendor.stats.views, 120);
  const callsBase = Math.max(vendor.stats.calls, 28);
  const waBase = Math.max(vendor.stats.whatsapp, 22);
  const inqBase = Math.max(vendor.stats.enquiries, 14);

  const monthlyChartData = [
    {
      period: 'Apr',
      views: Math.round(viewsBase * 0.11),
      calls: Math.round(callsBase * 0.10),
      whatsapp: Math.round(waBase * 0.10),
      inquiries: Math.round(inqBase * 0.08)
    },
    {
      period: 'May',
      views: Math.round(viewsBase * 0.14),
      calls: Math.round(callsBase * 0.13),
      whatsapp: Math.round(waBase * 0.12),
      inquiries: Math.round(inqBase * 0.12)
    },
    {
      period: 'Jun',
      views: Math.round(viewsBase * 0.16),
      calls: Math.round(callsBase * 0.15),
      whatsapp: Math.round(waBase * 0.15),
      inquiries: Math.round(inqBase * 0.15)
    },
    {
      period: 'Jul',
      views: Math.round(viewsBase * 0.18),
      calls: Math.round(callsBase * 0.19),
      whatsapp: Math.round(waBase * 0.18),
      inquiries: Math.round(inqBase * 0.19)
    },
    {
      period: 'Aug',
      views: Math.round(viewsBase * 0.20),
      calls: Math.round(callsBase * 0.21),
      whatsapp: Math.round(waBase * 0.22),
      inquiries: Math.round(inqBase * 0.22)
    },
    {
      period: 'Sep',
      views: Math.round(viewsBase * 0.21),
      calls: Math.round(callsBase * 0.22),
      whatsapp: Math.round(waBase * 0.23),
      inquiries: Math.round(inqBase * 0.24)
    }
  ];

  const weeklyChartData = [
    { period: 'Mon', views: Math.round(viewsBase * 0.03), calls: Math.round(callsBase * 0.02), whatsapp: Math.round(waBase * 0.02) },
    { period: 'Tue', views: Math.round(viewsBase * 0.04), calls: Math.round(callsBase * 0.03), whatsapp: Math.round(waBase * 0.03) },
    { period: 'Wed', views: Math.round(viewsBase * 0.04), calls: Math.round(callsBase * 0.04), whatsapp: Math.round(waBase * 0.03) },
    { period: 'Thu', views: Math.round(viewsBase * 0.05), calls: Math.round(callsBase * 0.04), whatsapp: Math.round(waBase * 0.04) },
    { period: 'Fri', views: Math.round(viewsBase * 0.06), calls: Math.round(callsBase * 0.05), whatsapp: Math.round(waBase * 0.05) },
    { period: 'Sat', views: Math.round(viewsBase * 0.08), calls: Math.round(callsBase * 0.07), whatsapp: Math.round(waBase * 0.08) },
    { period: 'Sun', views: Math.round(viewsBase * 0.09), calls: Math.round(callsBase * 0.08), whatsapp: Math.round(waBase * 0.09) }
  ];

  const activeChartData = timeRange === '7d' ? weeklyChartData : monthlyChartData;

  const currentSnapsList = vendor.currentSnaps && vendor.currentSnaps.length > 0
    ? vendor.currentSnaps
    : [
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=80'
      ];

  const currentVideo = vendor.liveVideoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-an-electrician-connecting-wires-41584-large.mp4';
  const currentBanner = vendor.bannerUrl || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&auto=format&fit=crop&q=80';

  // Handle snap file upload
  const handleSnapFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64 = event.target.result as string;
          updateVendorMedia(vendor.id, {
            snaps: [base64, ...currentSnapsList]
          });
          setMediaSavedMsg(true);
          setTimeout(() => setMediaSavedMsg(false), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle video file upload
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64 = event.target.result as string;
          updateVendorMedia(vendor.id, {
            videoUrl: base64
          });
          setMediaSavedMsg(true);
          setTimeout(() => setMediaSavedMsg(false), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle banner file upload
  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64 = event.target.result as string;
          updateVendorMedia(vendor.id, {
            bannerUrl: base64
          });
          setMediaSavedMsg(true);
          setTimeout(() => setMediaSavedMsg(false), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSnapUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSnapInput.trim()) return;
    updateVendorMedia(vendor.id, {
      snaps: [newSnapInput.trim(), ...currentSnapsList]
    });
    setNewSnapInput('');
    setMediaSavedMsg(true);
    setTimeout(() => setMediaSavedMsg(false), 3000);
  };

  const handleAddVideoUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoInput.trim()) return;
    updateVendorMedia(vendor.id, {
      videoUrl: newVideoInput.trim()
    });
    setNewVideoInput('');
    setMediaSavedMsg(true);
    setTimeout(() => setMediaSavedMsg(false), 3000);
  };

  const handleUpdateBannerUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerInput.trim()) return;
    updateVendorMedia(vendor.id, {
      bannerUrl: newBannerInput.trim()
    });
    setNewBannerInput('');
    setMediaSavedMsg(true);
    setTimeout(() => setMediaSavedMsg(false), 3000);
  };

  const handleDeleteSnap = (indexToDelete: number) => {
    const updated = currentSnapsList.filter((_, idx) => idx !== indexToDelete);
    updateVendorMedia(vendor.id, {
      snaps: updated
    });
    setMediaSavedMsg(true);
    setTimeout(() => setMediaSavedMsg(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left animate-fade-in">
      {/* Top Banner: Vendor Switcher & Status */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={vendor.logoUrl}
            alt={vendor.businessName}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {vendor.businessName}
              </h2>
              {vendor.verificationStatus === 'verified' ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-md border border-sky-200/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                  <Clock className="w-3 h-3 text-amber-600" />
                  Verification Pending
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Prop. {vendor.ownerName} · {vendor.area}, {vendor.city} · ID: {vendor.id}
            </p>
          </div>
        </div>

        {/* Switch listing selector if multiple */}
        <div className="flex items-center gap-3">
          {vendors.length > 1 && (
            <select
              value={selectedVendorId}
              onChange={(e) => setSelectedVendorId(e.target.value)}
              className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-2 rounded-xl border-0"
            >
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  Listing: {v.businessName} ({v.city})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => setSelectedVendorForProfile(vendor)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Public Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={logoutVendor}
            className="px-3.5 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-950/60 dark:hover:text-rose-300 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Logout of Vendor Hub"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <Eye className="w-4 h-4 text-sky-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Views</span>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
            {vendor.stats.views.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">+14% this month</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <Phone className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Calls</span>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
            {vendor.stats.calls}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Phone clicks</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider">WhatsApp</span>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
            {vendor.stats.whatsapp}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Chats initiated</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <Navigation className="w-4 h-4 text-indigo-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Route</span>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
            {vendor.stats.directions}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Map navigations</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <QrCode className="w-4 h-4 text-sky-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider">QR Scans</span>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
            {vendor.stats.qrScans}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Display QR scans</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <Users className="w-4 h-4 text-violet-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Leads</span>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
            {vendor.stats.enquiries}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Service bookings</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Payouts</span>
          </div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            ₹{vendor.stats.totalEarnings.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Advance & booking sales</div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-slate-900 text-white dark:bg-sky-600'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          Performance Analytics & Trends
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors relative whitespace-nowrap ${
            activeTab === 'leads'
              ? 'bg-slate-900 text-white dark:bg-sky-600'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          Customer Leads & Bookings ({vendorLeads.length})
          {vendorLeads.filter((l) => l.status === 'new').length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 bg-rose-500 text-white text-[10px] rounded-full">
              {vendorLeads.filter((l) => l.status === 'new').length} New
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'media'
              ? 'bg-slate-900 text-white dark:bg-sky-600'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Live Snaps, Video & Banner ({currentSnapsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('qr')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'qr'
              ? 'bg-slate-900 text-white dark:bg-sky-600'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          Unique QR Code Hub
        </button>

        <button
          onClick={() => setActiveTab('business-model')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'business-model'
              ? 'bg-slate-900 text-white dark:bg-sky-600'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Operating Model & Links</span>
        </button>
      </div>

      {/* SUCCESS NOTICE WHEN MEDIA SAVED */}
      {mediaSavedMsg && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-200 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Live media showcase updated! Customers can now see your latest work snaps, full banner, and video clip.</span>
        </div>
      )}

      {/* TAB 1: Performance Analytics with Recharts Bar Chart */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Profile Completion Bar */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Business Profile Strength & Readiness
              </span>
              <span className="text-xs font-extrabold text-sky-600">{completionScore}% Completed</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionScore}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
              <span>✓ Phone & WhatsApp Verified</span>
              <span>✓ Gujarat Locality Mapped</span>
              <span>{vendor.verificationStatus === 'verified' ? '✓ Govt License Approved' : '⏳ License Verification In Progress'}</span>
            </div>
          </div>

          {/* Vendor Analytics Section with Recharts Line Chart */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Real-time Telemetry & Lead Conversion</span>
                </div>
                <h4 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Vendor Analytics</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Track real customer demand across Gujarat: live profile impressions, direct phone dial actions, and WhatsApp chat interactions.
                </p>
              </div>

              {/* Timeframe & Chart Style Toggles */}
              <div className="flex items-center flex-wrap gap-2">
                {/* 6M vs 7D Timeframe */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
                  <button
                    onClick={() => setTimeRange('6m')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      timeRange === '6m'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    6 Months
                  </button>
                  <button
                    onClick={() => setTimeRange('7d')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      timeRange === '7d'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Last 7 Days
                  </button>
                </div>

                {/* Line vs Bar Chart Toggle */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
                  <button
                    onClick={() => setChartType('line')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      chartType === 'line'
                        ? 'bg-sky-600 text-white shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Line Chart</span>
                  </button>
                  <button
                    onClick={() => setChartType('bar')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      chartType === 'bar'
                        ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Bar Chart</span>
                  </button>
                </div>
              </div>
            </div>

            {/* KPI Performance Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Profile Views */}
              <div
                onClick={() => setMetricFilter(metricFilter === 'views' ? 'all' : 'views')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  metricFilter === 'views' || metricFilter === 'all'
                    ? 'bg-sky-50/60 dark:bg-sky-950/20 border-sky-300 dark:border-sky-800/80 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-sky-600 dark:text-sky-400 font-bold mb-1">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" /> Profile Views
                  </span>
                  <span className="text-[10px] bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 px-1.5 py-0.5 rounded font-bold">+24%</span>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                  {vendor.stats.views.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Unique customer impressions
                </div>
              </div>

              {/* Call Clicks */}
              <div
                onClick={() => setMetricFilter(metricFilter === 'calls' ? 'all' : 'calls')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  metricFilter === 'calls' || metricFilter === 'all'
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-bold mb-1">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4" /> Call Clicks
                  </span>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded font-bold">+18%</span>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                  {vendor.stats.calls.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Direct phone dials via tel:
                </div>
              </div>

              {/* WhatsApp Interactions */}
              <div
                onClick={() => setMetricFilter(metricFilter === 'whatsapp' ? 'all' : 'whatsapp')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  metricFilter === 'whatsapp' || metricFilter === 'all'
                    ? 'bg-green-50/60 dark:bg-green-950/20 border-green-300 dark:border-green-800/80 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-green-600 dark:text-green-400 font-bold mb-1">
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4" /> WhatsApp Clicks
                  </span>
                  <span className="text-[10px] bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded font-bold">+31%</span>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                  {vendor.stats.whatsapp.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Direct chat enquiries
                </div>
              </div>

              {/* Total Direct Connects */}
              <div className="p-4 rounded-2xl border bg-slate-50/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 font-bold mb-1">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-indigo-500" /> Direct Connects
                  </span>
                  <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded font-bold">Total</span>
                </div>
                <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
                  {(vendor.stats.calls + vendor.stats.whatsapp).toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Zero-brokerage customer leads
                </div>
              </div>
            </div>

            {/* Metric Filter Tabs */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setMetricFilter('all')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    metricFilter === 'all'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  All Interaction Curves
                </button>
                <button
                  onClick={() => setMetricFilter('views')}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    metricFilter === 'views'
                      ? 'bg-sky-600 text-white shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <span>Profile Views</span>
                </button>
                <button
                  onClick={() => setMetricFilter('calls')}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    metricFilter === 'calls'
                      ? 'bg-emerald-600 text-white shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Call Clicks</span>
                </button>
                <button
                  onClick={() => setMetricFilter('whatsapp')}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    metricFilter === 'whatsapp'
                      ? 'bg-green-600 text-white shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  <span>WhatsApp Clicks</span>
                </button>
              </div>

              <span className="text-xs text-slate-400 font-medium">
                Showing {timeRange === '7d' ? 'Last 7 Days' : 'Last 6 Months'} for {vendor.businessName}
              </span>
            </div>

            {/* Recharts Container: Primary LineChart or BarChart */}
            <div className="h-80 w-full pt-2 min-h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
                  <LineChart
                    data={activeChartData}
                    margin={{ top: 15, right: 20, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                      opacity={0.5}
                    />
                    <XAxis
                      dataKey="period"
                      tickLine={false}
                      axisLine={{ stroke: '#cbd5e1' }}
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '16px',
                        border: 'none',
                        color: '#ffffff',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
                        fontSize: '12px',
                        padding: '10px 14px'
                      }}
                      itemStyle={{ color: '#f8fafc', padding: '2px 0' }}
                      cursor={{ stroke: 'rgba(2, 132, 199, 0.2)', strokeWidth: 1.5 }}
                    />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      wrapperStyle={{ paddingBottom: '16px', fontSize: '12px' }}
                      iconType="circle"
                    />

                    {(metricFilter === 'all' || metricFilter === 'views') && (
                      <Line
                        type="monotone"
                        dataKey="views"
                        name="Profile Views"
                        stroke="#0284c7"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#0284c7', strokeWidth: 2, stroke: '#ffffff' }}
                        activeDot={{ r: 7, stroke: '#38bdf8', strokeWidth: 2 }}
                      />
                    )}

                    {(metricFilter === 'all' || metricFilter === 'calls') && (
                      <Line
                        type="monotone"
                        dataKey="calls"
                        name="Call Clicks"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#ffffff' }}
                        activeDot={{ r: 7, stroke: '#34d399', strokeWidth: 2 }}
                      />
                    )}

                    {(metricFilter === 'all' || metricFilter === 'whatsapp') && (
                      <Line
                        type="monotone"
                        dataKey="whatsapp"
                        name="WhatsApp Interactions"
                        stroke="#25d366"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#25d366', strokeWidth: 2, stroke: '#ffffff' }}
                        activeDot={{ r: 7, stroke: '#4ade80', strokeWidth: 2 }}
                      />
                    )}
                  </LineChart>
                ) : (
                  <BarChart
                    data={activeChartData}
                    margin={{ top: 15, right: 20, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                      opacity={0.5}
                    />
                    <XAxis
                      dataKey="period"
                      tickLine={false}
                      axisLine={{ stroke: '#cbd5e1' }}
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '16px',
                        border: 'none',
                        color: '#ffffff',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
                        fontSize: '12px',
                        padding: '10px 14px'
                      }}
                      itemStyle={{ color: '#f8fafc', padding: '2px 0' }}
                    />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      wrapperStyle={{ paddingBottom: '16px', fontSize: '12px' }}
                      iconType="circle"
                    />

                    {(metricFilter === 'all' || metricFilter === 'views') && (
                      <Bar
                        dataKey="views"
                        name="Profile Views"
                        fill="#0284c7"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={32}
                      />
                    )}

                    {(metricFilter === 'all' || metricFilter === 'calls') && (
                      <Bar
                        dataKey="calls"
                        name="Call Clicks"
                        fill="#10b981"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={32}
                      />
                    )}

                    {(metricFilter === 'all' || metricFilter === 'whatsapp') && (
                      <Bar
                        dataKey="whatsapp"
                        name="WhatsApp Interactions"
                        fill="#25d366"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={32}
                      />
                    )}
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Performance Ratios Footnote */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Direct Phone Call Conversion: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{Math.round((vendor.stats.calls / (vendor.stats.views || 1)) * 100)}%</strong></span>
                <span className="mx-1">·</span>
                <span>WhatsApp Engagement: <strong className="text-green-600 dark:text-green-400 font-bold">{Math.round((vendor.stats.whatsapp / (vendor.stats.views || 1)) * 100)}%</strong></span>
              </span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Total Direct Connections: {(vendor.stats.calls + vendor.stats.whatsapp).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Customer Leads & Bookings */}
      {activeTab === 'leads' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Customer Enquiries & Doorstep Requests
              </h4>
              <p className="text-xs text-slate-500">
                Respond quickly to convert Gujarat customer leads into repeat jobs
              </p>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Total {vendorLeads.length} leads
            </span>
          </div>

          {vendorLeads.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">
              No customer inquiries received yet for this listing.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {vendorLeads.map((lead) => (
                <div key={lead.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {lead.customerName}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          lead.status === 'new'
                            ? 'bg-rose-100 text-rose-700'
                            : lead.status === 'booked'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {lead.status}
                      </span>

                      {/* Email Notification Status Indicator */}
                      {lead.emailNotificationStatus === 'sent' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>Email Dispatched</span>
                        </span>
                      )}
                      {lead.emailNotificationStatus === 'pending' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3 text-amber-500 animate-spin" />
                          <span>Email Queued</span>
                        </span>
                      )}
                      {lead.emailNotificationStatus === 'failed' && (
                        <button
                          onClick={async () => {
                            const res = await retryFailedLeadNotification(lead.id);
                            if (res.success) {
                              alert('Notification resent successfully via Resend API.');
                            } else {
                              alert(`Retry failed: ${res.error || 'Server error'}`);
                            }
                          }}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 px-2 py-0.5 rounded-full hover:bg-rose-100 transition-colors"
                        >
                          <AlertCircle className="w-3 h-3 text-rose-500" />
                          <span>Email Failed · Retry</span>
                        </button>
                      )}
                      {lead.emailNotificationStatus === 'skipped' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>No Email Configured</span>
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      <strong>Service:</strong> {lead.service} · <strong>Area:</strong> {lead.customerArea}
                    </div>

                    <div className="text-xs text-slate-500">
                      "{lead.message}"
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-3 pt-1">
                      <span>Preferred: {lead.preferredDate} ({lead.preferredTime})</span>
                      {lead.advancePaid && (
                        <span className="font-semibold text-emerald-600">
                          Advance Paid: ₹{lead.advancePaid} (Ref: {lead.paymentRef})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`tel:${lead.customerPhone.replace(/\s+/g, '')}`}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 fill-current" />
                      <span>Call Customer</span>
                    </a>

                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                      className="text-xs px-2.5 py-2 bg-slate-100 dark:bg-slate-800 border-0 rounded-xl font-medium text-slate-800 dark:text-slate-200"
                    >
                      <option value="new">Mark: New</option>
                      <option value="contacted">Mark: Contacted</option>
                      <option value="booked">Mark: Booked</option>
                      <option value="completed">Mark: Completed</option>
                      <option value="cancelled">Mark: Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MEDIA & LIVE SHOWCASE MANAGEMENT */}
      {activeTab === 'media' && (
        <div className="space-y-6">
          {/* Header Info */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-sky-600" />
                <span>Live Business Media & Work Showcase</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your full banner, current live business snaps, and short on-site video clips to build customer trust.
              </p>
            </div>

            <button
              onClick={() => setSelectedVendorForProfile(vendor)}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all self-start sm:self-auto shrink-0"
            >
              <span>View Customer Showcase</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 1. FULL HEADER BANNER MANAGEMENT */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>1. Full Business Header Banner</span>
                </h5>
                <p className="text-xs text-slate-500 mt-0.5">
                  This panoramic banner is shown at the top of your official profile card.
                </p>
              </div>
              <span className="text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg">
                Wide 16:9 Banner
              </span>
            </div>

            {/* Banner Preview */}
            <div className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800">
              <img
                src={currentBanner}
                alt="Current Header Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-xl text-white text-xs font-bold flex items-center gap-2">
                <span>Active Banner</span>
              </div>
            </div>

            {/* Banner Upload Form */}
            <form onSubmit={handleUpdateBannerUrl} className="flex flex-col sm:flex-row gap-2 pt-1">
              <label className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shrink-0">
                <Upload className="w-4 h-4" />
                <span>Upload Banner File</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerFileUpload}
                />
              </label>

              <input
                type="url"
                placeholder="Or paste banner image URL (e.g. https://...)"
                value={newBannerInput}
                onChange={(e) => setNewBannerInput(e.target.value)}
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />

              <button
                type="submit"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shrink-0"
              >
                Save Banner
              </button>
            </form>
          </div>

          {/* 2. VERY SHORT VIDEO OF LIVE BUSINESS */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Film className="w-4 h-4 text-red-500" />
                  <span>2. Very Short Video of Live Business</span>
                </h5>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customers love seeing 5-30 second live clips of your team performing active service work.
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase bg-red-600 text-white px-2 py-0.5 rounded-md">
                Live Video Clip
              </span>
            </div>

            {/* Video Player Preview */}
            <div className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden bg-black aspect-video border border-slate-200 dark:border-slate-800">
              <video
                ref={dashboardVideoRef}
                src={currentVideo}
                className="w-full h-full object-cover"
                loop
                muted={isVideoMuted}
                playsInline
                poster={currentSnapsList[0]}
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
              />

              {/* Video Overlay Controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-3 pointer-events-none">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase bg-red-600 text-white px-2 py-0.5 rounded">
                    Active Clip
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsVideoMuted(!isVideoMuted)}
                    className="pointer-events-auto p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
                  >
                    {isVideoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between pointer-events-auto">
                  <button
                    type="button"
                    onClick={() => {
                      if (dashboardVideoRef.current) {
                        if (dashboardVideoRef.current.paused) {
                          dashboardVideoRef.current.play();
                          setIsVideoPlaying(true);
                        } else {
                          dashboardVideoRef.current.pause();
                          setIsVideoPlaying(false);
                        }
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95"
                  >
                    {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isVideoPlaying ? 'Pause Live Clip' : 'Play Live Clip'}</span>
                  </button>

                  <span className="text-white text-xs">
                    {vendor.businessName} Live Demo
                  </span>
                </div>
              </div>
            </div>

            {/* Video Upload Form */}
            <form onSubmit={handleAddVideoUrl} className="flex flex-col sm:flex-row gap-2 pt-1">
              <label className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shrink-0">
                <Upload className="w-4 h-4" />
                <span>Upload Video Clip</span>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoFileUpload}
                />
              </label>

              <input
                type="url"
                placeholder="Or paste video URL (.mp4 / WebM)"
                value={newVideoInput}
                onChange={(e) => setNewVideoInput(e.target.value)}
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />

              <button
                type="submit"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shrink-0"
              >
                Save Video
              </button>
            </form>
          </div>

          {/* 3. CURRENT BUSINESS SNAPS GALLERY */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-sky-600" />
                  <span>3. Current Business Snaps ({currentSnapsList.length})</span>
                </h5>
                <p className="text-xs text-slate-500 mt-0.5">
                  Snapshots of your shop, tools, service vans, and technicians actively on site.
                </p>
              </div>
            </div>

            {/* Add New Snap Form */}
            <form onSubmit={handleAddSnapUrl} className="flex flex-col sm:flex-row gap-2">
              <label className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shrink-0">
                <Upload className="w-4 h-4" />
                <span>Upload Snap Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleSnapFileUpload}
                />
              </label>

              <input
                type="url"
                placeholder="Or paste snap image URL..."
                value={newSnapInput}
                onChange={(e) => setNewSnapInput(e.target.value)}
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />

              <button
                type="submit"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shrink-0"
              >
                Add Snap
              </button>
            </form>

            {/* Current Snaps Grid with Delete */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
              {currentSnapsList.map((snap, idx) => (
                <div
                  key={idx}
                  className="relative group aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <img
                    src={snap}
                    alt={`Snap ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    #{idx + 1}
                  </div>
                  
                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteSnap(idx)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white shadow-md opacity-90 group-hover:opacity-100 transition-opacity"
                    title="Remove snap"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: QR Code Hub */}
      {activeTab === 'qr' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Official Business QR Code Hub
              </h4>
              <p className="text-xs text-slate-500">
                Print for shop counter display, invoices, and technician visiting cards.
              </p>
            </div>

            <button
              onClick={() => setSelectedVendorForQR(vendor)}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors shrink-0"
            >
              <QrCode className="w-4 h-4" />
              <span>Open High-Res QR Dialog</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h5 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                Shop Counter Display Card
              </h5>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pre-formatted A5 display card with "Scan to view prices, review & call". Ready to print on any desk printer.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h5 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                Permanent QR Token
              </h5>
              <p className="text-xs text-slate-500 leading-relaxed font-mono">
                {vendor.qrToken}
              </p>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
                ✓ Never expires even if you change phone/rates.
              </span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h5 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                Instant Customer Scan
              </h5>
              <p className="text-xs text-slate-500 leading-relaxed">
                Customers scan with Google Lens, Paytm, WhatsApp or default iPhone/Android camera to directly view and call.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Business Operating Model, Online Channels & Address Configuration */}
      {activeTab === 'business-model' && (
        <form onSubmit={handleSaveProfileSettings} className="space-y-6">
          {/* Header Card */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-sky-600" />
                  <span>Business Operating Model & Digital Channels</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure whether you operate as a Physical premise, Online digital service, or Hybrid business. Manage website links, service regions, and public location visibility.
                </p>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 self-start sm:self-auto shrink-0"
              >
                <Check className="w-4 h-4" />
                <span>Save Operating Changes</span>
              </button>
            </div>

            {/* Error / Success Feedback */}
            {profileSavedMsg && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-200 animate-fade-in">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{profileSavedMsg}</span>
              </div>
            )}
            {profileErrorMsg && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-center gap-2 text-xs font-bold text-rose-800 dark:text-rose-200 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{profileErrorMsg}</span>
              </div>
            )}

            {/* Operating Model Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider">
                Select Business Operating Model *
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Physical Business */}
                <div
                  onClick={() => setProfileBusinessType('physical')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    profileBusinessType === 'physical'
                      ? 'bg-sky-50/80 dark:bg-sky-950/40 border-sky-600 shadow-xs'
                      : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-xl ${
                        profileBusinessType === 'physical'
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        <Building2 className="w-4 h-4" />
                      </div>
                      {profileBusinessType === 'physical' && <CheckCircle2 className="w-4 h-4 text-sky-600" />}
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      Physical Business
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Shop, restaurant, mall, clinic, salon or workshop that customers can visit in person.
                    </p>
                  </div>
                  <div className="mt-3 text-[10px] font-semibold text-sky-700 dark:text-sky-300 bg-sky-100/70 dark:bg-sky-900/40 px-2 py-1 rounded-md">
                    Street address required · Public visibility configurable
                  </div>
                </div>

                {/* Online Business */}
                <div
                  onClick={() => setProfileBusinessType('online')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    profileBusinessType === 'online'
                      ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-600 shadow-xs'
                      : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-xl ${
                        profileBusinessType === 'online'
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        <Globe className="w-4 h-4" />
                      </div>
                      {profileBusinessType === 'online' && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      Online Business
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      E-commerce store, website/app developer, AI SaaS, digital agency or remote consultant.
                    </p>
                  </div>
                  <div className="mt-3 text-[10px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-100/70 dark:bg-purple-900/40 px-2 py-1 rounded-md">
                    No physical address required · Map hidden · QR code active
                  </div>
                </div>

                {/* Hybrid Business */}
                <div
                  onClick={() => setProfileBusinessType('hybrid')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    profileBusinessType === 'hybrid'
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-600 shadow-xs'
                      : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-xl ${
                        profileBusinessType === 'hybrid'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        <Store className="w-4 h-4" />
                      </div>
                      {profileBusinessType === 'hybrid' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      Hybrid Business
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Retailers with in-store & shipping, restaurants with dine-in & delivery, or on-site & remote work.
                    </p>
                  </div>
                  <div className="mt-3 text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-100/70 dark:bg-indigo-900/40 px-2 py-1 rounded-md">
                    Physical location + online store/app configured independently
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Channel for Online / Hybrid */}
            {profileBusinessType !== 'physical' && (
              <div className="pt-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Primary Customer Action Channel *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'website', label: 'Business Website', icon: Globe },
                    { id: 'whatsapp', label: 'WhatsApp Biz', icon: MessageCircle },
                    { id: 'email', label: 'Business Email', icon: Mail },
                    { id: 'app', label: 'App / Platform', icon: Smartphone }
                  ].map((ch) => {
                    const Icon = ch.icon;
                    return (
                      <button
                        type="button"
                        key={ch.id}
                        onClick={() => setProfilePrimaryChannel(ch.id as any)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                          profilePrimaryChannel === ch.id
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{ch.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Online Channels & Digital Destinations */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-600" />
              <span>Digital Destinations & Contact Routes</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Business Website / Online Store URL
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={profileWebsiteUrl}
                    onChange={(e) => setProfileWebsiteUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                  />
                  {profileWebsiteUrl && (
                    <a
                      href={profileWebsiteUrl.startsWith('http') ? profileWebsiteUrl : `https://${profileWebsiteUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-sky-600"
                      title="Test link (opens safely in new tab)"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  e.g., Shopify store, company website, digital portfolio.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Mobile App / Platform URL (Optional)
                </label>
                <input
                  type="text"
                  value={profileAppStoreUrl}
                  onChange={(e) => setProfileAppStoreUrl(e.target.value)}
                  placeholder="https://play.google.com/store/apps/details?id=..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Link to Google Play, iOS App Store, or web app portal.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Business Email
                </label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  placeholder="contact@mycompany.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  For customer enquiries and transactional lead notifications.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  WhatsApp Business Number
                </label>
                <input
                  type="tel"
                  value={profileWhatsapp}
                  onChange={(e) => setProfileWhatsapp(e.target.value)}
                  placeholder="9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  10-digit number for 1-click WhatsApp customer chat.
                </span>
              </div>
            </div>

            {/* Service Delivery Regions */}
            <div className="pt-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Customer Service & Delivery Regions (Comma separated)
              </label>
              <input
                type="text"
                value={profileServiceRegions}
                onChange={(e) => setProfileServiceRegions(e.target.value)}
                placeholder="Ahmedabad, Surat, Vadodara, All Gujarat, Pan-India"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Specifies where your customers are located. A Gujarat-based company can serve Pan-India or specific cities without needing a physical office in each.
              </span>
            </div>
          </div>

          {/* Location Configuration & Privacy */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-600" />
              <span>Location Settings & Visibility</span>
            </h4>

            {profileBusinessType === 'online' ? (
              <div className="p-4 bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-900 dark:text-purple-200">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span>Online Business Mode Active — No Physical Address Required</span>
                </div>
                <p className="text-xs text-purple-800/80 dark:text-purple-300 leading-relaxed">
                  Your business base is registered in <span className="font-bold">{vendor.city}, Gujarat</span>. Street addresses and map coordinates are safely omitted. Map pins and directions buttons are hidden on your public profile, while your website link, WhatsApp, enquiry form, and permanent QR code are fully functional.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Street Address {profileBusinessType === 'physical' && '*'}
                    </label>
                    <input
                      type="text"
                      value={profileAddress}
                      onChange={(e) => setProfileAddress(e.target.value)}
                      placeholder="Shop 104, Galaxy Commercial Complex"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Area / Neighborhood
                    </label>
                    <input
                      type="text"
                      value={profileArea}
                      onChange={(e) => setProfileArea(e.target.value)}
                      placeholder="Satellite / Alkapuri / Nanpura"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Gujarat City
                    </label>
                    <input
                      type="text"
                      value={profileCity}
                      onChange={(e) => setProfileCity(e.target.value)}
                      placeholder="Ahmedabad"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={profilePincode}
                      onChange={(e) => setProfilePincode(e.target.value)}
                      placeholder="380015"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                    />
                  </div>
                </div>

                {/* Public Address Visibility Toggle */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="togglePublicAddress"
                    checked={profileShowPublicAddress}
                    onChange={(e) => setProfileShowPublicAddress(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300 cursor-pointer"
                  />
                  <label htmlFor="togglePublicAddress" className="flex-1 cursor-pointer">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Display full street address on public profile & interactive map
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                      When unchecked, your exact address is kept private in VBV verification records and customers only see your City & Area.
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Trust & Security Multi-Tier Verification Status */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verification & Trust Standards</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Contact details, business identity, and physical location are verified separately by the VBV Trust team.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Phone & Contact Verification */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                  1. Contact Ownership
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Phone Verified</span>
                </div>
                {vendor.email && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-sky-500" />
                    <span>Email on file: {vendor.email}</span>
                  </div>
                )}
              </div>

              {/* Business Identity */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                  2. Business Identity
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-bold ${
                  vendor.isIdentityVerified || vendor.isDocsVerified
                    ? 'text-violet-600 dark:text-violet-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{vendor.isIdentityVerified || vendor.isDocsVerified ? 'ID / GST Verified' : 'Under Review'}</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Official Trade / GST check
                </div>
              </div>

              {/* Physical Location */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                  3. Premises Verification
                </div>
                {profileBusinessType === 'online' ? (
                  <div>
                    <div className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                      <Globe className="w-4 h-4" />
                      <span>Not Applicable</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Online-only business model
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className={`flex items-center gap-1.5 text-xs font-bold ${
                      vendor.isLocationVerified
                        ? 'text-sky-600 dark:text-sky-400'
                        : 'text-slate-500'
                    }`}>
                      <MapPin className="w-4 h-4" />
                      <span>{vendor.isLocationVerified ? 'Premises Verified' : 'Unverified Address'}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Physical visit or geocoding
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-[11px] text-slate-500 leading-relaxed">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Security Rule:</span> A "Verified Business" badge is not awarded merely because an email is confirmed or website exists. Distinct badges for Contact, Identity, and Location prevent misleading claims in the directory.
            </div>
          </div>

          {/* Bottom Save Bar */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Changes reflect immediately on your public profile and customer search.
            </span>
            <button
              type="submit"
              className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save Operating Changes</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
