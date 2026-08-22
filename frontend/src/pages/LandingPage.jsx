import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';
import { MapPin, Calendar, DollarSign, Sparkles, ArrowRight, Compass, Shield, Heart } from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { cities } = useTrip();

  return (
    <div className="flex flex-col min-h-screen bg-white font-['Inter']">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <img 
            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1920&q=80" 
            alt="Incredible India - Taj Mahal" 
            className="w-full h-full object-cover opacity-60 transform scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <span className="inline-block py-1.5 px-4 mb-6 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-xs font-bold uppercase tracking-[0.2em] shadow-lg">
            🇮🇳 The Ultimate Indian Travel Companion
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-['Montserrat'] text-white tracking-tight mb-6 leading-tight drop-shadow-xl">
            Plan Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-white to-[#138808]">Incredible India</span> Journey
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 font-medium max-w-2xl mx-auto drop-shadow-md">
            GlobeTrotter helps you curate day-by-day itineraries, track your budget in INR, and discover hidden gems across Rajasthan, Kerala, Goa, and beyond.
          </p>
          
          {isAuthenticated ? (
            <Link 
              to="/dashboard" 
              className="inline-flex items-center gap-2 bg-white text-[#00236f] hover:bg-[#f8f9fa] px-8 py-4 rounded-full font-bold font-['Inter'] uppercase tracking-wider transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:-translate-y-1"
            >
              Go to Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/register" 
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-[#FF5722] hover:bg-[#E64A19] text-white px-8 py-4 rounded-full font-bold font-['Inter'] uppercase tracking-wider transition-all shadow-[0_0_40px_rgba(255,87,34,0.4)] hover:shadow-[0_0_60px_rgba(255,87,34,0.6)] hover:-translate-y-1"
              >
                Start Planning Free <Sparkles className="w-5 h-5" />
              </Link>
              <Link 
                to="/explore" 
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-bold font-['Inter'] uppercase tracking-wider transition-all"
              >
                Explore Destinations
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#f8f9fa] px-4 md:px-10">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-['Montserrat'] text-[#00236f] mb-4">
              Everything you need for the perfect trip
            </h2>
            <p className="text-[#757682] max-w-2xl mx-auto">
              From majestic palaces in Jaipur to serene backwaters in Kerala, we handle the logistics so you can focus on the experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e1e3e4] hover:shadow-xl hover:border-[#00236f]/30 transition-all group">
              <div className="w-14 h-14 bg-[#00236f]/10 text-[#00236f] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold font-['Montserrat'] text-[#191c1d] mb-3">Interactive Itineraries</h3>
              <p className="text-[#444651] leading-relaxed">
                Build day-by-day schedules with our drag-and-drop planner. Seamlessly organize your temple visits, safaris, and heritage walks.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e1e3e4] hover:shadow-xl hover:border-[#006c49]/30 transition-all group">
              <div className="w-14 h-14 bg-[#006c49]/10 text-[#006c49] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <DollarSign className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold font-['Montserrat'] text-[#191c1d] mb-3">Smart Rupee Budgeting</h3>
              <p className="text-[#444651] leading-relaxed">
                Track your expenses in INR. Allocate budgets for luxury haveli stays, street food trails, and monument entry fees with visual charts.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e1e3e4] hover:shadow-xl hover:border-[#FF5722]/30 transition-all group">
              <div className="w-14 h-14 bg-[#FF5722]/10 text-[#FF5722] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold font-['Montserrat'] text-[#191c1d] mb-3">Curated Indian Catalog</h3>
              <p className="text-[#444651] leading-relaxed">
                Access a built-in library of top Indian destinations and experiences. From Varanasi Ganga Aarti to Goan scuba diving, add them in one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Preview */}
      <section className="py-20 bg-white px-4 md:px-10">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold font-['Montserrat'] text-[#191c1d] mb-2">
                Popular Destinations
              </h2>
              <p className="text-[#757682]">Discover where GlobeTrotters are heading next</p>
            </div>
            <Link to="/explore" className="text-[#00236f] font-bold uppercase tracking-wider text-xs hover:underline hidden sm:flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {cities.slice(0, 4).map((city) => (
              <div key={city.id} className="group relative rounded-2xl overflow-hidden h-64 md:h-80 cursor-pointer shadow-md">
                <img src={city.imageUrl} alt={city.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-5 w-full">
                  <h3 className="text-white font-bold font-['Montserrat'] text-xl mb-1">{city.name}</h3>
                  <p className="text-white/80 text-xs font-['Inter']">{city.activities?.length || 0} Experiences</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link to="/explore" className="inline-flex items-center gap-2 text-[#00236f] font-bold uppercase tracking-wider text-sm hover:underline">
              View All Destinations <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 relative overflow-hidden bg-[#00236f]">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold font-['Montserrat'] text-white mb-6">
            Ready to explore Incredible India?
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Join thousands of travelers who use GlobeTrotter to plan their perfect Indian holidays and international getaways.
          </p>
          <Link 
            to={isAuthenticated ? "/dashboard" : "/register"}
            className="inline-flex justify-center items-center gap-2 bg-[#FF5722] hover:bg-[#E64A19] text-white px-10 py-5 rounded-full font-bold font-['Inter'] text-lg uppercase tracking-wider transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Create Your Itinerary <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
