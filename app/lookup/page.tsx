'use client';
import { useState, useRef, useCallback } from 'react';

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

const SIGN_LABELS: Record<string, { label: string; icon: string }> = {
  wall:           { label: 'Wall Signs',         icon: '🏢' },
  channelLetters: { label: 'Channel Letters',     icon: '✏️' },
  monument:       { label: 'Monument Signs',      icon: '🪨' },
  pylon:          { label: 'Pylon / Pole Signs',  icon: '🚩' },
  awning:         { label: 'Awning Signs',        icon: '⛺' },
  projecting:     { label: 'Projecting Signs',    icon: '📐' },
  window:         { label: 'Window Signs',        icon: '🪟' },
  emc:            { label: 'EMC / Digital',       icon: '📺' },
  temporary:      { label: 'Temporary Signs',     icon: '📋' },
  directional:    { label: 'Directional Signs',   icon: '➡️' },
};

const CONF: Record<string, { bg: string; color: string; label: string }> = {
  verified: { bg: '#EAF3DE', color: '#27500A', label: '✓ Verified' },
  high:     { bg: '#EAF3DE', color: '#27500A', label: '✓ High confidence' },
  medium:   { bg: '#FEF3C7', color: '#92400E', label: '⚠ Verify at intake' },
  low:      { bg: '#FCEBEB', color: '#791F1F', label: '⚠ Unconfirmed' },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #F4F7FA', gap: '12px' }}>
      <span style={{ fontSize: '12px', color: '#5A6B7A', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: '12px', fontWeight: '700', color: '#0D1B2A', textAlign: 'right' as const }}>{value}</span>
    </div>
  );
}

function SignCard({ typeKey, rules }: { typeKey: string; rules: any }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'specs' | 'code'>('specs');
  const cfg = SIGN_LABELS[typeKey] || { label: typeKey, icon: '📋' };
  const conf = CONF[rules.confidence || 'medium'] || CONF.medium;
  const isBanned = (typeKey === 'pylon' && rules.simplifiedText?.toLowerCase().includes('prohibited')) || (typeKey === 'emc' && rules.emcAllowed === false);
  const hasTimeclock = rules.timeclockRequired !== undefined || rules.photocellRequired !== undefined || rules.astronomicalTimeclockRequired !== undefined;

  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: `1.5px solid ${isBanned ? '#FECACA' : '#E8EDF2'}`, overflow: 'hidden', marginBottom: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: '18px', flexShrink: 0 }}>{cfg.icon}</span>
          <div style={{ minWidth: 0, textAlign: 'left' as const }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: isBanned ? '#B91C1C' : '#0D1B2A' }}>{cfg.label}</div>
            <div style={{ fontSize: '11px', color: '#9BA8B4', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '400px' }}>
              {isBanned ? '🚫 NOT PERMITTED in this jurisdiction' : (rules.simplifiedText?.substring(0, 75) + '…') || 'Tap to view details'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: '12px' }}>
          <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: conf.bg, color: conf.color, fontWeight: '600', whiteSpace: 'nowrap' as const }}>{conf.label}</span>
          <span style={{ color: '#9BA8B4', fontSize: '16px', display: 'inline-block', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }}>›</span>
        </div>
      </button>

      {open && (
        <div style={{ borderTop: '1px solid #F4F7FA' }}>
          <div style={{ display: 'flex', background: '#F9FAFB', borderBottom: '1px solid #E8EDF2' }}>
            {(['specs', 'code'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 16px', fontSize: '12px', fontWeight: tab === t ? '700' : '500', background: tab === t ? '#fff' : 'transparent', color: tab === t ? '#185FA5' : '#5A6B7A', border: 'none', borderBottom: tab === t ? '2px solid #185FA5' : '2px solid transparent', cursor: 'pointer', fontFamily: 'inherit' }}>
                {t === 'specs' ? 'Specifications' : 'Code Language'}
              </button>
            ))}
          </div>

          <div style={{ padding: '16px 18px' }}>
            {tab === 'specs' && (
              <div>
                {/* Dimensions */}
                {(rules.maxStructureHeightFt !== undefined || rules.maxFaceAreaSqft !== undefined || rules.maxLetterHeightIn !== undefined || rules.areaCalcValue !== undefined || rules.maxPerTenant !== undefined || rules.tempMaxSqft !== undefined) && (
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#9BA8B4', textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: '6px' }}>Dimensions</div>
                    {rules.maxStructureHeightFt !== undefined && <Row label="Max structure height" value={`${rules.maxStructureHeightFt} ft`} />}
                    {rules.maxFaceAreaSqft !== undefined && <Row label="Max face area" value={`${rules.maxFaceAreaSqft} sq ft`} />}
                    {rules.maxLetterHeightIn !== undefined && <Row label="Max letter height" value={`${rules.maxLetterHeightIn} in`} />}
                    {rules.areaCalcMethod === 'per_linear_ft_frontage' && rules.areaCalcValue !== undefined && <Row label="Area calc" value={`${rules.areaCalcValue} sq ft per linear ft of frontage`} />}
                    {rules.maxPerTenant !== undefined && <Row label="Max per tenant" value={String(rules.maxPerTenant)} />}
                    {rules.tempMaxSqft !== undefined && <Row label="Max size" value={`${rules.tempMaxSqft} sq ft`} />}
                    {rules.tempPermitRequired !== undefined && <Row label="Permit required" value={rules.tempPermitRequired ? 'Yes' : 'No'} />}
                  </div>
                )}

                {/* Placement */}
                {(rules.minSetbackRowFt !== undefined || rules.minSetbackPropertyFt !== undefined || rules.landscapingRequired !== undefined) && (
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#9BA8B4', textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: '6px' }}>Placement</div>
                    {rules.minSetbackRowFt !== undefined && <Row label="Min setback from ROW" value={typeof rules.minSetbackRowFt === 'number' ? `${rules.minSetbackRowFt} ft` : String(rules.minSetbackRowFt)} />}
                    {rules.minSetbackPropertyFt !== undefined && <Row label="Min setback from property line" value={String(rules.minSetbackPropertyFt)} />}
                    {rules.landscapingRequired !== undefined && <Row label="Landscaping at base" value={rules.landscapingRequired ? 'Required' : 'Not required'} />}
                  </div>
                )}

                {/* Illumination */}
                {(rules.illuminationAllowed !== undefined || rules.faceLitAllowed !== undefined || rules.reverseHaloLitAllowed !== undefined || rules.openFaceNeonAllowed !== undefined) && (
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#9BA8B4', textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: '6px' }}>Illumination</div>
                    {rules.illuminationAllowed !== undefined && <Row label="Illumination allowed" value={rules.illuminationAllowed ? 'Yes' : 'No'} />}
                    {rules.faceLitAllowed !== undefined && <Row label="Face lit / front lit" value={rules.faceLitAllowed ? '✓ Allowed' : '✗ Not allowed'} />}
                    {rules.reverseHaloLitAllowed !== undefined && <Row label="Reverse / halo lit" value={rules.reverseHaloLitAllowed ? '✓ Allowed' : '✗ Not allowed'} />}
                    {rules.openFaceNeonAllowed !== undefined && <Row label="Open face neon" value={rules.openFaceNeonAllowed ? '✓ Allowed' : '✗ Not allowed'} />}
                  </div>
                )}

                {/* Timeclock */}
                {hasTimeclock && (
                  <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '8px', padding: '12px 14px', marginBottom: '14px' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#92400E', textTransform: 'uppercase' as const, marginBottom: '8px' }}>⏰ Illumination Controls</div>
                    {rules.timeclockRequired !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}><span style={{ fontSize: '12px', color: '#92400E' }}>Timeclock (city)</span><strong style={{ fontSize: '12px', color: '#92400E' }}>{rules.timeclockRequired ? '✓ Required' : 'Not required'}</strong></div>}
                    {rules.photocellRequired !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}><span style={{ fontSize: '12px', color: '#92400E' }}>Photocell</span><strong style={{ fontSize: '12px', color: '#92400E' }}>{rules.photocellRequired ? '✓ Required' : 'Not required'}</strong></div>}
                    {rules.astronomicalTimeclockRequired !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}><span style={{ fontSize: '12px', color: '#92400E' }}>Astronomical timeclock</span><strong style={{ fontSize: '12px', color: '#92400E' }}>{rules.astronomicalTimeclockRequired ? '✓ Required' : 'Not required'}</strong></div>}
                  </div>
                )}

                {/* EMC */}
                {rules.emcAllowed !== undefined && (
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#9BA8B4', textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: '6px' }}>EMC / Digital</div>
                    <Row label="EMC allowed" value={rules.emcAllowed ? 'Yes' : '🚫 No — Prohibited'} />
                    {rules.emcMinMessageHoldSec !== undefined && <Row label="Min message hold" value={`${rules.emcMinMessageHoldSec} sec`} />}
                    {rules.emcMaxBrightnessDay !== undefined && <Row label="Max brightness (day)" value={`${rules.emcMaxBrightnessDay} nits`} />}
                    {rules.emcMaxBrightnessNight !== undefined && <Row label="Max brightness (night)" value={`${rules.emcMaxBrightnessNight} nits`} />}
                    {rules.emcAnimationAllowed !== undefined && <Row label="Animation" value={rules.emcAnimationAllowed ? 'Allowed' : 'Not allowed'} />}
                    {rules.emcScrollingAllowed !== undefined && <Row label="Scrolling text" value={rules.emcScrollingAllowed ? 'Allowed' : 'Not allowed'} />}
                  </div>
                )}

                {rules.notes && (
                  <div style={{ background: '#F4F7FA', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: '#5A6B7A', lineHeight: '1.6' }}>
                    <strong style={{ color: '#0D1B2A', display: 'block', marginBottom: '3px' }}>📌 Notes</strong>
                    {rules.notes}
                  </div>
                )}
              </div>
            )}

            {tab === 'code' && (
              <div>
                {rules.codeSection && <div style={{ fontSize: '11px', fontWeight: '700', color: '#185FA5', background: '#EFF6FF', padding: '4px 10px', borderRadius: '5px', display: 'inline-block', marginBottom: '10px' }}>{rules.codeSection}</div>}
                {rules.simplifiedText && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#9BA8B4', textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: '5px' }}>Plain English</div>
                    <div style={{ fontSize: '13px', color: '#0D1B2A', lineHeight: '1.6', background: '#F0FDF4', borderLeft: '3px solid #86EFAC', padding: '10px 12px', borderRadius: '0 8px 8px 0' }}>{rules.simplifiedText}</div>
                  </div>
                )}
                {rules.verbatimText && (
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#9BA8B4', textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: '5px' }}>Verbatim Ordinance</div>
                    <div style={{ fontSize: '12px', color: '#5A6B7A', lineHeight: '1.65', background: '#F4F7FA', borderLeft: '3px solid #BFDBFE', padding: '10px 12px', borderRadius: '0 8px 8px 0', fontStyle: 'italic' }}>"{rules.verbatimText}"</div>
                  </div>
                )}
                {!rules.simplifiedText && !rules.verbatimText && <p style={{ fontSize: '13px', color: '#9BA8B4' }}>No code language on file yet.</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LookupPage() {
  const [jurVal, setJurVal] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [section, setSection] = useState('signs');
  const [codeTab, setCodeTab] = useState('simplified');
  const resultsRef = useRef<HTMLDivElement>(null);

  const runLookup = useCallback(async (jur: string) => {
    if (!jur) return;
    setLoading(true);
    setError('');
    setResult(null);
    setSection('signs');
    try {
      const res = await fetch(`/api/lookup?jurisdiction=${jur}`);
      const json = await res.json();
      const data = json.data || json;
      setResult(data);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
    } catch (e) {
      setError('Could not load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const hasZoning = result?.zoningDistricts?.length > 0;

  return (
    <main style={{ fontFamily: "'DM Sans','Segoe UI',Arial,sans-serif", background: '#F4F7FA', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes glow{0%,100%{opacity:.45}50%{opacity:.75}}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      {/* NAV */}
      <nav style={{ background: 'rgba(250,251,253,0.96)', borderBottom: '1px solid rgba(0,0,0,0.07)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(14px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', maxWidth: '1200px', margin: '0 auto', height: '62px' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none' }}>
            <svg width="28" height="28" viewBox="0 0 80 80"><rect width="80" height="80" rx="14" fill="#185FA5"/><rect x="10" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="10" y="46" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="46" width="24" height="24" rx="5" fill="#fff"/><path d="M50 60l4 4 8-9" stroke="#185FA5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#0D1B2A', letterSpacing: '-.2px' }}>Sign<span style={{ color: '#185FA5' }}>Code</span> Pro</span>
          </a>
          <div style={{ display: 'flex', gap: '32px' }}>
            <a href="/lookup" style={{ fontSize: '13px', color: '#185FA5', textDecoration: 'none', fontWeight: '600' }}>Lookup</a>
            <a href="/jobs" style={{ fontSize: '13px', color: '#5A6B7A', textDecoration: 'none', fontWeight: '500' }}>Jobs</a>
            <a href="/waitlist" style={{ fontSize: '13px', color: '#5A6B7A', textDecoration: 'none', fontWeight: '500' }}>Waitlist</a>
          </div>
          <a href="/waitlist" style={{ padding: '8px 20px', background: '#185FA5', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: '600', textDecoration: 'none', boxShadow: '0 2px 8px rgba(24,95,165,.28)' }}>Join waitlist</a>
        </div>
      </nav>

      {/* HERO — dark, matches jobs page */}
      <section style={{ background: '#0D1B2A', padding: '56px 48px 64px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '400px', background: 'radial-gradient(ellipse at center,rgba(24,95,165,0.12) 0%,transparent 65%)', pointerEvents: 'none', animation: 'glow 6s ease-in-out infinite' }} />
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '5px 14px', background: 'rgba(24,95,165,0.3)', color: '#85B7EB', fontSize: '12px', fontWeight: '600', borderRadius: '20px', marginBottom: '20px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#85B7EB' }} />
            Florida Sign Permit Intelligence
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: '800', color: '#fff', letterSpacing: '-1.5px', marginBottom: '12px', lineHeight: 1.1 }}>
            Look up any jurisdiction.<br /><span style={{ color: '#85B7EB' }}>In seconds, not hours.</span>
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,.5)', lineHeight: 1.65, marginBottom: '36px', maxWidth: '520px' }}>
            Sign codes by sign type, required docs, red flags, and contact info — researched and verified for Florida's most active markets.
          </p>

          {/* Search box */}
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', padding: '24px 28px', maxWidth: '680px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '7px' }}>
                  Address Search <span style={{ background: '#F59E0B', color: '#fff', fontSize: '9px', padding: '1px 6px', borderRadius: '20px', fontWeight: '700', marginLeft: '4px' }}>SOON</span>
                </div>
                <input disabled placeholder="123 Main St, Fort Lauderdale…" style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '13px', color: 'rgba(255,255,255,.25)', background: 'rgba(255,255,255,0.05)', cursor: 'not-allowed', fontFamily: 'inherit' }} />
              </div>
              <div>
                <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '7px' }}>Select Jurisdiction</div>
                <select
                  value={jurVal}
                  onChange={e => setJurVal(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '13px', color: jurVal ? '#fff' : 'rgba(255,255,255,.4)', background: 'rgba(255,255,255,0.08)', cursor: 'pointer', fontFamily: 'inherit', outline: 'none' }}>
                  <option value="">— Choose a city or county —</option>
                  {JURISDICTIONS.map(o => <option key={o.value} value={o.value} style={{ background: '#1a2a3a', color: '#fff' }}>{o.label}</option>)}
                </select>
              </div>
            </div>
            <button
              onClick={() => runLookup(jurVal)}
              disabled={loading}
              style={{ width: '100%', padding: '13px', background: '#185FA5', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(24,95,165,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {loading
                ? <><div style={{ width: '15px', height: '15px', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />Loading...</>
                : '🔍 Run Permit Lookup'}
            </button>
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.25)', marginTop: '14px' }}>18 jurisdictions covered · Verified sign code data · Verbatim ordinance text</div>
        </div>
      </section>

      {/* STATS BAND */}
      <div style={{ background: 'linear-gradient(135deg,#0D1B2A 0%,#163C6A 50%,#185FA5 100%)', padding: '40px 48px', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: .04, backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          {[['18','FL jurisdictions'],['2–4 hrs','Time saved per job'],['$0','Cost to look up'],['100%','Publicly sourced']].map(([n,l],i) => (
            <div key={n} style={{ textAlign: 'center', padding: '0 20px', borderRight: i < 3 ? '1px solid rgba(255,255,255,.1)' : 'none' }}>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#fff', letterSpacing: '-1px', lineHeight: 1, marginBottom: '6px' }}>{n}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.45)' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div style={{ maxWidth: '900px', margin: '24px auto', padding: '0 48px' }}>
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '14px 18px', fontSize: '13px', color: '#B91C1C' }}>⚠ {error}</div>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div style={{ padding: '64px', textAlign: 'center' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #E2E8F0', borderTopColor: '#185FA5', borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto 16px' }} />
          <div style={{ fontSize: '14px', color: '#5A6B7A' }}>Pulling jurisdiction data...</div>
        </div>
      )}

      {/* RESULTS */}
      {result && !loading && (
        <div ref={resultsRef} style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 48px 80px' }}>

          {/* Header card */}
          <div style={{ background: '#fff', borderRadius: '14px', border: '1.5px solid #E8EDF2', padding: '22px 26px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0D1B2A', letterSpacing: '-.5px', marginBottom: '3px' }}>{result.jurisdiction}</h2>
                <div style={{ fontSize: '12px', color: '#9BA8B4' }}>
                  {result.county}{result.lastVerified && ` · Last verified: ${new Date(result.lastVerified).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}`}
                </div>
                {result.codeChapter && <div style={{ marginTop: '7px', fontSize: '11px', color: '#5A6B7A', background: '#F4F7FA', padding: '4px 10px', borderRadius: '6px', display: 'inline-block' }}>{result.codeChapter}</div>}
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {result.ownerSignatureRequired && <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: '#FEF3C7', color: '#92400E', fontWeight: '700' }}>Owner sig required</span>}
                {result.masterSignProgramRequired && <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: '#FCEBEB', color: '#791F1F', fontWeight: '700' }}>MSP required</span>}
                {result.designReviewRequired && <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: '#FCEBEB', color: '#791F1F', fontWeight: '700' }}>Design review required</span>}
                {result.contractorRegistrationRequired && <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: '#FCEBEB', color: '#791F1F', fontWeight: '700' }}>Contractor registration</span>}
                {result.emcAllowed === true && <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: '#DCFCE7', color: '#15803D', fontWeight: '700' }}>✓ EMC Allowed</span>}
                {result.emcAllowed === false && <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: '#FEE2E2', color: '#B91C1C', fontWeight: '700' }}>✗ EMC Banned</span>}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', paddingTop: '14px', borderTop: '1px solid #F4F7FA' }}>
              {[['Turnaround', result.turnaround], ['Fees', result.fees], ['Phone', result.phone]].map(([l,v]) => v ? (
                <div key={l as string}><div style={{ fontSize: '10px', fontWeight: '700', color: '#9BA8B4', textTransform: 'uppercase' as const, marginBottom: '2px' }}>{l}</div><div style={{ fontSize: '12px', fontWeight: '600', color: '#0D1B2A' }}>{v}</div></div>
              ) : null)}
            </div>
          </div>

          {/* Section tabs */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '18px', flexWrap: 'wrap' }}>
            {[
              { key: 'signs',    label: hasZoning ? '📐 Sign Types' : '📋 Summary' },
              { key: 'flags',    label: `🚩 Red Flags (${result.redFlags?.length || 0})` },
              { key: 'docs',     label: `📄 Docs (${result.requiredDocs?.length || 0})` },
              { key: 'contacts', label: '📞 Contacts' },
              { key: 'code',     label: '📖 Code Language' },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setSection(key)}
                style={{ fontSize: '12px', padding: '7px 14px', borderRadius: '20px', border: '1px solid', borderColor: section === key ? '#185FA5' : '#E2E8F0', background: section === key ? '#185FA5' : '#fff', color: section === key ? '#fff' : '#5A6B7A', cursor: 'pointer', fontFamily: 'inherit', fontWeight: section === key ? '700' : '400' }}>
                {label}
              </button>
            ))}
          </div>

          {/* SIGN TYPES */}
          {section === 'signs' && (
            <>
              {hasZoning ? result.zoningDistricts.map((d: any, di: number) => (
                <div key={di} style={{ marginBottom: '24px' }}>
                  <div style={{ background: '#0D1B2A', borderRadius: '10px', padding: '12px 16px', marginBottom: '10px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff', marginBottom: '2px' }}>{d.districtCode} — {d.districtName}</div>
                    {d.overlay && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.4)' }}>{d.overlay}</div>}
                  </div>
                  {Object.entries(d.signTypes).map(([k, v]) => <SignCard key={k} typeKey={k} rules={v} />)}
                </div>
              )) : (
                <div style={{ background: '#fff', borderRadius: '14px', border: '1.5px solid #E8EDF2', padding: '22px 26px' }}>
                  <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '12px', color: '#92400E' }}>
                    ⚠ This jurisdiction hasn't been fully broken out by sign type yet.
                  </div>
                  {result.maxHeight && <Row label="Max height" value={result.maxHeight} />}
                  {result.maxArea && <Row label="Max area" value={result.maxArea} />}
                  {result.setback && <Row label="Setback" value={result.setback} />}
                  {result.emcNotes && <div style={{ marginTop: '10px', background: '#F4F7FA', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: '#5A6B7A' }}>{result.emcNotes}</div>}
                  {result.engineerSealRequired && <div style={{ marginTop: '8px', background: '#FEF3C7', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: '#92400E' }}><strong>Engineer seal: </strong>{result.engineerSealRequired}</div>}
                </div>
              )}
            </>
          )}

          {/* RED FLAGS */}
          {section === 'flags' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {result.redFlags?.length > 0
                ? result.redFlags.map((f: string, i: number) => (
                  <div key={i} style={{ background: '#fff', borderRadius: '10px', border: '1.5px solid #FECACA', padding: '14px 16px', display: 'flex', gap: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <span style={{ flexShrink: 0 }}>🚩</span>
                    <span style={{ fontSize: '13px', color: '#0D1B2A', lineHeight: '1.55' }}>{f}</span>
                  </div>
                ))
                : <p style={{ fontSize: '13px', color: '#9BA8B4' }}>No red flags on file.</p>
              }
              {result.practitionerNotes?.length > 0 && (
                <div style={{ marginTop: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#5A6B7A', marginBottom: '8px', textTransform: 'uppercase' as const }}>Practitioner Notes</div>
                  {result.practitionerNotes.map((n: string, i: number) => (
                    <div key={i} style={{ background: '#fff', borderRadius: '10px', border: '1.5px solid #E8EDF2', padding: '12px 16px', display: 'flex', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ color: '#185FA5', fontWeight: '700', flexShrink: 0 }}>→</span>
                      <span style={{ fontSize: '13px', color: '#5A6B7A', lineHeight: '1.55' }}>{n}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* DOCS */}
          {section === 'docs' && (
            <div style={{ background: '#fff', borderRadius: '14px', border: '1.5px solid #E8EDF2', padding: '22px 26px' }}>
              {result.requiredDocs?.length > 0
                ? result.requiredDocs.map((d: string, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 0', borderBottom: i < result.requiredDocs.length - 1 ? '1px solid #F4F7FA' : 'none' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                      <span style={{ fontSize: '10px', fontWeight: '700', color: '#185FA5' }}>{i + 1}</span>
                    </div>
                    <span style={{ fontSize: '13px', color: '#0D1B2A', lineHeight: '1.5' }}>{d}</span>
                  </div>
                ))
                : <p style={{ fontSize: '13px', color: '#9BA8B4' }}>No required docs on file yet.</p>
              }
            </div>
          )}

          {/* CONTACTS */}
          {section === 'contacts' && (
            <div style={{ background: '#fff', borderRadius: '14px', border: '1.5px solid #E8EDF2', padding: '22px 26px' }}>
              {result.contacts?.length > 0
                ? result.contacts.map((c: any, i: number) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < result.contacts.length - 1 ? '1px solid #F4F7FA' : 'none', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#5A6B7A' }}>{c.label}</span>
                    {c.value.startsWith('http')
                      ? <a href={c.value} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', fontWeight: '700', color: '#185FA5', textDecoration: 'none' }}>Open portal →</a>
                      : <span style={{ fontSize: '13px', fontWeight: '700', color: '#0D1B2A' }}>{c.value}</span>
                    }
                  </div>
                ))
                : <p style={{ fontSize: '13px', color: '#9BA8B4' }}>No contacts on file yet.</p>
              }
              {result.portalUrl && <a href={result.portalUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '14px', padding: '9px 18px', background: '#185FA5', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>Open Permit Portal →</a>}
            </div>
          )}

          {/* CODE LANGUAGE */}
          {section === 'code' && (
            <div>
              {result.codeLanguage?.length > 0 ? (
                <>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
                    {['simplified', 'verbatim'].map(t => (
                      <button key={t} onClick={() => setCodeTab(t)}
                        style={{ fontSize: '12px', padding: '6px 14px', borderRadius: '20px', border: '1px solid', borderColor: codeTab === t ? '#185FA5' : '#E2E8F0', background: codeTab === t ? '#185FA5' : '#fff', color: codeTab === t ? '#fff' : '#5A6B7A', cursor: 'pointer', fontFamily: 'inherit', fontWeight: codeTab === t ? '700' : '400' }}>
                        {t === 'simplified' ? 'Plain English' : 'Verbatim Ordinance'}
                      </button>
                    ))}
                  </div>
                  {result.codeLanguage.map((cs: any, i: number) => (
                    <div key={i} style={{ background: '#fff', borderRadius: '12px', border: '1.5px solid #E8EDF2', padding: '16px 18px', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#185FA5', background: 'rgba(24,95,165,0.07)', padding: '2px 8px', borderRadius: '5px' }}>{cs.section}</span>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#0D1B2A' }}>{cs.title}</span>
                      </div>
                      {codeTab === 'verbatim'
                        ? <div style={{ fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.65', color: '#5A6B7A', background: '#F4F7FA', borderLeft: '3px solid #BFDBFE', padding: '10px 12px', borderRadius: '0 8px 8px 0' }}>{cs.verbatim}</div>
                        : <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#0D1B2A', background: '#F0FDF4', borderLeft: '3px solid #86EFAC', padding: '10px 12px', borderRadius: '0 8px 8px 0' }}>{cs.simplified}</div>
                      }
                    </div>
                  ))}
                </>
              ) : (
                <div style={{ background: '#fff', borderRadius: '14px', border: '1.5px solid #E8EDF2', padding: '32px', textAlign: 'center', color: '#9BA8B4', fontSize: '13px' }}>No code language on file yet.</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* DISCLAIMER */}
      <div style={{ padding: '20px 48px', background: '#F4F7FA', borderTop: '1px solid #E8EDF2' }}>
        <p style={{ fontSize: '11px', color: '#B4B2A9', lineHeight: '1.7', textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
          SignCode Pro provides general permit guidance based on publicly available sources. Requirements vary by jurisdiction and change over time. Always verify directly with the jurisdiction before submitting. Not a legal authority.
        </p>
      </div>

      {/* CTA */}
      <section style={{ padding: '80px 48px', background: 'linear-gradient(135deg,#0D1B2A 0%,#185FA5 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: .04, backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '520px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#fff', marginBottom: '14px', letterSpacing: '-.5px', lineHeight: 1.18 }}>A better starting point<br />for every permit job</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,.65)', marginBottom: '32px', lineHeight: 1.7 }}>Join sign professionals already on the waitlist.</p>
          <a href="/waitlist" style={{ display: 'inline-block', padding: '13px 28px', background: '#fff', color: '#185FA5', borderRadius: '9px', fontSize: '13px', fontWeight: '700', textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,0,0,.2)' }}>Join waitlist →</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '24px 48px', borderTop: '1px solid #E8EDF2', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 80 80"><rect width="80" height="80" rx="14" fill="#185FA5"/><rect x="10" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="10" y="46" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="46" width="24" height="24" rx="5" fill="#fff"/><path d="M50 60l4 4 8-9" stroke="#185FA5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#0D1B2A' }}>Sign<span style={{ color: '#185FA5' }}>Code</span> Pro</span>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            {[['Lookup','/lookup'],['Jobs','/jobs'],['Waitlist','/waitlist']].map(([l,h]) => (
              <a key={l} href={h} style={{ fontSize: '12px', color: '#9BA8B4', textDecoration: 'none', fontWeight: '500' }}>{l}</a>
            ))}
          </div>
          <div style={{ fontSize: '11px', color: '#B4B2A9' }}>© 2026 SignCode Pro. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
