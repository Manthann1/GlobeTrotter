import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { X, Plus, DollarSign, Clock, Tag } from 'lucide-react';

const CATEGORIES = [
  'Sightseeing',
  'Food & Dining',
  'Culture & History',
  'Lodging',
  'Leisure',
  'Adventure',
];

export default function AddActivityModal({ isOpen, onClose, tripId, stopId, stopName }) {
  const { addActivityToStop } = useTrip();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Sightseeing');
  const [cost, setCost] = useState('45');
  const [timeSlot, setTimeSlot] = useState('10:00');
  const [day, setDay] = useState(1);
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    addActivityToStop(tripId, stopId, {
      name,
      category,
      cost: Number(cost || 0),
      timeSlot,
      day: Number(day || 1),
      dayTitle: `Day ${day}: ${name}`,
      description: description || `${category} experience in ${stopName}`,
    });

    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-[#c5c5d3] max-w-lg w-full p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#c5c5d3]">
          <div>
            <h2 className="text-xl font-bold font-['Montserrat'] text-[#00236f]">Add Activity</h2>
            <p className="text-xs text-[#444651] font-['Inter']">Adding to {stopName || 'Stop'}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#edeeef] text-[#757682] hover:text-[#191c1d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold font-['Inter'] uppercase tracking-wider text-[#444651] mb-1.5">
              Activity Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Louvre Guided Tour, Sunset Wine Tasting"
              className="w-full px-4 py-2 bg-[#f3f4f5] border border-[#c5c5d3] rounded-xl text-sm font-['Inter'] focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f]"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold font-['Inter'] uppercase tracking-wider text-[#444651] mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#00236f]" /> Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-xs py-2 px-3 rounded-lg border text-center font-medium transition-all ${
                    category === cat
                      ? 'bg-[#00236f] text-white border-[#00236f] font-bold shadow-xs'
                      : 'bg-white border-[#c5c5d3] text-[#444651] hover:border-[#00236f]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cost & Time & Day */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold font-['Inter'] uppercase tracking-wider text-[#444651] mb-1.5 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-[#006c49]" /> Cost ($)
              </label>
              <input
                type="number"
                min="0"
                step="5"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="45"
                className="w-full px-3 py-2 bg-[#f3f4f5] border border-[#c5c5d3] rounded-xl text-sm font-['JetBrains Mono'] focus:outline-none focus:border-[#00236f]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold font-['Inter'] uppercase tracking-wider text-[#444651] mb-1.5 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#00236f]" /> Time
              </label>
              <input
                type="text"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                placeholder="10:00"
                className="w-full px-3 py-2 bg-[#f3f4f5] border border-[#c5c5d3] rounded-xl text-sm font-['Inter'] focus:outline-none focus:border-[#00236f]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold font-['Inter'] uppercase tracking-wider text-[#444651] mb-1.5">
                Day #
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full px-3 py-2 bg-[#f3f4f5] border border-[#c5c5d3] rounded-xl text-sm font-['Inter'] focus:outline-none focus:border-[#00236f]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold font-['Inter'] uppercase tracking-wider text-[#444651] mb-1.5">
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key highlights, booking details, or address..."
              className="w-full px-4 py-2 bg-[#f3f4f5] border border-[#c5c5d3] rounded-xl text-sm font-['Inter'] focus:outline-none focus:border-[#00236f]"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-[#c5c5d3]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-[#c5c5d3] text-[#444651] hover:bg-[#edeeef] text-xs font-bold font-['Inter'] uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#00236f] text-white hover:bg-[#1e3a8a] text-xs font-bold font-['Inter'] uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add to Stop
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
