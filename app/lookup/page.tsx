'use client';
import { useState, useEffect, useRef } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────
interface CodeSection {
  section: string;
  title: string;
  verbatim: string;
  simplified: string;
}

interface SignTypeRules {
  maxStructureHeightFt?: number | string;
  maxFaceAreaSqft?: number | string;
  maxLetterHeightIn?: number | string;
  areaCalcMethod?: string;
  areaCalcValue?: number | string;
  maxPerTenant?: number | string;
  minSetbackRowFt?: number | string;
  minSetbackPropertyFt?: number | string;
  landscapingRequired?: boolean;
  illuminationAllowed?: boolean;
  illuminationTypes?: string[];
  faceLitAllowed?: boolean;
  reverseHaloLitAllowed?: boolean;
  openFaceNeonAllowed?: boolean;
  timeclockRequired?: boolean;
  photocellRequired?: boolean;
  astronomicalTimeclockRequired?: boolean;
  emcAllowed?: boolean;
  emcMinMessageHoldSec?: number;
  emcMaxBrightnessDay?: number;
  emcMaxBrightnessNight?: number;
  emcAnimationAllowed?: boolean;
  emcScrollingAllowed?: boolean;
  tempMaxSqft?: number;
  tempPermitRequired?: boolean;
  codeSection?: string;
  verbatimText?: string;
  simplifiedText?: string;
  confidence?: string;
  notes?: string;
}

interface ZoningDistrict {
  districtCode: string;
  districtName: string;
  overlay?: string;
  signTypes: Record<string, SignTypeRules>;
}

interface JurisdictionResult {
  jurisdiction: string;
  county?: string;
  lastVerified?: string;
  codeChapter?: string;
  portalUrl?: string;
  phone?: string;
  ownerSignatureRequired?: boolean;
  masterSignProgramRequired?: boolean;
  engineerSealRequired?: string;
  designReviewRequired?: boolean;
  contractorRegistrationRequired?: boolean;
  redFlags?: string[];
  requiredDocs?: string[];
  contacts?: { label: string; value: string }[];
  fees?: string;
  turnaround?: string;
  practitionerNotes?: string[];
  zoningDistricts?: ZoningDistrict[];
  maxHeight?: string;
  maxArea?: string;
  setback?: string;
  emcAllowed?: boolean;
  emcNotes?: string;
  codeLanguage?: CodeSection[];
}

// ── Constants ──────────────────────────────────────────────────────────────
const JURISDICTION_OPTIONS = [
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

const SIGN_TYPE_CONFIG: Record<string, { label: string; icon: string }> = {
  wall:           { label: 'Wall Signs',          icon: '🏢' },
  channelLetters: { label: 'Channel Letters',      icon: '✏️' },
  monument:       { label: 'Monument Signs',       icon: '🪨' },
  pylon:          { label: 'Pylon / Pole Signs',   icon: '🚩' },
  awning:         { label: 'Awning Signs',         icon: '⛺' },
  projecting:     { label: 'Projecting Signs',     icon: '📐' },
  window:         { label: 'Window Signs',         icon: '🪟' },
  emc:            { label: 'EMC / Digital Signs',  icon: '📺' },
  temporary:      { label: 'Temporary Signs',      icon: '📋' },
  directional:    { label: 'Directional Signs',    icon: '➡️' },
};

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(18px)', transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

// ── Sign Type Card ─────────────────────────────────────────────────────────
function SignTypeCard({ typeKey, rules }: { typeKey: string; rules: SignTypeRules }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'specs' | 'code'>('specs');
  const cfg = SIGN_TYPE_CONFIG[typeKey] || { label: typeKey, icon: '📋' };

  const isProhibited = typeKey === 'pylon' && rules.simplifiedText?.toLowerCase().includes('prohibited');
  const isEMCBanned = typeKey === 'emc' && rules.emcAllowed === false;
  const isBanned = isProhibited || isEMCBanned;

  const confStyles: Record<string, { bg: string; color: string; label: string }> = {
    verified: { bg: '#EAF3DE', color: '#27500A', label: '✓ Verified' },
    high:     { bg: '#EAF3DE', color: '#27500A', label: '✓ High confidence' },
    medium:   { bg: '#FEF3C7', color: '#92400E', label: '⚠ Verify at intake' },
    low:      { bg: '#FCEBEB', color: '#791F1F', label: '⚠ Unconfirmed' },
  };
  const conf = confStyles[rules.confidence || 'medium'] || confStyles.medium;

  const hasTimeclock = rules.timeclockRequired !== undefined || rules.photocellRequired !== undefined || rules.astronomicalTimeclockRequired !== undefined;

  return (
    <div className="result-card" style={{ background: '#fff', borderRadius: '12px', border: `1.5px solid ${isBanned ? '#FECACA' : '#E8EDF2'}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' as const }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: '20px', flexShrink: 0 }}>{cfg.icon}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: isBanned ? '#B91C1C' : '#0D1B2A', marginBottom: '2px' }}>{cfg.label}</div>
            <div style={{ fontSize: '11px', color: '#9BA8B4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, maxWidth: '420px' }}>
              {isBanned ? '🚫 NOT PERMITTED in this jurisdiction' : (rules.simplifiedText?.substring(0, 80) + '…') || 'Tap to expand'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: '12px' }}>
          <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: conf.bg, color: conf.color, fontWeight: '600', whiteSpace: 'nowrap' as const }}>{conf.label}</span>
          <span style={{ color: '#9BA8B4', fontSize: '18px', display: 'inline-block', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }}>›</span>
        </div>
      </button>

      {open && (
        <div style={{ borderTop: '1px solid #F4F7FA' }}>
          <div style={{ display: 'flex', background: '#F4F7FA', borderBottom: '1px solid #E8EDF2' }}>
            {(['specs', 'code'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: '9px 18px', fontSize: '12px', fontWeight: tab === t ? '700' : '500', background: tab === t ? '#fff' : 'transparent', color: tab === t ? '#185FA5' : '#5A6B7A', border: 'none', borderBottom: tab === t ? '2px solid #185FA5' : '2px solid transparent', cursor: 'pointer', fontFamily: 'inherit' }}>
                {t === 'specs' ? 'Specifications' : 'Code Language'}
              </button>
            ))}
          </div>

          <div style={{ padding: '18px 20px' }}>
            {tab === 'specs' && (
              <>
                {/* Dimensions */}
                {(rules.maxStructureHeightFt !== undefined || rules.maxFaceAreaSqft !== undefined || rules.maxLetterHeightIn !== undefined || rules.areaCalcValue !== undefined || rules.maxPerTenant !== undefined || rules.tempMaxSqft !== undefined) && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#9BA8B4', textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: '8px' }}>Dimensions</div>
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
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#9BA8B4', textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: '8px' }}>Placement</div>
                    {rules.minSetbackRowFt !== undefined && <Row label="Min setback from ROW" value={typeof rules.minSetbackRowFt === 'number' ? `${rules.minSetbackRowFt} ft` : String(rules.minSetbackRowFt)} />}
                    {rules.minSetbackPropertyFt !== undefined && <Row label="Min setback from property line" value={String(rules.minSetbackPropertyFt)} />}
                    {rules.landscapingRequired !== undefined && <Row label="Landscaping at base" value={rules.landscapingRequired ? 'Required' : 'Not required'} />}
                  </div>
                )}

                {/* Illumination */}
                {(rules.illuminationAllowed !== undefined || rules.faceLitAllowed !== undefined || rules.reverseHaloLitAllowed !== undefined || rules.openFaceNeonAllowed !== undefined) && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#9BA8B4', textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: '8px' }}>Illumination</div>
                    {rules.illuminationAllowed !== undefined && <Row label="Illumination allowed" value={rules.illuminationAllowed ? 'Yes' : 'No'} />}
                    {rules.faceLitAllowed !== undefined && <Row label="Face lit / front lit" value={rules.faceLitAllowed ? '✓ Allowed' : '✗ Not allowed'} />}
                    {rules.reverseHaloLitAllowed !== undefined && <Row label="Reverse / halo lit" value={rules.reverseHaloLitAllowed ? '✓ Allowed' : '✗ Not allowed'} />}
                    {rules.openFaceNeonAllowed !== undefined && <Row label="Open face neon" value={rules.openFaceNeonAllowed ? '✓ Allowed' : '✗ Not allowed'} />}
                    {rules.illuminationTypes && rules.illuminationTypes.length > 0 && <Row label="Types allowed" value={rules.illuminationTypes.map(t => t.replace(/_/g, ' ')).join(', ')} />}
                  </div>
                )}

                {/* Timeclock / Photocell */}
                {hasTimeclock && (
                  <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '10px', padding: '14px 16px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#92400E', textTransform: 'uppercase' as const, letterSpacing: '.05em', marginBottom: '10px' }}>⏰ Illumination Controls</div>
                    {rules.timeclockRequired !== undefined && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                        <span style={{ fontSize: '12px', color: '#92400E' }}>Timeclock required (city)</span>
                        <strong style={{ fontSize: '12px', color: '#92400E' }}>{rules.timeclockRequired ? '✓ Yes' : 'No'}</strong>
                      </div>
                    )}
                    {rules.photocellRequired !== undefined && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                        <span style={{ fontSize: '12px', color: '#92400E' }}>Photocell required</span>
                        <strong style={{ fontSize: '12px', color: '#92400E' }}>{rules.photocellRequired ? '✓ Yes' : 'No'}</strong>
                      </div>
                    )}
                    {rules.astronomicalTimeclockRequired !== undefined && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                        <span style={{ fontSize: '12px', color: '#92400E' }}>Astronomical timeclock</span>
                        <strong style={{ fontSize: '12px', color: '#92400E' }}>{rules.astronomicalTimeclockRequired ? '✓ Required' : 'Not required'}</strong>
                      </div>
                    )}
                  </div>
                )}

                {/* EMC */}
                {rules.emcAllowed !== undefined && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#9BA8B4', textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: '8px' }}>EMC / Digital</div>
                    <Row label="EMC allowed" value={rules.emcAllowed ? 'Yes' : '🚫 No — Prohibited'} />
                    {rules.emcMinMessageHoldSec !== undefined && <Row label="Min message hold" value={`${rules.emcMinMessageHoldSec} seconds`} />}
                    {rules.emcMaxBrightnessDay !== undefined && <Row label="Max brightness (day)" value={`${rules.emcMaxBrightnessDay} nits`} />}
                    {rules.emcMaxBrightnessNight !== undefined && <Row label="Max brightness (night)" value={`${rules.emcMaxBrightnessNight} nits`} />}
                    {rules.emcAnimationAllowed !== undefined && <Row label="Animation allowed" value={rules.emcAnimationAllowed ? 'Yes' : 'No'} />}
                    {rules.emcScrollingAllowed !== undefined && <Row label="Scrolling text" value={rules.emcScrollingAllowed ? 'Yes' : 'No'} />}
                  </div>
                )}

                {/* Notes */}
                {rules.notes && (
                  <div style={{ background: '#F4F7FA', borderRadius: '8px', padding: '12px 14px', fontSize: '12px', color: '#5A6B7A', lineHeight: '1.6' }}>
                    <strong style={{ color: '#0D1B2A', display: 'block', marginBottom: '4px' }}>📌 Notes</strong>
                    {rules.notes}
                  </div>
                )}
              </>
            )}

            {tab === 'code' && (
              <>
                {rules.codeSection && (
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#185FA5', background: '#EFF6FF', padding: '5px 10px', borderRadius: '6px', display: 'inline-block', marginBottom: '12px' }}>{rules.codeSection}</div>
                )}
                {rules.simplifiedText && (
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#9BA8B4', textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: '6px' }}>Plain English</div>
                    <div style={{ fontSize: '13px', color: '#0D1B2A', lineHeight: '1.65', background: '#F0FDF4', borderLeft: '3px solid #86EFAC', borderRadius: '0 8px 8px 0', padding: '12px 14px' }}>{rules.simplifiedText}</div>
                  </div>
                )}
                {rules.verbatimText && (
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#9BA8B4', textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: '6px' }}>Verbatim Ordinance</div>
                    <div style={{ fontSize: '12px', color: '#5A6B7A', lineHeight: '1.7', background: '#F4F7FA', borderLeft: '3px solid #BFDBFE', borderRadius: '0 8px 8px 0', padding: '12px 14px', fontStyle: 'italic' }}>"{rules.verbatimText}"</div>
                  </div>
                )}
                {!rules.simplifiedText && !rules.verbatimText && <p style={{ fontSize: '13px', color: '#9BA8B4' }}>No code language on file yet for this sign type.</p>}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '7px 0', borderBottom: '1px solid #F4F7FA', gap: '12px' }}>
      <span style={{ fontSize: '12px', color: '#5A6B7A', fontWeight: '500', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: '12px', fontWeight: '700', color: '#0D1B2A', textAlign: 'right' as const }}>{value}</span>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function LookupPage() {
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('');
  const [result, setResult] = useState<JurisdictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [codeTab, setCodeTab] = useState<'simplified' | 'verbatim'>('simplified');
  const [codeOpen, setCodeOpen] = useState(false);
  const [section, setSection] = useState<'signs' | 'docs' | 'flags' | 'contacts' | 'code'>('signs');
  const resultRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  const handleLookup = async () => {
    // Read from both React state AND the DOM ref as fallback
    const jur = selectedJurisdiction || selectRef.current?.value || '';
    if (!jur) return;
    // Sync state if it was out of sync
    if (!selectedJurisdiction && jur) setSelectedJurisdiction(jur);
    setLoading(true);
    setError('');
    setResult(null);
    setCodeOpen(false);
    setSection('signs');
    try {
      const res = await fetch(`/api/lookup?jurisdiction=${jur}`);
      if (!res.ok) throw new Error('Lookup failed');
      const json = await res.json();
      // API returns { success: true, data: {...} } — extract the data
      setResult(json.data || json);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch {
      setError('Could not load jurisdiction data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const hasZoning = result?.zoningDistricts && result.zoningDistricts.length > 0;

  return (
    <main style={{ fontFamily: "'DM Sans', 'Segoe UI', Arial, sans-serif", background: '#FAFBFD', color: '#0D1B2A', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes glow { 0%,100%{opacity:.45} 50%{opacity:.75} }
        @keyframes spin { to { transform: rotate(360deg); } }
        .nav-link:hover { color:#0D1B2A !important; }
        .primary-btn:hover { transform:translateY(-1px); box-shadow:0 8px 28px rgba(24,95,165,.38) !important; }
        .lookup-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 28px rgba(24,95,165,.38) !important; }
        .result-card:hover { border-color:rgba(24,95,165,.2) !important; }
      `}</style>

      {/* NAV */}
      <nav style={{ background: 'rgba(250,251,253,0.94)', borderBottom: '1px solid rgba(0,0,0,0.07)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(14px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', maxWidth: '1200px', margin: '0 auto', height: '62px' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none' }}>
            <svg width="28" height="28" viewBox="0 0 80 80"><rect width="80" height="80" rx="14" fill="#185FA5"/><rect x="10" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="10" y="46" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="46" width="24" height="24" rx="5" fill="#fff"/><path d="M50 60l4 4 8-9" stroke="#185FA5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#0D1B2A', letterSpacing: '-.2px' }}>Sign<span style={{ color: '#185FA5' }}>Code</span> Pro</span>
          </a>
          <div style={{ display: 'flex', gap: '32px' }}>
            {[['Lookup', '/lookup'], ['Jobs', '/jobs'], ['Waitlist', '/waitlist']].map(([l, h]) => (
              <a key={l} className="nav-link" href={h} style={{ fontSize: '13px', color: l === 'Lookup' ? '#185FA5' : '#5A6B7A', textDecoration: 'none', fontWeight: l === 'Lookup' ? '600' : '500' }}>{l}</a>
            ))}
          </div>
          <a href="/waitlist" className="primary-btn" style={{ padding: '8px 20px', background: '#185FA5', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: '600', textDecoration: 'none', boxShadow: '0 2px 8px rgba(24,95,165,.28)', transition: 'all .18s' }}>Join waitlist</a>
        </div>
      </nav>

      {/* HERO — dark, matches jobs page */}
      <section style={{ background: '#0D1B2A', padding: '56px 48px 64px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '400px', background: 'radial-gradient(ellipse at center, rgba(24,95,165,0.12) 0%, transparent 65%)', pointerEvents: 'none', animation: 'glow 6s ease-in-out infinite' }} />
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: .1, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
          {Array.from({ length: 14 }).map((_, i) => (
            <circle key={i} cx={`${6 + (i % 7) * 14}%`} cy={`${18 + Math.floor(i / 7) * 58}%`} r="1.5" fill="#85B7EB" opacity="0.6" />
          ))}
        </svg>

        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '5px 14px', background: 'rgba(24,95,165,0.3)', color: '#85B7EB', fontSize: '12px', fontWeight: '600', borderRadius: '20px', marginBottom: '20px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#85B7EB' }} />
            Florida Sign Permit Intelligence
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: '800', color: '#fff', letterSpacing: '-1.5px', marginBottom: '12px', lineHeight: 1.1 }}>
            Look up any jurisdiction.<br />
            <span style={{ color: '#85B7EB' }}>In seconds, not hours.</span>
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,.5)', lineHeight: 1.65, marginBottom: '36px', maxWidth: '520px' }}>
            Sign codes by sign type, required docs, red flags, and real contact info — researched and verified for Florida's most active markets.
          </p>

          {/* Search box */}
          <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', padding: '24px 28px', maxWidth: '680px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '7px' }}>
                  Address Search&nbsp;
                  <span style={{ background: '#FEF3C7', border: '1px solid #FCD34D', color: '#92400E', fontSize: '9px', padding: '1px 6px', borderRadius: '20px', fontWeight: '700' }}>SOON</span>
                </div>
                <input disabled placeholder="123 Main St, Fort Lauderdale…" style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '13px', color: 'rgba(255,255,255,.25)', background: 'rgba(255,255,255,0.05)', cursor: 'not-allowed', fontFamily: 'inherit', boxSizing: 'border-box' as const }} />
              </div>
              <div>
                <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '7px' }}>Select Jurisdiction</div>
                <select ref={selectRef} value={selectedJurisdiction} onChange={e => setSelectedJurisdiction(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '13px', color: selectedJurisdiction ? '#fff' : 'rgba(255,255,255,.4)', background: 'rgba(255,255,255,0.08)', cursor: 'pointer', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const }}>
                  <option value="">— Choose a city or county —</option>
                  {JURISDICTION_OPTIONS.map(o => <option key={o.value} value={o.value} style={{ background: '#1a2a3a', color: '#fff' }}>{o.label}</option>)}
                </select>
              </div>
            </div>
            <button className="lookup-btn" onClick={handleLookup}
              style={{ width: '100%', padding: '13px', background: '#185FA5', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(24,95,165,.4)', transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {loading
                ? <><div style={{ width: '15px', height: '15px', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />Pulling code data...</>
                : '🔍 Run Permit Lookup'}
            </button>
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.25)', marginTop: '14px' }}>18 jurisdictions covered · Verified sign code data · Verbatim ordinance text</div>
        </div>
      </section>

      {/* STATS BAND — matches jobs page */}
      <div style={{ background: 'linear-gradient(135deg,#0D1B2A 0%,#163C6A 50%,#185FA5 100%)', padding: '48px 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: .04, backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          {[['18', 'FL jurisdictions covered'], ['2–4 hrs', 'Research time saved per job'], ['$0', 'Cost to look up'], ['100%', 'Publicly sourced data']].map(([n, l], i) => (
            <div key={n} style={{ textAlign: 'center', padding: '0 24px', borderRight: i < 3 ? '1px solid rgba(255,255,255,.1)' : 'none' }}>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#fff', letterSpacing: '-1px', lineHeight: 1, marginBottom: '8px' }}>{n}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.5)', fontWeight: '500' }}>{l}</div>
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

      {/* RESULTS */}
      {(result || loading) && (
        <section style={{ padding: '48px 48px 80px', background: '#F4F7FA' }}>
          <div ref={resultRef} style={{ maxWidth: '900px', margin: '0 auto' }}>

            {loading && (
              <div style={{ textAlign: 'center', padding: '64px', color: '#5A6B7A', fontSize: '14px' }}>
                <div style={{ width: '32px', height: '32px', border: '3px solid #E2E8F0', borderTopColor: '#185FA5', borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto 16px' }} />
                Pulling jurisdiction data...
              </div>
            )}

            {result && !loading && (
              <>
                {/* Jurisdiction header */}
                <FadeIn>
                  <div className="result-card" style={{ background: '#fff', borderRadius: '14px', border: '1.5px solid #E8EDF2', padding: '24px 28px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                      <div>
                        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0D1B2A', letterSpacing: '-.5px', marginBottom: '4px' }}>{result.jurisdiction}</h2>
                        <div style={{ fontSize: '13px', color: '#9BA8B4' }}>
                          {result.county}
                          {result.lastVerified && <span> · Last verified: {new Date(result.lastVerified).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>}
                        </div>
                        {result.codeChapter && <div style={{ marginTop: '8px', fontSize: '11px', color: '#5A6B7A', background: '#F4F7FA', padding: '5px 10px', borderRadius: '6px', display: 'inline-block' }}>{result.codeChapter}</div>}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {result.ownerSignatureRequired && <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: '#FEF3C7', color: '#92400E', fontWeight: '700' }}>Owner sig required</span>}
                        {result.masterSignProgramRequired && <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: '#FCEBEB', color: '#791F1F', fontWeight: '700' }}>MSP required</span>}
                        {result.designReviewRequired && <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: '#FCEBEB', color: '#791F1F', fontWeight: '700' }}>Design review required</span>}
                        {result.contractorRegistrationRequired && <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: '#FCEBEB', color: '#791F1F', fontWeight: '700' }}>City contractor registration</span>}
                        {result.emcAllowed === true && <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: '#DCFCE7', color: '#15803D', fontWeight: '700' }}>✓ EMC Allowed</span>}
                        {result.emcAllowed === false && <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: '#FEE2E2', color: '#B91C1C', fontWeight: '700' }}>✗ EMC Banned</span>}
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', paddingTop: '16px', borderTop: '1px solid #F4F7FA' }}>
                      {result.turnaround && <div><div style={{ fontSize: '10px', fontWeight: '700', color: '#9BA8B4', textTransform: 'uppercase' as const, letterSpacing: '.05em', marginBottom: '3px' }}>Turnaround</div><div style={{ fontSize: '12px', fontWeight: '600', color: '#0D1B2A' }}>{result.turnaround}</div></div>}
                      {result.fees && <div><div style={{ fontSize: '10px', fontWeight: '700', color: '#9BA8B4', textTransform: 'uppercase' as const, letterSpacing: '.05em', marginBottom: '3px' }}>Fees</div><div style={{ fontSize: '12px', fontWeight: '600', color: '#0D1B2A' }}>{result.fees}</div></div>}
                      {result.phone && <div><div style={{ fontSize: '10px', fontWeight: '700', color: '#9BA8B4', textTransform: 'uppercase' as const, letterSpacing: '.05em', marginBottom: '3px' }}>Phone</div><div style={{ fontSize: '12px', fontWeight: '600', color: '#0D1B2A' }}>{result.phone}</div></div>}
                    </div>
                  </div>
                </FadeIn>

                {/* Section tabs */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  {([
                    { key: 'signs',    label: hasZoning ? '📐 Sign Types' : '📋 Code Summary' },
                    { key: 'flags',    label: `🚩 Red Flags (${result.redFlags?.length || 0})` },
                    { key: 'docs',     label: `📄 Docs (${result.requiredDocs?.length || 0})` },
                    { key: 'contacts', label: '📞 Contacts' },
                    { key: 'code',     label: '📖 Code Language' },
                  ] as { key: typeof section; label: string }[]).map(({ key, label }) => (
                    <button key={key} onClick={() => setSection(key)}
                      style={{ fontSize: '12px', padding: '7px 14px', borderRadius: '20px', border: '1px solid', borderColor: section === key ? '#185FA5' : '#E2E8F0', background: section === key ? '#185FA5' : '#fff', color: section === key ? '#fff' : '#5A6B7A', cursor: 'pointer', fontFamily: 'inherit', fontWeight: section === key ? '700' : '400' }}>
                      {label}
                    </button>
                  ))}
                </div>

                {/* SIGN TYPES */}
                {section === 'signs' && (
                  <>
                    {hasZoning && result.zoningDistricts!.map((district, di) => (
                      <FadeIn key={di} delay={di * 80}>
                        <div style={{ marginBottom: '24px' }}>
                          <div style={{ background: '#0D1B2A', borderRadius: '10px', padding: '14px 18px', marginBottom: '10px' }}>
                            <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff', marginBottom: '2px' }}>{district.districtCode} — {district.districtName}</div>
                            {district.overlay && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.4)' }}>{district.overlay}</div>}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
                            {Object.entries(district.signTypes).map(([typeKey, rules]) => (
                              <SignTypeCard key={typeKey} typeKey={typeKey} rules={rules} />
                            ))}
                          </div>
                        </div>
                      </FadeIn>
                    ))}

                    {/* Legacy flat display for non-fully-researched jurisdictions */}
                    {!hasZoning && (
                      <FadeIn>
                        <div className="result-card" style={{ background: '#fff', borderRadius: '14px', border: '1.5px solid #E8EDF2', padding: '24px 28px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                          <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '8px', padding: '10px 14px', marginBottom: '18px', fontSize: '12px', color: '#92400E' }}>
                            ⚠ This jurisdiction hasn't been fully researched by sign type yet. Full breakdown coming soon.
                          </div>
                          {result.maxHeight && <Row label="Max height" value={result.maxHeight} />}
                          {result.maxArea && <Row label="Max area" value={result.maxArea} />}
                          {result.setback && <Row label="Setback" value={result.setback} />}
                          {result.emcNotes && <div style={{ marginTop: '12px', background: '#F4F7FA', borderRadius: '8px', padding: '12px 14px', fontSize: '12px', color: '#5A6B7A' }}>{result.emcNotes}</div>}
                          {result.engineerSealRequired && <div style={{ marginTop: '10px', background: '#FEF3C7', borderRadius: '8px', padding: '12px 14px', fontSize: '12px', color: '#92400E' }}><strong>Engineer seal: </strong>{result.engineerSealRequired}</div>}
                        </div>
                      </FadeIn>
                    )}
                  </>
                )}

                {/* RED FLAGS */}
                {section === 'flags' && (
                  <FadeIn>
                    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
                      {result.redFlags && result.redFlags.length > 0
                        ? result.redFlags.map((flag, i) => (
                          <div key={i} className="result-card" style={{ background: '#fff', borderRadius: '10px', border: '1.5px solid #FECACA', padding: '14px 18px', display: 'flex', gap: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                            <span style={{ fontSize: '16px', flexShrink: 0 }}>🚩</span>
                            <span style={{ fontSize: '13px', color: '#0D1B2A', lineHeight: '1.55' }}>{flag}</span>
                          </div>
                        ))
                        : <p style={{ color: '#9BA8B4', fontSize: '13px' }}>No red flags on file.</p>
                      }
                      {result.practitionerNotes && result.practitionerNotes.length > 0 && (
                        <div style={{ marginTop: '16px' }}>
                          <div style={{ fontSize: '11px', fontWeight: '700', color: '#5A6B7A', marginBottom: '8px', textTransform: 'uppercase' as const, letterSpacing: '.05em' }}>Practitioner Notes</div>
                          {result.practitionerNotes.map((note, i) => (
                            <div key={i} className="result-card" style={{ background: '#fff', borderRadius: '10px', border: '1.5px solid #E8EDF2', padding: '12px 16px', display: 'flex', gap: '10px', marginBottom: '6px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                              <span style={{ color: '#185FA5', flexShrink: 0, fontWeight: '700', fontSize: '14px' }}>→</span>
                              <span style={{ fontSize: '13px', color: '#5A6B7A', lineHeight: '1.55' }}>{note}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </FadeIn>
                )}

                {/* REQUIRED DOCS */}
                {section === 'docs' && (
                  <FadeIn>
                    <div className="result-card" style={{ background: '#fff', borderRadius: '14px', border: '1.5px solid #E8EDF2', padding: '24px 28px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                      {result.requiredDocs && result.requiredDocs.length > 0
                        ? result.requiredDocs.map((doc, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '9px 0', borderBottom: i < result.requiredDocs!.length - 1 ? '1px solid #F4F7FA' : 'none' }}>
                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                              <span style={{ fontSize: '10px', fontWeight: '700', color: '#185FA5' }}>{i + 1}</span>
                            </div>
                            <span style={{ fontSize: '13px', color: '#0D1B2A', lineHeight: '1.5' }}>{doc}</span>
                          </div>
                        ))
                        : <p style={{ color: '#9BA8B4', fontSize: '13px' }}>No required docs on file yet.</p>
                      }
                    </div>
                  </FadeIn>
                )}

                {/* CONTACTS */}
                {section === 'contacts' && (
                  <FadeIn>
                    <div className="result-card" style={{ background: '#fff', borderRadius: '14px', border: '1.5px solid #E8EDF2', padding: '24px 28px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                      {result.contacts && result.contacts.length > 0
                        ? result.contacts.map((c, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < result.contacts!.length - 1 ? '1px solid #F4F7FA' : 'none', flexWrap: 'wrap', gap: '8px' }}>
                            <span style={{ fontSize: '13px', color: '#5A6B7A' }}>{c.label}</span>
                            {c.value.startsWith('http')
                              ? <a href={c.value} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', fontWeight: '700', color: '#185FA5', textDecoration: 'none' }}>Open portal →</a>
                              : <span style={{ fontSize: '13px', fontWeight: '700', color: '#0D1B2A' }}>{c.value}</span>
                            }
                          </div>
                        ))
                        : <p style={{ color: '#9BA8B4', fontSize: '13px' }}>No contacts on file yet.</p>
                      }
                      {result.portalUrl && (
                        <a href={result.portalUrl} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'inline-block', marginTop: '16px', padding: '10px 20px', background: '#185FA5', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: '600', textDecoration: 'none', boxShadow: '0 2px 8px rgba(24,95,165,.3)' }}>
                          Open Permit Portal →
                        </a>
                      )}
                    </div>
                  </FadeIn>
                )}

                {/* CODE LANGUAGE */}
                {section === 'code' && (
                  <FadeIn>
                    {result.codeLanguage && result.codeLanguage.length > 0 ? (
                      <>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
                          {(['simplified', 'verbatim'] as const).map(t => (
                            <button key={t} onClick={() => setCodeTab(t)}
                              style={{ fontSize: '12px', padding: '6px 14px', borderRadius: '20px', border: '1px solid', borderColor: codeTab === t ? '#185FA5' : '#E2E8F0', background: codeTab === t ? '#185FA5' : '#fff', color: codeTab === t ? '#fff' : '#5A6B7A', cursor: 'pointer', fontFamily: 'inherit', fontWeight: codeTab === t ? '700' : '400' }}>
                              {t === 'simplified' ? 'Plain English' : 'Verbatim Ordinance'}
                            </button>
                          ))}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
                          {result.codeLanguage.map((cs, i) => (
                            <div key={i} className="result-card" style={{ background: '#fff', borderRadius: '12px', border: '1.5px solid #E8EDF2', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
                                <span style={{ fontSize: '11px', fontWeight: '700', color: '#185FA5', background: 'rgba(24,95,165,0.07)', padding: '2px 8px', borderRadius: '5px', flexShrink: 0 }}>{cs.section}</span>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: '#0D1B2A' }}>{cs.title}</span>
                              </div>
                              {codeTab === 'verbatim'
                                ? <div style={{ fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.7', color: '#5A6B7A', background: '#F4F7FA', borderLeft: '3px solid #BFDBFE', padding: '12px 14px', borderRadius: '0 8px 8px 0' }}>{cs.verbatim}</div>
                                : <div style={{ fontSize: '13px', lineHeight: '1.65', color: '#0D1B2A', background: '#F0FDF4', borderLeft: '3px solid #86EFAC', padding: '12px 14px', borderRadius: '0 8px 8px 0' }}>{cs.simplified}</div>
                              }
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div style={{ background: '#fff', borderRadius: '14px', border: '1.5px solid #E8EDF2', padding: '32px', textAlign: 'center', color: '#9BA8B4', fontSize: '13px' }}>
                        No code language on file yet for this jurisdiction.
                      </div>
                    )}
                  </FadeIn>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* DISCLAIMER */}
      <div style={{ padding: '20px 48px', borderTop: '1px solid #E8EDF2', background: '#F4F7FA' }}>
        <p style={{ fontSize: '11px', color: '#B4B2A9', lineHeight: '1.7', textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
          SignCode Pro provides general permit guidance based on publicly available sources. Requirements vary by jurisdiction and change over time. Always verify directly with the jurisdiction before submitting. SignCode Pro is not a legal authority and does not guarantee permit approval.
        </p>
      </div>

      {/* CTA */}
      <section style={{ padding: '88px 48px', background: 'linear-gradient(135deg,#0D1B2A 0%,#185FA5 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: .04, backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '520px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#fff', marginBottom: '14px', letterSpacing: '-.5px', lineHeight: 1.18 }}>A better starting point<br />for every permit job</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,.65)', marginBottom: '32px', lineHeight: 1.7 }}>Join sign professionals already on the waitlist. Be first when we launch.</p>
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
            {[['Lookup tool', '/lookup'], ['Job tracker', '/jobs'], ['Waitlist', '/waitlist']].map(([l, h]) => (
              <a key={l} href={h} style={{ fontSize: '12px', color: '#9BA8B4', textDecoration: 'none', fontWeight: '500' }}>{l}</a>
            ))}
          </div>
          <div style={{ fontSize: '11px', color: '#B4B2A9' }}>© 2026 SignCode Pro. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
