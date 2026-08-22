import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTrip } from '../../context/TripContext';
import { useAuth } from '../../context/AuthContext';
import { Search, Bell, Settings, Plus, Compass, Calendar, LayoutDashboard, Menu, X, Globe, IndianRupee, LogOut, User } from 'lucide-react';

export default function Navbar({ onOpenNewTrip }) {
  const { user: tripUser, searchQuery, setSearchQuery, currency, toggleCurrency } = useTrip();
  const { user: authUser, logout } = useAuth();
  const user = authUser || tripUser;
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white dark:bg-[#f8f9fa] docked full-width top-0 border-b border-[#c5c5d3] shadow-xs z-50 sticky transition-all">
      <div className="flex justify-between items-center w-full px-4 md:px-10 max-w-[1280px] mx-auto h-16">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl md:text-2xl font-bold font-['Montserrat'] text-[#00236f] flex items-center gap-2 tracking-tight hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-[#00236f] text-28px fill">explore</span>
            GlobeTrotter
            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#FF9800]/15 text-[#E65100] tracking-wider hidden sm:inline-block">
              India
            </span>
          </Link>

          <form onSubmit={handleSearchSubmit} className="hidden md:flex relative ml-2">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#757682] text-sm pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Jaipur, Goa, Kerala, Manali..."
              className="pl-9 pr-4 py-1.5 bg-[#f3f4f5] border border-[#c5c5d3] rounded-full text-xs font-['Inter'] focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] w-72 transition-all text-[#191c1d]"
            />
          </form>
        </div>

        <nav className="hidden md:flex items-center gap-8 h-full">
          <Link
            to="/dashboard"
            className={`h-full flex items-center px-1 font-['Inter'] text-xs font-bold uppercase tracking-wider transition-colors ${
              isActive('/dashboard')
                ? 'text-[#00236f] border-b-2 border-[#00236f] pb-0.5'
                : 'text-[#444651] hover:text-[#00236f] hover:bg-[#f3f4f5] px-2 rounded-t'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/my-trips"
            className={`h-full flex items-center px-1 font-['Inter'] text-xs font-bold uppercase tracking-wider transition-colors ${
              isActive('/my-trips')
                ? 'text-[#00236f] border-b-2 border-[#00236f] pb-0.5'
                : 'text-[#444651] hover:text-[#00236f] hover:bg-[#f3f4f5] px-2 rounded-t'
            }`}
          >
            My Trips
          </Link>
          <Link
            to="/calendar"
            className={`h-full flex items-center px-1 font-['Inter'] text-xs font-bold uppercase tracking-wider transition-colors ${
              isActive('/calendar')
                ? 'text-[#00236f] border-b-2 border-[#00236f] pb-0.5'
                : 'text-[#444651] hover:text-[#00236f] hover:bg-[#f3f4f5] px-2 rounded-t'
            }`}
          >
            Calendar
          </Link>
          <Link
            to="/community"
            className={`h-full flex items-center px-1 font-['Inter'] text-xs font-bold uppercase tracking-wider transition-colors ${
              isActive('/community')
                ? 'text-[#00236f] border-b-2 border-[#00236f] pb-0.5'
                : 'text-[#444651] hover:text-[#00236f] hover:bg-[#f3f4f5] px-2 rounded-t'
            }`}
          >
            Community
          </Link>
          {(user?.isAdmin || user?.role === 'ADMIN') && (
            <Link
              to="/admin"
              className={`h-full flex items-center px-1 font-['Inter'] text-xs font-bold uppercase tracking-wider transition-colors ${
                isActive('/admin')
                  ? 'text-[#00236f] border-b-2 border-[#00236f] pb-0.5'
                  : 'text-[#444651] hover:text-[#00236f] hover:bg-[#f3f4f5] px-2 rounded-t'
              }`}
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2.5">
          {user ? (
            <>
              <button
                onClick={onOpenNewTrip}
                className="hidden sm:inline-flex items-center gap-1.5 bg-[#5c3800] text-[#ef9900] hover:bg-[#3e2400] hover:text-[#ffddb8] transition-all px-4 py-2 rounded-full font-['Inter'] text-xs font-bold uppercase tracking-wider shadow-xs hover:shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                New Trip
              </button>

              <div className="flex items-center gap-1">
                <button
                  title="Notifications"
                  className="p-2 text-[#444651] hover:text-[#00236f] hover:bg-[#f3f4f5] rounded-full transition-colors relative"
                >
                  <span className="material-symbols-outlined text-[20px]">notifications</span>
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF5722] rounded-full ring-2 ring-white"></span>
                </button>

                <div className="relative ml-1">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="w-9 h-9 rounded-full overflow-hidden shrink-0 border-2 border-[#00236f]/30 hover:border-[#00236f] transition-all shadow-2xs focus:outline-none"
                  >
                    <img
                      src={user.profilePhoto || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80"}
                      alt={user.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white border border-[#c5c5d3] rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2 border-b border-[#edeeef]">
                        <p className="text-sm font-bold text-[#191c1d]">{user.name}</p>
                        <p className="text-xs text-[#757682] truncate">{user.location || 'Mumbai, India'}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#00236f] hover:bg-[#f3f4f5]"
                      >
                        <User className="w-4 h-4 text-[#00236f]" /> My Profile
                      </Link>
                      <Link
                        to="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#444651] hover:bg-[#f3f4f5] hover:text-[#00236f]"
                      >
                        <LayoutDashboard className="w-4 h-4" /> My Dashboard
                      </Link>
                      <Link
                        to="/explore"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#444651] hover:bg-[#f3f4f5] hover:text-[#00236f]"
                      >
                        <Compass className="w-4 h-4" /> Explore Destinations
                      </Link>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenNewTrip();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#5c3800] hover:bg-[#f3f4f5]"
                      >
                        <Plus className="w-4 h-4" /> Plan a New Trip
                      </button>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 border-t border-[#edeeef] mt-1 pt-2"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 ml-2 hidden sm:flex">
              <Link to="/login" className="px-4 py-1.5 text-xs font-bold font-['Inter'] text-[#00236f] hover:bg-[#f3f4f5] rounded-full transition-colors uppercase tracking-wider">Login</Link>
              <Link to="/register" className="px-4 py-1.5 bg-[#00236f] text-white rounded-full text-xs font-bold font-['Inter'] hover:bg-[#1e3a8a] transition-colors uppercase tracking-wider shadow-sm">Sign Up</Link>
            </div>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#444651] hover:bg-[#f3f4f5] rounded-full transition-colors ml-1"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#c5c5d3] px-4 py-4 space-y-3 shadow-lg">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#757682] text-sm">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Jaipur, Goa, Kerala..."
              className="w-full pl-9 pr-4 py-2 bg-[#f3f4f5] border border-[#c5c5d3] rounded-lg text-sm"
            />
          </form>
          {user ? (
            <>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg font-bold text-sm text-[#00236f] bg-[#dce1ff]/40"
              >
                <User className="w-4 h-4" /> My Profile
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm text-[#444651] hover:bg-[#f3f4f5]"
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <Link
                to="/explore"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm text-[#444651] hover:bg-[#f3f4f5]"
              >
                <Compass className="w-4 h-4" /> Explore
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenNewTrip();
                }}
                className="w-full mt-2 py-2.5 bg-[#5c3800] text-[#ef9900] rounded-lg font-bold text-sm text-center flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> New Trip
              </button>
            </>
          ) : (
            <>
              <Link
                to="/explore"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm text-[#444651] hover:bg-[#f3f4f5]"
              >
                <Compass className="w-4 h-4" /> Explore
              </Link>
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-[#c5c5d3]">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 border border-[#c5c5d3] text-[#00236f] rounded-lg font-bold text-sm text-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 bg-[#00236f] text-white rounded-lg font-bold text-sm text-center"
                >
                  Sign Up
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
