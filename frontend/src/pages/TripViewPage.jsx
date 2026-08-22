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
  Image as ImageIcon,
} from 'lucide-react';

export default function TripViewPage() {
  const { tripId } = useParams();
  const { getTrip, copyTripToAccount, calculateTripTotals, formatPrice, showToast, normalizeTrip } = useTrip();
  const navigate = useNavigate();

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [mapActive, setMapActive] = useState(false);
  const [fetchedTrip, setFetchedTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('timeline');

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
          api.getPublicTrips()
            .then((publicTrips) => {
              const match = Array.isArray(publicTrips) ? publicTrips.find((t) => t.id === tripId || t.shareToken === tripId) : null;
              if (match) {
                setFetchedTrip(normalizeTrip(match));
              } else {
                api.getTripByShareToken(tripId)
                  .then((res) => res && setFetchedTrip(normalizeTrip(res)))
                  .catch(console.error);
              }
            })
            .catch(console.error);
        })
        .finally(() => setIsLoading(false));
    }
  }, [tripId, localTrip]);

  const trip = localTrip || fetchedTrip || getTrip(tripId) || getTrip('trip-royal-rajasthan');

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
          {/* Header & Tab Switcher */}
          <div className="bg-white p-4 md:p-6 rounded-2xl border border-[#c5c5d3] shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold font-['Montserrat'] text-[#191c1d]">
                Itinerary Overview
              </h2>
              <p className="text-xs text-[#757682]">Day-by-day curated experiences, stays, and budget breakdown</p>
            </div>
            
            <div className="flex gap-1 bg-[#f8f9fa] p-1.5 rounded-xl border border-[#c5c5d3] self-stretch sm:self-auto no-print">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-['Inter'] transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'timeline'
                    ? 'bg-[#00236f] text-white shadow-sm'
                    : 'text-[#444651] hover:bg-[#e1e3e4]'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" /> Timeline
              </button>
              <button
                onClick={() => setActiveTab('budget')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-['Inter'] transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'budget'
                    ? 'bg-[#00236f] text-white shadow-sm'
                    : 'text-[#444651] hover:bg-[#e1e3e4]'
                }`}
              >
                <PieChart className="w-3.5 h-3.5" /> Budget Analysis
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-['Inter'] transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'gallery'
                    ? 'bg-[#00236f] text-white shadow-sm'
                    : 'text-[#444651] hover:bg-[#e1e3e4]'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Photos Gallery
              </button>
            </div>
          </div>

          {/* Tab Content 1: Days Timeline */}
          {activeTab === 'timeline' && (
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
          )}

          {/* Tab Content 2: Budget Analysis */}
          {activeTab === 'budget' && (
            <div className="bg-white p-6 rounded-2xl border border-[#c5c5d3] shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-[#edeeef] pb-4">
                <div>
                  <h3 className="text-lg font-bold font-['Montserrat'] text-[#00236f] flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-[#00236f]" /> Detailed Budget & Expense Analysis
                  </h3>
                  <p className="text-xs text-[#757682]">Comprehensive financial report across stays, thali dining, tours & transport</p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-[#00236f] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#1e3a8a] transition-all no-print cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" /> Save PDF Report
                </button>
              </div>

              {/* Financial Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#00236f]/5 border border-[#00236f]/20">
                  <span className="text-[11px] font-bold font-['Inter'] uppercase tracking-wider text-[#00236f]">Total Trip Budget</span>
                  <p className="text-2xl font-bold font-['JetBrains Mono'] text-[#00236f] mt-1">{formatPrice(totalSpent)}</p>
                  <span className="text-[10px] text-[#757682]">{timelineDays.length} days total duration</span>
                </div>
                <div className="p-4 rounded-xl bg-[#006c49]/5 border border-[#006c49]/20">
                  <span className="text-[11px] font-bold font-['Inter'] uppercase tracking-wider text-[#006c49]">Average Daily Spend</span>
                  <p className="text-2xl font-bold font-['JetBrains Mono'] text-[#006c49] mt-1">{formatPrice(timelineDays.length > 0 ? Math.round(totalSpent / timelineDays.length) : totalSpent)}</p>
                  <span className="text-[10px] text-[#757682]">Cost per day</span>
                </div>
                <div className="p-4 rounded-xl bg-[#FF5722]/5 border border-[#FF5722]/20">
                  <span className="text-[11px] font-bold font-['Inter'] uppercase tracking-wider text-[#FF5722]">Estimated / Person</span>
                  <p className="text-2xl font-bold font-['JetBrains Mono'] text-[#FF5722] mt-1">{formatPrice(Math.round(totalSpent / 2))}</p>
                  <span className="text-[10px] text-[#757682]">Assuming 2 travelers</span>
                </div>
              </div>

              {/* Expense Category Distribution */}
              <div className="space-y-4 pt-2">
                <h4 className="text-sm font-bold font-['Montserrat'] text-[#191c1d] uppercase tracking-wider">Expense Distribution by Category</h4>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold font-['Inter'] mb-1">
                      <span className="text-[#444651]">🏨 Luxury Havelis & Resort Stays</span>
                      <span className="font-['JetBrains Mono'] text-[#00236f]">{formatPrice(breakdown.lodging)} ({lodgingPercent}%)</span>
                    </div>
                    <div className="w-full bg-[#e1e3e4] rounded-full h-3">
                      <div className="bg-[#4CAF50] h-3 rounded-full transition-all duration-500" style={{ width: `${lodgingPercent}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold font-['Inter'] mb-1">
                      <span className="text-[#444651]">🍲 Thalis, Food & Gourmet Dining</span>
                      <span className="font-['JetBrains Mono'] text-[#00236f]">{formatPrice(breakdown.food)} ({foodPercent}%)</span>
                    </div>
                    <div className="w-full bg-[#e1e3e4] rounded-full h-3">
                      <div className="bg-[#FFC107] h-3 rounded-full transition-all duration-500" style={{ width: `${foodPercent}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold font-['Inter'] mb-1">
                      <span className="text-[#444651]">🏰 Forts, Sightseeing & Heritage Experiences</span>
                      <span className="font-['JetBrains Mono'] text-[#00236f]">{formatPrice(breakdown.activities)} ({activitiesPercent}%)</span>
                    </div>
                    <div className="w-full bg-[#e1e3e4] rounded-full h-3">
                      <div className="bg-[#2196F3] h-3 rounded-full transition-all duration-500" style={{ width: `${activitiesPercent}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Day-by-Day Expenditure Table */}
              <div className="pt-4 border-t border-[#edeeef]">
                <h4 className="text-sm font-bold font-['Montserrat'] text-[#191c1d] uppercase tracking-wider mb-3">Day-by-Day Expenditure Breakdown</h4>
                <div className="overflow-x-auto border border-[#c5c5d3] rounded-xl">
                  <table className="w-full text-left text-xs font-['Inter']">
                    <thead className="bg-[#f8f9fa] border-b border-[#c5c5d3] text-[#00236f] uppercase font-bold text-[11px]">
                      <tr>
                        <th className="p-3">Day</th>
                        <th className="p-3">Title / Schedule</th>
                        <th className="p-3 text-center">Activities</th>
                        <th className="p-3 text-right">Day Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#edeeef]">
                      {timelineDays.map((day, dIdx) => {
                        const dayCost = day.activities.reduce((sum, a) => sum + (Number(a.cost) || 0), 0);
                        return (
                          <tr key={dIdx} className="hover:bg-[#f8f9fa]">
                            <td className="p-3 font-bold text-[#00236f]">Day {day.dayNum}</td>
                            <td className="p-3 font-medium text-[#191c1d]">{day.title}</td>
                            <td className="p-3 text-center text-[#757682]">{day.activities.length} items</td>
                            <td className="p-3 text-right font-['JetBrains Mono'] font-bold text-[#00236f]">
                              {formatPrice(dayCost)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 3: Photos Gallery */}
          {activeTab === 'gallery' && (
            <div className="bg-white p-6 rounded-2xl border border-[#c5c5d3] shadow-sm space-y-6">
              <div className="border-b border-[#edeeef] pb-3">
                <h3 className="text-lg font-bold font-['Montserrat'] text-[#00236f]">
                  Places & Photos Gallery
                </h3>
                <p className="text-xs text-[#757682]">High-res imagery of hotels, sightseeing places, thalis & heritage monuments</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {timelineDays.flatMap((day) => day.activities).map((act, pIdx) => (
                  <div key={pIdx} className="group relative rounded-xl overflow-hidden border border-[#c5c5d3] shadow-sm h-48 bg-[#e1e3e4]">
                    <img
                      src={act.imageUrl || trip.coverPhoto}
                      alt={act.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent p-3 flex flex-col justify-end text-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FF5722] px-2 py-0.5 rounded w-fit mb-1 shadow-xs">
                        {act.category || 'Sightseeing'}
                      </span>
                      <h5 className="text-xs font-bold font-['Montserrat'] line-clamp-1">{act.name}</h5>
                      <p className="text-[11px] font-['JetBrains Mono'] font-semibold text-[#ef9900]">{formatPrice(act.cost)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
