import React, { useState, useMemo } from 'react';
import { useTrip } from '../context/TripContext';
import SearchFilterToolbar from '../components/ui/SearchFilterToolbar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const COLORS = ['bg-[#00236f]', 'bg-[#006c49]', 'bg-[#ef9900]', 'bg-[#FF5722]'];

export default function CalendarPage() {
  const { trips } = useTrip();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentYear, currentMonth, i));
    }
    return days;
  }, [currentYear, currentMonth, firstDayOfMonth, daysInMonth]);

  const getTripsForDay = (date) => {
    if (!date) return [];
    
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    const compareTime = compareDate.getTime();
    
    return (trips || []).filter(trip => {
      if (!trip.startDate || !trip.endDate) return false;
      const start = new Date(trip.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(trip.endDate);
      end.setHours(23, 59, 59, 999);
      
      return compareTime >= start.getTime() && compareTime <= end.getTime();
    });
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8 w-full">
      <div className="mb-6">
        <SearchFilterToolbar 
          searchQuery=""
          onSearchChange={() => {}}
        />
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="font-['Montserrat'] text-2xl font-bold text-[#191c1d]">Calendar View</h1>
        
        <div className="flex items-center gap-4 bg-white border border-[#e1e3e4] rounded-lg p-2">
          <button onClick={prevMonth} className="p-1 hover:bg-[#f3f4f5] rounded-md transition-colors">
            <ChevronLeft className="w-5 h-5 text-[#444651]" />
          </button>
          <span className="font-['Montserrat'] font-semibold text-[#191c1d] min-w-[120px] text-center">
            {monthName} {currentYear}
          </span>
          <button onClick={nextMonth} className="p-1 hover:bg-[#f3f4f5] rounded-md transition-colors">
            <ChevronRight className="w-5 h-5 text-[#444651]" />
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#e1e3e4] rounded-xl overflow-hidden">
        <div className="grid grid-cols-7 border-b border-[#e1e3e4] bg-[#f8f9fa]">
          {DAYS.map(day => (
            <div key={day} className="p-3 text-center text-xs font-bold text-[#757682] tracking-wider">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 auto-rows-[minmax(120px,auto)]">
          {calendarDays.map((date, idx) => {
            const dayTrips = getTripsForDay(date);
            return (
              <div 
                key={idx} 
                className={`border-r border-b border-[#e1e3e4] p-2 ${!date ? 'bg-[#f8f9fa]' : 'bg-white'} ${idx % 7 === 6 ? 'border-r-0' : ''}`}
              >
                {date && (
                  <>
                    <div className={`text-sm font-semibold mb-2 ${date.toDateString() === new Date().toDateString() ? 'text-[#00236f] bg-[#e6ebf5] w-6 h-6 rounded-full flex items-center justify-center' : 'text-[#444651]'}`}>
                      {date.getDate()}
                    </div>
                    <div className="flex flex-col gap-1">
                      {dayTrips.map((trip, tripIdx) => {
                        const colorClass = COLORS[tripIdx % COLORS.length];
                        return (
                          <div 
                            key={trip.id}
                            onClick={() => navigate(`/trips/${trip.id}`)}
                            className={`${colorClass} text-white text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-90 transition-opacity`}
                            title={trip.name}
                          >
                            {trip.name}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
