export const mockApiResponse = {
  userProfile: {
    name: 'Ava Collins',
    role: 'Superadmin',
    avatar: 'https://i.pravatar.cc/80?img=32'
  },
  sidebar: {
    mainMenu: 'dashboard',
    modules: [
      { key: 'dashboard', label: 'Dashboard', title: 'Dashboard' },
      {
        key: 'worker-dashboard',
        label: 'Worker Dashboard',
        title: 'Worker Dashboard',
        children: [
          { key: 'worker-today', label: "Today's Shifts & Alerts", title: "Today's Shifts & Alerts" }
        ]
      },
      {
        key: 'participant-management',
        label: 'Participant Management',
        title: 'Participant Management',
        children: [
          { key: 'participant-overview', label: 'Participant Overview', title: 'Participant Overview' },
          { key: 'participant-progress', label: 'Goals & Progress', title: 'Goals & Progress' }
        ]
      },
      {
        key: 'service-delivery',
        label: 'Service Delivery',
        title: 'Service Delivery',
        children: [
          { key: 'service-roster', label: 'Roster & Scheduling', title: 'Roster & Scheduling' },
          { key: 'service-reports', label: 'Delivery Reports', title: 'Delivery Reports' }
        ]
      },
      {
        key: 'funding-billing',
        label: 'Funding & Billing',
        title: 'Funding & Billing',
        children: [
          { key: 'billing-claims', label: 'Claims & Invoices', title: 'Claims & Invoices' },
          { key: 'billing-history', label: 'Payment History', title: 'Payment History' }
        ]
      },
      {
        key: 'compliance-risk',
        label: 'Compliance & Risk',
        title: 'Compliance & Risk',
        children: [
          { key: 'compliance-incidents', label: 'Incidents & WHS', title: 'Incidents & WHS' },
          { key: 'compliance-audits', label: 'Audits & Policies', title: 'Audits & Policies' }
        ]
      },
      {
        key: 'approvals-governance',
        label: 'Approvals & Governance',
        title: 'Approvals & Governance',
        children: [
          { key: 'governance-queue', label: 'Approval Queue', title: 'Approval Queue' },
          { key: 'governance-exports', label: 'Reports & Exports', title: 'Reports & Exports' }
        ]
      }
    ]
  },
  dashboard: {
    cards: [
      { detailKey: 'operations', label: 'Operational Queue', value: '86', note: 'Shifts today' },
      { detailKey: 'funding', label: 'Claims Submitted', value: '72', note: 'Awaiting payment' },
      { detailKey: 'compliance', label: 'Open Incidents', value: '6', note: '2 critical' },
      { detailKey: 'approvals', label: 'Pending Approvals', value: '25', note: 'Due in 14 days' },
      { detailKey: 'quality', label: 'Feedback Score', value: '4.6/5', note: 'Last 30 days' }
    ],
    details: {
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
    }
  },
  records: {
    statusStyles: {
      Active: 'badge--teal',
      Inactive: 'badge--gray',
      Resolved: 'badge--teal',
      Investigating: 'badge--blue'
    },
    priorityStyles: {
      High: 'priority--high',
      Medium: 'priority--medium',
      Low: 'priority--low'
    }
  },
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
    },
    defaultReply: 'Thanks for the question. I can prepare a detailed snapshot once data refresh completes.'
  }
};

export async function fetchMockApiResponse() {
  return Promise.resolve(mockApiResponse);
}
