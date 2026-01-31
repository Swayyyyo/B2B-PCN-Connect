
import React from 'react';
import { ProjectStatus, Project } from '../types';

interface SummaryCardProps {
  project: Project;
  onClick?: () => void;
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

const SummaryCard: React.FC<SummaryCardProps> = ({ project, onClick }) => {
  const { name, status, progress, owner } = project;
  
  const statusColors = {
    'Active': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'In Review': 'bg-blue-50 text-blue-700 border-blue-100',
    'Completed': 'bg-slate-100 text-slate-700 border-slate-200',
    'On Hold': 'bg-amber-50 text-amber-700 border-amber-100'
  };

  const radius = 17;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <button 
      onClick={onClick}
      className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand/30 transition-all duration-200 group flex flex-col h-full text-left w-full cursor-pointer focus:ring-2 focus:ring-brand/20 outline-none"
    >
      {/* Header: Name and Progress Indicator */}
      <div className="flex justify-between items-start gap-3 w-full">
        <h4 className="text-[15px] font-bold text-slate-900 group-hover:text-brand transition-colors leading-tight">
          {name}
        </h4>
        <div className="relative w-10 h-10 flex-shrink-0 translate-y-[-2px]">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 40 40">
            <circle 
              cx="20" 
              cy="20" 
              r={radius} 
              stroke="currentColor" 
              strokeWidth="3.5" 
              fill="transparent" 
              className="text-slate-100" 
            />
            <circle 
              cx="20" 
              cy="20" 
              r={radius} 
              stroke="currentColor" 
              strokeWidth="3.5" 
              fill="transparent" 
              strokeDasharray={circumference} 
              strokeDashoffset={offset} 
              className="text-brand transition-all duration-700 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-700">
            {progress}%
          </span>
        </div>
      </div>

      {/* Middle: Status Badge */}
      <div className="mt-3">
        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border inline-block ${statusColors[status]}`}>
          {status}
        </span>
      </div>

      {/* Spacer to push footer to bottom */}
      <div className="flex-grow min-h-[16px]" />

      {/* Footer: Owner and Action */}
      <div className="pt-4 border-t border-slate-50 flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-subtle flex items-center justify-center text-[10px] font-bold text-brand border border-brand/10 shadow-sm">
            {getInitials(owner)}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-none">Owner</span>
            <span className="text-xs text-slate-600 font-semibold mt-0.5">{owner}</span>
          </div>
        </div>
        <div className="text-slate-300 group-hover:text-brand transition-colors p-1 group-hover:bg-slate-50 rounded">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
};

export default SummaryCard;
