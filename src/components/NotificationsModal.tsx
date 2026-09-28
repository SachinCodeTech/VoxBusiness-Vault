import React, { useState } from 'react';
import {
  X,
  Bell,
  CheckCircle2,
  Tag,
  CreditCard,
  MessageSquare,
  Sparkles,
  Volume2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationsModal: React.FC = () => {
  const {
    isNotificationsModalOpen,
    setIsNotificationsModalOpen,
    notifications,
    markNotifsAsRead,
    addNotification,
    selectedCity
  } = useApp();

  const [filterType, setFilterType] = useState<'all' | 'order' | 'promo' | 'inquiry'>('all');

  React.useEffect(() => {
    if (!isNotificationsModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsNotificationsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNotificationsModalOpen, setIsNotificationsModalOpen]);

  if (!isNotificationsModalOpen) return null;

  const filteredNotifs = notifications.filter((n) =>
    filterType === 'all' ? true : n.type === filterType
  );

  const handleTriggerTestPromo = () => {
    addNotification(
      `Festival Cleaning Flash Deal · ${selectedCity}`,
      `Verified pest control and home sanitization now starts at ₹399 in ${selectedCity} this week only!`,
      'promo'
    );
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsNotificationsModalOpen(false);
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] text-left relative">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Push Notifications & Alerts
              </h3>
              <p className="text-xs text-slate-500">Order updates & Gujarat promotional alerts</p>
            </div>
          </div>

          <button
            onClick={() => setIsNotificationsModalOpen(false)}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors"
            aria-label="Close notifications modal"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Filter Chips & Test Trigger Button */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                filterType === 'all'
                  ? 'bg-slate-900 text-white dark:bg-sky-600'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('order')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                filterType === 'order'
                  ? 'bg-slate-900 text-white dark:bg-sky-600'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setFilterType('promo')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                filterType === 'promo'
                  ? 'bg-slate-900 text-white dark:bg-sky-600'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Promotions
            </button>
          </div>

          <button
            onClick={markNotifsAsRead}
            className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline shrink-0"
          >
            Mark all read
          </button>
        </div>

        {/* Notification List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {filteredNotifs.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No notifications in this category.
            </div>
          ) : (
            filteredNotifs.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  n.read
                    ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
                    : 'bg-sky-50/50 dark:bg-sky-950/30 border-sky-100 dark:border-sky-900/50 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {n.type === 'order' && (
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                        <CreditCard className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {n.type === 'promo' && (
                      <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                        <Tag className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {n.type === 'inquiry' && (
                      <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center">
                        <MessageSquare className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {n.type === 'system' && (
                      <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {n.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {n.message}
                    </p>

                    {n.amount && (
                      <div className="mt-1 text-[11px] font-bold text-emerald-600">
                        Transaction Amount: ₹{n.amount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Demo Test Trigger */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">Live Web Push System</span>
          <button
            onClick={handleTriggerTestPromo}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Simulate Promotional Push</span>
          </button>
        </div>
      </div>
    </div>
  );
};
