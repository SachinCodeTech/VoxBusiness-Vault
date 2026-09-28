import React, { useState } from 'react';
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Lock,
  ArrowRight,
  Smartphone,
  Receipt
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

export const BookingPaymentModal: React.FC = () => {
  const {
    selectedVendorForBooking,
    setSelectedVendorForBooking,
    createLeadBooking,
    selectedCity,
    selectedArea
  } = useApp();

  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');

  // Booking fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState(
    selectedArea ? `${selectedArea}, ${selectedCity}` : selectedCity
  );
  const [selectedService, setSelectedService] = useState('');
  const [bookingDate, setBookingDate] = useState('2024-10-02');
  const [bookingTime, setBookingTime] = useState('11:00 AM');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Payment fields
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedRef, setCompletedRef] = useState('');

  const handleClose = () => {
    setSelectedVendorForBooking(null);
    setStep('details');
    setFormError('');
  };

  React.useEffect(() => {
    if (!selectedVendorForBooking) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedVendorForBooking]);

  React.useEffect(() => {
    if (selectedVendorForBooking) {
      if (selectedVendorForBooking.services && selectedVendorForBooking.services.length > 0) {
        setSelectedService(selectedVendorForBooking.services[0]);
      }
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setBookingDate(tomorrow.toISOString().split('T')[0]);
      setStep('details');
      setFormError('');
    }
  }, [selectedVendorForBooking]);

  if (!selectedVendorForBooking) return null;
  const vendor = selectedVendorForBooking;
  const advanceAmount = 199;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !selectedService) {
      setFormError('Please provide your name, phone number, and select a service.');
      return;
    }
    setFormError('');
    setStep('payment');
  };

  const handleCompletePayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const leadId = createLeadBooking(
        {
          vendorId: vendor.id,
          customerName,
          customerPhone,
          customerArea: customerAddress,
          service: selectedService,
          message: notes || `Booked appointment for ${bookingDate} at ${bookingTime}`,
          preferredDate: bookingDate,
          preferredTime: bookingTime,
          quotedPrice: vendor.startingPrice || 499
        },
        advanceAmount,
        paymentMethod
      );

      setCompletedRef(leadId);
      setStep('success');

      // Trigger festive celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    }, 1500);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] relative">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Book Verified Service
              </h3>
              <p className="text-xs text-slate-500">
                {vendor.businessName} · {vendor.city}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* STEP 1: Details */}
        {step === 'details' && (
          <form onSubmit={handleProceedToPayment} className="p-6 overflow-y-auto space-y-4 flex-1 text-left">
            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
                <span>⚠️</span>
                <span>{formError}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Select Required Service *
              </label>
              <select
                required
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
              >
                <option value="">-- Choose from available services --</option>
                {vendor.services.map((s, idx) => (
                  <option key={idx} value={s}>
                    {s} (Est. from ₹{vendor.startingPrice ? vendor.startingPrice + idx * 50 : 199})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ketan Shah"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Mobile Number (For WhatsApp / Call) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98980..."
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Preferred Time Slot
                </label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="09:00 AM - 11:00 AM">Morning (09:00 AM - 11:00 AM)</option>
                  <option value="11:00 AM - 01:00 PM">Noon (11:00 AM - 01:00 PM)</option>
                  <option value="02:00 PM - 05:00 PM">Afternoon (02:00 PM - 05:00 PM)</option>
                  <option value="05:00 PM - 08:00 PM">Evening (05:00 PM - 08:00 PM)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Gujarat Doorstep Address *
              </label>
              <input
                type="text"
                required
                placeholder="House / Flat No., Society Name, Area, Pincode"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Specific problem or notes (optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Please bring spare capacitor, 2nd floor flat without lift"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            {/* Advance Token Summary Box */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Advance Doorstep Visit Token
                </span>
                <span className="text-[11px] text-slate-500">
                  Adjusted against final invoice upon completion
                </span>
              </div>
              <span className="text-base font-extrabold text-sky-600 dark:text-sky-400">
                ₹{advanceAmount}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98"
            >
              <span>Proceed to Secure Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: Secure Payment Gateway */}
        {step === 'payment' && (
          <div className="p-6 overflow-y-auto space-y-5 flex-1 text-left">
            {/* 256-bit SSL trust banner */}
            <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-900/60 text-xs text-emerald-800 dark:text-emerald-300">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">256-Bit SSL Encrypted Payment Gateway</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/80 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>

            {/* Order summary */}
            <div className="text-xs border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <span className="text-slate-400">Booking:</span>{' '}
                <strong className="text-slate-800 dark:text-slate-200">{selectedService}</strong>
              </div>
              <div className="text-right">
                <span className="text-slate-400">Payable Advance:</span>{' '}
                <strong className="text-base text-slate-900 dark:text-white">₹{advanceAmount}</strong>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Choose Payment Method
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-bold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Smartphone className="w-4 h-4 mx-auto mb-1 text-sky-600" />
                  <span className="text-xs block">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    paymentMethod === 'card'
                      ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-bold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1 text-sky-600" />
                  <span className="text-xs block">Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-bold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Receipt className="w-4 h-4 mx-auto mb-1 text-sky-600" />
                  <span className="text-xs block">NetBanking</span>
                </button>
              </div>
            </div>

            {/* UPI Form */}
            {paymentMethod === 'upi' && (
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Instant UPI apps supported: Google Pay, PhonePe, Paytm, BHIM, Cred
                </div>
                <input
                  type="text"
                  placeholder="Enter UPI ID (e.g. mobile@okhdfcbank)"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <div className="text-[11px] text-slate-400">
                  Or approve payment request sent to your registered UPI app.
                </div>
              </div>
            )}

            {/* Card Form */}
            {paymentMethod === 'card' && (
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <input
                  type="text"
                  placeholder="Card Number (RuPay, Visa, MasterCard)"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM / YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="CVV"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* NetBanking Form */}
            {paymentMethod === 'netbanking' && (
              <div className="space-y-2 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <select className="w-full text-xs px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                  <option>State Bank of India (SBI)</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Bank of Baroda (Gujarat Lead)</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleCompletePayment}
                disabled={isProcessing}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Securing Payment & Sending SMS...</span>
                ) : (
                  <span>Pay ₹{advanceAmount} & Confirm Booking</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Success Confirmation & Receipt */}
        {step === 'success' && (
          <div className="p-8 text-center space-y-4 flex-1 overflow-y-auto">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                Service Booking Confirmed!
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Advance receipt #{completedRef} generated.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Vendor:</span>
                <strong className="text-slate-900 dark:text-white">{vendor.businessName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Service:</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">{selectedService}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Slot:</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {bookingDate} · {bookingTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Doorstep Location:</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[200px]">
                  {customerAddress}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 font-bold">
                <span className="text-slate-800 dark:text-slate-200">Advance Paid:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">₹{advanceAmount}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              The vendor has been alerted via WhatsApp and push notification. The technician will call your mobile number prior to arrival.
            </p>

            <button
              onClick={handleClose}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
