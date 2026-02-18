export type DashboardDetail = {
  title: string;
  subtitle: string;
  metrics: Array<{ label: string; value: string; note?: string }>;
  list: Array<{ badge?: string; badgeClass?: string; text: string }>;
};

export type DirectoryRecord = {
  id: string;
  title: string;
  type: string;
  status: string;
  priority: string;
  team?: string;
};

export type DummyApiResponse = {
  userProfile: {
    name: string;
    role: string;
    avatar: string;
  };
  sidebarModules: Array<{
    key: string;
    label: string;
    children: Array<{ menuId: string; label: string }>;
  }>;
  dashboardDetails: Record<string, DashboardDetail>;
  directoryRecords: DirectoryRecord[];
  chatbot: {
    questions: string[];
    replies: Record<string, string>;
  };
};

const dummyApiResponse: DummyApiResponse = {
  userProfile: {
    name: 'Ava Collins',
    role: 'Superadmin',
    avatar: 'https://i.pravatar.cc/80?img=32'
  },
  sidebarModules: [
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
        { menuId: 'work-health-safety', label: 'Work Helth safety' },
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
      label: 'Media Libaray',
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
        { menuId: 'calendar', label: 'Calender' },
        { menuId: 'event', label: 'Event' },
        { menuId: 'faq', label: 'FAQ' }
      ]
    }
  ],
  dashboardDetails: {
    operations: {
      title: 'Operational Queue',
      subtitle: 'Expanded operational snapshot for today.',
      metrics: [
        { label: 'Shifts Today', value: '86', note: '18 sites' },
        { label: 'Coverage Gaps', value: '3', note: 'Immediate fill' },
        { label: 'Late Clock-ins', value: '6', note: 'Last 24 hrs' },
        { label: 'Escalations', value: '2', note: 'Clinical alerts' }
      ],
      list: [
        { badge: 'On Track', badgeClass: 'badge--teal', text: '83 shifts confirmed' },
        { badge: 'At Risk', badgeClass: 'badge--blue', text: '3 gaps across North Hub' },
        { badge: 'Pending', badgeClass: 'badge--gray', text: '4 shift swaps awaiting approval' }
      ]
    },
    funding: {
      title: 'Funding & Claims',
      subtitle: 'NDIS billing health and claim throughput.',
      metrics: [
        { label: 'Claims Submitted', value: '72', note: 'Awaiting payment' },
        { label: 'Claims Paid', value: '118', note: 'This month' },
        { label: 'Rejected', value: '6', note: 'Needs review' },
        { label: 'Avg Payment Time', value: '4.2d', note: 'Rolling 30 days' }
      ],
      list: [
        { badge: 'NDIA', badgeClass: 'badge--teal', text: '62% managed funding mix' },
        { badge: 'Plan', badgeClass: 'badge--blue', text: '28% plan-managed participants' },
        { badge: 'Self', badgeClass: 'badge--gray', text: '10% self-managed participants' }
      ]
    },
    compliance: {
      title: 'Compliance & Risk',
      subtitle: 'Incident monitoring and WHS readiness.',
      metrics: [
        { label: 'Open Incidents', value: '6', note: '2 critical' },
        { label: 'WHS Actions', value: '2', note: 'Overdue' },
        { label: 'Audit Reviews', value: '4', note: 'Due this month' },
        { label: 'Training Expiry', value: '9', note: 'Next 30 days' }
      ],
      list: [
        { badge: 'Investigating', badgeClass: 'badge--blue', text: 'Medication delay report - 3 days' },
        { badge: 'Resolved', badgeClass: 'badge--teal', text: '8 incidents closed this month' },
        { badge: 'WHS', badgeClass: 'badge--gray', text: '2 actions awaiting sign-off' }
      ]
    },
    approvals: {
      title: 'Approvals & Tasks',
      subtitle: 'Items awaiting superadmin review.',
      metrics: [
        { label: 'Plan Reviews', value: '12', note: 'Due in 14 days' },
        { label: 'Agreement Renewals', value: '8', note: 'Pending signatures' },
        { label: 'Access Requests', value: '5', note: 'Awaiting approval' },
        { label: 'Audit Exports', value: '3', note: 'Compliance review' }
      ],
      list: [
        { badge: 'High', badgeClass: 'badge--teal', text: '3 urgent plan renewals' },
        { badge: 'Standard', badgeClass: 'badge--blue', text: '8 agreements awaiting signatures' },
        { badge: 'Info', badgeClass: 'badge--gray', text: '3 audit exports requested' }
      ]
    },
    quality: {
      title: 'Service Quality Pulse',
      subtitle: 'Participant feedback, complaints, and outcomes.',
      metrics: [
        { label: 'Feedback Score', value: '4.6/5', note: 'Last 30 days' },
        { label: 'Open Complaints', value: '2', note: 'Pending review' },
        { label: 'Follow-ups Due', value: '7', note: 'Next 14 days' },
        { label: 'Positive Notes', value: '14', note: 'This week' }
      ],
      list: [
        { badge: 'Feedback', badgeClass: 'badge--teal', text: '92% satisfaction rate' },
        { badge: 'Complaints', badgeClass: 'badge--blue', text: '2 active investigations' },
        { badge: 'Recognition', badgeClass: 'badge--gray', text: '14 positive notes logged' }
      ]
    }
  },
  directoryRecords: [
    { id: 'OP-1093', title: 'Clinical Supervisor', type: 'Teaching', status: 'Active', priority: 'High', team: 'North Wing' },
    { id: 'OP-1208', title: 'Roster Coordinator', type: 'Administration', status: 'Investigating', priority: 'Medium', team: 'Central Clinic' },
    { id: 'OP-0876', title: 'Participant Liaison', type: 'Support', status: 'Resolved', priority: 'Low', team: 'West Outreach' }
  ],
  chatbot: {
    questions: [
      'Show coverage gaps for today',
      'Which plans are expiring soon?',
      'Open incidents needing review',
      'Summarize claims status'
    ],
    replies: {
      'Show coverage gaps for today': 'There are 3 coverage gaps across today’s roster. Two are in North Hub and one in Central Clinic.',
      'Which plans are expiring soon?': '18 participant plans are expiring within 30 days. 6 of those require priority review this week.',
      'Open incidents needing review': 'There are 3 incidents under investigation and 2 WHS actions overdue.',
      'Summarize claims status': '72 claims submitted, 118 paid this month, and 6 rejected requiring review.'
    }
  }
};

export function fetchDummyApiResponse(): Promise<DummyApiResponse> {
  return Promise.resolve(dummyApiResponse);
}
