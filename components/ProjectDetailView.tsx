
import React from 'react';
import { Project } from '../types';
import Button from './Button';

interface ProjectDetailViewProps {
  project: Project;
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ project }) => {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header Info */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest bg-brand/10 text-brand px-2 py-1 rounded">
              Strategic Entity
            </span>
            <span className="text-slate-400 text-sm font-medium">| Project ID: #{project.id}</span>
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">{project.name}</h2>
          <div className="flex flex-wrap items-center gap-6 mt-4 text-slate-500">
            <span className="text-sm font-bold flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              {project.company}
            </span>
            <span className="text-sm font-bold flex items-center gap-2">
               <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              Deadline: {project.deadline}
            </span>
            <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
              project.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
              project.status === 'In Review' ? 'bg-blue-50 text-blue-600 border-blue-100' :
              'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              {project.status}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="shadow-sm">Share Report</Button>
          <Button className="shadow-lg shadow-brand/20">Edit Workflow</Button>
        </div>
      </section>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Involved Team</p>
          <h3 className="text-3xl font-black text-brand">{project.teamSize}</h3>
          <div className="w-full bg-slate-100 h-1 mt-4 rounded-full overflow-hidden">
            <div className="bg-brand h-full" style={{ width: '70%' }}></div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Est. Budget</p>
          <h3 className="text-3xl font-black text-slate-800">{formatCurrency(project.budget)}</h3>
          <p className="text-[10px] text-emerald-600 font-bold mt-2 uppercase tracking-tight">On Track</p>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Product Value</p>
          <h3 className="text-3xl font-black text-slate-800">{formatCurrency(project.marketValue)}</h3>
          <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-tight">Forecasted</p>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Open Requests</p>
          <h3 className="text-3xl font-black text-amber-600">{project.businessRequests}</h3>
          <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-tight">Requires Attention</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Chart Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h4 className="text-lg font-bold text-slate-900">Financial Projection</h4>
                <p className="text-sm text-slate-400 mt-1">Growth trajectory over the current fiscal cycle</p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded text-[10px] font-bold text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-brand"></div>
                  Budgeted
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded text-[10px] font-bold text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                  Actual
                </div>
              </div>
            </div>
            
            <div className="h-64 w-full relative">
              <svg className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'rgba(35, 40, 130, 0.1)', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'rgba(35, 40, 130, 0)', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <path 
                  d="M0 200 Q100 150 200 180 T400 100 T600 120 T800 60 T1000 20 L1000 250 L0 250 Z" 
                  fill="url(#grad1)" 
                  stroke="#232882" 
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-x-0 bottom-[-24px] flex justify-between px-2 text-[10px] font-bold text-slate-400">
                {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map(m => <span key={m}>{m}</span>)}
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-100 grid grid-cols-3 gap-8">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Efficiency</p>
                <p className="text-2xl font-bold text-slate-900">88.4%</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Resource Load</p>
                <p className="text-2xl font-bold text-slate-900">1.2x</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">ROI Score</p>
                <p className="text-2xl font-bold text-brand">A+</p>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Collaborative Notes</h4>
              <button className="text-xs font-bold text-brand hover:underline flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                Add update
              </button>
            </div>
            <div className="p-8 space-y-6">
              {project.calendarNotes.length > 0 ? (
                project.calendarNotes.map((note) => (
                  <div key={note.id} className="flex gap-6 group">
                    <div className="w-16 flex-shrink-0 pt-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{note.date.split('-')[1]}/{note.date.split('-')[2]}</p>
                    </div>
                    <div className="flex-1 bg-slate-50 p-6 rounded-2xl border border-slate-100 group-hover:border-brand/20 transition-colors relative">
                      <p className="text-sm text-slate-700 leading-relaxed italic">"{note.note}"</p>
                      <div className="flex items-center gap-2 mt-4">
                        <div className="w-6 h-6 rounded-full bg-brand-subtle flex items-center justify-center text-[8px] font-bold text-brand uppercase border border-brand/10">
                          {getInitials(note.author)}
                        </div>
                        <p className="text-[10px] font-bold text-brand uppercase tracking-widest">— {note.author}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <p className="text-slate-400 text-sm">No collaborative notes yet for this project cycle.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-8">
          {/* Team List */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-8">Active Stakeholders</h4>
            <div className="space-y-6">
              {[...Array(Math.min(project.teamSize, 4))].map((_, i) => {
                const memberName = i === 0 ? project.owner : `Consultant ${i + 1}`;
                return (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-200 shadow-sm overflow-hidden">
                      {getInitials(memberName)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{memberName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                        {i === 0 ? 'Project Lead' : `Sub-Module ${i}`}
                      </p>
                    </div>
                  </div>
                );
              })}
              {project.teamSize > 4 && (
                <p className="text-[10px] font-bold text-brand uppercase tracking-widest pt-4 cursor-pointer hover:underline">
                  + {project.teamSize - 4} other collaborators
                </p>
              )}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-8 rounded-xl font-bold">Contact Workspace</Button>
          </div>

          {/* Priority Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path></svg>
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4">Strategic Impact</h4>
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${project.priority === 'High' ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)]' : 'bg-slate-500'}`} />
              <span className="text-2xl font-black italic tracking-tighter">{project.priority.toUpperCase()} PRIORITY</span>
            </div>
            <p className="text-sm text-white/60 mt-6 leading-relaxed font-medium">
              Designated as core infrastructure for the {project.company} vertical. Success is high-priority for Q4 KPIs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailView;
