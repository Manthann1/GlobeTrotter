import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Sidebar({ tripId, onShareClick, activeTab = 'itinerary', onTabChange }) {
  const location = useLocation();

  return (
    <nav className="hidden lg:flex flex-col h-screen fixed left-0 top-0 py-4 bg-[#00236f] text-white shadow-xl docked w-64 z-50 border-none select-none">
      {/* Brand & Trip Header */}
      <div className="px-6 mb-8 flex items-center gap-3">
        <Link
          to="/"
          title="Back to Dashboard"
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all shrink-0 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </Link>
        <div>
          <h2 className="text-base font-bold font-['Montserrat'] text-white leading-tight">Trip Planner</h2>
          <p className="text-[11px] font-['Inter'] text-white/70 uppercase tracking-wider mt-0.5 font-semibold">
            Managing your journey
          </p>
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex-1 px-3 space-y-1.5 overflow-y-auto">
        {/* Overview link */}
        <Link
          to={`/trips/${tripId}`}
          className="flex items-center gap-3 py-3 px-4 text-white/75 hover:text-white hover:bg-white/10 rounded-lg mx-1 transition-all group"
        >
          <span className="material-symbols-outlined text-[20px] opacity-80 group-hover:opacity-100">dashboard</span>
          <span className="font-['Inter'] text-xs font-semibold uppercase tracking-wider">Public View</span>
        </Link>

        {/* Itinerary Tab */}
        <button
          onClick={() => onTabChange && onTabChange('itinerary')}
          className={`w-full flex items-center gap-3 py-3 px-4 rounded-lg mx-1 transition-all text-left relative ${
            activeTab === 'itinerary'
              ? 'bg-[#1e3a8a] text-[#90a8ff] shadow-inner font-bold'
              : 'text-white/75 hover:text-white hover:bg-white/10 font-semibold'
          }`}
        >
          {activeTab === 'itinerary' && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#90a8ff] rounded-r-full"></div>
          )}
          <span className={`material-symbols-outlined text-[20px] ${activeTab === 'itinerary' ? 'fill' : ''}`}>
            event
          </span>
          <span className="font-['Inter'] text-xs uppercase tracking-wider">Itinerary</span>
        </button>

        {/* Budget Tab / Link */}
        <Link
          to={`/trips/${tripId}/budget`}
          className={`w-full flex items-center gap-3 py-3 px-4 rounded-lg mx-1 transition-all text-left relative ${
            activeTab === 'budget' || location.pathname.includes('/budget')
              ? 'bg-[#1e3a8a] text-[#90a8ff] shadow-inner font-bold'
              : 'text-white/75 hover:text-white hover:bg-white/10 font-semibold'
          }`}
        >
          {(activeTab === 'budget' || location.pathname.includes('/budget')) && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#90a8ff] rounded-r-full"></div>
          )}
          <span className="material-symbols-outlined text-[20px]">payments</span>
          <span className="font-['Inter'] text-xs uppercase tracking-wider">Budget Analysis</span>
        </Link>

        {/* Documents Tab */}
        <button
          onClick={() => onTabChange && onTabChange('documents')}
          className={`w-full flex items-center gap-3 py-3 px-4 rounded-lg mx-1 transition-all text-left relative ${
            activeTab === 'documents'
              ? 'bg-[#1e3a8a] text-[#90a8ff] shadow-inner font-bold'
              : 'text-white/75 hover:text-white hover:bg-white/10 font-semibold'
          }`}
        >
          {activeTab === 'documents' && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#90a8ff] rounded-r-full"></div>
          )}
          <span className="material-symbols-outlined text-[20px]">description</span>
          <span className="font-['Inter'] text-xs uppercase tracking-wider">Documents</span>
        </button>
      </div>

      {/* Share Trip CTA */}
      <div className="mt-auto px-5 pt-4 pb-2 border-t border-white/10">
        <button
          onClick={onShareClick}
          className="w-full bg-[#006c49] text-white hover:bg-[#6cf8bb] hover:text-[#002113] py-3 rounded-xl font-['Inter'] text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">share</span>
          Share Trip
        </button>
      </div>

      {/* Support Link */}
      <div className="px-3 pb-3 pt-1">
        <Link
          to="/"
          className="flex items-center gap-3 py-2.5 px-4 text-white/70 hover:text-white hover:bg-white/10 rounded-lg mx-1 transition-all text-xs font-semibold uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-[18px]">help_outline</span>
          Dashboard Home
        </Link>
      </div>
    </nav>
  );
}
