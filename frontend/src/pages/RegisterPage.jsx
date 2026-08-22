import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Camera } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    password: '',
    additionalInfo: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 bg-[#f8f9fa] font-['Inter']">
      <div className="flex flex-col items-center mb-8">
        <Compass className="w-12 h-12 text-[#00236f] mb-2" />
        <h1 className="text-3xl font-bold font-['Montserrat'] text-[#00236f]">GlobeTrotter</h1>
      </div>
      
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm border border-[#e1e3e4] p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-[#191c1d] mb-6 text-center font-['Montserrat']">Create an Account</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Profile Photo Placeholder */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-[#f3f4f5] border border-[#c5c5d3] flex items-center justify-center mb-2 cursor-pointer hover:bg-[#e1e3e4] transition-colors">
              <Camera className="w-8 h-8 text-[#757682]" />
            </div>
            <span className="text-xs text-[#757682] uppercase tracking-wider font-semibold">Upload Photo</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-[#444651] mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full bg-[#f3f4f5] border border-[#c5c5d3] rounded-lg px-4 py-2.5 focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] outline-none text-[#191c1d]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#444651] mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full bg-[#f3f4f5] border border-[#c5c5d3] rounded-lg px-4 py-2.5 focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] outline-none text-[#191c1d]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-[#444651] mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#f3f4f5] border border-[#c5c5d3] rounded-lg px-4 py-2.5 focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] outline-none text-[#191c1d]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#444651] mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-[#f3f4f5] border border-[#c5c5d3] rounded-lg px-4 py-2.5 focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] outline-none text-[#191c1d]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-[#444651] mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full bg-[#f3f4f5] border border-[#c5c5d3] rounded-lg px-4 py-2.5 focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] outline-none text-[#191c1d]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#444651] mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full bg-[#f3f4f5] border border-[#c5c5d3] rounded-lg px-4 py-2.5 focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] outline-none text-[#191c1d]"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#444651] mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-[#f3f4f5] border border-[#c5c5d3] rounded-lg px-4 py-2.5 focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] outline-none text-[#191c1d]"
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-[#444651] mb-1">Additional Information</label>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              rows="3"
              className="w-full bg-[#f3f4f5] border border-[#c5c5d3] rounded-lg px-4 py-2.5 focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] outline-none text-[#191c1d] resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#00236f] text-white hover:bg-[#1e3a8a] rounded-lg py-3 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-70"
          >
            {isLoading ? 'Registering...' : 'Register Users'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-[#444651]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#00236f] font-semibold hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
