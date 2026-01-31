
import React, { useState, useRef, useEffect } from 'react';

interface CalendarPickerProps {
  label?: string;
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  className?: string;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({ label, value, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use today as default if value is empty
  const initialDate = value ? new Date(value) : new Date();
  const [viewDate, setViewDate] = useState(initialDate);
  const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const selectDate = (day: number) => {
    const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const offset = selected.getTimezoneOffset();
    const formatted = new Date(selected.getTime() - (offset * 60 * 1000)).toISOString().split('T')[0];
    onChange(formatted);
    setIsOpen(false);
  };

  const days = [];
  const totalDays = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

  // Padding for previous month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-9" />);
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    const isSelected = value === `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = new Date().toDateString() === new Date(viewDate.getFullYear(), viewDate.getMonth(), d).toDateString();
    
    days.push(
      <button
        key={d}
        onClick={() => selectDate(d)}
        className={`h-9 w-9 flex items-center justify-center rounded-lg text-xs font-bold transition-all
          ${isSelected ? 'bg-brand text-white shadow-md shadow-brand/20' : 'text-slate-600 hover:bg-slate-100'}
          ${isToday && !isSelected ? 'text-brand border border-brand/20' : ''}
        `}
      >
        {d}
      </button>
    );
  }

  const renderDays = () => (
    <>
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => setViewMode('months')}
          className="text-sm font-extrabold text-slate-800 hover:text-brand transition-colors flex items-center gap-1"
        >
          {months[viewDate.getMonth()]} {viewDate.getFullYear()}
          <svg className="w-3 h-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
        </button>
        <div className="flex gap-1">
          <button onClick={handlePrevMonth} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={handleNextMonth} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-[10px] font-black text-slate-300 uppercase">
            {day}
          </div>
        ))}
        {days}
      </div>
    </>
  );

  const renderMonths = () => (
    <div className="grid grid-cols-3 gap-2">
      {months.map((m, idx) => (
        <button
          key={m}
          onClick={() => { setViewDate(new Date(viewDate.getFullYear(), idx, 1)); setViewMode('days'); }}
          className={`py-3 rounded-xl text-xs font-bold transition-all ${viewDate.getMonth() === idx ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          {m.substring(0, 3)}
        </button>
      ))}
      <button 
        onClick={() => setViewMode('years')}
        className="col-span-3 mt-2 py-2 text-[10px] font-black uppercase text-brand hover:underline"
      >
        Select Year
      </button>
    </div>
  );

  const renderYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return (
      <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
        {years.map(y => (
          <button
            key={y}
            onClick={() => { setViewDate(new Date(y, viewDate.getMonth(), 1)); setViewMode('months'); }}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${viewDate.getFullYear() === y ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {y}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={`flex flex-col gap-1.5 w-full relative ${className}`} ref={containerRef}>
      {label && <label className="text-sm font-semibold text-slate-700">{label}</label>}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between px-4 py-2.5 rounded-lg border-2 transition-all cursor-pointer bg-white
          ${isOpen ? 'border-brand ring-4 ring-brand/5' : 'border-slate-200 hover:border-slate-300'}
        `}
      >
        <span className={`text-sm ${value ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
          {value ? new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Select target date'}
        </span>
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top">
          {viewMode === 'days' && renderDays()}
          {viewMode === 'months' && renderMonths()}
          {viewMode === 'years' && renderYears()}
        </div>
      )}
    </div>
  );
};

export default CalendarPicker;
