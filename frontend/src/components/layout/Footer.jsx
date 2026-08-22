import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#d9dadb]/20 full-width bottom-0 border-t border-[#c5c5d3] w-full py-8 px-4 md:px-10 mt-auto">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#00236f] text-20px fill">explore</span>
          <span className="text-base font-bold font-['Montserrat'] text-[#00236f]">GlobeTrotter</span>
        </div>
        <p className="text-[#444651] text-xs font-['Inter'] text-center md:text-left">
          © {new Date().getFullYear()} GlobeTrotter Travel Planner. Built for explorers worldwide.
        </p>
        <nav className="flex gap-6 flex-wrap justify-center">
          <a href="#privacy" className="text-[#444651] hover:text-[#00236f] text-xs font-bold font-['Inter'] uppercase tracking-wider opacity-80 hover:opacity-100 hover:underline">
            Privacy Policy
          </a>
          <a href="#terms" className="text-[#444651] hover:text-[#00236f] text-xs font-bold font-['Inter'] uppercase tracking-wider opacity-80 hover:opacity-100 hover:underline">
            Terms of Service
          </a>
          <a href="#help" className="text-[#444651] hover:text-[#00236f] text-xs font-bold font-['Inter'] uppercase tracking-wider opacity-80 hover:opacity-100 hover:underline">
            Help Center
          </a>
          <Link to="/explore" className="text-[#444651] hover:text-[#00236f] text-xs font-bold font-['Inter'] uppercase tracking-wider opacity-80 hover:opacity-100 hover:underline">
            Explore
          </Link>
        </nav>
      </div>
    </footer>
  );
}
