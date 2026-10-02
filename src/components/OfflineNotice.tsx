import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw, X, AlertCircle } from 'lucide-react';

export const OfflineNotice: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setIsDismissed(false);
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
      }, 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setIsDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register PWA service worker if supported
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      import('virtual:pwa-register')
        .then(({ registerSW }) => {
          registerSW({
            immediate: true,
            onNeedRefresh() {
              console.log('New content available for offline caching');
            },
            onOfflineReady() {
              console.log('App ready to work offline across Gujarat');
            }
          });
        })
        .catch(() => {
          // Development or fallback
        });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setIsChecking(true);
    // Attempt ping or fetch to verify actual connectivity
    fetch('/favicon.svg', { cache: 'no-store', method: 'HEAD' })
      .then(() => {
        setIsOffline(false);
        setIsChecking(false);
        setShowReconnected(true);
        setTimeout(() => setShowReconnected(false), 3000);
      })
      .catch(() => {
        setIsChecking(false);
      });
  };

  // 1. Reconnected Toast
  if (showReconnected) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-fade-in border border-emerald-400"
      >
        <Wifi className="w-4 h-4 animate-bounce" />
        <span>Back Online · Gujarat Live Registry Connected</span>
      </div>
    );
  }

  // 2. Offline Notice Banner
  if (isOffline && !isDismissed) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="fixed bottom-20 md:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-amber-500/40 animate-fade-in text-xs"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <WifiOff className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold text-amber-400 text-xs tracking-wide">
                You are currently offline
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            </div>
            <p className="text-slate-300 text-[11.5px] leading-relaxed">
              Vox Business Vault is operating in cached offline mode. You can still search verified Gujarat vendors, view saved phone numbers, and browse cached categories.
            </p>

            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={handleRetry}
                disabled={isChecking}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
                <span>{isChecking ? 'Checking...' : 'Check Connection'}</span>
              </button>

              <button
                onClick={() => setIsDismissed(true)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsDismissed(true)}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
            aria-label="Close offline banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
};
