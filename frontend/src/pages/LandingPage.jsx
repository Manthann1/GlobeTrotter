import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';
import { MapPin, Calendar, DollarSign, Sparkles, ArrowRight, Compass, Shield, Heart, IndianRupee, Layers, Share2, Star } from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { cities } = useTrip();

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] text-[#191c1d] font-['Inter'] overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-16">
        {/* Background Image & Light Overlay */}
        <div className="absolute inset-0 bg-[#00236f]/90">
          <img 
            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1920&q=80" 
            alt="Incredible India - Taj Mahal" 
            className="w-full h-full object-cover mix-blend-overlay opacity-40 transform scale-105 animate-[pulse_18s_ease-in-out_infinite_alternate]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#00236f] via-[#00236f]/70 to-[#001445]/80"></div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <span className="inline-flex items-center gap-2 py-2 px-4 mb-6 bg-white/15 backdrop-blur-md border border-white/25 rounded-full text-amber-300 text-xs font-bold uppercase tracking-widest shadow-md">
            <Sparkles className="w-3.5 h-3.5" /> 🇮🇳 Smart Travel Itinerary & Rupee Budget Manager
          </span>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-['Montserrat'] text-white tracking-tight mb-6 leading-tight drop-shadow-md">
            Plan Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-white to-emerald-300">Incredible Journey</span>
          </h1>

          <p className="text-base sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-sm">
            Curate day-by-day itineraries, track your budget in INR, snapshot activity costs, and clone public trips with one click across India and international destinations.
          </p>
          
          {isAuthenticated ? (
            <Link 
              to="/dashboard" 
              className="inline-flex items-center gap-2 bg-[#FF5722] hover:bg-[#e64a19] text-white px-8 py-4 rounded-full font-bold font-['Inter'] text-sm tracking-wider uppercase transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Go to Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/register" 
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-[#FF5722] hover:bg-[#e64a19] text-white px-8 py-4 rounded-full font-bold font-['Inter'] text-sm tracking-wider uppercase transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Start Planning Free <Sparkles className="w-4 h-4" />
              </Link>
              <Link 
                to="/explore" 
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-full font-bold font-['Inter'] text-sm tracking-wider uppercase backdrop-blur-md hover:scale-105 transition-all"
              >
                Explore Destinations <Compass className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Metrics Banner */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
              <p className="text-2xl font-bold text-amber-300 font-['Montserrat']">15+</p>
              <p className="text-xs text-blue-100 font-medium">Curated Cities</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
              <p className="text-2xl font-bold text-white font-['Montserrat']">90+</p>
              <p className="text-xs text-blue-100 font-medium">Experiences & Stays</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
              <p className="text-2xl font-bold text-emerald-300 font-['Montserrat']">100%</p>
              <p className="text-xs text-blue-100 font-medium">Cost Snapshot Guard</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
              <p className="text-2xl font-bold text-amber-300 font-['Montserrat']">1-Click</p>
              <p className="text-xs text-blue-100 font-medium">Shared Trip Copy</p>
            </div>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#f8f9fa] px-4 md:px-10">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-[#00236f] uppercase tracking-widest">Built for Modern Travelers</span>
            <h2 className="text-3xl md:text-5xl font-extrabold font-['Montserrat'] text-[#00236f] mt-2 mb-4">
              Everything You Need For The Perfect Trip
            </h2>
            <p className="text-[#757682] max-w-2xl mx-auto text-base">
              From royal palaces in Jaipur to serene backwaters in Kerala, we handle scheduling, cost snapshots, and budget rollups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e1e3e4] hover:shadow-xl hover:border-[#00236f]/30 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-14 h-14 bg-[#00236f]/10 text-[#00236f] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold font-['Montserrat'] text-[#191c1d] mb-3">Drag & Drop Itineraries</h3>
              <p className="text-[#444651] text-sm leading-relaxed">
                Build day-by-day schedules with ease. Organize stops, schedule activities, and update visit dates with instant overlap validation.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e1e3e4] hover:shadow-xl hover:border-[#006c49]/30 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-14 h-14 bg-[#006c49]/10 text-[#006c49] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <IndianRupee className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold font-['Montserrat'] text-[#191c1d] mb-3">Live SQL Rupee Budgeting</h3>
              <p className="text-[#444651] text-sm leading-relaxed">
                Track expenses live in INR. Real-time SQL aggregation computes cost breakdowns across categories and alerts you when daily caps are exceeded.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e1e3e4] hover:shadow-xl hover:border-[#FF5722]/30 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-14 h-14 bg-[#FF5722]/10 text-[#FF5722] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Share2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold font-['Montserrat'] text-[#191c1d] mb-3">Transactional Public Sharing</h3>
              <p className="text-[#444651] text-sm leading-relaxed">
                Share itineraries via unique public tokens. Friends or travelers can copy your complete trip into their account in a single DB transaction.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Destinations Preview */}
      <section className="py-20 bg-white px-4 md:px-10 border-t border-[#e1e3e4]">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-xs font-bold text-[#00236f] uppercase tracking-widest">Discover Places</span>
              <h2 className="text-3xl font-bold font-['Montserrat'] text-[#191c1d] mt-1">
                Popular Destinations
              </h2>
            </div>
            <Link to="/explore" className="text-[#00236f] font-bold uppercase tracking-wider text-xs hover:underline hidden sm:flex items-center gap-1">
              View All Destinations <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {cities.slice(0, 4).map((city) => (
              <div key={city.id} className="group relative rounded-3xl overflow-hidden h-80 cursor-pointer shadow-md border border-[#e1e3e4]">
                <img src={city.imageUrl} alt={city.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute top-4 right-4 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-[#00236f] shadow-sm flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {city.popularityScore || '4.8'}
                </div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <span className="text-[11px] font-semibold text-white/80 uppercase tracking-wider">{city.country}</span>
                  <h3 className="text-white font-bold font-['Montserrat'] text-xl mb-1">{city.name}</h3>
                  <p className="text-white/90 text-xs">{city.activities?.length || 6} Experiences</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-[#00236f] text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold font-['Montserrat'] mb-6">
            Ready to explore Incredible India?
          </h2>
          <p className="text-base md:text-lg text-blue-100 mb-10 max-w-2xl mx-auto font-medium">
            Join thousands of travelers who use GlobeTrotter to plan their perfect Indian holidays and international getaways.
          </p>
          <Link 
            to={isAuthenticated ? "/dashboard" : "/register"}
            className="inline-flex justify-center items-center gap-2 bg-[#FF5722] hover:bg-[#e64a19] text-white px-10 py-4.5 rounded-full font-bold font-['Inter'] text-sm uppercase tracking-wider transition-all shadow-xl hover:scale-105"
          >
            Create Your Itinerary Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}


