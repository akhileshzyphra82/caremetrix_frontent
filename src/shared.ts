export type MenuItem = { menuId: string; label: string };

export type ModuleItem = {
  key: string;
  label: string;
  children: MenuItem[];
};

export const sidebarModules: ModuleItem[] = [
  { key: 'dashboard', label: 'Dashboard', children: [] },
  {
    key: 'participant-support',
    label: 'Participant & Support',
    children: [
      { menuId: 'clients', label: 'Clients' },
      { menuId: 'funding', label: 'Funding' },
      { menuId: 'irregular-support', label: 'Irregular Support' },
      { menuId: 'incident-accident', label: 'Incident / Accident' },
      { menuId: 'feedback-complaints', label: 'Feedback & Complaints' }
    ]
  },
  {
    key: 'people-workforce',
    label: 'People & Workforce',
    children: [
      { menuId: 'staff', label: 'Staff' },
      { menuId: 'rosters', label: 'Rosters' },
      { menuId: 'training-development', label: 'Training & Development' },
      { menuId: 'timesheet-management', label: 'Timesheet Management' },
      { menuId: 'cost-category', label: 'Cost Category' },
      { menuId: 'leave-management', label: 'Leave Management' }
    ]
  },
  {
    key: 'operations',
    label: 'Operations',
    children: [
      { menuId: 'policy', label: 'Policy' },
      { menuId: 'suppliers', label: 'Suppliers' },
      { menuId: 'properties', label: 'Properties' }
    ]
  },
  {
    key: 'whs-policies',
    label: 'WHS & Policies',
    children: [
      { menuId: 'work-health-safety', label: 'Work Health Safety' },
      { menuId: 'whs-policy', label: 'Policy' }
    ]
  },
  {
    key: 'asset-management',
    label: 'Asset Management',
    children: [
      { menuId: 'asset-register', label: 'Asset Register' },
      { menuId: 'asset-report', label: 'Report' }
    ]
  },
  {
    key: 'media-library',
    label: 'Media Library',
    children: [
      { menuId: 'drive', label: 'Drive' },
      { menuId: 'documents', label: 'Documents' }
    ]
  },
  {
    key: 'information',
    label: 'Information',
    children: [
      { menuId: 'notice-board', label: 'Notice Board' },
      { menuId: 'calendar', label: 'Calendar' },
      { menuId: 'event', label: 'Event' },
      { menuId: 'faq', label: 'FAQ' }
    ]
  }
];

export function getPathForMenu(moduleKey: string, menuId?: string): string {
  if (moduleKey === 'dashboard') return '/dashboard';
  return `/${moduleKey}/${menuId}`;
}

export function formatTitle(value: string): string {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
