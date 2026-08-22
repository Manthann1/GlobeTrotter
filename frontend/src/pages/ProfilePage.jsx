git import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import TripCard from '../components/ui/TripCard';

export default function ProfilePage() {
  const { user, trips } = useTrip();
  const [isEditing, setIsEditing] = useState(false);
  
  // Local state for edits
  const [editForm, setEditForm] = useState({
    name: user?.name || 'Jane Doe',
    email: user?.email || 'jane@example.com',
    location: user?.location || 'New York, USA',
    phone: user?.phone || '+1 234 567 8900',
    bio: user?.bio || 'Love traveling and exploring new cultures.'
  });

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // In a real app, save to context/backend
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Revert changes
    setEditForm({
      name: user?.name || 'Jane Doe',
      email: user?.email || 'jane@example.com',
      location: user?.location || 'New York, USA',
      phone: user?.phone || '+1 234 567 8900',
      bio: user?.bio || 'Love traveling and exploring new cultures.'
    });
    setIsEditing(false);
  };

  const now = new Date();
  
  const upcomingTrips = (trips || []).filter(t => {
    const start = new Date(t.startDate);
    return start > now && t.status !== 'past' && t.status !== 'completed';
  });

  const previousTrips = (trips || []).filter(t => {
    const end = new Date(t.endDate);
    return end < now || t.status === 'past' || t.status === 'completed';
  });

  const avatarUrl = user?.avatarUrl || "https://ui-avatars.com/api/?name=Jane+Doe&background=00236f&color=fff";

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      {/* Top Section: Avatar & Basic Info */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 bg-white p-8 rounded-xl border border-[#e1e3e4] shadow-sm">
        <img 
          src={avatarUrl} 
          alt="User Avatar" 
          className="w-24 h-24 rounded-full object-cover border-4 border-[#f3f4f5]"
        />
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-['Montserrat'] font-bold text-[#191c1d]">{editForm.name}</h1>
          <p className="text-[#444651] font-['Inter'] mt-1">{editForm.email}</p>
        </div>
      </div>

      {/* User Details Section */}
      <div className="mb-10 bg-white p-8 rounded-xl border border-[#e1e3e4] shadow-sm">
        <div className="flex justify-between items-center mb-6 border-b border-[#edeeef] pb-4">
          <h2 className="text-xl font-['Montserrat'] font-bold text-[#191c1d]">User Details</h2>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-[#f3f4f5] text-[#444651] hover:bg-[#e1e3e4] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4 font-['Inter']">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#444651] mb-1">Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={editForm.name} 
                  onChange={handleEditChange}
                  className="w-full bg-[#f3f4f5] border border-[#c5c5d3] rounded-lg px-4 py-2 focus:border-[#00236f] focus:ring-1 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#444651] mb-1">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={editForm.email} 
                  onChange={handleEditChange}
                  className="w-full bg-[#f3f4f5] border border-[#c5c5d3] rounded-lg px-4 py-2 focus:border-[#00236f] focus:ring-1 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#444651] mb-1">Location</label>
                <input 
                  type="text" 
                  name="location" 
                  value={editForm.location} 
                  onChange={handleEditChange}
                  className="w-full bg-[#f3f4f5] border border-[#c5c5d3] rounded-lg px-4 py-2 focus:border-[#00236f] focus:ring-1 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#444651] mb-1">Phone</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={editForm.phone} 
                  onChange={handleEditChange}
                  className="w-full bg-[#f3f4f5] border border-[#c5c5d3] rounded-lg px-4 py-2 focus:border-[#00236f] focus:ring-1 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#444651] mb-1">Bio</label>
              <textarea 
                name="bio" 
                value={editForm.bio} 
                onChange={handleEditChange}
                rows="3"
                className="w-full bg-[#f3f4f5] border border-[#c5c5d3] rounded-lg px-4 py-2 focus:border-[#00236f] focus:ring-1 focus:outline-none resize-none"
              ></textarea>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#edeeef]">
              <button 
                onClick={handleCancel}
                className="px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-[#444651] hover:bg-[#f3f4f5] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="bg-[#00236f] text-white hover:bg-[#1e3a8a] px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 font-['Inter']">
            <div>
              <p className="text-sm font-medium text-[#757682] mb-1">Location</p>
              <p className="text-[#191c1d]">{editForm.location}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#757682] mb-1">Phone</p>
              <p className="text-[#191c1d]">{editForm.phone}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-[#757682] mb-1">Bio</p>
              <p className="text-[#191c1d]">{editForm.bio}</p>
            </div>
          </div>
        )}
      </div>

      {/* Preplanned Trips Section */}
      <div className="mb-10">
        <h2 className="text-xl font-['Montserrat'] font-bold text-[#191c1d] mb-6">Preplanned Trips</h2>
        {upcomingTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingTrips.map(trip => (
              <TripCard key={trip.id} trip={trip} showViewButton={true} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#e1e3e4] rounded-xl p-8 text-center text-[#757682] font-['Inter']">
            No preplanned trips.
          </div>
        )}
      </div>

      {/* Previous Trips Section */}
      <div className="mb-10">
        <h2 className="text-xl font-['Montserrat'] font-bold text-[#191c1d] mb-6">Previous Trips</h2>
        {previousTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {previousTrips.map(trip => (
              <TripCard key={trip.id} trip={trip} showViewButton={true} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#e1e3e4] rounded-xl p-8 text-center text-[#757682] font-['Inter']">
            No previous trips.
          </div>
        )}
      </div>
    </div>
  );
}
