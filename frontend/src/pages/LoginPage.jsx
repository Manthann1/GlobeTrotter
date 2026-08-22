import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/'); // Redirect to dashboard
      } else {
        setError(result.message || 'Failed to log in');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f3f4f5]">
      {/* Login Card Container */}
      <main className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden" data-purpose="login-card">
        <div className="p-8 sm:p-12">
          
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="mx-auto h-24 w-24 rounded-full bg-[#e7e8e9] border-4 border-white shadow-sm flex items-center justify-center mb-4 overflow-hidden" data-purpose="profile-photo-placeholder">
              <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold font-['Montserrat'] text-[#191c1d] tracking-tight">Welcome Back</h1>
            <p className="text-sm text-[#757682] font-['Inter'] mt-2">Please login to your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6" data-purpose="login-form">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#191c1d] mb-1 font-['Inter']">Email Address</label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-[#c5c5d3] rounded-xl shadow-sm placeholder-[#757682] focus:outline-none focus:ring-2 focus:ring-[#00236f] focus:border-[#00236f] sm:text-sm font-['Inter'] transition-colors duration-200" 
                placeholder="Enter your email" 
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#191c1d] mb-1 font-['Inter']">Password</label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-[#c5c5d3] rounded-xl shadow-sm placeholder-[#757682] focus:outline-none focus:ring-2 focus:ring-[#00236f] focus:border-[#00236f] sm:text-sm font-['Inter'] transition-colors duration-200" 
                placeholder="••••••••" 
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-[#00236f] hover:bg-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00236f] transition-colors duration-200"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#757682] font-['Inter']">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-[#00236f] hover:text-[#1e3a8a] transition-colors">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
