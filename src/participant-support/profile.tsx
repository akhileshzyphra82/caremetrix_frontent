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
  | 'warning'
  | 'schedule';

type MedicationTimeSlot = {
  id: string;
  time: string;
  label: string;
  badges: { text: string; tone: 'success' | 'warn' | 'muted' | 'danger' }[];
};

type MedicationCard = {
  id: string;
  name: string;
  subtitle: string;
  dose: string;
  route: string;
  prescriber: string;
  shape: string;
  coating: string;
  instructions: string[];
  status: 'overdue' | 'due-now' | 'scheduled';
  borderTone: 'danger' | 'warn' | 'purple';
};

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

const medicationTimeSlots: MedicationTimeSlot[] = [
  { id: '06:00', time: '06:00 AM', label: 'Early Morning', badges: [{ text: '2 Given', tone: 'success' }] },
  { id: '08:00', time: '08:00 AM', label: 'Morning', badges: [{ text: '1 Overdue', tone: 'danger' }, { text: '2 Due', tone: 'warn' }] },
  { id: '12:00', time: '12:00 PM', label: 'Midday', badges: [{ text: '2 Scheduled', tone: 'muted' }] },
  { id: '15:00', time: '03:00 PM', label: 'Afternoon', badges: [{ text: '1 Scheduled', tone: 'muted' }] },
  { id: '18:00', time: '06:00 PM', label: 'Evening', badges: [{ text: '3 Scheduled', tone: 'muted' }] },
  { id: '21:00', time: '09:00 PM', label: 'Night', badges: [{ text: '1 Scheduled', tone: 'muted' }] }
];

const medicationDataByTime: Record<string, MedicationCard[]> = {
  '06:00': [
    {
      id: 'm1',
      name: 'Vitamin D3',
      subtitle: 'Cholecalciferol',
      dose: '1000 mg',
      route: 'Oral',
      prescriber: 'Dr. Patel',
      shape: 'White soft-gel',
      coating: 'No coating',
      instructions: ['After breakfast', 'Take with water'],
      status: 'scheduled',
      borderTone: 'purple'
    },
    {
      id: 'm2',
      name: 'Aspirin',
      subtitle: 'Aspirin EC',
      dose: '75 mg',
      route: 'Oral',
      prescriber: 'Dr. Clarke',
      shape: 'Round tablet',
      coating: 'Enteric',
      instructions: ['Before food', 'Monitor blood pressure'],
      status: 'scheduled',
      borderTone: 'warn'
    }
  ],
  '08:00': [
    {
      id: 'm3',
      name: 'Lisinopril',
      subtitle: 'Lisinopril 10mg',
      dose: '10 mg',
      route: 'Oral',
      prescriber: 'Dr. Patel',
      shape: 'White oval · scored line',
      coating: 'No coating',
      instructions: ['Before breakfast', 'Take with food'],
      status: 'overdue',
      borderTone: 'danger'
    },
    {
      id: 'm4',
      name: 'Metformin',
      subtitle: 'Metformin Hydrochloride',
      dose: '500 mg',
      route: 'Oral',
      prescriber: 'Dr. Patel',
      shape: 'White oval · scored line',
      coating: 'No coating',
      instructions: ['Before breakfast', 'Take with food'],
      status: 'due-now',
      borderTone: 'warn'
    },
    {
      id: 'm5',
      name: 'Atorvastatin',
      subtitle: 'Atorvastatin Calcium',
      dose: '20 mg',
      route: 'Oral',
      prescriber: 'Dr. Patel',
      shape: 'Yellow oval · enteric coated',
      coating: 'Enteric',
      instructions: ['Any time', 'With meal'],
      status: 'due-now',
      borderTone: 'warn'
    }
  ],
  '12:00': [
    {
      id: 'm6',
      name: 'Gabapentin',
      subtitle: 'Gabapentin Capsule',
      dose: '300 mg',
      route: 'Oral',
      prescriber: 'Dr. Lim',
      shape: 'White capsule',
      coating: 'No coating',
      instructions: ['After lunch', 'Avoid alcohol'],
      status: 'scheduled',
      borderTone: 'purple'
    },
    {
      id: 'm7',
      name: 'Probiotic',
      subtitle: 'Lactobacillus',
      dose: '1 cap',
      route: 'Oral',
      prescriber: 'Dr. Lim',
      shape: 'Capsule',
      coating: 'Gel coating',
      instructions: ['With meal', 'Take with water'],
      status: 'scheduled',
      borderTone: 'purple'
    }
  ],
  '15:00': [
    {
      id: 'm8',
      name: 'Salbutamol',
      subtitle: 'Inhaler 100mcg',
      dose: '2 puff',
      route: 'Inhalation',
      prescriber: 'Dr. Park',
      shape: 'Metered inhaler',
      coating: 'N/A',
      instructions: ['As directed', 'Rinse mouth after use'],
      status: 'scheduled',
      borderTone: 'purple'
    }
  ],
  '18:00': [
    {
      id: 'm9',
      name: 'Metformin',
      subtitle: 'Metformin Hydrochloride',
      dose: '500 mg',
      route: 'Oral',
      prescriber: 'Dr. Patel',
      shape: 'White oval',
      coating: 'No coating',
      instructions: ['With dinner', 'Check blood sugar'],
      status: 'scheduled',
      borderTone: 'warn'
    }
  ],
  '21:00': [
    {
      id: 'm10',
      name: 'Melatonin',
      subtitle: 'Melatonin 3mg',
      dose: '3 mg',
      route: 'Oral',
      prescriber: 'Dr. Singh',
      shape: 'Small round tablet',
      coating: 'Film coated',
      instructions: ['30 min before sleep', 'Do not crush'],
      status: 'scheduled',
      borderTone: 'purple'
    }
  ]
};

function ProfileIcon({ name }: { name: IconName }) {
  return (
    <span className="profile-icon" aria-hidden="true">
      <span className="material-symbols-outlined">{name}</span>
    </span>
  );
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('Medication Administration');
  const [activeMedicationTime, setActiveMedicationTime] = useState('08:00');
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

  const activeTimeSlot = medicationTimeSlots.find((slot) => slot.id === activeMedicationTime) ?? medicationTimeSlots[0];
  const medicationCards = medicationDataByTime[activeMedicationTime] ?? [];

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

      {activeTab === 'Medication Administration' ? (
        <article className="medication-admin">
          <header className="medication-admin__profile-head">
            <div className="medication-admin__participant">
              <img src="https://i.pravatar.cc/180?img=47" alt="Participant profile" className="medication-admin__avatar" />
              <div>
                <h2>{participantName}</h2>
                <p>♀ Female &nbsp; 📅 12 Mar 1984 (41 yrs)</p>
                <div className="medication-admin__conditions">
                  <span>Type 2 Diabetes</span>
                  <span>Hypertension</span>
                </div>
              </div>
            </div>

            <div className="medication-admin__notes">
              <article>
                <h3>⚠ Administration Note</h3>
                <p>Administer the medication with yogurt or soft food to support easy intake. Ensure it is taken after meals to prevent stomach discomfort. <button type="button">View More</button></p>
              </article>
              <article>
                <h3>⚠ Alert &amp; Allergy</h3>
                <p>Known allergy to Penicillin. Do not administer any penicillin-based antibiotics without prior GP review. <button type="button">View More</button></p>
              </article>
            </div>
          </header>

          <div className="medication-admin__timing-tabs" role="tablist" aria-label="Medication timing">
            {medicationTimeSlots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                role="tab"
                aria-selected={activeMedicationTime === slot.id}
                className={`medication-admin__timing-tab ${activeMedicationTime === slot.id ? 'is-active' : ''}`}
                onClick={() => setActiveMedicationTime(slot.id)}
              >
                <strong>{slot.time}</strong>
                <span>{slot.label}</span>
                <div className="medication-admin__timing-badges">
                  {slot.badges.map((badge) => (
                    <small key={badge.text} className={`is-${badge.tone}`}>
                      {badge.text}
                    </small>
                  ))}
                </div>
              </button>
            ))}
          </div>

          <p className="medication-admin__schedule-note">
            <ProfileIcon name="schedule" />
            {medicationCards.length} medications scheduled for {activeTimeSlot.time} — {activeTimeSlot.label}.
          </p>

          <div className="medication-admin__cards">
            {medicationCards.map((item) => (
              <article key={item.id} className={`medication-card is-${item.borderTone}`}>
                <div className="medication-card__head">
                  <div>
                    <h4>{item.name}</h4>
                    <p>{item.subtitle}</p>
                  </div>
                  <span className={`medication-card__status is-${item.status}`}>{item.status.replace('-', ' ')}</span>
                </div>

                <div className="medication-card__dose-row">
                  <strong>{item.dose}</strong>
                  <div>
                    <p>{item.route}</p>
                    <small>{item.prescriber}</small>
                  </div>
                  <span>Once daily</span>
                </div>

                <p className="medication-card__meta">
                  {item.shape} <span>{item.coating}</span>
                </p>

                <div className="medication-card__chips">
                  {item.instructions.map((instruction) => (
                    <span key={instruction}>{instruction}</span>
                  ))}
                </div>

                <div className="medication-card__actions">
                  <select defaultValue="">
                    <option value="" disabled>
                      -Select Action-
                    </option>
                    <option>Mark as Given</option>
                    <option>Skip</option>
                    <option>Reschedule</option>
                  </select>
                  <button type="button">✓</button>
                </div>
              </article>
            ))}
          </div>
        </article>
      ) : (
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
      )}

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
