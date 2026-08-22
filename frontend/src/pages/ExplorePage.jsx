import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import { Search, Plus, MapPin, X, IndianRupee, Sparkles, Compass } from 'lucide-react';
import { api } from '../services/api';

export default function ExplorePage({ onOpenNewTrip }) {
  const { cities, trips } = useTrip();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [publicTrips, setPublicTrips] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  // Sync searchTerm with URL query parameter changes
  useEffect(() => {
    const queryParam = searchParams.get('q');
    if (queryParam !== null && queryParam !== searchTerm) {
      setSearchTerm(queryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    api.getPublicTrips().then(setPublicTrips).catch(console.error);
  }, []);

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    if (val.trim()) {
      setSearchParams({ q: val });
    } else {
      setSearchParams({});
    }
  };

  const topRegions = useMemo(() => {
    return cities.filter(c => c.imageUrl);
  }, [cities]);

  // Filter public trips dynamically based on search query
  const filteredPublicTrips = useMemo(() => {
    const list = publicTrips.length > 0 ? publicTrips : trips;
    if (!searchTerm.trim()) return list;

    const q = searchTerm.toLowerCase();
    return list.filter((t) => {
      const matchName = t.name?.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchUser = t.user?.name?.toLowerCase().includes(q) || t.author?.name?.toLowerCase().includes(q);
      const matchStops = t.stops?.some(
        (s) =>
          s.cityName?.toLowerCase().includes(q) ||
          s.city?.name?.toLowerCase().includes(q) ||
          s.state?.toLowerCase().includes(q)
      );
      return matchName || matchDesc || matchUser || matchStops;
    });
  }, [publicTrips, trips, searchTerm]);

  return (
    <div className="flex-grow w-full px-4 md:px-6 max-w-5xl mx-auto py-8 flex flex-col gap-8 relative font-['Montserrat']">
      
      {/* Hero Banner */}
      <section className="w-full rounded-2xl overflow-hidden relative aspect-[16/7] md:aspect-[21/9] bg-[#e1e3e4] flex items-center justify-center shadow-sm border border-[#c5c5d3]" data-purpose="hero-banner">
        <img 
          src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80" 
          alt="Incredible India" 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-white text-3xl md:text-5xl font-bold tracking-wide drop-shadow-md">
            Discover Incredible India
          </h1>
          <p className="text-white/90 text-sm font-['Inter'] mt-2 max-w-xl">
            Explore heritage forts, spiritual ghats, tropical backwaters, and luxury royal stays.
          </p>
        </div>
      </section>

      {/* Search Input Bar */}
      <section className="flex flex-col md:flex-row gap-3 w-full font-['Inter']" data-purpose="search-filters">
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#00236f]" />
          </div>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-xl border-2 border-[#00236f]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#00236f] focus:border-[#00236f] text-sm text-[#191c1d] placeholder-[#757682] shadow-xs transition-all font-semibold" 
            placeholder="Search Jaipur, Udaipur, Varanasi, Kerala, Goa..." 
            aria-label="Search trips" 
          />
          {searchTerm && (
            <button 
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757682] hover:text-[#191c1d]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </section>

      {/* Top Regional Selections */}
      <section className="flex flex-col gap-3" data-purpose="top-regional">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#00236f] flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#FF9800]" /> Top Regional Destinations
          </h2>
          {searchTerm && (
            <button 
              onClick={() => handleSearchChange('')}
              className="text-xs font-bold font-['Inter'] text-[#00236f] hover:underline"
            >
              Clear Search Filter
            </button>
          )}
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar">
          {topRegions.map((city, idx) => (
            <div 
              key={idx}
              onClick={() => {
                setSelectedCity(city);
                handleSearchChange(city.name);
              }}
              className={`block w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-2xl bg-[#e1e3e4] border-2 transition-all overflow-hidden group cursor-pointer relative ${
                searchTerm.toLowerCase() === city.name.toLowerCase()
                  ? 'border-[#00236f] ring-4 ring-[#00236f]/20 scale-105 shadow-md'
                  : 'border-[#c5c5d3] hover:border-[#00236f] shadow-sm hover:shadow-md'
              }`}
            >
              <img 
                src={city.imageUrl} 
                alt={city.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-6">
                <span className="text-white font-bold text-sm tracking-wide block truncate">{city.name}</span>
                <span className="text-[#ffddb8] text-[10px] font-['Inter'] font-semibold truncate block">
                  {city.state || city.country}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Trips */}
      <section className="flex flex-col gap-3 pb-20" data-purpose="previous-trips">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#191c1d]">
            {searchTerm ? `Trips & Itineraries for "${searchTerm}"` : 'Community Trips & Curated Itineraries'}
          </h2>
          <span className="text-xs text-[#757682] font-['Inter'] font-semibold">
            {filteredPublicTrips.length} {filteredPublicTrips.length === 1 ? 'Trip' : 'Trips'} Found
          </span>
        </div>

        {filteredPublicTrips.length === 0 ? (
          <div className="bg-white border border-[#c5c5d3] rounded-2xl p-8 text-center font-['Inter'] space-y-3">
            <p className="text-sm font-semibold text-[#444651]">No community trips found matching "{searchTerm}".</p>
            <button
              onClick={() => handleSearchChange('')}
              className="px-4 py-2 bg-[#00236f] text-white rounded-full text-xs font-bold uppercase tracking-wider"
            >
              View All Destinations
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filteredPublicTrips.map((trip) => (
              <div 
                key={trip.id}
                onClick={() => navigate(`/trips/${trip.id}`)}
                className="block rounded-2xl overflow-hidden border border-[#c5c5d3] bg-white shadow-sm hover:shadow-md transition-all group flex flex-col h-64 relative cursor-pointer hover:-translate-y-1"
              >
                <img 
                  src={trip.coverPhoto || 'https://images.unsplash.com/photo-1506461883276-594a12b11ac3?auto=format&fit=crop&w=800&q=80'} 
                  alt={trip.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-10 flex flex-col justify-end">
                  <span className="text-white font-bold text-base line-clamp-1 font-['Montserrat']">{trip.name}</span>
                  <p className="text-white/80 text-xs font-['Inter'] line-clamp-1 mt-0.5">{trip.description}</p>
                  
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/20 text-xs font-['Inter']">
                    <span className="text-[#ffddb8] font-bold">
                      By {trip.user?.name || trip.author?.name || 'Aarav Sharma'}
                    </span>
                    <span className="text-white font-semibold bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
                      View Itinerary →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* City Spotlight Modal */}
      {selectedCity && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-[#c5c5d3] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative font-['Inter']">
            <div className="relative h-48 bg-[#e1e3e4]">
              <img src={selectedCity.imageUrl} alt={selectedCity.name} className="w-full h-full object-cover" />
              <button 
                onClick={() => setSelectedCity(null)}
                className="absolute top-3 right-3 bg-black/50 hover:bg-black text-white p-2 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="text-2xl font-bold font-['Montserrat'] text-white">{selectedCity.name}</h3>
                <p className="text-xs text-[#ffddb8] font-semibold">{selectedCity.state ? `${selectedCity.state}, ` : ''}{selectedCity.country || 'India'}</p>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <h4 className="text-xs font-bold text-[#757682] uppercase tracking-wider mb-1">Top Curated Experiences</h4>
                <div className="space-y-2">
                  {(selectedCity.activities || []).map((act, i) => (
                    <div key={i} className="p-3 bg-[#f8f9fa] border border-[#c5c5d3] rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-[#191c1d]">{act.name}</div>
                        <div className="text-[#757682]">{act.category}</div>
                      </div>
                      <div className="font-bold font-['JetBrains Mono'] text-[#00236f]">
                        Rs. {Number(act.cost || 1500).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setSelectedCity(null);
                    onOpenNewTrip();
                  }}
                  className="flex-1 py-3 bg-[#00236f] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#1e3a8a] transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Plan Trip to {selectedCity.name}
                </button>
                <button
                  onClick={() => setSelectedCity(null)}
                  className="px-4 py-3 bg-[#f3f4f5] text-[#444651] rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#e1e3e4]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button 
        onClick={onOpenNewTrip}
        aria-label="Plan a trip" 
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-[#00236f] text-white px-5 py-3 rounded-full shadow-lg hover:bg-[#1e3a8a] transition-all hover:scale-105 flex items-center gap-2 z-20 font-bold border border-[#00164e] font-['Inter'] uppercase tracking-wider text-xs"
      >
        <Plus className="w-5 h-5" />
        Plan a trip
      </button>

    </div>
  );
}
