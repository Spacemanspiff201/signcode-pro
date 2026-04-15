'use client';
import { useState, useEffect } from 'react';

const SIGN_TYPES = ['Wall / Channel Letters', 'Monument', 'Pylon / Pole', 'EMC / Digital', 'Awning', 'Projecting', 'Roof', 'Temporary / Banner'];
const JURISDICTIONS = ['Miami-Dade County', 'Broward County', 'Palm Beach County', 'City of Fort Lauderdale', 'City of Pompano Beach', 'City of Boca Raton', 'City of Miami Beach', 'City of Orlando', 'City of Tampa', 'Hillsborough County', 'Other'];
const STATUSES = ['Not Started', 'In Progress', 'Submitted', 'Under Review', 'Approved', 'Rejected'];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  'Not Started': { bg: '#F1EFE8', text: '#444441' },
  'In Progress': { bg: '#E6F1FB', text: '#0C447C' },
  'Submitted': { bg: '#FAEEDA', text: '#633806' },
  'Under Review': { bg: '#FAEEDA', text: '#633806' },
  'Approved': { bg: '#EAF3DE', text: '#27500A' },
  'Rejected': { bg: '#FCEBEB', text: '#791F1F' },
};

interface DocItem { label: string; done: boolean; }
interface Job {
  id: string; clientName: string; address: string; signType: string;
  jurisdiction: string; status: string; submittedDate: string;
  targetDate: string; assignedTo: string; notes: string;
  docs: DocItem[]; createdAt: string; updatedAt: string;
}

const SAMPLE_JOBS: Job[] = [
  {
    id: 'sample-1', clientName: 'Publix #2241 — Pylon Sign',
    address: '7800 W Sunrise Blvd, Plantation, FL', signType: 'Pylon / Pole',
    jurisdiction: 'Broward County', status: 'Under Review',
    submittedDate: '2026-03-28', targetDate: '2026-04-25', assignedTo: 'J. Scara',
    notes: 'Called Maria at zoning 4/9 — said engineer seal still needed before they can finalize.',
    docs: [
      { label: 'Permit application', done: true },
      { label: 'Site plan with dimensions to property lines', done: true },
      { label: 'Sign construction drawings', done: true },
      { label: 'Wind load calculations (Florida Building Code)', done: true },
      { label: 'Electrical permit if illuminated', done: true },
      { label: 'Property owner authorization', done: true },
      { label: 'Engineer-sealed calculations', done: false },
      { label: 'Business tax receipt', done: false },
    ],
    createdAt: '2026-03-20T10:00:00Z', updatedAt: '2026-04-09T14:00:00Z',
  },
  {
    id: 'sample-2', clientName: 'AutoNation — Monument Sign',
    address: '200 NW 136th Ave, Miami, FL', signType: 'Monument',
    jurisdiction: 'Miami-Dade County', status: 'Submitted',
    submittedDate: '2026-04-02', targetDate: '2026-05-14', assignedTo: 'J. Scara',
    notes: 'Complete package submitted. Miami-Dade processing window 4-8 weeks. Follow up Apr 16.',
    docs: [
      { label: 'Notarized application (owner + qualifier)', done: true },
      { label: 'Correct folio number and legal description', done: true },
      { label: 'Two sets of plans: office copy and job copy', done: true },
      { label: 'Facade dimensions and building elevation', done: true },
      { label: 'Engineer-sealed calculations (over 24 sq ft)', done: true },
      { label: 'ELEC.03 electrical permit application', done: true },
      { label: 'Certificate of Use', done: true },
      { label: 'Wind load calculations (Florida Building Code)', done: true },
      { label: 'Photo of proposed sign location', done: true },
      { label: 'Adjacent municipality approval', done: true },
    ],
    createdAt: '2026-03-28T09:00:00Z', updatedAt: '2026-04-02T16:00:00Z',
  },
  {
    id: 'sample-3', clientName: "Chick-fil-A — Wall Sign (Channel Letters)",
    address: '1401 N Federal Hwy, Pompano Beach, FL', signType: 'Wall / Channel Letters',
    jurisdiction: 'City of Pompano Beach', status: 'In Progress',
    submittedDate: '', targetDate: '2026-04-22', assignedTo: 'J. Scara',
    notes: '⚠ Confirm Master Sign Program status for this property before proceeding — Atlantic Blvd overlay may require AAC review.',
    docs: [
      { label: 'Sign code compliance permit application', done: true },
      { label: 'Business tax receipt', done: true },
      { label: 'Four (4) compiled sets of plans', done: false },
      { label: 'Facade dimensions and elevation', done: false },
      { label: 'Color rendering of sign proposal', done: false },
      { label: 'Floor plan showing separate public entrance (multi-tenant)', done: false },
      { label: 'Native vegetation and irrigation plan', done: false },
      { label: 'Master Sign Program confirmation', done: false },
    ],
    createdAt: '2026-04-10T08:00:00Z', updatedAt: '2026-04-10T08:00:00Z',
  },
  {
    id: 'sample-4', clientName: 'Walgreens — EMC Sign Replacement',
    address: '501 E Palmetto Park Rd, Boca Raton, FL', signType: 'EMC / Digital',
    jurisdiction: 'City of Boca Raton', status: 'Rejected',
    submittedDate: '2026-03-10', targetDate: '2026-04-28', assignedTo: 'J. Scara',
    notes: 'Boca design review board denied EMC in CG zone. Resubmitting as static illuminated sign. Design review scheduled Apr 28.',
    docs: [
      { label: 'Sign permit application', done: true },
      { label: 'Design review application', done: true },
      { label: 'Site plan with dimensions', done: true },
      { label: 'Sign construction drawings', done: true },
      { label: 'Color renderings', done: true },
      { label: 'Wind load calculations', done: true },
      { label: 'Electrical permit application', done: true },
      { label: 'Revised static sign design', done: false },
    ],
    createdAt: '2026-03-05T10:00:00Z', updatedAt: '2026-04-01T11:00:00Z',
  },
  {
    id: 'sample-5', clientName: 'Chase Bank — Monument Sign',
    address: '9999 Biscayne Blvd, Miami Shores, FL', signType: 'Monument',
    jurisdiction: 'Miami-Dade County', status: 'Approved',
    submittedDate: '2026-02-14', targetDate: '2026-03-30', assignedTo: 'J. Scara',
    notes: 'Approved 3/29. Shop inspection scheduled 4/15. Final inspection after install.',
    docs: [
      { label: 'Notarized application', done: true },
      { label: 'Two sets of plans', done: true },
      { label: 'Engineer-sealed calculations', done: true },
      { label: 'ELEC.03 electrical permit', done: true },
      { label: 'Certificate of Use', done: true },
      { label: 'Wind load calculations', done: true },
      { label: 'Photo of sign location', done: true },
      { label: 'Shop inspection', done: true },
    ],
    createdAt: '2026-02-10T09:00:00Z', updatedAt: '2026-03-29T15:00:00Z',
  },
];

function generateId() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

function Badge({ status }: { status: string }) {
  const colors = STATUS_COLORS[status] || { bg: '#F1EFE8', text: '#444441' };
  return <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '500', whiteSpace: 'nowrap', background: colors.bg, color: colors.text }}>{status}</span>;
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
      <input value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && val) { onAdd(val); setVal(''); } }} placeholder="Add document..." style={{ flex: 1, padding: '6px 10px', border: '0.5px solid #D3D1C7', borderRadius: '6px', fontSize: '12px', background: '#fff', color: '#0D1B2A', outline: 'none' }} />
      <button onClick={() => { if (val) { onAdd(val); setVal(''); } }} style={{ padding: '6px 12px', background: '#185FA5', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Add</button>
    </div>
  );
}

const DEFAULT_DOCS = [
  'Permit application',
  'Site plan with dimensions to property lines',
  'Sign construction drawings',
  'Wind load calculations (Florida Building Code)',
  'Electrical permit if illuminated',
  'Engineer-sealed calculations if required',
  'Property owner authorization',
  'Business tax receipt',
];

const inp = { padding: '8px 10px', borderRadius: '6px', border: '0.5px solid #D3D1C7', fontSize: '13px', width: '100%', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)', outline: 'none' };

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState('All');
  const [jFilter, setJFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    clientName: '', address: '', signType: SIGN_TYPES[0], jurisdiction: JURISDICTIONS[0],
    status: 'Not Started', submittedDate: '', targetDate: '', assignedTo: '', notes: '',
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('scp_jobs');
      if (saved) {
        setJobs(JSON.parse(saved));
      } else {
        setJobs(SAMPLE_JOBS);
        localStorage.setItem('scp_jobs', JSON.stringify(SAMPLE_JOBS));
      }
    } catch {
      setJobs(SAMPLE_JOBS);
    }
  }, []);

  function save(updated: Job[]) {
    setJobs(updated);
    try { localStorage.setItem('scp_jobs', JSON.stringify(updated)); } catch {}
  }

  function openNew() {
    setEditJob(null);
    setForm({ clientName: '', address: '', signType: SIGN_TYPES[0], jurisdiction: JURISDICTIONS[0], status: 'Not Started', submittedDate: '', targetDate: '', assignedTo: '', notes: '' });
    setShowModal(true);
  }

  function openEdit(job: Job) {
    setEditJob(job);
    setForm({ clientName: job.clientName, address: job.address, signType: job.signType, jurisdiction: job.jurisdiction, status: job.status, submittedDate: job.submittedDate, targetDate: job.targetDate, assignedTo: job.assignedTo, notes: job.notes });
    setShowModal(true);
  }

  function submitForm() {
    if (!form.clientName || !form.address) return;
    const now = new Date().toISOString();
    if (editJob) {
      save(jobs.map(j => j.id === editJob.id ? { ...j, ...form, updatedAt: now } : j));
    } else {
      const newJob: Job = { id: generateId(), ...form, docs: DEFAULT_DOCS.map(label => ({ label, done: false })), createdAt: now, updatedAt: now };
      save([newJob, ...jobs]);
    }
    setShowModal(false);
  }

  function deleteJob(id: string) {
    if (confirm('Delete this job?')) save(jobs.filter(j => j.id !== id));
  }

  function toggleDoc(jobId: string, idx: number) {
    save(jobs.map(j => j.id === jobId ? { ...j, docs: j.docs.map((d, i) => i === idx ? { ...d, done: !d.done } : d), updatedAt: new Date().toISOString() } : j));
  }

  function addDoc(jobId: string, label: string) {
    if (!label.trim()) return;
    save(jobs.map(j => j.id === jobId ? { ...j, docs: [...j.docs, { label: label.trim(), done: false }], updatedAt: new Date().toISOString() } : j));
  }

  function updateNotes(jobId: string, notes: string) {
    save(jobs.map(j => j.id === jobId ? { ...j, notes, updatedAt: new Date().toISOString() } : j));
  }

  function updateStatus(jobId: string, status: string) {
    save(jobs.map(j => j.id === jobId ? { ...j, status, updatedAt: new Date().toISOString() } : j));
  }

  const statusCounts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: jobs.filter(j => j.status === s).length }), {} as Record<string, number>);
  const allJurisdictions = ['All', ...Array.from(new Set(jobs.map(j => j.jurisdiction)))];

  const filtered = jobs.filter(j => {
    const statusMatch = filter === 'All' || j.status === filter;
    const jMatch = jFilter === 'All' || j.jurisdiction === jFilter;
    return statusMatch && jMatch;
  });

  return (
    <main style={{ fontFamily: 'Arial, Helvetica, sans-serif', background: '#F4F7FA', minHeight: '100vh' }}>
      <nav style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <svg width="26" height="26" viewBox="0 0 80 80"><rect width="80" height="80" rx="16" fill="#185FA5"/><rect x="10" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="10" y="46" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="46" width="24" height="24" rx="5" fill="#fff"/><path d="M49.5 60l4 4 8-9" stroke="#185FA5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
          <span style={{ fontSize: '14px', fontWeight: '700', color: '#0D1B2A' }}>Sign<span style={{ color: '#185FA5' }}>Code</span> <span style={{ fontSize: '10px', color: '#9BA8B4', fontWeight: '400' }}>Pro</span></span>
        </a>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <a href="/lookup" style={{ fontSize: '13px', color: '#5A6B7A', textDecoration: 'none' }}>Lookup</a>
          <a href="/waitlist" style={{ padding: '7px 16px', background: '#185FA5', color: '#fff', borderRadius: '7px', fontSize: '13px', fontWeight: '500', textDecoration: 'none' }}>Join waitlist</a>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#0D1B2A', marginBottom: '4px' }}>Permit jobs</h1>
            <p style={{ fontSize: '13px', color: '#9BA8B4' }}>Track every job from research to approval</p>
          </div>
          <button onClick={openNew} style={{ padding: '9px 20px', background: '#185FA5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>+ New job</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '10px', marginBottom: '24px' }}>
          {[
            { label: 'Active jobs', value: jobs.filter(j => !['Approved', 'Rejected'].includes(j.status)).length, color: '#185FA5' },
            { label: 'Under review', value: (statusCounts['Under Review'] || 0) + (statusCounts['Submitted'] || 0), color: '#BA7517' },
            { label: 'Approved', value: statusCounts['Approved'] || 0, color: '#3B6D11' },
            { label: 'Rejected', value: statusCounts['Rejected'] || 0, color: '#A32D2D' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: '#fff', borderRadius: '10px', border: '1px solid #E2E8F0', padding: '16px' }}>
              <div style={{ fontSize: '11px', color: '#9BA8B4', marginBottom: '6px' }}>{label}</div>
              <div style={{ fontSize: '28px', fontWeight: '700', color }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          {['All', ...STATUSES].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '20px', border: '0.5px solid', borderColor: filter === s ? '#185FA5' : '#E2E8F0', background: filter === s ? '#185FA5' : '#fff', color: filter === s ? '#fff' : '#5A6B7A', cursor: 'pointer' }}>{s}</button>
          ))}
        </div>

        {allJurisdictions.length > 2 && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {allJurisdictions.map(j => (
              <button key={j} onClick={() => setJFilter(j)} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '20px', border: '0.5px solid', borderColor: jFilter === j ? '#0D1B2A' : '#E2E8F0', background: jFilter === j ? '#0D1B2A' : '#fff', color: jFilter === j ? '#fff' : '#9BA8B4', cursor: 'pointer' }}>{j}</button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(job => {
            const expanded = expandedId === job.id;
            const doneDocs = job.docs.filter(d => d.done).length;
            return (
              <div key={job.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#0D1B2A', marginBottom: '3px' }}>{job.clientName}</div>
                      <div style={{ fontSize: '12px', color: '#9BA8B4' }}>{job.address} · {job.jurisdiction}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0, marginLeft: '12px' }}>
                      <Badge status={job.status} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '8px', marginBottom: '12px' }}>
                    {[
                      { label: 'Sign type', value: job.signType },
                      { label: 'Target date', value: job.targetDate ? new Date(job.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—' },
                      { label: 'Assigned to', value: job.assignedTo || '—' },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div style={{ fontSize: '10px', color: '#9BA8B4', marginBottom: '2px' }}>{label}</div>
                        <div style={{ fontSize: '12px', fontWeight: '500', color: '#0D1B2A' }}>{value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '11px', color: '#9BA8B4' }}>Docs: {doneDocs}/{job.docs.length} complete</div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => setExpandedId(expanded ? null : job.id)} style={{ fontSize: '11px', padding: '4px 10px', border: '0.5px solid #E2E8F0', borderRadius: '6px', background: '#fff', color: '#5A6B7A', cursor: 'pointer' }}>{expanded ? 'Collapse' : 'Expand'}</button>
                      <button onClick={() => openEdit(job)} style={{ fontSize: '11px', padding: '4px 10px', border: '0.5px solid #E2E8F0', borderRadius: '6px', background: '#fff', color: '#5A6B7A', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => deleteJob(job.id)} style={{ fontSize: '11px', padding: '4px 10px', border: '0.5px solid #E2E8F0', borderRadius: '6px', background: '#fff', color: '#A32D2D', cursor: 'pointer' }}>Delete</button>
                    </div>
                  </div>
                  <ProgressBar docs={job.docs} />
                </div>
                {expanded && (
                  <div style={{ borderTop: '1px solid #E2E8F0', padding: '16px 20px', background: '#F4F7FA' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '10px', fontWeight: '700', color: '#9BA8B4', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '10px' }}>Document checklist</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {job.docs.map((doc, idx) => (
                          <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px' }}>
                            <input type="checkbox" checked={doc.done} onChange={() => toggleDoc(job.id, idx)} style={{ accentColor: '#185FA5', width: '14px', height: '14px' }} />
                            <span style={{ textDecoration: doc.done ? 'line-through' : 'none', color: doc.done ? '#9BA8B4' : '#0D1B2A' }}>{doc.label}</span>
                          </label>
                        ))}
                      </div>
                      <AddDocRow onAdd={label => addDoc(job.id, label)} />
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: '700', color: '#9BA8B4', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '8px' }}>Notes</div>
                      <textarea value={job.notes} onChange={e => updateNotes(job.id, e.target.value)} placeholder="Add notes, calls, contacts, status updates..." rows={3} style={{ width: '100%', padding: '8px 10px', border: '0.5px solid #D3D1C7', borderRadius: '6px', fontSize: '12px', resize: 'vertical', background: '#fff', color: '#0D1B2A', outline: 'none', fontFamily: 'inherit' }} />
                      <div style={{ fontSize: '10px', color: '#9BA8B4', marginTop: '4px' }}>Last updated: {new Date(job.updatedAt).toLocaleDateString()}</div>
                    </div>
                    <div style={{ marginTop: '12px', display: 'flex', gap: '6px' }}>
                      <select value={job.status} onChange={e => updateStatus(job.id, e.target.value)} style={{ fontSize: '12px', padding: '6px 10px', border: '0.5px solid #D3D1C7', borderRadius: '6px', background: '#fff', color: '#0D1B2A', cursor: 'pointer' }}>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0D1B2A' }}>{editJob ? 'Edit job' : 'New permit job'}</h2>
              <button onClick={() => setShowModal(false)} style={{ fontSize: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#9BA8B4', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#5A6B7A', display: 'block', marginBottom: '5px' }}>Client / job name *</label>
                <input style={inp} value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} placeholder="e.g. Publix #2241" />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#5A6B7A', display: 'block', marginBottom: '5px' }}>Job address *</label>
                <input style={inp} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="e.g. 7800 W Sunrise Blvd, Plantation, FL" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#5A6B7A', display: 'block', marginBottom: '5px' }}>Sign type</label>
                  <select style={inp} value={form.signType} onChange={e => setForm({ ...form, signType: e.target.value })}>
                    {SIGN_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#5A6B7A', display: 'block', marginBottom: '5px' }}>Jurisdiction</label>
                  <select style={inp} value={form.jurisdiction} onChange={e => setForm({ ...form, jurisdiction: e.target.value })}>
                    {JURISDICTIONS.map(j => <option key={j}>{j}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#5A6B7A', display: 'block', marginBottom: '5px' }}>Status</label>
                  <select style={inp} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#5A6B7A', display: 'block', marginBottom: '5px' }}>Assigned to</label>
                  <input style={inp} value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })} placeholder="Name" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#5A6B7A', display: 'block', marginBottom: '5px' }}>Submitted date</label>
                  <input type="date" style={inp} value={form.submittedDate} onChange={e => setForm({ ...form, submittedDate: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#5A6B7A', display: 'block', marginBottom: '5px' }}>Target / due date</label>
                  <input type="date" style={inp} value={form.targetDate} onChange={e => setForm({ ...form, targetDate: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#5A6B7A', display: 'block', marginBottom: '5px' }}>Notes</label>
                <textarea style={{ ...inp, resize: 'vertical', fontFamily: 'inherit' }} rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Any notes about this job..." />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '9px 18px', border: '0.5px solid #E2E8F0', borderRadius: '8px', background: '#fff', fontSize: '13px', cursor: 'pointer', color: '#5A6B7A' }}>Cancel</button>
              <button onClick={submitForm} style={{ padding: '9px 20px', background: '#185FA5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>{editJob ? 'Save changes' : 'Create job'}</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
