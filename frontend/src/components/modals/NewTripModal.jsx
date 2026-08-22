import React, { useState, useEffect } from 'react';
import { useTrip } from '../../context/TripContext';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, Calendar, Sparkles, Plus, Check, Compass, Compass as GlobeIcon } from 'lucide-react';

export default function NewTripModal({ isOpen, onClose }) {
  const { createTrip, cities, formatPrice } = useTrip();
  const navigate = useNavigate();

  const [name, setName] = useState('Jaipur Royal Getaway');
  const [destination, setDestination] = useState('Jaipur');
  const [selectedCity, setSelectedCity] = useState(null);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(() => new Date(Date.now() + 6 * 86400000).toISOString().slice(0, 10));
  const [selectedActivities, setSelectedActivities] = useState([]);

  // Default to first city or Jaipur on open
  useEffect(() => {
    if (cities && cities.length > 0 && !selectedCity) {
      const initial = cities.find((c) => c.name.toLowerCase() === 'jaipur') || cities[0];
      setSelectedCity(initial);
      setDestination(initial.name);
      if (initial.activities) {
        setSelectedActivities(initial.activities.map((a) => a.id));
      }
    }
  }, [cities, selectedCity]);

  if (!isOpen) return null;

  const handleCityChange = (cityName) => {
    setDestination(cityName);
    const matched = cities.find((c) => c.name.toLowerCase() === cityName.toLowerCase());
    if (matched) {
      setSelectedCity(matched);
      if (!name || name.endsWith('Getaway')) {
        setName(`${matched.name} Getaway`);
      }
      if (matched.activities) {
        setSelectedActivities(matched.activities.map((a) => a.id));
      }
    }
  };

  const toggleActivity = (actId) => {
    setSelectedActivities((prev) =>
      prev.includes(actId) ? prev.filter((id) => id !== actId) : [...prev, actId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const chosenActivities = (selectedCity?.activities || []).filter((a) =>
      selectedActivities.includes(a.id)
    );

    const newTrip = await createTrip({
      name,
      destination: destination || (selectedCity ? `${selectedCity.name}, ${selectedCity.state || selectedCity.country}` : 'Incredible India'),
      startDate,
      endDate,
      totalBudget: 65000,
      dailyCap: 7500,
      description: `Exploring ${destination} — curated itinerary with places to visit and activities.`,
      coverPhoto: selectedCity?.imageUrl || 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
      initialCity: selectedCity,
      customActivities: chosenActivities,
    });

    onClose();
    if (newTrip && newTrip.id) {
      navigate(`/trips/${newTrip.id}`);
    } else {
      navigate('/');
    }
  };

  const currentActivities = selectedCity?.activities || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-[#c5c5d3] max-w-3xl w-full shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header - Matching Wireframe */}
        <div className="bg-[#00236f] text-white p-5 md:px-8 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ef9900] text-28px fill">explore</span>
            <span className="text-xl font-bold font-['Montserrat'] tracking-tight">GlobeTrotter</span>
            <span className="text-xs font-semibold text-white/70 ml-2 font-['Inter'] hidden sm:inline">| Plan a New Trip</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
          <div className="p-6 md:px-8 py-5 overflow-y-auto space-y-6 flex-grow font-['Inter']">
            
            {/* Section 1: Plan a new trip Form */}
            <div className="bg-[#f8f9fa] border border-[#c5c5d3] rounded-xl p-5 space-y-4 shadow-2xs">
              <h3 className="text-sm font-bold font-['Montserrat'] text-[#00236f] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#ef9900]" /> Plan a New Trip
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Trip Name */}
                <div>
                  <label className="block text-xs font-bold text-[#444651] mb-1">
                    Trip Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Royal Rajasthan Tour"
                    className="w-full px-3.5 py-2 bg-white border border-[#c5c5d3] rounded-xl text-xs focus:border-[#00236f] focus:outline-none"
                  />
                </div>

                {/* Select a Place Dropdown / Selector */}
                <div>
                  <label className="block text-xs font-bold text-[#444651] mb-1 flex items-center justify-between">
                    <span>Select a Place :</span>
                    <span className="text-[10px] text-[#00236f] font-semibold">{cities.length} destinations available</span>
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-[#c5c5d3] rounded-xl text-xs font-bold text-[#00236f] focus:border-[#00236f] focus:outline-none cursor-pointer"
                  >
                    {cities.map((c) => (
                      <option key={c.id} value={c.name}>
                        📍 {c.name}, {c.state || c.country}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-xs font-bold text-[#444651] mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#00236f]" /> Start Date:
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-[#c5c5d3] rounded-xl text-xs focus:border-[#00236f] focus:outline-none"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-xs font-bold text-[#444651] mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#00236f]" /> End Date:
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-[#c5c5d3] rounded-xl text-xs focus:border-[#00236f] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Suggestion for Places to Visit / Activities to perform (3x2 Grid) */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-bold font-['Montserrat'] text-[#191c1d]">
                  Suggestion for Places to Visit / Activities to perform
                </h4>
                <span className="text-xs text-[#00236f] font-semibold bg-[#00236f]/10 px-2.5 py-0.5 rounded-full">
                  {selectedCity ? selectedCity.name : 'Destination'} Highlights ({selectedActivities.length} selected)
                </span>
              </div>

              {/* 3x2 Grid of Activity Cards (Matching Wireframe) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {currentActivities.slice(0, 6).map((act) => {
                  const isSelected = selectedActivities.includes(act.id);
                  return (
                    <div
                      key={act.id}
                      onClick={() => toggleActivity(act.id)}
                      className={`group relative bg-white border rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected ? 'border-2 border-[#00236f] ring-2 ring-[#00236f]/20' : 'border-[#c5c5d3]'
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="h-28 overflow-hidden relative bg-[#e1e3e4]">
                        <img
                          src={act.imageUrl || selectedCity?.imageUrl}
                          alt={act.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                          {act.category || 'Experience'}
                        </span>
                        <div
                          className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                            isSelected ? 'bg-[#00236f] text-white shadow-md' : 'bg-white/80 text-[#757682]'
                          }`}
                        >
                          {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                          <h5 className="text-xs font-bold font-['Montserrat'] text-[#191c1d] line-clamp-1 mb-1">
                            {act.name}
                          </h5>
                          <p className="text-[11px] text-[#757682] line-clamp-2 leading-snug">
                            {act.description || 'Recommended local activity and sightseeing spot.'}
                          </p>
                        </div>

                        <div className="mt-2 pt-2 border-t border-[#edeeef] flex justify-between items-center text-[11px]">
                          <span className="font-['JetBrains Mono'] font-bold text-[#00236f]">
                            {formatPrice(act.cost)}
                          </span>
                          <span className={`font-bold ${isSelected ? 'text-[#00236f]' : 'text-[#757682]'}`}>
                            {isSelected ? '✓ Added' : '+ Add'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="p-4 md:px-8 bg-[#f8f9fa] border-t border-[#c5c5d3] flex justify-between items-center shrink-0">
            <span className="text-xs text-[#757682] font-semibold">
              {selectedActivities.length} activities selected for {destination}
            </span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-full border border-[#c5c5d3] text-[#444651] hover:bg-[#e1e3e4] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-[#00236f] hover:bg-[#1e3a8a] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#ef9900]" /> Create Trip Itinerary
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
