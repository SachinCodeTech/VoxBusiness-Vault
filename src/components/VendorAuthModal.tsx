import React, { useState } from 'react';
import {
  Store,
  Phone,
  KeyRound,
  CheckCircle2,
  X,
  PlusCircle,
  Building2,
  Globe,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const VendorAuthModal: React.FC = () => {
  const {
    isVendorAuthModalOpen,
    setIsVendorAuthModalOpen,
    vendors,
    loginVendor,
    setActiveTab,
    setIsRegistrationModalOpen
  } = useApp();

  const [selectedVendorId, setSelectedVendorId] = useState(vendors[0]?.id || '');
  const [phoneInput, setPhoneInput] = useState('');
  const [pin, setPin] = useState('1234');
  const [authMode, setAuthMode] = useState<'select' | 'phone'>('select');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isVendorAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    const target = authMode === 'select' ? selectedVendorId : phoneInput.trim();

    if (!target) {
      setErrorMsg('Please select a business or enter a registered phone number.');
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      const res = loginVendor(target, pin);
      setIsSubmitting(false);

      if (res.success) {
        setActiveTab('portal');
      } else {
        setErrorMsg(res.error || 'Authentication failed. Please check your credentials.');
      }
    }, 350);
  };

  const handleQuickLogin = (vendorId: string) => {
    loginVendor(vendorId, '1234');
    setActiveTab('portal');
  };

  const handleClose = () => {
    setIsVendorAuthModalOpen(false);
    setErrorMsg(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vendor-auth-title"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden animate-scale-up text-left">
        {/* Top Header Accent */}
        <div className="h-2 bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700" />

        {/* Modal Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close vendor login"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-7 space-y-5">
          {/* Header */}
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0 shadow-xs">
              <Store className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-900/40 px-2 py-0.5 rounded-md">
                  Vendor Route Access
                </span>
                <span className="text-[10px] text-slate-400 font-mono">RBAC-L2</span>
              </div>
              <h3 id="vendor-auth-title" className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                Vendor Hub Login
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Log into your registered business portal to view customer leads, manage operating types, and configure QR codes.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800/80 rounded-2xl text-xs text-rose-800 dark:text-rose-200 animate-shake">
              <span className="font-bold">Error: </span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Auth Mode Toggle */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setAuthMode('select')}
              className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
                authMode === 'select'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              Choose Registered Business
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('phone')}
              className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
                authMode === 'phone'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              Phone / ID Lookup
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'select' ? (
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Select Registered Business
                </label>
                <select
                  value={selectedVendorId}
                  onChange={(e) => setSelectedVendorId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                >
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.businessName} ({v.city} · {v.businessType === 'online' ? 'Online' : v.businessType === 'hybrid' ? 'Hybrid' : 'Physical'})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Registered Business Phone or ID
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="e.g. 98250 12345 or V001"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Vendor Access PIN
                </label>
                <span className="text-[10px] text-slate-400">Default PIN: 1234</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="4-digit PIN"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono tracking-widest"
                />
              </div>
            </div>

            {/* Quick 1-Click Demo Vendor Access */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                Quick 1-Click Access for Evaluation:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {vendors.slice(0, 4).map((v) => (
                  <button
                    type="button"
                    key={v.id}
                    onClick={() => handleQuickLogin(v.id)}
                    className="p-2 rounded-xl bg-white dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 hover:border-sky-500 text-left transition-all flex items-center justify-between group"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-slate-900 dark:text-white text-xs truncate group-hover:text-sky-600 dark:group-hover:text-sky-400">
                        {v.businessName}
                      </div>
                      <div className="text-[10px] text-slate-400 capitalize">
                        {v.city} · {v.businessType}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="w-1/3 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white text-xs font-bold transition-all shadow-md shadow-sky-600/20 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Checking...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Open Vendor Hub</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* New Registration CTA */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">Not registered yet?</span>
            <button
              type="button"
              onClick={() => {
                setIsVendorAuthModalOpen(false);
                setIsRegistrationModalOpen(true);
              }}
              className="text-sky-600 hover:text-sky-700 dark:text-sky-400 font-bold flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Register Gujarat Business</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
