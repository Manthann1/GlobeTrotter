import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import SearchFilterToolbar from '../components/ui/SearchFilterToolbar';
import { MapPin, Tag, Activity } from 'lucide-react';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { cities } = useTrip();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState('');
  const [groupBy, setGroupBy] = useState('');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null && q !== searchTerm) {
      setSearchTerm(q);
    }
  }, [searchParams]);

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    if (val) {
      setSearchParams({ q: val });
    } else {
      setSearchParams({});
    }
  };

  const groupByOptions = [
    { value: 'country', label: 'Country' },
    { value: 'region', label: 'Region' }
  ];

  const sortByOptions = [
    { value: 'name', label: 'Name' },
    { value: 'popularity', label: 'Popularity' },
    { value: 'cost', label: 'Cost' }
  ];

  const results = useMemo(() => {
    if (!cities) return [];
    
    let filtered = [...cities];
    
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = cities.filter(city => {
        const matchCity = city.name?.toLowerCase().includes(q) || 
                          city.country?.toLowerCase().includes(q) || 
                          city.region?.toLowerCase().includes(q) ||
                          city.tag?.toLowerCase().includes(q);
                          
        const matchActivity = city.activities?.some(a => 
          a.name?.toLowerCase().includes(q) || 
          a.description?.toLowerCase().includes(q)
        );
        
        return matchCity || matchActivity;
      });
    }

    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'popularity') {
      filtered.sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0));
    } else if (sortBy === 'cost') {
      filtered.sort((a, b) => (a.priceLevel || 1) - (b.priceLevel || 1));
    }

    return filtered;
  }, [cities, searchTerm, sortBy]);

  const handleResultClick = (cityId) => {
    navigate(`/explore`);
  };

  const renderPriceLevel = (level) => {
    return '$'.repeat(level || 1);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-['Montserrat'] font-bold text-[#00236f] mb-6">Search Activities & Cities</h1>
        <SearchFilterToolbar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          onSortChange={setSortBy}
          sortByOptions={sortByOptions}
          groupBy={groupBy}
          onGroupChange={setGroupBy}
          groupByOptions={groupByOptions}
          placeholder="Search by city, country, region, tag, or activity..."
        />
      </div>

      <div className="mb-4 text-[#444651] font-['Inter'] font-medium">
        Results ({results.length})
      </div>

      <div className="space-y-4">
        {results.length > 0 ? (
          results.map((city) => (
            <div 
              key={city.id}
              onClick={() => handleResultClick(city.id)}
              className="bg-white border border-[#e1e3e4] rounded-xl p-5 hover:shadow-md hover:border-[#c5c5d3] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between"
            >
              <div className="flex-1">
                <h3 className="text-xl font-['Montserrat'] font-bold text-[#191c1d] mb-2">{city.name}</h3>
                
                <div className="flex flex-wrap gap-4 text-sm font-['Inter'] text-[#444651]">
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-1 text-[#006c49]" />
                    {city.region ? `${city.region}, ` : ''}{city.country}
                  </div>
                  
                  {city.tag && (
                    <div className="flex items-center">
                      <Tag size={16} className="mr-1 text-[#ef9900]" />
                      {city.tag}
                    </div>
                  )}
                  
                  {city.activities && city.activities.length > 0 && (
                    <div className="flex items-center">
                      <Activity size={16} className="mr-1 text-[#00236f]" />
                      {city.activities.length} activities
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0 flex flex-row sm:flex-col items-center sm:items-end justify-between gap-2">
                {city.popularityScore && (
                  <div className="text-sm font-['Inter'] text-[#757682]">
                    Score: <span className="font-bold text-[#191c1d]">{city.popularityScore}/10</span>
                  </div>
                )}
                <div className="font-['JetBrains_Mono'] font-bold text-[#006c49]">
                  {renderPriceLevel(city.priceLevel)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-[#e1e3e4] rounded-xl p-12 text-center text-[#757682] font-['Inter']">
            <p className="text-lg">No results found for "{searchTerm}".</p>
            <p className="mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
