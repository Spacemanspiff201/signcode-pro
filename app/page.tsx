'use client';
import { useState, useEffect, useRef } from 'react';

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

export default function Home() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => { setTimeout(() => setHeroVisible(true), 80); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      setSubmitted(true);
    } catch { setSubmitted(true); }
    setLoading(false);
  }

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
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes glow    { 0%,100%{opacity:.45} 50%{opacity:.75} }
        @keyframes heroIn  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        .feat-card { transition: all .22s ease; }
        .feat-card:hover { transform:translateY(-5px); border-color:rgba(24,95,165,.25) !important; box-shadow:0 16px 48px rgba(24,95,165,.1),0 0 0 1px rgba(24,95,165,.12) !important; }
        .feat-icon { transition: all .22s ease; }
        .feat-card:hover .feat-icon { background: rgba(24,95,165,.12) !important; transform: scale(1.1); }

        .step-row { transition: all .2s ease; }
        .step-row:hover { background:#fff !important; border-color:rgba(24,95,165,.2) !important; box-shadow: 0 4px 20px rgba(24,95,165,.07); }

        .price-card { transition: all .22s ease; }
        .price-card:hover { transform:translateY(-4px); box-shadow:0 20px 56px rgba(0,0,0,.1) !important; }

        .nav-link:hover { color:#0D1B2A !important; }

        .primary-btn { transition: all .18s ease; }
        .primary-btn:hover { transform:translateY(-1px); box-shadow:0 8px 28px rgba(24,95,165,.38) !important; background:#1454A0 !important; }
        .primary-btn:active { transform:translateY(0); }

        .secondary-btn { transition: all .18s ease; }
        .secondary-btn:hover { background:#fff !important; border-color:#B5D4F4 !important; box-shadow:0 4px 16px rgba(24,95,165,.1); }

        .jur-pill { transition: all .15s; }
        .jur-pill:hover { background:#EBF3FB !important; color:#185FA5 !important; border-color:#B5D4F4 !important; }

        @media(max-width:768px){
          .nav-links{display:none !important;}
          .hero-h1{font-size:36px !important;line-height:1.12 !important;}
          .hero-btns{flex-direction:column !important;}
          .search-row{flex-direction:column !important;}
          .stats-wrap{grid-template-columns:repeat(2,1fr) !important;gap:28px !important;}
          .feat-grid{grid-template-columns:1fr !important;}
          .price-grid{grid-template-columns:1fr !important;}
          .section{padding:64px 24px !important;}
          .hero-section{padding:72px 24px 0 !important;}
          .footer-row{flex-direction:column !important;gap:16px !important;}
        }
      `}</style>

      {/* NAV */}
      <nav style={{ background:'rgba(250,251,253,0.94)', borderBottom:'1px solid rgba(0,0,0,0.07)', position:'sticky', top:0, zIndex:100, backdropFilter:'blur(14px)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 48px', maxWidth:'1200px', margin:'0 auto', height:'62px' }}>
          <a href="/" style={{ display:'flex', alignItems:'center', gap:'9px', textDecoration:'none' }}>
            <svg width="28" height="28" viewBox="0 0 80 80"><rect width="80" height="80" rx="14" fill="#185FA5"/><rect x="10" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="10" y="46" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="46" width="24" height="24" rx="5" fill="#fff"/><path d="M50 60l4 4 8-9" stroke="#185FA5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            <span style={{ fontSize:'15px', fontWeight:'700', color:'#0D1B2A', letterSpacing:'-.2px' }}>Sign<span style={{ color:'#185FA5' }}>Code</span> Pro</span>
          </a>
          <div className="nav-links" style={{ display:'flex', gap:'32px' }}>
            {['Product','Jurisdictions','Pricing','Blog'].map(l => (
              <a key={l} className="nav-link" href="#" style={{ fontSize:'13px', color:'#5A6B7A', textDecoration:'none', fontWeight:'500', transition:'color .15s' }}>{l}</a>
            ))}
          </div>
          <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
            <a href="/lookup" style={{ padding:'7px 18px', border:'1px solid #D8E2EC', borderRadius:'8px', fontSize:'13px', color:'#0D1B2A', textDecoration:'none', background:'#fff', fontWeight:'500' }}>Try lookup</a>
            <a href="/waitlist" className="primary-btn" style={{ padding:'8px 20px', background:'#185FA5', color:'#fff', borderRadius:'8px', fontSize:'13px', fontWeight:'600', textDecoration:'none', boxShadow:'0 2px 8px rgba(24,95,165,.28)' }}>Join waitlist</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section" style={{ position:'relative', padding:'88px 48px 0', background:'#fff', borderBottom:'1px solid #E8EDF2', overflow:'hidden', minHeight:'560px' }}>

        {/* Soft radial glow behind headline */}
        <div style={{ position:'absolute', top:'-120px', left:'50%', transform:'translateX(-50%)', width:'800px', height:'600px', background:'radial-gradient(ellipse at center, rgba(24,95,165,0.07) 0%, transparent 65%)', pointerEvents:'none', animation:'glow 6s ease-in-out infinite' }} />

        {/* Animated SVG background — refined, same concept but more subtle */}
        <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', opacity:0.65 }} viewBox="0 0 1200 560" preserveAspectRatio="xMidYMid slice">
          {/* Left cluster */}
          <g style={{ transformOrigin:'110px 280px', animation:'spinCW 22s linear infinite' }}>
            <circle cx="110" cy="280" r="92" fill="none" stroke="#185FA5" strokeWidth="1" strokeOpacity=".08" strokeDasharray="6 8"/>
          </g>
          <g style={{ transformOrigin:'110px 280px', animation:'spinCCW 14s linear infinite' }}>
            <circle cx="110" cy="280" r="56" fill="none" stroke="#185FA5" strokeWidth="1.2" strokeOpacity=".1" strokeDasharray="3 7"/>
          </g>
          <circle cx="110" cy="280" r="4" fill="#185FA5" fillOpacity=".1"/>
          <g style={{ transformOrigin:'68px 118px', animation:'floatA 6.5s ease-in-out infinite' }}>
            <rect x="48" y="98" width="40" height="40" rx="6" fill="none" stroke="#185FA5" strokeWidth="1.5" strokeOpacity=".12" transform="rotate(45 68 118)"/>
          </g>
          <g style={{ transformOrigin:'320px 68px', animation:'floatC 5.5s ease-in-out infinite' }}>
            <circle cx="320" cy="68" r="15" fill="none" stroke="#185FA5" strokeWidth="1.2" strokeOpacity=".1"/>
            <circle cx="320" cy="68" r="3.5" fill="#185FA5" fillOpacity=".08"/>
          </g>
          <g fill="#185FA5" fillOpacity=".06">
            {[0,1,2].map(r => [0,1,2].map(c => <circle key={`${r}${c}`} cx={220+c*20} cy={170+r*20} r="2.5"/>))}
          </g>
          {/* Right cluster */}
          <g style={{ transformOrigin:'1090px 280px', animation:'spinCCW 26s linear infinite' }}>
            <circle cx="1090" cy="280" r="100" fill="none" stroke="#185FA5" strokeWidth="1" strokeOpacity=".07" strokeDasharray="6 10"/>
          </g>
          <g style={{ transformOrigin:'1090px 280px', animation:'spinCW 16s linear infinite' }}>
            <circle cx="1090" cy="280" r="62" fill="none" stroke="#85B7EB" strokeWidth="1.2" strokeOpacity=".12" strokeDasharray="3 6"/>
          </g>
          <circle cx="1090" cy="280" r="5" fill="#185FA5" fillOpacity=".08"/>
          <g style={{ transformOrigin:'1065px 118px', animation:'floatB 7.5s ease-in-out infinite' }}>
            <polygon points="1065,88 1089,138 1041,138" fill="none" stroke="#185FA5" strokeWidth="1.5" strokeOpacity=".1"/>
          </g>
          <g style={{ transformOrigin:'880px 80px', animation:'floatB 9s ease-in-out infinite 1s' }}>
            <circle cx="880" cy="80" r="12" fill="none" stroke="#85B7EB" strokeWidth="1.2" strokeOpacity=".14"/>
          </g>
          <g style={{ transformOrigin:'1135px 420px', animation:'floatA 8s ease-in-out infinite 2s' }}>
            <rect x="1115" y="400" width="40" height="40" rx="4" fill="none" stroke="#185FA5" strokeWidth="1.5" strokeOpacity=".1" transform="rotate(20 1135 420)"/>
          </g>
          <g fill="#185FA5" fillOpacity=".06">
            {[0,1,2].map(r => [0,1,2].map(c => <circle key={`r${r}${c}`} cx={940+c*20} cy={310+r*20} r="2.5"/>))}
          </g>
          <g style={{ transformOrigin:'48px 420px', animation:'floatC 7s ease-in-out infinite 1s' }}>
            <rect x="30" y="402" width="36" height="36" rx="4" fill="none" stroke="#85B7EB" strokeWidth="1.5" strokeOpacity=".14" transform="rotate(15 48 420)"/>
          </g>
          <line x1="110" y1="280" x2="220" y2="190" stroke="#185FA5" strokeWidth=".4" strokeOpacity=".06"/>
          <line x1="1090" y1="280" x2="940" y2="330" stroke="#185FA5" strokeWidth=".4" strokeOpacity=".06"/>
        </svg>

        {/* Hero content */}
        <div style={{ position:'relative', zIndex:2, maxWidth:'700px', margin:'0 auto', textAlign:'center' }}>
          <div style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(16px)', transition:'opacity .6s ease, transform .6s ease' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'7px', padding:'5px 14px', background:'linear-gradient(135deg,#EBF3FB,#F0F6FD)', border:'1px solid #C5DDF5', borderRadius:'20px', fontSize:'12px', color:'#185FA5', fontWeight:'600', marginBottom:'24px' }}>
              <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#185FA5', animation:'glow 2s ease-in-out infinite' }}/>
              Built for the commercial sign industry
            </div>
          </div>

          <div style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(20px)', transition:'opacity .65s ease 120ms, transform .65s ease 120ms' }}>
            <h1 className="hero-h1" style={{ fontSize:'52px', fontWeight:'800', color:'#0D1B2A', lineHeight:'1.08', letterSpacing:'-1.2px', marginBottom:'20px' }}>
              Enter the address.<br/>
              <span style={{ color:'#185FA5', position:'relative' }}>
                Cut permit research time.
                <svg style={{ position:'absolute', bottom:'-6px', left:0, width:'100%', height:'6px', opacity:.35 }} viewBox="0 0 400 6" preserveAspectRatio="none"><path d="M0 5 Q100 1 200 4 Q300 7 400 3" stroke="#185FA5" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>
              </span>
            </h1>
          </div>

          <div style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(20px)', transition:'opacity .65s ease 220ms, transform .65s ease 220ms' }}>
            <p style={{ fontSize:'16px', color:'#5A6B7A', lineHeight:'1.75', marginBottom:'32px', maxWidth:'500px', margin:'0 auto 32px' }}>
              SignCode Pro identifies likely requirements, flags missing documents, and surfaces jurisdiction-specific gotchas — so your team submits cleaner, faster.
            </p>
          </div>

          <div className="hero-btns" style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(20px)', transition:'opacity .65s ease 320ms, transform .65s ease 320ms', display:'flex', gap:'12px', justifyContent:'center', marginBottom:'16px', flexWrap:'wrap' }}>
            <a href="/waitlist" className="primary-btn" style={{ padding:'13px 30px', background:'#185FA5', color:'#fff', borderRadius:'10px', fontSize:'14px', fontWeight:'600', textDecoration:'none', display:'inline-block', boxShadow:'0 4px 16px rgba(24,95,165,.32)', letterSpacing:'-.1px' }}>Join the waitlist</a>
            <a href="/lookup" className="secondary-btn" style={{ padding:'13px 26px', background:'#fff', color:'#0D1B2A', border:'1.5px solid #D8E2EC', borderRadius:'10px', fontSize:'14px', textDecoration:'none', display:'inline-block', fontWeight:'500' }}>Try the lookup tool →</a>
          </div>

          <div style={{ opacity: heroVisible ? 1 : 0, transition:'opacity .65s ease 400ms', fontSize:'11px', color:'#9BA8B4', marginBottom:'36px' }}>
            No credit card required · Florida jurisdictions covered · Free to look up
          </div>

          {/* Search bar */}
          <div style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(12px)', transition:'opacity .65s ease 480ms, transform .65s ease 480ms' }}>
            <div className="search-row" style={{ display:'flex', alignItems:'center', background:'#fff', border:'1.5px solid #D8E2EC', borderRadius:'12px', padding:'10px 14px', maxWidth:'580px', margin:'0 auto', gap:'10px', boxShadow:'0 4px 20px rgba(0,0,0,0.06)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9BA8B4" strokeWidth="2.2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input placeholder="City or county — e.g. Miami, Fort Lauderdale, Pompano Beach..." style={{ flex:1, border:'none', background:'transparent', fontSize:'13.5px', color:'#0D1B2A', outline:'none', minWidth:0 }}/>
              <a href="/lookup" style={{ padding:'8px 20px', background:'#185FA5', color:'#fff', borderRadius:'8px', fontSize:'13px', fontWeight:'600', textDecoration:'none', whiteSpace:'nowrap', flexShrink:0 }}>Look up</a>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ background:'#fff', borderBottom:'1px solid #E8EDF2', padding:'18px 0', overflow:'hidden' }}>
        <div style={{ fontSize:'10px', color:'#C2C0B6', textAlign:'center', marginBottom:'12px', textTransform:'uppercase', letterSpacing:'.1em', fontWeight:'600' }}>Trusted by sign professionals working with</div>
        <div style={{ overflow:'hidden' }}>
          <div style={{ display:'flex', animation:'marquee 24s linear infinite', width:'max-content' }}>
            {['FASTSIGNS','SIGNARAMA','SIGNS BY TOMORROW','SPEEDPRO','ALPHAGRAPHICS','SIGNS NOW','BIG VISUAL GROUP','FASTSIGNS','SIGNARAMA','SIGNS BY TOMORROW','SPEEDPRO','ALPHAGRAPHICS','SIGNS NOW','BIG VISUAL GROUP'].map((n,i) => (
              <span key={i} style={{ padding:'4px 28px', borderRight:'1px solid #E8EDF2', fontSize:'11.5px', color:'#9BA8B4', fontWeight:'700', whiteSpace:'nowrap', letterSpacing:'.04em' }}>{n}</span>
            ))}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{ background:'linear-gradient(135deg,#0D1B2A 0%,#163C6A 50%,#185FA5 100%)', padding:'56px 48px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, opacity:.04, backgroundImage:'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize:'40px 40px' }}/>
        <div style={{ position:'absolute', top:'-60px', right:'10%', width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle,rgba(133,183,235,.18) 0%,transparent 65%)', pointerEvents:'none' }}/>
        <div className="stats-wrap" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0', maxWidth:'900px', margin:'0 auto', position:'relative', zIndex:2 }}>
          {[['10','FL jurisdictions covered'],['2–4 hrs','Research time saved per job'],['$0','Cost to look up'],['100%','Publicly sourced data']].map(([n,l], i) => (
            <div key={n} style={{ textAlign:'center', padding:'0 24px', borderRight: i < 3 ? '1px solid rgba(255,255,255,.1)' : 'none' }}>
              <div style={{ fontSize:'38px', fontWeight:'800', color:'#fff', letterSpacing:'-1px', lineHeight:1, marginBottom:'8px' }}>{n}</div>
              <div style={{ fontSize:'12px', color:'rgba(255,255,255,.55)', lineHeight:'1.5', fontWeight:'500' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section className="section" style={{ padding:'80px 48px', maxWidth:'1120px', margin:'0 auto' }}>
        <FadeIn>
          <div style={{ marginBottom:'48px' }}>
            <div style={{ fontSize:'11px', fontWeight:'700', color:'#185FA5', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:'10px' }}>What SignCode Pro does</div>
            <h2 style={{ fontSize:'34px', fontWeight:'800', color:'#0D1B2A', letterSpacing:'-.5px', lineHeight:'1.2', maxWidth:'480px' }}>Everything your team needs to move permits faster</h2>
          </div>
        </FadeIn>
        <div className="feat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px' }}>
          {[
            { icon:'🔍', title:'Jurisdiction lookup', desc:'Requirements, fees, turnaround times, and direct contact info for any Florida jurisdiction in seconds.' },
            { icon:'📋', title:'Document checklists', desc:'Auto-generated checklists by sign type and jurisdiction. Check items off as you gather them.' },
            { icon:'📊', title:'Job tracker', desc:'Every permit job in one place with status, notes, and deadlines visible to your whole team.' },
            { icon:'⚠️', title:'Red flag alerts', desc:'Surface jurisdiction gotchas before they surprise you — Master Sign Programs, overlay districts, engineer seals.' },
            { icon:'📞', title:'Direct contact info', desc:'Right department, right number, right portal. Every time. No more hunting through city websites.' },
            { icon:'👥', title:'Team visibility', desc:"Everyone sees every job's status. No more status-check calls or things falling through the cracks." },
          ].map((f, i) => (
            <FadeIn key={f.title} delay={i * 60}>
              <div className="feat-card" style={{ padding:'24px', border:'1.5px solid #E8EDF2', borderRadius:'14px', background:'#fff', height:'100%', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
                <div className="feat-icon" style={{ width:'44px', height:'44px', borderRadius:'11px', background:'rgba(24,95,165,0.07)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', marginBottom:'14px' }}>{f.icon}</div>
                <div style={{ fontSize:'14px', fontWeight:'700', color:'#0D1B2A', marginBottom:'7px', letterSpacing:'-.1px' }}>{f.title}</div>
                <div style={{ fontSize:'12.5px', color:'#5A6B7A', lineHeight:'1.65' }}>{f.desc}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" style={{ padding:'80px 48px', background:'#F4F7FA', borderTop:'1px solid #E8EDF2', borderBottom:'1px solid #E8EDF2' }}>
        <div style={{ maxWidth:'760px', margin:'0 auto' }}>
          <FadeIn>
            <div style={{ textAlign:'center', marginBottom:'48px' }}>
              <div style={{ fontSize:'11px', fontWeight:'700', color:'#185FA5', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:'10px' }}>How it works</div>
              <h2 style={{ fontSize:'34px', fontWeight:'800', color:'#0D1B2A', letterSpacing:'-.5px' }}>From address to action in seconds</h2>
            </div>
          </FadeIn>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {[
              { n:'01', title:'Enter the job address and sign details', desc:'Tell us where the sign is going, what type it is, and the basic dimensions. SignCode Pro identifies the jurisdiction automatically.' },
              { n:'02', title:'Get likely requirements instantly', desc:'SignCode Pro surfaces likely permit requirements, common red flags, and required documents for that sign type and jurisdiction.' },
              { n:'03', title:"See what's missing before you submit", desc:'A checklist shows exactly what you need to gather. Check items off as you collect them. Reduce rejected submittals from missing documents.' },
              { n:'04', title:'Track every job from research to approval', desc:'Every permit job lives in one place. Your whole team sees the status. Nothing falls through the cracks.' },
            ].map((s, i) => (
              <FadeIn key={s.n} delay={i * 80}>
                <div className="step-row" style={{ display:'flex', gap:'18px', background:'rgba(255,255,255,.7)', border:'1.5px solid #E8EDF2', borderRadius:'14px', padding:'20px 24px', alignItems:'flex-start', backdropFilter:'blur(4px)' }}>
                  <div style={{ fontSize:'11px', fontWeight:'700', color:'#fff', minWidth:'34px', height:'26px', background:'#185FA5', borderRadius:'20px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'2px', letterSpacing:'.02em', boxShadow:'0 2px 8px rgba(24,95,165,.3)' }}>{s.n}</div>
                  <div>
                    <div style={{ fontSize:'15px', fontWeight:'700', color:'#0D1B2A', marginBottom:'5px', letterSpacing:'-.1px' }}>{s.title}</div>
                    <div style={{ fontSize:'13px', color:'#5A6B7A', lineHeight:'1.65' }}>{s.desc}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section" style={{ padding:'80px 48px', maxWidth:'1120px', margin:'0 auto' }}>
        <FadeIn>
          <div style={{ textAlign:'center', marginBottom:'48px' }}>
            <div style={{ fontSize:'11px', fontWeight:'700', color:'#185FA5', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:'10px' }}>Pricing</div>
            <h2 style={{ fontSize:'34px', fontWeight:'800', color:'#0D1B2A', marginBottom:'10px', letterSpacing:'-.5px' }}>Simple, justifiable pricing</h2>
            <p style={{ fontSize:'14px', color:'#5A6B7A' }}>One rejected submittal costs more than a year of SignCode Pro.</p>
          </div>
        </FadeIn>
        <div className="price-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px' }}>
          {[
            { name:'Starter', price:'$79', period:'/mo', desc:'For small shops and solo permit runners', features:['Jurisdiction lookup','Document checklists','Up to 10 active jobs','Email support'], highlight:false },
            { name:'Professional', price:'$199', period:'/mo', desc:'For growing teams handling multiple jobs', features:['Everything in Starter','Unlimited active jobs','Team dashboard','Job status tracking','Red flag alerts','Priority support'], highlight:true },
            { name:'Enterprise', price:'Custom', period:'', desc:'For large operations and multi-location shops', features:['Everything in Professional','Custom jurisdictions','API access','Dedicated support','Team training'], highlight:false },
          ].map((p, i) => (
            <FadeIn key={p.name} delay={i * 80}>
              <div className="price-card" style={{ position:'relative', padding:'28px', background: p.highlight ? 'linear-gradient(160deg,#EBF3FB,#F5F9FE)' : '#fff', borderRadius:'16px', border: p.highlight ? '2px solid #185FA5' : '1.5px solid #E8EDF2', boxShadow: p.highlight ? '0 8px 32px rgba(24,95,165,.15)' : '0 2px 8px rgba(0,0,0,.04)', height:'100%' }}>
                {p.highlight && <div style={{ position:'absolute', top:'-13px', left:'50%', transform:'translateX(-50%)', background:'#185FA5', color:'#fff', fontSize:'11px', fontWeight:'700', padding:'4px 18px', borderRadius:'20px', whiteSpace:'nowrap', boxShadow:'0 2px 8px rgba(24,95,165,.35)' }}>Most popular</div>}
                <div style={{ fontSize:'11px', fontWeight:'700', color:'#185FA5', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'12px' }}>{p.name}</div>
                <div style={{ display:'flex', alignItems:'baseline', gap:'3px', marginBottom:'6px' }}>
                  <span style={{ fontSize:'38px', fontWeight:'800', color:'#0D1B2A', letterSpacing:'-1px' }}>{p.price}</span>
                  <span style={{ fontSize:'13px', color:'#9BA8B4', fontWeight:'500' }}>{p.period}</span>
                </div>
                <div style={{ fontSize:'12.5px', color:'#5A6B7A', marginBottom:'22px', lineHeight:'1.55' }}>{p.desc}</div>
                <div style={{ display:'flex', flexDirection:'column', gap:'9px', marginBottom:'24px' }}>
                  {p.features.map(f => (
                    <div key={f} style={{ display:'flex', gap:'9px', fontSize:'12.5px', color:'#0D1B2A', alignItems:'center' }}>
                      <span style={{ color:'#185FA5', fontWeight:'700', fontSize:'13px', flexShrink:0 }}>✓</span>{f}
                    </div>
                  ))}
                </div>
                <a href="/waitlist" style={{ display:'block', textAlign:'center', padding:'11px', background: p.highlight ? '#185FA5' : '#fff', color: p.highlight ? '#fff' : '#185FA5', border: p.highlight ? 'none' : '1.5px solid #185FA5', borderRadius:'9px', fontSize:'13px', fontWeight:'600', textDecoration:'none', boxShadow: p.highlight ? '0 4px 12px rgba(24,95,165,.28)' : 'none' }}>Join waitlist</a>
              </div>
            </FadeIn>
          ))}
        </div>
        <p style={{ textAlign:'center', fontSize:'12px', color:'#9BA8B4', marginTop:'20px' }}>Founding member pricing — 30% off Professional forever for early waitlist signups.</p>
      </section>

      {/* DISCLAIMER */}
      <div style={{ padding:'20px 48px', borderTop:'1px solid #E8EDF2', background:'#F4F7FA' }}>
        <p style={{ fontSize:'11px', color:'#B4B2A9', lineHeight:'1.7', textAlign:'center', maxWidth:'720px', margin:'0 auto' }}>
          SignCode Pro provides general permit guidance based on publicly available sources to help sign professionals work more efficiently. Requirements vary by jurisdiction and change over time. Always verify requirements directly with the jurisdiction before submitting. SignCode Pro is not a legal authority and does not guarantee permit approval.
        </p>
      </div>

      {/* CTA */}
      <section className="section" style={{ padding:'88px 48px', background:'linear-gradient(135deg,#0D1B2A 0%,#185FA5 100%)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, opacity:.04, backgroundImage:'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize:'40px 40px' }}/>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'500px', height:'500px', borderRadius:'50%', background:'radial-gradient(circle,rgba(133,183,235,.15) 0%,transparent 65%)', pointerEvents:'none' }}/>
        <div style={{ position:'relative', zIndex:2, maxWidth:'520px', margin:'0 auto', textAlign:'center' }}>
          <FadeIn>
            <h2 style={{ fontSize:'36px', fontWeight:'800', color:'#fff', marginBottom:'14px', letterSpacing:'-.5px', lineHeight:'1.18' }}>A better starting point<br/>for every permit job</h2>
            <p style={{ fontSize:'15px', color:'rgba(255,255,255,.65)', marginBottom:'32px', lineHeight:'1.7' }}>Join sign professionals already on the waitlist. Be first when we launch.</p>
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <div style={{ display:'flex', gap:'10px', maxWidth:'420px', margin:'0 auto' }}>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your work email" required style={{ flex:1, padding:'13px 16px', borderRadius:'9px', border:'1px solid rgba(255,255,255,.2)', fontSize:'14px', outline:'none', background:'rgba(255,255,255,.12)', color:'#fff', backdropFilter:'blur(4px)' }}/>
                  <button type="submit" disabled={loading} style={{ padding:'13px 22px', background:'#fff', color:'#185FA5', border:'none', borderRadius:'9px', fontSize:'13px', fontWeight:'700', cursor:'pointer', whiteSpace:'nowrap', boxShadow:'0 4px 16px rgba(0,0,0,.2)' }}>
                    {loading ? 'Joining...' : 'Join waitlist'}
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.2)', borderRadius:'12px', padding:'20px', color:'#fff', fontSize:'14px', backdropFilter:'blur(8px)' }}>
                You're on the list. We'll be in touch when we launch. 🙌
              </div>
            )}
            <p style={{ fontSize:'11px', color:'rgba(255,255,255,.35)', marginTop:'16px' }}>No spam. No pressure. Just a heads up when we're ready.</p>
          </FadeIn>
        </div>
      </section>

      {/* FOOTER */}
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
