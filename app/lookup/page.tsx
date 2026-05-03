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

const SIGN_LABELS: Record<string, string> = {
  wall: '🏢 Wall Signs',
  channelLetters: '✏️ Channel Letters',
  monument: '🪨 Monument Signs',
  pylon: '🚩 Pylon / Pole Signs',
  awning: '⛺ Awning Signs',
  projecting: '📐 Projecting Signs',
  window: '🪟 Window Signs',
  emc: '📺 EMC / Digital Signs',
  temporary: '📋 Temporary Signs',
  directional: '➡️ Directional Signs',
};

function SignTypeCard({ typeKey, rules }: { typeKey: string; rules: any }) {
  const [open, setOpen] = useState(false);
  const label = SIGN_LABELS[typeKey] || typeKey;
  const isBanned =
    (typeKey === 'pylon' && rules.simplifiedText?.toLowerCase().includes('prohibited')) ||
    (typeKey === 'emc' && rules.emcAllowed === false);

  const conf = rules.confidence || 'medium';
  const confColor = conf === 'verified' || conf === 'high' ? '#27500A' : '#92400E';
  const confBg = conf === 'verified' || conf === 'high' ? '#EAF3DE' : '#FEF3C7';
  const confLabel = conf === 'verified' ? '✓ Verified' : conf === 'high' ? '✓ High' : '⚠ Verify at intake';

  return (
    <div style={{
      border: `1px solid ${isBanned ? '#FECACA' : '#E2E8F0'}`,
      borderRadius: 10,
      marginBottom: 8,
      background: '#fff',
      overflow: 'hidden',
    }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', cursor: 'pointer' }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: isBanned ? '#B91C1C' : '#0D1B2A' }}>{label}</div>
          <div style={{ fontSize: 11, color: '#9BA8B4', marginTop: 2 }}>
            {isBanned ? '🚫 NOT PERMITTED' : (rules.simplifiedText?.substring(0, 70) + '…') || 'Tap to expand'}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: confBg, color: confColor, fontWeight: 700 }}>{confLabel}</span>
          <span style={{ fontSize: 16, color: '#9BA8B4' }}>{open ? '▾' : '▸'}</span>
        </div>
      </div>

      {open && (
        <div style={{ borderTop: '1px solid #F4F7FA', padding: '14px 16px', fontSize: 13 }}>

          {/* Dimensions */}
          {(rules.maxStructureHeightFt !== undefined || rules.maxFaceAreaSqft !== undefined || rules.maxLetterHeightIn !== undefined || rules.areaCalcValue !== undefined || rules.maxPerTenant !== undefined || rules.tempMaxSqft !== undefined) && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#9BA8B4', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Dimensions</div>
              {rules.maxStructureHeightFt !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F4F7FA' }}><span style={{ color: '#5A6B7A' }}>Max structure height</span><strong>{rules.maxStructureHeightFt} ft</strong></div>}
              {rules.maxFaceAreaSqft !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F4F7FA' }}><span style={{ color: '#5A6B7A' }}>Max face area</span><strong>{rules.maxFaceAreaSqft} sq ft</strong></div>}
              {rules.maxLetterHeightIn !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F4F7FA' }}><span style={{ color: '#5A6B7A' }}>Max letter height</span><strong>{rules.maxLetterHeightIn} in</strong></div>}
              {rules.areaCalcMethod === 'per_linear_ft_frontage' && rules.areaCalcValue !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F4F7FA' }}><span style={{ color: '#5A6B7A' }}>Area calculation</span><strong>{rules.areaCalcValue} sq ft per linear ft of frontage</strong></div>}
              {rules.maxPerTenant !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F4F7FA' }}><span style={{ color: '#5A6B7A' }}>Max per tenant</span><strong>{rules.maxPerTenant}</strong></div>}
              {rules.tempMaxSqft !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F4F7FA' }}><span style={{ color: '#5A6B7A' }}>Max size</span><strong>{rules.tempMaxSqft} sq ft</strong></div>}
              {rules.landscapingRequired !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F4F7FA' }}><span style={{ color: '#5A6B7A' }}>Landscaping at base</span><strong>{rules.landscapingRequired ? 'Required' : 'Not required'}</strong></div>}
            </div>
          )}

          {/* Illumination */}
          {(rules.illuminationAllowed !== undefined || rules.faceLitAllowed !== undefined || rules.reverseHaloLitAllowed !== undefined || rules.openFaceNeonAllowed !== undefined) && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#9BA8B4', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Illumination</div>
              {rules.illuminationAllowed !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F4F7FA' }}><span style={{ color: '#5A6B7A' }}>Illumination allowed</span><strong>{rules.illuminationAllowed ? 'Yes' : 'No'}</strong></div>}
              {rules.faceLitAllowed !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F4F7FA' }}><span style={{ color: '#5A6B7A' }}>Face lit / front lit</span><strong>{rules.faceLitAllowed ? '✓ Allowed' : '✗ Not allowed'}</strong></div>}
              {rules.reverseHaloLitAllowed !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F4F7FA' }}><span style={{ color: '#5A6B7A' }}>Reverse / halo lit</span><strong>{rules.reverseHaloLitAllowed ? '✓ Allowed' : '✗ Not allowed'}</strong></div>}
              {rules.openFaceNeonAllowed !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F4F7FA' }}><span style={{ color: '#5A6B7A' }}>Open face neon</span><strong>{rules.openFaceNeonAllowed ? '✓ Allowed' : '✗ Not allowed'}</strong></div>}
            </div>
          )}

          {/* Timeclock / Photocell */}
          {(rules.timeclockRequired !== undefined || rules.photocellRequired !== undefined || rules.astronomicalTimeclockRequired !== undefined) && (
            <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 8, padding: '10px 12px', marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#92400E', textTransform: 'uppercase', marginBottom: 6 }}>⏰ Illumination Controls</div>
              {rules.timeclockRequired !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}><span style={{ color: '#92400E', fontSize: 12 }}>Timeclock required (city)</span><strong style={{ color: '#92400E', fontSize: 12 }}>{rules.timeclockRequired ? '✓ Yes' : 'No'}</strong></div>}
              {rules.photocellRequired !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}><span style={{ color: '#92400E', fontSize: 12 }}>Photocell required</span><strong style={{ color: '#92400E', fontSize: 12 }}>{rules.photocellRequired ? '✓ Yes' : 'No'}</strong></div>}
              {rules.astronomicalTimeclockRequired !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}><span style={{ color: '#92400E', fontSize: 12 }}>Astronomical timeclock</span><strong style={{ color: '#92400E', fontSize: 12 }}>{rules.astronomicalTimeclockRequired ? '✓ Required' : 'Not required'}</strong></div>}
            </div>
          )}

          {/* EMC */}
          {rules.emcAllowed !== undefined && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#9BA8B4', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>EMC / Digital</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F4F7FA' }}><span style={{ color: '#5A6B7A' }}>EMC allowed</span><strong>{rules.emcAllowed ? 'Yes' : '🚫 No'}</strong></div>
              {rules.emcMinMessageHoldSec !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F4F7FA' }}><span style={{ color: '#5A6B7A' }}>Min message hold</span><strong>{rules.emcMinMessageHoldSec} sec</strong></div>}
              {rules.emcMaxBrightnessDay !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F4F7FA' }}><span style={{ color: '#5A6B7A' }}>Max brightness (day)</span><strong>{rules.emcMaxBrightnessDay} nits</strong></div>}
              {rules.emcMaxBrightnessNight !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F4F7FA' }}><span style={{ color: '#5A6B7A' }}>Max brightness (night)</span><strong>{rules.emcMaxBrightnessNight} nits</strong></div>}
            </div>
          )}

          {/* Plain english */}
          {rules.simplifiedText && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#9BA8B4', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5 }}>Plain English</div>
              <div style={{ background: '#F0FDF4', borderLeft: '3px solid #86EFAC', padding: '10px 12px', borderRadius: '0 8px 8px 0', lineHeight: 1.6, color: '#0D1B2A' }}>{rules.simplifiedText}</div>
            </div>
          )}

          {/* Verbatim */}
          {rules.verbatimText && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#9BA8B4', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5 }}>Verbatim Ordinance — {rules.codeSection}</div>
              <div style={{ background: '#F4F7FA', borderLeft: '3px solid #BFDBFE', padding: '10px 12px', borderRadius: '0 8px 8px 0', lineHeight: 1.65, color: '#5A6B7A', fontStyle: 'italic', fontSize: 12 }}>"{rules.verbatimText}"</div>
            </div>
          )}

          {/* Notes */}
          {rules.notes && (
            <div style={{ background: '#F4F7FA', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: '#5A6B7A', lineHeight: 1.6 }}>
              <strong style={{ color: '#0D1B2A' }}>📌 Notes: </strong>{rules.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function LookupPage() {
  const [jur, setJur] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [data, setData] = useState<any>(null);
  const [tab, setTab] = useState('signs');
  const [codeView, setCodeView] = useState('plain');

  async function doLookup() {
    const val = jur;
    if (!val) { alert('Please select a jurisdiction first.'); return; }
    setStatus('loading');
    setData(null);
    setTab('signs');
    try {
      const r = await fetch('/api/lookup?jurisdiction=' + val);
      const j = await r.json();
      if (j.data) {
        setData(j.data);
      } else if (j.jurisdiction) {
        setData(j);
      } else {
        throw new Error('No data');
      }
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  const hasZoning = data?.zoningDistricts?.length > 0;

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: '#F4F7FA', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes glow{0%,100%{opacity:.4}50%{opacity:.7}}
      `}</style>

      {/* NAV */}
      <nav style={{ background: 'rgba(255,255,255,0.95)', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(10px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <svg width="26" height="26" viewBox="0 0 80 80"><rect width="80" height="80" rx="14" fill="#185FA5"/><rect x="10" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="10" y="46" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="46" width="24" height="24" rx="5" fill="#fff"/><path d="M50 60l4 4 8-9" stroke="#185FA5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#0D1B2A' }}>Sign<span style={{ color: '#185FA5' }}>Code</span> Pro</span>
          </a>
          <div style={{ display: 'flex', gap: 28 }}>
            <a href="/lookup" style={{ fontSize: 13, color: '#185FA5', textDecoration: 'none', fontWeight: 600 }}>Lookup</a>
            <a href="/jobs" style={{ fontSize: 13, color: '#5A6B7A', textDecoration: 'none', fontWeight: 500 }}>Jobs</a>
            <a href="/waitlist" style={{ fontSize: 13, color: '#5A6B7A', textDecoration: 'none', fontWeight: 500 }}>Waitlist</a>
          </div>
          <a href="/waitlist" style={{ padding: '8px 18px', background: '#185FA5', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Join waitlist</a>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: '#0D1B2A', padding: '52px 32px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)', width: 800, height: 400, background: 'radial-gradient(ellipse,rgba(24,95,165,.12) 0%,transparent 65%)', animation: 'glow 6s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'rgba(24,95,165,.3)', color: '#85B7EB', fontSize: 12, fontWeight: 600, borderRadius: 20, marginBottom: 18 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#85B7EB' }} />
            Florida Sign Permit Intelligence
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: '#fff', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 12 }}>
            Look up any jurisdiction.<br /><span style={{ color: '#85B7EB' }}>In seconds, not hours.</span>
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.5)', lineHeight: 1.65, marginBottom: 32, maxWidth: 500 }}>
            Sign codes by sign type, required docs, red flags, and contact info — researched and verified for Florida's most active markets.
          </p>

          {/* Search box */}
          <div style={{ background: 'rgba(255,255,255,.07)', borderRadius: 14, border: '1px solid rgba(255,255,255,.1)', padding: '22px 24px', maxWidth: 640 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6 }}>
                  Address Search <span style={{ background: '#F59E0B', color: '#fff', fontSize: 9, padding: '1px 5px', borderRadius: 20, fontWeight: 700, marginLeft: 4 }}>SOON</span>
                </div>
                <input disabled placeholder="123 Main St, Fort Lauderdale…" style={{ width: '100%', padding: '9px 12px', border: '1px solid rgba(255,255,255,.1)', borderRadius: 7, fontSize: 13, color: 'rgba(255,255,255,.25)', background: 'rgba(255,255,255,.05)', cursor: 'not-allowed', fontFamily: 'inherit' }} />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6 }}>Select Jurisdiction</div>
                <select
                  value={jur}
                  onChange={e => setJur(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid rgba(255,255,255,.15)', borderRadius: 7, fontSize: 13, color: jur ? '#fff' : 'rgba(255,255,255,.4)', background: 'rgba(255,255,255,.08)', cursor: 'pointer', fontFamily: 'inherit', outline: 'none' }}
                >
                  <option value="">— Choose a city or county —</option>
                  {JURISDICTIONS.map(o => (
                    <option key={o.value} value={o.value} style={{ background: '#1a2a3a', color: '#fff' }}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={doLookup}
              style={{ width: '100%', padding: 13, background: '#185FA5', color: '#fff', border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(24,95,165,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {status === 'loading'
                ? <><div style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .8s linear infinite' }} /> Loading...</>
                : '🔍 Run Permit Lookup'}
            </button>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.22)', marginTop: 12 }}>18 jurisdictions covered · Verified sign code data · Verbatim ordinance text</div>
        </div>
      </div>

      {/* STATS */}
      <div style={{ background: 'linear-gradient(135deg,#0D1B2A 0%,#163C6A 50%,#185FA5 100%)', padding: '36px 32px', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: .04, backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', position: 'relative', zIndex: 1 }}>
          {[['18','FL jurisdictions'],['2–4 hrs','Saved per job'],['$0','Cost to look up'],['100%','Publicly sourced']].map(([n,l],i) => (
            <div key={n} style={{ textAlign: 'center', padding: '0 16px', borderRight: i < 3 ? '1px solid rgba(255,255,255,.1)' : 'none' }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: '-1px', lineHeight: 1, marginBottom: 5 }}>{n}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ERROR */}
      {status === 'error' && (
        <div style={{ maxWidth: 860, margin: '24px auto', padding: '0 32px' }}>
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '14px 18px', color: '#B91C1C', fontSize: 13 }}>⚠ Could not load data. Please try again.</div>
        </div>
      )}

      {/* LOADING */}
      {status === 'loading' && (
        <div style={{ padding: '64px 32px', textAlign: 'center' }}>
          <div style={{ width: 36, height: 36, border: '3px solid #E2E8F0', borderTopColor: '#185FA5', borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto 16px' }} />
          <div style={{ fontSize: 14, color: '#5A6B7A' }}>Pulling jurisdiction data...</div>
        </div>
      )}

      {/* RESULTS */}
      {status === 'done' && data && (
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 32px 80px' }}>

          {/* Header */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: '20px 24px', marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0D1B2A', letterSpacing: '-.5px', marginBottom: 3 }}>{data.jurisdiction}</h2>
                <div style={{ fontSize: 12, color: '#9BA8B4' }}>
                  {data.county}{data.lastVerified && ` · Last verified: ${new Date(data.lastVerified).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}`}
                </div>
                {data.codeChapter && <div style={{ marginTop: 6, fontSize: 11, color: '#5A6B7A', background: '#F4F7FA', padding: '3px 9px', borderRadius: 5, display: 'inline-block' }}>{data.codeChapter}</div>}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {data.ownerSignatureRequired && <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: '#FEF3C7', color: '#92400E', fontWeight: 700 }}>Owner sig required</span>}
                {data.masterSignProgramRequired && <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: '#FCEBEB', color: '#791F1F', fontWeight: 700 }}>MSP required</span>}
                {data.designReviewRequired && <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: '#FCEBEB', color: '#791F1F', fontWeight: 700 }}>Design review required</span>}
                {data.contractorRegistrationRequired && <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: '#FCEBEB', color: '#791F1F', fontWeight: 700 }}>Contractor reg. required</span>}
                {data.emcAllowed === true && <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: '#DCFCE7', color: '#15803D', fontWeight: 700 }}>✓ EMC Allowed</span>}
                {data.emcAllowed === false && <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: '#FEE2E2', color: '#B91C1C', fontWeight: 700 }}>✗ EMC Banned</span>}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, paddingTop: 14, borderTop: '1px solid #F4F7FA' }}>
              {[['Turnaround', data.turnaround], ['Fees', data.fees], ['Phone', data.phone]].map(([l,v]) => v ? (
                <div key={String(l)}><div style={{ fontSize: 10, fontWeight: 700, color: '#9BA8B4', textTransform: 'uppercase', marginBottom: 2 }}>{l}</div><div style={{ fontSize: 12, fontWeight: 600, color: '#0D1B2A' }}>{v}</div></div>
              ) : null)}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
            {[
              { key: 'signs',    label: hasZoning ? '📐 Sign Types' : '📋 Summary' },
              { key: 'flags',    label: `🚩 Red Flags (${data.redFlags?.length || 0})` },
              { key: 'docs',     label: `📄 Docs (${data.requiredDocs?.length || 0})` },
              { key: 'contacts', label: '📞 Contacts' },
              { key: 'code',     label: '📖 Code Language' },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setTab(key)}
                style={{ fontSize: 12, padding: '6px 13px', borderRadius: 20, border: '1px solid', borderColor: tab === key ? '#185FA5' : '#E2E8F0', background: tab === key ? '#185FA5' : '#fff', color: tab === key ? '#fff' : '#5A6B7A', cursor: 'pointer', fontFamily: 'inherit', fontWeight: tab === key ? 700 : 400 }}>
                {label}
              </button>
            ))}
          </div>

          {/* SIGN TYPES */}
          {tab === 'signs' && (
            <>
              {hasZoning ? data.zoningDistricts.map((d: any, di: number) => (
                <div key={di} style={{ marginBottom: 24 }}>
                  <div style={{ background: '#0D1B2A', borderRadius: 10, padding: '11px 16px', marginBottom: 10 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 2 }}>{d.districtCode} — {d.districtName}</div>
                    {d.overlay && <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)' }}>{d.overlay}</div>}
                  </div>
                  {Object.entries(d.signTypes).map(([k, v]) => (
                    <SignTypeCard key={k} typeKey={k} rules={v} />
                  ))}
                </div>
              )) : (
                <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: '20px 24px' }}>
                  <div style={{ background: '#FEF3C7', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 12, color: '#92400E' }}>
                    ⚠ This jurisdiction hasn't been fully broken out by sign type yet. Full detail coming soon.
                  </div>
                  {data.maxHeight && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F4F7FA' }}><span style={{ color: '#5A6B7A', fontSize: 13 }}>Max height</span><strong style={{ fontSize: 13 }}>{data.maxHeight}</strong></div>}
                  {data.maxArea && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F4F7FA' }}><span style={{ color: '#5A6B7A', fontSize: 13 }}>Max area</span><strong style={{ fontSize: 13 }}>{data.maxArea}</strong></div>}
                  {data.setback && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F4F7FA' }}><span style={{ color: '#5A6B7A', fontSize: 13 }}>Setback</span><strong style={{ fontSize: 13 }}>{data.setback}</strong></div>}
                  {data.emcNotes && <div style={{ marginTop: 10, background: '#F4F7FA', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: '#5A6B7A' }}>{data.emcNotes}</div>}
                  {data.engineerSealRequired && <div style={{ marginTop: 8, background: '#FEF3C7', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: '#92400E' }}><strong>Engineer seal: </strong>{data.engineerSealRequired}</div>}
                </div>
              )}
            </>
          )}

          {/* RED FLAGS */}
          {tab === 'flags' && (
            <div>
              {data.redFlags?.length > 0
                ? data.redFlags.map((f: string, i: number) => (
                  <div key={i} style={{ background: '#fff', borderRadius: 10, border: '1px solid #FECACA', padding: '12px 16px', display: 'flex', gap: 10, marginBottom: 8, boxShadow: '0 1px 3px rgba(0,0,0,.03)' }}>
                    <span>🚩</span>
                    <span style={{ fontSize: 13, color: '#0D1B2A', lineHeight: 1.55 }}>{f}</span>
                  </div>
                ))
                : <p style={{ fontSize: 13, color: '#9BA8B4' }}>No red flags on file.</p>
              }
              {data.practitionerNotes?.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#5A6B7A', marginBottom: 8, textTransform: 'uppercase' }}>Field Notes</div>
                  {data.practitionerNotes.map((n: string, i: number) => (
                    <div key={i} style={{ background: '#fff', borderRadius: 10, border: '1px solid #E2E8F0', padding: '11px 14px', display: 'flex', gap: 8, marginBottom: 6 }}>
                      <span style={{ color: '#185FA5', fontWeight: 700 }}>→</span>
                      <span style={{ fontSize: 13, color: '#5A6B7A', lineHeight: 1.55 }}>{n}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* DOCS */}
          {tab === 'docs' && (
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: '20px 24px' }}>
              {data.requiredDocs?.length > 0
                ? data.requiredDocs.map((d: string, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderBottom: i < data.requiredDocs.length - 1 ? '1px solid #F4F7FA' : 'none' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#185FA5' }}>{i + 1}</span>
                    </div>
                    <span style={{ fontSize: 13, color: '#0D1B2A', lineHeight: 1.5 }}>{d}</span>
                  </div>
                ))
                : <p style={{ fontSize: 13, color: '#9BA8B4' }}>No required docs on file yet.</p>
              }
            </div>
          )}

          {/* CONTACTS */}
          {tab === 'contacts' && (
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: '20px 24px' }}>
              {data.contacts?.length > 0
                ? data.contacts.map((c: any, i: number) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: i < data.contacts.length - 1 ? '1px solid #F4F7FA' : 'none', flexWrap: 'wrap', gap: 8 }}>
                    <span style={{ fontSize: 13, color: '#5A6B7A' }}>{c.label}</span>
                    {c.value.startsWith('http')
                      ? <a href={c.value} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 700, color: '#185FA5', textDecoration: 'none' }}>Open portal →</a>
                      : <span style={{ fontSize: 13, fontWeight: 700, color: '#0D1B2A' }}>{c.value}</span>
                    }
                  </div>
                ))
                : <p style={{ fontSize: 13, color: '#9BA8B4' }}>No contacts on file yet.</p>
              }
              {data.portalUrl && <a href={data.portalUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 14, padding: '9px 18px', background: '#185FA5', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Open Permit Portal →</a>}
            </div>
          )}

          {/* CODE LANGUAGE */}
          {tab === 'code' && (
            <div>
              {data.codeLanguage?.length > 0 ? (
                <>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                    {['plain', 'verbatim'].map(t => (
                      <button key={t} onClick={() => setCodeView(t)}
                        style={{ fontSize: 12, padding: '5px 13px', borderRadius: 20, border: '1px solid', borderColor: codeView === t ? '#185FA5' : '#E2E8F0', background: codeView === t ? '#185FA5' : '#fff', color: codeView === t ? '#fff' : '#5A6B7A', cursor: 'pointer', fontFamily: 'inherit', fontWeight: codeView === t ? 700 : 400 }}>
                        {t === 'plain' ? 'Plain English' : 'Verbatim Ordinance'}
                      </button>
                    ))}
                  </div>
                  {data.codeLanguage.map((cs: any, i: number) => (
                    <div key={i} style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', padding: '14px 16px', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#185FA5', background: 'rgba(24,95,165,.07)', padding: '2px 7px', borderRadius: 5 }}>{cs.section}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#0D1B2A' }}>{cs.title}</span>
                      </div>
                      {codeView === 'verbatim'
                        ? <div style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 1.65, color: '#5A6B7A', background: '#F4F7FA', borderLeft: '3px solid #BFDBFE', padding: '10px 12px', borderRadius: '0 8px 8px 0' }}>{cs.verbatim}</div>
                        : <div style={{ fontSize: 13, lineHeight: 1.6, color: '#0D1B2A', background: '#F0FDF4', borderLeft: '3px solid #86EFAC', padding: '10px 12px', borderRadius: '0 8px 8px 0' }}>{cs.simplified}</div>
                      }
                    </div>
                  ))}
                </>
              ) : (
                <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: '32px', textAlign: 'center', color: '#9BA8B4', fontSize: 13 }}>No code language on file yet for this jurisdiction.</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* DISCLAIMER */}
      <div style={{ padding: '20px 32px', background: '#F4F7FA', borderTop: '1px solid #E8EDF2' }}>
        <p style={{ fontSize: 11, color: '#B4B2A9', lineHeight: 1.7, textAlign: 'center', maxWidth: 700, margin: '0 auto' }}>
          SignCode Pro provides general permit guidance based on publicly available sources. Requirements vary by jurisdiction and change over time. Always verify directly with the jurisdiction before submitting. Not a legal authority.
        </p>
      </div>

      {/* CTA */}
      <section style={{ padding: '72px 32px', background: 'linear-gradient(135deg,#0D1B2A 0%,#185FA5 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: .04, backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 34, fontWeight: 800, color: '#fff', marginBottom: 12, letterSpacing: '-.5px', lineHeight: 1.18 }}>A better starting point<br />for every permit job</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.6)', marginBottom: 28, lineHeight: 1.7 }}>Join sign professionals already on the waitlist.</p>
          <a href="/waitlist" style={{ display: 'inline-block', padding: '12px 26px', background: '#fff', color: '#185FA5', borderRadius: 9, fontSize: 13, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,0,0,.2)' }}>Join waitlist →</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '22px 32px', borderTop: '1px solid #E8EDF2', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <svg width="18" height="18" viewBox="0 0 80 80"><rect width="80" height="80" rx="14" fill="#185FA5"/><rect x="10" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="10" y="46" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="46" width="24" height="24" rx="5" fill="#fff"/><path d="M50 60l4 4 8-9" stroke="#185FA5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0D1B2A' }}>Sign<span style={{ color: '#185FA5' }}>Code</span> Pro</span>
          </div>
          <div style={{ display: 'flex', gap: 22 }}>
            {[['Lookup','/lookup'],['Jobs','/jobs'],['Waitlist','/waitlist']].map(([l,h]) => (
              <a key={l} href={h} style={{ fontSize: 12, color: '#9BA8B4', textDecoration: 'none', fontWeight: 500 }}>{l}</a>
            ))}
          </div>
          <div style={{ fontSize: 11, color: '#B4B2A9' }}>© 2026 SignCode Pro. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
