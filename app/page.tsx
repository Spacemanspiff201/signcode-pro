'use client';
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch { setSubmitted(true); }
    setLoading(false);
  }

  return (
    <main style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: '#F8FAFC', color: '#0D1B2A', overflowX: 'hidden' }}>
      <style>{`
        @keyframes spinCW  { to { transform: rotate(360deg); } }
        @keyframes spinCCW { to { transform: rotate(-360deg); } }
        @keyframes floatA  { 0%,100%{transform:translateY(0px) rotate(45deg)} 50%{transform:translateY(-16px) rotate(55deg)} }
        @keyframes floatB  { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-12px) rotate(-5deg)} }
        @keyframes floatC  { 0%,100%{transform:translateY(0px) scale(1)} 50%{transform:translateY(-10px) scale(1.07)} }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes pulse   { 0%,100%{opacity:.12} 50%{opacity:.22} }

        .nav-link:hover { color:#0D1B2A !important; }
        .fc:hover { border-color:#185FA5 !important; transform:translateY(-2px); }
        .fc { transition: all .18s ease; }
        .h-btn-p:hover { background:#0F4A8A !important; }
        .h-btn-s:hover { background:#F4F7FA !important; }

        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .hero-section { padding: 52px 20px 40px !important; }
          .hero-h1 { font-size: 34px !important; }
          .hero-p { font-size: 15px !important; }
          .hero-actions { flex-direction: column !important; align-items: center !important; }
          .hero-actions a { width: 100% !important; text-align: center !important; max-width: 320px; }
          .search-wrap { flex-direction: column !important; gap: 8px !important; }
          .s-btn { width: 100% !important; }
          .svg-canvas { display: none !important; }
          .gbreak-content { gap: 24px !important; flex-wrap: wrap !important; padding: 0 20px !important; }
          .gstat-n { font-size: 28px !important; }
          .feats-section { padding: 52px 20px !important; }
          .feat-grid { grid-template-columns: 1fr !important; }
          .how-section { padding: 52px 20px !important; }
          .how-step { grid-template-columns: 1fr !important; gap: 24px !important; }
          .how-visual { display: none !important; }
          .pricing-section { padding: 52px 20px !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .cta-section { padding: 52px 20px !important; }
          .cta-form { flex-direction: column !important; }
          .cta-input { width: 100% !important; }
          .footer-inner { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
          .nav-inner { padding: 14px 20px !important; }
        }
        @media (max-width: 480px) {
          .hero-h1 { font-size: 28px !important; }
          .gbreak-content { gap: 16px !important; }
          .gstat { min-width: 120px !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ background: 'rgba(248,250,252,.96)', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)' }}>
        <div className="nav-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 48px', maxWidth: '1200px', margin: '0 auto' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <svg width="26" height="26" viewBox="0 0 80 80"><rect width="80" height="80" rx="14" fill="#185FA5"/><rect x="10" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="10" y="46" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="46" width="24" height="24" rx="5" fill="#fff"/><path d="M50 60l4 4 8-9" stroke="#185FA5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#0D1B2A' }}>Sign<span style={{ color: '#185FA5' }}>Code</span> Pro</span>
          </a>
          <div className="nav-links" style={{ display: 'flex', gap: '28px' }}>
            {['Product','Jurisdictions','Pricing','Blog'].map(l => (
              <a key={l} className="nav-link" href="#" style={{ fontSize: '13px', color: '#5A6B7A', textDecoration: 'none', transition: 'color .15s' }}>{l}</a>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <a href="/lookup" style={{ padding: '7px 16px', border: '1px solid #D0D9E2', borderRadius: '8px', fontSize: '13px', color: '#0D1B2A', textDecoration: 'none', background: '#fff' }}>Try lookup</a>
            <a href="/waitlist" style={{ padding: '8px 18px', background: '#185FA5', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>Join waitlist</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section" style={{ position: 'relative', padding: '80px 48px 56px', background: '#fff', borderBottom: '1px solid #E2E8F0', overflow: 'hidden' }}>
        {/* Abstract animated SVG */}
        <svg className="svg-canvas" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 1200 520" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <g style={{ transformOrigin: '120px 260px', animation: 'spinCW 20s linear infinite' }}>
            <circle cx="120" cy="260" r="88" fill="none" stroke="#185FA5" strokeWidth="1" strokeOpacity=".1" strokeDasharray="8 7"/>
          </g>
          <g style={{ transformOrigin: '120px 260px', animation: 'spinCCW 13s linear infinite' }}>
            <circle cx="120" cy="260" r="54" fill="none" stroke="#185FA5" strokeWidth="1.5" strokeOpacity=".15" strokeDasharray="4 8"/>
          </g>
          <circle cx="120" cy="260" r="5" fill="#185FA5" fillOpacity=".12"/>
          <g style={{ transformOrigin: '72px 110px', animation: 'floatA 6s ease-in-out infinite' }}>
            <rect x="52" y="90" width="38" height="38" rx="5" fill="none" stroke="#185FA5" strokeWidth="1.5" strokeOpacity=".18" transform="rotate(45 72 110)"/>
          </g>
          <g style={{ transformOrigin: '310px 72px', animation: 'floatC 5s ease-in-out infinite' }}>
            <circle cx="310" cy="72" r="16" fill="none" stroke="#185FA5" strokeWidth="1.5" strokeOpacity=".14"/>
            <circle cx="310" cy="72" r="4" fill="#185FA5" fillOpacity=".1"/>
          </g>
          <g fill="#185FA5" fillOpacity=".07">
            <circle cx="215" cy="170" r="3"/><circle cx="235" cy="170" r="3"/><circle cx="255" cy="170" r="3"/>
            <circle cx="215" cy="190" r="3"/><circle cx="235" cy="190" r="3"/><circle cx="255" cy="190" r="3"/>
            <circle cx="215" cy="210" r="3"/><circle cx="235" cy="210" r="3"/><circle cx="255" cy="210" r="3"/>
          </g>
          <g style={{ transformOrigin: '1090px 270px', animation: 'spinCCW 24s linear infinite' }}>
            <circle cx="1090" cy="270" r="96" fill="none" stroke="#185FA5" strokeWidth="1" strokeOpacity=".09" strokeDasharray="7 9"/>
          </g>
          <g style={{ transformOrigin: '1090px 270px', animation: 'spinCW 15s linear infinite' }}>
            <circle cx="1090" cy="270" r="58" fill="none" stroke="#85B7EB" strokeWidth="1.5" strokeOpacity=".18" strokeDasharray="4 6"/>
          </g>
          <circle cx="1090" cy="270" r="6" fill="#185FA5" fillOpacity=".1"/>
          <g style={{ transformOrigin: '1060px 120px', animation: 'floatB 7s ease-in-out infinite' }}>
            <polygon points="1060,90 1082,138 1038,138" fill="none" stroke="#185FA5" strokeWidth="1.5" strokeOpacity=".16"/>
          </g>
          <g style={{ transformOrigin: '880px 82px', animation: 'floatB 9s ease-in-out infinite 1s' }}>
            <circle cx="880" cy="82" r="13" fill="none" stroke="#85B7EB" strokeWidth="1.5" strokeOpacity=".2"/>
          </g>
          <g style={{ transformOrigin: '1130px 410px', animation: 'floatA 8s ease-in-out infinite 2s' }}>
            <rect x="1110" y="390" width="40" height="40" rx="4" fill="none" stroke="#185FA5" strokeWidth="1.5" strokeOpacity=".14" transform="rotate(25 1130 410)"/>
          </g>
          <g fill="#185FA5" fillOpacity=".07">
            <circle cx="940" cy="310" r="3"/><circle cx="960" cy="310" r="3"/><circle cx="980" cy="310" r="3"/>
            <circle cx="940" cy="330" r="3"/><circle cx="960" cy="330" r="3"/><circle cx="980" cy="330" r="3"/>
            <circle cx="940" cy="350" r="3"/><circle cx="960" cy="350" r="3"/><circle cx="980" cy="350" r="3"/>
          </g>
          <g style={{ transformOrigin: '52px 410px', animation: 'floatC 7s ease-in-out infinite 1s' }}>
            <rect x="34" y="392" width="34" height="34" rx="4" fill="none" stroke="#85B7EB" strokeWidth="1.5" strokeOpacity=".2" transform="rotate(15 52 410)"/>
          </g>
          <line x1="120" y1="260" x2="215" y2="190" stroke="#185FA5" strokeWidth=".5" strokeOpacity=".07"/>
          <line x1="1090" y1="270" x2="980" y2="330" stroke="#185FA5" strokeWidth=".5" strokeOpacity=".07"/>
        </svg>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 14px', background: '#EBF3FB', borderRadius: '20px', fontSize: '12px', color: '#185FA5', fontWeight: '600', marginBottom: '22px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#185FA5' }}/>
            Built for the commercial sign industry
          </div>
          <h1 className="hero-h1" style={{ fontSize: '50px', fontWeight: '800', color: '#0D1B2A', lineHeight: '1.1', letterSpacing: '-.8px', marginBottom: '18px' }}>
            Enter the address.<br/>
            <span style={{ color: '#185FA5' }}>Cut permit research time.</span>
          </h1>
          <p className="hero-p" style={{ fontSize: '16px', color: '#5A6B7A', lineHeight: '1.75', marginBottom: '28px', maxWidth: '520px', margin: '0 auto 28px' }}>
            SignCode Pro helps identify likely requirements, missing items, and code-backed next steps so your team can prepare cleaner submissions faster.
          </p>
          <div className="hero-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '14px' }}>
            <a href="/waitlist" className="h-btn-p" style={{ padding: '13px 28px', background: '#185FA5', color: '#fff', borderRadius: '10px', fontSize: '14px', fontWeight: '600', textDecoration: 'none', display: 'inline-block', transition: 'background .15s' }}>Join the waitlist</a>
            <a href="/lookup" className="h-btn-s" style={{ padding: '13px 24px', background: '#fff', color: '#0D1B2A', border: '1.5px solid #D0D9E2', borderRadius: '10px', fontSize: '14px', textDecoration: 'none', display: 'inline-block', transition: 'background .15s' }}>Try the lookup tool →</a>
          </div>
          <p style={{ fontSize: '11px', color: '#9BA8B4', marginBottom: '28px' }}>No credit card required · Florida jurisdictions covered · Free to look up</p>
          <div className="search-wrap" style={{ display: 'flex', alignItems: 'center', background: '#F4F7FA', border: '1.5px solid #E2E8F0', borderRadius: '12px', padding: '10px 14px', maxWidth: '560px', margin: '0 auto', gap: '10px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9BA8B4" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder="City or county — e.g. Miami, Fort Lauderdale, Pompano Beach..." style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '14px', color: '#0D1B2A', outline: 'none', minWidth: 0 }}/>
            <a href="/lookup" className="s-btn" style={{ padding: '8px 20px', background: '#185FA5', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: '600', textDecoration: 'none', whiteSpace: 'nowrap' }}>Look up</a>
          </div>
        </div>
      </section>

      {/* LOGO MARQUEE */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '20px 0' }}>
        <div style={{ fontSize: '11px', color: '#B4B2A9', textAlign: 'center', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '.07em' }}>Trusted by sign professionals at</div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', animation: 'marquee 22s linear infinite', width: 'max-content' }}>
            {['FASTSIGNS','SIGNARAMA','SIGNS BY TOMORROW','SPEEDPRO','ALPHAGRAPHICS','SIGNS NOW','BIG VISUAL GROUP','FASTSIGNS','SIGNARAMA','SIGNS BY TOMORROW','SPEEDPRO','ALPHAGRAPHICS','SIGNS NOW','BIG VISUAL GROUP'].map((n,i) => (
              <span key={i} style={{ padding: '6px 28px', borderRight: '1px solid #E2E8F0', fontSize: '12px', color: '#9BA8B4', fontWeight: '600', whiteSpace: 'nowrap' }}>{n}</span>
            ))}
          </div>
        </div>
      </div>

      {/* GRADIENT BREAK */}
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#0D1B2A 0%,#185FA5 45%,#85B7EB 75%,#EBF3FB 100%)' }}/>
        <div style={{ position: 'absolute', inset: 0, opacity: .05, backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '36px 36px' }}/>
        <div className="gbreak-content" style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '56px' }}>
          {[['10','FL jurisdictions covered'],['2–4 hrs','Research time saved per job'],['$0','Cost to look up'],['100%','Publicly sourced data']].map(([n,l]) => (
            <div key={n} className="gstat" style={{ textAlign: 'center' }}>
              <div className="gstat-n" style={{ fontSize: '36px', fontWeight: '800', color: '#fff', letterSpacing: '-.5px' }}>{n}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.6)', marginTop: '4px' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section className="feats-section" style={{ padding: '72px 48px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: '#185FA5', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '8px' }}>What SignCode Pro does</div>
        <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0D1B2A', marginBottom: '40px', letterSpacing: '-.4px', lineHeight: '1.2' }}>Everything your team needs<br/>to move permits faster</h2>
        <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
          {[
            { icon: '🔍', title: 'Jurisdiction lookup', desc: 'Requirements, fees, turnaround times, and direct contact info for any Florida jurisdiction in seconds.' },
            { icon: '📋', title: 'Document checklists', desc: 'Auto-generated checklists by sign type and jurisdiction. Check items off as you gather them.' },
            { icon: '📊', title: 'Job tracker', desc: 'Every permit job in one place with status, notes, and deadlines visible to your whole team.' },
            { icon: '⚠️', title: 'Red flag alerts', desc: 'Surface jurisdiction gotchas before they surprise you — Master Sign Programs, overlay districts, engineer seals.' },
            { icon: '📞', title: 'Direct contact info', desc: 'Right department, right number, right portal. Every time. No more hunting through city websites.' },
            { icon: '👥', title: 'Team visibility', desc: "Everyone sees every job's status. No more status-check calls or things falling through the cracks." },
          ].map(f => (
            <div key={f.title} className="fc" style={{ padding: '24px', border: '1.5px solid #E2E8F0', borderRadius: '14px', background: '#fff' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#EBF3FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '14px' }}>{f.icon}</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#0D1B2A', marginBottom: '6px' }}>{f.title}</div>
              <div style={{ fontSize: '12px', color: '#5A6B7A', lineHeight: '1.65' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section" style={{ padding: '72px 48px', background: '#F4F7FA', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#185FA5', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '8px' }}>How it works</div>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0D1B2A', letterSpacing: '-.4px' }}>From address to action in seconds</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { n: '01', title: 'Enter the job address and sign details', desc: 'Tell us where the sign is going, what type it is, and the basic dimensions. SignCode Pro identifies the jurisdiction automatically.' },
              { n: '02', title: 'Get likely requirements instantly', desc: 'SignCode Pro surfaces likely permit requirements, common red flags, and required documents for that sign type and jurisdiction.' },
              { n: '03', title: "See what's missing before you submit", desc: 'A checklist shows exactly what you need to gather. Check items off as you collect them. Reduce rejected submittals from missing documents.' },
              { n: '04', title: 'Track every job from research to approval', desc: 'Every permit job lives in one place. Your whole team sees the status. Nothing falls through the cracks.' },
            ].map(s => (
              <div key={s.n} style={{ display: 'flex', gap: '20px', background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '14px', padding: '22px 24px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#fff', minWidth: '36px', height: '26px', background: '#185FA5', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>{s.n}</div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#0D1B2A', marginBottom: '6px' }}>{s.title}</div>
                  <div style={{ fontSize: '13px', color: '#5A6B7A', lineHeight: '1.65' }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing-section" style={{ padding: '72px 48px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#185FA5', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '8px' }}>Pricing</div>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0D1B2A', marginBottom: '10px', letterSpacing: '-.4px' }}>Simple, justifiable pricing</h2>
          <p style={{ fontSize: '14px', color: '#5A6B7A' }}>One rejected submittal costs more than a year of SignCode Pro.</p>
        </div>
        <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
          {[
            { name: 'Starter', price: '$79', period: '/mo', desc: 'For small shops and solo permit runners', features: ['Jurisdiction lookup','Document checklists','Up to 10 active jobs','Email support'], highlight: false },
            { name: 'Professional', price: '$199', period: '/mo', desc: 'For growing teams handling multiple jobs', features: ['Everything in Starter','Unlimited active jobs','Team dashboard','Job status tracking','Red flag alerts','Priority support'], highlight: true },
            { name: 'Enterprise', price: 'Custom', period: '', desc: 'For large operations and multi-location shops', features: ['Everything in Professional','Custom jurisdictions','API access','Dedicated support','Team training'], highlight: false },
          ].map(p => (
            <div key={p.name} style={{ position: 'relative', padding: '28px', background: p.highlight ? '#EBF3FB' : '#fff', borderRadius: '16px', border: p.highlight ? '2px solid #185FA5' : '1.5px solid #E2E8F0' }}>
              {p.highlight && <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: '#185FA5', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '4px 16px', borderRadius: '20px', whiteSpace: 'nowrap' }}>Most popular</div>}
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#185FA5', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '10px' }}>{p.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px', marginBottom: '6px' }}>
                <span style={{ fontSize: '36px', fontWeight: '800', color: '#0D1B2A' }}>{p.price}</span>
                <span style={{ fontSize: '13px', color: '#9BA8B4' }}>{p.period}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#5A6B7A', marginBottom: '20px', lineHeight: '1.5' }}>{p.desc}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#0D1B2A', alignItems: 'center' }}>
                    <span style={{ color: '#185FA5', fontWeight: '700' }}>✓</span>{f}
                  </div>
                ))}
              </div>
              <a href="/waitlist" style={{ display: 'block', textAlign: 'center', padding: '11px', background: p.highlight ? '#185FA5' : '#fff', color: p.highlight ? '#fff' : '#185FA5', border: p.highlight ? 'none' : '1.5px solid #185FA5', borderRadius: '9px', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>Join waitlist</a>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#9BA8B4', marginTop: '20px' }}>Founding member pricing — 30% off Professional forever for early waitlist signups.</p>
      </section>

      {/* DISCLAIMER */}
      <div style={{ padding: '20px 48px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC' }}>
        <p style={{ fontSize: '11px', color: '#B4B2A9', lineHeight: '1.7', textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
          SignCode Pro provides general permit guidance based on publicly available sources to help sign professionals work more efficiently. Requirements vary by jurisdiction and change over time. Always verify requirements directly with the jurisdiction before submitting. SignCode Pro is not a legal authority and does not guarantee permit approval.
        </p>
      </div>

      {/* CTA */}
      <section className="cta-section" style={{ padding: '80px 48px', background: 'linear-gradient(135deg,#0D1B2A 0%,#185FA5 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: .04, backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '40px 40px' }}/>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '520px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '34px', fontWeight: '800', color: '#fff', marginBottom: '14px', letterSpacing: '-.4px', lineHeight: '1.2' }}>A better starting point<br/>for every permit job</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,.65)', marginBottom: '28px', lineHeight: '1.7' }}>Join sign professionals already on the waitlist. Be first when we launch.</p>
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <div className="cta-form" style={{ display: 'flex', gap: '10px', maxWidth: '420px', margin: '0 auto' }}>
                <input className="cta-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your work email" required style={{ flex: 1, padding: '12px 16px', borderRadius: '9px', border: 'none', fontSize: '14px', outline: 'none', background: 'rgba(255,255,255,.95)', color: '#0D1B2A', minWidth: 0 }}/>
                <button type="submit" disabled={loading} style={{ padding: '12px 22px', background: '#fff', color: '#185FA5', border: 'none', borderRadius: '9px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {loading ? 'Joining...' : 'Join waitlist'}
                </button>
              </div>
            </form>
          ) : (
            <div style={{ background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', borderRadius: '12px', padding: '20px', color: '#fff', fontSize: '14px' }}>
              You're on the list. We'll be in touch when we launch. 🙌
            </div>
          )}
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,.35)', marginTop: '16px' }}>No spam. No pressure. Just a heads up when we're ready.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '24px 48px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC' }}>
        <div className="footer-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 80 80"><rect width="80" height="80" rx="14" fill="#185FA5"/><rect x="10" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="10" y="46" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="46" width="24" height="24" rx="5" fill="#fff"/><path d="M50 60l4 4 8-9" stroke="#185FA5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#0D1B2A' }}>Sign<span style={{ color: '#185FA5' }}>Code</span> Pro</span>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            {[['Lookup tool','/lookup'],['Job tracker','/jobs'],['Waitlist','/waitlist']].map(([l,h]) => (
              <a key={l} href={h} style={{ fontSize: '12px', color: '#9BA8B4', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
          <div style={{ fontSize: '11px', color: '#B4B2A9' }}>© 2026 SignCode Pro. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
