import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, Calendar, DollarSign, Sparkles, Image as ImageIcon } from 'lucide-react';

const COVER_PHOTOS = [
  { label: 'Paris Sunset', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Tokyo Night', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Rome Colosseum', url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Amalfi Coast', url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Barcelona', url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80' },
];

export default function NewTripModal({ isOpen, onClose }) {
  const { createTrip, cities } = useTrip();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10));
  const [totalBudget, setTotalBudget] = useState('3500');
  const [dailyCap, setDailyCap] = useState('250');
  const [description, setDescription] = useState('');
  const [coverPhoto, setCoverPhoto] = useState(COVER_PHOTOS[0].url);

  if (!isOpen) return null;

  const handleCitySelect = (cityName) => {
    setDestination(cityName);
    const matched = cities.find((c) => c.name.toLowerCase() === cityName.toLowerCase());
    if (matched) {
      setSelectedCity(matched);
      setCoverPhoto(matched.imageUrl);
      if (!name) setName(`${matched.name} Getaway`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newTrip = createTrip({
      name,
      destination: destination || (selectedCity ? selectedCity.name : 'World Explorer'),
      startDate,
      endDate,
      totalBudget: Number(totalBudget),
      dailyCap: Number(dailyCap),
      description,
      coverPhoto,
      initialCity: selectedCity,
    });

    onClose();
    navigate(`/trips/${newTrip.id}/edit`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#f8f9fa] rounded-2xl border border-[#c5c5d3] max-w-xl w-full p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#c5c5d3]">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#00236f]/10 text-[#00236f] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-['Montserrat'] text-[#00236f]">Create New Trip</h2>
              <p className="text-xs text-[#444651] font-['Inter']">Plan your next unforgettable destination</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#edeeef] text-[#757682] hover:text-[#191c1d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Trip Name */}
          <div>
            <label className="block text-xs font-bold font-['Inter'] uppercase tracking-wider text-[#444651] mb-1.5">
              Trip Title *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. European Summer, Tokyo Tech Tour"
              className="w-full px-4 py-2.5 bg-[#f3f4f5] border border-[#c5c5d3] rounded-xl text-sm font-['Inter'] focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] transition-all"
            />
          </div>

          {/* Destination Quick Selector */}
          <div>
            <label className="block text-xs font-bold font-['Inter'] uppercase tracking-wider text-[#444651] mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#00236f]" /> Primary Destination / City
            </label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {cities.slice(0, 5).map((city) => (
                <button
                  type="button"
                  key={city.id}
                  onClick={() => handleCitySelect(city.name)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    destination === city.name
                      ? 'bg-[#00236f] text-white border-[#00236f]'
                      : 'bg-white border-[#c5c5d3] text-[#444651] hover:border-[#00236f]'
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={destination}
              onChange={(e) => handleCitySelect(e.target.value)}
              placeholder="Or enter city / country name..."
              className="w-full px-4 py-2 bg-[#f3f4f5] border border-[#c5c5d3] rounded-xl text-sm font-['Inter'] focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f]"
            />
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold font-['Inter'] uppercase tracking-wider text-[#444651] mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#00236f]" /> Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 bg-[#f3f4f5] border border-[#c5c5d3] rounded-xl text-sm font-['Inter'] focus:outline-none focus:border-[#00236f]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold font-['Inter'] uppercase tracking-wider text-[#444651] mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#00236f]" /> End Date
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 bg-[#f3f4f5] border border-[#c5c5d3] rounded-xl text-sm font-['Inter'] focus:outline-none focus:border-[#00236f]"
              />
            </div>
          </div>

          {/* Budget Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold font-['Inter'] uppercase tracking-wider text-[#444651] mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#006c49]" /> Total Target Budget ($)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                placeholder="4000"
                className="w-full px-4 py-2 bg-[#f3f4f5] border border-[#c5c5d3] rounded-xl text-sm font-['JetBrains Mono'] focus:outline-none focus:border-[#00236f]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold font-['Inter'] uppercase tracking-wider text-[#444651] mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#006c49]" /> Daily Cap ($)
              </label>
              <input
                type="number"
                min="0"
                step="10"
                value={dailyCap}
                onChange={(e) => setDailyCap(e.target.value)}
                placeholder="300"
                className="w-full px-4 py-2 bg-[#f3f4f5] border border-[#c5c5d3] rounded-xl text-sm font-['JetBrains Mono'] focus:outline-none focus:border-[#00236f]"
              />
            </div>
          </div>

          {/* Cover Photo Selection */}
          <div>
            <label className="block text-xs font-bold font-['Inter'] uppercase tracking-wider text-[#444651] mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#00236f]" /> Choose Cover Photo
            </label>
            <div className="grid grid-cols-5 gap-2">
              {COVER_PHOTOS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setCoverPhoto(p.url)}
                  className={`relative rounded-lg overflow-hidden h-14 border-2 transition-all group ${
                    coverPhoto === p.url ? 'border-[#00236f] ring-2 ring-[#00236f]/30' : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                  {coverPhoto === p.url && (
                    <div className="absolute inset-0 bg-[#00236f]/40 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-base">check</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold font-['Inter'] uppercase tracking-wider text-[#444651] mb-1.5">
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are your goals for this trip?"
              className="w-full px-4 py-2 bg-[#f3f4f5] border border-[#c5c5d3] rounded-xl text-sm font-['Inter'] focus:outline-none focus:border-[#00236f]"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-[#c5c5d3]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-[#c5c5d3] text-[#444651] hover:bg-[#edeeef] text-xs font-bold font-['Inter'] uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#00236f] text-white hover:bg-[#1e3a8a] text-xs font-bold font-['Inter'] uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Start Planning
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
