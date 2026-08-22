import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import { Search, Plus } from 'lucide-react';
import { api } from '../services/api';

export default function ExplorePage({ onOpenNewTrip }) {
  const { cities, trips } = useTrip();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [publicTrips, setPublicTrips] = useState([]);

  useEffect(() => {
    api.getPublicTrips().then(setPublicTrips).catch(console.error);
  }, []);

  // Derived data
  const topRegions = cities.filter(c => c.imageUrl).slice(0, 5);

  return (
    <div className="flex-grow w-full px-4 md:px-6 max-w-5xl mx-auto py-8 flex flex-col gap-8 relative font-['Montserrat']">
      
      {/* HeroBanner */}
      <section className="w-full rounded-2xl overflow-hidden relative aspect-[16/7] md:aspect-[21/9] bg-[#e1e3e4] flex items-center justify-center shadow-sm border border-[#c5c5d3]" data-purpose="hero-banner">
        <img 
          src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80" 
          alt="Incredible India" 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <h1 className="text-white text-3xl md:text-5xl font-bold tracking-wide drop-shadow-md">
            Discover Incredible India
          </h1>
        </div>
      </section>

      {/* SearchAndFilters */}
      <section className="flex flex-col md:flex-row gap-3 w-full font-['Inter']" data-purpose="search-filters">
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#757682]" />
          </div>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#c5c5d3] bg-white focus:outline-none focus:ring-2 focus:ring-[#00236f] focus:border-transparent text-sm text-[#191c1d] placeholder-[#757682] shadow-sm" 
            placeholder="Search destinations, regions..." 
            aria-label="Search trips" 
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
          <select aria-label="Group by" className="py-2.5 pl-3 pr-8 rounded-xl border border-[#c5c5d3] bg-white text-sm text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#00236f] appearance-none cursor-pointer shadow-sm">
            <option>Group by</option>
            <option>Region</option>
            <option>State</option>
          </select>
          <select aria-label="Filter" className="py-2.5 pl-3 pr-8 rounded-xl border border-[#c5c5d3] bg-white text-sm text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#00236f] appearance-none cursor-pointer shadow-sm">
            <option>Filter</option>
            <option>Popular</option>
            <option>Budget-friendly</option>
          </select>
          <select aria-label="Sort by" className="py-2.5 pl-3 pr-8 rounded-xl border border-[#c5c5d3] bg-white text-sm text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#00236f] appearance-none cursor-pointer shadow-sm">
            <option>Sort by...</option>
            <option>A-Z</option>
            <option>Top Rated</option>
          </select>
        </div>
      </section>

      {/* TopRegionalSelections */}
      <section className="flex flex-col gap-3" data-purpose="top-regional">
        <h2 className="text-lg font-semibold text-[#191c1d]">Top Regional Selections</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar">
          {topRegions.map((city, idx) => (
            <div 
              key={idx}
              onClick={() => {
                navigate(`/explore?q=${city.name}`);
                setSearchTerm(city.name);
              }}
              className="block w-28 h-28 md:w-36 md:h-36 flex-shrink-0 rounded-2xl bg-[#e1e3e4] border border-[#c5c5d3] shadow-sm hover:shadow-md transition-shadow overflow-hidden group cursor-pointer relative"
            >
              <img 
                src={city.imageUrl} 
                alt={city.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-6">
                <span className="text-white font-bold text-sm tracking-wide">{city.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PreviousTrips */}
      <section className="flex flex-col gap-3 pb-20" data-purpose="previous-trips">
        <h2 className="text-lg font-semibold text-[#191c1d]">Community Trips</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {publicTrips.map((trip) => (
            <div 
              key={trip.id}
              onClick={() => navigate(`/trips/${trip.id}`)}
              className="block rounded-2xl overflow-hidden border border-[#c5c5d3] bg-white shadow-sm hover:shadow-md transition-shadow group flex-col h-48 md:h-56 relative cursor-pointer"
            >
              <img 
                src={trip.coverPhoto || 'https://images.unsplash.com/photo-1506461883276-594a12b11ac3?auto=format&fit=crop&w=800&q=80'} 
                alt={trip.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8 flex flex-col">
                <span className="text-white font-bold text-sm line-clamp-1">{trip.name}</span>
                {trip.user && (
                  <span className="text-[#dce1ff] text-xs font-['Inter'] flex items-center gap-1 mt-1">
                    By {trip.user.name}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FloatingActionButton */}
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
