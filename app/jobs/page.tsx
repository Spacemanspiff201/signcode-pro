'use client';
import { useState, useEffect, useRef } from 'react';

// ── Constants ──────────────────────────────────────────────────────────────
const SIGN_TYPES = ['Wall / Channel Letters', 'Monument', 'Pylon / Pole', 'EMC / Digital', 'Awning', 'Projecting', 'Roof Sign', 'Window Graphics', 'Temporary / Banner'];

const JURISDICTIONS = [
  'Miami-Dade County', 'Broward County', 'Palm Beach County',
  'City of Fort Lauderdale', 'City of Pompano Beach', 'City of Boca Raton',
  'City of Miami Beach', 'City of Hollywood', 'City of Deerfield Beach',
  'City of Pembroke Pines', 'City of Coral Springs', 'City of Miramar',
  'City of West Palm Beach', 'City of Delray Beach', 'City of Sunrise',
  'City of Orlando', 'City of Tampa', 'Hillsborough County', 'Other',
];

const STATUSES = [
  'Not Started', 'Survey In Progress', 'Code Research',
  'Documents Pending', 'Submitted', 'Under Review',
  'Approved', 'Rejected', 'On Hold', 'Installed', 'Completed',
];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  'Not Started':        { bg: '#F1EFE8', color: '#444441' },
  'Survey In Progress': { bg: '#E6F1FB', color: '#0C447C' },
  'Code Research':      { bg: '#E6F1FB', color: '#0C447C' },
  'Documents Pending':  { bg: '#FAEEDA', color: '#633806' },
  'Submitted':          { bg: '#FAEEDA', color: '#633806' },
  'Under Review':       { bg: '#FAEEDA', color: '#633806' },
  'Approved':           { bg: '#EAF3DE', color: '#27500A' },
  'Rejected':           { bg: '#FCEBEB', color: '#791F1F' },
  'On Hold':            { bg: '#F1EFE8', color: '#444441' },
  'Installed':          { bg: '#EAF3DE', color: '#27500A' },
  'Completed':          { bg: '#EAF3DE', color: '#27500A' },
};

const DEFAULT_DOCS = [
  'Permit application',
  'Site plan with dimensions to property lines',
  'Sign construction drawings',
  'Wind load calculations (Florida Building Code)',
  'Electrical permit if illuminated',
  'Engineer-sealed calculations if required',
  'Property owner authorization',
  'Business tax receipt',
  'Timeclock / photocell specs if required',
];

const PHOTO_TYPES = [
  { value: 'survey_existing', label: 'Survey — Existing signage' },
  { value: 'survey_building', label: 'Survey — Building face' },
  { value: 'survey_electrical', label: 'Survey — Electrical panel' },
  { value: 'survey_measurement', label: 'Survey — Measurements' },
  { value: 'approved_drawing', label: 'Approved drawing' },
  { value: 'install_progress', label: 'Install — In progress' },
  { value: 'install_completed', label: 'Install — Completed' },
  { value: 'post_install', label: 'Post-install final' },
  { value: 'rejection_notice', label: 'Rejection notice' },
  { value: 'other', label: 'Other' },
];

// ── Types ──────────────────────────────────────────────────────────────────
interface DocItem { label: string; done: boolean; }
interface NoteEntry { id: string; text: string; type: string; createdAt: string; createdBy: string; }
interface PhotoEntry { id: string; url: string; type: string; caption: string; takenAt: string; }

interface Job {
  id: string;
  clientName: string;
  address: string;
  signType: string;
  jurisdiction: string;
  status: string;
  submittedDate: string;
  approvedDate: string;
  rejectionReason: string;
  installDate: string;
  targetDate: string;
  assignedTo: string;
  permitNumber: string;
  // Property / landlord layer
  shoppingCenterName: string;
  propertyManager: string;
  propertyManagerPhone: string;
  colorRestrictions: string;
  fontRestrictions: string;
  illuminationRestrictions: string;
  timeclockRequiredLandlord: boolean;
  photocellRequiredLandlord: boolean;
  landlordNotes: string;
  // Illumination controls
  timeclockRequired: boolean;
  photocellRequired: boolean;
  // Docs, notes, photos
  docs: DocItem[];
  notes: NoteEntry[];
  photos: PhotoEntry[];
  createdAt: string;
  updatedAt: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function generateId() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

function Badge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] || { bg: '#F1EFE8', color: '#444441' };
  return (
    <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '600', whiteSpace: 'nowrap', background: c.bg, color: c.color }}>
      {status}
    </span>
  );
}

function ProgressBar({ docs }: { docs: DocItem[] }) {
  const done = docs.filter(d => d.done).length;
  const pct = docs.length ? Math.round((done / docs.length) * 100) : 0;
  const color = pct === 100 ? '#3B6D11' : '#185FA5';
  return (
    <div style={{ height: '3px', background: '#E2E8F0', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '2px', transition: 'width .3s' }} />
    </div>
  );
}

function AddDocRow({ onAdd }: { onAdd: (label: string) => void }) {
  const [val, setVal] = useState('');
  return (
    <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
      <input value={val} onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && val.trim()) { onAdd(val.trim()); setVal(''); } }}
        placeholder="Add document..."
        style={{ flex: 1, padding: '6px 10px', border: '0.5px solid #D3D1C7', borderRadius: '6px', fontSize: '12px', background: '#fff', color: '#0D1B2A', outline: 'none', fontFamily: 'inherit' }} />
      <button onClick={() => { if (val.trim()) { onAdd(val.trim()); setVal(''); } }}
        style={{ padding: '6px 12px', background: '#185FA5', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>Add</button>
    </div>
  );
}

const inp: React.CSSProperties = {
  padding: '8px 10px', borderRadius: '6px', border: '0.5px solid #D3D1C7',
  fontSize: '13px', width: '100%', background: '#fff', color: '#0D1B2A',
  outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
};

const sectionLabel: React.CSSProperties = {
  fontSize: '10px', fontWeight: '700', color: '#9BA8B4',
  textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '10px',
};

// ── Sample jobs ────────────────────────────────────────────────────────────
const SAMPLE_JOBS: Job[] = [
  {
    id: 'sample-1', clientName: 'Publix #2241 — Pylon Sign',
    address: '7800 W Sunrise Blvd, Plantation, FL', signType: 'Pylon / Pole',
    jurisdiction: 'Broward County', status: 'Under Review',
    submittedDate: '2026-03-28', approvedDate: '', rejectionReason: '', installDate: '',
    targetDate: '2026-04-25', assignedTo: 'J. Scara', permitNumber: 'BRO-2026-04821',
    shoppingCenterName: 'Plantation Promenade', propertyManager: 'Regency Centers',
    propertyManagerPhone: '(954) 555-0100',
    colorRestrictions: '', fontRestrictions: '', illuminationRestrictions: '',
    timeclockRequiredLandlord: true, photocellRequiredLandlord: false,
    landlordNotes: 'Landlord requires all signs match existing tenant palette — confirm with property manager before fabrication.',
    timeclockRequired: true, photocellRequired: false,
    docs: [
      { label: 'Permit application', done: true },
      { label: 'Site plan with dimensions to property lines', done: true },
      { label: 'Sign construction drawings', done: true },
      { label: 'Wind load calculations (Florida Building Code)', done: true },
      { label: 'Electrical permit if illuminated', done: true },
      { label: 'Property owner authorization', done: true },
      { label: 'Engineer-sealed calculations if required', done: false },
      { label: 'Business tax receipt', done: false },
      { label: 'Timeclock / photocell specs if required', done: false },
    ],
    notes: [
      { id: 'n1', text: 'Called Maria at zoning 4/9 — said engineer seal still needed before they can finalize.', type: 'field_note', createdAt: '2026-04-09T14:00:00Z', createdBy: 'J. Scara' },
    ],
    photos: [],
    createdAt: '2026-03-20T10:00:00Z', updatedAt: '2026-04-09T14:00:00Z',
  },
  {
    id: 'sample-2', clientName: 'AutoNation — Monument Sign',
    address: '200 NW 136th Ave, Miami, FL', signType: 'Monument',
    jurisdiction: 'Miami-Dade County', status: 'Submitted',
    submittedDate: '2026-04-02', approvedDate: '', rejectionReason: '', installDate: '',
    targetDate: '2026-05-14', assignedTo: 'J. Scara', permitNumber: '',
    shoppingCenterName: '', propertyManager: '', propertyManagerPhone: '',
    colorRestrictions: 'AutoNation red only — PMS 485', fontRestrictions: 'Helvetica Neue Bold only',
    illuminationRestrictions: 'Front lit only — no halo or open face',
    timeclockRequiredLandlord: false, photocellRequiredLandlord: true,
    landlordNotes: '',
    timeclockRequired: false, photocellRequired: true,
    docs: [
      { label: 'Notarized application (owner + qualifier)', done: true },
      { label: 'Correct folio number and legal description', done: true },
      { label: 'Two sets of plans: office copy and job copy', done: true },
      { label: 'Facade dimensions and building elevation', done: true },
      { label: 'Engineer-sealed calculations (over 24 sq ft)', done: true },
      { label: 'ELEC.03 electrical permit application', done: true },
      { label: 'Wind load calculations', done: true },
      { label: 'Photo of proposed sign location', done: true },
      { label: 'Timeclock / photocell specs if required', done: true },
    ],
    notes: [
      { id: 'n2', text: 'Complete package submitted. Miami-Dade processing window 4-8 weeks. Follow up Apr 16.', type: 'general', createdAt: '2026-04-02T16:00:00Z', createdBy: 'J. Scara' },
    ],
    photos: [],
    createdAt: '2026-03-28T09:00:00Z', updatedAt: '2026-04-02T16:00:00Z',
  },
  {
    id: 'sample-3', clientName: "Chick-fil-A — Wall Sign",
    address: '1401 N Federal Hwy, Pompano Beach, FL', signType: 'Wall / Channel Letters',
    jurisdiction: 'City of Pompano Beach', status: 'Documents Pending',
    submittedDate: '', approvedDate: '', rejectionReason: '', installDate: '',
    targetDate: '2026-04-22', assignedTo: 'J. Scara', permitNumber: '',
    shoppingCenterName: 'Federal Plaza', propertyManager: 'Equity One',
    propertyManagerPhone: '(954) 555-0200',
    colorRestrictions: 'Red channel letters — brand standard only',
    fontRestrictions: 'Chick-fil-A brand font only',
    illuminationRestrictions: 'Front lit only',
    timeclockRequiredLandlord: true, photocellRequiredLandlord: true,
    landlordNotes: 'Atlantic Blvd overlay — confirm AAC review requirement before submitting. MSP must be on file.',
    timeclockRequired: true, photocellRequired: true,
    docs: [
      { label: 'Sign code compliance permit application', done: true },
      { label: 'Business tax receipt', done: true },
      { label: 'Four (4) compiled sets of plans', done: false },
      { label: 'Facade dimensions and elevation', done: false },
      { label: 'Color rendering of sign proposal', done: false },
      { label: 'Master Sign Program confirmation', done: false },
      { label: 'AAC design review approval', done: false },
      { label: 'Timeclock / photocell specs if required', done: false },
    ],
    notes: [
      { id: 'n3', text: 'Confirm Master Sign Program status for this property before proceeding — Atlantic Blvd overlay may require AAC review.', type: 'field_note', createdAt: '2026-04-10T08:00:00Z', createdBy: 'J. Scara' },
    ],
    photos: [],
    createdAt: '2026-04-10T08:00:00Z', updatedAt: '2026-04-10T08:00:00Z',
  },
  {
    id: 'sample-4', clientName: 'Walgreens — EMC Sign',
    address: '501 E Palmetto Park Rd, Boca Raton, FL', signType: 'EMC / Digital',
    jurisdiction: 'City of Boca Raton', status: 'Rejected',
    submittedDate: '2026-03-10', approvedDate: '', rejectionReason: 'EMC signs are prohibited in all zoning districts within Boca Raton. Resubmit as static illuminated sign.', installDate: '',
    targetDate: '2026-04-28', assignedTo: 'J. Scara', permitNumber: 'BCA-2026-00319',
    shoppingCenterName: '', propertyManager: '', propertyManagerPhone: '',
    colorRestrictions: '', fontRestrictions: '', illuminationRestrictions: '',
    timeclockRequiredLandlord: false, photocellRequiredLandlord: false,
    landlordNotes: '',
    timeclockRequired: false, photocellRequired: false,
    docs: [
      { label: 'Sign permit application', done: true },
      { label: 'Design review application', done: true },
      { label: 'Site plan with dimensions', done: true },
      { label: 'Sign construction drawings', done: true },
      { label: 'Color renderings', done: true },
      { label: 'Wind load calculations', done: true },
      { label: 'Revised static sign design', done: false },
    ],
    notes: [
      { id: 'n4', text: 'Boca design review board denied EMC in CG zone. Resubmitting as static illuminated sign.', type: 'rejection_note', createdAt: '2026-04-01T11:00:00Z', createdBy: 'J. Scara' },
      { id: 'n5', text: 'Design review rescheduled for Apr 28. Client notified.', type: 'general', createdAt: '2026-04-05T09:00:00Z', createdBy: 'J. Scara' },
    ],
    photos: [],
    createdAt: '2026-03-05T10:00:00Z', updatedAt: '2026-04-05T09:00:00Z',
  },
  {
    id: 'sample-5', clientName: 'Chase Bank — Monument Sign',
    address: '9999 Biscayne Blvd, Miami Shores, FL', signType: 'Monument',
    jurisdiction: 'Miami-Dade County', status: 'Completed',
    submittedDate: '2026-02-14', approvedDate: '2026-03-29', rejectionReason: '', installDate: '2026-04-15',
    targetDate: '2026-03-30', assignedTo: 'J. Scara', permitNumber: 'MDC-2026-08847',
    shoppingCenterName: '', propertyManager: '', propertyManagerPhone: '',
    colorRestrictions: 'Chase blue only — PMS 286', fontRestrictions: '', illuminationRestrictions: '',
    timeclockRequiredLandlord: false, photocellRequiredLandlord: true,
    landlordNotes: '',
    timeclockRequired: false, photocellRequired: true,
    docs: [
      { label: 'Notarized application', done: true },
      { label: 'Two sets of plans', done: true },
      { label: 'Engineer-sealed calculations', done: true },
      { label: 'ELEC.03 electrical permit', done: true },
      { label: 'Wind load calculations', done: true },
      { label: 'Photo of sign location', done: true },
      { label: 'Shop inspection', done: true },
      { label: 'Timeclock / photocell specs if required', done: true },
    ],
    notes: [
      { id: 'n6', text: 'Approved 3/29. Shop inspection passed 4/12. Sign installed 4/15. Job complete.', type: 'general', createdAt: '2026-04-15T16:00:00Z', createdBy: 'J. Scara' },
    ],
    photos: [],
    createdAt: '2026-02-10T09:00:00Z', updatedAt: '2026-04-15T16:00:00Z',
  },
];

// ── Blank form ─────────────────────────────────────────────────────────────
const blankForm = () => ({
  clientName: '', address: '', signType: SIGN_TYPES[0], jurisdiction: JURISDICTIONS[0],
  status: 'Not Started', submittedDate: '', approvedDate: '', rejectionReason: '',
  installDate: '', targetDate: '', assignedTo: '', permitNumber: '',
  shoppingCenterName: '', propertyManager: '', propertyManagerPhone: '',
  colorRestrictions: '', fontRestrictions: '', illuminationRestrictions: '',
  timeclockRequiredLandlord: false, photocellRequiredLandlord: false, landlordNotes: '',
  timeclockRequired: false, photocellRequired: false,
});

// ── Main Component ─────────────────────────────────────────────────────────
export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState('All');
  const [jFilter, setJFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Record<string, string>>({});
  const [newNote, setNewNote] = useState<Record<string, string>>({});
  const [form, setForm] = useState(blankForm());
  const [modalTab, setModalTab] = useState<'details' | 'property'>('details');
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoType, setPhotoType] = useState('survey_existing');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('scp_jobs_v2');
      setJobs(saved ? JSON.parse(saved) : SAMPLE_JOBS);
    } catch { setJobs(SAMPLE_JOBS); }
  }, []);

  function save(updated: Job[]) {
    setJobs(updated);
    try { localStorage.setItem('scp_jobs_v2', JSON.stringify(updated)); } catch {}
  }

  function openNew() {
    setEditJob(null);
    setForm(blankForm());
    setModalTab('details');
    setShowModal(true);
  }

  function openEdit(job: Job) {
    setEditJob(job);
    setForm({
      clientName: job.clientName, address: job.address, signType: job.signType,
      jurisdiction: job.jurisdiction, status: job.status, submittedDate: job.submittedDate,
      approvedDate: job.approvedDate, rejectionReason: job.rejectionReason,
      installDate: job.installDate, targetDate: job.targetDate, assignedTo: job.assignedTo,
      permitNumber: job.permitNumber, shoppingCenterName: job.shoppingCenterName,
      propertyManager: job.propertyManager, propertyManagerPhone: job.propertyManagerPhone,
      colorRestrictions: job.colorRestrictions, fontRestrictions: job.fontRestrictions,
      illuminationRestrictions: job.illuminationRestrictions,
      timeclockRequiredLandlord: job.timeclockRequiredLandlord,
      photocellRequiredLandlord: job.photocellRequiredLandlord,
      landlordNotes: job.landlordNotes,
      timeclockRequired: job.timeclockRequired, photocellRequired: job.photocellRequired,
    });
    setModalTab('details');
    setShowModal(true);
  }

  function submitForm() {
    if (!form.clientName || !form.address) return;
    const now = new Date().toISOString();
    if (editJob) {
      save(jobs.map(j => j.id === editJob.id ? { ...j, ...form, updatedAt: now } : j));
    } else {
      const newJob: Job = {
        id: generateId(), ...form,
        docs: DEFAULT_DOCS.map(label => ({ label, done: false })),
        notes: [], photos: [], createdAt: now, updatedAt: now,
      };
      save([newJob, ...jobs]);
    }
    setShowModal(false);
  }

  function deleteJob(id: string) {
    if (confirm('Delete this job? This cannot be undone.')) save(jobs.filter(j => j.id !== id));
  }

  function toggleDoc(jobId: string, idx: number) {
    save(jobs.map(j => j.id === jobId
      ? { ...j, docs: j.docs.map((d, i) => i === idx ? { ...d, done: !d.done } : d), updatedAt: new Date().toISOString() }
      : j));
  }

  function addDoc(jobId: string, label: string) {
    if (!label.trim()) return;
    save(jobs.map(j => j.id === jobId
      ? { ...j, docs: [...j.docs, { label: label.trim(), done: false }], updatedAt: new Date().toISOString() }
      : j));
  }

  function addNote(jobId: string, text: string, type = 'general') {
    if (!text.trim()) return;
    const note: NoteEntry = { id: generateId(), text: text.trim(), type, createdAt: new Date().toISOString(), createdBy: 'J. Scara' };
    save(jobs.map(j => j.id === jobId ? { ...j, notes: [...(j.notes || []), note], updatedAt: new Date().toISOString() } : j));
    setNewNote(prev => ({ ...prev, [jobId]: '' }));
  }

  function updateStatus(jobId: string, status: string) {
    save(jobs.map(j => j.id === jobId ? { ...j, status, updatedAt: new Date().toISOString() } : j));
  }

  // Photo upload — uses FileReader for demo, will swap for Supabase Storage
  function handlePhotoUpload(jobId: string, file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      const photo: PhotoEntry = {
        id: generateId(), url, type: photoType,
        caption: photoCaption, takenAt: new Date().toISOString(),
      };
      save(jobs.map(j => j.id === jobId ? { ...j, photos: [...(j.photos || []), photo], updatedAt: new Date().toISOString() } : j));
      setPhotoCaption('');
      setUploadingFor(null);
    };
    reader.readAsDataURL(file);
  }

  function deletePhoto(jobId: string, photoId: string) {
    save(jobs.map(j => j.id === jobId ? { ...j, photos: j.photos.filter(p => p.id !== photoId), updatedAt: new Date().toISOString() } : j));
  }

  // Filters
  const allJurisdictions = ['All', ...Array.from(new Set(jobs.map(j => j.jurisdiction)))];
  const statusCounts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: jobs.filter(j => j.status === s).length }), {} as Record<string, number>);

  const filtered = jobs.filter(j => {
    const sMatch = filter === 'All' || j.status === filter;
    const jMatch = jFilter === 'All' || j.jurisdiction === jFilter;
    const q = search.toLowerCase();
    const searchMatch = !q || [j.clientName, j.address, j.jurisdiction, j.shoppingCenterName, j.permitNumber].join(' ').toLowerCase().includes(q);
    return sMatch && jMatch && searchMatch;
  });

  const getTab = (id: string) => activeTab[id] || 'docs';

  return (
    <main style={{ fontFamily: "'DM Sans', 'Segoe UI', Arial, sans-serif", background: '#FAFBFD', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        * { box-sizing: border-box; }
        @keyframes glow { 0%,100%{opacity:.45} 50%{opacity:.75} }
      `}</style>

      {/* NAV */}
      <nav style={{ background: 'rgba(250,251,253,0.94)', borderBottom: '1px solid rgba(0,0,0,0.07)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(14px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', maxWidth: '1200px', margin: '0 auto', height: '62px' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none' }}>
            <svg width="28" height="28" viewBox="0 0 80 80"><rect width="80" height="80" rx="14" fill="#185FA5"/><rect x="10" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="10" y="46" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="46" width="24" height="24" rx="5" fill="#fff"/><path d="M50 60l4 4 8-9" stroke="#185FA5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#0D1B2A', letterSpacing: '-.2px' }}>Sign<span style={{ color: '#185FA5' }}>Code</span> Pro</span>
          </a>
          <div style={{ display: 'flex', gap: '32px' }}>
            <a href="/lookup" style={{ fontSize: '13px', color: '#5A6B7A', textDecoration: 'none', fontWeight: '500' }}>Lookup</a>
            <a href="/jobs" style={{ fontSize: '13px', color: '#185FA5', textDecoration: 'none', fontWeight: '600' }}>Jobs</a>
            <a href="/waitlist" style={{ fontSize: '13px', color: '#5A6B7A', textDecoration: 'none', fontWeight: '500' }}>Waitlist</a>
          </div>
          <a href="/waitlist" style={{ padding: '8px 20px', background: '#185FA5', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: '600', textDecoration: 'none', boxShadow: '0 2px 8px rgba(24,95,165,.28)' }}>Join waitlist</a>
        </div>
      </nav>

      {/* HERO — dark section matching homepage */}
      <section style={{ background: '#0D1B2A', padding: '56px 48px 64px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '400px', background: 'radial-gradient(ellipse at center, rgba(24,95,165,0.12) 0%, transparent 65%)', pointerEvents: 'none', animation: 'glow 6s ease-in-out infinite' }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '5px 14px', background: 'rgba(24,95,165,0.3)', color: '#85B7EB', fontSize: '12px', fontWeight: '600', borderRadius: '20px', marginBottom: '16px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#85B7EB' }} />
                Permit Job Tracker
              </div>
              <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#fff', letterSpacing: '-1px', marginBottom: '8px', lineHeight: 1.1 }}>Permit Jobs</h1>
              <p style={{ fontSize: '15px', color: '#85B7EB', lineHeight: 1.6 }}>Track every job from survey to install. Photos, docs, landlord notes — all in one place.</p>
            </div>
            <button onClick={openNew} style={{ padding: '12px 24px', background: '#185FA5', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(24,95,165,.4)', alignSelf: 'flex-end' }}>+ New Job</button>
          </div>

          {/* Stats band */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0', marginTop: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            {[
              { label: 'Active jobs', value: jobs.filter(j => !['Completed', 'Rejected'].includes(j.status)).length, color: '#85B7EB' },
              { label: 'Under review', value: (statusCounts['Submitted'] || 0) + (statusCounts['Under Review'] || 0), color: '#FACC15' },
              { label: 'Approved', value: (statusCounts['Approved'] || 0) + (statusCounts['Completed'] || 0) + (statusCounts['Installed'] || 0), color: '#4ADE80' },
              { label: 'Rejected', value: statusCounts['Rejected'] || 0, color: '#F87171' },
            ].map(({ label, value, color }, i) => (
              <div key={label} style={{ padding: '20px 24px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: '800', color, letterSpacing: '-1px', lineHeight: 1, marginBottom: '6px' }}>{value}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: '500' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHITE CONTENT SECTION */}
      <section style={{ padding: '40px 48px 80px', maxWidth: '1100px', margin: '0 auto' }}>

        {/* Search + filters */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search jobs, addresses, shopping centers, permit #..."
            style={{ ...inp, flex: '1', minWidth: '220px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
          />
        </div>

        {/* Status filters */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
          {['All', ...STATUSES].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '20px', border: '0.5px solid', borderColor: filter === s ? '#185FA5' : '#E2E8F0', background: filter === s ? '#185FA5' : '#fff', color: filter === s ? '#fff' : '#5A6B7A', cursor: 'pointer', fontFamily: 'inherit' }}>{s}</button>
          ))}
        </div>

        {/* Jurisdiction filters */}
        {allJurisdictions.length > 2 && (
          <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {allJurisdictions.map(j => (
              <button key={j} onClick={() => setJFilter(j)} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '20px', border: '0.5px solid', borderColor: jFilter === j ? '#0D1B2A' : '#E2E8F0', background: jFilter === j ? '#0D1B2A' : '#fff', color: jFilter === j ? '#fff' : '#9BA8B4', cursor: 'pointer', fontFamily: 'inherit' }}>{j}</button>
            ))}
          </div>
        )}

        {/* Job cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px', color: '#9BA8B4', fontSize: '14px', background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              No jobs match the current filters.
            </div>
          )}
          {filtered.map(job => {
            const expanded = expandedId === job.id;
            const doneDocs = job.docs.filter(d => d.done).length;
            const tab = getTab(job.id);
            const hasLandlordInfo = job.shoppingCenterName || job.colorRestrictions || job.fontRestrictions || job.illuminationRestrictions || job.timeclockRequiredLandlord || job.photocellRequiredLandlord || job.landlordNotes;

            return (
              <div key={job.id} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>

                {/* Card header */}
                <div style={{ padding: '18px 22px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#0D1B2A', marginBottom: '3px' }}>{job.clientName}</div>
                      <div style={{ fontSize: '12px', color: '#9BA8B4' }}>
                        {job.address} · {job.jurisdiction}
                        {job.shoppingCenterName && <span style={{ color: '#185FA5' }}> · {job.shoppingCenterName}</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0, marginLeft: '12px' }}>
                      <Badge status={job.status} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '8px', marginBottom: '12px' }}>
                    {[
                      { label: 'Sign type', value: job.signType },
                      { label: 'Target date', value: job.targetDate ? new Date(job.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—' },
                      { label: 'Permit #', value: job.permitNumber || '—' },
                      { label: 'Assigned to', value: job.assignedTo || '—' },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div style={{ fontSize: '10px', color: '#9BA8B4', marginBottom: '2px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</div>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: '#0D1B2A' }}>{value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Timeclock / photocell badges */}
                  {(job.timeclockRequired || job.photocellRequired || job.timeclockRequiredLandlord || job.photocellRequiredLandlord) && (
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      {job.timeclockRequired && <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: '#FEF3C7', color: '#92400E', fontWeight: '600' }}>⏰ Timeclock required (city)</span>}
                      {job.photocellRequired && <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: '#FEF3C7', color: '#92400E', fontWeight: '600' }}>💡 Photocell required (city)</span>}
                      {job.timeclockRequiredLandlord && <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: '#EFF6FF', color: '#1D4ED8', fontWeight: '600' }}>⏰ Timeclock required (landlord)</span>}
                      {job.photocellRequiredLandlord && <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: '#EFF6FF', color: '#1D4ED8', fontWeight: '600' }}>💡 Photocell required (landlord)</span>}
                    </div>
                  )}

                  {/* Rejection reason */}
                  {job.status === 'Rejected' && job.rejectionReason && (
                    <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 14px', marginBottom: '10px', fontSize: '12px', color: '#B91C1C' }}>
                      <strong>Rejection reason:</strong> {job.rejectionReason}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '11px', color: '#9BA8B4' }}>Docs: {doneDocs}/{job.docs.length} · Photos: {(job.photos || []).length} · Notes: {(job.notes || []).length}</div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => setExpandedId(expanded ? null : job.id)} style={{ fontSize: '11px', padding: '5px 12px', border: '0.5px solid #E2E8F0', borderRadius: '7px', background: expanded ? '#F4F7FA' : '#fff', color: '#5A6B7A', cursor: 'pointer', fontFamily: 'inherit' }}>{expanded ? 'Collapse' : 'Expand'}</button>
                      <button onClick={() => openEdit(job)} style={{ fontSize: '11px', padding: '5px 12px', border: '0.5px solid #E2E8F0', borderRadius: '7px', background: '#fff', color: '#5A6B7A', cursor: 'pointer', fontFamily: 'inherit' }}>Edit</button>
                      <button onClick={() => deleteJob(job.id)} style={{ fontSize: '11px', padding: '5px 12px', border: '0.5px solid #FECACA', borderRadius: '7px', background: '#fff', color: '#B91C1C', cursor: 'pointer', fontFamily: 'inherit' }}>Delete</button>
                    </div>
                  </div>
                  <ProgressBar docs={job.docs} />
                </div>

                {/* Expanded panel */}
                {expanded && (
                  <div style={{ borderTop: '1px solid #E2E8F0' }}>
                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid #E2E8F0', background: '#F4F7FA' }}>
                      {[
                        { key: 'docs', label: `Docs (${doneDocs}/${job.docs.length})` },
                        { key: 'notes', label: `Notes (${(job.notes || []).length})` },
                        { key: 'photos', label: `Photos (${(job.photos || []).length})` },
                        { key: 'property', label: hasLandlordInfo ? '🏢 Property Info ●' : '🏢 Property Info' },
                        { key: 'status', label: 'Status' },
                      ].map(t => (
                        <button key={t.key} onClick={() => setActiveTab(prev => ({ ...prev, [job.id]: t.key }))}
                          style={{ padding: '10px 16px', fontSize: '12px', fontWeight: tab === t.key ? '700' : '500', background: tab === t.key ? '#fff' : 'transparent', color: tab === t.key ? '#185FA5' : '#5A6B7A', border: 'none', borderBottom: tab === t.key ? '2px solid #185FA5' : '2px solid transparent', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                          {t.label}
                        </button>
                      ))}
                    </div>

                    <div style={{ padding: '20px 22px', background: '#fff' }}>

                      {/* DOCS TAB */}
                      {tab === 'docs' && (
                        <div>
                          <div style={sectionLabel}>Document Checklist</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {job.docs.map((doc, idx) => (
                              <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '9px', cursor: 'pointer', fontSize: '13px', padding: '6px 0', borderBottom: '1px solid #F4F7FA' }}>
                                <input type="checkbox" checked={doc.done} onChange={() => toggleDoc(job.id, idx)} style={{ accentColor: '#185FA5', width: '14px', height: '14px', flexShrink: 0 }} />
                                <span style={{ textDecoration: doc.done ? 'line-through' : 'none', color: doc.done ? '#9BA8B4' : '#0D1B2A' }}>{doc.label}</span>
                                {doc.done && <span style={{ fontSize: '10px', color: '#3B6D11', fontWeight: '600', marginLeft: 'auto' }}>✓</span>}
                              </label>
                            ))}
                          </div>
                          <AddDocRow onAdd={label => addDoc(job.id, label)} />
                        </div>
                      )}

                      {/* NOTES TAB */}
                      {tab === 'notes' && (
                        <div>
                          <div style={sectionLabel}>Notes Log</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                            {(job.notes || []).length === 0 && <div style={{ fontSize: '13px', color: '#9BA8B4' }}>No notes yet.</div>}
                            {(job.notes || []).map(note => (
                              <div key={note.id} style={{ background: note.type === 'rejection_note' ? '#FEF2F2' : note.type === 'field_note' ? '#EFF6FF' : '#F4F7FA', borderRadius: '8px', padding: '10px 14px', border: `1px solid ${note.type === 'rejection_note' ? '#FECACA' : note.type === 'field_note' ? '#BFDBFE' : '#E2E8F0'}` }}>
                                <div style={{ fontSize: '13px', color: '#0D1B2A', lineHeight: '1.5', marginBottom: '6px' }}>{note.text}</div>
                                <div style={{ display: 'flex', gap: '8px', fontSize: '10px', color: '#9BA8B4' }}>
                                  <span>{note.createdBy}</span>
                                  <span>·</span>
                                  <span>{new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                                  <span>·</span>
                                  <span style={{ textTransform: 'capitalize' }}>{note.type.replace('_', ' ')}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <textarea
                              value={newNote[job.id] || ''}
                              onChange={e => setNewNote(prev => ({ ...prev, [job.id]: e.target.value }))}
                              placeholder="Add a note — call log, inspector feedback, status update..."
                              rows={2}
                              style={{ flex: 1, ...inp, resize: 'vertical' }}
                            />
                            <button onClick={() => addNote(job.id, newNote[job.id] || '')}
                              style={{ padding: '8px 16px', background: '#185FA5', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', alignSelf: 'flex-end' }}>
                              Add
                            </button>
                          </div>
                        </div>
                      )}

                      {/* PHOTOS TAB */}
                      {tab === 'photos' && (
                        <div>
                          <div style={sectionLabel}>Job Photos</div>

                          {/* Upload area */}
                          {uploadingFor === job.id ? (
                            <div style={{ background: '#F4F7FA', borderRadius: '10px', padding: '16px', marginBottom: '16px', border: '1px solid #E2E8F0' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                <div>
                                  <div style={{ fontSize: '11px', color: '#5A6B7A', marginBottom: '4px', fontWeight: '600' }}>Photo type</div>
                                  <select value={photoType} onChange={e => setPhotoType(e.target.value)} style={inp}>
                                    {PHOTO_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                  </select>
                                </div>
                                <div>
                                  <div style={{ fontSize: '11px', color: '#5A6B7A', marginBottom: '4px', fontWeight: '600' }}>Caption (optional)</div>
                                  <input value={photoCaption} onChange={e => setPhotoCaption(e.target.value)} placeholder="What does this show?" style={inp} />
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => fileRef.current?.click()}
                                  style={{ padding: '9px 18px', background: '#185FA5', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                                  Choose Photo
                                </button>
                                <button onClick={() => setUploadingFor(null)}
                                  style={{ padding: '9px 18px', background: '#fff', color: '#5A6B7A', border: '0.5px solid #E2E8F0', borderRadius: '7px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
                                  Cancel
                                </button>
                              </div>
                              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                                onChange={e => { if (e.target.files?.[0]) handlePhotoUpload(job.id, e.target.files[0]); e.target.value = ''; }} />
                            </div>
                          ) : (
                            <button onClick={() => setUploadingFor(job.id)}
                              style={{ padding: '9px 18px', background: '#fff', color: '#185FA5', border: '1px solid #BFDBFE', borderRadius: '7px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '16px' }}>
                              + Upload Photo
                            </button>
                          )}

                          {/* Photo grid */}
                          {(job.photos || []).length === 0 && uploadingFor !== job.id && (
                            <div style={{ fontSize: '13px', color: '#9BA8B4' }}>No photos yet. Upload survey photos, approved drawings, or install photos.</div>
                          )}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
                            {(job.photos || []).map(photo => (
                              <div key={photo.id} style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #E2E8F0', background: '#F4F7FA' }}>
                                <img src={photo.url} alt={photo.caption || photo.type} style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }} />
                                <div style={{ padding: '8px 10px' }}>
                                  <div style={{ fontSize: '10px', fontWeight: '700', color: '#185FA5', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                                    {PHOTO_TYPES.find(t => t.value === photo.type)?.label || photo.type}
                                  </div>
                                  {photo.caption && <div style={{ fontSize: '11px', color: '#5A6B7A', marginBottom: '4px' }}>{photo.caption}</div>}
                                  <button onClick={() => deletePhoto(job.id, photo.id)}
                                    style={{ fontSize: '10px', color: '#B91C1C', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* PROPERTY INFO TAB */}
                      {tab === 'property' && (
                        <div>
                          <div style={sectionLabel}>Property & Landlord Info</div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                            {[
                              { label: 'Shopping Center / Plaza', value: job.shoppingCenterName },
                              { label: 'Property Manager', value: job.propertyManager },
                              { label: 'PM Phone', value: job.propertyManagerPhone },
                            ].map(({ label, value }) => (
                              <div key={label}>
                                <div style={{ fontSize: '10px', fontWeight: '700', color: '#9BA8B4', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '4px' }}>{label}</div>
                                <div style={{ fontSize: '13px', color: value ? '#0D1B2A' : '#D3D1C7', fontWeight: value ? '500' : '400' }}>{value || 'Not set'}</div>
                              </div>
                            ))}
                          </div>

                          <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '10px', padding: '14px 16px', marginBottom: '16px' }}>
                            <div style={{ fontSize: '11px', fontWeight: '700', color: '#92400E', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '10px' }}>⚠ Landlord / Center Requirements</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                              {[
                                { label: 'Color restrictions', value: job.colorRestrictions },
                                { label: 'Font restrictions', value: job.fontRestrictions },
                                { label: 'Illumination restrictions', value: job.illuminationRestrictions },
                              ].map(({ label, value }) => (
                                <div key={label}>
                                  <div style={{ fontSize: '10px', fontWeight: '700', color: '#92400E', marginBottom: '3px' }}>{label}</div>
                                  <div style={{ fontSize: '13px', color: value ? '#78350F' : '#D97706', fontStyle: value ? 'normal' : 'italic' }}>{value || 'None specified'}</div>
                                </div>
                              ))}
                              <div>
                                <div style={{ fontSize: '10px', fontWeight: '700', color: '#92400E', marginBottom: '3px' }}>Timeclock (landlord)</div>
                                <div style={{ fontSize: '13px', color: job.timeclockRequiredLandlord ? '#78350F' : '#D97706' }}>{job.timeclockRequiredLandlord ? '✓ Required' : 'Not required'}</div>
                              </div>
                              <div>
                                <div style={{ fontSize: '10px', fontWeight: '700', color: '#92400E', marginBottom: '3px' }}>Photocell (landlord)</div>
                                <div style={{ fontSize: '13px', color: job.photocellRequiredLandlord ? '#78350F' : '#D97706' }}>{job.photocellRequiredLandlord ? '✓ Required' : 'Not required'}</div>
                              </div>
                            </div>
                            {job.landlordNotes && (
                              <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #FCD34D' }}>
                                <div style={{ fontSize: '10px', fontWeight: '700', color: '#92400E', marginBottom: '4px' }}>Additional landlord notes</div>
                                <div style={{ fontSize: '13px', color: '#78350F', lineHeight: '1.5' }}>{job.landlordNotes}</div>
                              </div>
                            )}
                          </div>

                          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '14px 16px' }}>
                            <div style={{ fontSize: '11px', fontWeight: '700', color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '8px' }}>City Requirements</div>
                            <div style={{ display: 'flex', gap: '16px' }}>
                              <div style={{ fontSize: '13px', color: '#1D4ED8' }}>Timeclock: <strong>{job.timeclockRequired ? '✓ Required' : 'Not required'}</strong></div>
                              <div style={{ fontSize: '13px', color: '#1D4ED8' }}>Photocell: <strong>{job.photocellRequired ? '✓ Required' : 'Not required'}</strong></div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* STATUS TAB */}
                      {tab === 'status' && (
                        <div>
                          <div style={sectionLabel}>Update Status</div>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                            {STATUSES.map(s => (
                              <button key={s} onClick={() => updateStatus(job.id, s)}
                                style={{ fontSize: '12px', padding: '6px 14px', borderRadius: '20px', border: '1px solid', borderColor: job.status === s ? '#185FA5' : '#E2E8F0', background: job.status === s ? '#185FA5' : '#fff', color: job.status === s ? '#fff' : '#5A6B7A', cursor: 'pointer', fontFamily: 'inherit', fontWeight: job.status === s ? '700' : '400' }}>
                                {s}
                              </button>
                            ))}
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {[
                              { label: 'Created', value: new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
                              { label: 'Last updated', value: new Date(job.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
                              { label: 'Submitted', value: job.submittedDate ? new Date(job.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—' },
                              { label: 'Approved', value: job.approvedDate ? new Date(job.approvedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—' },
                              { label: 'Install date', value: job.installDate ? new Date(job.installDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—' },
                              { label: 'Permit number', value: job.permitNumber || '—' },
                            ].map(({ label, value }) => (
                              <div key={label}>
                                <div style={{ fontSize: '10px', fontWeight: '700', color: '#9BA8B4', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '4px' }}>{label}</div>
                                <div style={{ fontSize: '13px', color: '#0D1B2A', fontWeight: '500' }}>{value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA — exact copy from homepage */}
      <section style={{ padding: '80px 48px', background: 'linear-gradient(135deg,#0D1B2A 0%,#185FA5 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: .04, backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '520px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#fff', marginBottom: '14px', letterSpacing: '-.5px', lineHeight: '1.18' }}>A better starting point<br />for every permit job</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,.65)', marginBottom: '32px', lineHeight: '1.7' }}>Join sign professionals already on the waitlist. Be first when we launch.</p>
          <a href="/waitlist" style={{ display: 'inline-block', padding: '13px 28px', background: '#fff', color: '#185FA5', borderRadius: '9px', fontSize: '13px', fontWeight: '700', textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,0,0,.2)' }}>Join waitlist →</a>
        </div>
      </section>

      {/* FOOTER — exact copy from homepage */}
      <footer style={{ padding: '24px 48px', borderTop: '1px solid #E8EDF2', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 80 80"><rect width="80" height="80" rx="14" fill="#185FA5"/><rect x="10" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="10" y="46" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="46" width="24" height="24" rx="5" fill="#fff"/><path d="M50 60l4 4 8-9" stroke="#185FA5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#0D1B2A' }}>Sign<span style={{ color: '#185FA5' }}>Code</span> Pro</span>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            {[['Lookup tool', '/lookup'], ['Job tracker', '/jobs'], ['Waitlist', '/waitlist']].map(([l, h]) => (
              <a key={l} href={h} style={{ fontSize: '12px', color: '#9BA8B4', textDecoration: 'none', fontWeight: '500' }}>{l}</a>
            ))}
          </div>
          <div style={{ fontSize: '11px', color: '#B4B2A9' }}>© 2026 SignCode Pro. All rights reserved.</div>
        </div>
      </footer>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '600px', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 28px', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
              <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#0D1B2A', margin: 0 }}>{editJob ? 'Edit job' : 'New permit job'}</h2>
              <button onClick={() => setShowModal(false)} style={{ fontSize: '22px', background: 'none', border: 'none', cursor: 'pointer', color: '#9BA8B4', lineHeight: 1, padding: '0 4px' }}>×</button>
            </div>

            {/* Modal tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', background: '#F4F7FA' }}>
              {[{ key: 'details', label: 'Job Details' }, { key: 'property', label: '🏢 Property & Landlord' }].map(t => (
                <button key={t.key} onClick={() => setModalTab(t.key as 'details' | 'property')}
                  style={{ padding: '12px 20px', fontSize: '13px', fontWeight: modalTab === t.key ? '700' : '500', background: modalTab === t.key ? '#fff' : 'transparent', color: modalTab === t.key ? '#185FA5' : '#5A6B7A', border: 'none', borderBottom: modalTab === t.key ? '2px solid #185FA5' : '2px solid transparent', cursor: 'pointer', fontFamily: 'inherit' }}>
                  {t.label}
                </button>
              ))}
            </div>

            <div style={{ padding: '24px 28px' }}>
              {modalTab === 'details' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#5A6B7A', display: 'block', marginBottom: '5px', fontWeight: '600' }}>Client / job name *</label>
                    <input style={inp} value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} placeholder="e.g. Publix #2241 — Pylon Sign" />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#5A6B7A', display: 'block', marginBottom: '5px', fontWeight: '600' }}>Job address *</label>
                    <input style={inp} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="e.g. 7800 W Sunrise Blvd, Plantation, FL" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: '#5A6B7A', display: 'block', marginBottom: '5px', fontWeight: '600' }}>Sign type</label>
                      <select style={inp} value={form.signType} onChange={e => setForm({ ...form, signType: e.target.value })}>
                        {SIGN_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#5A6B7A', display: 'block', marginBottom: '5px', fontWeight: '600' }}>Jurisdiction</label>
                      <select style={inp} value={form.jurisdiction} onChange={e => setForm({ ...form, jurisdiction: e.target.value })}>
                        {JURISDICTIONS.map(j => <option key={j}>{j}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: '#5A6B7A', display: 'block', marginBottom: '5px', fontWeight: '600' }}>Status</label>
                      <select style={inp} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#5A6B7A', display: 'block', marginBottom: '5px', fontWeight: '600' }}>Assigned to</label>
                      <input style={inp} value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })} placeholder="Name" />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: '#5A6B7A', display: 'block', marginBottom: '5px', fontWeight: '600' }}>Submitted date</label>
                      <input type="date" style={inp} value={form.submittedDate} onChange={e => setForm({ ...form, submittedDate: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#5A6B7A', display: 'block', marginBottom: '5px', fontWeight: '600' }}>Target / due date</label>
                      <input type="date" style={inp} value={form.targetDate} onChange={e => setForm({ ...form, targetDate: e.target.value })} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: '#5A6B7A', display: 'block', marginBottom: '5px', fontWeight: '600' }}>Approved date</label>
                      <input type="date" style={inp} value={form.approvedDate} onChange={e => setForm({ ...form, approvedDate: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#5A6B7A', display: 'block', marginBottom: '5px', fontWeight: '600' }}>Install date</label>
                      <input type="date" style={inp} value={form.installDate} onChange={e => setForm({ ...form, installDate: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#5A6B7A', display: 'block', marginBottom: '5px', fontWeight: '600' }}>Permit number</label>
                    <input style={inp} value={form.permitNumber} onChange={e => setForm({ ...form, permitNumber: e.target.value })} placeholder="e.g. BRO-2026-04821" />
                  </div>
                  {form.status === 'Rejected' && (
                    <div>
                      <label style={{ fontSize: '12px', color: '#B91C1C', display: 'block', marginBottom: '5px', fontWeight: '600' }}>Rejection reason</label>
                      <textarea style={{ ...inp, resize: 'vertical', fontFamily: 'inherit' }} rows={2} value={form.rejectionReason} onChange={e => setForm({ ...form, rejectionReason: e.target.value })} placeholder="What was the reason for rejection?" />
                    </div>
                  )}
                  <div style={{ background: '#F4F7FA', borderRadius: '10px', padding: '14px 16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#5A6B7A', marginBottom: '10px' }}>Illumination Controls (City Requirements)</div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={form.timeclockRequired} onChange={e => setForm({ ...form, timeclockRequired: e.target.checked })} style={{ accentColor: '#185FA5', width: '14px', height: '14px' }} />
                        Timeclock required
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={form.photocellRequired} onChange={e => setForm({ ...form, photocellRequired: e.target.checked })} style={{ accentColor: '#185FA5', width: '14px', height: '14px' }} />
                        Photocell required
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {modalTab === 'property' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#5A6B7A', display: 'block', marginBottom: '5px', fontWeight: '600' }}>Shopping center / plaza name</label>
                    <input style={inp} value={form.shoppingCenterName} onChange={e => setForm({ ...form, shoppingCenterName: e.target.value })} placeholder="e.g. Plantation Promenade" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: '#5A6B7A', display: 'block', marginBottom: '5px', fontWeight: '600' }}>Property manager name</label>
                      <input style={inp} value={form.propertyManager} onChange={e => setForm({ ...form, propertyManager: e.target.value })} placeholder="Name or company" />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#5A6B7A', display: 'block', marginBottom: '5px', fontWeight: '600' }}>Property manager phone</label>
                      <input style={inp} value={form.propertyManagerPhone} onChange={e => setForm({ ...form, propertyManagerPhone: e.target.value })} placeholder="(954) 555-0100" />
                    </div>
                  </div>
                  <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#92400E', marginBottom: '12px' }}>⚠ Landlord / Center Requirements</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '12px', color: '#92400E', display: 'block', marginBottom: '5px', fontWeight: '600' }}>Color restrictions</label>
                        <input style={inp} value={form.colorRestrictions} onChange={e => setForm({ ...form, colorRestrictions: e.target.value })} placeholder="e.g. Red letters only — PMS 485, no other colors" />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#92400E', display: 'block', marginBottom: '5px', fontWeight: '600' }}>Font restrictions</label>
                        <input style={inp} value={form.fontRestrictions} onChange={e => setForm({ ...form, fontRestrictions: e.target.value })} placeholder="e.g. Helvetica Neue Bold only, no script fonts" />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#92400E', display: 'block', marginBottom: '5px', fontWeight: '600' }}>Illumination restrictions</label>
                        <input style={inp} value={form.illuminationRestrictions} onChange={e => setForm({ ...form, illuminationRestrictions: e.target.value })} placeholder="e.g. Front lit only, no halo or open face neon" />
                      </div>
                      <div style={{ display: 'flex', gap: '20px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', color: '#92400E' }}>
                          <input type="checkbox" checked={form.timeclockRequiredLandlord} onChange={e => setForm({ ...form, timeclockRequiredLandlord: e.target.checked })} style={{ accentColor: '#B45309', width: '14px', height: '14px' }} />
                          Timeclock required by landlord
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', color: '#92400E' }}>
                          <input type="checkbox" checked={form.photocellRequiredLandlord} onChange={e => setForm({ ...form, photocellRequiredLandlord: e.target.checked })} style={{ accentColor: '#B45309', width: '14px', height: '14px' }} />
                          Photocell required by landlord
                        </label>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#92400E', display: 'block', marginBottom: '5px', fontWeight: '600' }}>Additional landlord notes</label>
                        <textarea style={{ ...inp, resize: 'vertical', fontFamily: 'inherit' }} rows={3} value={form.landlordNotes} onChange={e => setForm({ ...form, landlordNotes: e.target.value })} placeholder="Any other landlord or property management requirements not covered above..." />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', padding: '16px 28px 24px', justifyContent: 'flex-end', borderTop: '1px solid #E2E8F0' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', border: '0.5px solid #E2E8F0', borderRadius: '8px', background: '#fff', fontSize: '13px', cursor: 'pointer', color: '#5A6B7A', fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={submitForm} style={{ padding: '10px 22px', background: '#185FA5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(24,95,165,.3)' }}>
                {editJob ? 'Save changes' : 'Create job'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
