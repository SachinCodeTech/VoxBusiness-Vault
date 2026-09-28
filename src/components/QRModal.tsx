import React, { useEffect, useRef } from 'react';
import { X, Download, Printer, Share2, CheckCircle2, Copy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { drawQRToCanvas, downloadQRAsPNG, printQRCode } from '../utils/qrGenerator';

export const QRModal: React.FC = () => {
  const { selectedVendorForQR, setSelectedVendorForQR, trackVendorMetric } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedVendorForQR(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedVendorForQR]);

  useEffect(() => {
    if (selectedVendorForQR && canvasRef.current) {
      // Permanent QR Token resolution endpoint
      const permanentQrUrl = `${window.location.origin}?v=${selectedVendorForQR.qrToken || selectedVendorForQR.id}`;
      drawQRToCanvas(canvasRef.current, permanentQrUrl, {
        size: 320,
        margin: 20,
        businessName: selectedVendorForQR.businessName
      });
      trackVendorMetric(selectedVendorForQR.id, 'qrScans');
    }
  }, [selectedVendorForQR]);

  if (!selectedVendorForQR) return null;

  const permanentLink = `${window.location.origin}?v=${selectedVendorForQR.qrToken || selectedVendorForQR.id}`;
  const cleanVanityUrl = `businessvault.in/v/${selectedVendorForQR.qrToken || selectedVendorForQR.id}`;

  const handleDownload = () => {
    if (canvasRef.current) {
      downloadQRAsPNG(canvasRef.current, selectedVendorForQR.businessName);
    }
  };

  const handlePrint = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      printQRCode(
        selectedVendorForQR.businessName,
        selectedVendorForQR.categoryId.replace('_', ' ').toUpperCase(),
        `${selectedVendorForQR.area}, ${selectedVendorForQR.city}`,
        dataUrl
      );
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(permanentLink);
    alert(`Permanent QR Profile Link copied: ${permanentLink}`);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setSelectedVendorForQR(null);
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col p-6 text-center relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="text-left">
            <span className="text-[11px] font-bold tracking-wider uppercase text-sky-600">
              Unique Business QR
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white truncate max-w-[220px]">
              {selectedVendorForQR.businessName}
            </h3>
          </div>
          <button
            onClick={() => setSelectedVendorForQR(null)}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors"
            aria-label="Close QR Modal"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* QR Canvas Display */}
        <div className="my-5 flex flex-col items-center">
          <div className="p-3 bg-white rounded-2xl border-2 border-slate-900/10 shadow-inner">
            <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg" />
          </div>

          <div className="mt-3 flex flex-col items-center gap-1 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">
                {cleanVanityUrl}
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              Permanent Token: {selectedVendorForQR.qrToken}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDownload}
              className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG</span>
            </button>
            <button
              onClick={handlePrint}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Display</span>
            </button>
          </div>

          <button
            onClick={handleCopyLink}
            className="w-full py-2 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/60 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Direct Profile URL</span>
          </button>
        </div>

        <p className="mt-4 text-[11px] text-slate-400">
          Display on counter, business cards, or delivery invoices for direct repeat customer orders.
        </p>
      </div>
    </div>
  );
};
