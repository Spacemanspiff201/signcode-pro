'use client';
import { useState } from 'react';

const JURISDICTIONS = [
  { label: 'Boca Raton', value: 'boca-raton' },
  { label: 'Broward County (Unincorporated)', value: 'broward' },
  { label: 'Coral Springs', value: 'coral-springs' },
  { label: 'Deerfield Beach', value: 'deerfield-beach' },
  { label: 'Delray Beach', value: 'delray-beach' },
  { label: 'Fort Lauderdale', value: 'fort-lauderdale' },
  { label: 'Hillsborough County', value: 'hillsborough' },
  { label: 'Hollywood', value: 'hollywood' },
  { label: 'Miami Beach', value: 'miami-beach' },
  { label: 'Miami-Dade County', value: 'miami-dade' },
  { label: 'Miramar', value: 'miramar' },
  { label: 'Orlando', value: 'orlando' },
  { label: 'Palm Beach County', value: 'palm-beach' },
  { label: 'Pembroke Pines', value: 'pembroke-pines' },
  { label: 'Pompano Beach', value: 'pompano-beach' },
  { label: 'Sunrise', value: 'sunrise' },
  { label: 'Tampa', value: 'tampa' },
  { label: 'West Palm Beach', value: 'west-palm-beach' },
];

function SignCard({ typeKey, rules }: { typeKey: string; rules: Record<string, any> }) {
  const [open, setOpen] = useState(false);
  const labels: Record<string, string> = {
    wall: 'Wall Signs', channelLetters: 'Channel Letters', monument: 'Monument Signs',
    pylon: 'Pylon / Pole Signs', awning: 'Awning Signs', projecting: 'Projecting Signs',
    window: 'Window Signs', emc: 'EMC / Digital Signs', temporary: 'Temporary Signs', directional: 'Directional Signs'
  };
  const label = labels[typeKey] || typeKey;
  const isBanned = (typeKey === 'pylon' && rules.simplifiedText?.toLowerCase().includes('prohibited')) || (typeKey === 'emc' && rules.emcAllowed === false);
  const verified = rules.confidence === 'verified' || rules.confidence === 'high';
  const hasTimeclock = rules.timeclockRequired !== undefined || rules.photocellRequired !== undefined || rules.astronomicalTimeclockRequired !== undefined;
  return (
    <div style={{ border: `1px solid ${isBanned ? '#FECACA' : '#E2E8F0'}`, borderRadius: 10, marginBottom: 8, background: '#fff' }}>
      <div onClick={() => setOpen(o => !o)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', cursor: 'pointer' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: isBanned ? '#B91C1C' : '#0D1B2A' }}>{label}</div>
          <div style={{ fontSize: 11, color: '#9BA8B4', marginTop: 2 }}>{isBanned ? 'NOT PERMITTED' : (rules.simplifiedText?.substring(0, 70) + '...') || 'Tap to expand'}</div>
        </div>
        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: verified ? '#EAF3DE' : '#FEF3C7', color: verified ? '#27500A' : '#92400E', fontWeight: 700 }}>{verified ? 'Verified' : 'Verify at intake'}</span>
      </div>
      {open && (
        <div style={{ borderTop: '1px solid #F4F7FA', padding: '14px 16px', fontSize: 13 }}>
          {rules.maxStructureHeightFt !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F4F7FA' }}><span style={{ color: '#5A6B7A' }}>Max structure height</span><strong>{rules.maxStructureHeightFt} ft</strong></div>}
          {rules.maxFaceAreaSqft !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F4F7FA' }}><span style={{ color: '#5A6B7A' }}>Max face area</span><strong>{rules.maxFaceAreaSqft} sq ft</strong></div>}
          {rules.maxLetterHeightIn !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F4F7FA' }}><span style={{ color: '#5A6B7A' }}>Max letter height</span><strong>{rules.maxLetterHeightIn} in</strong></div>}
          {rules.areaCalcMethod === 'per_linear_ft_frontage' && rules.areaCalcValue !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F4F7FA' }}><span style={{ color: '#5A6B7A' }}>Area calc</span><strong>{rules.areaCalcValue} sq ft per linear ft of frontage</strong></div>}
          {rules.maxPerTenant !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F4F7FA' }}><span style={{ color: '#5A6B7A' }}>Max per tenant</span><strong>{String(rules.maxPerTenant)}</strong></div>}
          {rules.landscapingRequired !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F4F7FA' }}><span style={{ color: '#5A6B7A' }}>Landscaping at base</span><strong>{rules.landscapingRequired ? 'Required' : 'Not required'}</strong></div>}
          {rules.tempMaxSqft !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F4F7FA' }}><span style={{ color: '#5A6B7A' }}>Max size</span><strong>{rules.tempMaxSqft} sq ft</strong></div>}
          {rules.illuminationAllowed !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F4F7FA' }}><span style={{ color: '#5A6B7A' }}>Illumination</span><strong>{rules.illuminationAllowed ? 'Allowed' : 'Not allowed'}</strong></div>}
          {rules.faceLitAllowed !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F4F7FA' }}><span style={{ color: '#5A6B7A' }}>Face lit</span><strong>{rules.faceLitAllowed ? 'Allowed' : 'Not allowed'}</strong></div>}
          {rules.reverseHaloLitAllowed !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F4F7FA' }}><span style={{ color: '#5A6B7A' }}>Reverse / halo lit</span><strong>{rules.reverseHaloLitAllowed ? 'Allowed' : 'Not allowed'}</strong></div>}
          {rules.openFaceNeonAllowed !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F4F7FA' }}><span style={{ color: '#5A6B7A' }}>Open face neon</span><strong>{rules.openFaceNeonAllowed ? 'Allowed' : 'Not allowed'}</strong></div>}
          {hasTimeclock && (
            <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 8, padding: '10px 12px', margin: '8px 0' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#92400E', textTransform: 'uppercase', marginBottom: 6 }}>Illumination Controls</div>
              {rules.timeclockRequired !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 12, color: '#92400E' }}>Timeclock (city)</span><strong style={{ fontSize: 12, color: '#92400E' }}>{rules.timeclockRequired ? 'Required' : 'Not required'}</strong></div>}
              {rules.photocellRequired !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 12, color: '#92400E' }}>Photocell</span><strong style={{ fontSize: 12, color: '#92400E' }}>{rules.photocellRequired ? 'Required' : 'Not required'}</strong></div>}
              {rules.astronomicalTimeclockRequired !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 12, color: '#92400E' }}>Astronomical timeclock</span><strong style={{ fontSize: 12, color: '#92400E' }}>{rules.astronomicalTimeclockRequired ? 'Required' : 'Not required'}</strong></div>}
            </div>
          )}
          {rules.emcAllowed !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F4F7FA' }}><span style={{ color: '#5A6B7A' }}>EMC allowed</span><strong>{rules.emcAllowed ? 'Yes' : 'No - Prohibited'}</strong></div>}
          {rules.simplifiedText && <div style={{ background: '#F0FDF4', borderLeft: '3px solid #86EFAC', padding: '10px 12px', marginTop: 8, lineHeight: 1.6 }}>{rules.simplifiedText}</div>}
          {rules.verbatimText && <div style={{ background: '#F4F7FA', borderLeft: '3px solid #BFDBFE', padding: '10px 12px', marginTop: 6, fontSize: 12, color: '#5A6B7A', fontStyle: 'italic' }}>{rules.verbatimText}</div>}
          {rules.notes && <div style={{ background: '#F4F7FA', borderRadius: 8, padding: '10px 12px', marginTop: 6, fontSize: 12, color: '#5A6B7A' }}>{rules.notes}</div>}
        </div>
      )}
    </div>
  );
}

export default function LookupPage() {
  const [jur, setJur] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('signs');

  async function lookup() {
    if (!jur) return;
    setLoading(true);
    setData(null);
    setTab('signs');
    try {
      const res = await fetch('/api/lookup?jurisdiction=' + jur);
      const json = await res.json();
      setData(json.data || json);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  const hasZoning = data && data.zoningDistricts && data.zoningDistricts.length > 0;

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', minHeight: '100vh', background: '#F4F7FA' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}@keyframes glow{0%,100%{opacity:.4}50%{opacity:.7}}`}</style>
      <nav style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <svg width="26" height="26" viewBox="0 0 80 80"><rect width="80" height="80" rx="14" fill="#185FA5"/><rect x="10" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="10" y="46" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="46" width="24" height="24" rx="5" fill="#fff"/><path d="M50 60l4 4 8-9" stroke="#185FA5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#0D1B2A' }}>Sign<span style={{ color: '#185FA5' }}>Code</span> Pro</span>
          </a>
          <div style={{ display: 'flex', gap: 28 }}>
            <a href="/lookup" style={{ fontSize: 13, color: '#185FA5', fontWeight: 600, textDecoration: 'none' }}>Lookup</a>
            <a href="/jobs" style={{ fontSize: 13, color: '#5A6B7A', fontWeight: 500, textDecoration: 'none' }}>Jobs</a>
            <a href="/waitlist" style={{ fontSize: 13, color: '#5A6B7A', fontWeight: 500, textDecoration: 'none' }}>Waitlist</a>
          </div>
          <a href="/waitlist" style={{ padding: '8px 18px', background: '#185FA5', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Join waitlist</a>
        </div>
      </nav>
      <div style={{ background: '#0D1B2A', padding: '52px 32px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)', width: 800, height: 400, background: 'radial-gradient(ellipse,rgba(24,95,165,.12) 0%,transparent 65%)', animation: 'glow 6s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: '#fff', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 12 }}>Look up any jurisdiction.<br /><span style={{ color: '#85B7EB' }}>In seconds, not hours.</span></h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.5)', lineHeight: 1.65, marginBottom: 32 }}>Sign codes by sign type, required docs, red flags, and contact info.</p>
          <div style={{ background: 'rgba(255,255,255,.07)', borderRadius: 14, border: '1px solid rgba(255,255,255,.1)', padding: '22px 24px', maxWidth: 640 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6 }}>Address Search <span style={{ background: '#F59E0B', color: '#fff', fontSize: 9, padding: '1px 5px', borderRadius: 20, fontWeight: 700 }}>SOON</span></div>
                <input disabled placeholder="123 Main St..." style={{ width: '100%', padding: '9px 12px', border: '1px solid rgba(255,255,255,.1)', borderRadius: 7, fontSize: 13, color: 'rgba(255,255,255,.25)', background: 'rgba(255,255,255,.05)', cursor: 'not-allowed', fontFamily: 'inherit' }} />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6 }}>Select Jurisdiction</div>
                <select value={jur} onChange={e => setJur(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid rgba(255,255,255,.15)', borderRadius: 7, fontSize: 13, color: jur ? '#fff' : 'rgba(255,255,255,.4)', background: 'rgba(255,255,255,.08)', cursor: 'pointer', fontFamily: 'inherit', outline: 'none' }}>
                  <option value="">Choose a city or county</option>
                  {JURISDICTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
            <button onClick={lookup} style={{ width: '100%', padding: 13, background: '#185FA5', color: '#fff', border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              {loading ? 'Loading...' : 'Run Permit Lookup'}
            </button>
          </div>
        </div>
      </div>
      {loading && <div style={{ padding: 64, textAlign: 'center', color: '#5A6B7A', fontSize: 14 }}>Loading...</div>}
      {data && !loading && (
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 32px 80px' }}>
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: '20px 24px', marginBottom: 14 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0D1B2A', marginBottom: 4 }}>{data.jurisdiction}</h2>
            <div style={{ fontSize: 12, color: '#9BA8B4', marginBottom: 10 }}>{data.county}{data.lastVerified && ` · Verified: ${data.lastVerified}`}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {data.ownerSignatureRequired && <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: '#FEF3C7', color: '#92400E', fontWeight: 700 }}>Owner sig required</span>}
              {data.masterSignProgramRequired && <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: '#FCEBEB', color: '#791F1F', fontWeight: 700 }}>MSP required</span>}
              {data.designReviewRequired && <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: '#FCEBEB', color: '#791F1F', fontWeight: 700 }}>Design review required</span>}
              {data.contractorRegistrationRequired && <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: '#FCEBEB', color: '#791F1F', fontWeight: 700 }}>Contractor reg required</span>}
              {data.emcAllowed === true && <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: '#DCFCE7', color: '#15803D', fontWeight: 700 }}>EMC Allowed</span>}
              {data.emcAllowed === false && <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: '#FEE2E2', color: '#B91C1C', fontWeight: 700 }}>EMC Banned</span>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, paddingTop: 12, borderTop: '1px solid #F4F7FA' }}>
              {data.turnaround && <div><div style={{ fontSize: 10, fontWeight: 700, color: '#9BA8B4', textTransform: 'uppercase', marginBottom: 2 }}>Turnaround</div><div style={{ fontSize: 12, fontWeight: 600 }}>{data.turnaround}</div></div>}
              {data.fees && <div><div style={{ fontSize: 10, fontWeight: 700, color: '#9BA8B4', textTransform: 'uppercase', marginBottom: 2 }}>Fees</div><div style={{ fontSize: 12, fontWeight: 600 }}>{data.fees}</div></div>}
              {data.phone && <div><div style={{ fontSize: 10, fontWeight: 700, color: '#9BA8B4', textTransform: 'uppercase', marginBottom: 2 }}>Phone</div><div style={{ fontSize: 12, fontWeight: 600 }}>{data.phone}</div></div>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
            {[{k:'signs',l:'Sign Types'},{k:'flags',l:`Red Flags (${data.redFlags ? data.redFlags.length : 0})`},{k:'docs',l:`Docs (${data.requiredDocs ? data.requiredDocs.length : 0})`},{k:'contacts',l:'Contacts'},{k:'code',l:'Code Language'}].map(({k,l}) => (
              <button key={k} onClick={() => setTab(k)} style={{ fontSize: 12, padding: '6px 13px', borderRadius: 20, border: '1px solid', borderColor: tab===k?'#185FA5':'#E2E8F0', background: tab===k?'#185FA5':'#fff', color: tab===k?'#fff':'#5A6B7A', cursor: 'pointer', fontFamily: 'inherit', fontWeight: tab===k?700:400 }}>{l}</button>
            ))}
          </div>
          {tab === 'signs' && (
            hasZoning ? data.zoningDistricts.map((d, di) => (
              <div key={di} style={{ marginBottom: 24 }}>
                <div style={{ background: '#0D1B2A', borderRadius: 10, padding: '11px 16px', marginBottom: 10 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{d.districtCode} — {d.districtName}</div>
                  {d.overlay && <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>{d.overlay}</div>}
                </div>
                {Object.entries(d.signTypes as Record<string, Record<string, any>>).map(([k, v]) => <SignCard key={k} typeKey={k} rules={v} />)}
              </div>
            )) : (
              <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: '20px 24px' }}>
                <div style={{ background: '#FEF3C7', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 12, color: '#92400E' }}>Full sign-type breakdown coming soon for this jurisdiction.</div>
                {data.maxHeight && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F4F7FA', fontSize: 13 }}><span style={{ color: '#5A6B7A' }}>Max height</span><strong>{data.maxHeight}</strong></div>}
                {data.maxArea && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F4F7FA', fontSize: 13 }}><span style={{ color: '#5A6B7A' }}>Max area</span><strong>{data.maxArea}</strong></div>}
                {data.setback && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F4F7FA', fontSize: 13 }}><span style={{ color: '#5A6B7A' }}>Setback</span><strong>{data.setback}</strong></div>}
                {data.engineerSealRequired && <div style={{ marginTop: 8, background: '#FEF3C7', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: '#92400E' }}><strong>Engineer seal: </strong>{data.engineerSealRequired}</div>}
              </div>
            )
          )}
          {tab === 'flags' && (
            <div>
              {data.redFlags && data.redFlags.map((f, i) => <div key={i} style={{ background: '#fff', borderRadius: 10, border: '1px solid #FECACA', padding: '12px 16px', display: 'flex', gap: 10, marginBottom: 8 }}><span>🚩</span><span style={{ fontSize: 13, color: '#0D1B2A', lineHeight: 1.55 }}>{f}</span></div>)}
              {data.practitionerNotes && data.practitionerNotes.map((n, i) => <div key={i} style={{ background: '#fff', borderRadius: 10, border: '1px solid #E2E8F0', padding: '11px 14px', display: 'flex', gap: 8, marginBottom: 6 }}><span style={{ color: '#185FA5', fontWeight: 700 }}>→</span><span style={{ fontSize: 13, color: '#5A6B7A' }}>{n}</span></div>)}
            </div>
          )}
          {tab === 'docs' && (
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: '20px 24px' }}>
              {data.requiredDocs && data.requiredDocs.map((d, i) => <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid #F4F7FA' }}><div style={{ width: 20, height: 20, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ fontSize: 10, fontWeight: 700, color: '#185FA5' }}>{i+1}</span></div><span style={{ fontSize: 13 }}>{d}</span></div>)}
            </div>
          )}
          {tab === 'contacts' && (
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: '20px 24px' }}>
              {data.contacts && data.contacts.map((c, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #F4F7FA' }}><span style={{ fontSize: 13, color: '#5A6B7A' }}>{c.label}</span>{c.value.startsWith('http') ? <a href={c.value} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 700, color: '#185FA5', textDecoration: 'none' }}>Open portal</a> : <span style={{ fontSize: 13, fontWeight: 700 }}>{c.value}</span>}</div>)}
            </div>
          )}
          {tab === 'code' && (
            <div>
              {data.codeLanguage && data.codeLanguage.map((cs, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', padding: '14px 16px', marginBottom: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#185FA5', background: 'rgba(24,95,165,.07)', padding: '2px 7px', borderRadius: 5, display: 'inline-block', marginBottom: 6 }}>{cs.section}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0D1B2A', marginBottom: 8 }}>{cs.title}</div>
                  <div style={{ fontSize: 13, lineHeight: 1.6, background: '#F0FDF4', borderLeft: '3px solid #86EFAC', padding: '10px 12px', marginBottom: 6 }}>{cs.simplified}</div>
                  <div style={{ fontSize: 12, lineHeight: 1.65, color: '#5A6B7A', background: '#F4F7FA', borderLeft: '3px solid #BFDBFE', padding: '10px 12px', fontStyle: 'italic' }}>{cs.verbatim}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <footer style={{ padding: '22px 32px', borderTop: '1px solid #E8EDF2', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1100, margin: '0 auto' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#0D1B2A' }}>Sign<span style={{ color: '#185FA5' }}>Code</span> Pro</span>
          <span style={{ fontSize: 11, color: '#B4B2A9' }}>2026 SignCode Pro</span>
        </div>
      </footer>
    </div>
  );
}
