import { type CSSProperties, useEffect, useMemo, useState } from 'react';

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

type MedicationInstruction = {
  text: string;
  tone: 'success' | 'warn' | 'info';
};

type MedicationCard = {
  id: string;
  name: string;
  subtitle: string;
  token: string;
  doseValue: string;
  doseUnit: string;
  route: string;
  prescriber: string;
  frequency: string;
  shape: string;
  coatingLabel: string;
  instructions: MedicationInstruction[];
  status: 'given' | 'due' | 'overdue' | 'scheduled';
  shapeTone: 'neutral' | 'yellow';
};

type ComplianceCategory = {
  id: string;
  icon: string;
  title: string;
  completed: number;
  total: number;
  status: string;
  statusTone: 'success' | 'warn' | 'muted' | 'danger';
  requiredTypes: string[];
  documents: Array<{
    id: string;
    title: string;
    uploadedDate: string;
    uploadedBy: string;
  }>;
};

type ComplianceDocument = {
  id: string;
  title: string;
  expiringOn: string;
  status: string;
  statusTone: 'success' | 'warn' | 'muted' | 'danger';
  actionLabel: string;
  actionTone: 'success' | 'warn' | 'muted' | 'danger';
};

type QuickAction = {
  id: string;
  icon: string;
  label: string;
  tone: 'default' | 'danger';
};

type ComplianceTypeDocument = {
  id: string;
  title: string;
  uploadedDate: string;
  uploadedBy: string;
};

type DocumentModalState = {
  categoryId: string;
  typeName: string | null;
};

type NewDocumentForm = {
  typeName: string;
  documentName: string;
  uploadedBy: string;
  uploadDate: string;
  expiryDate: string;
  fileName: string;
};

type ChartGroup = 'Core' | 'Medication' | 'Nutrition' | 'Continence';

type ChartOption = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  group: ChartGroup;
  featured?: boolean;
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
      name: 'Metformin',
      subtitle: 'Metformin Hydrochloride',
      token: '500',
      doseValue: '500',
      doseUnit: 'mg',
      route: 'Oral',
      prescriber: 'Dr. Patel',
      frequency: 'Twice daily',
      shape: 'White oval · scored line',
      coatingLabel: 'No Coating',
      instructions: [
        { text: 'With food', tone: 'success' },
        { text: 'Take with food', tone: 'warn' },
        { text: 'Hydrated', tone: 'info' }
      ],
      status: 'given',
      shapeTone: 'neutral'
    },
    {
      id: 'm2',
      name: 'Pantoprazole',
      subtitle: 'Pantoprazole Sodium',
      token: '40',
      doseValue: '40',
      doseUnit: 'mg',
      route: 'Oral',
      prescriber: 'Dr. Patel',
      frequency: 'Once daily',
      shape: 'Yellow oval · enteric coated',
      coatingLabel: 'Enteric',
      instructions: [
        { text: 'With food', tone: 'success' },
        { text: 'Take with food', tone: 'warn' }
      ],
      status: 'given',
      shapeTone: 'yellow'
    }
  ],
  '08:00': [
    {
      id: 'm3',
      name: 'Lisinopril',
      subtitle: 'Lisinopril 10mg',
      token: '10',
      doseValue: '10',
      doseUnit: 'mg',
      route: 'Oral',
      prescriber: 'Dr. Patel',
      frequency: 'Once daily',
      shape: 'White oval · scored line',
      coatingLabel: 'No Coating',
      instructions: [
        { text: 'Before breakfast', tone: 'warn' },
        { text: 'Take with food', tone: 'success' }
      ],
      status: 'overdue',
      shapeTone: 'neutral'
    },
    {
      id: 'm4',
      name: 'Atorvastatin',
      subtitle: 'Atorvastatin Calcium',
      token: '20',
      doseValue: '20',
      doseUnit: 'mg',
      route: 'Oral',
      prescriber: 'Dr. Patel',
      frequency: 'Once daily',
      shape: 'Yellow oval · enteric coated',
      coatingLabel: 'Enteric',
      instructions: [
        { text: 'Take with meal', tone: 'success' },
        { text: 'Monitor BP', tone: 'info' }
      ],
      status: 'due',
      shapeTone: 'yellow'
    },
    {
      id: 'm5',
      name: 'Sertraline',
      subtitle: 'Sertraline Hydrochloride',
      token: '50',
      doseValue: '50',
      doseUnit: 'mg',
      route: 'Oral',
      prescriber: 'Dr. Singh',
      frequency: 'Once daily',
      shape: 'White capsule',
      coatingLabel: 'Film Coated',
      instructions: [
        { text: 'After breakfast', tone: 'success' },
        { text: 'Avoid caffeine', tone: 'info' }
      ],
      status: 'due',
      shapeTone: 'neutral'
    }
  ],
  '12:00': [
    {
      id: 'm6',
      name: 'Gabapentin',
      subtitle: 'Gabapentin Capsule',
      token: '300',
      doseValue: '300',
      doseUnit: 'mg',
      route: 'Oral',
      prescriber: 'Dr. Lim',
      frequency: 'Twice daily',
      shape: 'White capsule',
      coatingLabel: 'No Coating',
      instructions: [
        { text: 'After lunch', tone: 'success' },
        { text: 'Avoid alcohol', tone: 'warn' }
      ],
      status: 'scheduled',
      shapeTone: 'neutral'
    },
    {
      id: 'm7',
      name: 'Probiotic',
      subtitle: 'Lactobacillus',
      token: '1',
      doseValue: '1',
      doseUnit: 'cap',
      route: 'Oral',
      prescriber: 'Dr. Lim',
      frequency: 'Once daily',
      shape: 'Capsule',
      coatingLabel: 'Gel Coating',
      instructions: [
        { text: 'With meal', tone: 'success' },
        { text: 'Take with water', tone: 'info' }
      ],
      status: 'scheduled',
      shapeTone: 'neutral'
    }
  ],
  '15:00': [
    {
      id: 'm8',
      name: 'Salbutamol',
      subtitle: 'Inhaler 100mcg',
      token: '2',
      doseValue: '2',
      doseUnit: 'puff',
      route: 'Inhalation',
      prescriber: 'Dr. Park',
      frequency: 'As needed',
      shape: 'Metered inhaler',
      coatingLabel: 'N/A',
      instructions: [
        { text: 'As directed', tone: 'success' },
        { text: 'Rinse mouth', tone: 'info' }
      ],
      status: 'scheduled',
      shapeTone: 'neutral'
    }
  ],
  '18:00': [
    {
      id: 'm9',
      name: 'Metformin',
      subtitle: 'Metformin Hydrochloride',
      token: '500',
      doseValue: '500',
      doseUnit: 'mg',
      route: 'Oral',
      prescriber: 'Dr. Patel',
      frequency: 'Once daily',
      shape: 'White oval',
      coatingLabel: 'No Coating',
      instructions: [
        { text: 'With dinner', tone: 'success' },
        { text: 'Check blood sugar', tone: 'info' }
      ],
      status: 'scheduled',
      shapeTone: 'neutral'
    },
    {
      id: 'm10',
      name: 'Aspirin',
      subtitle: 'Aspirin EC',
      token: '75',
      doseValue: '75',
      doseUnit: 'mg',
      route: 'Oral',
      prescriber: 'Dr. Clarke',
      frequency: 'Once daily',
      shape: 'Round tablet',
      coatingLabel: 'Enteric',
      instructions: [
        { text: 'After meal', tone: 'success' },
        { text: 'Monitor BP', tone: 'warn' }
      ],
      status: 'scheduled',
      shapeTone: 'yellow'
    },
    {
      id: 'm11',
      name: 'Calcium',
      subtitle: 'Calcium Carbonate',
      token: '1',
      doseValue: '1',
      doseUnit: 'tab',
      route: 'Oral',
      prescriber: 'Dr. Lim',
      frequency: 'Once daily',
      shape: 'White tablet',
      coatingLabel: 'Film Coated',
      instructions: [
        { text: 'With water', tone: 'info' },
        { text: 'After dinner', tone: 'success' }
      ],
      status: 'scheduled',
      shapeTone: 'neutral'
    }
  ],
  '21:00': [
    {
      id: 'm12',
      name: 'Melatonin',
      subtitle: 'Melatonin 3mg',
      token: '3',
      doseValue: '3',
      doseUnit: 'mg',
      route: 'Oral',
      prescriber: 'Dr. Singh',
      frequency: 'Once daily',
      shape: 'Small round tablet',
      coatingLabel: 'Film Coated',
      instructions: [
        { text: '30 min before sleep', tone: 'success' },
        { text: 'Do not crush', tone: 'warn' }
      ],
      status: 'scheduled',
      shapeTone: 'neutral'
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

const medicationStatusLabel: Record<MedicationCard['status'], string> = {
  given: 'Given',
  due: 'Due',
  overdue: 'Overdue',
  scheduled: 'Scheduled'
};

const complianceSummary = {
  percent: 75,
  upToDate: 17,
  pending: 10,
  expired: 12
} as const;

const complianceCategoriesSeed: ComplianceCategory[] = [
  {
    id: 'c1',
    icon: '\u{1F4B0}',
    title: 'Funding & Approvals',
    completed: 4,
    total: 4,
    status: 'On Track',
    statusTone: 'success',
    requiredTypes: ['NDIS Plan Approval', 'Funding Letter', 'Service Booking', 'Price Guide Match', 'Claim Authorization'],
    documents: [
      { id: 'c1d1', title: 'NDIS Plan Approval', uploadedDate: '15/03/2025', uploadedBy: 'Sarah Johnson' },
      { id: 'c1d2', title: 'Service Booking Confirmation', uploadedDate: '22/03/2025', uploadedBy: 'Ava Collins' },
      { id: 'c1d3', title: 'Claim Authorization Form', uploadedDate: '26/03/2025', uploadedBy: 'Daniel Lee' }
    ]
  },
  {
    id: 'c2',
    icon: '\u{1FA7A}',
    title: 'Clinical & Allied Health',
    completed: 4,
    total: 4,
    status: 'On Track',
    statusTone: 'success',
    requiredTypes: ['GP Summary', 'Allied Health Report', 'Medication Chart', 'Therapy Plan', 'Clinical Notes'],
    documents: [
      { id: 'c2d1', title: 'GP Summary', uploadedDate: '02/04/2025', uploadedBy: 'Emma Watson' },
      { id: 'c2d2', title: 'Medication Chart', uploadedDate: '06/04/2025', uploadedBy: 'Dr. Patel' }
    ]
  },
  {
    id: 'c3',
    icon: '\u{1F91D}',
    title: 'Support & Care Planning',
    completed: 4,
    total: 4,
    status: 'On Track',
    statusTone: 'success',
    requiredTypes: ['Support Plan', 'Goal Tracking', 'Roster Plan', 'Participant Preference', 'Review Notes'],
    documents: [
      { id: 'c3d1', title: 'Support Plan v2', uploadedDate: '11/04/2025', uploadedBy: 'Mia Young' },
      { id: 'c3d2', title: 'Participant Preference Sheet', uploadedDate: '13/04/2025', uploadedBy: 'Ava Collins' }
    ]
  },
  {
    id: 'c4',
    icon: '\u{1F6E1}\uFE0F',
    title: 'Risk & Safety',
    completed: 3,
    total: 4,
    status: 'Pending',
    statusTone: 'warn',
    requiredTypes: ['Risk Assessment', 'Incident Register', 'WHS Checklist', 'Emergency Plan', 'Behavior Support Plan'],
    documents: [
      { id: 'c4d1', title: 'Risk Assessment - Home Access', uploadedDate: '09/04/2025', uploadedBy: 'Jordan Kim' },
      { id: 'c4d2', title: 'Emergency Evacuation Plan', uploadedDate: '10/04/2025', uploadedBy: 'Liam Brown' }
    ]
  },
  {
    id: 'c5',
    icon: '\u{1F3E0}',
    title: 'Accommodation (SIL / SDA)',
    completed: 4,
    total: 4,
    status: 'Review',
    statusTone: 'muted',
    requiredTypes: ['SIL Agreement', 'SDA Eligibility', 'Tenancy Details', 'Support Ratio Plan', 'House Rules'],
    documents: [{ id: 'c5d1', title: 'SIL Service Agreement', uploadedDate: '05/04/2025', uploadedBy: 'Noah Wilson' }]
  },
  {
    id: 'c6',
    icon: '\u{1F4C4}',
    title: 'External Agreements',
    completed: 2,
    total: 4,
    status: 'Missing',
    statusTone: 'danger',
    requiredTypes: ['Guardian Consent', 'Supplier Agreement', 'Transport Contract', 'Advocacy Referral', 'Legal Declaration'],
    documents: [{ id: 'c6d1', title: 'Guardian Consent', uploadedDate: '27/03/2025', uploadedBy: 'Julie Stirling' }]
  }
];

const complianceDocuments: ComplianceDocument[] = [
  {
    id: 'd1',
    title: 'Home & Living Decision',
    expiringOn: '15/05/2025',
    status: 'Expired',
    statusTone: 'danger',
    actionLabel: 'Renew',
    actionTone: 'danger'
  },
  {
    id: 'd2',
    title: 'SIL / MTA Funding',
    expiringOn: '20/05/2025',
    status: 'Pending',
    statusTone: 'warn',
    actionLabel: 'Update',
    actionTone: 'muted'
  },
  {
    id: 'd3',
    title: 'Plan Reassessment',
    expiringOn: '05/06/2025',
    status: 'Due Soon',
    statusTone: 'warn',
    actionLabel: 'Prepare',
    actionTone: 'success'
  },
  {
    id: 'd4',
    title: 'NDIS Plan (Approval)',
    expiringOn: '15/10/2025',
    status: 'Valid',
    statusTone: 'success',
    actionLabel: 'Completed',
    actionTone: 'success'
  }
];

const complianceQuickActions: QuickAction[] = [
  { id: 'q1', icon: '\u2B06\uFE0F', label: 'Upload Document', tone: 'default' },
  { id: 'q2', icon: '\u{1F501}', label: 'Renew Expired', tone: 'danger' },
  { id: 'q3', icon: '\u{1F514}', label: 'Create Reminder', tone: 'default' },
  { id: 'q4', icon: '\u{1F4CA}', label: 'Add/View Chart', tone: 'default' }
];

const ndisChartOptions: ChartOption[] = [
  { id: 'core-vitals', title: 'Vital Signs Chart', subtitle: 'BP, Pulse, Temp, SpO2', icon: '\u{1FA7A}', group: 'Core', featured: true },
  { id: 'core-bgl', title: 'Blood Glucose Level (BGL)', subtitle: 'Diabetes blood sugar monitoring', icon: '\u{1FA78}', group: 'Core', featured: true },
  { id: 'core-weight', title: 'Weight Monitoring Chart', subtitle: 'Weekly body weight record', icon: '\u2696\uFE0F', group: 'Core' },
  { id: 'core-pain', title: 'Pain Assessment Chart', subtitle: 'Daily pain level assessments', icon: '\u{1FA79}', group: 'Core' },
  { id: 'core-oxygen', title: 'Oxygen Therapy Chart', subtitle: 'O2 delivery and SpO2 monitoring', icon: '\u{1FAC1}', group: 'Core' },
  { id: 'core-neuro', title: 'Neurological Observation Chart', subtitle: 'GCS and neuro obs tracking', icon: '\u{1F9E0}', group: 'Core' },
  { id: 'core-seizure', title: 'Seizure Monitoring Chart', subtitle: 'Epilepsy and seizure event log', icon: '\u26A1', group: 'Core' },
  { id: 'core-menstrual', title: 'Menstrual Health Chart', subtitle: 'Menstrual cycle tracking', icon: '\u{1FA7A}', group: 'Core' },
  { id: 'med-mar', title: 'Medication Administration Record', subtitle: 'MAR daily med admin tracking', icon: '\u{1F4CB}', group: 'Medication', featured: true },
  { id: 'med-prn', title: 'PRN Medication Chart', subtitle: 'As-needed medications record', icon: '\u23F1', group: 'Medication' },
  { id: 'nutri-intake', title: 'Food Intake Chart', subtitle: 'Meal and appetite tracking', icon: '\u{1F37D}\uFE0F', group: 'Nutrition' },
  { id: 'nutri-fluid', title: 'Fluid Balance Chart', subtitle: 'Hydration intake/output', icon: '\u{1F4A7}', group: 'Nutrition' },
  { id: 'cont-bowel', title: 'Bowel Chart', subtitle: 'Bowel movement monitoring', icon: '\u{1F9FB}', group: 'Continence' },
  { id: 'cont-bladder', title: 'Bladder Chart', subtitle: 'Urinary continence record', icon: '\u{1F6BD}', group: 'Continence' }
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('Personal Info');
  const [activeMedicationTime, setActiveMedicationTime] = useState('06:00');
  const [activeDetail, setActiveDetail] = useState<{ title: string; content: string } | null>(null);
  const [complianceCategories, setComplianceCategories] = useState<ComplianceCategory[]>(complianceCategoriesSeed);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [documentModalState, setDocumentModalState] = useState<DocumentModalState | null>(null);
  const [addDocumentCategoryId, setAddDocumentCategoryId] = useState<string | null>(null);
  const [newDocumentForm, setNewDocumentForm] = useState<NewDocumentForm>({
    typeName: '',
    documentName: '',
    uploadedBy: '',
    uploadDate: '',
    expiryDate: '',
    fileName: ''
  });
  const [categoryTypeDocuments, setCategoryTypeDocuments] = useState<Record<string, Record<string, ComplianceTypeDocument[]>>>(() => {
    const mapping: Record<string, Record<string, ComplianceTypeDocument[]>> = {};
    complianceCategoriesSeed.forEach((category) => {
      mapping[category.id] = {};
      category.requiredTypes.forEach((typeName, index) => {
        const seeded = category.documents.filter(
          (document, docIndex) =>
            document.title.toLowerCase().includes(typeName.split(' ')[0].toLowerCase()) || docIndex % category.requiredTypes.length === index
        );
        mapping[category.id][typeName] = seeded;
      });
    });
    return mapping;
  });
  const [chartModalOpen, setChartModalOpen] = useState(false);
  const [selectedCharts, setSelectedCharts] = useState<string[]>([]);
  const [chartSearchTerm, setChartSearchTerm] = useState('');
  const [chartActiveGroup, setChartActiveGroup] = useState<'All' | ChartGroup>('All');

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
  const slotStatusCounts = useMemo(
    () =>
      medicationCards.reduce(
        (accumulator, item) => {
          accumulator[item.status] += 1;
          return accumulator;
        },
        { given: 0, due: 0, overdue: 0, scheduled: 0 }
      ),
    [medicationCards]
  );

  const dayStatusSummary = useMemo(() => {
    const allCards = Object.values(medicationDataByTime).flat();
    return allCards.reduce(
      (accumulator, item) => {
        accumulator[item.status] += 1;
        accumulator.total += 1;
        return accumulator;
      },
      { given: 0, due: 0, overdue: 0, scheduled: 0, total: 0 }
    );
  }, []);

  const allGivenInSlot = medicationCards.length > 0 && slotStatusCounts.given === medicationCards.length;
  const progressPercentage = dayStatusSummary.total === 0 ? 0 : Math.round((dayStatusSummary.given / dayStatusSummary.total) * 100);
  const activeCategory = documentModalState
    ? complianceCategories.find((item) => item.id === documentModalState.categoryId) || null
    : null;
  const activeCategoryForAdd = addDocumentCategoryId
    ? complianceCategories.find((item) => item.id === addDocumentCategoryId) || null
    : null;
  const personalInfoPrimaryMeta = [metaRows[0], metaRows[2], metaRows[4]];
  const personalInfoSecondaryMeta = [metaRows[1], metaRows[3], metaRows[5]];

  const resolvedQuickActions = complianceQuickActions;

  const modalDocuments = useMemo(() => {
    if (!documentModalState || !activeCategory) return [] as Array<ComplianceTypeDocument & { typeName: string }>;

    const docMap = categoryTypeDocuments[documentModalState.categoryId] || {};
    if (!documentModalState.typeName) {
      return Object.entries(docMap).flatMap(([typeName, docs]) => docs.map((item) => ({ ...item, typeName })));
    }
    return (docMap[documentModalState.typeName] || []).map((item) => ({ ...item, typeName: documentModalState.typeName as string }));
  }, [activeCategory, categoryTypeDocuments, documentModalState]);

  const chartGroupCounts = useMemo(
    () => ({
      All: ndisChartOptions.length,
      Core: ndisChartOptions.filter((item) => item.group === 'Core').length,
      Medication: ndisChartOptions.filter((item) => item.group === 'Medication').length,
      Nutrition: ndisChartOptions.filter((item) => item.group === 'Nutrition').length,
      Continence: ndisChartOptions.filter((item) => item.group === 'Continence').length
    }),
    []
  );

  const visibleCharts = useMemo(() => {
    const normalized = chartSearchTerm.toLowerCase().trim();
    return ndisChartOptions.filter((item) => {
      const byGroup = chartActiveGroup === 'All' || item.group === chartActiveGroup;
      const bySearch = normalized.length === 0 || `${item.title} ${item.subtitle}`.toLowerCase().includes(normalized);
      return byGroup && bySearch;
    });
  }, [chartActiveGroup, chartSearchTerm]);

  const groupedCharts = useMemo(
    () => ({
      Core: visibleCharts.filter((item) => item.group === 'Core'),
      Medication: visibleCharts.filter((item) => item.group === 'Medication'),
      Nutrition: visibleCharts.filter((item) => item.group === 'Nutrition'),
      Continence: visibleCharts.filter((item) => item.group === 'Continence')
    }),
    [visibleCharts]
  );

  const toggleCategoryExpanded = (categoryId: string) => {
    setExpandedCategories((current) => ({ ...current, [categoryId]: !current[categoryId] }));
  };

  const openCategoryDocuments = (categoryId: string) => {
    setDocumentModalState({ categoryId, typeName: null });
  };

  const openTypeDocuments = (categoryId: string, typeName: string) => {
    setDocumentModalState({ categoryId, typeName });
  };

  const openAddDocumentModal = (categoryId: string) => {
    const category = complianceCategories.find((item) => item.id === categoryId);
    setAddDocumentCategoryId(categoryId);
    setNewDocumentForm({
      typeName: category?.requiredTypes[0] ?? '',
      documentName: '',
      uploadedBy: '',
      uploadDate: '',
      expiryDate: '',
      fileName: ''
    });
  };

  const clearAddDocumentForm = () => {
    if (!activeCategoryForAdd) return;
    setNewDocumentForm({
      typeName: activeCategoryForAdd.requiredTypes[0] ?? '',
      documentName: '',
      uploadedBy: '',
      uploadDate: '',
      expiryDate: '',
      fileName: ''
    });
  };

  const addDocumentToCategory = () => {
    if (!addDocumentCategoryId || !newDocumentForm.typeName || !newDocumentForm.documentName || !newDocumentForm.uploadedBy || !newDocumentForm.uploadDate) {
      return;
    }

    const nextDocument: ComplianceTypeDocument = {
      id: `${addDocumentCategoryId}-${Date.now()}`,
      title: newDocumentForm.documentName,
      uploadedBy: newDocumentForm.uploadedBy,
      uploadedDate: newDocumentForm.uploadDate
    };

    setCategoryTypeDocuments((current) => ({
      ...current,
      [addDocumentCategoryId]: {
        ...(current[addDocumentCategoryId] || {}),
        [newDocumentForm.typeName]: [...(current[addDocumentCategoryId]?.[newDocumentForm.typeName] || []), nextDocument]
      }
    }));
    setAddDocumentCategoryId(null);
  };

  const removeModalDocument = (categoryId: string, typeName: string, documentId: string) => {
    setCategoryTypeDocuments((current) => ({
      ...current,
      [categoryId]: {
        ...(current[categoryId] || {}),
        [typeName]: (current[categoryId]?.[typeName] || []).filter((item) => item.id !== documentId)
      }
    }));
  };

  const toggleChartSelection = (chartId: string) => {
    setSelectedCharts((current) =>
      current.includes(chartId) ? current.filter((item) => item !== chartId) : [...current, chartId]
    );
  };

  return (
    <section className="menu-panel active profile-page profile-page-v2">
      <div className="profile-page-v2__top-row">
        <div className="clients-breadcrumb" aria-label="Breadcrumb">
          <span>Dashboard</span>
          <span className="clients-breadcrumb__divider">&rsaquo;</span>
          <span>Participant &amp; Support</span>
          <span className="clients-breadcrumb__divider">&rsaquo;</span>
          <span>Clients</span>
          <span className="clients-breadcrumb__divider">&rsaquo;</span>
          <strong>Profile</strong>
        </div>

        <div className="profile-page-v2__actions" aria-label="Profile actions">
          <button type="button" aria-label="Edit profile" title="Edit profile">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 17.3V21h3.7L18 9.7 14.3 6 3 17.3zm17.7-10.2a1 1 0 000-1.4L18.3 3.3a1 1 0 00-1.4 0l-1.5 1.5 3.7 3.7 1.6-1.4z" />
            </svg>
          </button>
          <button type="button" aria-label="Print profile" title="Print profile">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 3h10v4H7V3zm11 6a3 3 0 013 3v5h-3v4H6v-4H3v-5a3 3 0 013-3h12zm-2 10v-4H8v4h8z" />
            </svg>
          </button>
          <button type="button" aria-label="Download profile" title="Download profile">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M11 4h2v8h3l-4 5-4-5h3V4zm-6 14h14v2H5v-2z" />
            </svg>
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
          <header className="medication-admin__panel">
            <div className="medication-admin__participant">
              <img src="https://i.pravatar.cc/180?img=47" alt="Participant profile" className="medication-admin__avatar" />
              <div className="medication-admin__participant-content">
                <h2>{participantName}</h2>
                <p>
                  <span className="medication-admin__meta-item">
                    <ProfileIcon name="transgender" />
                    Female
                  </span>
                  <span className="medication-admin__meta-item">
                    <ProfileIcon name="cake" />
                    12 Mar 1984 (41 yrs)
                  </span>
                </p>
                <div className="medication-admin__conditions">
                  <span>Type 2 Diabetes</span>
                  <span>Hypertension</span>
                </div>
              </div>
            </div>

            <div className="medication-admin__notes">
              <article className="medication-admin__note">
                <h3>Administration Note</h3>
                <p>
                  Administer the medication with yogurt or soft food to support easy intake. Ensure it is taken after meals to prevent stomach
                  discomfort.
                  <button type="button">View More</button>
                </p>
              </article>
              <article className="medication-admin__note">
                <h3>Alert &amp; Allergy</h3>
                <p>
                  Known allergy to Penicillin. Do not administer any penicillin-based antibiotics without prior GP review.
                  <button type="button">View More</button>
                </p>
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

          <p className={`medication-admin__schedule-note ${allGivenInSlot ? 'is-success' : 'is-neutral'}`}>
            <span className="medication-admin__schedule-icon" aria-hidden="true">
              {allGivenInSlot ? '\u2713' : '!'}
            </span>
            {allGivenInSlot
              ? `All ${medicationCards.length} medications for ${activeTimeSlot.time} have been administered and signed off.`
              : `${medicationCards.length} medications scheduled for ${activeTimeSlot.time} - ${activeTimeSlot.label}.`}
          </p>

          <div className="medication-admin__cards">
            {medicationCards.map((item) => (
              <article key={item.id} className={`medication-card is-${item.status}`}>
                <div className="medication-card__head">
                  <span className={`medication-card__token ${item.shapeTone === 'yellow' ? 'is-yellow' : ''}`}>{item.token}</span>
                  <div className="medication-card__title">
                    <h4>{item.name}</h4>
                    <p>{item.subtitle}</p>
                  </div>
                  <span className={`medication-card__status is-${item.status}`}>
                    {item.status === 'given' ? '\u2713' : item.status === 'due' ? '!' : item.status === 'overdue' ? '!' : '\u2022'} {medicationStatusLabel[item.status]}
                  </span>
                </div>

                <div className="medication-card__dose-row">
                  <p className="medication-card__dose">
                    <strong>{item.doseValue}</strong>
                    <small>{item.doseUnit}</small>
                  </p>
                  <div className="medication-card__route">
                    <p>{item.route}</p>
                    <small>{item.prescriber}</small>
                  </div>
                  <span className="medication-card__frequency">{item.frequency}</span>
                </div>

                <div className="medication-card__meta">
                  <span className={`medication-card__shape-dot ${item.shapeTone === 'yellow' ? 'is-yellow' : ''}`} aria-hidden="true" />
                  <p>{item.shape}</p>
                  <span className="medication-card__coating">{item.coatingLabel}</span>
                </div>

                <div className="medication-card__chips">
                  {item.instructions.map((instruction) => (
                    <span key={instruction.text} className={`is-${instruction.tone}`}>
                      {instruction.text}
                    </span>
                  ))}
                </div>

                <div className="medication-card__actions">
                  <select defaultValue={item.status === 'given' ? 'Mark as Given' : ''}>
                    <option value="" disabled>
                      -Select Action-
                    </option>
                    <option>Mark as Given</option>
                    <option>Skip</option>
                    <option>Reschedule</option>
                  </select>
                  <button type="button" className={`medication-card__confirm is-${item.status}`} aria-label={`Confirm ${item.name}`}>
                    {'\u2713'}
                  </button>
                </div>
              </article>
            ))}
          </div>

          <footer className="medication-admin__footer">
            <div className="medication-admin__summary">
              <span className="medication-admin__summary-item">
                <span className="medication-admin__summary-dot is-given" aria-hidden="true"></span>
                <strong>{dayStatusSummary.given}</strong> Given
              </span>
              <span className="medication-admin__summary-item">
                <span className="medication-admin__summary-dot is-due" aria-hidden="true"></span>
                <strong>{dayStatusSummary.due}</strong> Due
              </span>
              <span className="medication-admin__summary-item">
                <span className="medication-admin__summary-dot is-overdue" aria-hidden="true"></span>
                <strong>{dayStatusSummary.overdue}</strong> Overdue
              </span>
              <span className="medication-admin__summary-item">
                <span className="medication-admin__summary-dot is-upcoming" aria-hidden="true"></span>
                <strong>{dayStatusSummary.scheduled}</strong> Upcoming
              </span>
            </div>

            <div className="medication-admin__progress">
              <span>Today&apos;s progress</span>
              <div className="medication-admin__progress-track" aria-hidden="true">
                <span style={{ width: `${progressPercentage}%` }} />
              </div>
              <strong>{progressPercentage}%</strong>
            </div>

            <button className="medication-admin__cta" type="button">
              End Shift &amp; Sign Off
            </button>
          </footer>
        </article>
      ) : activeTab === 'Compliance and Transition' ? (
        <article className="compliance-page">
          <section className="compliance-top-grid">
            <article className="compliance-card compliance-summary">
              <div className="compliance-card__header">
                <h3>Compliance Summary</h3>
              </div>
              <div className="compliance-summary__body">
                <div
                  className="compliance-summary__donut"
                  style={
                    {
                      '--compliance-value': `${complianceSummary.percent}%`
                    } as CSSProperties
                  }
                  aria-label={`Compliance ${complianceSummary.percent} percent`}
                >
                  <div>
                    <strong>{complianceSummary.percent}%</strong>
                    <span>Compliant</span>
                  </div>
                </div>

                <div className="compliance-summary__legend">
                  <p>
                    <span className="dot is-green"></span>
                    Up to date
                    <strong>{complianceSummary.upToDate}</strong>
                  </p>
                  <p>
                    <span className="dot is-amber"></span>
                    Pending
                    <strong>{complianceSummary.pending}</strong>
                  </p>
                  <p>
                    <span className="dot is-red"></span>
                    Expired
                    <strong>{complianceSummary.expired}</strong>
                  </p>
                </div>
              </div>
            </article>

            <article className="compliance-card compliance-kpi">
              <h4>Documents Collected</h4>
              <strong>2</strong>
              <p>
                <span className="pill pill--green">+25%</span> 1 of 3
              </p>
              <div className="kpi-track">
                <span style={{ width: '35%' }}></span>
              </div>
            </article>

            <article className="compliance-card compliance-kpi">
              <h4>Documents Created</h4>
              <strong>3</strong>
              <p>
                <span className="pill pill--amber">+50%</span> 3 out of 6
              </p>
              <div className="kpi-track is-purple">
                <span style={{ width: '56%' }}></span>
              </div>
            </article>

            <article className="compliance-card compliance-kpi compliance-kpi--critical">
              <h4>Expiring Soon</h4>
              <strong>13</strong>
              <p className="critical-text">Action Needed</p>
              <small>Within 30 Days</small>
            </article>
          </section>

          <div className="compliance-content-grid">
            <section className="compliance-left">
              <h3 className="compliance-section-title">Document Categories</h3>
              <div className="compliance-category-list">
                {complianceCategories.map((item) => {
                  const percent = Math.round((item.completed / item.total) * 100);
                  const isExpanded = Boolean(expandedCategories[item.id]);

                  return (
                    <article key={item.id} className="compliance-category-row">
                      <div className="compliance-category-row__main">
                        <span className="compliance-category-row__icon" aria-hidden="true">
                          {item.icon}
                        </span>

                        <button type="button" className="compliance-category-row__title" onClick={() => openCategoryDocuments(item.id)}>
                          <h4>{item.title}</h4>
                        </button>

                        <p className="compliance-category-row__count">
                          {item.completed}/{item.total}
                        </p>

                        <div
                          className={`compliance-category-row__progress ${
                            item.statusTone === 'danger' ? 'is-danger' : item.statusTone === 'warn' ? 'is-warn' : ''
                          }`}
                        >
                          <strong>{percent}%</strong>
                          <div>
                            <span style={{ width: `${percent}%` }}></span>
                          </div>
                        </div>

                        <span className={`compliance-badge is-${item.statusTone}`}>{item.status}</span>

                        <button
                          type="button"
                          className={`compliance-category-row__toggle ${isExpanded ? 'is-open' : ''}`}
                          aria-label={`Toggle required types for ${item.title}`}
                          onClick={() => toggleCategoryExpanded(item.id)}
                        >
                          <span>&#8964;</span>
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="compliance-category-row__types">
                          {item.requiredTypes.map((typeName) => (
                            <div key={typeName} className="compliance-doc-type-row">
                              <p>
                                <span aria-hidden="true">•</span>
                                {typeName}
                              </p>
                              <button type="button" onClick={() => openTypeDocuments(item.id, typeName)}>
                                View documents
                              </button>
                            </div>
                          ))}
                          <button type="button" className="compliance-category-row__add-document" onClick={() => openAddDocumentModal(item.id)}>
                            + Add New Document
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>

            <aside className="compliance-right">
              <article className="compliance-card compliance-table-card">
                <table className="compliance-table">
                  <thead>
                    <tr>
                      <th>Document</th>
                      <th>Expiring On</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complianceDocuments.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <span className="compliance-doc-title">
                            <span className={`compliance-doc-dot is-${item.statusTone}`}></span>
                            {item.title}
                          </span>
                        </td>
                        <td className={`is-${item.statusTone}`}>{item.expiringOn}</td>
                        <td>
                          <span className={`compliance-badge is-${item.statusTone}`}>{item.status}</span>
                        </td>
                        <td>
                          <button type="button" className={`compliance-action-btn is-${item.actionTone}`}>
                            {item.actionLabel}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </article>

              <article className="compliance-card compliance-quick">
                <h3 className="compliance-section-title">Quick Actions</h3>
                <div className="compliance-quick__grid">
                  {resolvedQuickActions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`compliance-quick__item ${item.tone === 'danger' ? 'is-danger' : ''}`}
                      onClick={() => {
                        if (item.id === 'q4') setChartModalOpen(true);
                      }}
                    >
                      <span>{item.icon}</span>
                      <small>{item.label}</small>
                    </button>
                  ))}
                </div>
              </article>
            </aside>
          </div>
        </article>
      ) : activeTab === 'Personal Info' ? (
        <article className="personal-info-page">
          <section className="personal-info__hero">
            <div className="personal-info__identity">
              <div className="personal-info__avatar-wrap">
                <img src="https://i.pravatar.cc/180?img=47" alt="Participant profile" className="personal-info__avatar" />
                <div className="personal-info__completion">
                  <div className="personal-info__completion-head">
                    <span>Profile Completion</span>
                    <strong>50%</strong>
                  </div>
                  <div className="personal-info__completion-track">
                    <span />
                  </div>
                </div>
              </div>

              <div className="personal-info__identity-content">
                <h2>{participantName}</h2>
                <div className="personal-info__meta-grid">
                  <div>
                    {personalInfoPrimaryMeta.map((meta) => (
                      <p key={`primary-${meta.label}`}>
                        <ProfileIcon name={metaTypeIcon[meta.type]} />
                        <span>{meta.label}</span>
                      </p>
                    ))}
                  </div>
                  <div>
                    {personalInfoSecondaryMeta.map((meta) => (
                      <p key={`secondary-${meta.label}`}>
                        <ProfileIcon name={metaTypeIcon[meta.type]} />
                        <span>{meta.label}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <aside className="personal-info__alert" aria-label="Alert and allergy">
              <h3>
                <ProfileIcon name="warning" />
                Alert &amp; Allergy
              </h3>
              <p>
                Exposure to peanuts or peanut-containing products may result in rapid allergic reactions, which could include skin rashes, hives,
                swelling of the lips or throat, breathing difficulty, vomiting, or anaphylaxis.
                <button
                  type="button"
                  onClick={() =>
                    setActiveDetail({
                      title: 'Alert & Allergy',
                      content:
                        'Exposure to peanuts or peanut-containing products may result in rapid allergic reactions, including skin rashes, hives, swelling of the lips or throat, breathing difficulty, vomiting, or anaphylaxis. Follow emergency protocol and escalate immediately.'
                    })
                  }
                >
                  View More
                </button>
              </p>
            </aside>
          </section>

          <section className="personal-info__details-grid">
            {profileFields.map((item) => (
              <article className="personal-info__detail" key={item.label}>
                <p>
                  <ProfileIcon name={typeIcon[item.type]} />
                  {item.label}
                </p>
                <h4>{item.value}</h4>
              </article>
            ))}
          </section>

          <section className="personal-info__summary-grid">
            {summaryCards.map((item) => (
              <article key={item.title} className="personal-info__summary-card">
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
          </section>
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

      {activeCategory ? (
        <div className="compliance-modal" role="dialog" aria-modal="true" aria-labelledby="compliance-documents-title">
          <div className="compliance-modal__backdrop" onClick={() => setDocumentModalState(null)} aria-hidden="true" />
          <div className="compliance-modal__dialog">
            <button type="button" className="compliance-modal__close" aria-label="Close documents" onClick={() => setDocumentModalState(null)}>
              ×
            </button>
            <h3 id="compliance-documents-title">
              {activeCategory.title}
              {documentModalState?.typeName ? ` - ${documentModalState.typeName}` : ' - All Documents'}
            </h3>

            <div className="compliance-modal__table-wrap">
              <table className="compliance-modal__table">
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Title</th>
                    <th>Uploaded By</th>
                    <th>Uploaded Date</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {modalDocuments.map((document, index) => (
                    <tr key={document.id}>
                      <td>{index + 1}</td>
                      <td>{document.title}</td>
                      <td>{document.uploadedBy}</td>
                      <td>{document.uploadedDate}</td>
                      <td>
                        <button
                          type="button"
                          className="compliance-modal__delete"
                          onClick={() => removeModalDocument(activeCategory.id, document.typeName, document.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {modalDocuments.length === 0 ? (
                    <tr>
                      <td colSpan={5}>No documents uploaded for this selection.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}

      {activeCategoryForAdd ? (
        <div className="compliance-modal" role="dialog" aria-modal="true" aria-labelledby="compliance-add-document-title">
          <div className="compliance-modal__backdrop" onClick={() => setAddDocumentCategoryId(null)} aria-hidden="true" />
          <div className="compliance-modal__dialog compliance-modal__dialog--form">
            <button type="button" className="compliance-modal__close" aria-label="Close add document" onClick={() => setAddDocumentCategoryId(null)}>
              x
            </button>
            <h3 id="compliance-add-document-title">Add New Document</h3>

            <div className="compliance-form-grid">
              <label>
                <span>Document Name</span>
                <input
                  type="text"
                  placeholder="Document name"
                  value={newDocumentForm.documentName}
                  onChange={(event) => setNewDocumentForm((current) => ({ ...current, documentName: event.target.value }))}
                />
              </label>
              <label>
                <span>Uploaded By</span>
                <select
                  value={newDocumentForm.uploadedBy}
                  onChange={(event) => setNewDocumentForm((current) => ({ ...current, uploadedBy: event.target.value }))}
                >
                  <option value="">- Staff Name -</option>
                  <option>Sarah Johnson</option>
                  <option>Ava Collins</option>
                  <option>Daniel Lee</option>
                </select>
              </label>
              <label>
                <span>Upload Date</span>
                <input
                  type="date"
                  value={newDocumentForm.uploadDate}
                  onChange={(event) => setNewDocumentForm((current) => ({ ...current, uploadDate: event.target.value }))}
                />
              </label>
              <label>
                <span>Expiry Date</span>
                <input
                  type="date"
                  value={newDocumentForm.expiryDate}
                  onChange={(event) => setNewDocumentForm((current) => ({ ...current, expiryDate: event.target.value }))}
                />
              </label>
              <label>
                <span>Document Type</span>
                <select
                  value={newDocumentForm.typeName}
                  onChange={(event) => setNewDocumentForm((current) => ({ ...current, typeName: event.target.value }))}
                >
                  {activeCategoryForAdd.requiredTypes.map((typeName) => (
                    <option key={typeName} value={typeName}>
                      {typeName}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="compliance-upload-field">
              <span>File Upload</span>
              <input
                type="file"
                onChange={(event) =>
                  setNewDocumentForm((current) => ({
                    ...current,
                    fileName: event.target.files?.[0]?.name ?? ''
                  }))
                }
              />
              <p>{newDocumentForm.fileName || 'Click to upload or drag and drop'}</p>
            </label>

            <div className="compliance-modal__actions compliance-modal__actions--between">
              <button type="button" className="compliance-action-btn is-muted" disabled>
                Previous
              </button>
              <div className="compliance-modal__actions-right">
                <button type="button" className="compliance-action-btn is-muted" onClick={clearAddDocumentForm}>
                  Clear
                </button>
                <button type="button" className="compliance-action-btn is-success" onClick={addDocumentToCategory}>
                  Add Document
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {chartModalOpen ? (
        <div className="compliance-modal" role="dialog" aria-modal="true" aria-labelledby="ndis-chart-title">
          <div className="compliance-modal__backdrop" onClick={() => setChartModalOpen(false)} aria-hidden="true" />
          <div className="compliance-modal__dialog compliance-modal__dialog--charts">
            <button type="button" className="compliance-modal__close" aria-label="Close chart selection" onClick={() => setChartModalOpen(false)}>
              ×
            </button>
            <h3 id="ndis-chart-title">Participant Charts</h3>

            <div className="compliance-chart-search">
              <input
                type="search"
                placeholder="Search charts (e.g. bowel, diet, sleep, allergy...)"
                value={chartSearchTerm}
                onChange={(event) => setChartSearchTerm(event.target.value)}
              />
            </div>

            <div className="compliance-chart-filters">
              {(['All', 'Core', 'Medication', 'Nutrition', 'Continence'] as const).map((group) => (
                <button
                  key={group}
                  type="button"
                  className={chartActiveGroup === group ? 'is-active' : ''}
                  onClick={() => setChartActiveGroup(group)}
                >
                  {group}
                  <strong>{chartGroupCounts[group]}</strong>
                </button>
              ))}
            </div>

            <div className="compliance-chart-selected">
              <span>{selectedCharts.length} selected</span>
              <small>of {ndisChartOptions.length} charts</small>
              <div>
                {selectedCharts.slice(0, 3).map((chartId) => {
                  const chart = ndisChartOptions.find((item) => item.id === chartId);
                  if (!chart) return null;
                  return (
                    <button key={chart.id} type="button" onClick={() => toggleChartSelection(chart.id)}>
                      {chart.title} x
                    </button>
                  );
                })}
              </div>
              <button type="button" className="compliance-chart-selected__clear" onClick={() => setSelectedCharts([])}>
                Clear all
              </button>
            </div>

            <div className="compliance-chart-list">
              {(Object.keys(groupedCharts) as Array<keyof typeof groupedCharts>).map((groupName) => {
                const items = groupedCharts[groupName];
                if (items.length === 0) return null;

                return (
                  <section key={groupName} className="compliance-chart-group">
                    <header>
                      <h4>{groupName === 'Core' ? 'Core Clinical & Health Monitoring' : `${groupName} Management`}</h4>
                      <span>{items.length}</span>
                    </header>
                    <div className="compliance-chart-grid">
                      {items.map((chart) => (
                        <label key={chart.id} className="compliance-chart-item">
                          <input
                            type="checkbox"
                            checked={selectedCharts.includes(chart.id)}
                            onChange={() => toggleChartSelection(chart.id)}
                          />
                          <span className="compliance-chart-item__icon" aria-hidden="true">
                            {chart.icon}
                          </span>
                          <span className="compliance-chart-item__content">
                            <strong>{chart.title}</strong>
                            <small>{chart.subtitle}</small>
                          </span>
                          {chart.featured ? <em aria-hidden="true">★</em> : null}
                        </label>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>

            <div className="compliance-modal__actions compliance-modal__actions--between">
              <p>{selectedCharts.length} charts selected - click Add Selected to confirm</p>
              <div className="compliance-modal__actions-right">
                <button type="button" className="compliance-action-btn is-muted" onClick={() => setSelectedCharts([])}>
                  Clear
                </button>
                <button type="button" className="compliance-action-btn is-success" onClick={() => setChartModalOpen(false)}>
                  Add {selectedCharts.length || ''} Charts
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

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
