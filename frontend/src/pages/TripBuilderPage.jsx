import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import Sidebar from '../components/layout/Sidebar';
import AddActivityModal from '../components/modals/AddActivityModal';
import ShareModal from '../components/modals/ShareModal';
import {
  Plus,
  Trash2,
  GripVertical,
  Calendar,
  DollarSign,
  Search,
  Check,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  Sparkles,
  FileText,
  PieChart,
  MapPin,
  ExternalLink,
} from 'lucide-react';

export default function TripBuilderPage() {
  const { tripId } = useParams();
  const {
    getTrip,
    cities,
    addStopToTrip,
    removeStopFromTrip,
    reorderStops,
    addActivityToStop,
    removeActivityFromStop,
    calculateTripTotals,
    updateTrip,
    showToast,
  } = useTrip();

  const [activeSidebarTab, setActiveSidebarTab] = useState('itinerary');
  const [drawerTab, setDrawerTab] = useState('cities'); // 'cities' | 'activities'
  const [drawerSearch, setDrawerSearch] = useState('');
  const [selectedStopId, setSelectedStopId] = useState(null);
  const [addActivityModalOpen, setAddActivityModalOpen] = useState(false);
  const [activeStopForModal, setActiveStopForModal] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Retrieve trip or fallback
  const trip = getTrip(tripId) || getTrip('trip-european-summer');

  if (!trip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f8f9fa] text-center">
        <h2 className="text-2xl font-bold font-['Montserrat'] text-[#00236f] mb-2">Trip Not Found</h2>
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
  const totalBudget = trip.budget?.totalBudget || 5000;
  const spentPercent = Math.min(100, Math.round((totalSpent / totalBudget) * 100)) || 0;

  // Filter drawer items
  const filteredCities = cities.filter(
    (c) =>
      c.name.toLowerCase().includes(drawerSearch.toLowerCase()) ||
      c.country.toLowerCase().includes(drawerSearch.toLowerCase())
  );

  // Collect all catalog activities
  const allCatalogActivities = cities.flatMap((c) =>
    (c.activities || []).map((a) => ({ ...a, cityName: c.name, cityCountry: c.country }))
  );

  const filteredActivities = allCatalogActivities.filter(
    (a) =>
      a.name.toLowerCase().includes(drawerSearch.toLowerCase()) ||
      a.category.toLowerCase().includes(drawerSearch.toLowerCase()) ||
      a.cityName.toLowerCase().includes(drawerSearch.toLowerCase())
  );

  const handleOpenAddActivityModal = (stop) => {
    setActiveStopForModal(stop);
    setAddActivityModalOpen(true);
  };

  const handleQuickAddCity = (city) => {
    addStopToTrip(trip.id, city);
  };

  const handleQuickAddActivity = (act) => {
    // If no stop selected, pick the first stop or create a stop for that city
    const targetStop = trip.stops && trip.stops.length > 0 ? (selectedStopId ? trip.stops.find((s) => s.id === selectedStopId) : trip.stops[0]) : null;

    if (targetStop) {
      addActivityToStop(trip.id, targetStop.id, {
        name: act.name,
        category: act.category,
        cost: act.cost,
        timeSlot: act.timeSlot || '12:00',
        description: act.description,
        imageUrl: act.imageUrl,
        day: targetStop.activities ? targetStop.activities.length + 1 : 1,
      });
    } else {
      // Find matching city and add stop
      const city = cities.find((c) => c.name.toLowerCase() === act.cityName?.toLowerCase()) || cities[0];
      addStopToTrip(trip.id, city);
      showToast(`Added ${city.name} stop with ${act.name}`);
    }
  };

  const handleMoveStop = (idx, direction) => {
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= (trip.stops || []).length) return;
    reorderStops(trip.id, idx, newIdx);
  };

  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] min-h-screen flex font-['Inter']">
      {/* Side Navigation Bar */}
      <Sidebar
        tripId={trip.id}
        onShareClick={() => setShareModalOpen(true)}
        activeTab={activeSidebarTab}
        onTabChange={setActiveSidebarTab}
      />

      {/* Main Content Canvas */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen bg-[#f3f4f5]">
        {/* Sticky Header with Budget Tracker */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#c5c5d3] shadow-xs px-4 md:px-10 py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 w-full">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold font-['Montserrat'] text-[#00236f] tracking-tight">
              {trip.name}
            </h1>
            <span className="bg-[#e1e3e4] text-[#444651] px-2.5 py-1 rounded-full text-[11px] font-bold font-['Inter'] uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">group</span> Shared
            </span>
            <Link
              to={`/trips/${trip.id}`}
              className="text-xs text-[#00236f] hover:underline flex items-center gap-1 font-bold font-['Inter'] ml-2"
              title="Preview public itinerary"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Public View
            </Link>
          </div>

          {/* Budget Meter */}
          <div className="flex items-center gap-4 self-end sm:self-auto">
            <div className="text-right">
              <div className="text-[11px] font-['Inter'] text-[#757682] uppercase tracking-wider font-bold">
                Trip Total
              </div>
              <div className="font-['JetBrains Mono'] font-bold text-sm text-[#00236f]">
                ${totalSpent.toLocaleString()} / ${totalBudget.toLocaleString()}
              </div>
            </div>
            <div className="w-36 md:w-48 h-2.5 bg-[#e1e3e4] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  spentPercent > 90 ? 'bg-[#FF5722]' : 'bg-[#006c49]'
                }`}
                style={{ width: `${spentPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Dynamic Tab Views */}
        {activeSidebarTab === 'itinerary' && (
          <div className="flex-1 px-4 md:px-10 py-6 max-w-[1280px] w-full mx-auto flex flex-col lg:flex-row gap-6">
            {/* Itinerary Column (Left 70%) */}
            <section className="w-full lg:w-[70%] space-y-6">
              {(!trip.stops || trip.stops.length === 0) ? (
                <div className="bg-white border-2 border-dashed border-[#c5c5d3] rounded-2xl p-10 text-center">
                  <span className="material-symbols-outlined text-4xl text-[#00236f] mb-2">map</span>
                  <h3 className="text-lg font-bold font-['Montserrat'] text-[#00236f] mb-1">
                    No stops in this itinerary yet!
                  </h3>
                  <p className="text-xs text-[#444651] max-w-md mx-auto mb-4">
                    Pick cities from the search catalog on the right or click below to add your first destination stop.
                  </p>
                  <button
                    onClick={() => handleQuickAddCity(cities[0])}
                    className="px-5 py-2.5 bg-[#00236f] text-white rounded-full text-xs font-bold font-['Inter'] uppercase tracking-wider hover:bg-[#1e3a8a] transition-all shadow-md inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add {cities[0]?.name}
                  </button>
                </div>
              ) : (
                trip.stops.map((stop, stopIdx) => {
                  let stopCost = 0;
                  (stop.activities || []).forEach((a) => {
                    stopCost += Number(a.cost || 0);
                  });

                  return (
                    <div
                      key={stop.id}
                      onClick={() => setSelectedStopId(stop.id)}
                      className={`stop-card bg-white border rounded-2xl shadow-sm overflow-hidden flex relative transition-all ${
                        selectedStopId === stop.id
                          ? 'border-[#00236f] ring-2 ring-[#00236f]/10'
                          : 'border-[#c5c5d3]'
                      }`}
                    >
                      {/* Color Bar Accent */}
                      <div
                        className={`w-2.5 shrink-0 ${
                          stopIdx % 2 === 0 ? 'bg-[#00236f]' : 'bg-[#006c49]'
                        }`}
                      ></div>

                      <div className="flex-1 p-5 md:p-6">
                        {/* Stop Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="bg-[#00236f]/10 text-[#00236f] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                                Stop #{stopIdx + 1}
                              </span>
                              <h3 className="text-lg md:text-xl font-bold font-['Montserrat'] text-[#191c1d]">
                                {stop.cityName}, {stop.country}
                              </h3>
                            </div>
                            <p className="text-xs text-[#757682] mt-1 flex items-center gap-2 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-[#00236f]" />
                              {stop.arrivalDate} — {stop.departureDate}
                            </p>
                          </div>

                          {/* Est Cost & Order Controls */}
                          <div className="flex items-center gap-2">
                            <span className="bg-[#00236f]/10 text-[#00236f] px-3 py-1 rounded-full text-xs font-bold font-['JetBrains Mono']">
                              ${stopCost.toLocaleString()} Est.
                            </span>

                            {/* Move Up/Down Controls */}
                            <div className="flex items-center border border-[#c5c5d3] rounded-lg overflow-hidden bg-[#f3f4f5]">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveStop(stopIdx, -1);
                                }}
                                disabled={stopIdx === 0}
                                title="Move Up"
                                className="p-1 hover:bg-[#e1e3e4] text-[#444651] disabled:opacity-30 disabled:pointer-events-none"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveStop(stopIdx, 1);
                                }}
                                disabled={stopIdx === (trip.stops.length - 1)}
                                title="Move Down"
                                className="p-1 hover:bg-[#e1e3e4] text-[#444651] disabled:opacity-30 disabled:pointer-events-none"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Delete Stop */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeStopFromTrip(trip.id, stop.id);
                              }}
                              title="Delete Stop"
                              className="p-1.5 text-[#757682] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Activities List inside Stop */}
                        <div className="space-y-3 pl-3 md:pl-4 border-l-2 border-[#e1e3e4] ml-1">
                          {(!stop.activities || stop.activities.length === 0) ? (
                            <p className="text-xs text-[#757682] italic py-1">
                              No activities added yet for this stop.
                            </p>
                          ) : (
                            stop.activities.map((act) => (
                              <div
                                key={act.id}
                                className="activity-card bg-[#f8f9fa] border border-[#c5c5d3] rounded-xl p-3 flex justify-between items-center group shadow-2xs"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="text-[#757682] opacity-40 group-hover:opacity-100 cursor-grab">
                                    <GripVertical className="w-4 h-4" />
                                  </div>
                                  <div className="w-11 h-11 rounded-lg bg-[#e1e3e4] overflow-hidden shrink-0 hidden sm:block">
                                    <img
                                      src={act.imageUrl || trip.coverPhoto}
                                      alt={act.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold font-['Montserrat'] text-[#191c1d]">
                                      {act.name}
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-[10px] font-bold font-['Inter'] uppercase tracking-wider text-[#00236f] bg-[#00236f]/10 px-1.5 py-0.5 rounded">
                                        {act.category}
                                      </span>
                                      <span className="text-[11px] text-[#757682] font-['JetBrains Mono']">
                                        {act.timeSlot || '10:00'}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <div className="font-['JetBrains Mono'] font-bold text-xs text-[#191c1d]">
                                    ${Number(act.cost).toLocaleString()}
                                  </div>
                                  <button
                                    onClick={() => removeActivityFromStop(trip.id, stop.id, act.id)}
                                    className="text-[#757682] hover:text-[#ba1a1a] p-1 rounded hover:bg-[#ffdad6]/40 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}

                          {/* Add Activity Button */}
                          <div className="flex items-center gap-3 pt-2">
                            <button
                              onClick={() => handleOpenAddActivityModal(stop)}
                              className="text-[#00236f] text-xs font-bold font-['Inter'] uppercase tracking-wider hover:underline flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add Activity
                            </button>
                            <span className="text-[#c5c5d3]">|</span>
                            <button
                              onClick={() => {
                                setSelectedStopId(stop.id);
                                setDrawerTab('activities');
                              }}
                              className="text-[#006c49] text-xs font-bold font-['Inter'] uppercase tracking-wider hover:underline flex items-center gap-1"
                            >
                              <Search className="w-3.5 h-3.5" /> Browse Catalog
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Add Next Stop Action Area */}
              <button
                onClick={() => setDrawerTab('cities')}
                className="w-full border-2 border-dashed border-[#c5c5d3] rounded-2xl p-5 text-center text-[#444651] hover:border-[#00236f] hover:text-[#00236f] hover:bg-[#00236f]/5 transition-all flex flex-col items-center justify-center gap-1.5 group"
              >
                <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">
                  add_circle
                </span>
                <span className="text-sm font-bold font-['Montserrat']">Add Next Stop from Catalog</span>
              </button>
            </section>

            {/* Search & Add Drawer (Right 30%) */}
            <aside className="w-full lg:w-[30%]">
              <div className="bg-white border border-[#c5c5d3] rounded-2xl shadow-sm sticky top-24 overflow-hidden flex flex-col h-[calc(100vh-120px)]">
                {/* Tabs */}
                <div className="flex border-b border-[#c5c5d3] shrink-0 bg-[#f8f9fa]">
                  <button
                    onClick={() => setDrawerTab('cities')}
                    className={`flex-1 py-3 text-center text-xs font-bold font-['Inter'] uppercase tracking-wider transition-colors ${
                      drawerTab === 'cities'
                        ? 'border-b-2 border-[#00236f] text-[#00236f] bg-white font-bold'
                        : 'text-[#444651] hover:text-[#191c1d]'
                    }`}
                  >
                    Search Cities
                  </button>
                  <button
                    onClick={() => setDrawerTab('activities')}
                    className={`flex-1 py-3 text-center text-xs font-bold font-['Inter'] uppercase tracking-wider transition-colors ${
                      drawerTab === 'activities'
                        ? 'border-b-2 border-[#00236f] text-[#00236f] bg-white font-bold'
                        : 'text-[#444651] hover:text-[#191c1d]'
                    }`}
                  >
                    Search Activities
                  </button>
                </div>

                {/* Search Bar */}
                <div className="p-4 shrink-0 border-b border-[#c5c5d3] bg-white">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#757682]" />
                    <input
                      type="text"
                      value={drawerSearch}
                      onChange={(e) => setDrawerSearch(e.target.value)}
                      placeholder={drawerTab === 'cities' ? 'Find inspiration (Paris, Tokyo...)' : 'Search experiences & tours...'}
                      className="w-full pl-9 pr-3 py-2 bg-[#f8f9fa] border border-[#c5c5d3] rounded-xl text-xs font-['Inter'] focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f]"
                    />
                  </div>
                </div>

                {/* Results List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-[#f3f4f5]">
                  {drawerTab === 'cities' ? (
                    filteredCities.map((city) => (
                      <div
                        key={city.id}
                        onClick={() => handleQuickAddCity(city)}
                        className="bg-white rounded-xl border border-[#c5c5d3] p-2.5 flex gap-3 hover:border-[#00236f] cursor-pointer transition-all hover:shadow-xs group"
                      >
                        <div className="w-14 h-14 rounded-lg bg-[#e1e3e4] overflow-hidden shrink-0">
                          <img
                            src={city.imageUrl}
                            alt={city.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                          <div>
                            <h4 className="text-xs font-bold font-['Montserrat'] text-[#191c1d] truncate">
                              {city.name}, {city.country}
                            </h4>
                            <p className="text-[11px] text-[#757682] font-['Inter']">{city.tag || 'Popular Destination'}</p>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="font-['JetBrains Mono'] text-[11px] font-bold text-[#5c3800]">
                              {city.priceLevel || '$$$'}
                            </span>
                            <span className="text-[#00236f] text-xs font-bold font-['Inter'] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                              + Add Stop
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    filteredActivities.map((act, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleQuickAddActivity(act)}
                        className="bg-white rounded-xl border border-[#c5c5d3] p-2.5 flex gap-3 hover:border-[#00236f] cursor-pointer transition-all hover:shadow-xs group"
                      >
                        <div className="w-14 h-14 rounded-lg bg-[#e1e3e4] overflow-hidden shrink-0">
                          <img
                            src={act.imageUrl || trip.coverPhoto}
                            alt={act.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                          <div>
                            <h4 className="text-xs font-bold font-['Montserrat'] text-[#191c1d] truncate">
                              {act.name}
                            </h4>
                            <p className="text-[10px] text-[#757682] font-['Inter'] truncate">
                              {act.cityName} • {act.category}
                            </p>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="font-['JetBrains Mono'] text-[11px] font-bold text-[#006c49]">
                              ${Number(act.cost).toLocaleString()}
                            </span>
                            <span className="text-[#00236f] text-xs font-bold font-['Inter'] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                              + Add
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* Budget Tab View */}
        {activeSidebarTab === 'budget' && (
          <div className="flex-1 px-4 md:px-10 py-8 max-w-[1000px] w-full mx-auto space-y-6">
            <div className="bg-white border border-[#c5c5d3] rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold font-['Montserrat'] text-[#00236f] mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5" /> Budget & Expense Allocator
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-[#f8f9fa] border border-[#c5c5d3] rounded-xl">
                  <div className="text-xs text-[#757682] uppercase tracking-wider font-bold mb-1">Target Budget</div>
                  <div className="text-2xl font-bold font-['JetBrains Mono'] text-[#00236f]">${totalBudget.toLocaleString()}</div>
                </div>
                <div className="p-4 bg-[#f8f9fa] border border-[#c5c5d3] rounded-xl">
                  <div className="text-xs text-[#757682] uppercase tracking-wider font-bold mb-1">Total Allocated</div>
                  <div className="text-2xl font-bold font-['JetBrains Mono'] text-[#006c49]">${totalSpent.toLocaleString()}</div>
                </div>
                <div className="p-4 bg-[#f8f9fa] border border-[#c5c5d3] rounded-xl">
                  <div className="text-xs text-[#757682] uppercase tracking-wider font-bold mb-1">Remaining</div>
                  <div className="text-2xl font-bold font-['JetBrains Mono'] text-[#5c3800]">
                    ${Math.max(0, totalBudget - totalSpent).toLocaleString()}
                  </div>
                </div>
              </div>

              <h3 className="text-sm font-bold font-['Montserrat'] text-[#191c1d] uppercase tracking-wider mb-3">
                Category Spending
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold font-['Inter'] mb-1">
                    <span>🏨 Lodging & Accommodation</span>
                    <span className="font-['JetBrains Mono']">${breakdown.lodging.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-[#e1e3e4] rounded-full h-3">
                    <div
                      className="bg-[#4CAF50] h-3 rounded-full"
                      style={{ width: `${totalSpent ? (breakdown.lodging / totalSpent) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold font-['Inter'] mb-1">
                    <span>🍷 Food & Dining</span>
                    <span className="font-['JetBrains Mono']">${breakdown.food.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-[#e1e3e4] rounded-full h-3">
                    <div
                      className="bg-[#FFC107] h-3 rounded-full"
                      style={{ width: `${totalSpent ? (breakdown.food / totalSpent) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold font-['Inter'] mb-1">
                    <span>🎟️ Activities & Attractions</span>
                    <span className="font-['JetBrains Mono']">${breakdown.activities.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-[#e1e3e4] rounded-full h-3">
                    <div
                      className="bg-[#2196F3] h-3 rounded-full"
                      style={{ width: `${totalSpent ? (breakdown.activities / totalSpent) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab View */}
        {activeSidebarTab === 'documents' && (
          <div className="flex-1 px-4 md:px-10 py-8 max-w-[1000px] w-full mx-auto space-y-6">
            <div className="bg-white border border-[#c5c5d3] rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold font-['Montserrat'] text-[#00236f] mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Travel Documents & Notes
              </h2>
              <p className="text-xs text-[#757682] mb-6">Keep your boarding passes, hotel reservations, and emergency contacts in one secure place.</p>

              <div className="space-y-4">
                <div className="p-4 bg-[#f8f9fa] border border-[#c5c5d3] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#00236f]/10 text-[#00236f] flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold font-['Montserrat'] text-[#191c1d]">European Summer Itinerary Guide</h4>
                      <p className="text-xs text-[#757682]">Full PDF export summary with day breakdowns</p>
                    </div>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-[#00236f] text-white rounded-lg text-xs font-bold font-['Inter'] uppercase tracking-wider hover:bg-[#1e3a8a]"
                  >
                    Print / Export
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Activity Modal */}
      <AddActivityModal
        isOpen={addActivityModalOpen}
        onClose={() => setAddActivityModalOpen(false)}
        tripId={trip.id}
        stopId={activeStopForModal?.id}
        stopName={activeStopForModal?.cityName}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        trip={trip}
      />
    </div>
  );
}
