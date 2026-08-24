import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Camera, Upload, Sparkles, User, Mail, Lock, Phone, MapPin, Globe, UserPlus } from 'lucide-react';

const PRESET_AVATARS = [
  { name: 'Explorer', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80' },
  { name: 'Wanderer', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  { name: 'Hiker', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  { name: 'Nomad', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80' },
];

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    country: '',
    additionalInfo: ''
  });
  const [profilePhoto, setProfilePhoto] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProfilePhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password || 'password123',
        phone: formData.phone,
        bio: formData.additionalInfo,
        profilePhoto: profilePhoto || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        currencyPref: 'INR',
        languagePref: 'en',
      };

      const result = await register(userData);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Failed to register');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8 bg-[#f8f9fa] font-['Inter']">
      <main className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-[#e1e3e4] overflow-hidden">
        <div className="p-8 sm:p-10">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-[#00236f] p-0.5 shadow-md flex items-center justify-center text-white">
                <Globe className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-lg font-bold font-['Montserrat'] text-[#00236f]">
                Globe<span className="text-amber-500">Trotter</span>
              </span>
            </Link>
            <Link to="/login" className="text-xs font-semibold text-[#00236f] hover:underline">
              Already registered? Log In
            </Link>
          </div>

          {error && (
            <div className="mb-6 p-3.5 bg-red-100 border border-red-300 text-red-700 rounded-2xl text-xs text-center font-medium shadow-xs">
              {error}
            </div>
          )}

          {/* Photo Upload Section */}
          <div className="flex flex-col items-center mb-8">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative w-24 h-24 rounded-full overflow-hidden bg-[#f3f4f5] border-2 border-dashed border-[#00236f]/40 hover:border-[#00236f] cursor-pointer flex flex-col items-center justify-center group transition-all shadow-sm"
            >
              {profilePhoto ? (
                <img src={profilePhoto} alt="Avatar preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center text-[#757682]">
                  <Camera className="w-6 h-6 mb-1 text-[#00236f]" />
                  <span className="text-[10px] font-bold text-[#00236f]">Upload Photo</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                <Upload className="w-5 h-5 mb-0.5" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Choose File</span>
              </div>
            </div>

            {/* Avatar Presets */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[11px] text-[#757682] font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> Preset avatar:
              </span>
              {PRESET_AVATARS.map((avatar, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setProfilePhoto(avatar.url)}
                  className={`w-7 h-7 rounded-full overflow-hidden border transition-all cursor-pointer ${
                    profilePhoto === avatar.url ? 'border-2 border-[#00236f] ring-2 ring-[#00236f]/30 scale-110' : 'border-gray-200 hover:border-[#00236f]'
                  }`}
                  title={avatar.name}
                >
                  <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* First Name */}
              <div>
                <label className="block text-xs font-semibold text-[#191c1d] mb-1">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#757682]">
                    <User className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" 
                    name="firstName" 
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Alex" 
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#c5c5d3] rounded-2xl text-[#191c1d] placeholder-[#757682] text-sm focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] transition-colors" 
                  />
                </div>
              </div>
              
              {/* Last Name */}
              <div>
                <label className="block text-xs font-semibold text-[#191c1d] mb-1">Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#757682]">
                    <User className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" 
                    name="lastName" 
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Explorer" 
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#c5c5d3] rounded-2xl text-[#191c1d] placeholder-[#757682] text-sm focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] transition-colors" 
                  />
                </div>
              </div>
              
              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-[#191c1d] mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#757682]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input 
                    type="email" 
                    name="email" 
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="alex@globetrotter.in" 
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#c5c5d3] rounded-2xl text-[#191c1d] placeholder-[#757682] text-sm focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] transition-colors" 
                  />
                </div>
              </div>
              
              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-[#191c1d] mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#757682]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input 
                    type="password" 
                    name="password" 
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••" 
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#c5c5d3] rounded-2xl text-[#191c1d] placeholder-[#757682] text-sm focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] transition-colors" 
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-[#191c1d] mb-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#757682]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210" 
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#c5c5d3] rounded-2xl text-[#191c1d] placeholder-[#757682] text-sm focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] transition-colors" 
                  />
                </div>
              </div>
              
              {/* City & Country */}
              <div>
                <label className="block text-xs font-semibold text-[#191c1d] mb-1">Location</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#757682]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" 
                    name="city" 
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Jaipur, India" 
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#c5c5d3] rounded-2xl text-[#191c1d] placeholder-[#757682] text-sm focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] transition-colors" 
                  />
                </div>
              </div>

            </div>
            
            {/* Bio */}
            <div>
              <label className="block text-xs font-semibold text-[#191c1d] mb-1">Travel Bio & Preferences</label>
              <textarea 
                name="additionalInfo" 
                rows="3"
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder="Passionate heritage traveler, foodie & wildlife photographer..." 
                className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c5c5d3] rounded-2xl text-[#191c1d] placeholder-[#757682] text-sm focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] transition-colors resize-none"
              ></textarea>
            </div>
            
            {/* Submit Button */}
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex items-center justify-center py-3.5 px-6 bg-[#00236f] hover:bg-[#1e3a8a] text-white rounded-2xl text-sm font-bold shadow-md transition-all"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    Creating Account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" /> Create Account & Start Exploring
                  </span>
                )}
              </button>
            </div>
          </form>

        </div>
      </main>
    </div>
  );
}


