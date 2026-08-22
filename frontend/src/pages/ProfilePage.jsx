import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Bell,
  Check,
  Edit2,
  Share2,
  Sliders,
  LogOut,
  ShieldCheck,
  CreditCard,
  Sparkles,
  Smartphone,
  IndianRupee,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, currency, toggleCurrency, showToast } = useTrip();

  const [activeTab, setActiveTab] = useState('account');
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user.name || 'Aarav Sharma');
  const [email, setEmail] = useState(user.email || 'aarav.sharma@globetrotter.in');
  const [phone, setPhone] = useState('+91 98201 23456');
  const [city, setCity] = useState(user.location || 'Mumbai, Maharashtra, India');
  const [upiId, setUpiId] = useState('aarav.sharma@okaxis');

  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [whatsappNotif, setWhatsappNotif] = useState(true);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsEditing(false);
    showToast('✅ Profile updated successfully!');
  };

  return (
    <div className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-10 py-8 flex flex-col md:flex-row gap-6 font-['Inter']">
      {/* Left Column: Profile Card & Sidebar Navigation */}
      <aside className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-4">
        {/* Profile Card (Bento Style) */}
        <div className="bg-white border border-[#c5c5d3] rounded-2xl p-6 shadow-xs flex flex-col items-center text-center relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-[#00236f] via-[#1e3a8a] to-[#006c49] opacity-20"></div>

          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md z-10 mt-2 mb-3 relative group">
            <img
              src={user.profilePhoto || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80"}
              alt={fullName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <button
              onClick={() => setIsEditing(true)}
              className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          <h1 className="font-['Montserrat'] text-xl font-bold text-[#191c1d] mb-0.5 z-10">
            {fullName}
          </h1>
          <p className="text-xs text-[#757682] mb-3 z-10 font-['Inter']">
            {email}
          </p>

          <div className="inline-flex items-center gap-1.5 bg-[#006c49]/15 text-[#00714d] px-3 py-1 rounded-full text-xs font-bold font-['Inter'] uppercase tracking-wider border border-[#006c49]/20 z-10">
            <Sparkles className="w-3.5 h-3.5 text-[#006c49]" />
            🇮🇳 Pro Explorer
          </div>
        </div>

        {/* Settings Sidebar Navigation */}
        <nav className="bg-white border border-[#c5c5d3] rounded-2xl shadow-xs overflow-hidden">
          <ul className="flex flex-col w-full">
            <li>
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full flex items-center gap-3 px-5 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors text-left ${
                  activeTab === 'account'
                    ? 'bg-[#00236f]/10 border-l-4 border-[#00236f] text-[#00236f]'
                    : 'text-[#444651] hover:bg-[#f3f4f5] hover:text-[#191c1d]'
                }`}
              >
                <User className="w-4 h-4" />
                Account Info
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`w-full flex items-center gap-3 px-5 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors text-left ${
                  activeTab === 'preferences'
                    ? 'bg-[#00236f]/10 border-l-4 border-[#00236f] text-[#00236f]'
                    : 'text-[#444651] hover:bg-[#f3f4f5] hover:text-[#191c1d]'
                }`}
              >
                <Sliders className="w-4 h-4" />
                Preferences & Currency
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('shared')}
                className={`w-full flex items-center gap-3 px-5 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors text-left ${
                  activeTab === 'shared'
                    ? 'bg-[#00236f]/10 border-l-4 border-[#00236f] text-[#00236f]'
                    : 'text-[#444651] hover:bg-[#f3f4f5] hover:text-[#191c1d]'
                }`}
              >
                <Share2 className="w-4 h-4" />
                My Shared Trips
              </button>
            </li>
            <li>
              <button
                onClick={() => showToast('👋 Logged out successfully', 'info')}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors border-t border-[#edeeef] text-left"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Right Column: Active Tab Content */}
      <section className="w-full md:w-2/3 lg:w-3/4 flex flex-col gap-6">
        {/* Glass Header Area */}
        <div className="bg-white/80 backdrop-blur-md border border-[#c5c5d3] rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-['Montserrat'] text-[#191c1d] mb-1">
              Account Details & Preferences
            </h2>
            <p className="text-xs text-[#444651] font-['Inter']">
              Manage your personal information, Indian travel preferences, UPI payment setup, and alerts.
            </p>
          </div>
        </div>

        {/* Tab 1: Account Info */}
        {activeTab === 'account' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Info Card */}
            <div className="bg-white border border-[#c5c5d3] rounded-2xl p-6 shadow-xs flex flex-col">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-base font-bold font-['Montserrat'] text-[#191c1d] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#00236f]" />
                  Personal Information
                </h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs font-bold font-['Inter'] uppercase tracking-wider text-[#00236f] hover:underline"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#444651] uppercase mb-1">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#f3f4f5] border border-[#c5c5d3] rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#444651] uppercase mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-[#f3f4f5] border border-[#c5c5d3] rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#444651] uppercase mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-[#f3f4f5] border border-[#c5c5d3] rounded-xl text-sm font-['JetBrains Mono']"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#444651] uppercase mb-1">Home Base / City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 bg-[#f3f4f5] border border-[#c5c5d3] rounded-xl text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#00236f] text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="flex flex-col gap-4 flex-grow text-xs font-['Inter']">
                  <div>
                    <span className="block font-bold text-[#757682] uppercase mb-0.5">Full Name</span>
                    <p className="text-sm font-semibold text-[#191c1d] pb-2 border-b border-[#edeeef]">{fullName}</p>
                  </div>
                  <div>
                    <span className="block font-bold text-[#757682] uppercase mb-0.5">Email Address</span>
                    <p className="text-sm font-semibold text-[#191c1d] pb-2 border-b border-[#edeeef]">{email}</p>
                  </div>
                  <div>
                    <span className="block font-bold text-[#757682] uppercase mb-0.5">Phone Number</span>
                    <p className="text-sm font-semibold text-[#191c1d] pb-2 border-b border-[#edeeef] font-['JetBrains Mono']">{phone}</p>
                  </div>
                  <div>
                    <span className="block font-bold text-[#757682] uppercase mb-0.5">Home Base City</span>
                    <p className="text-sm font-semibold text-[#191c1d] pb-2 border-b border-[#edeeef] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#006c49]" /> {city}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Security & UPI Payments */}
            <div className="bg-white border border-[#c5c5d3] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold font-['Montserrat'] text-[#191c1d] flex items-center gap-2 mb-5">
                  <ShieldCheck className="w-4 h-4 text-[#00236f]" />
                  Security & UPI Payments
                </h3>

                <div className="space-y-4 text-xs font-['Inter']">
                  <div className="flex justify-between items-center pb-3 border-b border-[#edeeef]">
                    <div>
                      <p className="text-sm font-semibold text-[#191c1d]">UPI ID for Bill Splits</p>
                      <p className="text-[#757682]">{upiId}</p>
                    </div>
                    <button
                      onClick={() => showToast('UPI settings updated')}
                      className="px-3 py-1.5 border border-[#c5c5d3] rounded-lg font-bold text-[11px] uppercase hover:bg-[#f3f4f5]"
                    >
                      Manage
                    </button>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-[#edeeef]">
                    <div>
                      <p className="text-sm font-semibold text-[#191c1d]">Account Password</p>
                      <p className="text-[#757682]">Last changed 2 months ago</p>
                    </div>
                    <button
                      onClick={() => showToast('Password reset link sent to email')}
                      className="px-3 py-1.5 border border-[#c5c5d3] rounded-lg font-bold text-[11px] uppercase hover:bg-[#f3f4f5]"
                    >
                      Change
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold text-[#191c1d]">Two-Factor WhatsApp Auth</p>
                      <p className="text-[#757682]">Enabled via {phone}</p>
                    </div>
                    <span className="bg-[#006c49]/10 text-[#006c49] px-2.5 py-1 rounded-full font-bold text-[10px] uppercase">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#edeeef] mt-6 flex justify-between items-center">
                <span className="text-xs font-bold text-[#ba1a1a]">Danger Zone</span>
                <button
                  onClick={() => showToast('Account deletion protection enabled', 'error')}
                  className="px-3 py-1.5 text-[#ba1a1a] border border-[#ba1a1a]/30 rounded-lg text-xs font-bold uppercase hover:bg-[#ffdad6]/40"
                >
                  Delete Account
                </button>
              </div>
            </div>

            {/* Notification Settings (Span 2) */}
            <div className="bg-white border border-[#c5c5d3] rounded-2xl p-6 shadow-xs lg:col-span-2">
              <div className="flex justify-between items-center mb-5 border-b border-[#edeeef] pb-3">
                <h3 className="text-base font-bold font-['Montserrat'] text-[#191c1d] flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#00236f]" />
                  Indian Travel & Notification Preferences
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-['Inter']">
                {/* WhatsApp Alerts */}
                <div className="flex items-start justify-between p-3 bg-[#f8f9fa] rounded-xl border border-[#c5c5d3]">
                  <div>
                    <p className="font-bold text-sm text-[#191c1d] mb-1 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-[#25D366]" /> WhatsApp Alerts
                    </p>
                    <p className="text-[#757682] leading-relaxed">
                      Instant WhatsApp updates for IRCTC status, itinerary changes, and hotel check-in details.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={whatsappNotif}
                    onChange={(e) => setWhatsappNotif(e.target.checked)}
                    className="w-4 h-4 accent-[#00236f] cursor-pointer mt-1"
                  />
                </div>

                {/* Email Summaries */}
                <div className="flex items-start justify-between p-3 bg-[#f8f9fa] rounded-xl border border-[#c5c5d3]">
                  <div>
                    <p className="font-bold text-sm text-[#191c1d] mb-1 flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-[#00236f]" /> Email Digests
                    </p>
                    <p className="text-[#757682] leading-relaxed">
                      Weekly itinerary PDF digests, expense breakdowns, and flight updates.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotif}
                    onChange={(e) => setEmailNotif(e.target.checked)}
                    className="w-4 h-4 accent-[#00236f] cursor-pointer mt-1"
                  />
                </div>

                {/* Festival & Getaways */}
                <div className="flex items-start justify-between p-3 bg-[#f8f9fa] rounded-xl border border-[#c5c5d3]">
                  <div>
                    <p className="font-bold text-sm text-[#191c1d] mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#ef9900]" /> Weekend Inspiration
                    </p>
                    <p className="text-[#757682] leading-relaxed">
                      Curated weekend getaways from {city.split(',')[0]} during long weekends & Indian festivals.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushNotif}
                    onChange={(e) => setPushNotif(e.target.checked)}
                    className="w-4 h-4 accent-[#00236f] cursor-pointer mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Preferences */}
        {activeTab === 'preferences' && (
          <div className="bg-white border border-[#c5c5d3] rounded-2xl p-6 shadow-xs space-y-6">
            <h3 className="text-lg font-bold font-['Montserrat'] text-[#191c1d]">
              Regional & Language Preferences
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-['Inter']">
              <div className="p-4 bg-[#f8f9fa] rounded-xl border border-[#c5c5d3]">
                <label className="block text-xs font-bold text-[#444651] uppercase mb-2">Display Currency</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleCurrency}
                    className={`flex-1 py-2 rounded-lg font-bold text-xs ${
                      currency === 'INR' ? 'bg-[#00236f] text-white' : 'bg-white border border-[#c5c5d3] text-[#444651]'
                    }`}
                  >
                    ₹ INR (Indian Rupee)
                  </button>
                  <button
                    onClick={toggleCurrency}
                    className={`flex-1 py-2 rounded-lg font-bold text-xs ${
                      currency === 'USD' ? 'bg-[#00236f] text-white' : 'bg-white border border-[#c5c5d3] text-[#444651]'
                    }`}
                  >
                    $ USD (US Dollar)
                  </button>
                </div>
              </div>

              <div className="p-4 bg-[#f8f9fa] rounded-xl border border-[#c5c5d3]">
                <label className="block text-xs font-bold text-[#444651] uppercase mb-2">Preferred Departure Hub</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#c5c5d3] rounded-lg text-xs"
                >
                  <option value="Mumbai, Maharashtra, India">Mumbai (BOM)</option>
                  <option value="Delhi, India">Delhi (DEL)</option>
                  <option value="Bengaluru, Karnataka, India">Bengaluru (BLR)</option>
                  <option value="Chennai, Tamil Nadu, India">Chennai (MAA)</option>
                  <option value="Kolkata, West Bengal, India">Kolkata (CCU)</option>
                  <option value="Hyderabad, Telangana, India">Hyderabad (HYD)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Shared Trips */}
        {activeTab === 'shared' && (
          <div className="bg-white border border-[#c5c5d3] rounded-2xl p-6 shadow-xs">
            <h3 className="text-lg font-bold font-['Montserrat'] text-[#191c1d] mb-4">
              My Shared Public Itineraries
            </h3>
            <div className="divide-y divide-[#edeeef]">
              <div className="py-3 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-[#00236f]">Royal Rajasthan Heritage Tour</h4>
                  <p className="text-xs text-[#757682]">Jaipur & Udaipur • 10 Days • 1,240 Views</p>
                </div>
                <Link
                  to="/trips/trip-royal-rajasthan"
                  className="px-4 py-1.5 bg-[#00236f] text-white rounded-lg text-xs font-bold uppercase"
                >
                  View Live
                </Link>
              </div>
              <div className="py-3 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-[#00236f]">Kerala Backwaters & Tea Hills</h4>
                  <p className="text-xs text-[#757682]">Munnar & Alleppey • 8 Days • 890 Views</p>
                </div>
                <Link
                  to="/trips/trip-kerala-backwaters"
                  className="px-4 py-1.5 bg-[#00236f] text-white rounded-lg text-xs font-bold uppercase"
                >
                  View Live
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
