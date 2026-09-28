import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Sparkles,
  MapPin,
  Layers,
  Star,
  Users,
  Building2,
  Plus,
  Trash2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Search,
  Filter,
  Tag,
  Phone,
  Image as ImageIcon,
  Video,
  FileText,
  DollarSign,
  Briefcase,
  Zap,
  Wrench,
  AirVent,
  Hammer,
  Tv,
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
  Check,
  ChevronDown,
  ChevronRight,
  Store,
  Eye,
  X,
  Database,
  Server,
  Code2,
  Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { City, Category, Vendor } from '../types';

const AVAILABLE_ICONS = [
  { name: 'Scissors', label: 'Hair Salon / Saloon', icon: Scissors },
  { name: 'Sparkles', label: 'Beauty Parlour', icon: Sparkles },
  { name: 'Coffee', label: 'Tea Stall / Chai Kitli', icon: Coffee },
  { name: 'Leaf', label: 'Pan Parlour & Mukhwas', icon: Leaf },
  { name: 'Stethoscope', label: 'Doctor Clinic', icon: Stethoscope },
  { name: 'Pill', label: 'Medical Store / Pharmacy', icon: Pill },
  { name: 'HeartPulse', label: 'Hospital & Emergency', icon: HeartPulse },
  { name: 'GraduationCap', label: 'College & Degrees', icon: GraduationCap },
  { name: 'School', label: 'School (CBSE & GSEB)', icon: School },
  { name: 'Smile', label: 'Kindergarten & Pre-School', icon: Smile },
  { name: 'Baby', label: 'Playgroup & Daycare', icon: Baby },
  { name: 'Cake', label: 'Bakery & Sweets', icon: Cake },
  { name: 'Activity', label: 'Pathology Lab', icon: Activity },
  { name: 'Sun', label: 'Solar Energy', icon: Sun },
  { name: 'UtensilsCrossed', label: 'Catering / Farsan', icon: UtensilsCrossed },
  { name: 'Gem', label: 'Jewelry / Diamond', icon: Gem },
  { name: 'Shirt', label: 'Textiles & Loom', icon: Shirt },
  { name: 'Briefcase', label: 'CA & Legal', icon: Briefcase },
  { name: 'Music', label: 'Events & Garba', icon: Music },
  { name: 'Home', label: 'Interiors & Kitchen', icon: Home },
  { name: 'Zap', label: 'Electrical', icon: Zap },
  { name: 'Wrench', label: 'Plumbing', icon: Wrench },
  { name: 'AirVent', label: 'AC & Cooling', icon: AirVent },
  { name: 'Hammer', label: 'Carpenter', icon: Hammer },
  { name: 'Tv', label: 'Appliances', icon: Tv },
  { name: 'Paintbrush', label: 'Painting', icon: Paintbrush },
  { name: 'Droplets', label: 'RO Water', icon: Droplets },
  { name: 'ShieldCheck', label: 'CCTV Security', icon: ShieldCheck },
  { name: 'Car', label: 'Auto Mechanic', icon: Car },
  { name: 'Truck', label: 'Packers & Movers', icon: Truck }
];

const iconComponentMap: Record<string, React.FC<{ className?: string }>> = {
  Scissors,
  Sparkles,
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
  Sun,
  UtensilsCrossed,
  Gem,
  Shirt,
  Briefcase,
  Music,
  Home,
  Zap,
  Wrench,
  AirVent,
  Hammer,
  Tv,
  Paintbrush,
  Droplets,
  ShieldCheck,
  Car,
  Truck
};

export const AdminDashboard: React.FC = () => {
  const {
    vendors,
    adminCreateVendor,
    deleteVendor,
    updateVendorStatus,
    toggleVendorVerificationBadge,
    toggleVendorFeatured,
    cities,
    addCity,
    addAreaToCity,
    categories,
    addCategory,
    deleteCategory,
    addSubcategory,
    deleteSubcategory,
    addServiceToSubcategory,
    removeServiceFromSubcategory,
    reviews,
    approveReview,
    deleteReview,
    reports,
    resolveReport,
    setSelectedVendorForProfile
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'vendors' | 'categories' | 'locations' | 'reviews' | 'reports' | 'architecture'>('vendors');

  // Vendor Table Filtering & Search
  const [vendorSearchQuery, setVendorSearchQuery] = useState('');
  const [vendorFilterCat, setVendorFilterCat] = useState('');
  const [vendorFilterCity, setVendorFilterCity] = useState('');

  // Vendor Creation Form State
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [vBusinessName, setVBusinessName] = useState('');
  const [vOwnerName, setVOwnerName] = useState('');
  const [vPhone, setVPhone] = useState('+91 ');
  const [vWhatsapp, setVWhatsapp] = useState('91');
  const [vEmail, setVEmail] = useState('');
  const [vCategoryId, setVCategoryId] = useState(categories[0]?.id || 'solar_energy');
  const [vSubcategoryId, setVSubcategoryId] = useState('');
  const [vServicesInput, setVServicesInput] = useState('');
  const [vCity, setVCity] = useState('Ahmedabad');
  const [vArea, setVArea] = useState('Satellite');
  const [vAddress, setVAddress] = useState('');
  const [vPincode, setVPincode] = useState('380015');
  const [vExperienceYears, setVExperienceYears] = useState(8);
  const [vStartingPrice, setVStartingPrice] = useState(399);
  const [vVerificationStatus, setVVerificationStatus] = useState<Vendor['verificationStatus']>('verified');
  const [vIsFeatured, setVIsFeatured] = useState(true);
  const [vLogoUrl, setVLogoUrl] = useState('https://images.unsplash.com/photo-1509391365360-2e959784a276?w=200&auto=format&fit=crop&q=80');
  const [vBannerUrl, setVBannerUrl] = useState('https://images.unsplash.com/photo-1508873696983-2df570464753?w=1200&auto=format&fit=crop&q=80');
  const [vVideoUrl, setVVideoUrl] = useState('https://assets.mixkit.co/videos/preview/mixkit-hands-of-an-electrician-connecting-wires-41584-large.mp4');
  const [vDescription, setVDescription] = useState('');

  // Form states for adding city/area
  const [newCityName, setNewCityName] = useState('');
  const [newCityGujarati, setNewCityGujarati] = useState('');
  const [selectedCityForArea, setSelectedCityForArea] = useState(cities[0]?.id || 'ahmedabad');
  const [newAreaName, setNewAreaName] = useState('');

  // Form states for adding category
  const [newCatName, setNewCatName] = useState('');
  const [newCatGujarati, setNewCatGujarati] = useState('');
  const [newCatHindi, setNewCatHindi] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Sun');
  const [newCatPopular, setNewCatPopular] = useState(true);

  // Form states for adding subcategory & services
  const [selectedCatForSub, setSelectedCatForSub] = useState(categories[0]?.id || 'solar_energy');
  const [newSubName, setNewSubName] = useState('');
  const [newSubServices, setNewSubServices] = useState('');

  // Inline service addition in category list
  const [activeInlineSub, setActiveInlineSub] = useState<{ catId: string; subId: string } | null>(null);
  const [inlineServiceName, setInlineServiceName] = useState('');

  // Admin KPIs
  const totalVendors = vendors.length;
  const verifiedCount = vendors.filter((v) => v.verificationStatus === 'verified').length;
  const pendingCount = vendors.filter((v) => v.verificationStatus === 'pending').length;
  const totalCategoriesCount = categories.length;
  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;

  // Selected category for vendor form subcategory dropdown
  const selectedCatObj = categories.find((c) => c.id === vCategoryId) || categories[0];
  const availableSubcategories = selectedCatObj?.subcategories || [];

  // Update subcategory and default services when category changes
  const handleVendorCategoryChange = (catId: string) => {
    setVCategoryId(catId);
    const cat = categories.find((c) => c.id === catId);
    if (cat && cat.subcategories.length > 0) {
      setVSubcategoryId(cat.subcategories[0].id);
      setVServicesInput(cat.subcategories[0].services.join(', '));
    } else {
      setVSubcategoryId('');
      setVServicesInput('');
    }
  };

  const handleVendorSubcategoryChange = (subId: string) => {
    setVSubcategoryId(subId);
    const sub = selectedCatObj?.subcategories.find((s) => s.id === subId);
    if (sub) {
      setVServicesInput(sub.services.join(', '));
    }
  };

  const handleCityChange = (cityName: string) => {
    setVCity(cityName);
    const cObj = cities.find((c) => c.name.toLowerCase() === cityName.toLowerCase());
    if (cObj && cObj.areas.length > 0) {
      setVArea(cObj.areas[0]);
    }
  };

  // Vendor Form Submit
  const handleAdminCreateVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vBusinessName.trim() || !vPhone.trim()) {
      alert('Business Name and Phone number are required.');
      return;
    }

    const servicesArr = vServicesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const cObj = cities.find((c) => c.name.toLowerCase() === vCity.toLowerCase()) || cities[0];

    const result = adminCreateVendor({
      businessName: vBusinessName.trim(),
      ownerName: vOwnerName.trim() || 'Business Manager',
      phone: vPhone.trim(),
      whatsapp: vWhatsapp.replace(/\D/g, '') || vPhone.replace(/\D/g, ''),
      email: vEmail.trim() || undefined,
      categoryId: vCategoryId,
      subcategoryId: vSubcategoryId || availableSubcategories[0]?.id || 'general',
      services: servicesArr.length > 0 ? servicesArr : ['Doorstep Service', 'Inspection'],
      state: 'Gujarat',
      city: vCity,
      area: vArea,
      address: vAddress.trim() || `${vArea}, ${vCity}`,
      pincode: vPincode.trim(),
      lat: cObj.lat + (Math.random() - 0.5) * 0.04,
      lng: cObj.lng + (Math.random() - 0.5) * 0.04,
      description:
        vDescription.trim() ||
        `Verified professional service provider serving ${vArea}, ${vCity} and surrounding Gujarat areas. Guaranteed transparent pricing and skilled work.`,
      experienceYears: Number(vExperienceYears) || 5,
      startingPrice: Number(vStartingPrice) || 299,
      verificationStatus: vVerificationStatus,
      isPhoneVerified: true,
      isLocationVerified: true,
      isDocsVerified: vVerificationStatus === 'verified',
      isFeatured: vIsFeatured,
      businessHours: {
        days: 'Mon - Sun',
        openTime: '08:30',
        closeTime: '21:00',
        isOpenToday: true
      },
      serviceAtCustomerLocation: true,
      logoUrl: vLogoUrl.trim(),
      bannerUrl: vBannerUrl.trim() || undefined,
      photos: [vLogoUrl.trim(), vBannerUrl.trim()].filter(Boolean),
      currentSnaps: [vBannerUrl.trim(), vLogoUrl.trim()].filter(Boolean),
      liveVideoUrl: vVideoUrl.trim() || undefined
    });

    if (result.success) {
      alert(`Success! Local vendor "${vBusinessName}" created with ID ${result.vendorId}.`);
      setShowAddVendorModal(false);
      // Reset form
      setVBusinessName('');
      setVOwnerName('');
      setVPhone('+91 ');
      setVDescription('');
    } else {
      alert(`Error creating vendor: ${result.error}`);
    }
  };

  const handleAddCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName.trim()) return;
    const newCity: City = {
      id: newCityName.toLowerCase().replace(/\s+/g, '_'),
      name: newCityName.trim(),
      gujaratiName: newCityGujarati.trim() || newCityName.trim(),
      hindiName: newCityName.trim(),
      lat: 22.5 + Math.random(),
      lng: 71.5 + Math.random(),
      areas: ['Main City Center', 'Station Road', 'Market Yard']
    };
    addCity(newCity);
    setNewCityName('');
    setNewCityGujarati('');
    alert(`City ${newCity.name} added to Gujarat directory!`);
  };

  const handleAddArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAreaName.trim()) return;
    addAreaToCity(selectedCityForArea, newAreaName.trim());
    setNewAreaName('');
    alert(`Area "${newAreaName}" added!`);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const catId = newCatName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const newCat: Category = {
      id: catId,
      name: newCatName.trim(),
      gujaratiName: newCatGujarati.trim() || newCatName.trim(),
      hindiName: newCatHindi.trim() || newCatName.trim(),
      iconName: newCatIcon,
      popular: newCatPopular,
      subcategories: [
        {
          id: `${catId}_general`,
          name: 'General Service',
          services: ['Inspection', 'General Repair', 'Doorstep Maintenance']
        }
      ]
    };
    addCategory(newCat);
    setNewCatName('');
    setNewCatGujarati('');
    setNewCatHindi('');
    alert(`Category "${newCat.name}" created with default services!`);
  };

  const handleAddSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;
    const services = newSubServices.split(',').map((s) => s.trim()).filter(Boolean);
    addSubcategory(selectedCatForSub, {
      id: newSubName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      name: newSubName.trim(),
      services: services.length > 0 ? services : ['Standard Service']
    });
    setNewSubName('');
    setNewSubServices('');
    alert(`Subcategory "${newSubName}" added!`);
  };

  const handleAddInlineService = (catId: string, subId: string) => {
    if (!inlineServiceName.trim()) return;
    addServiceToSubcategory(catId, subId, inlineServiceName.trim());
    setInlineServiceName('');
    setActiveInlineSub(null);
  };

  // Filtered Vendors for Admin Table
  const filteredAdminVendors = vendors.filter((v) => {
    const matchesQuery =
      !vendorSearchQuery ||
      v.businessName.toLowerCase().includes(vendorSearchQuery.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(vendorSearchQuery.toLowerCase()) ||
      v.phone.includes(vendorSearchQuery) ||
      v.area.toLowerCase().includes(vendorSearchQuery.toLowerCase());

    const matchesCat = !vendorFilterCat || v.categoryId === vendorFilterCat;
    const matchesCity = !vendorFilterCity || v.city.toLowerCase() === vendorFilterCity.toLowerCase();

    return matchesQuery && matchesCat && matchesCity;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left animate-fade-in">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs uppercase tracking-wider font-bold text-sky-400">
              CodeTech Administration Console
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mt-1">
            Vox Business Vault Master Controller
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Administer Gujarat listings, category taxonomy, city coverage & fraud moderation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              handleVendorCategoryChange(categories[0]?.id || 'solar_energy');
              setShowAddVendorModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold shadow flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Local Vendor</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Vendors</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
            {totalVendors}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="text-[10px] uppercase font-bold text-emerald-600">Verified Vendors</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1 tabular-nums">
            {verifiedCount}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="text-[10px] uppercase font-bold text-sky-600">Categories</div>
          <div className="text-2xl font-bold text-sky-600 mt-1 tabular-nums">
            {totalCategoriesCount}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="text-[10px] uppercase font-bold text-indigo-600">Gujarat Cities</div>
          <div className="text-2xl font-bold text-indigo-600 mt-1 tabular-nums">
            {cities.length}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="text-[10px] uppercase font-bold text-amber-500">Pending Review</div>
          <div className="text-2xl font-bold text-amber-500 mt-1 tabular-nums">
            {pendingCount}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveAdminTab('vendors')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeAdminTab === 'vendors'
              ? 'bg-slate-900 text-white dark:bg-sky-600'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Vendor Management ({vendors.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('categories')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeAdminTab === 'categories'
              ? 'bg-slate-900 text-white dark:bg-sky-600'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Categories & Services Studio ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('locations')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeAdminTab === 'locations'
              ? 'bg-slate-900 text-white dark:bg-sky-600'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Gujarat Locations ({cities.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('reviews')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeAdminTab === 'reviews'
              ? 'bg-slate-900 text-white dark:bg-sky-600'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          <span>Reviews ({reviews.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeAdminTab === 'reports'
              ? 'bg-slate-900 text-white dark:bg-sky-600'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Reports ({reports.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('architecture')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeAdminTab === 'architecture'
              ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Production Architecture & RLS</span>
        </button>
      </div>

      {/* TAB 1: Vendors Directory & Creation */}
      {activeAdminTab === 'vendors' && (
        <div className="space-y-6">
          {/* Controls Bar: Search, Category Filter, City Filter, Add Vendor CTA */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by vendor, owner, area..."
                  value={vendorSearchQuery}
                  onChange={(e) => setVendorSearchQuery(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <select
                value={vendorFilterCat}
                onChange={(e) => setVendorFilterCat(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="">All Categories ({categories.length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={vendorFilterCity}
                onChange={(e) => setVendorFilterCity(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="">All Cities ({cities.length})</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                handleVendorCategoryChange(categories[0]?.id || 'solar_energy');
                setShowAddVendorModal(true);
              }}
              className="w-full md:w-auto px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Local Vendor</span>
            </button>
          </div>

          {/* Vendors Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-white">
                Showing {filteredAdminVendors.length} of {vendors.length} Registered Gujarat Vendors
              </span>
              <span className="text-[11px] text-slate-400">
                Click badges to toggle Verification or Featured status
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5">Business & Contact</th>
                    <th className="p-3.5">Category & Services</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5">Verification</th>
                    <th className="p-3.5">Featured</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredAdminVendors.map((v) => {
                    const catObj = categories.find((c) => c.id === v.categoryId);
                    const IconC = catObj ? iconComponentMap[catObj.iconName] || Wrench : Wrench;

                    return (
                      <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            {v.logoUrl ? (
                              <img
                                src={v.logoUrl}
                                alt={v.businessName}
                                className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500">
                                {v.businessName.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <span>{v.businessName}</span>
                                {v.startingPrice && (
                                  <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 dark:bg-emerald-950/60 px-1 rounded">
                                    ₹{v.startingPrice}+
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {v.ownerName} · {v.phone}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                            <IconC className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                            <span>{catObj?.name || v.categoryId}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
                            {v.services.slice(0, 3).join(', ')}
                            {v.services.length > 3 && ` +${v.services.length - 3}`}
                          </div>
                        </td>

                        <td className="p-3.5 text-slate-600 dark:text-slate-300">
                          <div className="font-medium text-slate-900 dark:text-white">{v.city}</div>
                          <div className="text-[11px] text-slate-400">{v.area}</div>
                        </td>

                        <td className="p-3.5">
                          <button
                            onClick={() => toggleVendorVerificationBadge(v.id)}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors ${
                              v.verificationStatus === 'verified'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                            }`}
                            title="Toggle Verified Business badge"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{v.verificationStatus === 'verified' ? 'Verified' : 'Pending'}</span>
                          </button>
                        </td>

                        <td className="p-3.5">
                          <button
                            onClick={() => toggleVendorFeatured(v.id)}
                            className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                              v.isFeatured
                                ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/50'
                                : 'text-slate-400 hover:text-amber-500'
                            }`}
                            title="Toggle Homepage Featured placement"
                          >
                            <Sparkles className="w-3.5 h-3.5 fill-current" />
                            <span>{v.isFeatured ? 'Featured' : 'Regular'}</span>
                          </button>
                        </td>

                        <td className="p-3.5 text-right space-x-1">
                          <button
                            onClick={() => setSelectedVendorForProfile(v)}
                            className="p-1.5 text-slate-500 hover:text-sky-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Preview Full Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to permanently delete "${v.businessName}"?`)) {
                                deleteVendor(v.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            title="Delete Vendor"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Categories & Services Studio */}
      {activeAdminTab === 'categories' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create Category Form */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-sky-600" />
                  <span>Create New Service Category</span>
                </h4>
                <span className="text-[11px] text-slate-400">Total: {categories.length}</span>
              </div>

              <form onSubmit={handleAddCategory} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      English Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CCTV & Security"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Gujarati Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. સીસીટીવી કેમેરા"
                      value={newCatGujarati}
                      onChange={(e) => setNewCatGujarati(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Hindi Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. सीसीटीवी सुरक्षा"
                    value={newCatHindi}
                    onChange={(e) => setNewCatHindi(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Icon Grid Selector */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">
                    Select Lucide Icon ({newCatIcon})
                  </label>
                  <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5 max-h-36 overflow-y-auto p-1.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                    {AVAILABLE_ICONS.map(({ name, label, icon: IconC }) => (
                      <button
                        type="button"
                        key={name}
                        onClick={() => setNewCatIcon(name)}
                        className={`p-2 rounded-lg flex flex-col items-center justify-center transition-all ${
                          newCatIcon === name
                            ? 'bg-sky-600 text-white shadow-xs scale-105'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                        title={label}
                      >
                        <IconC className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="catPopular"
                    checked={newCatPopular}
                    onChange={(e) => setNewCatPopular(e.target.checked)}
                    className="rounded text-sky-600 focus:ring-sky-500"
                  />
                  <label htmlFor="catPopular" className="text-xs text-slate-700 dark:text-slate-300">
                    Show as Popular Category on Home
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Category</span>
                </button>
              </form>
            </div>

            {/* Add Subcategory & Services Form */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-indigo-600" />
                  <span>Add Subcategory & Services</span>
                </h4>
              </div>

              <form onSubmit={handleAddSubcategory} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Parent Category *
                  </label>
                  <select
                    value={selectedCatForSub}
                    onChange={(e) => setSelectedCatForSub(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.subcategories.length} subcategories)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Subcategory Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Inverter Repair & Battery Check"
                    value={newSubName}
                    onChange={(e) => setNewSubName(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Services (Comma-separated) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Battery Acid Check, Relay Fix, Pure Sine Wave Inverter Setup"
                    value={newSubServices}
                    onChange={(e) => setNewSubServices(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Attach Subcategory & Services</span>
                </button>
              </form>
            </div>
          </div>

          {/* Interactive Category & Service Taxonomy Tree */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-600" />
                  <span>Active Gujarat Category & Service Taxonomy</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Manage service tags, delete obsolete items, or add new services live
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
                {categories.length} Categories Registered
              </span>
            </div>

            <div className="space-y-4">
              {categories.map((cat) => {
                const IconC = iconComponentMap[cat.iconName] || Wrench;
                const vendorCountInCat = vendors.filter((v) => v.categoryId === cat.id).length;

                return (
                  <div
                    key={cat.id}
                    className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-sky-600 shadow-xs">
                          <IconC className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{cat.name}</span>
                            <span className="text-xs text-slate-400 font-normal">
                              ({cat.gujaratiName})
                            </span>
                            {cat.popular && (
                              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-1.5 py-0.5 rounded">
                                Popular
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {cat.subcategories.length} subcategories · {vendorCountInCat} registered local vendors
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                `Delete entire category "${cat.name}"? This removes it from search and filters.`
                              )
                            ) {
                              deleteCategory(cat.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Subcategories and Services */}
                    <div className="pl-4 sm:pl-12 space-y-2.5 border-l-2 border-slate-200 dark:border-slate-700">
                      {cat.subcategories.map((sub) => (
                        <div
                          key={sub.id}
                          className="bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                              {sub.name}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() =>
                                  setActiveInlineSub(
                                    activeInlineSub?.subId === sub.id
                                      ? null
                                      : { catId: cat.id, subId: sub.id }
                                  )
                                }
                                className="text-[11px] font-bold text-sky-600 hover:underline flex items-center gap-0.5"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Service</span>
                              </button>
                              <button
                                onClick={() => deleteSubcategory(cat.id, sub.id)}
                                className="text-slate-400 hover:text-rose-500 p-0.5"
                                title="Delete Subcategory"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Quick inline service addition input */}
                          {activeInlineSub?.catId === cat.id && activeInlineSub?.subId === sub.id && (
                            <div className="flex items-center gap-2 pt-1">
                              <input
                                type="text"
                                placeholder="Service name (e.g. Gas Charging)"
                                value={inlineServiceName}
                                onChange={(e) => setInlineServiceName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddInlineService(cat.id, sub.id);
                                  }
                                }}
                                className="flex-1 text-xs px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-sky-400 text-slate-900 dark:text-white"
                                autoFocus
                              />
                              <button
                                onClick={() => handleAddInlineService(cat.id, sub.id)}
                                className="px-2.5 py-1.5 bg-sky-600 text-white rounded-lg text-xs font-bold"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setActiveInlineSub(null)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 text-xs"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}

                          {/* Services Pills */}
                          <div className="flex flex-wrap gap-1.5">
                            {sub.services.map((srv) => (
                              <span
                                key={srv}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 group"
                              >
                                <span>{srv}</span>
                                <button
                                  onClick={() => removeServiceFromSubcategory(cat.id, sub.id, srv)}
                                  className="text-slate-400 hover:text-rose-500 group-hover:inline-block ml-0.5"
                                  title="Remove Service Tag"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Locations & Areas Management */}
      {activeAdminTab === 'locations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add New Gujarat City */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-600" />
              Add New Gujarat City
            </h4>
            <p className="text-xs text-slate-500">
              Expand platform directory to additional Gujarat municipalities
            </p>

            <form onSubmit={handleAddCity} className="space-y-3">
              <input
                type="text"
                required
                placeholder="City Name in English (e.g. Valsad)"
                value={newCityName}
                onChange={(e) => setNewCityName(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="City Name in Gujarati (e.g. વલસાડ)"
                value={newCityGujarati}
                onChange={(e) => setNewCityGujarati(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Gujarat City</span>
              </button>
            </form>
          </div>

          {/* Add Locality / Area to City */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-600" />
              Add Local Area to City
            </h4>
            <p className="text-xs text-slate-500">
              Database-driven area taxonomy allows adding neighborhoods and societies
            </p>

            <form onSubmit={handleAddArea} className="space-y-3">
              <select
                value={selectedCityForArea}
                onChange={(e) => setSelectedCityForArea(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
              >
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.areas.length} areas registered)
                  </option>
                ))}
              </select>

              <input
                type="text"
                required
                placeholder="New Area / Locality Name (e.g. Science City Road)"
                value={newAreaName}
                onChange={(e) => setNewAreaName(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Area to {cities.find((c) => c.id === selectedCityForArea)?.name}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: Reviews Moderation */}
      {activeAdminTab === 'reviews' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden p-6 space-y-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Customer Review & Rating Moderation
          </h4>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {reviews.map((r) => {
              const vendor = vendors.find((v) => v.id === r.vendorId);
              return (
                <div key={r.id} className="py-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {r.customerName}
                      </span>
                      <span className="text-amber-500 font-bold text-xs">
                        ⭐ {r.rating} / 5
                      </span>
                      <span className="text-[11px] text-slate-400">
                        for <strong>{vendor?.businessName}</strong> ({r.date})
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      "{r.comment}"
                    </p>
                  </div>
                  <button
                    onClick={() => deleteReview(r.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg text-xs flex items-center gap-1 shrink-0 font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: Reported Listings */}
      {activeAdminTab === 'reports' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Listing Reports & Discrepancy Queue
          </h4>
          {reports.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-400">
              No reported listings currently open. Clean queue!
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {reports.map((rep) => (
                <div key={rep.id} className="py-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-rose-600 uppercase">
                        {rep.reason.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {rep.vendorName}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Reported by {rep.reporterName} ({rep.reporterPhone}) on {rep.date}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      {rep.details}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => resolveReport(rep.id, 'resolved')}
                      className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => resolveReport(rep.id, 'dismissed')}
                      className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: Production Architecture & RLS Blueprint */}
      {activeAdminTab === 'architecture' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white border border-slate-800 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 bg-sky-950/80 px-3 py-1 rounded-full border border-sky-800 inline-block mb-2">
                  System Architecture & Production Blueprint
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Vox Business Vault: Gujarat's Local Business & Services Directory
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                  Core Promise: <span className="font-bold text-sky-400">Find. Connect. Get Service.</span> Hyperlocal discovery engine powered by normalized State → City → Area → Pincode hierarchy, permanent QR tokens, and server-enforced RLS.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>RLS Enforced</span>
                </span>
                <span className="text-xs px-3 py-1.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 font-bold flex items-center gap-1.5">
                  <Server className="w-4 h-4" />
                  <span>PostgreSQL / Supabase</span>
                </span>
              </div>
            </div>
          </div>

          {/* 4-Phase Roadmap Cards */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-sky-500" />
              <span>4-Phase Engineering Architecture</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Phase 1 */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Phase 1</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">Active</span>
                </div>
                <h5 className="font-bold text-slate-900 dark:text-white text-sm">Core Directory</h5>
                <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 list-disc list-inside">
                  <li>Normalized Geo Hierarchy</li>
                  <li>Categories → Subcategories</li>
                  <li>Vendor Registration & Profile</li>
                  <li>Call / WhatsApp / Directions</li>
                  <li>Permanent QR (/v/:token)</li>
                  <li>Admin Approval & RLS</li>
                </ul>
              </div>

              {/* Phase 2 */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">Phase 2</span>
                  <span className="px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-[10px] font-bold">Active</span>
                </div>
                <h5 className="font-bold text-slate-900 dark:text-white text-sm">Hyperlocal Discovery</h5>
                <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 list-disc list-inside">
                  <li>GPS Distance Sorting</li>
                  <li>Interactive Leaflet Map</li>
                  <li>Customer Reviews & Ratings</li>
                  <li>Search Suggestions & Auto-fill</li>
                  <li>Favorites & Sharing</li>
                  <li>Vendor Telemetry Analytics</li>
                </ul>
              </div>

              {/* Phase 3 */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Phase 3</span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">Active</span>
                </div>
                <h5 className="font-bold text-slate-900 dark:text-white text-sm">Lead Marketplace</h5>
                <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 list-disc list-inside">
                  <li>Request a Service Ingestion</li>
                  <li>Customer Enquiry Routing</li>
                  <li>Vendor Leads Pipeline</li>
                  <li>Real-time In-app Notifications</li>
                  <li>Direct Messaging Drawer</li>
                  <li>Duplicate Business Claiming</li>
                </ul>
              </div>

              {/* Phase 4 */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-2 opacity-90">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Phase 4</span>
                  <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-bold">Architected</span>
                </div>
                <h5 className="font-bold text-slate-900 dark:text-white text-sm">Business Platform</h5>
                <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 list-disc list-inside">
                  <li>Featured / Sponsored Bidding</li>
                  <li>Merchant Subscriptions</li>
                  <li>UPI / Razorpay Bookings</li>
                  <li>Multi-State Geo Activation</li>
                  <li>Advanced Conversion Metrics</li>
                  <li>WhatsApp Business API</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Database Hierarchy & Permanent QR Bridge */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Normalized Geo Hierarchy */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-sky-600" />
                <span>Normalized Geographic Architecture</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Locations are managed dynamically via <code className="text-sky-600 dark:text-sky-400 font-mono">State → City → Area → Pincode</code> database relations instead of hardcoding, making national multi-state rollout instantaneous without frontend rewrites.
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-200">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">STATE: Gujarat (GJ)</span>
                  <span className="text-[11px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded font-bold">Active Region</span>
                </div>
                <div className="pl-4 border-l-2 border-slate-300 dark:border-slate-600 space-y-1 text-slate-600 dark:text-slate-300">
                  <p>├── Cities ({cities.length}): Ahmedabad, Surat, Vadodara, Rajkot, Bhavnagar, Jamnagar, Junagadh, Gandhinagar</p>
                  <p>├── Areas: Satellite, Bodakdev, Navrangpura, Adajan, Varachha, Alkapuri, Kalawad Road...</p>
                  <p>└── Pincodes: 380015, 380054, 380009, 395009, 390007, 360005...</p>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-slate-400 text-[11px]">
                  Future Expansion Ready: Maharashtra (MH), Rajasthan (RJ) pre-configured in DDL.
                </div>
              </div>
            </div>

            {/* Permanent QR Offline-to-Online Bridge */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <span>The Permanent QR Offline-to-Digital Bridge</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Every merchant receives a permanent unique token (<code className="text-indigo-600 dark:text-indigo-400 font-mono">businessvault.in/v/&#123;token&#125;</code>) printed on storefront acrylic standees and counter displays:
              </p>

              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-slate-800/80 border border-indigo-100 dark:border-slate-700 text-xs space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-300">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">1</span>
                  <span>Storefront Banner / Counter Acrylic Standee</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-300">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">2</span>
                  <span>Instant URL Resolver: /v/:token → Public Profile</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-300">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">3</span>
                  <span>Zero Brokerage Direct Call, WhatsApp & Navigation</span>
                </div>
                <div className="pt-2 text-[11px] text-slate-500 font-mono">
                  Example: businessvault.in/v/VBV-GUJ-TEA-025 (Shambhu's Kadak Chai)
                </div>
              </div>
            </div>
          </div>

          {/* Row Level Security (RLS) Verification Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <span>Server-Enforced Row Level Security (RLS) Policy Audit</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Authorization is verified at the PostgreSQL kernel level—not merely hidden UI buttons.
                </p>
              </div>

              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                100% Policy Coverage
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="p-3">Table Name</th>
                    <th className="p-3">Public Access (Anon)</th>
                    <th className="p-3">Vendor / Merchant Scope</th>
                    <th className="p-3">Customer Scope</th>
                    <th className="p-3">Admin Policy (is_admin())</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">public.vendors</td>
                    <td className="p-3 text-emerald-600 font-medium">SELECT verified only</td>
                    <td className="p-3 text-sky-600">UPDATE own profile only</td>
                    <td className="p-3 text-slate-400">Read only</td>
                    <td className="p-3 text-purple-600 font-bold">FULL (Approval / Delete)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">public.leads</td>
                    <td className="p-3 text-slate-400">INSERT (Request service)</td>
                    <td className="p-3 text-sky-600 font-medium">SELECT & UPDATE own leads</td>
                    <td className="p-3 text-emerald-600">INSERT only</td>
                    <td className="p-3 text-purple-600 font-bold">FULL (Global lead oversight)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">public.categories</td>
                    <td className="p-3 text-emerald-600 font-medium">SELECT all</td>
                    <td className="p-3 text-slate-400">Read only</td>
                    <td className="p-3 text-slate-400">Read only</td>
                    <td className="p-3 text-purple-600 font-bold">FULL (Create / Update / Delete)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">public.reviews</td>
                    <td className="p-3 text-emerald-600 font-medium">SELECT approved only</td>
                    <td className="p-3 text-slate-400">Read only</td>
                    <td className="p-3 text-emerald-600 font-medium">INSERT (Auth review)</td>
                    <td className="p-3 text-purple-600 font-bold">FULL (Moderation & Delete)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">public.cities</td>
                    <td className="p-3 text-emerald-600 font-medium">SELECT active</td>
                    <td className="p-3 text-slate-400">Read only</td>
                    <td className="p-3 text-slate-400">Read only</td>
                    <td className="p-3 text-purple-600 font-bold">FULL (Add cities / areas)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* DDL & Seed File Artifacts */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-sky-400" />
                  <span>Production PostgreSQL DDL & Seed Artifacts</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Generated in workspace for instantaneous deployment via Supabase CLI or pgAdmin.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono bg-slate-800 text-sky-300 px-3 py-1 rounded-lg border border-slate-700">
                  PRODUCTION_SPEC.md (Ready)
                </span>
                <span className="text-[11px] font-mono bg-slate-800 text-emerald-300 px-3 py-1 rounded-lg border border-slate-700">
                  supabase/schema.sql (Ready)
                </span>
                <span className="text-[11px] font-mono bg-slate-800 text-indigo-300 px-3 py-1 rounded-lg border border-slate-700">
                  supabase/seed.sql (Ready)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddVendorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Store className="w-5 h-5 text-sky-600" />
                  <span>Admin Studio: Create Verified Local Vendor</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Instant publishing to Gujarat directory with full services catalog
                </p>
              </div>
              <button
                onClick={() => setShowAddVendorModal(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdminCreateVendor} className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Basic Business Details */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  1. Business Identity & Contact
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mahavir Solar & Inverter Hub"
                      value={vBusinessName}
                      onChange={(e) => setVBusinessName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                      Owner Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pravinbhai Patel"
                      value={vOwnerName}
                      onChange={(e) => setVOwnerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98250 12345"
                      value={vPhone}
                      onChange={(e) => setVPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      type="text"
                      placeholder="919825012345"
                      value={vWhatsapp}
                      onChange={(e) => setVWhatsapp(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="info@vendor.com"
                      value={vEmail}
                      onChange={(e) => setVEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Taxonomy & Services */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  2. Category & Specific Services
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                      Category *
                    </label>
                    <select
                      value={vCategoryId}
                      onChange={(e) => handleVendorCategoryChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.gujaratiName})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                      Subcategory *
                    </label>
                    <select
                      value={vSubcategoryId}
                      onChange={(e) => handleVendorSubcategoryChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                    >
                      {availableSubcategories.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                      Services (Comma-separated) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 3kW On-Grid Setup, Surya Gujarat Subsidy, Net Metering"
                      value={vServicesInput}
                      onChange={(e) => setVServicesInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  3. Gujarat Location & Address
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                      Gujarat City *
                    </label>
                    <select
                      value={vCity}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                    >
                      {cities.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name} ({c.gujaratiName})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                      Area / Locality *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Satellite, Adajan, Alkapuri"
                      value={vArea}
                      onChange={(e) => setVArea(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      placeholder="380015"
                      value={vPincode}
                      onChange={(e) => setVPincode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                      Full Address
                    </label>
                    <input
                      type="text"
                      placeholder="Shop 12, Ground Floor, Radhe Arcade, Satellite Road"
                      value={vAddress}
                      onChange={(e) => setVAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing, Verification & Description */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  4. Commercials & Verification
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                      Starting Price (₹)
                    </label>
                    <input
                      type="number"
                      value={vStartingPrice}
                      onChange={(e) => setVStartingPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={vExperienceYears}
                      onChange={(e) => setVExperienceYears(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                      Verification Status
                    </label>
                    <select
                      value={vVerificationStatus}
                      onChange={(e) => setVVerificationStatus(e.target.value as Vendor['verificationStatus'])}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                    >
                      <option value="verified">Verified (Approved)</option>
                      <option value="pending">Pending</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={vIsFeatured}
                        onChange={(e) => setVIsFeatured(e.target.checked)}
                        className="rounded text-sky-600 focus:ring-sky-500"
                      />
                      <span>Promote to Featured</span>
                    </label>
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                      Business Description & Guarantees
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Describe services, warranty, response time, and qualifications..."
                      value={vDescription}
                      onChange={(e) => setVDescription(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Media URLs */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  5. Media & Showcase Assets (URLs)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                      Logo Image URL
                    </label>
                    <input
                      type="url"
                      value={vLogoUrl}
                      onChange={(e) => setVLogoUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                      Header Panoramic Banner URL
                    </label>
                    <input
                      type="url"
                      value={vBannerUrl}
                      onChange={(e) => setVBannerUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-[11px]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                      Live Business Video URL (.mp4)
                    </label>
                    <input
                      type="url"
                      value={vVideoUrl}
                      onChange={(e) => setVVideoUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddVendorModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold shadow flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Publish Local Vendor to Gujarat Directory</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
