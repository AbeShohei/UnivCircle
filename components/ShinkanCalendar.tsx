import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Users, Clock } from 'lucide-react';
import { ScheduleEvent } from '../types';

interface ShinkanCalendarProps {
  schedules: ScheduleEvent[];
}

const ShinkanCalendar: React.FC<ShinkanCalendarProps> = ({ schedules }) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  // Set default month to current month
  const defaultMonth = now.getMonth();
  
  const [displayDate, setDisplayDate] = useState(new Date(currentYear, defaultMonth, 1));

  const daysInMonth = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
  };

  const days = [];
  // Empty slots for previous month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  // Days of current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Helper to format YYYY-MM-DD
  const getIsoDate = (day: number) => {
    const y = displayDate.getFullYear();
    const m = String(displayDate.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Helper to determine tooltip position based on column index (0-6)
  const getTooltipPositionClass = (index: number) => {
    const col = index % 7;
    // Left side (Sun, Mon): Align left
    if (col <= 1) return "left-0 translate-x-[-10%]";
    // Right side (Fri, Sat): Align right
    if (col >= 5) return "right-0 translate-x-[10%]";
    // Center
    return "left-1/2 -translate-x-1/2";
  };

  // Helper to align the arrow with the tooltip
  const getArrowPositionClass = (index: number) => {
     const col = index % 7;
     if (col <= 1) return "left-[20%]";
     if (col >= 5) return "right-[20%]";
     return "left-1/2 -translate-x-1/2";
  };

  return (
    <div className="bg-dark-800 rounded-xl border border-white/10 shadow-xl relative">
      {/* Header - Centered Month/Year */}
      <div className="bg-primary-900/20 px-4 py-3 border-b border-white/10 flex items-center justify-center relative rounded-t-xl">
        <button onClick={handlePrevMonth} className="absolute left-4 p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition">
           <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-bold text-white text-lg">
           {displayDate.getFullYear()}年{displayDate.getMonth() + 1}月
        </span>
        <button onClick={handleNextMonth} className="absolute right-4 p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition">
           <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Days Header */}
        <div className="grid grid-cols-7 mb-2 text-center">
          {['日', '月', '火', '水', '木', '金', '土'].map((day, i) => (
            <div key={day} className={`text-xs font-bold ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-500'}`}>
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {days.map((day, idx) => {
            if (!day) return <div key={idx} className="aspect-square"></div>;

            const dateStr = getIsoDate(day);
            const events = schedules.filter(s => s.date === dateStr);
            const hasEvents = events.length > 0;
            const isToday = new Date().toDateString() === new Date(displayDate.getFullYear(), displayDate.getMonth(), day).toDateString();

            return (
              <div key={idx} className="relative aspect-square group">
                <div 
                  className={`w-full h-full rounded-lg border flex flex-col items-center justify-start py-1 sm:py-2 transition-all
                    ${isToday ? 'bg-primary-900/30 border-primary-500/50' : 'bg-white/5 border-white/5 hover:border-white/20'}
                    ${hasEvents ? 'cursor-help hover:bg-white/10' : ''}
                  `}
                >
                  <span className={`text-xs sm:text-sm font-medium ${isToday ? 'text-primary-400' : 'text-gray-300'}`}>
                    {day}
                  </span>
                  
                  {/* Event Marker */}
                  {hasEvents && (
                    <div className="mt-1 flex flex-col items-center gap-0.5">
                      {events.map((evt, i) => (
                         <div key={i} className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-[0_0_8px_rgba(236,72,153,0.6)]"></div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Hover Tooltip (Only if events exist) */}
                {hasEvents && (
                  <div className={`absolute z-50 bottom-[110%] w-64 p-3 bg-dark-900 border border-white/20 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 ${getTooltipPositionClass(idx)}`}>
                    <div className="text-xs font-bold text-gray-400 mb-2 border-b border-white/10 pb-1">
                      {displayDate.getMonth() + 1}/{day} のイベント
                    </div>
                    <div className="space-y-3">
                      {events.map((evt) => (
                        <div key={evt.id} className="text-left">
                          <div className="font-bold text-white text-sm mb-1">{evt.title}</div>
                          <div className="space-y-1">
                             <div className="flex items-start text-xs text-gray-300">
                                <span className="text-gray-500 min-w-[3em]">内容:</span>
                                {evt.content}
                             </div>
                             <div className="flex items-center text-xs text-gray-300">
                                <Clock className="w-3 h-3 mr-1 text-primary-400" />
                                {evt.startTime} ~ {evt.endTime}
                             </div>
                             <div className="flex items-center text-xs text-gray-300">
                                <MapPin className="w-3 h-3 mr-1 text-primary-400" />
                                {evt.location}
                             </div>
                             <div className="flex items-center text-xs text-gray-300">
                                <Users className="w-3 h-3 mr-1 text-primary-400" />
                                定員 {evt.capacity}
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Arrow */}
                    <div className={`absolute top-full border-8 border-transparent border-t-dark-900 ${getArrowPositionClass(idx)}`}></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Footer Legend */}
      <div className="px-4 py-2 bg-white/5 border-t border-white/5 text-xs text-gray-400 flex justify-center gap-4 rounded-b-xl">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"></div>
          <span>イベントあり</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded border border-primary-500/50 bg-primary-900/30"></div>
          <span>今日</span>
        </div>
      </div>
    </div>
  );
};

export default ShinkanCalendar;