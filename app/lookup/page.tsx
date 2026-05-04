'use client';
import { useState, useEffect } from 'react';

const CITY_MAP: Record<string, string> = {
  'miami': 'miami-dade', 'hialeah': 'miami-dade', 'coral gables': 'miami-dade',
  'doral': 'miami-dade', 'homestead': 'miami-dade', 'miami gardens': 'miami-dade',
  'miami-dade': 'miami-dade', 'miami dade': 'miami-dade',
  'hollywood': 'hollywood', 'pembroke pines': 'pembroke-pines',
  'miramar': 'miramar', 'sunrise': 'sunrise', 'plantation': 'broward',
  'davie': 'broward', 'weston': 'broward', 'deerfield beach': 'deerfield-beach',
  'margate': 'broward', 'coral springs': 'coral-springs',
  'pompano beach': 'pompano-beach', 'pompano': 'pompano-beach',
  'fort lauderdale': 'fort-lauderdale', 'ft lauderdale': 'fort-lauderdale',
  'boca raton': 'boca-raton', 'boca': 'boca-raton',
  'delray beach': 'delray-beach', 'delray': 'delray-beach',
  'west palm beach': 'west-palm-beach', 'west palm': 'west-palm-beach',
  'palm beach': 'palm-beach', 'palm beach county': 'palm-beach',
  'boynton beach': 'palm-beach', 'lake worth': 'palm-beach',
  'wellington': 'palm-beach', 'jupiter': 'palm-beach',
  'miami beach': 'miami-beach',
  'orlando': 'orlando', 'tampa': 'tampa',
  'brandon': 'hillsborough', 'riverview': 'hillsborough',
  'hillsborough': 'hillsborough', 'hillsborough county': 'hillsborough',
  'broward': 'broward', 'broward county': 'broward',
};

interface JurData {
  jurisdiction: string;
  county?: string;
  maxHeight?: string;
  maxArea?: string;
  setback?: string;
  emcAllowed?: boolean;
  emcNotes?: string;
  requiredDocs?: string[];
  redFlags?: string[];
  contacts?: { label: string; value: string }[];
  fees?: string;
  turnaround?: string;
  practitionerNotes?: string[];
  codeLanguage?: { section: string; title: string; verbatim: string; simplified: string }[];
}

export default function LookupPage() {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<JurData | null>(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cityParam = params.get('city');
    if (cityParam) {
      setCity(cityParam);
      doLookup(cityParam);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function doLookup(cityInput: string) {
    const key = CITY_MAP[cityInput.toLowerCase().trim()];
    if (!key) {
      setError(`No data found for "${cityInput}". Try a city like Miami, Fort Lauderdale, or Boca Raton.`);
      setData(null);
      return;
    }
    setLoading(true);
    setError('');
    setData(null);
    setTab('overview');
    try {
      const res = await fetch(`/api/lookup?jurisdiction=${key}`);
      const json = await res.json();
      if (!res.ok) { setError(json.error || 'Something went wrong.'); return; }
      setData(json);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (city.trim()) doLookup(city);
  }

  return (
    <div style={{ fontFamily: "'DM Sans', Arial, sans-serif", minHeight: '100vh', background: '#F4F7FA' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}@keyframes glow{0%,100%{opacity:.4}50%{opacity:.7}}@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* NAV */}
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

      {/* SEARCH HEADER */}
      <div style={{ background: '#0D1B2A', padding: '52px 32px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)', width: 800, height: 400, background: 'radial-gradient(ellipse,rgba(24,95,165,.12) 0%,transparent 65%)', animation: 'glow 6s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: '#fff', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 12 }}>Look up any jurisdiction.<br /><span style={{ color: '#85B7EB' }}>In seconds, not hours.</span></h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.5)', lineHeight: 1.65, marginBottom: 32 }}>Sign codes by sign type, required docs, red flags, and contact info.</p>
          <form onSubmit={handleSubmit}>
            <div style={{ background: 'rgba(255,255,255,.07)', borderRadius: 14, border: '1px solid rgba(255,255,255,.1)', padding: '22px 24px', maxWidth: 640 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>City or County</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Miami, Fort Lauderdale, Boca Raton..." style={{ flex: 1, padding: '12px 16px', borderRadius: 9, border: '1px solid rgba(255,255,255,.15)', background: 'rgba(255,255,255,.08)', color: '#fff', fontSize: 14, outline: 'none' }} />
                <button type="submit" disabled={loading} style={{ padding: '12px 28px', background: '#185FA5', color: '#fff', border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {loading ? 'Looking up...' : 'Look up'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* RESULTS */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 32px 64px' }}>
        {error && (
          <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 12, padding: '16px 20px', color: '#92400E', fontSize: 14, marginBottom: 24 }}>
            {error}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9BA8B4', fontSize: 14 }}>
            <div style={{ width: 32, height: 32, border: '3px solid #E8EDF2', borderTopColor: '#185FA5', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
            Looking up jurisdiction data...
          </div>
        )}

        {data && !loading && (
          <div>
            {/* Header card */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8EDF2', padding: '20px 24px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0D1B2A', marginBottom: 4 }}>{data.jurisdiction}</h2>
                  {data.county && <div style={{ fontSize: 13, color: '#9BA8B4' }}>{data.county}</div>}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {data.emcAllowed === false && <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#FEE2E2', color: '#B91C1C', fontWeight: 700 }}>EMC Banned</span>}
                  {data.emcAllowed === true && <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#DCFCE7', color: '#166534', fontWeight: 700 }}>EMC Allowed</span>}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, paddingTop: 12, borderTop: '1px solid #F4F7FA' }}>
                {data.turnaround && <div><div style={{ fontSize: 10, fontWeight: 700, color: '#9BA8B4', textTransform: 'uppercase', marginBottom: 2 }}>Turnaround</div><div style={{ fontSize: 13, fontWeight: 600 }}>{data.turnaround}</div></div>}
                {data.fees && <div><div style={{ fontSize: 10, fontWeight: 700, color: '#9BA8B4', textTransform: 'uppercase', marginBottom: 2 }}>Fees</div><div style={{ fontSize: 13, fontWeight: 600 }}>{data.fees}</div></div>}
                {data.maxHeight && <div><div style={{ fontSize: 10, fontWeight: 700, color: '#9BA8B4', textTransform: 'uppercase', marginBottom: 2 }}>Max Height</div><div style={{ fontSize: 13, fontWeight: 600 }}>{data.maxHeight}</div></div>}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
              {[
                { k: 'overview', l: 'Overview' },
                { k: 'flags', l: `Red Flags (${data.redFlags?.length ?? 0})` },
                { k: 'docs', l: `Docs (${data.requiredDocs?.length ?? 0})` },
                { k: 'contacts', l: 'Contacts' },
                { k: 'code', l: 'Code Language' },
              ].map(({ k, l }) => (
                <button key={k} onClick={() => setTab(k)} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 20, border: '1px solid', borderColor: tab === k ? '#185FA5' : '#E2E8F0', background: tab === k ? '#185FA5' : '#fff', color: tab === k ? '#fff' : '#5A6B7A', cursor: 'pointer', fontFamily: 'inherit', fontWeight: tab === k ? 700 : 400 }}>{l}</button>
              ))}
            </div>

            {/* Overview tab */}
            {tab === 'overview' && (
              <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: '20px 24px' }}>
                {data.maxHeight && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F4F7FA', fontSize: 13 }}><span style={{ color: '#5A6B7A' }}>Max height</span><strong>{data.maxHeight}</strong></div>}
                {data.maxArea && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F4F7FA', fontSize: 13 }}><span style={{ color: '#5A6B7A' }}>Max area</span><strong>{data.maxArea}</strong></div>}
                {data.setback && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F4F7FA', fontSize: 13 }}><span style={{ color: '#5A6B7A' }}>Setback</span><strong>{data.setback}</strong></div>}
                {data.emcNotes && <div style={{ marginTop: 12, background: data.emcAllowed === false ? '#FEE2E2' : '#F0FDF4', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: data.emcAllowed === false ? '#B91C1C' : '#166534' }}>{data.emcNotes}</div>}
                {data.practitionerNotes && data.practitionerNotes.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#9BA8B4', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>Practitioner Notes</div>
                    {data.practitionerNotes.map((n, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <span style={{ color: '#185FA5', fontWeight: 700 }}>→</span>
                        <span style={{ fontSize: 13, color: '#5A6B7A', lineHeight: 1.6 }}>{n}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Flags tab */}
            {tab === 'flags' && (
              <div>
                {data.redFlags?.map((f, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: 10, border: '1px solid #FECACA', padding: '12px 16px', display: 'flex', gap: 10, marginBottom: 8 }}>
                    <span>🚩</span><span style={{ fontSize: 13, color: '#0D1B2A', lineHeight: 1.55 }}>{f}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Docs tab */}
            {tab === 'docs' && (
              <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: '20px 24px' }}>
                {data.requiredDocs?.map((d, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid #F4F7FA' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#185FA5' }}>{i + 1}</span>
                    </div>
                    <span style={{ fontSize: 13 }}>{d}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Contacts tab */}
            {tab === 'contacts' && (
              <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: '20px 24px' }}>
                {data.contacts?.map((c, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #F4F7FA' }}>
                    <span style={{ fontSize: 13, color: '#5A6B7A' }}>{c.label}</span>
                    {c.value.startsWith('http') || c.value.includes('.gov') || c.value.includes('.com') ? (
                      <a href={`https://${c.value.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 700, color: '#185FA5', textDecoration: 'none' }}>Open portal</a>
                    ) : (
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{c.value}</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Code tab */}
            {tab === 'code' && (
              <div>
                {data.codeLanguage?.map((cs, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', padding: '16px 18px', marginBottom: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#185FA5', background: 'rgba(24,95,165,.07)', padding: '2px 8px', borderRadius: 5, display: 'inline-block', marginBottom: 6 }}>{cs.section}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0D1B2A', marginBottom: 10 }}>{cs.title}</div>
                    <div style={{ fontSize: 13, lineHeight: 1.65, background: '#F0FDF4', borderLeft: '3px solid #86EFAC', padding: '10px 14px', marginBottom: 8, borderRadius: '0 6px 6px 0' }}>{cs.simplified}</div>
                    <div style={{ fontSize: 12, lineHeight: 1.65, color: '#5A6B7A', background: '#F4F7FA', borderLeft: '3px solid #BFDBFE', padding: '10px 14px', fontStyle: 'italic', borderRadius: '0 6px 6px 0' }}>{cs.verbatim}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!data && !loading && !error && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9BA8B4' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#5A6B7A', marginBottom: 8 }}>Search a Florida city or county above</div>
            <div style={{ fontSize: 13 }}>Miami, Fort Lauderdale, Boca Raton, Tampa, Orlando and more</div>
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
