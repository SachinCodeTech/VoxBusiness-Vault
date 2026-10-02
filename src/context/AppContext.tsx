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
  SearchFilters
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
  sortBy: 'recommended'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem('vbv_role') as UserRole) || 'customer';
  });

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

  // Initialize clean state - purge any previous mock seed from localStorage
  const [vendors, setVendors] = useState<Vendor[]>(() => {
    if (!localStorage.getItem('vbv_seed_purged_v2')) {
      localStorage.removeItem('vbv_vendors');
      return [];
    }
    const saved = localStorage.getItem('vbv_vendors');
    if (saved) {
      try {
        const parsed: Vendor[] = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
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

      // City filter
      if (filters.city && filters.city !== 'All Gujarat Cities') {
        if (vendor.city.toLowerCase() !== filters.city.toLowerCase()) {
          return false;
        }
      }

      // Area filter
      if (filters.area && filters.area !== 'All Areas') {
        if (vendor.area.toLowerCase() !== filters.area.toLowerCase()) {
          return false;
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

      // Free text query (checks business name, owner name, category, services, area, pincode)
      if (filters.query && filters.query.trim() !== '') {
        const q = filters.query.toLowerCase().trim();
        const matchName = vendor.businessName.toLowerCase().includes(q);
        const matchCategory = vendor.categoryId.toLowerCase().includes(q);
        const matchArea = vendor.area.toLowerCase().includes(q);
        const matchCity = vendor.city.toLowerCase().includes(q);
        const matchPincode = vendor.pincode.includes(q);
        const matchServices = vendor.services.some((s) => s.toLowerCase().includes(q));

        if (!matchName && !matchCategory && !matchArea && !matchCity && !matchPincode && !matchServices) {
          return false;
        }
      }

      return true;
    })
    .map((vendor) => {
      let distanceKm: number | undefined;
      if (userCoords) {
        distanceKm = calculateDistanceKm(userCoords.lat, userCoords.lng, vendor.lat, vendor.lng);
      } else {
        const cityObj = cities.find((c) => c.name.toLowerCase() === selectedCity.toLowerCase());
        if (cityObj) {
          distanceKm = calculateDistanceKm(cityObj.lat, cityObj.lng, vendor.lat, vendor.lng);
        }
      }
      return {
        ...vendor,
        distanceKm
      };
    })
    .filter((vendor) => {
      // Dynamic Distance Range filter
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

    const newId = `VND-GJ-${Date.now().toString().slice(-4)}`;
    const qrToken = `VBV-${data.businessName.slice(0, 4).toUpperCase()}-${data.pincode || 'GUJ'}-${Date.now().toString().slice(-4)}`;

    const newVendor: Vendor = {
      ...data,
      id: newId,
      rating: 5.0,
      reviewCount: 0,
      verificationStatus: 'pending',
      isPhoneVerified: true,
      isLocationVerified: true,
      isDocsVerified: false,
      isFeatured: false,
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
      `${data.businessName} (${data.city}) submitted for verification.`,
      'system'
    );

    return {
      success: true,
      vendorId: newId
    };
  };

  const adminCreateVendor = (data: Omit<Vendor, 'id' | 'rating' | 'reviewCount' | 'stats' | 'createdAt' | 'qrToken'> & { rating?: number; isFeatured?: boolean }) => {
    const newId = `VND-ADM-${Date.now().toString().slice(-4)}`;
    const qrToken = `VBV-${data.businessName.slice(0, 4).toUpperCase()}-${data.pincode || 'GUJ'}-${Date.now().toString().slice(-4)}`;

    const newVendor: Vendor = {
      ...data,
      id: newId,
      rating: data.rating !== undefined ? data.rating : 5.0,
      reviewCount: 1,
      verificationStatus: data.verificationStatus || 'verified',
      isPhoneVerified: true,
      isLocationVerified: true,
      isDocsVerified: data.isDocsVerified !== undefined ? data.isDocsVerified : true,
      isFeatured: !!data.isFeatured,
      stats: {
        views: 24,
        calls: 2,
        whatsapp: 1,
        directions: 1,
        qrScans: 1,
        enquiries: 0,
        totalEarnings: 0
      },
      qrToken,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setVendors((prev) => [newVendor, ...prev]);

    addNotification(
      'Admin Created Listing',
      `${data.businessName} (${data.city}) added via Admin Master Controller.`,
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
        setReportingVendor
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
