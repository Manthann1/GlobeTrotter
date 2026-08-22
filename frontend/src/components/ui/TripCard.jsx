import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Eye } from 'lucide-react';

/**
 * TripCard — "Short Over View of the Trip" card from the wireframe.
 * Used in MyTripsPage (Screen 6) and ProfilePage (Screen 7).
 */
export default function TripCard({ trip, showViewButton = false, compact = false }) {
  const navigate = useNavigate();

  const statusColors = {
    ongoing: 'bg-[#006c49]/10 text-[#006c49] border-[#006c49]/20',
    upcoming: 'bg-[#00236f]/10 text-[#00236f] border-[#00236f]/20',
    past: 'bg-[#757682]/10 text-[#757682] border-[#757682]/20',
    completed: 'bg-[#757682]/10 text-[#757682] border-[#757682]/20',
  };

  const statusLabel = {
    ongoing: 'Ongoing',
    upcoming: 'Upcoming',
    past: 'Completed',
    completed: 'Completed',
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleClick = () => {
    navigate(`/trips/${trip.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white border border-[#e1e3e4] rounded-xl cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all ${
        compact ? 'p-3' : 'p-4'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-['Montserrat'] font-semibold text-[#191c1d] truncate ${compact ? 'text-sm' : 'text-base'}`}>
              {trip.name}
            </h3>
            {trip.status && (
              <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColors[trip.status] || statusColors.upcoming}`}>
                {statusLabel[trip.status] || trip.status}
              </span>
            )}
          </div>

          {trip.subtitle && (
            <p className="flex items-center gap-1 text-xs text-[#757682] mb-1.5">
              <MapPin className="w-3 h-3 shrink-0" />
              {trip.subtitle}
            </p>
          )}

          <p className="flex items-center gap-1 text-xs text-[#757682]">
            <Calendar className="w-3 h-3 shrink-0" />
            {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
          </p>

          {!compact && trip.description && (
            <p className="mt-2 text-xs text-[#444651] line-clamp-2">
              {trip.description}
            </p>
          )}
        </div>

        {trip.coverPhoto && !compact && (
          <img
            src={trip.coverPhoto}
            alt={trip.name}
            className="w-16 h-16 rounded-lg object-cover shrink-0 border border-[#e1e3e4]"
          />
        )}
      </div>

      {showViewButton && (
        <div className="mt-3 pt-2 border-t border-[#edeeef]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/trips/${trip.id}`);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f3f4f5] hover:bg-[#e1e3e4] border border-[#c5c5d3] rounded-lg text-xs font-bold font-['Inter'] text-[#444651] transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </button>
        </div>
      )}
    </div>
  );
}
