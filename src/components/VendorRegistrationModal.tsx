import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Building2,
  Tag,
  MapPin,
  Clock,
  Image as ImageIcon,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Globe,
  Store,
  Smartphone,
  Mail,
  MessageCircle,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BusinessType, OnlineContactChannel } from '../types';

export const VendorRegistrationModal: React.FC = () => {
  const {
    isRegistrationModalOpen,
    setIsRegistrationModalOpen,
    cities,
    categories,
    registerVendor,
    setSelectedVendorForQR,
    vendors
  } = useApp();

  const [currentStep, setCurrentStep] = useState(1);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // Business Operating Type
  const [businessType, setBusinessType] = useState<BusinessType>('physical');
  const [primaryOnlineChannel, setPrimaryOnlineChannel] = useState<OnlineContactChannel>('website');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [appStoreUrl, setAppStoreUrl] = useState('');
  const [serviceRegionsInput, setServiceRegionsInput] = useState('All Gujarat, Pan-India');
  const [showPublicAddress, setShowPublicAddress] = useState(true);

  // Form states
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [whatsapp, setWhatsapp] = useState('91');
  const [email, setEmail] = useState('');

  const [categoryId, setCategoryId] = useState('electrician');
  const [subcategoryId, setSubcategoryId] = useState('home_electrician');
  const [servicesInput, setServicesInput] = useState('Wiring Repair, Switchboard Fitting, Fan Installation');

  const [city, setCity] = useState('Ahmedabad');
  const [area, setArea] = useState('Satellite');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('380015');

  const [description, setDescription] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [startingPrice, setStartingPrice] = useState(249);
  const [openTime, setOpenTime] = useState('09:00');
  const [closeTime, setCloseTime] = useState('20:00');
  const [serviceAtCustomerLocation, setServiceAtCustomerLocation] = useState(true);

  const [logoUrl, setLogoUrl] = useState('https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=150&auto=format&fit=crop&q=80');
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&auto=format&fit=crop&q=80');
  const [currentSnapsInput, setCurrentSnapsInput] = useState('https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80, https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=80');
  const [liveVideoUrl, setLiveVideoUrl] = useState('https://assets.mixkit.co/videos/preview/mixkit-hands-of-an-electrician-connecting-wires-41584-large.mp4');
  const [registeredVendorId, setRegisteredVendorId] = useState<string | null>(null);

  const currentCityObj = cities.find((c) => c.name.toLowerCase() === city.toLowerCase()) || cities[0];
  const selectedCatObj = categories.find((c) => c.id === categoryId) || categories[0];

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setDuplicateWarning(null);

    // Validation for Step 1
    if (currentStep === 1) {
      if (businessType === 'online' && !primaryOnlineChannel) {
        setDuplicateWarning('Please choose your primary online contact or destination channel.');
        return;
      }
    }

    // Duplicate check at Step 2 (Contact Info)
    if (currentStep === 2) {
      const cleanPhone = phone.replace(/\D/g, '');
      const existing = vendors.find(
        (v) =>
          v.phone.replace(/\D/g, '') === cleanPhone ||
          v.businessName.toLowerCase() === businessName.trim().toLowerCase()
      );
      if (existing) {
        setDuplicateWarning(
          `Notice: A similar business "${existing.businessName}" in ${existing.city} is already registered. If this is your business, you can claim or verify it.`
        );
      }

      // Online business destination validation
      if (businessType === 'online') {
        if (primaryOnlineChannel === 'website' && !websiteUrl.trim() && !email.trim()) {
          setDuplicateWarning('Please provide your business website/store URL or email address.');
          return;
        }
      }
    }

    // Step 4 (Location) validation
    if (currentStep === 4) {
      if (businessType === 'physical' && !address.trim()) {
        setDuplicateWarning('Physical businesses require a valid shop or office street address.');
        return;
      }
    }

    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Final Submit
      const servicesArray = servicesInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const isOnline = businessType === 'online';
      const regionsArray = serviceRegionsInput
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean);

      const res = registerVendor({
        businessName: businessName.trim(),
        ownerName: ownerName.trim(),
        businessType,
        phone: phone.trim(),
        whatsapp: whatsapp.replace(/\D/g, ''),
        email: email.trim() || undefined,
        websiteUrl: websiteUrl.trim() || undefined,
        appStoreUrl: appStoreUrl.trim() || undefined,
        primaryOnlineChannel: businessType !== 'physical' ? primaryOnlineChannel : undefined,
        serviceRegions: businessType !== 'physical' ? (regionsArray.length > 0 ? regionsArray : ['All Gujarat', 'Pan-India']) : ['Gujarat'],
        showPublicAddress: isOnline ? false : showPublicAddress,
        categoryId,
        subcategoryId,
        services: servicesArray.length > 0 ? servicesArray : ['General Service', 'Doorstep Repair'],
        state: 'Gujarat',
        city: city || 'Ahmedabad',
        area: isOnline ? undefined : (area || 'Satellite'),
        address: isOnline ? undefined : (address.trim() || `${area}, ${city}`),
        pincode: isOnline ? undefined : (pincode.trim() || '380015'),
        lat: isOnline ? undefined : currentCityObj.lat + (Math.random() - 0.5) * 0.05,
        lng: isOnline ? undefined : currentCityObj.lng + (Math.random() - 0.5) * 0.05,
        description: description.trim() || `${businessType === 'online' ? 'Online' : 'Verified'} ${selectedCatObj.name} provider serving ${city}, Gujarat. Transparent pricing and professional delivery.`,
        experienceYears: Number(experienceYears) || 3,
        startingPrice: Number(startingPrice) || 199,
        verificationStatus: 'pending',
        isPhoneVerified: true,
        isEmailVerified: Boolean(email.trim()),
        isLocationVerified: isOnline ? false : true,
        isDocsVerified: false,
        isIdentityVerified: false,
        businessHours: {
          days: 'Mon - Sun',
          openTime,
          closeTime,
          isOpenToday: true
        },
        serviceAtCustomerLocation: isOnline ? false : serviceAtCustomerLocation,
        logoUrl: logoUrl.trim(),
        bannerUrl: bannerUrl.trim() || undefined,
        currentSnaps: currentSnapsInput
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        liveVideoUrl: liveVideoUrl.trim() || undefined,
        photos: [logoUrl.trim(), bannerUrl.trim()].filter(Boolean)
      });

      if (!res.success) {
        setDuplicateWarning(res.error || 'Registration failed');
      } else {
        setRegisteredVendorId(res.vendorId || null);
      }
    }
  };

  const handleClose = () => {
    setIsRegistrationModalOpen(false);
    setCurrentStep(1);
    setRegisteredVendorId(null);
    setDuplicateWarning(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isRegistrationModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRegistrationModalOpen]);

  if (!isRegistrationModalOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] relative">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Register Your Business — Gujarat Directory
            </h3>
            <p className="text-xs text-slate-500">
              Step {currentStep} of 6 · {businessType === 'online' ? 'Online Business' : businessType === 'hybrid' ? 'Hybrid Business' : 'Physical Shop/Office'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5">
          <div
            className="bg-sky-600 h-full transition-all duration-300"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>

        {registeredVendorId ? (
          /* Registration Completed Celebration Screen */
          <div className="p-8 text-center space-y-4 flex-1 overflow-y-auto">
            <div className="w-16 h-16 bg-sky-100 dark:bg-sky-950 text-sky-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                Application Submitted Successfully!
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Vendor ID: <strong>{registeredVendorId}</strong> · Operating Type: <strong className="uppercase">{businessType}</strong>
              </p>
            </div>

            <div className="p-4 bg-sky-50/60 dark:bg-sky-950/40 rounded-2xl border border-sky-100 dark:border-sky-900 text-left text-xs space-y-2 text-sky-900 dark:text-sky-200">
              <p>
                ✓ Your business profile is now active with a permanent unique QR token.
              </p>
              {businessType === 'online' ? (
                <p>
                  ✓ <strong>Online Business Advantage:</strong> Zero physical address is published. Customers can visit your website, start WhatsApp chats, or submit direct service enquiries.
                </p>
              ) : (
                <p>
                  ✓ Your physical location is mapped for local customers in {city}, Gujarat.
                </p>
              )}
              <p>
                ✓ Admin team reviews contact and business credentials independently to award verified badges.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleClose}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold"
              >
                Go to Home Directory
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleNext} className="p-6 overflow-y-auto space-y-4 flex-1 text-left">
            {duplicateWarning && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{duplicateWarning}</span>
              </div>
            )}

            {/* STEP 1: Business Operating Model */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    1. Operating Model
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    How does your business operate?
                  </h4>
                  <p className="text-xs text-slate-500">
                    Choose the model that fits your operations. Online businesses are not required to provide a street address.
                  </p>
                </div>

                {/* 3 Interactive Cards */}
                <div className="grid grid-cols-1 gap-2.5">
                  {/* Physical Business */}
                  <div
                    onClick={() => setBusinessType('physical')}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                      businessType === 'physical'
                        ? 'bg-sky-50/80 dark:bg-sky-950/40 border-sky-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-xl shrink-0 ${
                        businessType === 'physical'
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          Physical Business — Shop / Office
                        </span>
                        {businessType === 'physical' && <CheckCircle2 className="w-4 h-4 text-sky-600" />}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        For shops, restaurants, malls, clinics, salons, workshops and other businesses customers can visit in person.
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded-md">
                        Physical address required · Public visibility configurable
                      </span>
                    </div>
                  </div>

                  {/* Online Business */}
                  <div
                    onClick={() => setBusinessType('online')}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                      businessType === 'online'
                        ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-xl shrink-0 ${
                        businessType === 'online'
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Globe className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          Online Business — No Physical Address Required
                        </span>
                        {businessType === 'online' && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        For e-commerce stores, website/app developers, AI services, SaaS products, digital agencies, remote consultants.
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/40 px-2 py-0.5 rounded-md">
                        ✓ No physical street address or map pin required · Permanent QR benefits
                      </span>
                    </div>
                  </div>

                  {/* Hybrid Business */}
                  <div
                    onClick={() => setBusinessType('hybrid')}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                      businessType === 'hybrid'
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-xl shrink-0 ${
                        businessType === 'hybrid'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Store className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          Hybrid Business — Online & Offline
                        </span>
                        {businessType === 'hybrid' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        For restaurants offering dine-in & delivery, retailers with store & online shipping, or on-site & remote work.
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/40 px-2 py-0.5 rounded-md">
                        Physical location + online channels configured independently
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Online Destination for Online / Hybrid */}
                {businessType !== 'physical' && (
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Primary Online Contact or Destination *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'website', label: 'Business Website', icon: Globe },
                        { id: 'whatsapp', label: 'WhatsApp Biz', icon: MessageCircle },
                        { id: 'email', label: 'Business Email', icon: Mail },
                        { id: 'app', label: 'App / Platform', icon: Smartphone }
                      ].map((ch) => {
                        const Icon = ch.icon;
                        const isSelected = primaryOnlineChannel === ch.id;
                        return (
                          <button
                            type="button"
                            key={ch.id}
                            onClick={() => setPrimaryOnlineChannel(ch.id as any)}
                            className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                              isSelected
                                ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
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
            )}

            {/* STEP 2: Basic Contact & Online Links */}
            {currentStep === 2 && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  2. Business Contact & Channels
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Business / Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={businessType === 'online' ? 'e.g. Gujarat Digital Agency & Cloud' : 'e.g. Patel Electricals & Solar'}
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Proprietor / Founder / Owner Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bhavikbhai Patel"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Direct Calling Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98250..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      WhatsApp Number (91 prefix) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="919825014892"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Business Email {businessType === 'online' ? '(Recommended for notifications)' : '(Optional)'}
                  </label>
                  <input
                    type="email"
                    placeholder="contact@business.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                {businessType !== 'physical' && (
                  <div className="space-y-3 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Business Website / Online Store URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://yourstore.com or https://company.in"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        App Link or Digital Platform Link (Optional)
                      </label>
                      <input
                        type="url"
                        placeholder="https://play.google.com/store/apps/... or web app link"
                        value={appStoreUrl}
                        onChange={(e) => setAppStoreUrl(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Category & Services */}
            {currentStep === 3 && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  3. Business Category & Services
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Primary Service Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => {
                      setCategoryId(e.target.value);
                      const cat = categories.find((c) => c.id === e.target.value);
                      if (cat && cat.subcategories.length > 0) {
                        setSubcategoryId(cat.subcategories[0].id);
                      }
                    }}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.gujaratiName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Subcategory
                  </label>
                  <select
                    value={subcategoryId}
                    onChange={(e) => setSubcategoryId(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {selectedCatObj.subcategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Services or Products Offered (Comma separated) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder={
                      businessType === 'online'
                        ? 'Ecommerce Store, Custom React Web Apps, Mobile Apps, Cloud APIs, AI Chatbot Setup'
                        : 'Wiring Repair, Switchboard Fitting, Fan Installation, MCB Replacement'
                    }
                    value={servicesInput}
                    onChange={(e) => setServicesInput(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                  <span className="text-[11px] text-slate-400">
                    Customers search directly by these specific service terms.
                  </span>
                </div>
              </div>
            )}

            {/* STEP 4: Location & Service Coverage */}
            {currentStep === 4 && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  4. Location & Service Coverage
                </div>

                {businessType === 'online' ? (
                  /* Online Business: Region Coverage & Base HQ */
                  <div className="space-y-3">
                    <div className="p-3.5 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-purple-600" />
                        <span>No Physical Street Address Required</span>
                      </div>
                      <p className="text-[11px] text-purple-700 dark:text-purple-300">
                        Your public business profile will not display any street address or map pin. Customers connect directly via website, WhatsApp, call, or online enquiry.
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Gujarat Business Base City (HQ / Registration Base)
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                      >
                        {cities.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name} ({c.gujaratiName})
                          </option>
                        ))}
                      </select>
                      <span className="text-[10px] text-slate-400">
                        Represents where your business is founded or headquartered in Gujarat.
                      </span>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Supported Service / Delivery Regions *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="All Gujarat, Pan-India, Ahmedabad, Surat"
                        value={serviceRegionsInput}
                        onChange={(e) => setServiceRegionsInput(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                      <div className="flex flex-wrap gap-1.5 pt-1.5">
                        {['All Gujarat', 'Pan-India', 'Metro Cities (Ahmd, Surat, Vad)', 'Worldwide'].map((preset) => (
                          <button
                            type="button"
                            key={preset}
                            onClick={() => {
                              if (!serviceRegionsInput.includes(preset)) {
                                setServiceRegionsInput(prev => prev ? `${prev}, ${preset}` : preset);
                              }
                            }}
                            className="text-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700"
                          >
                            + {preset}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Physical / Hybrid Business Location */
                  <div className="space-y-3">
                    <div className="p-3 bg-sky-50 dark:bg-sky-950/40 rounded-xl text-xs text-sky-800 dark:text-sky-300">
                      State: <strong>Gujarat, India</strong> · Visitable Business Premises
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Gujarat City *
                        </label>
                        <select
                          value={city}
                          onChange={(e) => {
                            setCity(e.target.value);
                            const c = cities.find((ci) => ci.name === e.target.value);
                            if (c && c.areas.length > 0) {
                              setArea(c.areas[0]);
                            }
                          }}
                          className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                        >
                          {cities.map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name} ({c.gujaratiName})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Area / Locality in {city} *
                        </label>
                        <select
                          value={area}
                          onChange={(e) => setArea(e.target.value)}
                          className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                        >
                          {currentCityObj.areas.map((a) => (
                            <option key={a} value={a}>
                              {a}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Shop / Office Street Address *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Shop 12, Ground Floor, Complex Name, Main Road"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Gujarat Pincode (6 Digits) *
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        placeholder="380015"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>

                    {/* Public Address Visibility Toggle */}
                    <label className="flex items-center gap-2 pt-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showPublicAddress}
                        onChange={(e) => setShowPublicAddress(e.target.checked)}
                        className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                      />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Display full street address and map route on public profile
                      </span>
                    </label>

                    {businessType === 'hybrid' && (
                      <div className="pt-2">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Online Service / Delivery Regions
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Surat City Doorstep, Gujarat Courier Delivery"
                          value={serviceRegionsInput}
                          onChange={(e) => setServiceRegionsInput(e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STEP 5: Business Details */}
            {currentStep === 5 && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  5. Experience, Hours & Rates
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Business Profile Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe your specialization, warranty policy, customer response time, delivery terms..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Starting Price (₹)
                    </label>
                    <input
                      type="number"
                      min={49}
                      value={startingPrice}
                      onChange={(e) => setStartingPrice(Number(e.target.value))}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Opens At
                    </label>
                    <input
                      type="time"
                      value={openTime}
                      onChange={(e) => setOpenTime(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Closes At
                    </label>
                    <input
                      type="time"
                      value={closeTime}
                      onChange={(e) => setCloseTime(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {businessType !== 'online' && (
                  <label className="flex items-center gap-2 pt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={serviceAtCustomerLocation}
                      onChange={(e) => setServiceAtCustomerLocation(e.target.checked)}
                      className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                    />
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Provide doorstep service at customer residence / office
                    </span>
                  </label>
                )}
              </div>
            )}

            {/* STEP 6: Media, Photos & Confirmation */}
            {currentStep === 6 && (
              <div className="space-y-3.5">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  6. Photos, Banner & Verification Summary
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Official Header Banner Photo URL *
                  </label>
                  <input
                    type="url"
                    placeholder="https://... (high quality horizontal header banner)"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Business Logo / Brand Icon URL *
                  </label>
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Summary Card */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl text-left text-xs space-y-1.5 border border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-1 mb-1">
                    Registration Summary
                  </div>
                  <div>
                    <span className="text-slate-400">Business:</span>{' '}
                    <strong className="text-slate-800 dark:text-slate-200">{businessName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Operating Model:</span>{' '}
                    <span className="uppercase font-bold text-sky-600 dark:text-sky-400">{businessType}</span>
                  </div>
                  {businessType === 'online' ? (
                    <div>
                      <span className="text-slate-400">Service Coverage:</span>{' '}
                      <span className="text-slate-700 dark:text-slate-300">{serviceRegionsInput}</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-slate-400">Location:</span>{' '}
                      <span className="text-slate-700 dark:text-slate-300">
                        {address}, {area}, {city}
                      </span>
                    </div>
                  )}
                  {websiteUrl && (
                    <div>
                      <span className="text-slate-400">Website:</span>{' '}
                      <span className="text-sky-600 truncate">{websiteUrl}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step Controls */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="submit"
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-98"
              >
                <span>{currentStep === 6 ? 'Submit for Verification' : 'Next Step'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
