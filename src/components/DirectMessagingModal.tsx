import React, { useState } from 'react';
import { X, Send, MessageSquare, Check, Phone, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DirectMessagingModal: React.FC = () => {
  const {
    selectedVendorForChat,
    setSelectedVendorForChat,
    chatMessages,
    sendChatMessage
  } = useApp();

  const [inputMsg, setInputMsg] = useState('');

  React.useEffect(() => {
    if (!selectedVendorForChat) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedVendorForChat(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedVendorForChat, setSelectedVendorForChat]);

  if (!selectedVendorForChat) return null;
  const vendor = selectedVendorForChat;

  const messages = chatMessages.filter((m) => m.vendorId === vendor.id);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    sendChatMessage(vendor.id, inputMsg.trim(), 'customer');
    setInputMsg('');
  };

  const presetMessages = [
    'Are you available today for a visit?',
    'What is your standard inspection charge?',
    'Can you give me an estimated quotation?',
    'Do you provide 3-month service warranty?'
  ];

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setSelectedVendorForChat(null);
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[580px] max-h-[90vh] relative">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={vendor.logoUrl}
              alt={vendor.businessName}
              className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
            />
            <div>
              <h4 className="text-sm font-bold truncate max-w-[200px]">
                {vendor.businessName}
              </h4>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Online · Prop. {vendor.ownerName}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedVendorForChat(null)}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close chat"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Chat Message History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/60 dark:bg-slate-950/60 text-xs">
          <div className="text-center my-2">
            <span className="bg-slate-200/60 dark:bg-slate-800 text-slate-500 text-[10px] px-3 py-1 rounded-full">
              Verified Gujarat Local Services Consultation
            </span>
          </div>

          {messages.map((msg) => {
            const isMe = msg.sender === 'customer';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    isMe
                      ? 'bg-sky-600 text-white rounded-br-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-xs shadow-xs'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}
        </div>

        {/* Quick Question Chips */}
        <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {presetMessages.map((text, i) => (
            <button
              key={i}
              onClick={() => {
                sendChatMessage(vendor.id, text, 'customer');
              }}
              className="text-[10px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg whitespace-nowrap shrink-0 transition-colors"
            >
              {text}
            </button>
          ))}
        </div>

        {/* Message Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type message to vendor..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 focus:ring-1 focus:ring-sky-500 text-slate-900 dark:text-white placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={!inputMsg.trim()}
            className="w-10 h-10 rounded-xl bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center transition-colors disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
