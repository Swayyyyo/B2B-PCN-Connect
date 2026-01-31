
import React, { useState, useEffect } from 'react';
import Button from './Button';
import Card from './Card';
import Input from './Input';
import CalendarPicker from './CalendarPicker';
import { Priority } from '../types';

interface NewEntityFormProps {
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

const NewEntityForm: React.FC<NewEntityFormProps> = ({ onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    leader: '',
    staff: '',
    deadline: '',
    priority: 'Low' as Priority,
    budget: '',
  });

  const [fileName, setFileName] = useState<string | null>(null);

  // Automatically adjust priority based on deadline proximity
  useEffect(() => {
    if (!formData.deadline) return;

    const deadlineDate = new Date(formData.deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let suggestedPriority: Priority = 'Low';
    if (diffDays < 7) suggestedPriority = 'High';
    else if (diffDays < 30) suggestedPriority = 'Medium';

    setFormData(prev => ({ ...prev, priority: suggestedPriority }));
  }, [formData.deadline]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="flex items-center justify-between">
        <div>
          <button 
            onClick={onCancel}
            className="group flex items-center gap-2 text-slate-400 hover:text-brand transition-colors mb-2"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-xs font-bold uppercase tracking-widest">Back to Workspace</span>
          </button>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Initiate New Entity</h2>
          <p className="text-slate-500 mt-1">Configure strategic parameters and assign resources for the new project cycle.</p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card title="General Configuration" subtitle="Primary identification and organizational alignment.">
            <div className="space-y-6">
              <Input 
                label="Project Name" 
                placeholder="e.g. Q4 Infrastructure Scaling" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Associated Company" 
                  placeholder="e.g. TechCorp Solutions" 
                  value={formData.company}
                  onChange={e => setFormData({...formData, company: e.target.value})}
                />
                <Input 
                  label="Allocated Budget" 
                  type="number" 
                  placeholder="250,000" 
                  value={formData.budget}
                  onChange={e => setFormData({...formData, budget: e.target.value})}
                />
              </div>
            </div>
          </Card>

          <Card title="Resource Allocation" subtitle="Assign leadership and technical personnel.">
            <div className="space-y-6">
              <Input 
                label="Project Leader" 
                placeholder="Assign a lead strategist" 
                value={formData.leader}
                onChange={e => setFormData({...formData, leader: e.target.value})}
              />
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-semibold text-slate-700">Involved Staff</label>
                <textarea 
                  className="px-4 py-2.5 rounded-lg border-2 border-slate-200 bg-white placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-brand/5 hover:border-slate-300 transition-all outline-none text-sm min-h-[100px]"
                  placeholder="Enter staff names (comma separated)"
                  value={formData.staff}
                  onChange={e => setFormData({...formData, staff: e.target.value})}
                />
              </div>
            </div>
          </Card>

          <Card title="Financial Documentation" subtitle="Upload initial cost sheets and fiscal forecasts.">
            <div className="relative group">
              <label className={`
                flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all
                ${fileName ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-brand/40'}
              `}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {fileName ? (
                    <>
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <p className="text-sm font-bold text-emerald-800">{fileName}</p>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase mt-1">Ready for submission</p>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-slate-100 text-slate-400 group-hover:bg-brand/10 group-hover:text-brand rounded-xl flex items-center justify-center mb-3 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                      </div>
                      <p className="text-sm font-bold text-slate-700">Drop cost sheet here</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">PDF, XLSX up to 10MB</p>
                    </>
                  )}
                </div>
                <input type="file" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Timeline & Criticality">
            <div className="space-y-6">
              <CalendarPicker 
                label="Target Deadline" 
                value={formData.deadline}
                onChange={date => setFormData({...formData, deadline: date})}
              />
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">Priority Level</label>
                <div className="grid grid-cols-1 gap-2">
                  {(['High', 'Medium', 'Low'] as Priority[]).map(p => (
                    <button
                      key={p}
                      onClick={() => setFormData({...formData, priority: p})}
                      className={`
                        flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-wider
                        ${formData.priority === p 
                          ? (p === 'High' ? 'border-rose-500 bg-rose-50 text-rose-700' : p === 'Medium' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-emerald-500 bg-emerald-50 text-emerald-700')
                          : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                        }
                      `}
                    >
                      {p} Priority
                      {formData.priority === p && (
                        <div className={`w-2 h-2 rounded-full ${p === 'High' ? 'bg-rose-500' : p === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                  * System automatically suggests priority based on deadline proximity. High priority is triggered for deadlines within 7 days.
                </p>
              </div>
            </div>
          </Card>

          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-200">
            <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Final Submission</h4>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Initiating this entity will notify relevant department leads and trigger resource reservation protocols.
            </p>
            <div className="space-y-3">
              <Button 
                className="w-full justify-center py-4 text-sm rounded-xl font-extrabold shadow-lg shadow-brand/40"
                onClick={() => onSubmit(formData)}
              >
                Create Entity
              </Button>
              <Button 
                variant="ghost" 
                className="w-full text-slate-400 hover:text-white"
                onClick={onCancel}
              >
                Discard Draft
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewEntityForm;
