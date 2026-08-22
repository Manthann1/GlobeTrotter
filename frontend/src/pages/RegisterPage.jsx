import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '', // Needed for API, even though not in HTML design
    phone: '',
    city: '',
    country: '',
    additionalInfo: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // API expects name as a single string
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password || 'password123', // Default if user doesn't enter it (as per HTML design lacking password)
        phone: formData.phone,
        bio: formData.additionalInfo,
        currencyPref: 'INR',
        languagePref: 'en',
      };

      const result = await register(userData);
      if (result.success) {
        navigate('/'); // Redirect to dashboard
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

          {/* Photo Upload Placeholder */}
          <div className="flex justify-center mb-8" data-purpose="photo-upload">
            <div className="w-24 h-24 rounded-full bg-[#edeeef] flex items-center justify-center border-2 border-dashed border-[#c5c5d3] cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="text-sm text-[#757682] font-medium font-['Inter']">Photo</span>
            </div>
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
