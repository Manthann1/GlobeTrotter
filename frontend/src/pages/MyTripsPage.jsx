import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import SearchFilterToolbar from '../components/ui/SearchFilterToolbar';
import TripCard from '../components/ui/TripCard';
import { Plus } from 'lucide-react';

export default function MyTripsPage() {
  const { trips } = useTrip();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [groupBy, setGroupBy] = useState('');

  const groupByOptions = [
    { value: 'status', label: 'Status' },
    { value: 'destination', label: 'Destination' }
  ];
  
  const sortByOptions = [
    { value: 'date-asc', label: 'Date (Oldest)' },
    { value: 'date-desc', label: 'Date (Newest)' },
    { value: 'name', label: 'Name' }
  ];

  const now = new Date();

  // Filter and sort trips
  const filteredTrips = useMemo(() => {
    let result = [...(trips || [])];
    
    if (searchTerm) {
      result = result.filter(t => 
        (t.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (t.stops || []).some(s => s.city?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (sortBy === 'date-asc') {
      result.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    } else if (sortBy === 'date-desc') {
      result.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    } else if (sortBy === 'name') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
    
    return result;
  }, [trips, searchTerm, sortBy]);

  const ongoingTrips = filteredTrips.filter(t => {
    const start = new Date(t.startDate);
    const end = new Date(t.endDate);
    return (start <= now && end >= now) || t.status === 'ONGOING';
  }).map(t => ({...t, status: 'ongoing', subtitle: t.stops?.map(s => s.cityName || s.city?.name).filter(Boolean).join(', ') || 'India Getaway'}));

  const upcomingTrips = filteredTrips.filter(t => {
    const start = new Date(t.startDate);
    const end = new Date(t.endDate);
    return start > now || (t.status === 'PLANNED' && end >= now);
  }).map(t => ({...t, status: 'upcoming', subtitle: t.stops?.map(s => s.cityName || s.city?.name).filter(Boolean).join(', ') || 'India Getaway'}));

  const completedTrips = filteredTrips.filter(t => {
    const end = new Date(t.endDate);
    return t.status === 'COMPLETED' || (end < now && t.status !== 'PLANNED' && t.status !== 'ONGOING');
  }).map(t => ({...t, status: 'completed', subtitle: t.stops?.map(s => s.cityName || s.city?.name).filter(Boolean).join(', ') || 'India Getaway'}));

  const Section = ({ title, data }) => (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-['Montserrat'] font-bold text-[#191c1d] mr-3">{title}</h2>
        <span className="bg-[#e1e3e4] text-[#444651] text-xs font-bold px-2.5 py-0.5 rounded-full">
          {data.length}
        </span>
      </div>
      {data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map(trip => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#e1e3e4] rounded-xl p-8 text-center text-[#757682] font-['Inter']">
          No {title.toLowerCase()} found.
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8 relative min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-['Montserrat'] font-bold text-[#00236f] mb-6">My Trips</h1>
        <SearchFilterToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          sortByOptions={sortByOptions}
          groupBy={groupBy}
          onGroupChange={setGroupBy}
          groupByOptions={groupByOptions}
          placeholder="Search trips..."
        />
      </div>

      <Section title="Ongoing" data={ongoingTrips} />
      <Section title="Upcoming" data={upcomingTrips} />
      <Section title="Completed" data={completedTrips} />

      <button
        onClick={() => navigate('/create-trip')}
        className="fixed bottom-8 right-8 bg-[#00236f] text-white p-4 rounded-full shadow-lg hover:bg-[#1e3a8a] hover:shadow-xl transition-all flex items-center justify-center z-10"
        aria-label="Plan a Trip"
      >
        <Plus size={24} className="mr-2" />
        <span className="font-['Inter'] text-sm font-bold uppercase tracking-wider">Plan a Trip</span>
      </button>
    </div>
  );
}
