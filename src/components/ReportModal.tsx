import React, { useState } from 'react';
import { X, AlertTriangle, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ReportItem } from '../types';

export const ReportModal: React.FC = () => {
  const {
    isReportModalOpen,
    setIsReportModalOpen,
    reportingVendor,
    setReportingVendor,
    submitReport
  } = useApp();

  const [reason, setReason] = useState<ReportItem['reason']>('wrong_phone');
  const [details, setDetails] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');

  const handleClose = () => {
    setIsReportModalOpen(false);
    setReportingVendor(null);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isReportModalOpen || !reportingVendor) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim() || !reporterName.trim()) return;

    submitReport(
      reportingVendor.id,
      reportingVendor.businessName,
      reason,
      details.trim(),
      reporterName.trim(),
      reporterPhone.trim()
    );

    handleClose();
    alert('Thank you! Your report has been submitted to CodeTech moderation.');
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col p-6 text-left relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-base">
            <AlertTriangle className="w-5 h-5" />
            <span>Report Incorrect Listing</span>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors"
            aria-label="Close report modal"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="text-xs text-slate-500">
            Reporting: <strong className="text-slate-900 dark:text-white">{reportingVendor.businessName}</strong> ({reportingVendor.city})
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Select Reason *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as any)}
              className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              <option value="wrong_phone">Incorrect or unreachable phone number</option>
              <option value="wrong_location">Wrong physical address / not located here</option>
              <option value="duplicate">Duplicate listing of existing business</option>
              <option value="fake_business">Fake or fraudulent service provider</option>
              <option value="abuse">Unprofessional conduct or rate scam</option>
              <option value="other">Other issue</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Provide Specific Details *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Explain the inaccuracy so our admin team can verify and fix it..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              required
              placeholder="Your Name"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
            <input
              type="tel"
              placeholder="Phone (optional)"
              value={reporterPhone}
              onChange={(e) => setReporterPhone(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Report to Moderation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
