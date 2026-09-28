import React, { useState } from 'react';
import { X, ExternalLink, Shield, FileText, Smartphone, Info, GitCommit, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const InfoDrawer: React.FC = () => {
  const { isInfoDrawerOpen, setIsInfoDrawerOpen } = useApp();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeModal) {
          setActiveModal(null);
        } else {
          setIsInfoDrawerOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, setIsInfoDrawerOpen]);

  if (!isInfoDrawerOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsInfoDrawerOpen(false);
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] relative">
        {/* Header matching user image: Info handwritten/clean blue style */}
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="w-8"></div>
          <h2 className="text-2xl font-serif italic font-semibold text-sky-600 tracking-wide">
            Info
          </h2>
          <button
            onClick={() => setIsInfoDrawerOpen(false)}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            aria-label="Close Info"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-left">
          {/* PRODUCT */}
          <div>
            <div className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2.5">
              Product
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setIsInfoDrawerOpen(false)}
                className="w-full text-left px-4 py-3 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-xl text-slate-800 dark:text-slate-200 font-medium text-sm flex items-center justify-between transition-colors"
              >
                <span>Open App</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveModal('about')}
                className="w-full text-left px-4 py-3 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-xl text-slate-800 dark:text-slate-200 font-medium text-sm flex items-center justify-between transition-colors"
              >
                <span>About</span>
                <Info className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveModal('version')}
                className="w-full text-left px-4 py-3 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-xl text-slate-800 dark:text-slate-200 font-medium text-sm flex items-center justify-between transition-colors"
              >
                <span>Version History</span>
                <GitCommit className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveModal('store')}
                className="w-full text-left px-4 py-3 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-xl text-slate-800 dark:text-slate-200 font-medium text-sm flex items-center justify-between transition-colors"
              >
                <span>Store Listing</span>
                <Smartphone className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* LEGAL INFORMATION */}
          <div>
            <div className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2.5">
              Legal Information
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setActiveModal('privacy')}
                className="w-full text-left px-4 py-3 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-xl text-slate-800 dark:text-slate-200 font-medium text-sm flex items-center justify-between transition-colors"
              >
                <span>Privacy Policy</span>
                <Shield className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveModal('terms')}
                className="w-full text-left px-4 py-3 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-xl text-slate-800 dark:text-slate-200 font-medium text-sm flex items-center justify-between transition-colors"
              >
                <span>Terms of Use</span>
                <FileText className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* COMPANY INFO (Matching user's exact screenshot) */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-3">
              Company Info
            </div>
            <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 dark:text-white">Company:</span>
                <span>CodeTech</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 dark:text-white">Lead Developer:</span>
                <span>Sachin Sheth</span>
              </div>
              <div className="flex items-start gap-2 pt-0.5">
                <span className="font-semibold text-slate-900 dark:text-white shrink-0">Email:</span>
                <a
                  href="mailto:codetech.appstore@gmail.com"
                  className="text-sky-600 dark:text-sky-400 hover:underline break-all"
                >
                  codetech.appstore@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Sub-dialogs */}
        {activeModal && (
          <div className="absolute inset-0 bg-white dark:bg-slate-900 p-6 flex flex-col z-10 animate-fade-in overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                {activeModal === 'about' && 'About Vox Business Vault'}
                {activeModal === 'version' && 'Version History'}
                {activeModal === 'store' && 'Store Listing Details'}
                {activeModal === 'privacy' && 'Privacy Policy'}
                {activeModal === 'terms' && 'Terms of Use'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-sm text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed flex-1">
              {activeModal === 'about' && (
                <>
                  <p>
                    <strong>Vox Business Vault</strong> is Gujarat’s dedicated local services marketplace and verified vendor directory, architected and engineered by <strong>CodeTech</strong> under the leadership of <strong>Sachin Sheth</strong>.
                  </p>
                  <p>
                    Connecting Gujarat residents with vetted electricians, plumbers, carpenters, AC repair specialists, house cleaners, painters, and technicians across Ahmedabad, Surat, Vadodara, Rajkot, Gandhinagar, and beyond.
                  </p>
                  <div className="bg-sky-50 dark:bg-sky-950/40 p-4 rounded-xl text-sky-900 dark:text-sky-200 text-xs">
                    "Find trusted local vendors and services near you — quickly, simply, and directly."
                  </div>
                </>
              )}

              {activeModal === 'version' && (
                <div className="space-y-4">
                  <div className="border-l-2 border-sky-500 pl-3">
                    <div className="font-semibold text-slate-900 dark:text-white">v1.4.0 (Latest Production)</div>
                    <div className="text-xs text-slate-400">September 2026</div>
                    <p className="text-xs mt-1">
                      Integrated interactive OpenStreetMap Leaflet engine, UPI booking token payment gateway, multi-tier Gujarat location hierarchy, and instant vendor QR code print engine.
                    </p>
                  </div>
                  <div className="border-l-2 border-slate-200 dark:border-slate-700 pl-3">
                    <div className="font-semibold text-slate-900 dark:text-white">v1.2.0</div>
                    <div className="text-xs text-slate-400">June 2026</div>
                    <p className="text-xs mt-1">
                      Added Gujarati and Hindi localization, push notifications, customer reviews with moderation, and vendor inquiry analytics.
                    </p>
                  </div>
                </div>
              )}

              {activeModal === 'store' && (
                <>
                  <p>
                    <strong>App Package:</strong> in.codetech.voxbusinessvault
                  </p>
                  <p>
                    <strong>Category:</strong> Business & Local Service Discovery
                  </p>
                  <p>
                    <strong>Target Region:</strong> Gujarat, India
                  </p>
                  <p>
                    <strong>Supported Platforms:</strong> Progressive Web App (PWA), Android Mobile, Responsive Desktop (1440px).
                  </p>
                </>
              )}

              {activeModal === 'privacy' && (
                <>
                  <p>
                    CodeTech respects your privacy. We never share customer phone numbers or private addresses publicly.
                  </p>
                  <p>
                    Location permissions are strictly utilized client-side to calculate distance to nearby Gujarat service providers and are never sold to third-party ad networks.
                  </p>
                </>
              )}

              {activeModal === 'terms' && (
                <>
                  <p>
                    By registering as a vendor or hiring a service provider on Vox Business Vault, users agree to transparent pricing and verified identification.
                  </p>
                  <p>
                    Vendors are independent contractors verified according to their uploaded government credentials.
                  </p>
                </>
              )}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="mt-4 w-full py-2.5 bg-slate-900 text-white dark:bg-sky-600 font-medium rounded-xl text-xs"
            >
              Back to Info
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
