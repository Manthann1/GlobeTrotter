import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Camera, Upload, Sparkles } from 'lucide-react';

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
    <div className="bg-[#f8f9fa] min-h-screen flex items-center justify-center p-4 font-['Montserrat']">
      {/* Registration Card */}
      <main className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden" data-purpose="registration-card">
        <div className="p-8">
          
          {/* Header & Back link */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-[#00236f] tracking-tight">Create Account</h1>
            <Link to="/login" className="text-sm font-medium text-[#00236f] hover:underline">
              Back to Login
            </Link>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          {/* Photo Upload Section */}
          <div className="flex flex-col items-center mb-8" data-purpose="photo-upload">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative w-28 h-28 rounded-full overflow-hidden bg-[#f3f4f5] border-2 border-dashed border-[#00236f]/40 hover:border-[#00236f] cursor-pointer flex flex-col items-center justify-center group transition-all shadow-xs"
            >
              {profilePhoto ? (
                <img src={profilePhoto} alt="Avatar preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center text-[#757682]">
                  <Camera className="w-6 h-6 mb-1 text-[#00236f]" />
                  <span className="text-xs font-bold text-[#00236f] font-['Inter']">Upload Photo</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                <Upload className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Choose File</span>
              </div>
            </div>

            {/* Quick Avatar Presets */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[11px] text-[#757682] font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#ef9900]" /> Or choose avatar:
              </span>
              {PRESET_AVATARS.map((avatar, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setProfilePhoto(avatar.url)}
                  className={`w-7 h-7 rounded-full overflow-hidden border transition-all cursor-pointer ${
                    profilePhoto === avatar.url ? 'border-2 border-[#00236f] ring-2 ring-[#00236f]/30' : 'border-gray-200 hover:border-[#00236f]'
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6" data-purpose="registration-form">
            {/* Two Column Grid for User Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-['Inter']">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-[#191c1d] mb-1">First Name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  name="firstName" 
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name" 
                  className="w-full rounded-xl border border-[#c5c5d3] shadow-sm focus:border-[#00236f] focus:ring focus:ring-[#00236f] focus:ring-opacity-50 px-4 py-2 bg-[#f8f9fa] outline-none transition-colors" 
                />
              </div>
              
              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-[#191c1d] mb-1">Last Name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  name="lastName" 
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name" 
                  className="w-full rounded-xl border border-[#c5c5d3] shadow-sm focus:border-[#00236f] focus:ring focus:ring-[#00236f] focus:ring-opacity-50 px-4 py-2 bg-[#f8f9fa] outline-none transition-colors" 
                />
              </div>
              
              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#191c1d] mb-1">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address" 
                  className="w-full rounded-xl border border-[#c5c5d3] shadow-sm focus:border-[#00236f] focus:ring focus:ring-[#00236f] focus:ring-opacity-50 px-4 py-2 bg-[#f8f9fa] outline-none transition-colors" 
                />
              </div>
              
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#191c1d] mb-1">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create Password" 
                  className="w-full rounded-xl border border-[#c5c5d3] shadow-sm focus:border-[#00236f] focus:ring focus:ring-[#00236f] focus:ring-opacity-50 px-4 py-2 bg-[#f8f9fa] outline-none transition-colors" 
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[#191c1d] mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number" 
                  className="w-full rounded-xl border border-[#c5c5d3] shadow-sm focus:border-[#00236f] focus:ring focus:ring-[#00236f] focus:ring-opacity-50 px-4 py-2 bg-[#f8f9fa] outline-none transition-colors" 
                />
              </div>
              
              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-[#191c1d] mb-1">City</label>
                <input 
                  type="text" 
                  id="city" 
                  name="city" 
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City" 
                  className="w-full rounded-xl border border-[#c5c5d3] shadow-sm focus:border-[#00236f] focus:ring focus:ring-[#00236f] focus:ring-opacity-50 px-4 py-2 bg-[#f8f9fa] outline-none transition-colors" 
                />
              </div>
              
              {/* Country */}
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-[#191c1d] mb-1">Country</label>
                <input 
                  type="text" 
                  id="country" 
                  name="country" 
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country" 
                  className="w-full rounded-xl border border-[#c5c5d3] shadow-sm focus:border-[#00236f] focus:ring focus:ring-[#00236f] focus:ring-opacity-50 px-4 py-2 bg-[#f8f9fa] outline-none transition-colors" 
                />
              </div>
            </div>
            
            {/* Additional Information */}
            <div className="font-['Inter']">
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-[#191c1d] mb-1">Additional Information (Bio)</label>
              <textarea 
                id="additionalInfo" 
                name="additionalInfo" 
                rows="4"
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder="Tell us a bit about your travel interests..." 
                className="w-full rounded-xl border border-[#c5c5d3] shadow-sm focus:border-[#00236f] focus:ring focus:ring-[#00236f] focus:ring-opacity-50 px-4 py-2 bg-[#f8f9fa] resize-none outline-none transition-colors"
              ></textarea>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-[#00236f] hover:bg-[#1e3a8a] text-white font-semibold py-2.5 px-8 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00236f]"
              >
                {loading ? 'Registering...' : 'Register User'}
              </button>
            </div>
          </form>

        </div>
      </main>
    </div>
  );
}
