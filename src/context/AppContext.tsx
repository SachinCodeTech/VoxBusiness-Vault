import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Language,
  City,
  Category,
  Vendor,
  Review,
  EnquiryLead,
  ChatMessage,
  NotificationItem,
  ReportItem,
  SearchFilters,
  AdminSession,
  VendorSession
} from '../types';
import {
  INITIAL_CITIES,
  INITIAL_CATEGORIES,
  INITIAL_VENDORS,
  INITIAL_REVIEWS,
  INITIAL_LEADS,
  INITIAL_NOTIFICATIONS
} from '../data/directoryData';
import { calculateDistanceKm } from '../utils/distance';
import { submitLeadWithEmailNotification } from '../utils/leadNotificationService';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  lang: Language;
  setLang: (lang: Language) => void;

  // Location
  cities: City[];
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  userCoords: { lat: number; lng: number } | null;
  requestUserLocation: () => Promise<void>;
  isDetectingLocation: boolean;
  addCity: (city: City) => void;
  addAreaToCity: (cityId: string, areaName: string) => void;

  // Categories
  categories: Category[];
  addCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  addSubcategory: (categoryId: string, subcategory: { id: string; name: string; services: string[] }) => void;
  deleteSubcategory: (categoryId: string, subcategoryId: string) => void;
  addServiceToSubcategory: (categoryId: string, subcategoryId: string, serviceName: string) => void;
  removeServiceFromSubcategory: (categoryId: string, subcategoryId: string, serviceName: string) => void;

  // Search & Filter
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  resetFilters: () => void;
  filteredVendors: (Vendor & { distanceKm?: number })[];

  // Vendors
  vendors: Vendor[];
  registerVendor: (vendor: Omit<Vendor, 'id' | 'rating' | 'reviewCount' | 'stats' | 'createdAt' | 'qrToken'>) => { success: boolean; error?: string; vendorId?: string };
  adminCreateVendor: (vendor: Omit<Vendor, 'id' | 'rating' | 'reviewCount' | 'stats' | 'createdAt' | 'qrToken'> & { rating?: number; isFeatured?: boolean }) => { success: boolean; error?: string; vendorId?: string };
  deleteVendor: (vendorId: string) => void;
  updateVendorStatus: (vendorId: string, status: Vendor['verificationStatus']) => void;
  toggleVendorVerificationBadge: (vendorId: string) => void;
  toggleVendorFeatured: (vendorId: string) => void;
  trackVendorMetric: (vendorId: string, metric: keyof Vendor['stats']) => void;
  updateVendorMedia: (vendorId: string, media: { bannerUrl?: string; snaps?: string[]; videoUrl?: string }) => void;
  updateVendorProfile: (vendorId: string, updates: Partial<Vendor>) => { success: boolean; error?: string };
  updateVendorVerificationBadges: (
    vendorId: string,
    badges: {
      isPhoneVerified?: boolean;
      isEmailVerified?: boolean;
      isIdentityVerified?: boolean;
      isLocationVerified?: boolean;
      isDocsVerified?: boolean;
    }
  ) => void;

  // Favorites
  favorites: string[];
  toggleFavorite: (vendorId: string) => void;
  isFavorite: (vendorId: string) => boolean;

  // Reviews
  reviews: Review[];
  addReview: (vendorId: string, customerName: string, rating: number, comment: string, userCity?: string) => void;
  approveReview: (reviewId: string) => void;
  deleteReview: (reviewId: string) => void;
  replyToReview: (reviewId: string, reply: string) => void;

  // Leads & Bookings
  leads: EnquiryLead[];
  createLeadBooking: (lead: Omit<EnquiryLead, 'id' | 'createdAt' | 'status'>, paymentAmount?: number, paymentMethod?: string) => string;
  updateLeadStatus: (leadId: string, status: EnquiryLead['status']) => void;

  // Chat
  chatMessages: ChatMessage[];
  sendChatMessage: (vendorId: string, text: string, sender: 'customer' | 'vendor') => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  markNotifsAsRead: () => void;
  addNotification: (title: string, message: string, type: NotificationItem['type'], amount?: number) => void;

  // Reports
  reports: ReportItem[];
  submitReport: (vendorId: string, vendorName: string, reason: ReportItem['reason'], details: string, reporterName: string, reporterPhone: string) => void;
  resolveReport: (reportId: string, status: 'resolved' | 'dismissed') => void;

  // Active UI / Modals
  activeTab: 'home' | 'categories' | 'map' | 'saved' | 'portal';
  setActiveTab: (tab: 'home' | 'categories' | 'map' | 'saved' | 'portal') => void;
  selectedVendorForProfile: Vendor | null;
  setSelectedVendorForProfile: (v: Vendor | null) => void;
  selectedVendorForBooking: Vendor | null;
  setSelectedVendorForBooking: (v: Vendor | null) => void;
  selectedVendorForChat: Vendor | null;
  setSelectedVendorForChat: (v: Vendor | null) => void;
  selectedVendorForQR: Vendor | null;
  setSelectedVendorForQR: (v: Vendor | null) => void;
  isQRScannerOpen: boolean;
  setIsQRScannerOpen: (open: boolean) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  isRegistrationModalOpen: boolean;
  setIsRegistrationModalOpen: (open: boolean) => void;
  isInfoDrawerOpen: boolean;
  setIsInfoDrawerOpen: (open: boolean) => void;
  isNotificationsModalOpen: boolean;
  setIsNotificationsModalOpen: (open: boolean) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  reportingVendor: Vendor | null;
  setReportingVendor: (v: Vendor | null) => void;

  // Role Based Access Control (RBAC) & Security
  isAdminAuthenticated: boolean;
  isVendorAuthenticated: boolean;
  adminSession: AdminSession | null;
  vendorSession: VendorSession | null;
  loginAdmin: (credentials: { username?: string; email?: string; passcode?: string }) => { success: boolean; error?: string };
  logoutAdmin: () => void;
  loginVendor: (vendorIdOrPhone: string, pin?: string) => { success: boolean; error?: string };
  logoutVendor: () => void;
  isAdminAuthModalOpen: boolean;
  setIsAdminAuthModalOpen: (open: boolean) => void;
  isVendorAuthModalOpen: boolean;
  setIsVendorAuthModalOpen: (open: boolean) => void;
  requestRoleChange: (targetRole: UserRole) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialFilters: SearchFilters = {
  query: '',
  city: 'Ahmedabad',
  area: '',
  category: '',
  subcategory: '',
  verifiedOnly: false,
  openNowOnly: false,
  minRating: 0,
  maxDistanceKm: 100,
  serviceType: '',
  businessType: 'all',
  sortBy: 'recommended'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // RBAC Sessions & Route Security
  const [adminSession, setAdminSession] = useState<AdminSession | null>(() => {
    try {
      const saved = localStorage.getItem('vbv_admin_session');
      if (saved) {
        const parsed: AdminSession = JSON.parse(saved);
        if (parsed.isAuthenticated && parsed.expiresAt > Date.now()) {
          return parsed;
        }
      }
    } catch (e) {}
    localStorage.removeItem('vbv_admin_session');
    return null;
  });

  const [vendorSession, setVendorSession] = useState<VendorSession | null>(() => {
    try {
      const saved = localStorage.getItem('vbv_vendor_session');
      if (saved) {
        const parsed: VendorSession = JSON.parse(saved);
        if (parsed.isAuthenticated) {
          return parsed;
        }
      }
    } catch (e) {}
    localStorage.removeItem('vbv_vendor_session');
    return null;
  });

  const [role, setRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem('vbv_role') as UserRole;
    if (saved === 'admin') {
      try {
        const s = localStorage.getItem('vbv_admin_session');
        if (s && JSON.parse(s).isAuthenticated && JSON.parse(s).expiresAt > Date.now()) {
          return 'admin';
        }
      } catch (e) {}
      return 'customer';
    }
    if (saved === 'vendor') {
      try {
        const s = localStorage.getItem('vbv_vendor_session');
        if (s && JSON.parse(s).isAuthenticated) {
          return 'vendor';
        }
      } catch (e) {}
      return 'customer';
    }
    return 'customer';
  });

  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [isVendorAuthModalOpen, setIsVendorAuthModalOpen] = useState(false);

  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('vbv_lang') as Language) || 'en';
  });

  const [cities, setCities] = useState<City[]>(() => {
    const saved = localStorage.getItem('vbv_cities');
    return saved ? JSON.parse(saved) : INITIAL_CITIES;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('vbv_categories');
    if (saved) {
      try {
        const parsed: Category[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((c) => c.id));
          const missing = INITIAL_CATEGORIES.filter((c) => !existingIds.has(c.id));
          return missing.length > 0 ? [...parsed, ...missing] : parsed;
        }
      } catch (e) {}
    }
    return INITIAL_CATEGORIES;
  });

  const [selectedCity, setSelectedCity] = useState<string>('Ahmedabad');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>(initialFilters);

  // Initialize clean state - purge old seeds to load updated physical, online, and hybrid directory
  const [vendors, setVendors] = useState<Vendor[]>(() => {
    if (!localStorage.getItem('vbv_seed_purged_v4')) {
      localStorage.removeItem('vbv_vendors');
      localStorage.setItem('vbv_seed_purged_v4', 'true');
      return INITIAL_VENDORS;
    }
    const saved = localStorage.getItem('vbv_vendors');
    if (saved) {
      try {
        const parsed: Vendor[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_VENDORS;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('vbv_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    if (!localStorage.getItem('vbv_seed_purged_v2')) {
      localStorage.removeItem('vbv_reviews');
      return [];
    }
    const saved = localStorage.getItem('vbv_reviews');
    if (saved) {
      try {
        const parsed: Review[] = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return INITIAL_REVIEWS;
  });

  const [leads, setLeads] = useState<EnquiryLead[]>(() => {
    if (!localStorage.getItem('vbv_seed_purged_v2')) {
      localStorage.removeItem('vbv_leads');
      return [];
    }
    const saved = localStorage.getItem('vbv_leads');
    if (saved) {
      try {
        const parsed: EnquiryLead[] = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return INITIAL_LEADS;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    if (!localStorage.getItem('vbv_seed_purged_v2')) {
      localStorage.removeItem('vbv_chats');
      return [];
    }
    const saved = localStorage.getItem('vbv_chats');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    if (!localStorage.getItem('vbv_seed_purged_v2')) {
      localStorage.removeItem('vbv_notifs');
      return [];
    }
    const saved = localStorage.getItem('vbv_notifs');
    if (saved) {
      try {
        const parsed: NotificationItem[] = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Mark purge completed on mount
  useEffect(() => {
    if (!localStorage.getItem('vbv_seed_purged_v2')) {
      localStorage.setItem('vbv_seed_purged_v2', 'true');
    }
  }, []);

  const [reports, setReports] = useState<ReportItem[]>(() => {
    const saved = localStorage.getItem('vbv_reports');
    return saved ? JSON.parse(saved) : [];
  });

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<'home' | 'categories' | 'map' | 'saved' | 'portal'>('home');
  const [selectedVendorForProfile, setSelectedVendorForProfile] = useState<Vendor | null>(null);
  const [selectedVendorForBooking, setSelectedVendorForBooking] = useState<Vendor | null>(null);
  const [selectedVendorForChat, setSelectedVendorForChat] = useState<Vendor | null>(null);
  const [selectedVendorForQR, setSelectedVendorForQR] = useState<Vendor | null>(null);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isInfoDrawerOpen, setIsInfoDrawerOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportingVendor, setReportingVendor] = useState<Vendor | null>(null);

  // Persistence to local storage
  useEffect(() => {
    localStorage.setItem('vbv_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('vbv_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('vbv_cities', JSON.stringify(cities));
  }, [cities]);

  useEffect(() => {
    localStorage.setItem('vbv_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('vbv_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('vbv_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('vbv_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('vbv_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('vbv_chats', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('vbv_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('vbv_reports', JSON.stringify(reports));
  }, [reports]);

  // Handle QR token deep links on mount (e.g. ?v=VBV-GUJ-TEA-025, /v/:token, or ?vendor=id)
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('v') || urlParams.get('token');
      const vendorId = urlParams.get('vendor');

      // Also check pathname for /v/:token or hash #v/:token
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      const pathMatchToken = pathParts[0] === 'v' && pathParts[1] ? pathParts[1] : null;

      const hashParts = window.location.hash.replace('#', '').split('/').filter(Boolean);
      const hashMatchToken = hashParts[0] === 'v' && hashParts[1] ? hashParts[1] : null;

      const lookupToken = token || pathMatchToken || hashMatchToken;

      if (lookupToken) {
        const found = vendors.find(
          (v) => v.qrToken.toLowerCase() === lookupToken.toLowerCase() || v.id === lookupToken
        );
        if (found) {
          setSelectedVendorForProfile(found);
          trackVendorMetric(found.id, 'qrScans');
          setActiveTab('home');
        }
      } else if (vendorId) {
        const found = vendors.find((v) => v.id === vendorId);
        if (found) {
          setSelectedVendorForProfile(found);
          trackVendorMetric(found.id, 'views');
          setActiveTab('home');
        }
      }
    } catch (e) {
      console.warn('QR token resolution failed:', e);
    }
  }, [vendors]);

  // Request user geolocation
  const requestUserLocation = async () => {
    setIsDetectingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoords({ lat: latitude, lng: longitude });

          // Find closest Gujarat city
          let closestCity = cities[0];
          let minDistance = 99999;
          cities.forEach((city) => {
            const dist = calculateDistanceKm(latitude, longitude, city.lat, city.lng);
            if (dist < minDistance) {
              minDistance = dist;
              closestCity = city;
            }
          });

          if (closestCity) {
            setSelectedCity(closestCity.name);
            setFilters((prev) => ({ ...prev, city: closestCity.name, area: '' }));
          }
          setIsDetectingLocation(false);
        },
        (error) => {
          console.warn('Geolocation denied or unavailable:', error);
          // Fallback to Ahmedabad center default
          setUserCoords({ lat: 23.0225, lng: 72.5714 });
          setSelectedCity('Ahmedabad');
          setIsDetectingLocation(false);
        },
        { timeout: 7000 }
      );
    } else {
      setUserCoords({ lat: 23.0225, lng: 72.5714 });
      setIsDetectingLocation(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      ...initialFilters,
      city: selectedCity,
      area: selectedArea
    });
  };

  // Sync selectedCity / selectedArea with filters
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      city: selectedCity,
      area: selectedArea
    }));
  }, [selectedCity, selectedArea]);

  // Filtered Vendors computation
  const filteredVendors = vendors
    .filter((vendor) => {
      // Admin sees everything; normal users only see verified or pending (unless suspended/rejected)
      if (role !== 'admin' && (vendor.verificationStatus === 'rejected' || vendor.verificationStatus === 'suspended')) {
        return false;
      }

      // Business Type Filter
      if (filters.businessType && filters.businessType !== 'all') {
        if (vendor.businessType !== filters.businessType) {
          return false;
        }
      }

      // City filter: for online businesses, also check if their serviceRegions cover Gujarat/India or the city
      if (filters.city && filters.city !== 'All Gujarat Cities') {
        const isCityMatch = vendor.city && vendor.city.toLowerCase() === filters.city.toLowerCase();
        const isOnlineRegionalMatch =
          vendor.businessType === 'online' &&
          Boolean(
            vendor.serviceRegions?.some((r) => {
              const lower = r.toLowerCase();
              return lower.includes('gujarat') || lower.includes('india') || lower.includes(filters.city.toLowerCase());
            })
          );

        if (!isCityMatch && !isOnlineRegionalMatch) {
          return false;
        }
      }

      // Area filter: only apply if business has a physical presence
      if (filters.area && filters.area !== 'All Areas') {
        if (vendor.businessType === 'physical' || (vendor.businessType === 'hybrid' && vendor.area)) {
          if (!vendor.area || vendor.area.toLowerCase() !== filters.area.toLowerCase()) {
            return false;
          }
        }
      }

      // Category filter
      if (filters.category) {
        if (vendor.categoryId !== filters.category) {
          return false;
        }
      }

      // Subcategory filter
      if (filters.subcategory) {
        if (vendor.subcategoryId !== filters.subcategory) {
          return false;
        }
      }

      // Verified only filter
      if (filters.verifiedOnly && vendor.verificationStatus !== 'verified') {
        return false;
      }

      // Open now filter
      if (filters.openNowOnly && !vendor.businessHours.isOpenToday) {
        return false;
      }

      // Min rating
      if (filters.minRating > 0 && vendor.rating < filters.minRating) {
        return false;
      }

      // Free text query (checks business name, owner name, category, services, area, city, description, website, businessType)
      if (filters.query && filters.query.trim() !== '') {
        const q = filters.query.toLowerCase().trim();
        const matchName = vendor.businessName.toLowerCase().includes(q);
        const matchCategory = vendor.categoryId.toLowerCase().includes(q);
        const matchArea = vendor.area ? vendor.area.toLowerCase().includes(q) : false;
        const matchCity = vendor.city ? vendor.city.toLowerCase().includes(q) : false;
        const matchPincode = vendor.pincode ? vendor.pincode.includes(q) : false;
        const matchServices = vendor.services.some((s) => s.toLowerCase().includes(q));
        const matchDesc = vendor.description ? vendor.description.toLowerCase().includes(q) : false;
        const matchWebsite = vendor.websiteUrl ? vendor.websiteUrl.toLowerCase().includes(q) : false;
        const matchType = vendor.businessType.toLowerCase().includes(q);
        const matchRegions = vendor.serviceRegions ? vendor.serviceRegions.some((r) => r.toLowerCase().includes(q)) : false;

        if (
          !matchName &&
          !matchCategory &&
          !matchArea &&
          !matchCity &&
          !matchPincode &&
          !matchServices &&
          !matchDesc &&
          !matchWebsite &&
          !matchType &&
          !matchRegions
        ) {
          return false;
        }
      }

      return true;
    })
    .map((vendor) => {
      let distanceKm: number | undefined;
      if (vendor.lat !== undefined && vendor.lng !== undefined) {
        if (userCoords) {
          distanceKm = calculateDistanceKm(userCoords.lat, userCoords.lng, vendor.lat, vendor.lng);
        } else {
          const cityObj = cities.find((c) => c.name.toLowerCase() === selectedCity.toLowerCase());
          if (cityObj) {
            distanceKm = calculateDistanceKm(cityObj.lat, cityObj.lng, vendor.lat, vendor.lng);
          }
        }
      }
      return {
        ...vendor,
        distanceKm
      };
    })
    .filter((vendor) => {
      // Dynamic Distance Range filter (only filters vendors that have defined physical distance)
      if (filters.maxDistanceKm > 0 && vendor.distanceKm !== undefined) {
        if (vendor.distanceKm > filters.maxDistanceKm) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (filters.sortBy === 'distance' && a.distanceKm !== undefined && b.distanceKm !== undefined) {
        return a.distanceKm - b.distanceKm;
      }
      if (filters.sortBy === 'price_low') {
        return (a.startingPrice || 0) - (b.startingPrice || 0);
      }
      // 'recommended' by default: featured first, then verified, then rating
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      if (a.verificationStatus === 'verified' && b.verificationStatus !== 'verified') return -1;
      if (a.verificationStatus !== 'verified' && b.verificationStatus === 'verified') return 1;
      return b.rating - a.rating;
    });

  // Track metrics (Calls, WhatsApp, Directions, QR scans)
  const trackVendorMetric = (vendorId: string, metric: keyof Vendor['stats']) => {
    setVendors((prev) =>
      prev.map((v) => {
        if (v.id === vendorId) {
          return {
            ...v,
            stats: {
              ...v.stats,
              [metric]: v.stats[metric] + 1
            }
          };
        }
        return v;
      })
    );
  };

  // Register a new vendor with duplicate check
  const registerVendor = (data: Omit<Vendor, 'id' | 'rating' | 'reviewCount' | 'stats' | 'createdAt' | 'qrToken'>) => {
    // Check for duplicate phone or exact business name in same city
    const existing = vendors.find(
      (v) =>
        v.phone.replace(/\D/g, '') === data.phone.replace(/\D/g, '') ||
        (v.businessName.toLowerCase() === data.businessName.toLowerCase() && v.city.toLowerCase() === data.city.toLowerCase())
    );

    if (existing) {
      return {
        success: false,
        error: `A business with phone number or name "${existing.businessName}" in ${existing.city} already exists (ID: ${existing.id}).`
      };
    }

    const isOnline = data.businessType === 'online';
    const newId = `VND-GJ-${Date.now().toString().slice(-4)}`;
    const qrToken = `VBV-${data.businessName.slice(0, 4).toUpperCase()}-${data.pincode || (isOnline ? 'ONL' : 'GUJ')}-${Date.now().toString().slice(-4)}`;

    const newVendor: Vendor = {
      ...data,
      businessType: data.businessType || 'physical',
      serviceRegionMode: data.serviceRegionMode || (isOnline ? 'gujarat' : 'local'),
      businessEmail: data.businessEmail || data.email,
      id: newId,
      rating: 5.0,
      reviewCount: 0,
      verificationStatus: 'pending',
      isPhoneVerified: true,
      isEmailVerified: Boolean(data.email || data.businessEmail),
      isLocationVerified: isOnline ? false : Boolean(data.address),
      isDocsVerified: false,
      isIdentityVerified: false,
      isFeatured: false,
      showPublicAddress: isOnline ? false : (data.showPublicAddress ?? true),
      serviceRegions: data.serviceRegions || (isOnline ? ['All Gujarat', 'Pan-India'] : ['Gujarat']),
      lat: isOnline ? undefined : data.lat,
      lng: isOnline ? undefined : data.lng,
      address: isOnline ? undefined : data.address,
      pincode: isOnline ? undefined : data.pincode,
      stats: {
        views: 12,
        calls: 0,
        whatsapp: 0,
        directions: 0,
        qrScans: 1,
        enquiries: 0,
        totalEarnings: 0
      },
      qrToken,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setVendors((prev) => [newVendor, ...prev]);

    // Add notification
    addNotification(
      'New Vendor Registration',
      `${data.businessName} (${data.businessType.toUpperCase()} - ${data.city}) submitted for verification.`,
      'system'
    );

    return {
      success: true,
      vendorId: newId
    };
  };

  const adminCreateVendor = (data: Omit<Vendor, 'id' | 'rating' | 'reviewCount' | 'stats' | 'createdAt' | 'qrToken'> & { rating?: number; isFeatured?: boolean }) => {
    const isOnline = data.businessType === 'online';
    const newId = `VND-ADM-${Date.now().toString().slice(-4)}`;
    const qrToken = `VBV-${data.businessName.slice(0, 4).toUpperCase()}-${data.pincode || (isOnline ? 'ONL' : 'GUJ')}-${Date.now().toString().slice(-4)}`;

    const newVendor: Vendor = {
      ...data,
      businessType: data.businessType || 'physical',
      id: newId,
      rating: data.rating || 5.0,
      reviewCount: 1,
      verificationStatus: 'verified',
      isPhoneVerified: true,
      isEmailVerified: Boolean(data.email),
      isLocationVerified: isOnline ? false : true,
      isDocsVerified: true,
      isIdentityVerified: true,
      isFeatured: data.isFeatured || false,
      showPublicAddress: isOnline ? false : (data.showPublicAddress ?? true),
      serviceRegions: data.serviceRegions || (isOnline ? ['All Gujarat', 'Pan-India'] : ['Gujarat']),
      lat: isOnline ? undefined : data.lat,
      lng: isOnline ? undefined : data.lng,
      address: isOnline ? undefined : data.address,
      pincode: isOnline ? undefined : data.pincode,
      stats: {
        views: 45,
        calls: 2,
        whatsapp: 3,
        directions: isOnline ? 0 : 1,
        qrScans: 5,
        enquiries: 1,
        totalEarnings: 499
      },
      qrToken,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setVendors((prev) => [newVendor, ...prev]);

    addNotification(
      'Admin Created Listing',
      `${data.businessName} (${data.businessType.toUpperCase()} - ${data.city}) added via Admin Master Controller.`,
      'system'
    );

    return {
      success: true,
      vendorId: newId
    };
  };

  const deleteVendor = (vendorId: string) => {
    setVendors((prev) => prev.filter((v) => v.id !== vendorId));
    if (selectedVendorForProfile?.id === vendorId) {
      setSelectedVendorForProfile(null);
    }
  };

  const updateVendorStatus = (vendorId: string, status: Vendor['verificationStatus']) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, verificationStatus: status } : v))
    );
  };

  const toggleVendorVerificationBadge = (vendorId: string) => {
    setVendors((prev) =>
      prev.map((v) => {
        if (v.id === vendorId) {
          const next = v.verificationStatus === 'verified' ? 'pending' : 'verified';
          return {
            ...v,
            verificationStatus: next,
            isDocsVerified: next === 'verified'
          };
        }
        return v;
      })
    );
  };

  const toggleVendorFeatured = (vendorId: string) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, isFeatured: !v.isFeatured } : v))
    );
  };

  const updateVendorMedia = (
    vendorId: string,
    media: { bannerUrl?: string; snaps?: string[]; videoUrl?: string }
  ) => {
    setVendors((prev) =>
      prev.map((v) => {
        if (v.id === vendorId) {
          const updated = {
            ...v,
            bannerUrl: media.bannerUrl !== undefined ? media.bannerUrl : v.bannerUrl,
            currentSnaps: media.snaps !== undefined ? media.snaps : v.currentSnaps,
            liveVideoUrl: media.videoUrl !== undefined ? media.videoUrl : v.liveVideoUrl
          };
          if (selectedVendorForProfile?.id === vendorId) {
            setSelectedVendorForProfile(updated);
          }
          return updated;
        }
        return v;
      })
    );
  };

  const updateVendorProfile = (
    vendorId: string,
    updates: Partial<Vendor>
  ): { success: boolean; error?: string } => {
    // URL Sanitization
    let cleanWebsite = updates.websiteUrl !== undefined ? updates.websiteUrl.trim() : undefined;
    if (cleanWebsite && !/^https?:\/\//i.test(cleanWebsite)) {
      cleanWebsite = `https://${cleanWebsite}`;
    }
    let cleanApp = updates.appStoreUrl !== undefined ? updates.appStoreUrl.trim() : undefined;
    if (cleanApp && !/^https?:\/\//i.test(cleanApp)) {
      cleanApp = `https://${cleanApp}`;
    }

    const current = vendors.find((v) => v.id === vendorId);
    if (!current) {
      return { success: false, error: 'Vendor not found' };
    }

    const targetType = updates.businessType || current.businessType;

    // Validation rules
    if (targetType === 'physical') {
      const address = updates.address !== undefined ? updates.address : current.address;
      if (!address || !address.trim()) {
        return { success: false, error: 'Physical business requires a valid street address.' };
      }
    } else if (targetType === 'online') {
      const website = cleanWebsite !== undefined ? cleanWebsite : current.websiteUrl;
      if (!website || !website.trim()) {
        return {
          success: false,
          error: 'Online business requires a valid HTTPS website URL.'
        };
      }
      if (!/^https:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i.test(website)) {
        return {
          success: false,
          error: 'Online business website URL must use secure HTTPS (e.g., https://example.com).'
        };
      }
    }

    setVendors((prev) =>
      prev.map((v) => {
        if (v.id === vendorId) {
          const isOnline = targetType === 'online';
          const updated: Vendor = {
            ...v,
            ...updates,
            businessType: targetType,
            serviceRegionMode: updates.serviceRegionMode !== undefined ? updates.serviceRegionMode : (v.serviceRegionMode || (isOnline ? 'gujarat' : 'local')),
            businessEmail: updates.businessEmail !== undefined ? updates.businessEmail : (updates.email !== undefined ? updates.email : v.businessEmail),
            websiteUrl: cleanWebsite !== undefined ? cleanWebsite : v.websiteUrl,
            appStoreUrl: cleanApp !== undefined ? cleanApp : v.appStoreUrl,
            showPublicAddress: isOnline ? false : (updates.showPublicAddress !== undefined ? updates.showPublicAddress : v.showPublicAddress),
            lat: isOnline ? undefined : (updates.lat !== undefined ? updates.lat : v.lat),
            lng: isOnline ? undefined : (updates.lng !== undefined ? updates.lng : v.lng),
            address: isOnline ? undefined : (updates.address !== undefined ? updates.address : v.address),
            pincode: isOnline ? undefined : (updates.pincode !== undefined ? updates.pincode : v.pincode),
            isLocationVerified: isOnline ? false : (updates.isLocationVerified !== undefined ? updates.isLocationVerified : v.isLocationVerified)
          };
          if (selectedVendorForProfile?.id === vendorId) {
            setSelectedVendorForProfile(updated);
          }
          return updated;
        }
        return v;
      })
    );

    addNotification(
      'Profile Updated',
      `Operating settings updated for business listing ${current.businessName}.`,
      'system'
    );

    return { success: true };
  };

  const updateVendorVerificationBadges = (
    vendorId: string,
    badges: {
      isPhoneVerified?: boolean;
      isEmailVerified?: boolean;
      isIdentityVerified?: boolean;
      isLocationVerified?: boolean;
      isDocsVerified?: boolean;
    }
  ) => {
    setVendors((prev) =>
      prev.map((v) => {
        if (v.id === vendorId) {
          const updated: Vendor = {
            ...v,
            isPhoneVerified: badges.isPhoneVerified !== undefined ? badges.isPhoneVerified : v.isPhoneVerified,
            isEmailVerified: badges.isEmailVerified !== undefined ? badges.isEmailVerified : v.isEmailVerified,
            isIdentityVerified: badges.isIdentityVerified !== undefined ? badges.isIdentityVerified : v.isIdentityVerified,
            // If online business, location verified must always remain false
            isLocationVerified: v.businessType === 'online' ? false : (badges.isLocationVerified !== undefined ? badges.isLocationVerified : v.isLocationVerified),
            isDocsVerified: badges.isDocsVerified !== undefined ? badges.isDocsVerified : v.isDocsVerified
          };
          if (selectedVendorForProfile?.id === vendorId) {
            setSelectedVendorForProfile(updated);
          }
          return updated;
        }
        return v;
      })
    );
  };

  const toggleFavorite = (vendorId: string) => {
    setFavorites((prev) =>
      prev.includes(vendorId) ? prev.filter((id) => id !== vendorId) : [...prev, vendorId]
    );
  };

  const isFavorite = (vendorId: string) => favorites.includes(vendorId);

  // Reviews
  const addReview = (vendorId: string, customerName: string, rating: number, comment: string, userCity?: string) => {
    const newReview: Review = {
      id: `REV-${Date.now()}`,
      vendorId,
      customerName,
      userCity: userCity || `${selectedCity} (${selectedArea || 'Gujarat'})`,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      verifiedBooking: true,
      status: 'approved'
    };

    setReviews((prev) => [newReview, ...prev]);

    // Recalculate vendor rating
    setVendors((prev) =>
      prev.map((v) => {
        if (v.id === vendorId) {
          const vendorReviews = [...reviews.filter((r) => r.vendorId === vendorId), newReview];
          const avg = vendorReviews.reduce((acc, r) => acc + r.rating, 0) / vendorReviews.length;
          return {
            ...v,
            rating: Math.round(avg * 10) / 10,
            reviewCount: vendorReviews.length
          };
        }
        return v;
      })
    );

    addNotification(
      'New Customer Review Received',
      `${customerName} rated 5 stars for your service!`,
      'review',
      undefined
    );
  };

  const approveReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status: 'approved' } : r))
    );
  };

  const deleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  const replyToReview = (reviewId: string, reply: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, vendorReply: reply } : r))
    );
  };

  // Leads & Bookings
  const createLeadBooking = (
    data: Omit<EnquiryLead, 'id' | 'createdAt' | 'status'>,
    paymentAmount = 199,
    paymentMethod = 'UPI'
  ) => {
    const leadId = `LEAD-${Date.now().toString().slice(-6)}`;
    const paymentRef = `${paymentMethod.toUpperCase()}-VBV-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newLead: EnquiryLead = {
      ...data,
      id: leadId,
      status: 'new',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      quotedPrice: data.quotedPrice || 499,
      advancePaid: paymentAmount,
      paymentRef,
      emailNotificationStatus: 'pending'
    };

    setLeads((prev) => [newLead, ...prev]);

    // Dispatch server-side vendor email notification via Supabase & Edge Function
    submitLeadWithEmailNotification(newLead).then((res) => {
      if (res.notificationStatus) {
        setLeads((prev) =>
          prev.map((l) =>
            l.id === leadId
              ? { ...l, emailNotificationStatus: res.notificationStatus as any }
              : l
          )
        );
      }
    }).catch((err) => {
      console.warn('Vendor email notification trigger error:', err);
    });

    // Update vendor enquiries and earnings stats
    setVendors((prev) =>
      prev.map((v) => {
        if (v.id === data.vendorId) {
          return {
            ...v,
            stats: {
              ...v.stats,
              enquiries: v.stats.enquiries + 1,
              totalEarnings: v.stats.totalEarnings + paymentAmount
            }
          };
        }
        return v;
      })
    );

    // Push notification for order confirmation
    addNotification(
      `Service Booking Confirmed (${leadId})`,
      `Advance payment of ₹${paymentAmount} processed. Vendor has received your request.`,
      'order',
      paymentAmount
    );

    return leadId;
  };

  const updateLeadStatus = (leadId: string, status: EnquiryLead['status']) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === leadId ? { ...lead, status } : lead))
    );
  };

  // Chat
  const sendChatMessage = (vendorId: string, text: string, sender: 'customer' | 'vendor') => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      vendorId,
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages((prev) => [...prev, newMsg]);

    // If customer sent message, simulate friendly vendor auto-acknowledgement after 1.2s
    if (sender === 'customer') {
      setTimeout(() => {
        const replyMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          vendorId,
          sender: 'vendor',
          text: `Namaste! Thank you for contacting us. We have received your query regarding "${text.slice(0, 40)}...". Our technician will call or message you back immediately.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages((prev) => [...prev, replyMsg]);
      }, 1200);
    }
  };

  // Notifications
  const addNotification = (title: string, message: string, type: NotificationItem['type'], amount?: number) => {
    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title,
      message,
      type,
      timestamp: 'Just now',
      read: false,
      amount
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotifsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  // Reports
  const submitReport = (
    vendorId: string,
    vendorName: string,
    reason: ReportItem['reason'],
    details: string,
    reporterName: string,
    reporterPhone: string
  ) => {
    const newReport: ReportItem = {
      id: `REP-${Date.now().toString().slice(-4)}`,
      vendorId,
      vendorName,
      reason,
      details,
      reporterName,
      reporterPhone,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    setReports((prev) => [newReport, ...prev]);
    addNotification('Listing Report Submitted', `Admin team notified regarding ${vendorName}.`, 'system');
  };

  const resolveReport = (reportId: string, status: 'resolved' | 'dismissed') => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status } : r))
    );
  };

  // Dynamic Cities & Areas administration
  const addCity = (city: City) => {
    setCities((prev) => [...prev, city]);
  };

  const addAreaToCity = (cityId: string, areaName: string) => {
    setCities((prev) =>
      prev.map((c) => {
        if (c.id === cityId && !c.areas.includes(areaName)) {
          return { ...c, areas: [...c.areas, areaName] };
        }
        return c;
      })
    );
  };

  // Dynamic Categories administration
  const addCategory = (cat: Category) => {
    setCategories((prev) => [...prev, cat]);
  };

  const deleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
  };

  const addSubcategory = (categoryId: string, subcategory: { id: string; name: string; services: string[] }) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === categoryId) {
          return {
            ...c,
            subcategories: [...c.subcategories, subcategory]
          };
        }
        return c;
      })
    );
  };

  const deleteSubcategory = (categoryId: string, subcategoryId: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === categoryId) {
          return {
            ...c,
            subcategories: c.subcategories.filter((s) => s.id !== subcategoryId)
          };
        }
        return c;
      })
    );
  };

  const addServiceToSubcategory = (categoryId: string, subcategoryId: string, serviceName: string) => {
    const trimmed = serviceName.trim();
    if (!trimmed) return;
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === categoryId) {
          return {
            ...c,
            subcategories: c.subcategories.map((s) => {
              if (s.id === subcategoryId && !s.services.includes(trimmed)) {
                return {
                  ...s,
                  services: [...s.services, trimmed]
                };
              }
              return s;
            })
          };
        }
        return c;
      })
    );
  };

  const removeServiceFromSubcategory = (categoryId: string, subcategoryId: string, serviceName: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === categoryId) {
          return {
            ...c,
            subcategories: c.subcategories.map((s) => {
              if (s.id === subcategoryId) {
                return {
                  ...s,
                  services: s.services.filter((srv) => srv !== serviceName)
                };
              }
              return s;
            })
          };
        }
        return c;
      })
    );
  };

  // RBAC & Route Security Implementation
  const isAdminAuthenticated = Boolean(adminSession?.isAuthenticated && adminSession.expiresAt > Date.now());
  const isVendorAuthenticated = Boolean(vendorSession?.isAuthenticated);

  const setRole = (newRole: UserRole) => {
    if (newRole === 'admin') {
      if (!adminSession?.isAuthenticated || adminSession.expiresAt <= Date.now()) {
        setIsAdminAuthModalOpen(true);
        return;
      }
    } else if (newRole === 'vendor') {
      if (!vendorSession?.isAuthenticated) {
        setIsVendorAuthModalOpen(true);
        return;
      }
    }
    setRoleState(newRole);
    localStorage.setItem('vbv_role', newRole);
  };

  const requestRoleChange = (targetRole: UserRole): boolean => {
    if (targetRole === 'customer') {
      setRoleState('customer');
      localStorage.setItem('vbv_role', 'customer');
      return true;
    }
    if (targetRole === 'admin') {
      if (adminSession?.isAuthenticated && adminSession.expiresAt > Date.now()) {
        setRoleState('admin');
        localStorage.setItem('vbv_role', 'admin');
        return true;
      } else {
        setIsAdminAuthModalOpen(true);
        return false;
      }
    }
    if (targetRole === 'vendor') {
      if (vendorSession?.isAuthenticated) {
        setRoleState('vendor');
        localStorage.setItem('vbv_role', 'vendor');
        return true;
      } else {
        setIsVendorAuthModalOpen(true);
        return false;
      }
    }
    return false;
  };

  const loginAdmin = ({ username, email, passcode }: { username?: string; email?: string; passcode?: string }) => {
    const id = (email || username || '').trim().toLowerCase();
    const code = (passcode || '').trim();

    // Valid master admin credentials
    const validEmails = ['admin@voxvault.in', 'director@voxvault.in', 'admin', 'drs52ss19@gmail.com', 'admin@vbv.in'];
    const validCodes = ['voxadmin2026', 'VBV@2026', '987654', '123456', 'admin123', 'vbvadmin'];

    const isValidUser = validEmails.includes(id) || id.includes('admin') || id === 'drs52ss19@gmail.com';
    const isValidPass = validCodes.includes(code);

    if (isValidUser && isValidPass) {
      const session: AdminSession = {
        isAuthenticated: true,
        adminEmail: id || 'admin@voxvault.in',
        loginTime: Date.now(),
        expiresAt: Date.now() + 4 * 60 * 60 * 1000, // 4 hours session
        sessionToken: `vbv_adm_${Math.random().toString(36).substring(2)}_${Date.now()}`,
        role: 'super_admin'
      };
      setAdminSession(session);
      localStorage.setItem('vbv_admin_session', JSON.stringify(session));
      setRoleState('admin');
      localStorage.setItem('vbv_role', 'admin');
      setIsAdminAuthModalOpen(false);
      addNotification(
        'Admin Access Granted',
        `Authenticated as Super Admin (${session.adminEmail}). Security gate cleared.`,
        'system'
      );
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid admin credentials. Use admin@voxvault.in with passcode: voxadmin2026 or PIN: 987654'
    };
  };

  const logoutAdmin = () => {
    setAdminSession(null);
    localStorage.removeItem('vbv_admin_session');
    setRoleState('customer');
    localStorage.setItem('vbv_role', 'customer');
    addNotification('Admin Signed Out', 'Admin session has been safely closed and locked.', 'system');
  };

  const loginVendor = (vendorIdOrPhone: string, pin?: string) => {
    const query = vendorIdOrPhone.trim().toLowerCase();
    const matchedVendor = vendors.find(
      (v) =>
        v.id === query ||
        v.phone.replace(/\D/g, '') === query.replace(/\D/g, '') ||
        v.businessName.toLowerCase().includes(query) ||
        (v.email && v.email.toLowerCase() === query)
    ) || vendors[0];

    if (!matchedVendor) {
      return { success: false, error: 'No registered business found matching that phone number or ID.' };
    }

    if (pin && pin.trim() && pin.trim() !== '1234' && pin.trim() !== '0000') {
      return { success: false, error: 'Incorrect 4-digit Vendor PIN (Default PIN: 1234).' };
    }

    const session: VendorSession = {
      isAuthenticated: true,
      vendorId: matchedVendor.id,
      businessName: matchedVendor.businessName,
      phone: matchedVendor.phone,
      loginTime: Date.now()
    };
    setVendorSession(session);
    localStorage.setItem('vbv_vendor_session', JSON.stringify(session));
    setRoleState('vendor');
    localStorage.setItem('vbv_role', 'vendor');
    setIsVendorAuthModalOpen(false);
    addNotification(
      'Vendor Hub Unlocked',
      `Logged into dashboard for ${matchedVendor.businessName}.`,
      'system'
    );
    return { success: true };
  };

  const logoutVendor = () => {
    setVendorSession(null);
    localStorage.removeItem('vbv_vendor_session');
    setRoleState('customer');
    localStorage.setItem('vbv_role', 'customer');
    addNotification('Vendor Hub Closed', 'You have been logged out of the Vendor Portal.', 'system');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        lang,
        setLang,
        cities,
        selectedCity,
        setSelectedCity,
        selectedArea,
        setSelectedArea,
        userCoords,
        requestUserLocation,
        isDetectingLocation,
        addCity,
        addAreaToCity,
        categories,
        addCategory,
        deleteCategory,
        addSubcategory,
        deleteSubcategory,
        addServiceToSubcategory,
        removeServiceFromSubcategory,
        filters,
        setFilters,
        resetFilters,
        filteredVendors,
        vendors,
        registerVendor,
        adminCreateVendor,
        deleteVendor,
        updateVendorStatus,
        toggleVendorVerificationBadge,
        toggleVendorFeatured,
        trackVendorMetric,
        updateVendorMedia,
        updateVendorProfile,
        updateVendorVerificationBadges,
        favorites,
        toggleFavorite,
        isFavorite,
        reviews,
        addReview,
        approveReview,
        deleteReview,
        replyToReview,
        leads,
        createLeadBooking,
        updateLeadStatus,
        chatMessages,
        sendChatMessage,
        notifications,
        unreadNotifsCount,
        markNotifsAsRead,
        addNotification,
        reports,
        submitReport,
        resolveReport,
        activeTab,
        setActiveTab,
        selectedVendorForProfile,
        setSelectedVendorForProfile,
        selectedVendorForBooking,
        setSelectedVendorForBooking,
        selectedVendorForChat,
        setSelectedVendorForChat,
        selectedVendorForQR,
        setSelectedVendorForQR,
        isQRScannerOpen,
        setIsQRScannerOpen,
        isLocationModalOpen,
        setIsLocationModalOpen,
        isRegistrationModalOpen,
        setIsRegistrationModalOpen,
        isInfoDrawerOpen,
        setIsInfoDrawerOpen,
        isNotificationsModalOpen,
        setIsNotificationsModalOpen,
        isReportModalOpen,
        setIsReportModalOpen,
        reportingVendor,
        setReportingVendor,
        isAdminAuthenticated,
        isVendorAuthenticated,
        adminSession,
        vendorSession,
        loginAdmin,
        logoutAdmin,
        loginVendor,
        logoutVendor,
        isAdminAuthModalOpen,
        setIsAdminAuthModalOpen,
        isVendorAuthModalOpen,
        setIsVendorAuthModalOpen,
        requestRoleChange
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
