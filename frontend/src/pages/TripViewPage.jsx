import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import { CATEGORY_COLORS } from '../data/mockData';
import ShareModal from '../components/modals/ShareModal';
import { api } from '../services/api';
import {
  Share2,
  Link as LinkIcon,
  Copy,
  Clock,
  MapPin,
  Calendar,
  DollarSign,
  ArrowLeft,
  Edit,
  Edit3,
  PieChart,
  Map as MapIcon,
  User,
  Sparkles,
  IndianRupee,
  Download,
  FileText,
  Printer,
} from 'lucide-react';

export default function TripViewPage() {
  const { tripId } = useParams();
  const { getTrip, copyTripToAccount, calculateTripTotals, formatPrice, showToast, normalizeTrip } = useTrip();
  const navigate = useNavigate();

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [mapActive, setMapActive] = useState(false);
  const [fetchedTrip, setFetchedTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Retrieve local trip or fetch directly from backend API
  const localTrip = getTrip(tripId);

  useEffect(() => {
    if (!localTrip && tripId) {
      setIsLoading(true);
      api.getTripById(tripId)
        .then((res) => {
          if (res) {
            setFetchedTrip(normalizeTrip(res));
          }
        })
        .catch(() => {
          api.getTripByShareToken(tripId)
            .then((res) => res && setFetchedTrip(normalizeTrip(res)))
            .catch(console.error);
        })
        .finally(() => setIsLoading(false));
    }
  }, [tripId, localTrip]);

  const trip = localTrip || fetchedTrip || getTrip('trip-royal-rajasthan');

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 text-center font-['Inter'] text-[#00236f] font-bold">
        Loading itinerary details...
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold font-['Montserrat'] text-[#00236f] mb-2">Trip Not Found</h2>
        <p className="text-sm text-[#444651] mb-6">The itinerary you are looking for does not exist or has been removed.</p>
        <Link
          to="/"
          className="px-6 py-2.5 bg-[#00236f] text-white rounded-full text-xs font-bold font-['Inter'] uppercase tracking-wider"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { totalSpent, breakdown } = calculateTripTotals(trip);
  const totalBudget = trip.budget?.totalBudget || 85000;

  // Flatten all activities with day numbering for the timeline view
  const timelineDays = [];
  let dayCounter = 1;

  if (trip.stops && trip.stops.length > 0) {
    trip.stops.forEach((stop, stopIdx) => {
      const acts = stop.activities || [];
      if (acts.length === 0) {
        timelineDays.push({
          dayNum: dayCounter++,
          title: `Day ${stopIdx + 1}: Exploration in ${stop.cityName || 'Destination'}`,
          stop,
          activities: [],
        });
      } else {
        const dayGroups = {};
        acts.forEach((act) => {
          const d = act.day || 1;
          if (!dayGroups[d]) dayGroups[d] = [];
          dayGroups[d].push(act);
        });

        Object.keys(dayGroups).forEach((dKey) => {
          const groupActs = dayGroups[dKey];
          const currDayNum = dayCounter++;
          const rawTitle = groupActs[0]?.dayTitle;
          const cleanTitle = (rawTitle && !rawTitle.includes('undefined'))
            ? rawTitle
            : `Day ${currDayNum}: ${stop.cityName || 'Destination'} Highlights`;

          timelineDays.push({
            dayNum: currDayNum,
            title: cleanTitle,
            stop,
            activities: groupActs,
          });
        });
      }
    });
  } else {
    timelineDays.push({
      dayNum: 1,
      title: 'Day 1: Arrival & Local Exploration',
      stop: { cityName: trip.name },
      activities: [],
    });
  }

  const handleCopyTrip = () => {
    const cloned = copyTripToAccount(trip);
    navigate(`/trips/${cloned.id}/copied`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('🔗 Itinerary link copied to clipboard!');
  };

  // Category percentages for budget breakdown
  const lodgingPercent = totalSpent > 0 ? Math.round((breakdown.lodging / totalSpent) * 100) : 0;
  const foodPercent = totalSpent > 0 ? Math.round((breakdown.food / totalSpent) * 100) : 0;
  const activitiesPercent = totalSpent > 0 ? Math.round((breakdown.activities / totalSpent) * 100) : 0;
  const formatDate = (dateInput) => {
    if (!dateInput) return '';
    let str = String(dateInput).trim();
    if (str.includes('T')) {
      str = str.split('T')[0];
    }
    const parts = str.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        const d = new Date(year, month, day);
        return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
      }
    }
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return str;
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] font-['Inter'] antialiased min-h-screen pb-24">
      {/* Top Bar for View Mode */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 pt-4 flex justify-between items-center no-print">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold font-['Inter'] text-[#00236f] uppercase tracking-wider hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <Link
          to={`/trips/${trip.id}/edit`}
          className="inline-flex items-center gap-1.5 bg-[#00236f] text-white hover:bg-[#1e3a8a] transition-all px-4 py-2 rounded-full font-['Inter'] text-xs font-bold uppercase tracking-wider shadow-sm"
        >
          <Edit3 className="w-3.5 h-3.5" /> Edit Trip
        </Link>
      </div>

      {/* Hero Banner */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 mt-4">
        <div className="relative rounded-3xl overflow-hidden h-[340px] md:h-[420px] shadow-lg border border-[#c5c5d3]">
          <div
            className="absolute inset-0 bg-cover bg-center w-full h-full transform hover:scale-105 transition-transform duration-700"
            style={{ backgroundImage: `url('${trip.coverPhoto}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full text-white">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-[#FF5722] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-['Inter'] shadow-sm">
                🇮🇳 Featured Indian Itinerary
              </span>
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-['Inter'] font-semibold">
                {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold font-['Montserrat'] text-white mb-2 tracking-tight">
              {trip.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
              <div className="flex items-center gap-1.5 font-medium">
                <User className="w-4 h-4" />
                <span>Planned by {trip.author?.name || 'Aarav Sharma'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#ef9900]" />
                <span>{trip.subtitle || (trip.stops && trip.stops.map((s) => s.cityName).join(', '))}</span>
              </div>
            </div>
          </div>

        {/* Floating Share Actions on Hero (Top Right) */}
        <div className="absolute top-6 right-6 flex gap-2 no-print">
          <button
            onClick={() => window.print()}
            title="Download / Export as PDF"
            className="h-10 px-4 bg-[#00236f] hover:bg-[#1e3a8a] text-white backdrop-blur-md rounded-full flex items-center gap-1.5 text-xs font-bold font-['Inter'] uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export PDF
          </button>
          <button
            onClick={handleCopyLink}
            title="Copy Public Link"
            className="w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all shadow-md cursor-pointer"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShareModalOpen(true)}
            title="Share Itinerary"
            className="w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all shadow-md cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

      {/* Main Content: 8 cols Itinerary + 4 cols Sidebar */}
      <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Itinerary Overview (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-[#c5c5d3] pb-3">
            <div>
              <h2 className="text-2xl font-bold font-['Montserrat'] text-[#191c1d]">
                Itinerary Overview
              </h2>
              <p className="text-xs text-[#757682]">Day-by-day curated experiences, stays, and heritage tours</p>
            </div>
            <span className="text-xs font-bold font-['Inter'] text-[#00236f] bg-[#00236f]/10 px-3 py-1 rounded-full uppercase tracking-wider">
              {timelineDays.length} Days Planned
            </span>
          </div>

          {/* Days Timeline */}
          <div className="space-y-8">
            {timelineDays.map((dayItem, idx) => (
              <div
                key={idx}
                className="relative pl-8 before:content-[''] before:absolute before:left-3 before:top-3 before:bottom-[-36px] before:w-[2px] before:bg-[#c5c5d3] last:before:hidden"
              >
                {/* Day Marker Circle */}
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-[#00236f] text-white flex items-center justify-center z-10 font-bold font-['Inter'] text-[11px] shadow-sm">
                  {dayItem.dayNum}
                </div>

                {/* Day Header */}
                <h3 className="text-lg md:text-xl font-bold font-['Montserrat'] text-[#00236f] mb-3">
                  {dayItem.title}
                </h3>

                {/* Activity Cards for this day */}
                <div className="space-y-4">
                  {dayItem.activities.length === 0 ? (
                    <div className="p-4 bg-white border border-[#c5c5d3] rounded-xl text-xs text-[#757682] italic">
                      Explore the city bazaars, ghats, and local eateries at your own leisure.
                    </div>
                  ) : (
                    dayItem.activities.map((act) => {
                      const style = CATEGORY_COLORS[act.category] || CATEGORY_COLORS['Culture & History'] || { border: 'border-l-[#00236f]', badgeBg: 'bg-[#00236f]/10', badgeText: 'text-[#00236f]', label: act.category || 'Sightseeing' };
                      const actImg = act.imageUrl || dayItem.stop?.city?.imageUrl || trip.coverPhoto || 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80';

                      return (
                        <div
                          key={act.id}
                          className={`bg-white border border-[#c5c5d3] rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border-l-4 ${style.border || 'border-l-[#00236f]'}`}
                        >
                          <div className="flex flex-col md:flex-row gap-4">
                            {/* Thumbnail */}
                            <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden shrink-0 bg-[#e1e3e4]">
                              <img
                                src={actImg}
                                alt={act.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </div>

                            {/* Details */}
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-start gap-2 mb-1.5">
                                  <h4 className="text-base font-bold font-['Montserrat'] text-[#191c1d]">
                                    {act.name}
                                  </h4>
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-['Inter'] uppercase tracking-wider shrink-0 ${style.badgeBg || 'bg-[#00236f]/10'} ${style.badgeText || 'text-[#00236f]'}`}>
                                    {act.category || 'Experience'}
                                  </span>
                                </div>
                                <p className="text-xs font-['Inter'] text-[#444651] leading-relaxed mb-3">
                                  {act.description || 'Authentic regional experience with local guide and priority admission.'}
                                </p>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-[#edeeef] text-xs">
                                <div className="flex items-center gap-1.5 text-[#757682]">
                                  <Clock className="w-3.5 h-3.5 text-[#00236f]" />
                                  <span className="font-['JetBrains Mono'] font-semibold">
                                    {act.timeSlot || '10:00 AM'}
                                  </span>
                                </div>
                                <div className="font-['JetBrains Mono'] font-bold text-[#00236f] text-sm bg-[#00236f]/10 px-2.5 py-0.5 rounded-full">
                                  {formatPrice(act.cost)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Budget Breakdown & Map Widget (4 cols) */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          {/* Budget Breakdown Widget */}
          <div className="bg-white border border-[#c5c5d3] rounded-2xl p-6 shadow-sm sticky top-24">
            <h3 className="text-lg font-bold font-['Montserrat'] mb-5 flex items-center gap-2 text-[#191c1d]">
              <PieChart className="w-5 h-5 text-[#00236f]" />
              Budget Breakdown
            </h3>

            <div className="space-y-4">
              {/* Lodging */}
              <div>
                <div className="flex justify-between mb-1 text-xs font-bold font-['Inter'] uppercase tracking-wider">
                  <span className="text-[#444651]">Stays & Havelis</span>
                  <span className="font-['JetBrains Mono'] text-[#191c1d]">
                    {formatPrice(breakdown.lodging)}
                  </span>
                </div>
                <div className="w-full bg-[#e1e3e4] rounded-full h-2">
                  <div
                    className="bg-[#4CAF50] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${lodgingPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Food */}
              <div>
                <div className="flex justify-between mb-1 text-xs font-bold font-['Inter'] uppercase tracking-wider">
                  <span className="text-[#444651]">Food, Thalis & Dining</span>
                  <span className="font-['JetBrains Mono'] text-[#191c1d]">
                    {formatPrice(breakdown.food)}
                  </span>
                </div>
                <div className="w-full bg-[#e1e3e4] rounded-full h-2">
                  <div
                    className="bg-[#FFC107] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${foodPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Activities */}
              <div>
                <div className="flex justify-between mb-1 text-xs font-bold font-['Inter'] uppercase tracking-wider">
                  <span className="text-[#444651]">Heritage, Treks & Tours</span>
                  <span className="font-['JetBrains Mono'] text-[#191c1d]">
                    {formatPrice(breakdown.activities)}
                  </span>
                </div>
                <div className="w-full bg-[#e1e3e4] rounded-full h-2">
                  <div
                    className="bg-[#2196F3] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${activitiesPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Total Estimated Cost */}
              <div className="mt-4 pt-4 border-t border-[#c5c5d3] flex justify-between items-center">
                <span className="font-['Montserrat'] font-bold text-sm text-[#444651]">
                  Total Est.
                </span>
                <span className="font-['JetBrains Mono'] text-2xl font-bold text-[#00236f]">
                  {formatPrice(totalSpent)}
                </span>
              </div>

              {/* PDF Download Button in Sidebar */}
              <button
                onClick={() => window.print()}
                className="w-full mt-4 py-3 bg-[#00236f] hover:bg-[#1e3a8a] text-white rounded-xl text-xs font-bold font-['Inter'] uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md no-print cursor-pointer"
              >
                <FileText className="w-4 h-4" /> Download PDF Itinerary
              </button>
            </div>
          </div>

          {/* Map Route Widget */}
          <div
            onClick={() => setMapActive(!mapActive)}
            className="bg-white border border-[#c5c5d3] rounded-2xl h-64 shadow-sm overflow-hidden relative group cursor-pointer no-print"
          >
            <img
              src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80"
              alt="Map route preview"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors flex items-center justify-center">
              <span className="bg-white/95 text-[#00236f] px-4 py-2 rounded-full font-['Inter'] text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-xs flex items-center gap-2 group-hover:scale-105 transition-transform">
                <MapIcon className="w-4 h-4 text-[#00236f]" />
                {mapActive ? 'Route Navigation Active' : 'View Indian Map Route'}
              </span>
            </div>

            {/* City pins indicator overlay */}
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] text-white font-['Inter']">
              📍 {trip.stops ? trip.stops.map((s) => s.cityName).join(' ➔ ') : trip.name}
            </div>
          </div>
        </aside>
      </main>

      {/* Sticky Floating Action Button (CTA) in Bottom Right */}
      <div className="fixed bottom-6 right-6 z-40 no-print">
        <button
          onClick={handleCopyTrip}
          className="bg-[#FF5722] hover:bg-[#E64A19] text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-orange-500/30 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-2.5 font-['Montserrat'] text-sm font-bold tracking-tight cursor-pointer"
        >
          <Copy className="w-5 h-5" />
          Copy Trip to My Account
        </button>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        trip={trip}
      />
    </div>
  );
}
