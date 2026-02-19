import { useState } from 'react';

type ProfileTab =
  | 'Personal Info'
  | 'Compliance & Transition'
  | 'Communication & Reporting'
  | 'Audit'
  | 'Confidential'
  | 'Medical & Allied Health Services';

const tabs: ProfileTab[] = [
  'Personal Info',
  'Compliance & Transition',
  'Communication & Reporting',
  'Audit',
  'Confidential',
  'Medical & Allied Health Services'
];

const tabContent: Record<ProfileTab, Array<{ label: string; value: string }>> = {
  'Personal Info': [
    { label: 'Full Name', value: 'Olivia Thompson' },
    { label: 'Date of Birth', value: '14/08/1991' },
    { label: 'Gender', value: 'Female' },
    { label: 'Primary Contact', value: '+61 412 998 421' },
    { label: 'Address', value: '32 Greenview Street, Melbourne VIC' },
    { label: 'Support Coordinator', value: 'Daniel Harper' }
  ],
  'Compliance & Transition': [
    { label: 'Plan Start Date', value: '01/01/2026' },
    { label: 'Plan End Date', value: '31/12/2026' },
    { label: 'Risk Assessment', value: 'Updated on 05/02/2026' },
    { label: 'Transition Notes', value: 'No barriers identified, gradual handover in progress.' },
    { label: 'Consent Status', value: 'Active' },
    { label: 'Review Window', value: 'Quarterly' }
  ],
  'Communication & Reporting': [
    { label: 'Preferred Communication', value: 'Email and fortnightly phone check-in' },
    { label: 'Guardian Contact', value: 'Carlos Thompson - +61 433 102 202' },
    { label: 'Latest Progress Report', value: 'Submitted 09/02/2026' },
    { label: 'Escalation Path', value: 'Team Lead > Clinical Manager > Operations Director' },
    { label: 'Reporting Frequency', value: 'Monthly' },
    { label: 'Case Notes', value: 'Participant has responded well to current schedule.' }
  ],
  Audit: [
    { label: 'Last Audit Date', value: '20/01/2026' },
    { label: 'Auditor', value: 'Internal QA Team' },
    { label: 'Open Findings', value: '2 minor items pending closure' },
    { label: 'Documentation Completeness', value: '96%' },
    { label: 'Action Owner', value: 'Rachel Morgan' },
    { label: 'Next Audit', value: '20/04/2026' }
  ],
  Confidential: [
    { label: 'Privacy Tier', value: 'Restricted Access' },
    { label: 'Sensitive Notes', value: 'Medical history and emergency instructions secured.' },
    { label: 'Data Sharing Consent', value: 'Granted for care providers only' },
    { label: 'Emergency Contact', value: 'Noah Thompson - +61 401 221 883' },
    { label: 'Document Access', value: 'Need-to-know basis' },
    { label: 'Last Access Review', value: '12/02/2026' }
  ],
  'Medical & Allied Health Services': [
    { label: 'Primary Practitioner', value: 'Dr. Amelia Smith' },
    { label: 'Allied Health', value: 'Physio, Occupational Therapy, Speech Therapy' },
    { label: 'Medication Plan', value: 'Reviewed weekly with support team' },
    { label: 'Next Appointment', value: '24/02/2026 at 10:30 AM' },
    { label: 'Health Alerts', value: 'Nil critical alerts' },
    { label: 'Service Frequency', value: '3 sessions per week' }
  ]
};

const profileInfoItems = [
  { icon: '👤', label: 'Name' },
  { icon: '✉️', label: 'Email' },
  { icon: '🆔', label: 'NDIS Number' },
  { icon: '📍', label: 'Location' }
] as const;

const rightPanelItems = [
  { icon: '📅', label: 'Profile Created', value: '11/03/2024' },
  { icon: '🕒', label: 'Last Updated', value: '15/02/2026' },
  { icon: '📌', label: 'Current Status', value: 'Active Participant' },
  { icon: '🏥', label: 'Primary Support Team', value: 'Clinical & Community Care' },
  { icon: '📞', label: 'Emergency Support', value: '+61 1300 552 908' },
  { icon: '📄', label: 'Preferred Documentation', value: 'Digital records and e-sign' }
] as const;

const quickInsightItems = [
  {
    title: 'Alert & Allergy',
    value: 'Peanut allergy and penicillin sensitivity. Emergency response guide attached to profile.'
  },
  {
    title: 'Diagnosis',
    value: 'Autism spectrum disorder (Level 2), anxiety, and mild mobility limitation in left knee.'
  },
  {
    title: 'Medication',
    value: 'Sertraline 50mg daily, Vitamin D weekly, and PRN antihistamine as advised by GP.'
  }
] as const;

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('Personal Info');
  const params = new URLSearchParams(window.location.search);
  const participantName = params.get('name') || 'Olivia Thompson';
  const participantNdis = params.get('ndis') || '431762001';
  const participantUid = params.get('uid') || '701';

  const infoValues = [
    participantName,
    `${participantName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    participantNdis,
    'Melbourne, VIC'
  ];

  return (
    <section className="menu-panel active profile-page">
      <div className="profile-page__breadcrumb-row">
        <div className="profile-page__breadcrumb-wrap">
          <button
            className="profile-page__back"
            type="button"
            onClick={() => window.history.back()}
            aria-label="Back to clients"
            title="Back to clients"
          >
            ←
          </button>
          <div className="clients-breadcrumb" aria-label="Breadcrumb">
            <span>Dashboard</span>
            <span className="clients-breadcrumb__divider">›</span>
            <span>Participant &amp; Support</span>
            <span className="clients-breadcrumb__divider">›</span>
            <span>Clients</span>
            <span className="clients-breadcrumb__divider">›</span>
            <strong>Profile</strong>
          </div>
        </div>
        <div className="profile-page__actions" aria-label="Profile actions">
          <button type="button" title="Download PDF" aria-label="Download PDF">
            ⭳
          </button>
          <button type="button" title="Print" aria-label="Print profile">
            🖨
          </button>
        </div>
      </div>

      <div className="profile-layout">
        <aside className="profile-sidebar">
          <article className="profile-card">
            <div className="profile-card__banner" role="presentation" />
            <div className="profile-card__avatar-wrap">
              <img className="profile-card__avatar" src="https://i.pravatar.cc/80?img=32" alt="Participant profile" />
            </div>
            <h2>{participantName}</h2>
            <p className="profile-card__uid">UID #{participantUid}</p>

            <ul className="profile-card__details">
              {profileInfoItems.map((item, index) => (
                <li key={item.label}>
                  <span>{item.icon}</span>
                  <p>
                    <strong>{item.label}</strong>
                    {infoValues[index]}
                  </p>
                </li>
              ))}
            </ul>

            <div className="profile-card__partition" role="presentation" />

            <nav className="profile-tabs" aria-label="Profile sections">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`profile-tabs__item ${activeTab === tab ? 'is-active' : ''}`}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </article>
        </aside>

        <article className="profile-content">
          <div className="profile-content__header">
            <h3>{activeTab}</h3>
            <p>Detailed participant information for this section.</p>
          </div>

          <div className="profile-content__grid">
            <section className="profile-content__list" aria-label={`${activeTab} details`}>
              {tabContent[activeTab].map((item) => (
                <div className="profile-content__row" key={item.label}>
                  <p>
                    <span>•</span>
                    {item.label}
                  </p>
                  <h4>{item.value}</h4>
                </div>
              ))}
            </section>

            <aside className="profile-content__side" aria-label="Additional profile highlights">
              {activeTab === 'Personal Info' ? (
                <>
                  <section className="profile-content__insights" aria-label="Client health insights">
                    {quickInsightItems.map((item) => (
                      <article key={item.title} className="profile-content__insight-card">
                        <p>{item.title}</p>
                        <h4>{item.value}</h4>
                      </article>
                    ))}
                  </section>

                  <section className="profile-content__about" aria-label="About the client">
                    <p>About the Client</p>
                    <h4>
                      Olivia is a positive and social participant who enjoys art workshops, structured routines,
                      and community activities. She prefers clear communication, calm environments, and weekly
                      progress summaries shared with her support network.
                    </h4>
                  </section>
                </>
              ) : null}

              {rightPanelItems.map((item) => (
                <div className="profile-content__side-row" key={item.label}>
                  <p>
                    <span>{item.icon}</span>
                    {item.label}
                  </p>
                  <h4>{item.value}</h4>
                </div>
              ))}
            </aside>
          </div>
        </article>
      </div>
    </section>
  );
}
