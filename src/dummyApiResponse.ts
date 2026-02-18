export type MenuItem = {
  id: string;
  label: string;
  path: string;
  componentKey: string;
  description: string;
};

export type SidebarModule = {
  id: string;
  label: string;
  menus: MenuItem[];
};

export type PageContent = {
  stats: Array<{ label: string; value: string }>;
  highlights: string[];
};

export type DummyApiResponse = {
  sidebarModules: SidebarModule[];
  pageContentByPath: Record<string, PageContent>;
};

const dummyApiResponse: DummyApiResponse = {
  sidebarModules: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      menus: [
        {
          id: 'dashboard-home',
          label: 'Dashboard',
          path: '/dashboard',
          componentKey: 'dashboard/Dashboard',
          description: 'Default landing page after login with core operational insights.'
        }
      ]
    },
    {
      id: 'participant-support',
      label: 'Participant & Support',
      menus: [
        { id: 'clients', label: 'Clients', path: '/participant-support/clients', componentKey: 'participant-support/Clients', description: 'Track participant profiles and client support plans.' },
        { id: 'funding', label: 'Funding', path: '/participant-support/funding', componentKey: 'participant-support/Funding', description: 'Monitor participant funding sources and utilization.' },
        { id: 'irregular-support', label: 'Irregular Support', path: '/participant-support/irregular-support', componentKey: 'participant-support/IrregularSupport', description: 'Review irregular support requests and exceptions.' },
        { id: 'incident-accident', label: 'Incident / Accident', path: '/participant-support/incident-accident', componentKey: 'participant-support/IncidentAccident', description: 'Capture incident and accident records requiring follow-up.' },
        { id: 'feedback-complaints', label: 'Feedback & Complaints', path: '/participant-support/feedback-complaints', componentKey: 'participant-support/FeedbackComplaints', description: 'Manage service feedback and participant complaints.' }
      ]
    },
    {
      id: 'people-workforce',
      label: 'People & Workforce',
      menus: [
        { id: 'staff', label: 'Staff', path: '/people-workforce/staff', componentKey: 'people-workforce/Staff', description: 'View staff records, assignments, and statuses.' },
        { id: 'rosters', label: 'Rosters', path: '/people-workforce/rosters', componentKey: 'people-workforce/Rosters', description: 'Plan and update workforce rosters.' },
        { id: 'training-development', label: 'Training & Development', path: '/people-workforce/training-development', componentKey: 'people-workforce/TrainingDevelopment', description: 'Track training progress and development plans.' },
        { id: 'timesheet-management', label: 'Timesheet Management', path: '/people-workforce/timesheet-management', componentKey: 'people-workforce/TimesheetManagement', description: 'Review submitted timesheets and approvals.' },
        { id: 'cost-category', label: 'Cost Category', path: '/people-workforce/cost-category', componentKey: 'people-workforce/CostCategory', description: 'Analyze staffing spend by cost categories.' },
        { id: 'leave-management', label: 'Leave Management', path: '/people-workforce/leave-management', componentKey: 'people-workforce/LeaveManagement', description: 'Approve and monitor staff leave requests.' }
      ]
    },
    {
      id: 'operations',
      label: 'Operations',
      menus: [
        { id: 'operations-policy', label: 'Policy', path: '/operations/policy', componentKey: 'operations/Policy', description: 'Operations policy register and updates.' },
        { id: 'suppliers', label: 'Suppliers', path: '/operations/suppliers', componentKey: 'operations/Suppliers', description: 'Supplier directory and contract health.' },
        { id: 'properties', label: 'Properties', path: '/operations/properties', componentKey: 'operations/Properties', description: 'Manage operations properties and occupancy.' }
      ]
    },
    {
      id: 'whs-policies',
      label: 'WHS & Policies',
      menus: [
        { id: 'work-health-safety', label: 'Work Helth safety', path: '/whs-policies/work-health-safety', componentKey: 'whs-policies/WorkHealthSafety', description: 'Monitor work health and safety compliance tasks.' },
        { id: 'whs-policy', label: 'Policy', path: '/whs-policies/policy', componentKey: 'whs-policies/Policy', description: 'WHS policy documents and revision history.' }
      ]
    },
    {
      id: 'asset-management',
      label: 'Asset Management',
      menus: [
        { id: 'asset-register', label: 'Asset Register', path: '/asset-management/asset-register', componentKey: 'asset-management/AssetRegister', description: 'Track assets, lifecycle, and ownership.' },
        { id: 'asset-report', label: 'Report', path: '/asset-management/report', componentKey: 'asset-management/Report', description: 'Generate and view asset management reports.' }
      ]
    },
    {
      id: 'media-library',
      label: 'Media Libaray',
      menus: [
        { id: 'drive', label: 'Drive', path: '/media-library/drive', componentKey: 'media-library/Drive', description: 'Shared drive files and folders.' },
        { id: 'documents', label: 'Documents', path: '/media-library/documents', componentKey: 'media-library/Documents', description: 'Document library with categories and access.' }
      ]
    },
    {
      id: 'information',
      label: 'Information',
      menus: [
        { id: 'notice-board', label: 'Notice Board', path: '/information/notice-board', componentKey: 'information/NoticeBoard', description: 'Organization-wide announcements and notices.' },
        { id: 'calender', label: 'Calender', path: '/information/calender', componentKey: 'information/Calender', description: 'Calendar events and scheduling overview.' },
        { id: 'event', label: 'Event', path: '/information/event', componentKey: 'information/Event', description: 'Upcoming internal and external events.' },
        { id: 'faq', label: 'FAQ', path: '/information/faq', componentKey: 'information/FAQ', description: 'Frequently asked questions and support guidance.' }
      ]
    }
  ],
  pageContentByPath: {}
};

for (const module of dummyApiResponse.sidebarModules) {
  for (const menu of module.menus) {
    dummyApiResponse.pageContentByPath[menu.path] = {
      stats: [
        { label: 'Open Items', value: `${menu.label.length + 4}` },
        { label: 'Completed', value: `${module.label.length}` },
        { label: 'Pending Review', value: `${menu.path.length % 9}` }
      ],
      highlights: [
        `${menu.label} overview generated from dummy API response.`,
        `Module source: ${module.label}.`,
        `Route path configured as ${menu.path}.`
      ]
    };
  }
}

export function fetchDummyApiResponse(): Promise<DummyApiResponse> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(dummyApiResponse), 150);
  });
}
