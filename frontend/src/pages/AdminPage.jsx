import React, { useState, useMemo } from 'react';
import { MOCK_USERS } from '../data/mockData';
import { useTrip } from '../context/TripContext';
import SearchFilterToolbar from '../components/ui/SearchFilterToolbar';
import { Users, MapPin, Activity, TrendingUp } from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const { cities, formatPrice, trips } = useTrip();

  const TABS = [
    { id: 'users', label: 'Manage Users', icon: Users },
    { id: 'cities', label: 'Manage Cities', icon: MapPin },
    { id: 'activities', label: 'Manage Activities', icon: Activity },
    { id: 'trends', label: 'User Trends and Analytics', icon: TrendingUp },
  ];

  const allActivities = useMemo(() => {
    return (cities || []).flatMap(city => 
      (city.activities || []).map(act => ({ ...act, cityName: city.name }))
    );
  }, [cities]);

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8 w-full">
      <div className="flex space-x-1 border-b border-[#e1e3e4] mb-6 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchQuery('');
            }}
            className={`flex items-center gap-2 px-4 py-3 font-['Inter'] text-sm font-semibold transition-colors whitespace-nowrap ${
              activeTab === tab.id 
                ? 'text-[#00236f] border-b-2 border-[#00236f]' 
                : 'text-[#757682] hover:text-[#191c1d] hover:bg-[#f3f4f5]'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab !== 'trends' && (
        <div className="mb-6">
          <SearchFilterToolbar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-xl border border-[#e1e3e4] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f9fa] border-b border-[#e1e3e4]">
                  <th className="p-4 font-['Inter'] text-sm font-semibold text-[#444651]">User</th>
                  <th className="p-4 font-['Inter'] text-sm font-semibold text-[#444651]">Location</th>
                  <th className="p-4 font-['Inter'] text-sm font-semibold text-[#444651]">Trips</th>
                  <th className="p-4 font-['Inter'] text-sm font-semibold text-[#444651]">Joined</th>
                  <th className="p-4 font-['Inter'] text-sm font-semibold text-[#444651]">Role</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_USERS.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).map(user => (
                  <tr key={user.id} className="border-b border-[#e1e3e4] hover:bg-[#f8f9fa] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} alt={user.name} className="w-8 h-8 rounded-full" />
                        <div>
                          <div className="font-['Inter'] font-semibold text-[#191c1d]">{user.name}</div>
                          <div className="text-sm text-[#757682]">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-[#444651] text-sm">{user.location || 'Unknown'}</td>
                    <td className="p-4 text-[#444651] text-sm">{user.tripsCount || 0}</td>
                    <td className="p-4 text-[#444651] text-sm">{user.joinedDate || 'Recently'}</td>
                    <td className="p-4">
                      {user.isAdmin ? (
                        <span className="bg-[#00236f] text-white text-xs px-2 py-1 rounded-full font-bold uppercase">Admin</span>
                      ) : (
                        <span className="bg-[#f3f4f5] text-[#444651] text-xs px-2 py-1 rounded-full font-bold uppercase">User</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'cities' && (
        <div className="bg-white rounded-xl border border-[#e1e3e4] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f9fa] border-b border-[#e1e3e4]">
                  <th className="p-4 font-['Inter'] text-sm font-semibold text-[#444651]">City</th>
                  <th className="p-4 font-['Inter'] text-sm font-semibold text-[#444651]">Region</th>
                  <th className="p-4 font-['Inter'] text-sm font-semibold text-[#444651]">Country/State</th>
                  <th className="p-4 font-['Inter'] text-sm font-semibold text-[#444651]">Popularity</th>
                  <th className="p-4 font-['Inter'] text-sm font-semibold text-[#444651]">Activities</th>
                </tr>
              </thead>
              <tbody>
                {(cities || []).filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(city => (
                  <tr key={city.id} className="border-b border-[#e1e3e4] hover:bg-[#f8f9fa] transition-colors">
                    <td className="p-4 font-['Inter'] font-semibold text-[#191c1d]">{city.name}</td>
                    <td className="p-4 text-[#444651] text-sm">{city.region}</td>
                    <td className="p-4 text-[#444651] text-sm">{city.country || city.state}</td>
                    <td className="p-4 text-[#444651] text-sm">{city.popularityScore}/100</td>
                    <td className="p-4 text-[#444651] text-sm">{city.activities?.length || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'activities' && (
        <div className="bg-white rounded-xl border border-[#e1e3e4] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f9fa] border-b border-[#e1e3e4]">
                  <th className="p-4 font-['Inter'] text-sm font-semibold text-[#444651]">Activity</th>
                  <th className="p-4 font-['Inter'] text-sm font-semibold text-[#444651]">City</th>
                  <th className="p-4 font-['Inter'] text-sm font-semibold text-[#444651]">Category</th>
                  <th className="p-4 font-['Inter'] text-sm font-semibold text-[#444651]">Duration</th>
                  <th className="p-4 font-['Inter'] text-sm font-semibold text-[#444651]">Cost</th>
                </tr>
              </thead>
              <tbody>
                {allActivities.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase())).map((activity, i) => (
                  <tr key={i} className="border-b border-[#e1e3e4] hover:bg-[#f8f9fa] transition-colors">
                    <td className="p-4 font-['Inter'] font-semibold text-[#191c1d]">{activity.name}</td>
                    <td className="p-4 text-[#444651] text-sm">{activity.cityName}</td>
                    <td className="p-4">
                      <span className="bg-[#f3f4f5] text-[#444651] text-xs px-2 py-1 rounded uppercase tracking-wider">{activity.category}</span>
                    </td>
                    <td className="p-4 text-[#444651] text-sm">{activity.duration}</td>
                    <td className="p-4 font-['JetBrains_Mono'] text-[#006c49] text-sm">{formatPrice ? formatPrice(activity.cost) : `$${activity.cost}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'trends' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl border border-[#e1e3e4] shadow-sm">
              <div className="text-[#757682] text-sm font-semibold uppercase mb-2">Total Users</div>
              <div className="text-3xl font-bold text-[#00236f] font-['Montserrat']">{MOCK_USERS.length}</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-[#e1e3e4] shadow-sm">
              <div className="text-[#757682] text-sm font-semibold uppercase mb-2">Total Cities</div>
              <div className="text-3xl font-bold text-[#006c49] font-['Montserrat']">{(cities || []).length}</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-[#e1e3e4] shadow-sm">
              <div className="text-[#757682] text-sm font-semibold uppercase mb-2">Total Activities</div>
              <div className="text-3xl font-bold text-[#ef9900] font-['Montserrat']">{allActivities.length}</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-[#e1e3e4] shadow-sm">
              <div className="text-[#757682] text-sm font-semibold uppercase mb-2">Total Trips</div>
              <div className="text-3xl font-bold text-[#FF5722] font-['Montserrat']">{trips?.length || 0}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-[#e1e3e4]">
              <h3 className="font-['Montserrat'] font-bold text-[#191c1d] mb-6">Trip Creation Trend</h3>
              <div className="h-48 flex items-end justify-between gap-2 px-2 pb-2 border-b border-l border-[#c5c5d3]">
                <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible preserve-aspect-ratio-none">
                  <polyline
                    fill="none"
                    stroke="#00236f"
                    strokeWidth="2"
                    points="0,40 20,35 40,45 60,25 80,15 100,5"
                  />
                  <circle cx="0" cy="40" r="1.5" fill="#00236f" />
                  <circle cx="20" cy="35" r="1.5" fill="#00236f" />
                  <circle cx="40" cy="45" r="1.5" fill="#00236f" />
                  <circle cx="60" cy="25" r="1.5" fill="#00236f" />
                  <circle cx="80" cy="15" r="1.5" fill="#00236f" />
                  <circle cx="100" cy="5" r="1.5" fill="#00236f" />
                </svg>
              </div>
              <div className="flex justify-between mt-2 text-xs text-[#757682]">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#e1e3e4]">
              <h3 className="font-['Montserrat'] font-bold text-[#191c1d] mb-6">Popular Destinations</h3>
              <div className="flex flex-col gap-4">
                {[
                  { name: 'Tokyo, Japan', val: 85 },
                  { name: 'Paris, France', val: 70 },
                  { name: 'Rome, Italy', val: 65 },
                  { name: 'New York, USA', val: 50 },
                  { name: 'Bali, Indonesia', val: 45 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-32 text-sm text-[#444651] truncate">{item.name}</div>
                    <div className="flex-1 h-3 bg-[#f3f4f5] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#006c49] rounded-full"
                        style={{ width: `${item.val}%` }}
                      ></div>
                    </div>
                    <div className="w-8 text-right text-xs font-bold text-[#191c1d]">{item.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
