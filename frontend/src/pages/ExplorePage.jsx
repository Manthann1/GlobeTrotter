import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import { Search, MapPin, Star, DollarSign, Plus, Compass, Sparkles, Filter, IndianRupee } from 'lucide-react';

export default function ExplorePage({ onOpenNewTrip }) {
  const { cities, createTrip, formatPrice } = useTrip();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchTerm(q);
  }, [searchParams]);

  const regions = ['All', 'North India', 'South India', 'Himalayas', 'Coastal India', 'West India', 'International'];

  const filteredCities = cities.filter((city) => {
    const matchesSearch =
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (city.state && city.state.toLowerCase().includes(searchTerm.toLowerCase())) ||
      city.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRegion = selectedRegion === 'All' || city.region === selectedRegion;
    const matchesPrice = selectedPrice === 'All' || city.priceLevel === selectedPrice;

    return matchesSearch && matchesRegion && matchesPrice;
  });

  const handleStartTripWithCity = (city) => {
    const isIndian = city.country === 'India';
    const newTrip = createTrip({
      name: `${city.name} Holiday`,
      destination: `${city.name}${city.state ? `, ${city.state}` : ''}`,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 6 * 86400000).toISOString().slice(0, 10),
      totalBudget: isIndian ? 45000 : 180000,
      dailyCap: isIndian ? 6000 : 15000,
      description: city.description,
      coverPhoto: city.imageUrl,
      initialCity: city,
    });
    navigate(`/trips/${newTrip.id}/edit`);
  };

  return (
    <div className="flex-grow w-full px-4 md:px-10 max-w-[1280px] mx-auto py-8">
      {/* Header Banner */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold font-['Inter'] uppercase tracking-wider text-[#006c49] mb-1">
              <Compass className="w-4 h-4" /> 🇮🇳 Incredible India & Global Discovery
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-['Montserrat'] text-[#00236f] tracking-tight">
              Explore Destinations
            </h1>
            <p className="text-sm text-[#444651] font-['Inter'] mt-1">
              Discover iconic royal forts, tea plantations, sacred ghats, serene backwaters, and high Himalayan passes.
            </p>
          </div>
          <button
            onClick={onOpenNewTrip}
            className="inline-flex items-center gap-2 bg-[#00236f] text-white hover:bg-[#1e3a8a] px-5 py-2.5 rounded-full font-['Inter'] text-xs font-bold uppercase tracking-wider transition-all shadow-md self-start md:self-auto"
          >
            <Plus className="w-4 h-4" /> Plan Custom Journey
          </button>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 p-4 bg-white border border-[#c5c5d3] rounded-2xl shadow-xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#757682]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Jaipur, Kerala, Goa, Ladakh, Varanasi..."
              className="w-full pl-9 pr-4 py-2 bg-[#f3f4f5] border border-[#c5c5d3] rounded-xl text-sm font-['Inter'] focus:outline-none focus:border-[#00236f]"
            />
          </div>

          {/* Region Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold font-['Inter'] uppercase tracking-wider transition-all whitespace-nowrap ${
                  selectedRegion === region
                    ? 'bg-[#00236f] text-white shadow-xs'
                    : 'bg-[#f3f4f5] text-[#444651] hover:bg-[#e1e3e4]'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cities Grid */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold font-['Montserrat'] text-[#191c1d]">
            Destinations & Getaways ({filteredCities.length})
          </h2>
        </div>

        {filteredCities.length === 0 ? (
          <div className="bg-white border border-[#c5c5d3] rounded-2xl p-12 text-center">
            <p className="text-sm text-[#757682] mb-3">No destinations found matching your filters.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedRegion('All');
                setSelectedPrice('All');
              }}
              className="text-xs font-bold font-['Inter'] uppercase tracking-wider text-[#00236f] underline"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.map((city) => (
              <div
                key={city.id}
                className="bg-white border border-[#c5c5d3] rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Image & Badges */}
                <div className="relative h-48 overflow-hidden bg-[#e1e3e4]">
                  <img
                    src={city.imageUrl}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Rating Tag */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold font-['Inter'] flex items-center gap-1 text-[#191c1d] shadow-sm">
                    <Star className="w-3.5 h-3.5 text-[#ef9900] fill-[#ef9900]" />
                    <span>{city.popularityScore}</span>
                  </div>

                  {/* City Name & Tag on image */}
                  <div className="absolute bottom-3 left-4 text-white">
                    <h3 className="text-xl font-bold font-['Montserrat'] tracking-tight">
                      {city.name}
                    </h3>
                    <p className="text-xs text-white/90 font-['Inter'] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#ef9900]" />
                      {city.state ? `${city.state}, ` : ''}{city.country}
                    </p>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold font-['Inter'] uppercase tracking-wider text-[#00236f] bg-[#00236f]/10 px-2 py-0.5 rounded">
                        {city.tag || 'Incredible Destination'}
                      </span>
                      <span className="font-['JetBrains Mono'] text-xs font-bold text-[#5c3800]">
                        {city.priceLevel || '₹₹'}
                      </span>
                    </div>

                    <p className="text-xs text-[#444651] font-['Inter'] leading-relaxed line-clamp-2 mb-4">
                      {city.description}
                    </p>

                    {/* Popular Activities previews */}
                    {city.activities && city.activities.length > 0 && (
                      <div className="mb-4 pt-3 border-t border-[#edeeef]">
                        <span className="text-[10px] font-bold font-['Inter'] uppercase tracking-wider text-[#757682] block mb-1.5">
                          Top Experiences:
                        </span>
                        <ul className="space-y-1">
                          {city.activities.slice(0, 2).map((act, i) => (
                            <li key={i} className="text-xs text-[#191c1d] flex items-center justify-between">
                              <span className="truncate pr-2">• {act.name}</span>
                              <span className="font-['JetBrains Mono'] font-bold text-[#006c49] shrink-0 text-[11px]">
                                {formatPrice(act.cost)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-[#edeeef] flex justify-between items-center">
                    <button
                      onClick={() => handleStartTripWithCity(city)}
                      className="w-full py-2.5 bg-[#00236f] text-white hover:bg-[#1e3a8a] rounded-xl font-['Inter'] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Plan Itinerary for {city.name}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
