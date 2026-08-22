import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, Calendar, DollarSign, Sparkles, Image as ImageIcon, IndianRupee } from 'lucide-react';

const COVER_PHOTOS = [
  { label: 'Rajasthan Fort', url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Kerala Backwaters', url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Goa Beaches', url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Varanasi Ghats', url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Ladakh Mountains', url: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80' },
];

export default function NewTripModal({ isOpen, onClose }) {
  const { createTrip, cities, currency } = useTrip();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(() => new Date(Date.now() + 8 * 86400000).toISOString().slice(0, 10));
  const [totalBudget, setTotalBudget] = useState('65000');
  const [dailyCap, setDailyCap] = useState('7500');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newTrip = await createTrip({
      name,
      destination: destination || (selectedCity ? `${selectedCity.name}, ${selectedCity.state || selectedCity.country}` : 'Incredible India'),
      startDate,
      endDate,
      totalBudget: Number(totalBudget),
      dailyCap: Number(dailyCap),
      description,
      coverPhoto,
      initialCity: selectedCity,
    });

    onClose();
    if (newTrip && newTrip.id) {
      navigate(`/trips/${newTrip.id}/edit`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#f8f9fa] rounded-2xl border border-[#c5c5d3] max-w-xl w-full shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-8 pb-4 border-b border-[#c5c5d3] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#00236f]/10 text-[#00236f] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-['Montserrat'] text-[#00236f]">Plan New Journey</h2>
              <p className="text-xs text-[#444651] font-['Inter']">Create your dream travel itinerary in India or abroad</p>
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
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
          {/* Scrollable Form Body */}
          <div className="p-6 md:px-8 py-4 overflow-y-auto space-y-5 flex-grow">
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
                placeholder="e.g. Royal Rajasthan Tour, Kerala Backwaters"
                className="w-full px-4 py-2.5 bg-[#f3f4f5] border border-[#c5c5d3] rounded-xl text-sm font-['Inter'] focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] transition-all"
              />
            </div>

            {/* Destination Quick Selector */}
            <div>
              <label className="block text-xs font-bold font-['Inter'] uppercase tracking-wider text-[#444651] mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#00236f]" /> Popular Destinations
              </label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {cities.slice(0, 6).map((city) => (
                  <button
                    type="button"
                    key={city.id}
                    onClick={() => handleCitySelect(city.name)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      destination.includes(city.name)
                        ? 'bg-[#00236f] text-white border-[#00236f] font-bold'
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
                placeholder="Or enter Indian state / city / country name..."
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
                  <IndianRupee className="w-3.5 h-3.5 text-[#006c49]" /> Target Budget (Rs.)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(e.target.value)}
                  placeholder="65000"
                  className="w-full px-4 py-2 bg-[#f3f4f5] border border-[#c5c5d3] rounded-xl text-sm font-['JetBrains Mono'] focus:outline-none focus:border-[#00236f]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold font-['Inter'] uppercase tracking-wider text-[#444651] mb-1.5 flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-[#006c49]" /> Daily Cap (Rs.)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={dailyCap}
                  onChange={(e) => setDailyCap(e.target.value)}
                  placeholder="7500"
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
                placeholder="E.g. Royal fort tour with family, train bookings via IRCTC..."
                className="w-full px-4 py-2 bg-[#f3f4f5] border border-[#c5c5d3] rounded-xl text-sm font-['Inter'] focus:outline-none focus:border-[#00236f]"
              />
            </div>
          </div>

          {/* Buttons Footer */}
          <div className="flex justify-end gap-3 p-6 md:px-8 py-4 border-t border-[#c5c5d3] shrink-0 bg-white dark:bg-[#f8f9fa] rounded-b-2xl">
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
