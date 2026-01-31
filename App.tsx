
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { DashboardTab, Project, AppNotification, Priority } from './types';
import { MOCK_PROJECTS, MOCK_ACTIVITY, MOCK_NOTIFICATIONS } from './constants';
import Button from './components/Button';
import Card from './components/Card';
import SummaryCard from './components/SummaryCard';
import ProjectDetailView from './components/ProjectDetailView';
import NewEntityForm from './components/NewEntityForm';

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

/**
 * Brand Logo component: "PCN" initials inside a circular container.
 * Styled to perfectly match the 'initials' circles used for project owners and users.
 */
const BrandLogo: React.FC<{ className?: string; isSidebarOpen?: boolean }> = ({ 
  className = "w-8 h-8",
  isSidebarOpen = true 
}) => (
  <div 
    className={`
      ${className} 
      rounded-full bg-brand-subtle flex items-center justify-center flex-shrink-0 
      border border-brand/10 shadow-sm transition-all duration-300 ease-in-out
    `}
  >
    <span className={`
      font-black text-brand tracking-tighter
      ${isSidebarOpen ? 'text-[11px]' : 'text-[7px]'}
    `}>
      PCN
    </span>
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.OVERVIEW);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Project; direction: 'asc' | 'desc' } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Notification States
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const hasUnread = useMemo(() => notifications.some(n => !n.isRead), [notifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
    setSelectedProject(null);
    setIsCreatingNew(false);
  };

  const handleGoHome = () => {
    setActiveTab(DashboardTab.OVERVIEW);
    setSelectedProject(null);
    setIsCreatingNew(false);
  };

  const handleCreateProject = (formData: any) => {
    const teamCount = formData.staff ? formData.staff.split(',').length : 1;
    
    const newProject: Project = {
      id: (projects.length + 1).toString(),
      name: formData.name || 'Untitled Project',
      company: formData.company || 'Unknown Client',
      status: 'Active',
      progress: 0,
      owner: formData.leader || 'Unassigned',
      updatedAt: 'Just now',
      priority: formData.priority as Priority,
      teamSize: teamCount,
      budget: parseFloat(formData.budget) || 0,
      marketValue: 0,
      businessRequests: 0,
      deadline: formData.deadline || new Date().toISOString().split('T')[0],
      calendarNotes: []
    };

    setProjects(prev => [newProject, ...prev]);
    setIsCreatingNew(false);
    setActiveTab(DashboardTab.OVERVIEW);

    // Add notification for creation
    const newNotif: AppNotification = {
      id: Date.now().toString(),
      type: 'system',
      message: `Entity "${newProject.name}" has been successfully initiated.`,
      timestamp: 'Just now',
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const displayProjects = useMemo(() => {
    let items = [...projects];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.company.toLowerCase().includes(query) ||
        p.owner.toLowerCase().includes(query) ||
        p.status.toLowerCase().includes(query) ||
        p.priority.toLowerCase().includes(query)
      );
    }
    if (sortConfig !== null) {
      items.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA === undefined || valB === undefined) return 0;
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [sortConfig, searchQuery, projects]);

  const requestSort = (key: keyof Project) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Fixed: Added explicit typing to EmptyState to ensure it is recognized as a React functional component
  const EmptyState: React.FC = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-300">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </div>
      <h3 className="text-lg font-bold text-slate-800">No results found</h3>
      <p className="text-slate-500 max-w-xs mt-1">We couldn't find any projects or staff matching "{searchQuery}".</p>
      <button 
        onClick={() => setSearchQuery('')}
        className="mt-4 text-sm font-bold text-brand hover:underline"
      >
        Clear Search
      </button>
    </div>
  );

  const renderContent = () => {
    if (isCreatingNew) {
      return (
        <NewEntityForm 
          onCancel={() => setIsCreatingNew(false)}
          onSubmit={handleCreateProject}
        />
      );
    }

    if (selectedProject) {
      return <ProjectDetailView project={selectedProject} />;
    }

    switch (activeTab) {
      case DashboardTab.PROJECTS:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <section>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Project Repository</h2>
              <p className="text-slate-500 mt-1">Full access to all active and archived enterprise initiatives.</p>
            </section>
            
            {displayProjects.length > 0 ? (
              <>
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayProjects.map(project => (
                    <SummaryCard 
                      key={project.id} 
                      project={project} 
                      onClick={() => setSelectedProject(project)}
                    />
                  ))}
                </section>
                <Card title="Project Inventory" subtitle="Comprehensive list of all managed entities.">
                   <div className="overflow-x-auto -mx-6">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-brand" onClick={() => requestSort('name')}>Project & Client</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Budget</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {displayProjects.map(project => (
                          <tr key={project.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setSelectedProject(project)}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase border border-slate-200">
                                  {getInitials(project.name)}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-800">{project.name}</p>
                                  <p className="text-xs text-slate-400">{project.company}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                project.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                project.status === 'In Review' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                'bg-slate-100 text-slate-600 border-slate-200'
                              }`}>
                                {project.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="w-full bg-slate-100 rounded-full h-1.5 max-w-[100px]">
                                <div className="bg-brand h-1.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-slate-600">
                              ${project.budget.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </>
            ) : <EmptyState />}
          </div>
        );
      case DashboardTab.ASSETS:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <section>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Asset Management</h2>
              <p className="text-slate-500 mt-1">Shared documents, design systems, and binary resources.</p>
            </section>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {['Design Docs', 'Brand Assets', 'Legal', 'Q3 Photos', 'Prototypes', 'Marketing'].map((folder) => (
                <div key={folder} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-brand/40 hover:shadow-md transition-all group cursor-pointer text-center">
                  <div className="w-12 h-12 bg-brand/5 text-brand rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path></svg>
                  </div>
                  <p className="text-sm font-bold text-slate-700">{folder}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">24 Files</p>
                </div>
              ))}
            </div>
          </div>
        );
      case DashboardTab.COLLABORATION:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <section>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Collaboration Hub</h2>
              <p className="text-slate-500 mt-1">Real-time discussion threads across all departments.</p>
            </section>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2" title="Active Channels">
                <div className="space-y-6">
                  {MOCK_ACTIVITY.map(activity => (
                    <div key={activity.id} className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm bg-brand-subtle flex items-center justify-center text-brand text-xs font-bold">
                        {getInitials(activity.user)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-bold text-slate-900">{activity.user}</h4>
                          <span className="text-[10px] font-bold text-slate-400">{activity.timestamp}</span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">Hey team, I've just updated the documentation for <span className="text-brand font-bold">#{activity.target}</span>. Please review when possible.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card title="Online Team">
                <div className="space-y-4">
                  {['Sarah Chen', 'Marc Ramos', 'Lena Weber', 'Kevin Smith'].map((name) => (
                    <div key={name} className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200">
                          {getInitials(name)}
                        </div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></div>
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{name}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        );
      case DashboardTab.REPORTS:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <section>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Analytics & Reports</h2>
              <p className="text-slate-500 mt-1">High-level strategic reporting and efficiency metrics.</p>
            </section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card title="Cost Variance">
                <div className="h-48 flex items-end gap-2">
                  {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                    <div key={i} className="flex-1 bg-brand/10 hover:bg-brand rounded-t transition-all cursor-pointer" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
              </Card>
              <Card title="Deliverable Speed">
                <div className="h-48 flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
                      <circle cx="50" cy="50" r="40" stroke="#232882" strokeWidth="10" fill="transparent" strokeDasharray="251.2" strokeDashoffset="50" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-xl">82%</div>
                  </div>
                </div>
              </Card>
              <Card title="Departmental Load">
                <div className="space-y-4">
                  {['Engineering', 'Design', 'Marketing', 'Sales'].map((dep, i) => (
                    <div key={dep} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                        <span>{dep}</span>
                        <span>{90 - (i * 15)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-brand h-full" style={{ width: `${90 - (i * 15)}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        );
      case DashboardTab.OVERVIEW:
      default:
        return (
          <div className="max-w-[1440px] mx-auto space-y-8 animate-in fade-in duration-500">
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Enterprise Overview</h2>
                <p className="text-slate-500 mt-1">Monitor high-priority tasks and cross-departmental collaboration.</p>
              </div>
              <div className="flex gap-4">
                <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-bold text-slate-700">{projects.filter(p => p.status === 'Active').length} Active Projects</span>
                </div>
                <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-sm font-bold text-slate-700">{projects.filter(p => p.status === 'In Review').length} Pending Reviews</span>
                </div>
              </div>
            </section>

            {displayProjects.length > 0 ? (
              <>
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {displayProjects.slice(0, 4).map(project => (
                    <SummaryCard 
                      key={project.id} 
                      project={project} 
                      onClick={() => setSelectedProject(project)}
                    />
                  ))}
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <Card title="Detailed Tracking" subtitle="Real-time performance metrics across active modules.">
                      <div className="overflow-x-auto -mx-6">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-brand" onClick={() => requestSort('name')}>Project</th>
                              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-brand" onClick={() => requestSort('status')}>Status</th>
                              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-brand" onClick={() => requestSort('owner')}>Owner</th>
                              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-brand" onClick={() => requestSort('updatedAt')}>Updated</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {displayProjects.map(project => (
                              <tr key={project.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedProject(project)}>
                                <td className="px-6 py-4">
                                  <p className="text-sm font-bold text-slate-800">{project.name}</p>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                    project.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                    project.status === 'In Review' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                    project.status === 'On Hold' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                    'bg-slate-100 text-slate-600 border-slate-200'
                                  }`}>
                                    {project.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-brand-subtle flex items-center justify-center text-[10px] font-bold text-brand border border-brand/10 shadow-sm">
                                      {getInitials(project.owner)}
                                    </div>
                                    <p className="text-xs text-slate-600 font-semibold">{project.owner}</p>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <p className="text-xs text-slate-500">{project.updatedAt}</p>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card title="Team Collaboration" subtitle="Latest updates from project owners.">
                      <div className="space-y-8">
                        {MOCK_ACTIVITY.map(activity => (
                          <div key={activity.id} className="flex gap-4 relative">
                            {activity.id !== MOCK_ACTIVITY[MOCK_ACTIVITY.length-1].id && (
                              <div className="absolute left-5 top-10 bottom-[-32px] w-px bg-slate-100" />
                            )}
                            <div className="w-10 h-10 rounded-full border border-slate-100 bg-brand-subtle flex items-center justify-center text-brand text-xs font-bold z-10 shadow-sm">
                              {getInitials(activity.user)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-slate-800 leading-relaxed">
                                <span className="font-bold">{activity.user}</span> {activity.action} <span className="font-bold text-brand">{activity.target}</span>
                              </p>
                              <p className="text-[10px] text-slate-400 mt-1 font-medium">{activity.timestamp}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              </>
            ) : <EmptyState />}
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <aside className={`bg-slate-900 text-white transition-all duration-500 ease-in-out flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className={`h-16 flex items-center transition-all duration-500 px-6 ${!isSidebarOpen ? 'justify-center px-0' : 'justify-start'}`}>
          <div className={`flex items-center gap-3 transition-all duration-300 ${!isSidebarOpen ? 'gap-0' : ''}`}>
            <BrandLogo 
              className={`transition-all duration-300 ${isSidebarOpen ? 'w-8 h-8' : 'w-5 h-5'}`} 
              isSidebarOpen={isSidebarOpen}
            />
            <span className={`font-bold text-lg tracking-tight whitespace-nowrap transition-all duration-300 ease-in-out ${isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none absolute'}`}>
              PCN Connect
            </span>
          </div>
        </div>
        <nav className="flex-1 px-3 mt-4 space-y-1">
          {Object.values(DashboardTab).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`w-full group relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
                activeTab === tab && !isCreatingNew && !selectedProject ? 'bg-brand text-white shadow-lg shadow-brand/40' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              } ${!isSidebarOpen ? 'justify-center' : ''}`}
            >
              <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-110">
                {tab === DashboardTab.OVERVIEW && <svg className="w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>}
                {tab === DashboardTab.PROJECTS && <svg className="w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>}
                {tab === DashboardTab.ASSETS && <svg className="w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>}
                {tab === DashboardTab.COLLABORATION && <svg className="w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>}
                {tab === DashboardTab.REPORTS && <svg className="w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>}
              </div>
              <span className={`whitespace-nowrap transition-all duration-300 ease-in-out ${isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none absolute'}`}>
                {tab}
              </span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className={`flex items-center transition-all duration-300 ${!isSidebarOpen ? 'justify-center' : 'gap-3 px-2'}`}>
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white border border-slate-600 flex-shrink-0 shadow-inner">AP</div>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isSidebarOpen ? 'opacity-100 w-auto ml-1' : 'opacity-0 w-0 pointer-events-none'}`}>
              <p className="text-sm font-bold text-white truncate">Alexander Pierce</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Lead Strategist</p>
            </div>
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Updated: Increased z-index to z-30 to stay above scrollable content elements */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0 z-30">
          <div className="flex items-center gap-8 min-w-0 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-brand hover:bg-slate-50 transition-all active:scale-95"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <div className="flex items-center gap-3 whitespace-nowrap min-w-0">
              <button 
                onClick={handleGoHome}
                className="text-sm font-bold text-slate-700 hover:text-brand transition-colors flex-shrink-0 flex items-center gap-2"
              >
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0 a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                Main Workspace
              </button>
              {(selectedProject || isCreatingNew) && (
                <>
                  <span className="text-slate-300 font-medium flex-shrink-0">/</span>
                  <span className="text-sm font-bold text-slate-400 truncate max-w-[150px] md:max-w-[300px] lg:max-w-[450px] animate-in slide-in-from-left-2 duration-300">
                    {isCreatingNew ? 'Initiate Entity' : selectedProject?.name}
                  </span>
                </>
              )}
            </div>
            <div className="h-4 w-px bg-slate-200 flex-shrink-0" />
            <div className="flex-1 max-w-md hidden sm:block relative group">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-brand transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input 
                type="text" 
                placeholder="Search projects..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-4 focus:ring-brand/5 focus:bg-white transition-all w-full border border-transparent hover:border-slate-200" 
              />
            </div>
          </div>
          <div className="flex items-center gap-6 flex-shrink-0">
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`p-2 rounded-full transition-all relative ${isNotificationsOpen ? 'bg-brand/10 text-brand' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
                {hasUnread && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
                )}
              </button>
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-100 flex justify-between items-center">
                    <h4 className="text-sm font-bold text-slate-800 tracking-tight">Activity Feed</h4>
                    <button onClick={handleMarkAllAsRead} className="text-[10px] font-bold text-brand hover:underline uppercase tracking-wider">Read All</button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} className={`p-5 hover:bg-slate-50 transition-colors flex gap-3 ${notif.isRead ? 'opacity-70' : ''}`}>
                        <div className="flex-shrink-0">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${notif.type === 'alert' ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                            {notif.type === 'alert' ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs leading-relaxed ${notif.isRead ? 'text-slate-500' : 'text-slate-900 font-medium'}`}>{notif.message}</p>
                          <p className="text-[10px] text-slate-400 mt-1.5 font-bold uppercase tracking-tight">{notif.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Button 
              size="sm" 
              className="gap-2 rounded-xl px-4 shadow-lg shadow-brand/10 transition-transform active:scale-95"
              onClick={() => {
                setIsCreatingNew(true);
                setSelectedProject(null);
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
              New Entity
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
          <div className="max-w-[1440px] mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
