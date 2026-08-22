import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa] p-4 font-['Inter']">
      <div className="flex flex-col items-center mb-8">
        <Compass className="w-12 h-12 text-[#00236f] mb-2" />
        <h1 className="text-3xl font-bold font-['Montserrat'] text-[#00236f]">GlobeTrotter</h1>
      </div>
      
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-[#e1e3e4] p-8">
        <h2 className="text-2xl font-semibold text-[#191c1d] mb-6 text-center font-['Montserrat']">Welcome Back</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#444651] mb-1">Email or Username</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#f3f4f5] border border-[#c5c5d3] rounded-lg px-4 py-2.5 focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] outline-none text-[#191c1d] placeholder:text-[#757682]"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#444651] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#f3f4f5] border border-[#c5c5d3] rounded-lg px-4 py-2.5 focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] outline-none text-[#191c1d] placeholder:text-[#757682]"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#00236f] text-white hover:bg-[#1e3a8a] rounded-lg py-3 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-70 mt-6"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-[#444651]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#00236f] font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
