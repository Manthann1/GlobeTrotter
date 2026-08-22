import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import { Plus, MapPin, Calendar, ArrowRight, Sparkles, Compass, Tag, IndianRupee } from 'lucide-react';

export default function DashboardPage({ onOpenNewTrip }) {
  const { trips, user, calculateTripTotals, formatPrice, currency } = useTrip();
  const navigate = useNavigate();
  const [showAllPast, setShowAllPast] = useState(false);

  const upcomingTrips = trips.filter((t) => t.status === 'upcoming' || !t.status);
  const pastTrips = trips.filter((t) => t.status === 'past');

  return (
    <div className="flex-grow w-full px-4 md:px-10 max-w-[1280px] mx-auto py-8">
      {/* Welcome & Stats Section */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold font-['Inter'] uppercase tracking-wider text-[#006c49] bg-[#006c49]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                🇮🇳 Incredible India & Global Explorer
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-['Montserrat'] text-[#00236f] tracking-tight">
              Namaste, {user.name.split(' ')[0]}!
            </h1>
            <p className="text-sm text-[#444651] font-['Inter'] mt-1">
              Ready to plan your next Indian getaway or manage your upcoming royal itineraries?
            </p>
          </div>
          <button
            onClick={onOpenNewTrip}
            className="inline-flex items-center gap-2 bg-[#00236f] text-white hover:bg-[#1e3a8a] px-5 py-2.5 rounded-full font-['Inter'] text-xs font-bold uppercase tracking-wider transition-all shadow-md self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            Plan New Journey
          </button>
        </div>

        {/* 3 Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stat Card 1 */}
          <div className="bg-white border border-[#c5c5d3] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow flex flex-col justify-center">
            <span className="text-[#444651] font-['Inter'] text-xs font-bold uppercase tracking-wider mb-2">
              Total Trips Planned
            </span>
            <span className="text-3xl font-bold font-['Montserrat'] text-[#191c1d]">
              {trips.length}
            </span>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-white border border-[#c5c5d3] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow flex flex-col justify-center">
            <span className="text-[#444651] font-['Inter'] text-xs font-bold uppercase tracking-wider mb-2">
              Upcoming Journeys
            </span>
            <span className="text-3xl font-bold font-['Montserrat'] text-[#191c1d]">
              {upcomingTrips.length}
            </span>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-white border border-[#c5c5d3] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow flex flex-col justify-center">
            <span className="text-[#444651] font-['Inter'] text-xs font-bold uppercase tracking-wider mb-2">
              Estimated Budget Savings
            </span>
            <span className="text-2xl font-bold font-['JetBrains Mono'] text-[#5c3800]">
              {formatPrice(user.stats?.budgetSavings || 38500)}
            </span>
          </div>
        </div>
      </section>

      {/* Main Grid: Upcoming Trips (8 cols) + Past Trips (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upcoming Trips (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex justify-between items-end mb-2">
            <div>
              <h2 className="text-2xl font-bold font-['Montserrat'] text-[#191c1d]">
                Upcoming Journeys
              </h2>
              <p className="text-xs text-[#757682]">Your upcoming itineraries & planned routes</p>
            </div>
            <Link
              to="/explore"
              className="text-xs font-bold font-['Inter'] text-[#00236f] hover:underline flex items-center gap-1 uppercase tracking-wider"
            >
              <Compass className="w-3.5 h-3.5" /> Explore Destinations
            </Link>
          </div>

          {/* Trip Cards List */}
          {upcomingTrips.map((trip) => {
            const { totalSpent } = calculateTripTotals(trip);
            const totalBudget = trip.budget?.totalBudget || 50000;
            const spentPercent = Math.min(100, Math.round((totalSpent / totalBudget) * 100)) || 0;
            const inBudget = totalSpent <= totalBudget;

            // Formatted date
            const dateStr = trip.dateLabel || `${trip.startDate || '2024-10-15'} - ${trip.endDate || '2024-10-25'}`;

            return (
              <div
                key={trip.id}
                className="bg-white border border-[#c5c5d3] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col md:flex-row group"
              >
                {/* Image */}
                <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden bg-[#e1e3e4] shrink-0">
                  <img
                    src={trip.coverPhoto}
                    alt={trip.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:hidden" />
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold font-['Montserrat'] text-[#00236f] group-hover:text-[#1e3a8a] transition-colors">
                        <Link to={`/trips/${trip.id}`} className="hover:underline">
                          {trip.name}
                        </Link>
                      </h3>
                      <span className={`px-2.5 py-1 rounded-md font-['Inter'] text-[11px] font-bold uppercase tracking-wider ${
                        inBudget
                          ? 'bg-[#006c49]/10 text-[#006c49]'
                          : 'bg-[#ba1a1a]/10 text-[#ba1a1a]'
                      }`}>
                        {inBudget ? 'In Budget' : 'Over Budget'}
                      </span>
                    </div>

                    <p className="text-[#444651] font-['Inter'] text-sm mb-1.5 flex items-center gap-1.5 font-medium">
                      <MapPin className="w-4 h-4 text-[#00236f] shrink-0" />
                      {trip.subtitle || (trip.stops && trip.stops.map(s => s.cityName).join(' & ')) || 'Multi-stop itinerary'}
                    </p>
                    <p className="text-[#757682] font-['Inter'] text-xs flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      {dateStr}
                    </p>
                  </div>

                  {/* Budget Spent Bar & Action Links */}
                  <div className="mt-4 pt-3 border-t border-[#edeeef]">
                    <div className="flex justify-between items-center mb-1.5 text-xs font-['Inter']">
                      <span className="font-bold uppercase tracking-wider text-[#444651]">
                        Budget Spent
                      </span>
                      <span className="font-['JetBrains Mono'] font-bold text-[#00236f]">
                        {spentPercent}% ({formatPrice(totalSpent)} / {formatPrice(totalBudget)})
                      </span>
                    </div>
                    <div className="w-full bg-[#e1e3e4] rounded-full h-2 overflow-hidden mb-3">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          spentPercent > 90 ? 'bg-[#FF5722]' : 'bg-[#006c49]'
                        }`}
                        style={{ width: `${spentPercent}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Link
                        to={`/trips/${trip.id}`}
                        className="text-xs font-bold font-['Inter'] text-[#444651] hover:text-[#00236f] transition-colors"
                      >
                        Public Overview →
                      </Link>
                      <Link
                        to={`/trips/${trip.id}/edit`}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-[#00236f]/10 text-[#00236f] hover:bg-[#00236f] hover:text-white font-['Inter'] text-xs font-bold uppercase tracking-wider transition-all"
                      >
                        Open Planner
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Create New Trip Action Button Area (Dashed Box) */}
          <button
            onClick={onOpenNewTrip}
            className="mt-2 w-full py-6 border-2 border-dashed border-[#00236f]/30 rounded-xl bg-[#f8f9fa] hover:bg-[#f3f4f5] text-[#00236f] flex flex-col items-center justify-center gap-2 transition-all duration-200 group hover:border-[#00236f]"
          >
            <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform text-[#00236f]">
              add_circle
            </span>
            <span className="font-['Montserrat'] text-lg font-bold">Plan a New Journey in India</span>
            <span className="text-xs text-[#757682]">Choose from 50+ curated Indian destinations or customize your own</span>
          </button>
        </div>

        {/* Right Column: Past Trips (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4 mt-6 lg:mt-0">
          <h2 className="text-2xl font-bold font-['Montserrat'] text-[#191c1d] mb-1">
            Travel History
          </h2>

          <div className="bg-white border border-[#c5c5d3] rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <ul className="flex flex-col gap-2">
              {(showAllPast ? pastTrips : pastTrips.slice(0, 4)).map((trip) => (
                <li
                  key={trip.id}
                  onClick={() => navigate(`/trips/${trip.id}`)}
                  className="flex items-center gap-3.5 p-2 hover:bg-[#f3f4f5] rounded-lg cursor-pointer transition-colors border-l-4 border-[#c5c5d3] hover:border-[#00236f] group"
                >
                  <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 bg-[#e1e3e4]">
                    <img
                      src={trip.coverPhoto}
                      alt={trip.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-['Montserrat'] font-bold text-sm text-[#191c1d] group-hover:text-[#00236f] transition-colors truncate">
                      {trip.name}
                    </h4>
                    <span className="font-['Inter'] text-xs text-[#757682]">
                      {trip.dateLabel || trip.startDate?.slice(0, 7) || 'Completed'}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#757682] opacity-0 group-hover:opacity-100 transition-opacity" />
                </li>
              ))}
            </ul>

            {pastTrips.length > 3 && (
              <button
                onClick={() => setShowAllPast(!showAllPast)}
                className="w-full text-center mt-4 text-[#00236f] font-['Inter'] text-xs font-bold uppercase tracking-wider hover:underline py-1"
              >
                {showAllPast ? 'Show Less' : 'View All History'}
              </button>
            )}
          </div>

          {/* Incredible India Inspiration Widget */}
          <div className="bg-gradient-to-br from-[#00236f] via-[#1e3a8a] to-[#006c49] text-white rounded-xl p-5 shadow-md mt-2">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#ef9900]" />
              <h3 className="font-bold font-['Montserrat'] text-sm">Top Indian Destinations</h3>
            </div>
            <p className="text-xs text-white/80 font-['Inter'] leading-relaxed mb-4">
              Explore royal palaces of Rajasthan, misty tea hills of Kerala, serene Ganga ghats of Varanasi, or high passes of Ladakh.
            </p>
            <Link
              to="/explore"
              className="inline-block w-full text-center bg-[#ef9900] hover:bg-[#ffb95f] text-[#2a1700] py-2.5 rounded-lg font-['Inter'] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              Explore Indian Destinations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
