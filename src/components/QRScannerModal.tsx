import React, { useState } from 'react';
import { X, QrCode, Camera, Search, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const QRScannerModal: React.FC = () => {
  const {
    isQRScannerOpen,
    setIsQRScannerOpen,
    vendors,
    setSelectedVendorForProfile
  } = useApp();

  const [inputToken, setInputToken] = useState('');

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsQRScannerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsQRScannerOpen]);

  if (!isQRScannerOpen) return null;

  const handleScanVendor = (vendorId: string) => {
    const v = vendors.find((vend) => vend.id === vendorId);
    if (v) {
      setIsQRScannerOpen(false);
      setSelectedVendorForProfile(v);
    }
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = inputToken.trim().toLowerCase();
    const found = vendors.find(
      (v) =>
        v.qrToken.toLowerCase().includes(token) ||
        v.id.toLowerCase() === token ||
        v.businessName.toLowerCase().includes(token)
    );
    if (found) {
      setIsQRScannerOpen(false);
      setSelectedVendorForProfile(found);
    } else {
      alert('QR Token or Business not found. Try one of the verified vendors below.');
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsQRScannerOpen(false);
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col p-6 text-center relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Scan Vendor QR Code
            </h3>
          </div>
          <button
            onClick={() => setIsQRScannerOpen(false)}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            aria-label="Close QR scanner"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Viewfinder simulation */}
        <div className="my-5 relative w-56 h-56 mx-auto bg-slate-950 rounded-2xl overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-sky-500/80 shadow-inner">
          <div className="absolute inset-4 border-2 border-sky-400 rounded-lg pointer-events-none opacity-80" />
          <div className="w-full h-1 bg-sky-400 shadow-[0_0_15px_#38bdf8] animate-pulse" />
          <div className="mt-4 flex flex-col items-center text-slate-400 text-xs">
            <Camera className="w-6 h-6 mb-1 text-slate-500" />
            <span>Align QR within frame</span>
          </div>
        </div>

        {/* Manual Token input */}
        <form onSubmit={handleTokenSubmit} className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Or enter permanent QR token..."
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              className="w-full text-xs pl-3 pr-8 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              className="absolute right-2 top-2.5 text-sky-600 hover:text-sky-700"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Fast scan simulator shortcuts */}
        <div className="text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
            Test Quick Scans:
          </span>
          <div className="space-y-1.5">
            {vendors.slice(0, 3).map((v) => (
              <button
                key={v.id}
                onClick={() => handleScanVendor(v.id)}
                className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-between text-xs text-slate-700 dark:text-slate-200 transition-colors"
              >
                <span className="truncate">{v.businessName}</span>
                <span className="text-[10px] text-sky-600 font-bold shrink-0">Scan Demo</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
