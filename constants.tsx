
import { Project, Activity, AppNotification } from './types';

export const MOCK_PROJECTS: Project[] = [
  { 
    id: '1', 
    name: 'Cloud Migration Phase 2', 
    company: 'SkyNet Systems',
    status: 'Active', 
    progress: 65, 
    owner: 'Sarah Chen', 
    updatedAt: '2h ago', 
    priority: 'High',
    teamSize: 12,
    budget: 450000,
    marketValue: 1200000,
    businessRequests: 24,
    deadline: '2025-10-15',
    calendarNotes: [
      { id: 'n1', date: '2025-05-10', note: 'Finalize server architecture', author: 'Sarah' },
      { id: 'n2', date: '2025-05-12', note: 'Security handshake protocol review', author: 'Kevin' }
    ]
  },
  { 
    id: '2', 
    name: 'Q3 Brand Identity Refresh', 
    company: 'Lumina Group',
    status: 'In Review', 
    progress: 92, 
    owner: 'Marc Ramos', 
    updatedAt: '5h ago', 
    priority: 'Medium',
    teamSize: 5,
    budget: 85000,
    marketValue: 250000,
    businessRequests: 8,
    deadline: '2025-06-01',
    calendarNotes: [
      { id: 'n3', date: '2025-05-15', note: 'Client presentation for color palette', author: 'Marc' }
    ]
  },
  { 
    id: '3', 
    name: 'Internal HR Portal', 
    company: 'PCN Internal',
    status: 'Active', 
    progress: 40, 
    owner: 'Lena Weber', 
    updatedAt: '1d ago', 
    priority: 'Low',
    teamSize: 8,
    budget: 120000,
    marketValue: 0,
    businessRequests: 45,
    deadline: '2025-12-20',
    calendarNotes: []
  },
  { 
    id: '4', 
    name: 'API Security Audit', 
    company: 'CyberGuard Inc',
    status: 'On Hold', 
    progress: 15, 
    owner: 'Kevin Smith', 
    updatedAt: '3d ago', 
    priority: 'High',
    teamSize: 3,
    budget: 35000,
    marketValue: 500000,
    businessRequests: 12,
    deadline: '2025-07-30',
    calendarNotes: [
      { id: 'n4', date: '2025-05-20', note: 'Wait for firewall clearance', author: 'Kevin' }
    ]
  }
];

export const MOCK_ACTIVITY: Activity[] = [
  { id: '1', user: 'Sarah Chen', action: 'uploaded 4 new assets to', target: 'Cloud Migration', timestamp: '12m ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { id: '2', user: 'Marc Ramos', action: 'requested a review for', target: 'Brand Refresh', timestamp: '45m ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marc' },
  { id: '3', user: 'System', action: 'automated backup completed for', target: 'HR Portal', timestamp: '2h ago', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=System' },
  { id: '4', user: 'Lena Weber', action: 'commented on', target: 'Security Audit', timestamp: '5h ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lena' }
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: 'nt1', type: 'mention', message: 'Sarah Chen mentioned you in Cloud Migration documentation.', timestamp: '5m ago', isRead: false, user: 'Sarah Chen' },
  { id: 'nt2', type: 'update', message: 'The status of Internal HR Portal was changed to Active.', timestamp: '1h ago', isRead: false },
  { id: 'nt3', type: 'system', message: 'Weekly enterprise backup completed successfully.', timestamp: '3h ago', isRead: true },
  { id: 'nt4', type: 'alert', message: 'High priority: Security handshake protocol review scheduled for tomorrow.', timestamp: '5h ago', isRead: true },
  { id: 'nt5', type: 'mention', message: 'Marc Ramos tagged you in Q3 Brand Refresh.', timestamp: '1d ago', isRead: true, user: 'Marc Ramos' }
];
