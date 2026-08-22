import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import { MapPin } from 'lucide-react';

export default function CreateTripPage() {
  const { cities, createTrip } = useTrip();
  const navigate = useNavigate();

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
      const tripId = await createTrip({
        startDate,
        endDate,
        cityId: cityDetails?.id,
        cityName: selectedPlace
      });
      navigate(`/trip/${tripId}`);
    } catch (error) {
      console.error("Failed to create trip", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (cityName) => {
    setSelectedPlace(cityName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8 font-['Inter']">
      <h1 className="text-3xl font-bold font-['Montserrat'] text-[#191c1d] mb-8">Plan a new trip</h1>

      <div className="bg-white rounded-xl shadow-sm border border-[#e1e3e4] p-6 md:p-8 mb-12">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-[#444651] mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-[#f3f4f5] border border-[#c5c5d3] rounded-lg px-4 py-2.5 focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] outline-none text-[#191c1d]"
              required
            />
          </div>
          
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-[#444651] mb-1">Select a Place</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#757682]" />
              <select
                value={selectedPlace}
                onChange={(e) => setSelectedPlace(e.target.value)}
                className="w-full bg-[#f3f4f5] border border-[#c5c5d3] rounded-lg pl-10 pr-4 py-2.5 focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] outline-none text-[#191c1d] appearance-none"
                required
              >
                <option value="" disabled>Choose a destination</option>
                {cities?.map(city => (
                  <option key={city.id} value={city.name}>{city.name}, {city.country}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-[#444651] mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-[#f3f4f5] border border-[#c5c5d3] rounded-lg px-4 py-2.5 focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] outline-none text-[#191c1d]"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !startDate || !endDate || !selectedPlace}
            className="w-full md:w-auto bg-[#00236f] text-white hover:bg-[#1e3a8a] rounded-lg px-8 py-3 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-70 whitespace-nowrap"
          >
            {isLoading ? 'Creating...' : 'Create Trip'}
          </button>
        </form>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold font-['Montserrat'] text-[#191c1d] mb-6">Suggestion for Places to Visit/Activities to perform</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cities?.map(city => (
            <div 
              key={city.id}
              onClick={() => handleSuggestionClick(city.name)}
              className="bg-white rounded-xl border border-[#e1e3e4] overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={city.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80'} 
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold font-['Montserrat'] text-[#191c1d] mb-1">{city.name}</h3>
                <span className="inline-block bg-[#f3f4f5] text-[#444651] text-xs px-2 py-1 rounded">
                  {city.country}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
