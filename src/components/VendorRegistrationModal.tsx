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
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';

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

    // Duplicate protection check at Step 1
    if (currentStep === 1) {
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
    }

    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Final Submit
      const servicesArray = servicesInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = registerVendor({
        businessName: businessName.trim(),
        ownerName: ownerName.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.replace(/\D/g, ''),
        email: email.trim() || undefined,
        categoryId,
        subcategoryId,
        services: servicesArray.length > 0 ? servicesArray : ['General Service', 'Doorstep Repair'],
        state: 'Gujarat',
        city,
        area,
        address: address.trim() || `${area}, ${city}`,
        pincode: pincode.trim(),
        lat: currentCityObj.lat + (Math.random() - 0.5) * 0.05,
        lng: currentCityObj.lng + (Math.random() - 0.5) * 0.05,
        description: description.trim() || `Experienced ${selectedCatObj.name} service provider serving ${area}, ${city}. Quality workmanship with transparent local pricing.`,
        experienceYears: Number(experienceYears) || 3,
        startingPrice: Number(startingPrice) || 199,
        verificationStatus: 'pending',
        isPhoneVerified: true,
        isLocationVerified: true,
        isDocsVerified: false,
        businessHours: {
          days: 'Mon - Sun',
          openTime,
          closeTime,
          isOpenToday: true
        },
        serviceAtCustomerLocation,
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
  };

  // Close on Escape key
  useEffect(() => {
    if (!isRegistrationModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
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
              Vendor Registration — Gujarat Only
            </h3>
            <p className="text-xs text-slate-500">
              Step {currentStep} of 6 · Join Gujarat’s leading local service network
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
                Vendor ID: <strong>{registeredVendorId}</strong> · Status: Pending Admin Verification
              </p>
            </div>

            <div className="p-4 bg-sky-50/60 dark:bg-sky-950/40 rounded-2xl border border-sky-100 dark:border-sky-900 text-left text-xs space-y-2 text-sky-900 dark:text-sky-200">
              <p>
                ✓ Your business profile is now created with a permanent unique QR token.
              </p>
              <p>
                ✓ You can start sharing your profile with customers immediately.
              </p>
              <p>
                ✓ CodeTech admin team will verify your phone and address within 24 hours to award the <strong>Verified Business ✓</strong> badge.
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

            {/* STEP 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  1. Basic Contact Information
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Business / Shop Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Patel Electricals & Solar"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Proprietor / Owner Name *
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
                      WhatsApp Number (with 91 prefix) *
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
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="contact@business.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Category & Services */}
            {currentStep === 2 && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  2. Business Category & Services
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
                    Services Offered (Comma separated) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Wiring Repair, Switchboard Fitting, Fan Installation, MCB Replacement"
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

            {/* STEP 3: Gujarat Location */}
            {currentStep === 3 && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  3. Gujarat Location Hierarchy
                </div>

                <div className="p-3 bg-sky-50 dark:bg-sky-950/40 rounded-xl text-xs text-sky-800 dark:text-sky-300">
                  State: <strong>Gujarat, India (Mandatory)</strong>
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
                    Shop / Service Hub Address
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
              </div>
            )}

            {/* STEP 4: Business Details */}
            {currentStep === 4 && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  4. Experience, Hours & Rates
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Business Profile Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe your specialization, warranty policy, customer response time..."
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
              </div>
            )}

            {/* STEP 5: Media & Photos */}
            {currentStep === 5 && (
              <div className="space-y-3.5">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  5. Business Media, Banner, Snaps & Live Video
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Full Header Banner Photo URL *
                  </label>
                  <input
                    type="url"
                    placeholder="https://... (high quality horizontal header banner)"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                  <span className="text-[10px] text-slate-400">
                    Displays edge-to-edge as your official shop/service header banner.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Business Logo / Avatar Photo URL *
                  </label>
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Current Business Snaps / Work Site Photos (Comma-separated URLs)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="https://...photo1.jpg, https://...photo2.jpg"
                    value={currentSnapsInput}
                    onChange={(e) => setCurrentSnapsInput(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                  <span className="text-[10px] text-slate-400">
                    Photos of your ongoing repair work, service equipment, or local team in Gujarat.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Very Short Video Clip of Live Business (MP4 / WebM / Reel URL)
                  </label>
                  <input
                    type="url"
                    placeholder="https://assets.mixkit.co/videos/...mp4"
                    value={liveVideoUrl}
                    onChange={(e) => setLiveVideoUrl(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                  <span className="text-[10px] text-slate-400">
                    A 5-15 second work clip for customers to see you in action.
                  </span>
                </div>

                <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <img
                    src={bannerUrl || logoUrl}
                    alt="Preview"
                    className="w-20 h-14 rounded-xl object-cover border border-slate-200"
                  />
                  <div className="text-xs text-slate-500">
                    Your banner, work snaps, and live business video reel will be showcased prominently on your verified profile.
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: Verification Confirmation */}
            {currentStep === 6 && (
              <div className="space-y-3 text-center py-4">
                <div className="w-12 h-12 bg-sky-100 dark:bg-sky-950 text-sky-600 rounded-full flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-6 h-6" />
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Ready to Submit for Gujarat Verification
                </h4>

                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  By submitting, you certify that <strong>{businessName}</strong> operates within {city}, Gujarat, and holds necessary electrical/technical licenses.
                </p>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl text-left text-xs space-y-1.5 border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400">Business:</span>{' '}
                    <strong className="text-slate-800 dark:text-slate-200">{businessName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Category:</span>{' '}
                    <span className="text-slate-700 dark:text-slate-300">{selectedCatObj.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Location:</span>{' '}
                    <span className="text-slate-700 dark:text-slate-300">
                      {area}, {city}, Gujarat
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Direct Phone:</span>{' '}
                    <span className="text-slate-700 dark:text-slate-300">{phone}</span>
                  </div>
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
