import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import { MapPin, Calendar, Sparkles, ArrowRight } from 'lucide-react';

export default function CreateTripPage() {
  const { cities, createTrip } = useTrip();
  const navigate = useNavigate();

  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !selectedPlace) return;

    setIsLoading(true);
    try {
      const cityDetails = cities?.find(c => c.id === selectedPlace || c.name === selectedPlace);
      const name = tripName.trim() || `${selectedPlace} Getaway`;
      
      const newTrip = await createTrip({
        name,
        startDate,
        endDate,
        destination: cityDetails ? `${cityDetails.name}, ${cityDetails.country || 'India'}` : selectedPlace,
        description: `Custom itinerary for ${selectedPlace}`,
        coverPhoto: cityDetails?.imageUrl || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
        initialCity: cityDetails,
      });

      if (newTrip && newTrip.id) {
        navigate(`/trips/${newTrip.id}`);
      } else {
        navigate('/my-trips');
      }
    } catch (error) {
      console.error("Failed to create trip", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (cityName) => {
    setSelectedPlace(cityName);
    if (!tripName) {
      setTripName(`${cityName} Exploration`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8 font-['Inter']">
      <h1 className="text-3xl font-bold font-['Montserrat'] text-[#00236f] mb-8 flex items-center gap-2">
        <Sparkles className="w-7 h-7 text-amber-500" /> Plan a New Trip
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border border-[#e1e3e4] p-6 md:p-8 mb-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Trip Name */}
            <div>
              <label className="block text-xs font-bold text-[#444651] mb-1">Trip Name</label>
              <input
                type="text"
                placeholder="e.g. Royal Rajasthan Tour"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                className="w-full bg-[#f8f9fa] border border-[#c5c5d3] rounded-xl px-4 py-2.5 focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] outline-none text-sm text-[#191c1d]"
              />
            </div>

            {/* Destination Dropdown */}
            <div>
              <label className="block text-xs font-bold text-[#444651] mb-1">Select Destination</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#757682]" />
                <select
                  value={selectedPlace}
                  onChange={(e) => {
                    setSelectedPlace(e.target.value);
                    if (!tripName) setTripName(`${e.target.value} Tour`);
                  }}
                  className="w-full bg-[#f8f9fa] border border-[#c5c5d3] rounded-xl pl-10 pr-4 py-2.5 focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] outline-none text-sm text-[#191c1d] appearance-none"
                  required
                >
                  <option value="" disabled>Choose a destination</option>
                  {cities?.map(city => (
                    <option key={city.id} value={city.name}>{city.name}, {city.country}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-xs font-bold text-[#444651] mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#00236f]" /> Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#f8f9fa] border border-[#c5c5d3] rounded-xl px-4 py-2.5 focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] outline-none text-sm text-[#191c1d]"
                required
              />
            </div>
            
            {/* End Date */}
            <div>
              <label className="block text-xs font-bold text-[#444651] mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#00236f]" /> End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[#f8f9fa] border border-[#c5c5d3] rounded-xl px-4 py-2.5 focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] outline-none text-sm text-[#191c1d]"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading || !startDate || !endDate || !selectedPlace}
              className="bg-[#00236f] hover:bg-[#1e3a8a] text-white rounded-xl px-8 py-3 text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? 'Creating Trip...' : (
                <>Create Itinerary <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>

        </form>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold font-['Montserrat'] text-[#191c1d] mb-6">Popular Destinations to Explore</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cities?.map(city => (
            <div 
              key={city.id}
              onClick={() => handleSuggestionClick(city.name)}
              className="bg-white rounded-2xl border border-[#e1e3e4] overflow-hidden cursor-pointer hover:shadow-lg transition-all group"
            >
              <div className="h-44 overflow-hidden relative">
                <img 
                  src={city.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80'} 
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[#00236f] text-xs font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                  {city.activities?.length || 6} Experiences
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold font-['Montserrat'] text-[#191c1d] mb-1">{city.name}</h3>
                <span className="inline-block bg-[#f3f4f5] text-[#444651] text-xs px-2.5 py-0.5 rounded-md font-medium">
                  {city.country || 'India'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

