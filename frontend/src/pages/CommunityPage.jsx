import React, { useState, useEffect, useMemo } from 'react';
import SearchFilterToolbar from '../components/ui/SearchFilterToolbar';
import { Heart, MessageCircle, MapPin, Loader } from 'lucide-react';
import { api } from '../services/api';
import { MOCK_TRIPS } from '../data/mockData';
import { Link } from 'react-router-dom';

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [publicTrips, setPublicTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setIsLoading(true);
        const data = await api.getPublicTrips();
        if (Array.isArray(data) && data.length > 0) {
          setPublicTrips(data);
        } else {
          setPublicTrips(MOCK_TRIPS.filter(t => t.isPublic !== false));
        }
      } catch (error) {
        console.error('Failed to fetch public trips, using mock fallback:', error);
        setPublicTrips(MOCK_TRIPS.filter(t => t.isPublic !== false));
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, []);
  
  const filteredTrips = useMemo(() => {
    return publicTrips.filter(trip => 
      trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (trip.description && trip.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, publicTrips]);

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8 w-full">
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex-1">
          <SearchFilterToolbar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            groupByOptions={[
              {value: 'destination', label: 'Destination'},
              {value: 'date', label: 'Date'}
            ]}
            sortByOptions={[
              {value: 'recent', label: 'Most Recent'},
              {value: 'popular', label: 'Most Popular'},
              {value: 'comments', label: 'Most Comments'}
            ]}
          />
        </div>
        <div className="md:w-1/3 bg-[#f3f4f5] p-6 rounded-xl border border-[#e1e3e4]">
          <p className="font-['Inter'] text-[#444651] text-sm">
            Community section where all the users can share their experience, travel stories, tips, or activities. Using the Search, Group by, Filter and Sorting option, the user can narrow down the result that he is looking for.
          </p>
        </div>
      </div>

      <h1 className="font-['Montserrat'] text-2xl font-bold text-[#191c1d] mb-6">Community Tab</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="py-12 flex justify-center"><Loader className="w-8 h-8 animate-spin text-[#00236f]" /></div>
        ) : filteredTrips.length === 0 ? (
          <div className="text-center py-12 text-[#757682] font-['Inter']">No public trips found.</div>
        ) : (
          filteredTrips.map(trip => (
            <div key={trip.id} className="bg-white rounded-xl border border-[#e1e3e4] p-6 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6">
              {trip.coverPhoto && (
                <img 
                  src={trip.coverPhoto} 
                  alt={trip.name} 
                  className="w-full md:w-48 h-48 md:h-full object-cover rounded-lg"
                />
              )}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src={trip.user?.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(trip.user?.name || 'User')}&background=random`} 
                    alt={trip.user?.name} 
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <div>
                    <h3 className="font-['Inter'] font-semibold text-[#191c1d]">{trip.user?.name}</h3>
                    <span className="text-[#757682] text-xs">{new Date(trip.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <h4 className="font-['Montserrat'] font-bold text-lg text-[#00236f] mb-2">{trip.name}</h4>
                <p className="font-['Inter'] text-[#444651] mb-4 text-sm flex-1">{trip.description || 'No description provided.'}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#e1e3e4]">
                  <div className="flex items-center gap-4 text-[#757682]">
                    <button className="flex items-center gap-1.5 hover:text-[#E65100] transition-colors">
                      <Heart className="w-4 h-4" />
                      <span className="text-xs font-semibold">{trip._count?.sharedLinks || 0}</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-[#00236f] transition-colors">
                      <MapPin className="w-4 h-4 text-[#00236f]" />
                      <span className="text-xs font-semibold font-['Inter'] text-[#191c1d]">
                        {trip._count?.stops || (trip.stops ? trip.stops.length : 1)} Stops
                      </span>
                    </button>
                  </div>
                  <Link 
                    to={`/trips/${trip.id}`} 
                    className="text-xs font-bold font-['Inter'] text-[#00236f] uppercase tracking-wider hover:underline"
                  >
                    View Trip
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
