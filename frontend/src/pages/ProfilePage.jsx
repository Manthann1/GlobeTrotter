import React, { useState, useRef } from 'react';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import TripCard from '../components/ui/TripCard';
import { api } from '../services/api';
import { Camera, Upload, X, Check, Image as ImageIcon, Sparkles } from 'lucide-react';

const PRESET_AVATARS = [
  { name: 'Aarav (Explorer)', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80' },
  { name: 'Ananya (World Wanderer)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  { name: 'Kabir (Mountain Hiker)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  { name: 'Meera (Beach Traveler)', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },
  { name: 'Vikram (Backpack Nomad)', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80' },
  { name: 'Neha (Heritage Explorer)', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80' },
];

export default function ProfilePage() {
  const { user: tripUser, trips, showToast } = useTrip();
  const { user: authUser, updateUser } = useAuth();
  const user = authUser || tripUser;

  const [isEditing, setIsEditing] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  
  const [editForm, setEditForm] = useState({
    name: user?.name || 'Aarav Sharma',
    email: user?.email || 'aarav@globetrotter.in',
    location: user?.location || 'Mumbai, India',
    phone: user?.phone || '+91 98201 23456',
    bio: user?.bio || 'Travel photographer & heritage explorer based in Mumbai.',
    profilePhoto: user?.profilePhoto || user?.avatarUrl || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80'
  });

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setEditForm((prev) => ({ ...prev, profilePhoto: dataUrl }));
      updateUser({ profilePhoto: dataUrl });
      if (showToast) showToast('📷 Profile photo updated successfully!');
      setPhotoModalOpen(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (url) => {
    setEditForm((prev) => ({ ...prev, profilePhoto: url }));
    updateUser({ profilePhoto: url });
    if (showToast) showToast('✨ Profile photo updated!');
    setPhotoModalOpen(false);
  };

  const handleSave = async () => {
    try {
      await updateUser({
        name: editForm.name,
        email: editForm.email,
        profilePhoto: editForm.profilePhoto,
        location: editForm.location,
        phone: editForm.phone,
        bio: editForm.bio,
      });
      setIsEditing(false);
      if (showToast) showToast('Profile details saved!');
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: user?.name || 'Aarav Sharma',
      email: user?.email || 'aarav@globetrotter.in',
      location: user?.location || 'Mumbai, India',
      phone: user?.phone || '+91 98201 23456',
      bio: user?.bio || 'Travel photographer & heritage explorer based in Mumbai.',
      profilePhoto: user?.profilePhoto || user?.avatarUrl || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80'
    });
    setIsEditing(false);
  };

  const now = new Date();
  
  const upcomingTrips = (trips || []).filter(t => {
    const start = new Date(t.startDate);
    return start > now;
  }).map(t => ({...t, status: 'upcoming', subtitle: t.stops?.map(s => s.cityName || s.city?.name).join(', ') || 'No destinations'}));

  const previousTrips = (trips || []).filter(t => {
    const end = new Date(t.endDate);
    return end <= now;
  }).map(t => ({...t, status: 'past', subtitle: t.stops?.map(s => s.cityName || s.city?.name).join(', ') || 'No destinations'}));

  const avatarUrl = editForm.profilePhoto || user?.profilePhoto || user?.avatarUrl || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80";

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      {/* Header Profile Card */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 bg-white p-8 rounded-2xl border border-[#e1e3e4] shadow-sm">
        {/* Interactive Avatar Container */}
        <div className="relative group cursor-pointer" onClick={() => setPhotoModalOpen(true)}>
          <img 
            src={avatarUrl} 
            alt="User Avatar" 
            className="w-28 h-28 rounded-full object-cover border-4 border-[#00236f]/20 shadow-md group-hover:opacity-85 transition-all"
          />
          <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity border-4 border-transparent">
            <Camera className="w-6 h-6 mb-0.5" />
            <span className="text-[10px] font-bold font-['Inter'] uppercase tracking-wider">Change</span>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); setPhotoModalOpen(true); }}
            className="absolute bottom-0 right-0 bg-[#00236f] text-white p-2 rounded-full shadow-lg hover:bg-[#1e3a8a] transition-all cursor-pointer"
            title="Change Photo"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <div className="text-center md:text-left flex-1">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <h1 className="text-3xl font-['Montserrat'] font-bold text-[#191c1d]">{editForm.name}</h1>
            <button
              onClick={() => setPhotoModalOpen(true)}
              className="text-xs font-bold font-['Inter'] text-[#00236f] bg-[#00236f]/10 hover:bg-[#00236f]/20 px-3 py-1 rounded-full flex items-center gap-1 transition-all cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" /> Change Photo
            </button>
          </div>
          <p className="text-[#444651] font-['Inter'] mt-1">{editForm.email}</p>
          <p className="text-xs text-[#757682] font-['Inter'] mt-2 flex items-center gap-1 justify-center md:justify-start">
            📍 {editForm.location}
          </p>
        </div>
      </div>

      {/* User Details Card */}
      <div className="mb-10 bg-white p-8 rounded-2xl border border-[#e1e3e4] shadow-sm">
        <div className="flex justify-between items-center mb-6 border-b border-[#edeeef] pb-4">
          <h2 className="text-xl font-['Montserrat'] font-bold text-[#191c1d]">User Details</h2>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-[#00236f] text-white hover:bg-[#1e3a8a] px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
            >
              Edit Details
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

            {/* Photo URL & File Upload Input */}
            <div>
              <label className="block text-sm font-medium text-[#444651] mb-1 flex justify-between items-center">
                <span>Profile Photo URL</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-[#00236f] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload File from Computer
                </button>
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  name="profilePhoto" 
                  value={editForm.profilePhoto} 
                  onChange={handleEditChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#f3f4f5] border border-[#c5c5d3] rounded-lg px-4 py-2 focus:border-[#00236f] focus:ring-1 focus:outline-none text-xs"
                />
                <button
                  type="button"
                  onClick={() => setPhotoModalOpen(true)}
                  className="px-4 py-2 bg-[#f3f4f5] border border-[#c5c5d3] text-[#00236f] hover:bg-[#e1e3e4] rounded-lg text-xs font-bold shrink-0 transition-colors cursor-pointer"
                >
                  Choose Avatar
                </button>
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
                className="px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-[#444651] hover:bg-[#f3f4f5] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="bg-[#00236f] text-white hover:bg-[#1e3a8a] px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
              >
                Save Details
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

      {/* Preplanned Trips */}
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

      {/* Previous Trips */}
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

      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Change Photo Modal */}
      {photoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-[#c5c5d3] max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-[#c5c5d3] pb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#00236f]/10 text-[#00236f] flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-['Montserrat'] text-[#00236f]">Change Profile Photo</h3>
                  <p className="text-xs text-[#444651]">Upload image file or choose from presets</p>
                </div>
              </div>
              <button
                onClick={() => setPhotoModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#edeeef] text-[#757682] hover:text-[#191c1d] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Preview */}
            <div className="flex flex-col items-center gap-2 py-2">
              <img 
                src={editForm.profilePhoto || avatarUrl} 
                alt="Preview" 
                className="w-24 h-24 rounded-full object-cover border-4 border-[#00236f]/30 shadow-md"
              />
              <span className="text-xs text-[#757682] font-['Inter'] font-semibold">Active Preview</span>
            </div>

            {/* Upload File Action */}
            <div className="p-4 bg-[#f3f4f5] border border-[#c5c5d3] rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-[#00236f]" />
                <div>
                  <h4 className="text-xs font-bold text-[#191c1d]">Upload Image File</h4>
                  <p className="text-[11px] text-[#757682]">PNG, JPG, WEBP up to 10MB</p>
                </div>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-[#00236f] hover:bg-[#1e3a8a] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm shrink-0 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" /> Upload File
              </button>
            </div>

            {/* Preset Avatars Grid */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#444651] mb-3 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#ef9900]" /> Select Curated Travel Avatar
              </label>
              <div className="grid grid-cols-3 gap-3">
                {PRESET_AVATARS.map((avatar, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectPreset(avatar.url)}
                    className={`p-2 border rounded-xl flex flex-col items-center gap-2 hover:border-[#00236f] hover:bg-[#00236f]/5 transition-all text-center cursor-pointer ${
                      editForm.profilePhoto === avatar.url ? 'border-2 border-[#00236f] bg-[#00236f]/10' : 'border-[#c5c5d3]'
                    }`}
                  >
                    <img 
                      src={avatar.url} 
                      alt={avatar.name} 
                      className="w-14 h-14 rounded-full object-cover shadow-sm"
                    />
                    <span className="text-[11px] font-medium text-[#191c1d] leading-tight line-clamp-1">{avatar.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom URL Option */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#444651] mb-2">
                Or Paste Image Web Link (URL)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://..."
                  value={editForm.profilePhoto}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, profilePhoto: e.target.value }))}
                  className="w-full bg-[#f3f4f5] border border-[#c5c5d3] rounded-xl px-3 py-2 text-xs focus:border-[#00236f] focus:outline-none"
                />
                <button
                  onClick={() => {
                    updateUser({ profilePhoto: editForm.profilePhoto });
                    if (showToast) showToast('Profile photo updated!');
                    setPhotoModalOpen(false);
                  }}
                  className="px-4 py-2 bg-[#00236f] text-white rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 hover:bg-[#1e3a8a] cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#c5c5d3]">
              <button
                onClick={() => setPhotoModalOpen(false)}
                className="px-5 py-2 bg-[#f3f4f5] hover:bg-[#e1e3e4] text-[#191c1d] rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
