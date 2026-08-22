import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { X, Copy, Check, Share2, Globe, Mail, MessageCircle, FileText, Download } from 'lucide-react';

export default function ShareModal({ isOpen, onClose, trip }) {
  const { showToast } = useTrip();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !trip) return null;

  const shareUrl = `${window.location.origin}/trips/${trip.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    showToast('🔗 Public share link copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${trip.name} | GlobeTrotter`,
          text: `Check out this travel itinerary for ${trip.name} on GlobeTrotter!`,
          url: shareUrl,
        });
      } catch {
        // user cancelled or error
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-[#c5c5d3] max-w-md w-full p-6 md:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#c5c5d3]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#006c49]/10 text-[#006c49] flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-['Montserrat'] text-[#00236f]">Share Trip</h2>
              <p className="text-xs text-[#444651] font-['Inter']">{trip.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#edeeef] text-[#757682] hover:text-[#191c1d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-6 space-y-5">
          {/* Public Link Copy Box */}
          <div>
            <label className="block text-xs font-bold font-['Inter'] uppercase tracking-wider text-[#444651] mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#00236f]" /> Public Link
            </label>
            <div className="flex items-center gap-2 p-1 bg-[#f3f4f5] border border-[#c5c5d3] rounded-xl">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full bg-transparent px-3 py-1.5 text-xs font-['Inter'] text-[#191c1d] outline-none select-all"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-[#00236f] text-white hover:bg-[#1e3a8a] rounded-lg text-xs font-bold font-['Inter'] uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Social Quick Share */}
          <div>
            <label className="block text-xs font-bold font-['Inter'] uppercase tracking-wider text-[#444651] mb-2">
              Share Via
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                onClick={handleNativeShare}
                className="py-2.5 px-3 border border-[#c5c5d3] hover:border-[#00236f] hover:bg-[#00236f]/5 rounded-xl flex flex-col items-center gap-1 text-xs font-semibold text-[#191c1d] transition-all"
              >
                <Share2 className="w-4 h-4 text-[#00236f]" />
                <span>System</span>
              </button>
              <a
                href={`mailto:?subject=${encodeURIComponent(`Itinerary: ${trip.name}`)}&body=${encodeURIComponent(`Check out my trip plan: ${shareUrl}`)}`}
                className="py-2.5 px-3 border border-[#c5c5d3] hover:border-[#00236f] hover:bg-[#00236f]/5 rounded-xl flex flex-col items-center gap-1 text-xs font-semibold text-[#191c1d] transition-all text-center"
              >
                <Mail className="w-4 h-4 text-[#006c49]" />
                <span>Email</span>
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Check out my travel itinerary for ${trip.name}: ${shareUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 border border-[#c5c5d3] hover:border-[#00236f] hover:bg-[#00236f]/5 rounded-xl flex flex-col items-center gap-1 text-xs font-semibold text-[#191c1d] transition-all text-center"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Export PDF Option */}
          <div className="p-4 bg-[#00236f]/5 border border-[#00236f]/20 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#00236f] text-white flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold font-['Montserrat'] text-[#00236f]">Export PDF Document</h4>
                <p className="text-[11px] text-[#444651]">Save full itinerary timeline & budget as PDF</p>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                setTimeout(() => window.print(), 300);
              }}
              className="px-3 py-2 bg-[#00236f] hover:bg-[#1e3a8a] text-white rounded-lg text-xs font-bold font-['Inter'] uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm shrink-0"
            >
              <Download className="w-3.5 h-3.5" /> Save PDF
            </button>
          </div>

          {/* Info note */}
          <div className="p-3 bg-[#006c49]/10 border border-[#006c49]/20 rounded-xl text-xs text-[#006c49] font-['Inter']">
            Anyone with this link can view the complete itinerary, budget breakdown, and clone it into their own account!
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-5 border-t border-[#c5c5d3] mt-5">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#f3f4f5] hover:bg-[#edeeef] text-[#191c1d] text-xs font-bold font-['Inter'] uppercase tracking-wider transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
