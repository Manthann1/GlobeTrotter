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

  const fillAdmin = () => {
    setEmail('admin@globetrotter.in');
    setPassword('Admin@2026');
  };

  const fillUser = () => {
    setEmail('aarav@globetrotter.in');
    setPassword('Explorer@2026');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
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
      <main className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden" data-purpose="login-card">
        <div className="p-8 sm:p-12">
          
          <div className="text-center mb-6">
            <div className="mx-auto h-20 w-20 rounded-full bg-[#e7e8e9] border-4 border-white shadow-sm flex items-center justify-center mb-3 overflow-hidden" data-purpose="profile-photo-placeholder">
              <svg className="h-10 w-10 text-[#00236f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold font-['Montserrat'] text-[#191c1d] tracking-tight">Welcome Back</h1>
            <p className="text-sm text-[#757682] font-['Inter'] mt-1">Please login to your account</p>
          </div>

          <div className="mb-6 bg-[#f8f9fa] border border-[#c5c5d3] rounded-xl p-3">
            <p className="text-xs font-bold text-[#00236f] mb-2 text-center uppercase tracking-wider">Demo Accounts</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={fillAdmin}
                className="flex-1 py-1.5 px-2 bg-[#00236f] text-white rounded-lg text-xs font-bold hover:bg-[#1e3a8a] transition-colors"
              >
                Fill Admin ID
              </button>
              <button
                type="button"
                onClick={fillUser}
                className="flex-1 py-1.5 px-2 bg-[#e1e3e4] text-[#191c1d] rounded-lg text-xs font-bold hover:bg-[#c5c5d3] transition-colors"
              >
                Fill User ID
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" data-purpose="login-form">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#191c1d] mb-1 font-['Inter']">Email Address</label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-2.5 border border-[#c5c5d3] rounded-xl shadow-sm placeholder-[#757682] focus:outline-none focus:ring-2 focus:ring-[#00236f] focus:border-[#00236f] sm:text-sm font-['Inter'] transition-colors duration-200" 
                placeholder="Enter your email" 
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#191c1d] mb-1 font-['Inter']">Password</label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-2.5 border border-[#c5c5d3] rounded-xl shadow-sm placeholder-[#757682] focus:outline-none focus:ring-2 focus:ring-[#00236f] focus:border-[#00236f] sm:text-sm font-['Inter'] transition-colors duration-200" 
                placeholder="••••••••" 
              />
            </div>

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
