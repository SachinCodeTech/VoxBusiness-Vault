import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminAuthModal: React.FC = () => {
  const {
    isAdminAuthModalOpen,
    setIsAdminAuthModalOpen,
    loginAdmin,
    setActiveTab
  } = useApp();

  const [adminEmail, setAdminEmail] = useState('admin@voxvault.in');
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  if (!isAdminAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const res = loginAdmin({
        email: adminEmail,
        passcode
      });

      setIsSubmitting(false);

      if (res.success) {
        setActiveTab('portal');
      } else {
        setAttemptCount((prev) => prev + 1);
        setErrorMsg(res.error || 'Invalid credentials. Access denied.');
      }
    }, 400);
  };

  const handleFillDemo = (type: 'password' | 'pin') => {
    setAdminEmail('admin@voxvault.in');
    if (type === 'password') {
      setPasscode('voxadmin2026');
    } else {
      setPasscode('987654');
    }
    setErrorMsg(null);
  };

  const handleClose = () => {
    setIsAdminAuthModalOpen(false);
    setErrorMsg(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-auth-title"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden animate-scale-up text-left">
        {/* Top Security Banner Accent */}
        <div className="h-2 bg-gradient-to-r from-indigo-600 via-sky-500 to-indigo-700" />

        {/* Modal Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close security gate"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-7 space-y-5">
          {/* Header */}
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 shadow-xs">
              <Lock className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/40 px-2 py-0.5 rounded-md">
                  Admin Route Security
                </span>
                <span className="text-[10px] text-slate-400 font-mono">RBAC-L3</span>
              </div>
              <h3 id="admin-auth-title" className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                Admin Authentication Required
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Super Admin credentials or security passcode required to access the directory control center.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800/80 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-200 animate-shake">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold">Access Denied: </span>
                <span>{errorMsg}</span>
                {attemptCount >= 2 && (
                  <div className="mt-1 text-[11px] text-rose-600 dark:text-rose-300 font-medium">
                    Tip: Click one of the quick test buttons below to pre-fill verified master credentials.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Admin Account Email / ID
              </label>
              <input
                type="text"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@voxvault.in"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Master Passcode / 6-Digit PIN
                </label>
                <span className="text-[10px] text-slate-400">Encrypted Session</span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter master passcode or PIN"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Test Demo Credentials Fillers */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <KeyRound className="w-3 h-3 text-indigo-500" />
                  <span>Authorized Master Credentials</span>
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                  VBV Secure
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleFillDemo('password')}
                  className="p-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-indigo-400 text-left transition-all group"
                >
                  <span className="text-[10px] text-slate-400 block group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Master Passcode</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">voxadmin2026</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleFillDemo('pin')}
                  className="p-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-indigo-400 text-left transition-all group"
                >
                  <span className="text-[10px] text-slate-400 block group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Security PIN</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">987654</span>
                </button>
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
                className="w-2/3 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Unlock Admin Console</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Security Rules Notice */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-start gap-2 text-[10px] text-slate-400 leading-relaxed">
            <Shield className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
            <span>
              Role-Based Access Control (RBAC): Unauthenticated visitors cannot view or alter vendor verification records, categories, or audit logs.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
