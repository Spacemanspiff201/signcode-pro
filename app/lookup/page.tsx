'use client';
import { useState, useEffect, useRef } from 'react';

interface CodeSection {
  section: string;
  title: string;
  verbatim: string;
  simplified: string;
}

interface JurisdictionResult {
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
  codeLanguage?: CodeSection[];
}

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
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(28px)', transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

export default function LookupPage() {
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('');
  const [result, setResult] = useState<JurisdictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [codeTab, setCodeTab] = useState<'simplified' | 'verbatim'>('simplified');
  const [codeOpen, setCodeOpen] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setTimeout(() => setHeroVisible(true), 80); }, []);

  const handleLookup = async () => {
    if (!selectedJurisdiction) return;
    setLoading(true);
    setError('');
    setResult(null);
    setCodeOpen(false);
    try {
      const res = await fetch(`/api/lookup?jurisdiction=${selectedJurisdiction}`);
      if (!res.ok) throw new Error('Lookup failed');
      const data = await res.json();
      setResult(data);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch {
      setError('Could not load jurisdiction data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ fontFamily: "'DM Sans', 'Segoe UI', Arial, sans-serif", background: '#FAFBFD', color: '#0D1B2A', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spinCW  { to { transform: rotate(360deg); } }
        @keyframes spinCCW { to { transform: rotate(-360deg); } }
        @keyframes floatA  { 0%,100%{transform:translateY(0px) rotate(45deg)} 50%{transform:translateY(-18px) rotate(55deg)} }
        @keyframes floatB  { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-13px) rotate(-5deg)} }
        @keyframes floatC  { 0%,100%{transform:translateY(0px) scale(1)} 50%{transform:translateY(-10px) scale(1.06)} }
        @keyframes glow    { 0%,100%{opacity:.45} 50%{opacity:.75} }
        @keyframes heroIn  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        .nav-link:hover { color:#0D1B2A !important; }
        .primary-btn { transition: all .18s ease; }
        .primary-btn:hover { transform:translateY(-1px); box-shadow:0 8px 28px rgba(24,95,165,.38) !important; background:#1454A0 !important; }
        .lookup-btn { transition: all .18s ease; }
        .lookup-btn:hover { transform:translateY(-1px); box-shadow:0 8px 28px rgba(24,95,165,.38) !important; background:#1454A0 !important; }
        .result-card { transition: all .2s ease; }
        .result-card:hover { border-color:rgba(24,95,165,.2) !important; box-shadow:0 4px 20px rgba(24,95,165,.07) !important; }

        @media(max-width:768px){
          .nav-links{display:none !important;}
          .hero-h1{font-size:34px !important;}
          .search-grid{grid-template-columns:1fr !important;}
          .stats-wrap{grid-template-columns:repeat(2,1fr) !important;}
          .results-grid{grid-template-columns:repeat(2,1fr) !important;}
          .footer-row{flex-direction:column !important;gap:16px !important;}
        }
      `}</style>

      {/* NAV — exact copy from homepage */}
      <nav style={{ background:'rgba(250,251,253,0.94)', borderBottom:'1px solid rgba(0,0,0,0.07)', position:'sticky', top:0, zIndex:100, backdropFilter:'blur(14px)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 48px', maxWidth:'1200px', margin:'0 auto', height:'62px' }}>
          <a href="/" style={{ display:'flex', alignItems:'center', gap:'9px', textDecoration:'none' }}>
            <svg width="28" height="28" viewBox="0 0 80 80"><rect width="80" height="80" rx="14" fill="#185FA5"/><rect x="10" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="10" y="46" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="46" width="24" height="24" rx="5" fill="#fff"/><path d="M50 60l4 4 8-9" stroke="#185FA5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            <span style={{ fontSize:'15px', fontWeight:'700', color:'#0D1B2A', letterSpacing:'-.2px' }}>Sign<span style={{ color:'#185FA5' }}>Code</span> Pro</span>
          </a>
          <div className="nav-links" style={{ display:'flex', gap:'32px' }}>
            {[['Lookup','/lookup'],['Jobs','/jobs'],['Waitlist','/waitlist']].map(([l,h]) => (
              <a key={l} className="nav-link" href={h} style={{ fontSize:'13px', color: l === 'Lookup' ? '#185FA5' : '#5A6B7A', textDecoration:'none', fontWeight: l === 'Lookup' ? '600' : '500' }}>{l}</a>
            ))}
          </div>
          <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
            <a href="/waitlist" className="primary-btn" style={{ padding:'8px 20px', background:'#185FA5', color:'#fff', borderRadius:'8px', fontSize:'13px', fontWeight:'600', textDecoration:'none', boxShadow:'0 2px 8px rgba(24,95,165,.28)' }}>Join waitlist</a>
          </div>
        </div>
      </nav>

      {/* HERO — same structure as homepage, lookup tool inside */}
      <section style={{ position:'relative', padding:'88px 48px 72px', background:'#fff', borderBottom:'1px solid #E8EDF2', overflow:'hidden', minHeight:'480px' }}>

        {/* Same radial glow as homepage */}
        <div style={{ position:'absolute', top:'-120px', left:'50%', transform:'translateX(-50%)', width:'800px', height:'600px', background:'radial-gradient(ellipse at center, rgba(24,95,165,0.07) 0%, transparent 65%)', pointerEvents:'none', animation:'glow 6s ease-in-out infinite' }} />

        {/* Same animated SVG background as homepage */}
        <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', opacity:0.65 }} viewBox="0 0 1200 480" preserveAspectRatio="xMidYMid slice">
          <g style={{ transformOrigin:'110px 240px', animation:'spinCW 22s linear infinite' }}>
            <circle cx="110" cy="240" r="92" fill="none" stroke="#185FA5" strokeWidth="1" strokeOpacity=".08" strokeDasharray="6 8"/>
          </g>
          <g style={{ transformOrigin:'110px 240px', animation:'spinCCW 14s linear infinite' }}>
            <circle cx="110" cy="240" r="56" fill="none" stroke="#185FA5" strokeWidth="1.2" strokeOpacity=".1" strokeDasharray="3 7"/>
          </g>
          <circle cx="110" cy="240" r="4" fill="#185FA5" fillOpacity=".1"/>
          <g style={{ transformOrigin:'68px 100px', animation:'floatA 6.5s ease-in-out infinite' }}>
            <rect x="48" y="80" width="40" height="40" rx="6" fill="none" stroke="#185FA5" strokeWidth="1.5" strokeOpacity=".12" transform="rotate(45 68 100)"/>
          </g>
          <g style={{ transformOrigin:'320px 60px', animation:'floatC 5.5s ease-in-out infinite' }}>
            <circle cx="320" cy="60" r="15" fill="none" stroke="#185FA5" strokeWidth="1.2" strokeOpacity=".1"/>
            <circle cx="320" cy="60" r="3.5" fill="#185FA5" fillOpacity=".08"/>
          </g>
          <g fill="#185FA5" fillOpacity=".06">
            {[0,1,2].map(r => [0,1,2].map(c => <circle key={`${r}${c}`} cx={220+c*20} cy={150+r*20} r="2.5"/>))}
          </g>
          <g style={{ transformOrigin:'1090px 240px', animation:'spinCCW 26s linear infinite' }}>
            <circle cx="1090" cy="240" r="100" fill="none" stroke="#185FA5" strokeWidth="1" strokeOpacity=".07" strokeDasharray="6 10"/>
          </g>
          <g style={{ transformOrigin:'1090px 240px', animation:'spinCW 16s linear infinite' }}>
            <circle cx="1090" cy="240" r="62" fill="none" stroke="#85B7EB" strokeWidth="1.2" strokeOpacity=".12" strokeDasharray="3 6"/>
          </g>
          <circle cx="1090" cy="240" r="5" fill="#185FA5" fillOpacity=".08"/>
          <g style={{ transformOrigin:'1065px 100px', animation:'floatB 7.5s ease-in-out infinite' }}>
            <polygon points="1065,70 1089,120 1041,120" fill="none" stroke="#185FA5" strokeWidth="1.5" strokeOpacity=".1"/>
          </g>
          <g style={{ transformOrigin:'880px 70px', animation:'floatB 9s ease-in-out infinite 1s' }}>
            <circle cx="880" cy="70" r="12" fill="none" stroke="#85B7EB" strokeWidth="1.2" strokeOpacity=".14"/>
          </g>
          <g fill="#185FA5" fillOpacity=".06">
            {[0,1,2].map(r => [0,1,2].map(c => <circle key={`r${r}${c}`} cx={940+c*20} cy={280+r*20} r="2.5"/>))}
          </g>
        </svg>

        {/* Hero content */}
        <div style={{ position:'relative', zIndex:2, maxWidth:'700px', margin:'0 auto', textAlign:'center' }}>
          <div style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(16px)', transition:'opacity .6s ease, transform .6s ease' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'7px', padding:'5px 14px', background:'linear-gradient(135deg,#EBF3FB,#F0F6FD)', border:'1px solid #C5DDF5', borderRadius:'20px', fontSize:'12px', color:'#185FA5', fontWeight:'600', marginBottom:'24px' }}>
              <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#185FA5', animation:'glow 2s ease-in-out infinite' }}/>
              Florida Sign Permit Intelligence
            </div>
          </div>

          <div style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(20px)', transition:'opacity .65s ease 120ms, transform .65s ease 120ms' }}>
            <h1 style={{ fontSize:'52px', fontWeight:'800', color:'#0D1B2A', lineHeight:'1.08', letterSpacing:'-1.2px', marginBottom:'20px' }}>
              Look up any jurisdiction.<br/>
              <span style={{ color:'#185FA5', position:'relative' }}>
                In seconds, not hours.
                <svg style={{ position:'absolute', bottom:'-6px', left:0, width:'100%', height:'6px', opacity:.35 }} viewBox="0 0 400 6" preserveAspectRatio="none"><path d="M0 5 Q100 1 200 4 Q300 7 400 3" stroke="#185FA5" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>
              </span>
            </h1>
          </div>

          <div style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(20px)', transition:'opacity .65s ease 220ms, transform .65s ease 220ms' }}>
            <p style={{ fontSize:'16px', color:'#5A6B7A', lineHeight:'1.75', maxWidth:'500px', margin:'0 auto 32px' }}>
              Sign codes, required docs, red flags, and real contact info — researched and verified for Florida's most active markets.
            </p>
          </div>

          {/* Lookup card */}
          <div style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(12px)', transition:'opacity .65s ease 320ms, transform .65s ease 320ms' }}>
            <div style={{ background:'#fff', border:'1.5px solid #D8E2EC', borderRadius:'14px', padding:'20px', maxWidth:'580px', margin:'0 auto', boxShadow:'0 4px 20px rgba(0,0,0,0.06)' }}>
              <div className="search-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'12px' }}>
                <div>
                  <div style={{ fontSize:'10px', fontWeight:'700', color:'#9BA8B4', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:'6px', display:'flex', alignItems:'center', gap:'6px' }}>
                    Address Search
                    <span style={{ background:'#FEF3C7', border:'1px solid #FCD34D', color:'#92400E', fontSize:'9px', fontWeight:'700', padding:'1px 7px', borderRadius:'20px' }}>Coming Soon</span>
                  </div>
                  <input disabled placeholder="123 Main St, Fort Lauderdale…" style={{ width:'100%', padding:'10px 12px', border:'1px solid #E8EDF2', borderRadius:'8px', fontSize:'13px', color:'#C0CAD4', background:'#F4F7FA', cursor:'not-allowed', fontFamily:'inherit' }}/>
                </div>
                <div>
                  <div style={{ fontSize:'10px', fontWeight:'700', color:'#9BA8B4', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:'6px' }}>Select Jurisdiction</div>
                  <select
                    value={selectedJurisdiction}
                    onChange={e => setSelectedJurisdiction(e.target.value)}
                    style={{ width:'100%', padding:'10px 12px', border:'1px solid #185FA5', borderRadius:'8px', fontSize:'13px', color:'#0D1B2A', background:'#fff', cursor:'pointer', fontFamily:'inherit', outline:'none' }}
                  >
                    <option value="">— Choose a city or county —</option>
                    {JURISDICTION_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                className="lookup-btn"
                onClick={handleLookup}
                disabled={!selectedJurisdiction || loading}
                style={{ width:'100%', padding:'11px', background: selectedJurisdiction && !loading ? '#185FA5' : '#C0CAD4', color:'#fff', border:'none', borderRadius:'8px', fontSize:'13px', fontWeight:'600', cursor: selectedJurisdiction && !loading ? 'pointer' : 'not-allowed', fontFamily:'inherit', boxShadow: selectedJurisdiction ? '0 4px 12px rgba(24,95,165,.28)' : 'none' }}
              >
                {loading ? 'Looking up...' : '🔍 Run Permit Lookup'}
              </button>
            </div>
            <div style={{ fontSize:'11px', color:'#9BA8B4', marginTop:'16px' }}>18 jurisdictions covered · Verified sign code data · Verbatim ordinance text</div>
          </div>
        </div>
      </section>

      {/* STATS BAND — exact copy from homepage including grid */}
      <div style={{ background:'linear-gradient(135deg,#0D1B2A 0%,#163C6A 50%,#185FA5 100%)', padding:'56px 48px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, opacity:.04, backgroundImage:'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize:'40px 40px' }}/>
        <div style={{ position:'absolute', top:'-60px', right:'10%', width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle,rgba(133,183,235,.18) 0%,transparent 65%)', pointerEvents:'none' }}/>
        <div className="stats-wrap" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0', maxWidth:'900px', margin:'0 auto', position:'relative', zIndex:2 }}>
          {[['18','FL jurisdictions covered'],['2–4 hrs','Research time saved per job'],['$0','Cost to look up'],['100%','Publicly sourced data']].map(([n,l], i) => (
            <div key={n} style={{ textAlign:'center', padding:'0 24px', borderRight: i < 3 ? '1px solid rgba(255,255,255,.1)' : 'none' }}>
              <div style={{ fontSize:'38px', fontWeight:'800', color:'#fff', letterSpacing:'-1px', lineHeight:1, marginBottom:'8px' }}>{n}</div>
              <div style={{ fontSize:'12px', color:'rgba(255,255,255,.55)', lineHeight:'1.5', fontWeight:'500' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RESULTS — white section, same style as homepage feature/how-it-works sections */}
      {(result || loading || error) && (
        <section style={{ padding:'64px 48px', background:'#fff', borderBottom:'1px solid #E8EDF2' }}>
          <div ref={resultRef} style={{ maxWidth:'900px', margin:'0 auto' }}>

            {error && (
              <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:'10px', padding:'14px 18px', color:'#B91C1C', fontSize:'13px', marginBottom:'24px' }}>⚠️ {error}</div>
            )}

            {loading && (
              <div style={{ textAlign:'center', padding:'48px', color:'#5A6B7A', fontSize:'14px' }}>Pulling jurisdiction data…</div>
            )}

            {result && !loading && (
              <div>
                {/* Header */}
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'28px', flexWrap:'wrap', gap:'12px' }}>
                  <div>
                    <h2 style={{ fontSize:'26px', fontWeight:'800', color:'#0D1B2A', letterSpacing:'-.4px', margin:0 }}>{result.jurisdiction}</h2>
                    {result.county && <div style={{ fontSize:'13px', color:'#9BA8B4', marginTop:'4px' }}>{result.county}</div>}
                  </div>
                  <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                    {result.emcAllowed === true && <span style={{ background:'#DCFCE7', border:'1px solid #86EFAC', color:'#15803D', fontSize:'12px', fontWeight:'600', padding:'4px 12px', borderRadius:'20px' }}>✓ EMC Allowed</span>}
                    {result.emcAllowed === false && <span style={{ background:'#FEE2E2', border:'1px solid #FECACA', color:'#B91C1C', fontSize:'12px', fontWeight:'600', padding:'4px 12px', borderRadius:'20px' }}>✗ EMC Banned</span>}
                    {result.turnaround && <span style={{ background:'#EFF6FF', border:'1px solid #BFDBFE', color:'#1D4ED8', fontSize:'12px', fontWeight:'600', padding:'4px 12px', borderRadius:'20px' }}>⏱ {result.turnaround}</span>}
                  </div>
                </div>

                {/* Key numbers — same style as homepage stat tiles */}
                <div className="results-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', marginBottom:'24px' }}>
                  {result.maxHeight && (
                    <div style={{ padding:'16px', background:'#F4F7FA', borderRadius:'10px', textAlign:'center' }}>
                      <div style={{ fontSize:'10px', fontWeight:'700', color:'#9BA8B4', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:'6px' }}>Max Height</div>
                      <div style={{ fontSize:'24px', fontWeight:'800', color:'#185FA5', letterSpacing:'-.5px' }}>{result.maxHeight}</div>
                    </div>
                  )}
                  {result.maxArea && (
                    <div style={{ padding:'16px', background:'#F4F7FA', borderRadius:'10px', textAlign:'center' }}>
                      <div style={{ fontSize:'10px', fontWeight:'700', color:'#9BA8B4', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:'6px' }}>Max Area</div>
                      <div style={{ fontSize:'24px', fontWeight:'800', color:'#185FA5', letterSpacing:'-.5px' }}>{result.maxArea}</div>
                    </div>
                  )}
                  {result.setback && (
                    <div style={{ padding:'16px', background:'#F4F7FA', borderRadius:'10px', textAlign:'center' }}>
                      <div style={{ fontSize:'10px', fontWeight:'700', color:'#9BA8B4', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:'6px' }}>Setback</div>
                      <div style={{ fontSize:'24px', fontWeight:'800', color:'#185FA5', letterSpacing:'-.5px' }}>{result.setback}</div>
                    </div>
                  )}
                  {result.fees && (
                    <div style={{ padding:'16px', background:'#F4F7FA', borderRadius:'10px', textAlign:'center' }}>
                      <div style={{ fontSize:'10px', fontWeight:'700', color:'#9BA8B4', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:'6px' }}>Permit Fees</div>
                      <div style={{ fontSize:'16px', fontWeight:'800', color:'#185FA5', letterSpacing:'-.3px' }}>{result.fees}</div>
                    </div>
                  )}
                </div>

                {/* EMC note */}
                {result.emcNotes && (
                  <div style={{ background: result.emcAllowed ? '#F0FDF4' : '#FEF2F2', border:`1px solid ${result.emcAllowed ? '#86EFAC' : '#FECACA'}`, borderRadius:'10px', padding:'12px 16px', marginBottom:'14px', fontSize:'13px', color: result.emcAllowed ? '#15803D' : '#B91C1C', display:'flex', gap:'8px' }}>
                    <span>{result.emcAllowed ? '✅' : '🚫'}</span><span>{result.emcNotes}</span>
                  </div>
                )}

                {/* Red flags */}
                {result.redFlags && result.redFlags.length > 0 && (
                  <FadeIn>
                    <div className="result-card" style={{ border:'1.5px solid #E8EDF2', borderRadius:'14px', padding:'20px 24px', marginBottom:'12px', background:'#fff', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
                      <div style={{ fontSize:'11px', fontWeight:'700', color:'#9BA8B4', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'14px' }}>🚩 Red Flags & Watch Items</div>
                      {result.redFlags.map((flag, i) => (
                        <div key={i} style={{ display:'flex', gap:'10px', padding:'8px 0', borderBottom: i < result.redFlags!.length - 1 ? '1px solid #F4F7FA' : 'none', fontSize:'13px', color:'#0D1B2A', lineHeight:'1.55' }}>
                          <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#DC2626', flexShrink:0, marginTop:'7px' }}></div>{flag}
                        </div>
                      ))}
                    </div>
                  </FadeIn>
                )}

                {/* Required docs */}
                {result.requiredDocs && result.requiredDocs.length > 0 && (
                  <FadeIn>
                    <div className="result-card" style={{ border:'1.5px solid #E8EDF2', borderRadius:'14px', padding:'20px 24px', marginBottom:'12px', background:'#fff', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
                      <div style={{ fontSize:'11px', fontWeight:'700', color:'#9BA8B4', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'14px' }}>📋 Required Documents</div>
                      {result.requiredDocs.map((doc, i) => (
                        <div key={i} style={{ display:'flex', gap:'10px', padding:'8px 0', borderBottom: i < result.requiredDocs!.length - 1 ? '1px solid #F4F7FA' : 'none', fontSize:'13px', color:'#0D1B2A', lineHeight:'1.55' }}>
                          <span style={{ color:'#185FA5', fontWeight:'700', flexShrink:0 }}>✓</span>{doc}
                        </div>
                      ))}
                    </div>
                  </FadeIn>
                )}

                {/* Contacts */}
                {result.contacts && result.contacts.length > 0 && (
                  <FadeIn>
                    <div className="result-card" style={{ border:'1.5px solid #E8EDF2', borderRadius:'14px', padding:'20px 24px', marginBottom:'12px', background:'#fff', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
                      <div style={{ fontSize:'11px', fontWeight:'700', color:'#9BA8B4', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'14px' }}>📞 Contacts & Portals</div>
                      {result.contacts.map((c, i) => (
                        <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom: i < result.contacts!.length - 1 ? '1px solid #F4F7FA' : 'none', flexWrap:'wrap', gap:'8px' }}>
                          <span style={{ fontSize:'13px', color:'#5A6B7A' }}>{c.label}</span>
                          <span style={{ fontSize:'13px', color:'#0D1B2A', fontWeight:'600' }}>{c.value}</span>
                        </div>
                      ))}
                    </div>
                  </FadeIn>
                )}

                {/* Field notes */}
                {result.practitionerNotes && result.practitionerNotes.length > 0 && (
                  <FadeIn>
                    <div className="result-card" style={{ border:'1.5px solid #E8EDF2', borderRadius:'14px', padding:'20px 24px', marginBottom:'12px', background:'#fff', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
                      <div style={{ fontSize:'11px', fontWeight:'700', color:'#9BA8B4', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'14px' }}>🔧 Field Notes</div>
                      {result.practitionerNotes.map((note, i) => (
                        <div key={i} style={{ display:'flex', gap:'10px', padding:'8px 0', borderBottom: i < result.practitionerNotes!.length - 1 ? '1px solid #F4F7FA' : 'none', fontSize:'13px', color:'#5A6B7A', lineHeight:'1.55' }}>
                          <span style={{ color:'#185FA5', flexShrink:0, fontWeight:'700' }}>→</span>{note}
                        </div>
                      ))}
                    </div>
                  </FadeIn>
                )}

                {/* Official Code Language */}
                {result.codeLanguage && result.codeLanguage.length > 0 && (
                  <FadeIn>
                    <div className="result-card" style={{ border:'1.5px solid #E8EDF2', borderRadius:'14px', overflow:'hidden', background:'#fff', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
                      <div onClick={() => setCodeOpen(o => !o)} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 24px', cursor:'pointer', borderBottom: codeOpen ? '1px solid #E8EDF2' : 'none' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                          <div style={{ width:'36px', height:'36px', background:'rgba(24,95,165,0.07)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px' }}>📜</div>
                          <div>
                            <div style={{ fontSize:'14px', fontWeight:'700', color:'#0D1B2A' }}>Official Code Language</div>
                            <div style={{ fontSize:'12px', color:'#9BA8B4', marginTop:'2px' }}>{result.codeLanguage.length} ordinance sections · verbatim + plain English</div>
                          </div>
                        </div>
                        <span style={{ color:'#9BA8B4', display:'inline-block', transform: codeOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition:'transform 0.2s', fontSize:'18px' }}>⌄</span>
                      </div>
                      {codeOpen && (
                        <div>
                          <div style={{ display:'flex', gap:'6px', padding:'16px 24px 0' }}>
                            {(['simplified','verbatim'] as const).map(tab => (
                              <button key={tab} onClick={() => setCodeTab(tab)} style={{ padding:'6px 16px', borderRadius:'8px', fontSize:'12px', fontWeight:'600', border:'1.5px solid', cursor:'pointer', fontFamily:'inherit', background: codeTab === tab ? 'rgba(24,95,165,0.08)' : 'transparent', borderColor: codeTab === tab ? '#185FA5' : '#E8EDF2', color: codeTab === tab ? '#185FA5' : '#9BA8B4' }}>
                                {tab === 'simplified' ? '✏️ Plain English' : '⚖️ Verbatim Code'}
                              </button>
                            ))}
                          </div>
                          <div style={{ padding:'16px 24px 24px' }}>
                            {result.codeLanguage.map((cs, i) => (
                              <div key={i} style={{ borderBottom: i < result.codeLanguage!.length - 1 ? '1px solid #F4F7FA' : 'none', paddingBottom: i < result.codeLanguage!.length - 1 ? '16px' : 0, marginBottom: i < result.codeLanguage!.length - 1 ? '16px' : 0 }}>
                                <div style={{ display:'flex', alignItems:'baseline', gap:'8px', marginBottom:'8px' }}>
                                  <span style={{ fontFamily:'monospace', fontSize:'11px', fontWeight:'600', color:'#185FA5', background:'rgba(24,95,165,0.07)', padding:'2px 8px', borderRadius:'5px', flexShrink:0 }}>{cs.section}</span>
                                  <span style={{ fontSize:'11px', fontWeight:'700', color:'#9BA8B4', textTransform:'uppercase', letterSpacing:'.04em' }}>{cs.title}</span>
                                </div>
                                {codeTab === 'verbatim' ? (
                                  <div style={{ fontFamily:'monospace', fontSize:'12px', lineHeight:'1.7', color:'#5A6B7A', background:'#F4F7FA', borderLeft:'3px solid #BFDBFE', padding:'12px 14px', borderRadius:'0 8px 8px 0' }}>{cs.verbatim}</div>
                                ) : (
                                  <div style={{ fontSize:'13px', lineHeight:'1.65', color:'#0D1B2A', background:'#F0FDF4', borderLeft:'3px solid #86EFAC', padding:'12px 14px', borderRadius:'0 8px 8px 0' }}>{cs.simplified}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </FadeIn>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* DISCLAIMER */}
      <div style={{ padding:'20px 48px', borderTop:'1px solid #E8EDF2', background:'#F4F7FA' }}>
        <p style={{ fontSize:'11px', color:'#B4B2A9', lineHeight:'1.7', textAlign:'center', maxWidth:'720px', margin:'0 auto' }}>
          SignCode Pro provides general permit guidance based on publicly available sources to help sign professionals work more efficiently. Requirements vary by jurisdiction and change over time. Always verify requirements directly with the jurisdiction before submitting. SignCode Pro is not a legal authority and does not guarantee permit approval.
        </p>
      </div>

      {/* CTA — exact copy from homepage including grid overlay */}
      <section style={{ padding:'88px 48px', background:'linear-gradient(135deg,#0D1B2A 0%,#185FA5 100%)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, opacity:.04, backgroundImage:'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize:'40px 40px' }}/>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'500px', height:'500px', borderRadius:'50%', background:'radial-gradient(circle,rgba(133,183,235,.15) 0%,transparent 65%)', pointerEvents:'none' }}/>
        <div style={{ position:'relative', zIndex:2, maxWidth:'520px', margin:'0 auto', textAlign:'center' }}>
          <FadeIn>
            <h2 style={{ fontSize:'36px', fontWeight:'800', color:'#fff', marginBottom:'14px', letterSpacing:'-.5px', lineHeight:'1.18' }}>A better starting point<br/>for every permit job</h2>
            <p style={{ fontSize:'15px', color:'rgba(255,255,255,.65)', marginBottom:'32px', lineHeight:'1.7' }}>Join sign professionals already on the waitlist. Be first when we launch.</p>
            <a href="/waitlist" style={{ display:'inline-block', padding:'13px 28px', background:'#fff', color:'#185FA5', borderRadius:'9px', fontSize:'13px', fontWeight:'700', textDecoration:'none', boxShadow:'0 4px 16px rgba(0,0,0,.2)' }}>Join waitlist</a>
            <p style={{ fontSize:'11px', color:'rgba(255,255,255,.35)', marginTop:'16px' }}>No spam. No pressure. Just a heads up when we're ready.</p>
          </FadeIn>
        </div>
      </section>

      {/* FOOTER — exact copy from homepage */}
      <footer style={{ padding:'24px 48px', borderTop:'1px solid #E8EDF2', background:'#fff' }}>
        <div className="footer-row" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px', maxWidth:'1120px', margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <svg width="20" height="20" viewBox="0 0 80 80"><rect width="80" height="80" rx="14" fill="#185FA5"/><rect x="10" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="10" y="46" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="46" width="24" height="24" rx="5" fill="#fff"/><path d="M50 60l4 4 8-9" stroke="#185FA5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            <span style={{ fontSize:'13px', fontWeight:'700', color:'#0D1B2A' }}>Sign<span style={{ color:'#185FA5' }}>Code</span> Pro</span>
          </div>
          <div style={{ display:'flex', gap:'24px' }}>
            {[['Lookup tool','/lookup'],['Job tracker','/jobs'],['Waitlist','/waitlist']].map(([l,h]) => (
              <a key={l} href={h} style={{ fontSize:'12px', color:'#9BA8B4', textDecoration:'none', fontWeight:'500' }}>{l}</a>
            ))}
          </div>
          <div style={{ fontSize:'11px', color:'#B4B2A9' }}>© 2026 SignCode Pro. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
