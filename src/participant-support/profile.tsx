import { useState } from 'react';

type ProfileTab =
  | 'Personal Info'
  | 'Complience & transition'
  | 'Communication & reporting'
  | 'Audit'
  | 'Confidential'
  | 'medical & allind helth services';

const tabs: ProfileTab[] = [
  'Personal Info',
  'Complience & transition',
  'Communication & reporting',
  'Audit',
  'Confidential',
  'medical & allind helth services'
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
  'Complience & transition': [
    { label: 'Plan Start Date', value: '01/01/2026' },
    { label: 'Plan End Date', value: '31/12/2026' },
    { label: 'Risk Assessment', value: 'Updated on 05/02/2026' },
    { label: 'Transition Notes', value: 'No barriers identified, gradual handover in progress.' },
    { label: 'Consent Status', value: 'Active' },
    { label: 'Review Window', value: 'Quarterly' }
  ],
  'Communication & reporting': [
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
  'medical & allind helth services': [
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

const dummyAvatar = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" fill="none"><defs><linearGradient id="g" x1="21" y1="22" x2="178" y2="181" gradientUnits="userSpaceOnUse"><stop stop-color="#dfdbfb"/><stop offset="1" stop-color="#bca8ff"/></linearGradient></defs><circle cx="100" cy="100" r="100" fill="url(#g)"/><circle cx="100" cy="78" r="32" fill="#fff" fill-opacity="0.95"/><path d="M39 168c0-30.376 24.624-55 55-55h12c30.376 0 55 24.624 55 55v5H39v-5z" fill="#fff" fill-opacity="0.95"/></svg>`
)}`;

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
        <div className="clients-breadcrumb" aria-label="Breadcrumb">
          <span>Dashboard</span>
          <span className="clients-breadcrumb__divider">›</span>
          <span>Participant &amp; Support</span>
          <span className="clients-breadcrumb__divider">›</span>
          <span>Clients</span>
          <span className="clients-breadcrumb__divider">›</span>
          <strong>Profile</strong>
        </div>
        <button className="profile-page__back" type="button" onClick={() => window.history.back()}>
          ← Back to clients
        </button>
      </div>

      <div className="profile-layout">
        <aside className="profile-sidebar">
          <article className="profile-card">
            <div className="profile-card__banner" role="presentation" />
            <div className="profile-card__avatar-wrap">
              <img className="profile-card__avatar" src={dummyAvatar} alt="Participant profile" />
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
