import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import confetti from 'canvas-confetti';
import { CheckCircle2, Calendar, Wallet, Edit, LayoutDashboard } from 'lucide-react';

export default function TripCopiedPage() {
  const { tripId } = useParams();
  const { getTrip, formatPrice } = useTrip();
  const navigate = useNavigate();

  const trip = getTrip(tripId) || getTrip('trip-royal-rajasthan');

  useEffect(() => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.55 },
      });
    } catch {
      // ignore
    }
  }, []);

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#f8f9fa] text-center">
        <Link to="/" className="px-6 py-2.5 bg-[#00236f] text-white rounded-full text-xs font-bold uppercase">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const stopsCount = trip.stops ? trip.stops.length : 2;
  const totalBudget = trip.budget?.totalBudget || 85000;

  return (
    <main className="min-h-screen flex-grow flex items-center justify-center p-4 md:p-10 relative overflow-hidden bg-[#f8f9fa] font-['Inter']">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-[#6cf8bb] opacity-20 blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[30vw] h-[30vw] rounded-full bg-[#dce1ff] opacity-30 blur-3xl"></div>
      </div>

      <div className="z-10 w-full max-w-[600px] animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-white/60 shadow-xl p-6 md:p-10 flex flex-col items-center text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 rounded-full bg-[#6cf8bb]/40 flex items-center justify-center mb-6 shadow-xs ring-8 ring-[#6cf8bb]/20">
            <CheckCircle2 className="w-10 h-10 text-[#006c49]" />
          </div>

          {/* Headline */}
          <h1 className="text-2xl md:text-3xl font-bold font-['Montserrat'] text-[#00236f] mb-2 tracking-tight">
            Trip Successfully Copied!
          </h1>
          <p className="text-sm font-['Inter'] text-[#444651] mb-6 max-w-md">
            We've added this Indian itinerary to your account. You can now customize days, hotel stays, thali feasts, and forts to make it your own.
          </p>

          {/* Trip Overview Bento Box */}
          <div className="w-full bg-[#f8f9fa] border border-[#c5c5d3] rounded-xl p-4 text-left mb-6 flex flex-col sm:flex-row gap-4 shadow-xs">
            {/* Thumbnail */}
            <div className="w-full sm:w-28 h-28 rounded-lg overflow-hidden shrink-0 bg-[#e1e3e4]">
              <img
                src={trip.coverPhoto}
                alt={trip.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Trip Details */}
            <div className="flex flex-col justify-center flex-grow">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#1e3a8a] text-[#90a8ff] px-2 py-0.5 rounded text-[10px] font-bold font-['Inter'] uppercase tracking-wider">
                  New Draft
                </span>
                <span className="text-[11px] text-[#006c49] font-bold">🇮🇳 India Itinerary</span>
              </div>

              <h3 className="text-base font-bold font-['Montserrat'] text-[#191c1d] mb-1">
                {trip.name}
              </h3>

              <p className="text-xs text-[#444651] flex items-center gap-1 mb-2 font-['Inter']">
                <Calendar className="w-3.5 h-3.5 text-[#00236f]" />
                10 Days • {stopsCount} Stops ({trip.subtitle || 'Rajasthan'})
              </p>

              {/* Quick Stats */}
              <div className="flex items-center gap-1.5 text-xs font-bold font-['JetBrains Mono'] text-[#00236f]">
                <Wallet className="w-3.5 h-3.5 text-[#006c49]" />
                <span>Target: {formatPrice(totalBudget)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="w-full flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(`/trips/${trip.id}/edit`)}
              className="bg-[#00236f] hover:bg-[#1e3a8a] text-white font-['Inter'] text-xs font-bold uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit New Trip
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-[#f3f4f5] text-[#191c1d] hover:bg-[#e1e3e4] border border-[#c5c5d3] font-['Inter'] text-xs font-bold uppercase tracking-wider py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
