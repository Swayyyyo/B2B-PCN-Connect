
export type ProjectStatus = 'Active' | 'In Review' | 'Completed' | 'On Hold';
export type Priority = 'High' | 'Medium' | 'Low';

export interface CalendarNote {
  id: string;
  date: string;
  note: string;
  author: string;
}

export interface Project {
  id: string;
  name: string;
  company: string;
  status: ProjectStatus;
  progress: number;
  owner: string;
  updatedAt: string;
  priority: Priority;
  teamSize: number;
  budget: number;
  marketValue: number;
  businessRequests: number;
  deadline: string;
  calendarNotes: CalendarNote[];
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  avatar: string;
}

export interface AppNotification {
  id: string;
  type: 'update' | 'mention' | 'system' | 'alert';
  message: string;
  timestamp: string;
  isRead: boolean;
  user?: string;
}

export enum DashboardTab {
  OVERVIEW = 'Overview',
  PROJECTS = 'Projects',
  ASSETS = 'Assets',
  COLLABORATION = 'Collaboration',
  REPORTS = 'Reports'
}
