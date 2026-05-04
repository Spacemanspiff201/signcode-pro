'use client';
import { useState, useEffect } from 'react';

type Status = 'Not Started' | 'In Progress' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';

interface Doc {
  label: string;
  done: boolean;
}

interface Job {
  id: string;
  name: string;
  jurisdiction: string;
  status: Status;
  notes: string;
  assignedTo: string;
  targetDate: string;
  submittedDate: string;
  docs: Doc[];
}

const STATUS_COLORS: Record<Status, { bg: string; color: string }> = {
  'Not Started':  { bg: '#F4F7FA', color: '#5A6B7A' },
  'In Progress':  { bg: '#EFF6FF', color: '#1D4ED8' },
  'Submitted':    { bg: '#FEF3C7', color: '#92400E' },
  'Under Review': { bg: '#F3E8FF', color: '#7C3AED' },
  'Approved':     { bg: '#DCFCE7', color: '#166534' },
  'Rejected':     { bg: '#FEE2E2', color: '#B91C1C' },
};

const STATUSES: Status[] = ['Not Started', 'In Progress', 'Submitted', 'Under Review', 'Approved', 'Rejected'];

const SAMPLE_JOBS: Job[] = [
  {
    id: '1', name: 'Publix #2241 — Monument Sign', jurisdiction: 'pompano-beach',
    status: 'Under Review', notes: 'Waiting on AAC approval for Atlantic Blvd corridor.', assignedTo: 'Joe S.', targetDate: '2026-06-15', submittedDate: '2026-05-01',
    docs: [
      { label: 'Permit application', done: true }, { label: 'Structural drawings (PE sealed)', done: true },
      { label: 'Site plan', done: true }, { label: 'MSP compliance docs', done: true },
      { label: 'AAC approval', done: false }, { label: 'Owner authorization', done: true },
    ],
  },
  {
    id: '2', name: 'AutoNation — Channel Letters', jurisdiction: 'fort-lauderdale',
    status: 'Submitted', notes: 'Contractor registration confirmed. Awaiting plan review.', assignedTo: 'Joe S.', targetDate: '2026-05-30', submittedDate: '2026-04-28',
    docs: [
      { label: 'Permit application', done: true }, { label: 'City contractor registration', done: true },
      { label: 'Structural drawings', done: true }, { label: 'Electrical plans', done: true },
      { label: 'Owner authorization', done: true },
    ],
  },
  {
    id: '3', name: 'Chick-fil-A — Pylon Sign', jurisdiction: 'boca-raton',
    status: 'In Progress', notes: 'Waiting on DRB meeting date. EMC confirmed NOT included.', assignedTo: 'Joe S.', targetDate: '2026-08-01', submittedDate: '',
    docs: [
      { label: 'DRB approval', done: false }, { label: 'Color renderings for DRB', done: false },
      { label: 'Permit application', done: false }, { label: 'Structural drawings', done: false },
      { label: 'Material specs', done: true },
    ],
  },
  {
    id: '4', name: 'Walgreens — Wall Sign Reface', jurisdiction: 'miami-dade',
    status: 'Approved', notes: 'Permit pulled. Installation scheduled 5/10.', assignedTo: 'Joe S.', targetDate: '2026-05-10', submittedDate: '2026-04-01',
    docs: [
      { label: 'Permit application', done: true }, { label: 'Engineer drawings (PE sealed)', done: true },
      { label: 'Site plan', done: true }, { label: 'Shop inspection cert', done: true },
      { label: 'Owner authorization', done: true },
    ],
  },
];

function JobCard({ job, onUpdate }: { job: Job; onUpdate: (j: Job) => void }) {
  const [expanded, setExpanded] = useState(false);
  const statusStyle = STATUS_COLORS[job.status];
  const doneDocs = job.docs.filter(d => d.done).length;

  function toggleDoc(i: number) {
    const newDocs = job.docs.map((d, idx) => idx === i ? { ...d, done: !d.done } : d);
    onUpdate({ ...job, docs: newDocs });
  }

  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8EDF2', marginBottom: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,.03)' }}>
      <div onClick={() => setExpanded(e => !e)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', cursor: 'pointer' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0D1B2A', marginBottom: 3 }}>{job.name}</div>
          <div style={{ fontSize: 12, color: '#9BA8B4' }}>{job.jurisdiction} · {doneDocs}/{job.docs.length} docs</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {job.targetDate && <div style={{ fontSize: 11, color: '#9BA8B4' }}>Due {job.targetDate}</div>}
          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: statusStyle.bg, color: statusStyle.color, whiteSpace: 'nowrap' }}>{job.status}</span>
          <span style={{ fontSize: 12, color: '#C2C0B6' }}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div style={{ borderTop: '1px solid #F4F7FA', padding: '16px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#9BA8B4', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Status</div>
              <select value={job.status} onChange={e => onUpdate({ ...job, status: e.target.value as Status })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #E8EDF2', borderRadius: 8, fontSize: 13, color: '#0D1B2A', background: '#fff', fontFamily: 'inherit' }}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#9BA8B4', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Assigned To</div>
              <input value={job.assignedTo} onChange={e => onUpdate({ ...job, assignedTo: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #E8EDF2', borderRadius: 8, fontSize: 13, color: '#0D1B2A', fontFamily: 'inherit' }} />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9BA8B4', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Document Checklist ({doneDocs}/{job.docs.length})</div>
            <div style={{ background: '#F4F7FA', borderRadius: 10, padding: '4px 8px' }}>
              {job.docs.map((d, i) => (
                <div key={i} onClick={() => toggleDoc(i)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px', cursor: 'pointer', borderBottom: i < job.docs.length - 1 ? '1px solid #E8EDF2' : 'none' }}>
                  <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${d.done ? '#185FA5' : '#D1D5DB'}`, background: d.done ? '#185FA5' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {d.done && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span style={{ fontSize: 13, color: d.done ? '#9BA8B4' : '#0D1B2A', textDecoration: d.done ? 'line-through' : 'none' }}>{d.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9BA8B4', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Notes</div>
            <textarea value={job.notes} onChange={e => onUpdate({ ...job, notes: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #E8EDF2', borderRadius: 8, fontSize: 13, color: '#0D1B2A', fontFamily: 'inherit', resize: 'vertical', minHeight: 80 }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('signcode-jobs');
      setJobs(saved ? (JSON.parse(saved) as Job[]) : SAMPLE_JOBS);
    } catch {
      setJobs(SAMPLE_JOBS);
    }
  }, []);

  function updateJob(updated: Job) {
    const newJobs = jobs.map(j => j.id === updated.id ? updated : j);
    setJobs(newJobs);
    try { localStorage.setItem('signcode-jobs', JSON.stringify(newJobs)); } catch { /* ignore */ }
  }

  const filtered = filter === 'All' ? jobs : jobs.filter(j => j.status === filter);
  const counts = STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = jobs.filter(j => j.status === s).length;
    return acc;
  }, {});

  return (
    <div style={{ fontFamily: "'DM Sans', Arial, sans-serif", minHeight: '100vh', background: '#F4F7FA' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}`}</style>
      <nav style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <svg width="26" height="26" viewBox="0 0 80 80"><rect width="80" height="80" rx="14" fill="#185FA5"/><rect x="10" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="10" y="46" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="46" width="24" height="24" rx="5" fill="#fff"/><path d="M50 60l4 4 8-9" stroke="#185FA5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#0D1B2A' }}>Sign<span style={{ color: '#185FA5' }}>Code</span> Pro</span>
          </a>
          <div style={{ display: 'flex', gap: 28 }}>
            <a href="/lookup" style={{ fontSize: 13, color: '#5A6B7A', fontWeight: 500, textDecoration: 'none' }}>Lookup</a>
            <a href="/jobs" style={{ fontSize: 13, color: '#185FA5', fontWeight: 600, textDecoration: 'none' }}>Jobs</a>
            <a href="/waitlist" style={{ fontSize: 13, color: '#5A6B7A', fontWeight: 500, textDecoration: 'none' }}>Waitlist</a>
          </div>
          <a href="/waitlist" style={{ padding: '8px 18px', background: '#185FA5', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Join waitlist</a>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 32px 64px' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0D1B2A', letterSpacing: '-.5px', marginBottom: 6 }}>Job Tracker</h1>
          <p style={{ fontSize: 14, color: '#5A6B7A' }}>Track every permit job from research to approval.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {(['All', ...STATUSES] as const).map(s => {
            const count = s === 'All' ? jobs.length : (counts[s] ?? 0);
            const active = filter === s;
            return (
              <button key={s} onClick={() => setFilter(s)} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 20, border: '1px solid', borderColor: active ? '#185FA5' : '#E2E8F0', background: active ? '#185FA5' : '#fff', color: active ? '#fff' : '#5A6B7A', cursor: 'pointer', fontFamily: 'inherit', fontWeight: active ? 700 : 400 }}>
                {s}{count > 0 ? ` ${count}` : ''}
              </button>
            );
          })}
        </div>
        {filtered.map(job => (
          <JobCard key={job.id} job={job} onUpdate={updateJob} />
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#9BA8B4' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: 14 }}>No jobs with status &quot;{filter}&quot;</div>
          </div>
        )}
      </div>

      <footer style={{ padding: '22px 32px', borderTop: '1px solid #E8EDF2', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1100, margin: '0 auto' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#0D1B2A' }}>Sign<span style={{ color: '#185FA5' }}>Code</span> Pro</span>
          <span style={{ fontSize: 11, color: '#B4B2A9' }}>© 2026 SignCode Pro</span>
        </div>
      </footer>
    </div>
  );
}
