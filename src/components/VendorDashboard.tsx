import React, { useState, useRef } from 'react';
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
  RefreshCw
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
    updateVendorMedia
  } = useApp();

  const [selectedVendorId, setSelectedVendorId] = useState<string>(
    vendors[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'analytics' | 'leads' | 'media' | 'qr'>('analytics');
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
    </div>
  );
};
