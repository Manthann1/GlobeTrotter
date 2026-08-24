import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Sparkles, UserCheck, ShieldCheck, ArrowRight, Globe } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8f9fa] font-['Inter']">
      <main className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#e1e3e4] overflow-hidden">
        <div className="p-8 sm:p-10">
          
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-3 group">
              <div className="w-12 h-12 rounded-2xl bg-[#00236f] p-0.5 shadow-md flex items-center justify-center text-white">
                <Globe className="w-6 h-6 text-amber-400" />
              </div>
              <span className="text-xl font-bold font-['Montserrat'] tracking-tight text-[#00236f]">
                Globe<span className="text-amber-500">Trotter</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold font-['Montserrat'] text-[#191c1d] tracking-tight">Welcome Back</h1>
            <p className="text-xs text-[#757682] mt-1 font-medium">Sign in to your travel workspace & budget manager</p>
          </div>

          {/* Quick Demo Credentials */}
          <div className="mb-6 bg-[#f3f4f5] border border-[#c5c5d3] rounded-2xl p-3.5">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-bold text-[#00236f] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Demo Account Fill
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillUser}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#00236f] hover:bg-[#1e3a8a] text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                <UserCheck className="w-3.5 h-3.5" /> User ID
              </button>
              <button
                type="button"
                onClick={fillAdmin}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#e1e3e4] hover:bg-[#c5c5d3] text-[#191c1d] rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#00236f]" /> Admin ID
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-100 border border-red-300 text-red-700 rounded-2xl text-xs text-center font-medium shadow-xs">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-[#191c1d] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#757682]">
                  <Mail className="w-4 h-4" />
                </div>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#f8f9fa] border border-[#c5c5d3] rounded-2xl text-[#191c1d] placeholder-[#757682] text-sm focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] transition-colors" 
                  placeholder="aarav@globetrotter.in" 
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-[#191c1d] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#757682]">
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#f8f9fa] border border-[#c5c5d3] rounded-2xl text-[#191c1d] placeholder-[#757682] text-sm focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] transition-colors" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex items-center justify-center py-3.5 px-4 bg-[#00236f] hover:bg-[#1e3a8a] text-white rounded-2xl text-sm font-bold shadow-md transition-all"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    Logging in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Log In <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center border-t border-[#e1e3e4] pt-5">
            <p className="text-xs text-[#757682]">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-[#00236f] hover:underline">
                Create an account
              </Link>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}


