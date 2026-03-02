import { useEffect, useMemo, useState } from 'react';

type ProfileTab =
  | 'Personal Info'
  | 'Compliance and Transition'
  | 'Medication Administration'
  | 'Communication & Reporting'
  | 'Audit'
  | 'Confidential'
  | 'Medical & Allied Health Services';

type ProfileField = {
  type: 'name' | 'contact' | 'address' | 'identity' | 'guardian' | 'date';
  label: string;
  value: string;
};

type IconName =
  | 'person'
  | 'transgender'
  | 'flag'
  | 'family_restroom'
  | 'call'
  | 'cake'
  | 'medical_services'
  | 'pill'
  | 'info'
  | 'warning';

const tabs: ProfileTab[] = [
  'Personal Info',
  'Compliance and Transition',
  'Medication Administration',
  'Communication & Reporting',
  'Audit',
  'Confidential',
  'Medical & Allied Health Services'
];

const summaryCards = [
  {
    icon: 'medical_services',
    title: 'Diagnosis',
    value: 'The participant has Autism Spectrum Disorder (Level 2), anxiety, and mild mobility limitation.',
    full: 'The participant has Autism Spectrum Disorder (Level 2), anxiety, and mild mobility limitation. Support plans include low-stimulus transitions, visual prompts, and regular wellness check-ins with the care team.'
  },
  {
    icon: 'pill',
    title: 'Medication',
    value: 'Medication may be prescribed to assist with anxiety management and emotional regulation.',
    full: 'Medication may be prescribed to assist with anxiety management and emotional regulation. Current medication schedule is reviewed weekly with support staff and primary GP with adverse reaction monitoring.'
  },
  {
    icon: 'info',
    title: 'About the Client',
    value: 'Olivia is a friendly and engaging participant who benefits from structured routines and clear communication.',
    full: 'Olivia is a friendly and engaging participant who benefits from structured routines and clear communication. She enjoys creative activities, community programs, and one-on-one guided sessions with predictable daily planning.'
  }
] as const;

const fieldTemplate: ProfileField[] = [
  { type: 'name', label: 'First Name', value: 'Sallianne' },
  { type: 'name', label: 'Last Name', value: 'Tucker' },
  { type: 'name', label: 'Middle Name', value: '--' },
  { type: 'name', label: 'Preferred Name', value: 'Anne' },
  { type: 'guardian', label: 'Guardian / Decision Maker Name', value: 'Julie Stirling' },
  { type: 'guardian', label: 'Guardian Relationship', value: 'Parent' },
  { type: 'contact', label: 'Primary Contact Number', value: '+65845 484' },
  { type: 'contact', label: 'Email Address', value: 'juliestirling@gmail.com' },
  { type: 'address', label: 'Street No & Name', value: 'Lot 3 115, Pacific HWY' },
  { type: 'address', label: 'Street Suburb', value: 'Kangy Angy' },
  { type: 'address', label: 'State', value: 'New South Wales' },
  { type: 'address', label: 'Post Code', value: '2258' },
  { type: 'identity', label: 'Medicare Number', value: '5478451554' },
  { type: 'identity', label: 'NDIS Number', value: '6454445588' },
  { type: 'date', label: 'Service Start Date', value: '20/10/2025' },
  { type: 'date', label: 'Current Plan Validity', value: '20/10/2025 - 20/10/2026' }
];

const typeIcon: Record<ProfileField['type'], IconName> = {
  name: 'person',
  contact: 'call',
  address: 'flag',
  identity: 'info',
  guardian: 'family_restroom',
  date: 'cake'
};

const metaRows: { type: 'gender' | 'country' | 'guardian' | 'contact' | 'dob'; label: string }[] = [
  { type: 'gender', label: 'Female' },
  { type: 'country', label: 'Australia' },
  { type: 'guardian', label: 'Julie Stirling' },
  { type: 'contact', label: '6548565651' },
  { type: 'dob', label: '14/05/1973' },
  { type: 'contact', label: '+65845 484' }
];

const metaTypeIcon: Record<(typeof metaRows)[number]['type'], IconName> = {
  gender: 'transgender',
  country: 'flag',
  guardian: 'family_restroom',
  contact: 'call',
  dob: 'cake'
};

function ProfileIcon({ name }: { name: IconName }) {
  return (
    <span className="profile-icon" aria-hidden="true">
      <span className="material-symbols-outlined">{name}</span>
    </span>
  );
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('Personal Info');
  const [activeDetail, setActiveDetail] = useState<{ title: string; content: string } | null>(null);

  const params = new URLSearchParams(window.location.search);
  const participantName = params.get('name') || 'Sallianne Tucker';

  useEffect(() => {
    setActiveDetail(null);
  }, [participantName, activeTab]);

  const profileFields = useMemo(() => {
    const [firstName = 'Sallianne', lastName = 'Tucker'] = participantName.split(' ');

    return fieldTemplate.map((item) => {
      if (item.label === 'First Name') return { ...item, value: firstName };
      if (item.label === 'Last Name') return { ...item, value: lastName };
      return item;
    });
  }, [participantName]);

  return (
    <section className="menu-panel active profile-page profile-page-v2">
      <div className="profile-page-v2__top-row">
        <div className="clients-breadcrumb" aria-label="Breadcrumb">
          <span>Dashboard</span>
          <span className="clients-breadcrumb__divider">›</span>
          <span>Participant &amp; Support</span>
          <span className="clients-breadcrumb__divider">›</span>
          <span>Clients</span>
          <span className="clients-breadcrumb__divider">›</span>
          <strong>Profile</strong>
        </div>

        <div className="profile-page-v2__actions" aria-label="Profile actions">
          <button type="button" aria-label="Edit profile" title="Edit profile">
            ✏️
          </button>
          <button type="button" aria-label="Print profile" title="Print profile">
            🖨️
          </button>
          <button type="button" aria-label="Download profile" title="Download profile">
            ⬇️
          </button>
        </div>
      </div>

      <div className="profile-page-v2__tabs" role="tablist" aria-label="Profile sections">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={`profile-page-v2__tab ${activeTab === tab ? 'is-active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <article className="profile-overview-card">
        <div className="profile-overview-card__hero">
          <div className="profile-overview-card__identity">
            <img src="https://i.pravatar.cc/180?img=47" alt="Participant profile" className="profile-overview-card__avatar" />

            <div className="profile-overview-card__identity-content">
              <h2>{participantName}</h2>

              <div className="profile-overview-card__quick-meta">
                {metaRows.map((meta) => (
                  <p key={meta.label}>
                    <ProfileIcon name={metaTypeIcon[meta.type]} />
                    <span>{meta.label}</span>
                  </p>
                ))}
              </div>

              <div className="profile-overview-card__completion" aria-label="Profile completion 50 percent">
                <div className="profile-overview-card__completion-label">
                  <span>Profile Completion</span>
                  <strong>50%</strong>
                </div>
                <div className="profile-overview-card__completion-track">
                  <span />
                </div>
              </div>
            </div>
          </div>

          <aside className="profile-overview-card__alert" aria-label="Alert and allergy">
            <h3>
              <ProfileIcon name="warning" />
              Alert &amp; Allergy
            </h3>
            <p>
              Exposure to peanuts or peanut-containing products may result in rapid allergic reactions, which could include skin
              rashes, hives, swelling of the lips or throat, breathing difficulty, vomiting, or anaphylaxis.
              <button type="button" onClick={() => setActiveDetail({ title: 'Alert & Allergy', content: 'Exposure to peanuts or peanut-containing products may result in rapid allergic reactions, including skin rashes, hives, swelling of the lips or throat, breathing difficulty, vomiting, or anaphylaxis. Follow emergency protocol and escalate immediately.' })}>
                View More
              </button>
            </p>
          </aside>
        </div>

        <div className="profile-overview-card__details-grid">
          {profileFields.map((item) => (
            <div className="profile-overview-card__detail" key={item.label}>
              <p>
                <ProfileIcon name={typeIcon[item.type]} />
                {item.label}
              </p>
              <h4>{item.value}</h4>
            </div>
          ))}
        </div>

        <div className="profile-overview-card__summary-grid">
          {summaryCards.map((item) => (
            <article key={item.title} className="profile-overview-card__summary-item">
              <p>
                <ProfileIcon name={item.icon} />
                {item.title}
              </p>
              <h4>
                {item.value}{' '}
                <button type="button" onClick={() => setActiveDetail({ title: item.title, content: item.full })}>
                  View More
                </button>
              </h4>
            </article>
          ))}
        </div>
      </article>

      {activeDetail ? (
        <div className="profile-detail-modal" role="dialog" aria-modal="true" aria-labelledby="profile-detail-title">
          <div className="profile-detail-modal__backdrop" onClick={() => setActiveDetail(null)} aria-hidden="true" />
          <div className="profile-detail-modal__dialog" role="document">
            <button className="profile-detail-modal__close" type="button" onClick={() => setActiveDetail(null)} aria-label="Close details">
              ×
            </button>
            <h3 id="profile-detail-title">{activeDetail.title}</h3>
            <p>{activeDetail.content}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
