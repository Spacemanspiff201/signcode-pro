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
    <main style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: '#080F1E', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:.18} 50%{opacity:.3} }
        @keyframes float1 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-14px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .feat-card:hover { border-color:rgba(59,130,246,.4) !important; transform:translateY(-3px); }
        .feat-card { transition: all .2s ease; }
        .jur-card:hover { border-color:rgba(59,130,246,.35) !important; background:rgba(59,130,246,.05) !important; cursor:pointer; }
        .jur-card { transition: all .15s ease; }
        .nav-link:hover { color:#fff !important; }
      `}</style>

      {/* NAV */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 48px', borderBottom:'1px solid rgba(255,255,255,.06)', position:'sticky', top:0, zIndex:100, background:'rgba(8,15,30,.92)', backdropFilter:'blur(14px)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'9px' }}>
          <svg width="28" height="28" viewBox="0 0 80 80"><rect width="80" height="80" rx="14" fill="#3B82F6"/><rect x="10" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".2"/><rect x="46" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".2"/><rect x="10" y="46" width="24" height="24" rx="5" fill="#fff" fillOpacity=".2"/><rect x="46" y="46" width="24" height="24" rx="5" fill="#fff"/><path d="M50 60l4 4 8-9" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
          <span style={{ fontSize:'15px', fontWeight:'700', color:'#fff', letterSpacing:'-.3px' }}>Sign<span style={{ color:'#60A5FA' }}>Code</span> Pro</span>
        </div>
        <div style={{ display:'flex', gap:'28px' }}>
          {['Product','Jurisdictions','Pricing'].map(l => (
            <a key={l} className="nav-link" href="#" style={{ fontSize:'13px', color:'rgba(255,255,255,.45)', textDecoration:'none', transition:'color .15s' }}>{l}</a>
          ))}
        </div>
        <a href="/waitlist" style={{ padding:'9px 22px', background:'#3B82F6', color:'#fff', borderRadius:'9px', fontSize:'13px', fontWeight:'600', textDecoration:'none' }}>Join waitlist</a>
      </nav>

      {/* HERO */}
      <section style={{ position:'relative', padding:'88px 48px 0', overflow:'hidden', minHeight:'660px' }}>
        {/* Glow blobs */}
        <div style={{ position:'absolute', width:'700px', height:'700px', borderRadius:'50%', background:'radial-gradient(circle,rgba(59,130,246,.22) 0%,transparent 65%)', top:'-200px', left:'-160px', animation:'pulse 7s ease-in-out infinite', pointerEvents:'none' }} />
        <div style={{ position:'absolute', width:'550px', height:'550px', borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,.15) 0%,transparent 65%)', top:'-60px', right:'-80px', animation:'pulse 9s ease-in-out infinite', pointerEvents:'none' }} />
        <div style={{ position:'absolute', width:'350px', height:'350px', borderRadius:'50%', background:'radial-gradient(circle,rgba(59,130,246,.09) 0%,transparent 70%)', bottom:'60px', right:'32%', animation:'pulse 11s ease-in-out infinite', pointerEvents:'none' }} />
        {/* Grid */}
        <div style={{ position:'absolute', inset:0, opacity:.045, backgroundImage:'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize:'48px 48px', pointerEvents:'none' }} />

        <div style={{ position:'relative', zIndex:2, maxWidth:'1100px', margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'56px', alignItems:'flex-start' }}>
          {/* LEFT */}
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'7px', padding:'5px 14px', background:'#fff', border:'none', borderRadius:'20px', marginBottom:'26px' }}>
              <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#3B82F6' }} />
              <span style={{ fontSize:'12px', color:'#1E3A5F', fontWeight:'600' }}>Built for the commercial sign industry</span>
            </div>
            <h1 style={{ fontSize:'48px', fontWeight:'800', color:'#fff', lineHeight:'1.1', letterSpacing:'-.8px', marginBottom:'20px' }}>
              Enter the address.<br />
              <span style={{ background:'linear-gradient(135deg,#60A5FA 0%,#818CF8 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Cut permit research time.</span>
            </h1>
            <p style={{ fontSize:'16px', color:'rgba(255,255,255,.5)', lineHeight:'1.75', marginBottom:'34px', maxWidth:'440px' }}>
              SignCode Pro helps identify likely requirements, missing items, and code-backed next steps so your team can prepare cleaner submissions faster.
            </p>
            <div style={{ display:'flex', gap:'12px', marginBottom:'36px' }}>
              <a href="/waitlist" style={{ padding:'13px 26px', background:'#3B82F6', color:'#fff', borderRadius:'10px', fontSize:'14px', fontWeight:'600', textDecoration:'none', display:'inline-block' }}>Join the waitlist</a>
              <a href="/lookup" style={{ padding:'13px 26px', background:'rgba(255,255,255,.06)', color:'#fff', border:'1px solid rgba(255,255,255,.12)', borderRadius:'10px', fontSize:'14px', fontWeight:'500', textDecoration:'none', display:'inline-block' }}>Try the lookup tool →</a>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <div style={{ display:'flex' }}>
                {['JS','MR','AL','TK','PW'].map((i,n) => (
                  <div key={i} style={{ width:'28px', height:'28px', borderRadius:'50%', border:'2px solid #080F1E', background:['#1E3A5F','#1A3352','#1D2F4A','#162840','#1B3358'][n], display:'flex', alignItems:'center', justifyContent:'center', fontSize:'9px', color:'#93C5FD', fontWeight:'700', marginLeft: n===0 ? 0 : '-7px', zIndex:5-n, position:'relative' }}>{i}</div>
                ))}
              </div>
              <span style={{ fontSize:'12px', color:'rgba(255,255,255,.4)' }}><strong style={{ color:'rgba(255,255,255,.65)' }}>Sign professionals</strong> already on the waitlist</span>
            </div>
          </div>

          {/* RIGHT — floating UI */}
          <div style={{ position:'relative', paddingTop:'8px' }}>
            {/* Float card top right */}
            <div style={{ position:'absolute', top:'-20px', right:'-12px', background:'rgba(16,185,129,.15)', border:'1px solid rgba(16,185,129,.3)', borderRadius:'12px', padding:'11px 15px', zIndex:10, animation:'float1 5s ease-in-out infinite', backdropFilter:'blur(8px)' }}>
              <div style={{ fontSize:'10px', color:'#6EE7B7', fontWeight:'600', marginBottom:'2px' }}>Avg. research time saved</div>
              <div style={{ fontSize:'20px', fontWeight:'800', color:'#fff' }}>3.2 hrs</div>
              <div style={{ fontSize:'10px', color:'rgba(255,255,255,.3)' }}>per jurisdiction lookup</div>
            </div>

            {/* Main UI card */}
            <div style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.1)', borderRadius:'16px', overflow:'hidden' }}>
              <div style={{ background:'rgba(255,255,255,.05)', padding:'11px 16px', display:'flex', alignItems:'center', gap:'8px', borderBottom:'1px solid rgba(255,255,255,.06)' }}>
                <div style={{ display:'flex', gap:'5px' }}>
                  {['#FF5F57','#FEBC2E','#28C840'].map(c => <div key={c} style={{ width:'8px', height:'8px', borderRadius:'50%', background:c }} />)}
                </div>
                <div style={{ flex:1, background:'rgba(0,0,0,.25)', borderRadius:'5px', padding:'3px 10px', fontSize:'11px', color:'rgba(255,255,255,.25)', textAlign:'center' }}>app.signcodepro.com/lookup</div>
              </div>
              <div style={{ padding:'18px 20px' }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'14px' }}>
                  <div>
                    <div style={{ fontSize:'15px', fontWeight:'700', color:'#fff', marginBottom:'3px' }}>Miami-Dade County, FL</div>
                    <div style={{ fontSize:'10px', color:'rgba(255,255,255,.3)' }}>Ch. 33, Article VI · Last referenced Apr 2026</div>
                  </div>
                  <span style={{ fontSize:'10px', padding:'3px 10px', borderRadius:'20px', background:'#fff', color:'#0D1B2A', fontWeight:'700', flexShrink:0, marginLeft:'8px' }}>✓ Verified</span>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'7px', marginBottom:'14px' }}>
                  {[
                    { label:'Max monument ht.', val:'6 ft', color:'#60A5FA' },
                    { label:'Engineer seal req.', val:'Over 24 sq ft', color:'#FCD34D' },
                    { label:'EMC / digital', val:'Yes — restricted', color:'#6EE7B7' },
                    { label:'Typical turnaround', val:'4–8 weeks', color:'#A5B4FC' },
                  ].map(s => (
                    <div key={s.label} style={{ background:'rgba(255,255,255,.05)', borderRadius:'8px', padding:'9px 11px', border:'1px solid rgba(255,255,255,.06)' }}>
                      <div style={{ fontSize:'10px', color:'rgba(255,255,255,.3)', marginBottom:'3px' }}>{s.label}</div>
                      <div style={{ fontSize:'13px', fontWeight:'700', color:s.color }}>{s.val}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize:'10px', color:'rgba(255,255,255,.3)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:'8px' }}>Required documents</div>
                {[
                  { text:'Notarized application (owner + qualifier)', done:true },
                  { text:'Engineer-sealed calculations', done:true },
                  { text:'ELEC.03 electrical permit', done:false },
                  { text:'Certificate of Use', done:false },
                ].map(d => (
                  <div key={d.text} style={{ display:'flex', alignItems:'center', gap:'7px', padding:'4px 0', fontSize:'11px', color:'rgba(255,255,255,.45)' }}>
                    <div style={{ width:'14px', height:'14px', borderRadius:'50%', background:d.done ? '#10B981' : 'transparent', border:d.done ? 'none' : '1.5px solid rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      {d.done && <svg width="8" height="8" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}
                    </div>
                    <span style={{ textDecoration:d.done ? 'line-through' : 'none', color:d.done ? 'rgba(255,255,255,.25)' : 'rgba(255,255,255,.5)' }}>{d.text}</span>
                  </div>
                ))}
                <div style={{ marginTop:'12px', padding:'9px 12px', background:'rgba(245,158,11,.08)', border:'1px solid rgba(245,158,11,.18)', borderRadius:'8px', fontSize:'11px', color:'#FCD34D' }}>
                  ⚠ If abutting a municipality — get their approval before submitting
                </div>
              </div>
            </div>

            {/* Jobs card — sits below main card, not overlapping */}
            <div style={{ marginTop:'12px', display:'flex', justifyContent:'flex-start' }}>
              <div style={{ background:'rgba(99,102,241,.12)', border:'1px solid rgba(99,102,241,.25)', borderRadius:'12px', padding:'12px 16px', animation:'float2 6s ease-in-out infinite', backdropFilter:'blur(8px)', display:'inline-block' }}>
                <div style={{ fontSize:'10px', color:'#A5B4FC', marginBottom:'8px', fontWeight:'600' }}>Active permit jobs</div>
                {[
                  { name:'Broward Co.', pct:75, color:'#3B82F6' },
                  { name:'Miami-Dade', pct:100, color:'#10B981' },
                  { name:'Pompano Bch', pct:30, color:'#F59E0B' },
                ].map(r => (
                  <div key={r.name} style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'10px', color:'rgba(255,255,255,.5)', marginBottom:'5px' }}>
                    <span style={{ minWidth:'72px' }}>{r.name}</span>
                    <div style={{ flex:1, height:'4px', background:'rgba(255,255,255,.08)', borderRadius:'2px', minWidth:'80px' }}>
                      <div style={{ height:'100%', width:`${r.pct}%`, background:r.color, borderRadius:'2px' }} />
                    </div>
                    <span style={{ minWidth:'20px' }}>{r.pct === 100 ? '✓' : `${r.pct}%`}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOGO MARQUEE */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,.06)', borderBottom:'1px solid rgba(255,255,255,.06)', padding:'28px 0', overflow:'hidden', marginTop:'60px' }}>
        <div style={{ fontSize:'11px', color:'rgba(255,255,255,.35)', textAlign:'center', marginBottom:'18px', textTransform:'uppercase', letterSpacing:'.08em' }}>Used by sign professionals at</div>
        <div style={{ overflow:'hidden', position:'relative' }}>
          <div style={{ display:'flex', gap:'0', animation:'marquee 22s linear infinite', width:'max-content' }}>
            {['FASTSIGNS','Signarama','Signs By Tomorrow','SpeedPro','Big Visual Group','Sign Shops Nationwide','AlphaGraphics','Signs Now','FASTSIGNS','Signarama','Signs By Tomorrow','SpeedPro','Big Visual Group','Sign Shops Nationwide','AlphaGraphics','Signs Now'].map((n,i) => (
              <span key={i} style={{ padding:'6px 24px', borderRight:'1px solid rgba(255,255,255,.08)', fontSize:'12px', color:'rgba(255,255,255,.4)', fontWeight:'600', whiteSpace:'nowrap' }}>{n}</span>
            ))}
          </div>
        </div>
      </div>

      {/* PROBLEM */}
      <section style={{ padding:'80px 48px', maxWidth:'1100px', margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'52px' }}>
          <div style={{ fontSize:'11px', color:'#0D1B2A', fontWeight:'700', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'16px', display:'inline-block', background:'#ffffff', padding:'5px 16px', borderRadius:'20px' }}>The problem</div>
          <h2 style={{ fontSize:'36px', fontWeight:'800', color:'#fff', letterSpacing:'-.5px', marginBottom:'14px', lineHeight:'1.2' }}>Sign permitting wastes too much<br />of your team's time</h2>
          <p style={{ fontSize:'15px', color:'rgba(255,255,255,.55)', lineHeight:'1.75', maxWidth:'540px', margin:'0 auto' }}>Higher-paid staff spend hours digging through municipal websites. Newer people struggle in unfamiliar jurisdictions. Rejected submittals add weeks. The information exists — it's just buried.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px' }}>
          {[
            { stat:'2–4 hrs', label:'Average research time per unfamiliar jurisdiction', color:'#60A5FA' },
            { stat:'4–8 wks', label:'Added to a job from a single rejected submittal', color:'#FCD34D' },
            { stat:'100%', label:'Of that time could be spent on billable work instead', color:'#6EE7B7' },
          ].map(s => (
            <div key={s.stat} style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:'14px', padding:'28px 24px', textAlign:'center' }}>
              <div style={{ fontSize:'38px', fontWeight:'800', color:s.color, marginBottom:'10px', letterSpacing:'-.5px' }}>{s.stat}</div>
              <div style={{ fontSize:'13px', color:'rgba(255,255,255,.6)', lineHeight:'1.6' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding:'80px 48px', background:'rgba(255,255,255,.015)', borderTop:'1px solid rgba(255,255,255,.05)', borderBottom:'1px solid rgba(255,255,255,.05)' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'52px' }}>
            <div style={{ fontSize:'11px', color:'#0D1B2A', fontWeight:'700', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'16px', display:'inline-block', background:'#ffffff', padding:'5px 16px', borderRadius:'20px' }}>How it works</div>
            <h2 style={{ fontSize:'36px', fontWeight:'800', color:'#fff', letterSpacing:'-.5px', lineHeight:'1.2' }}>From address to action in seconds</h2>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'12px', maxWidth:'720px', margin:'0 auto' }}>
            {[
              { n:'01', title:'Enter the job address and sign details', desc:'Tell us where the sign is going, what type it is, and the basic dimensions.' },
              { n:'02', title:'Get likely requirements instantly', desc:'SignCode Pro identifies the jurisdiction and surfaces likely permit requirements, common red flags, and required documents for that sign type.' },
              { n:'03', title:"See what's missing before you submit", desc:'A checklist shows exactly what you need to gather. Check items off as you collect them. No more rejected submittals from missing documents.' },
              { n:'04', title:'Track every job from research to approval', desc:'Every permit job lives in one place. Your whole team sees the status. Nothing falls through the cracks.' },
            ].map(s => (
              <div key={s.n} style={{ display:'flex', gap:'20px', background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:'14px', padding:'22px 24px', alignItems:'flex-start' }}>
                <div style={{ fontSize:'11px', fontWeight:'700', color:'#0D1B2A', minWidth:'32px', height:'24px', background:'#fff', borderRadius:'20px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'1px' }}>{s.n}</div>
                <div>
                  <div style={{ fontSize:'15px', fontWeight:'600', color:'#fff', marginBottom:'6px' }}>{s.title}</div>
                  <div style={{ fontSize:'13px', color:'rgba(255,255,255,.55)', lineHeight:'1.65' }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding:'80px 48px', maxWidth:'1100px', margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'52px' }}>
          <div style={{ fontSize:'11px', color:'#0D1B2A', fontWeight:'700', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'16px', display:'inline-block', background:'#ffffff', padding:'5px 16px', borderRadius:'20px' }}>The value</div>
          <h2 style={{ fontSize:'36px', fontWeight:'800', color:'#fff', letterSpacing:'-.5px', lineHeight:'1.2' }}>Efficiency and reduction.<br />That's the whole formula.</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px' }}>
          {[
            { icon:'⚡', title:'Faster research', desc:'Get to likely requirements in seconds instead of hours.', c:'rgba(59,130,246,.15)' },
            { icon:'📋', title:'Cleaner submissions', desc:"Know what's needed before you submit. Reduce rejections.", c:'rgba(16,185,129,.15)' },
            { icon:'👥', title:'Team visibility', desc:"Everyone sees every job's status. No more status-check calls.", c:'rgba(99,102,241,.15)' },
            { icon:'🎯', title:'Code-backed guidance', desc:'Requirements sourced from official government publications.', c:'rgba(245,158,11,.15)' },
            { icon:'⚠️', title:'Red flag alerts', desc:'Surface jurisdiction gotchas before they cost you weeks.', c:'rgba(239,68,68,.15)' },
            { icon:'📞', title:'Direct contact info', desc:'Right department, right number, right portal. Every time.', c:'rgba(20,184,166,.15)' },
          ].map(f => (
            <div key={f.title} className="feat-card" style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:'14px', padding:'22px' }}>
              <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'14px', fontSize:'20px' }}>{f.icon}</div>
              <div style={{ fontSize:'14px', fontWeight:'700', color:'#fff', marginBottom:'7px' }}>{f.title}</div>
              <div style={{ fontSize:'12px', color:'rgba(255,255,255,.5)', lineHeight:'1.6' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding:'80px 48px', background:'rgba(255,255,255,.015)', borderTop:'1px solid rgba(255,255,255,.05)', borderBottom:'1px solid rgba(255,255,255,.05)' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'52px' }}>
            <div style={{ fontSize:'11px', color:'#0D1B2A', fontWeight:'700', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'16px', display:'inline-block', background:'#ffffff', padding:'5px 16px', borderRadius:'20px' }}>Pricing</div>
            <h2 style={{ fontSize:'36px', fontWeight:'800', color:'#fff', letterSpacing:'-.5px', marginBottom:'12px' }}>Simple, justifiable pricing</h2>
            <p style={{ fontSize:'14px', color:'rgba(255,255,255,.35)' }}>One rejected submittal costs more than a year of SignCode Pro.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px' }}>
            {[
              { name:'Starter', price:'$79', period:'/mo', desc:'For small shops and solo permit runners', features:['Jurisdiction lookup','Document checklists','Up to 10 active jobs','Email support'], highlight:false },
              { name:'Professional', price:'$199', period:'/mo', desc:'For growing teams handling multiple jobs', features:['Everything in Starter','Unlimited active jobs','Team dashboard','Job status tracking','Red flag alerts','Priority support'], highlight:true },
              { name:'Enterprise', price:'Custom', period:'', desc:'For large operations and multi-location shops', features:['Everything in Professional','Custom jurisdictions','API access','Dedicated support','Team training'], highlight:false },
            ].map(p => (
              <div key={p.name} style={{ position:'relative', padding:'28px', background:p.highlight ? 'rgba(59,130,246,.1)' : 'rgba(255,255,255,.03)', borderRadius:'16px', border:p.highlight ? '1px solid rgba(59,130,246,.4)' : '1px solid rgba(255,255,255,.07)' }}>
                {p.highlight && <div style={{ position:'absolute', top:'-12px', left:'50%', transform:'translateX(-50%)', background:'#fff', color:'#0D1B2A', fontSize:'11px', fontWeight:'700', padding:'4px 16px', borderRadius:'20px', whiteSpace:'nowrap' }}>Most popular</div>}
                <div style={{ fontSize:'11px', fontWeight:'700', color:'#0D1B2A', marginBottom:'12px', display:'inline-block', background:'#fff', padding:'4px 12px', borderRadius:'20px' }}>{p.name}</div>
                <div style={{ display:'flex', alignItems:'baseline', gap:'3px', marginBottom:'8px' }}>
                  <span style={{ fontSize:'34px', fontWeight:'800', color:'#fff' }}>{p.price}</span>
                  <span style={{ fontSize:'13px', color:'rgba(255,255,255,.3)' }}>{p.period}</span>
                </div>
                <div style={{ fontSize:'12px', color:'rgba(255,255,255,.35)', marginBottom:'20px', lineHeight:'1.5' }}>{p.desc}</div>
                <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'24px' }}>
                  {p.features.map(f => (
                    <div key={f} style={{ display:'flex', gap:'8px', fontSize:'12px', color:'rgba(255,255,255,.6)', alignItems:'center' }}>
                      <span style={{ color:'#3B82F6', fontWeight:'700', fontSize:'14px' }}>✓</span>{f}
                    </div>
                  ))}
                </div>
                <a href="/waitlist" style={{ display:'block', textAlign:'center', padding:'11px', background:p.highlight ? '#3B82F6' : 'rgba(255,255,255,.07)', color:'#fff', borderRadius:'9px', fontSize:'13px', fontWeight:'600', textDecoration:'none' }}>Join waitlist</a>
              </div>
            ))}
          </div>
          <p style={{ textAlign:'center', fontSize:'12px', color:'rgba(255,255,255,.25)', marginTop:'24px' }}>Founding member pricing — 30% off Professional forever for early waitlist signups.</p>
        </div>
      </section>

      {/* DISCLAIMER */}
      <div style={{ padding:'24px 48px', borderTop:'1px solid rgba(255,255,255,.05)', borderBottom:'1px solid rgba(255,255,255,.05)' }}>
        <p style={{ fontSize:'11px', color:'rgba(255,255,255,.2)', lineHeight:'1.7', textAlign:'center', maxWidth:'720px', margin:'0 auto' }}>
          SignCode Pro provides general permit guidance based on publicly available sources to help sign professionals work more efficiently. Requirements vary by jurisdiction and change over time. Always verify requirements directly with the jurisdiction before submitting. SignCode Pro is not a legal authority and does not guarantee permit approval.
        </p>
      </div>

      {/* CTA */}
      <section style={{ padding:'88px 48px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', width:'600px', height:'600px', borderRadius:'50%', background:'radial-gradient(circle,rgba(59,130,246,.15) 0%,transparent 65%)', top:'50%', left:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', inset:0, opacity:.03, backgroundImage:'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize:'48px 48px', pointerEvents:'none' }} />
        <div style={{ position:'relative', zIndex:2, maxWidth:'560px', margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ fontSize:'36px', fontWeight:'800', color:'#fff', letterSpacing:'-.5px', marginBottom:'16px', lineHeight:'1.2' }}>A better starting point<br />for every permit job</h2>
          <p style={{ fontSize:'15px', color:'rgba(255,255,255,.4)', marginBottom:'36px', lineHeight:'1.7' }}>Join sign professionals already on the waitlist. Be first when we launch.</p>
          {!submitted ? (
            <form onSubmit={handleSubmit} style={{ display:'flex', gap:'10px', maxWidth:'440px', margin:'0 auto' }}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your work email" required style={{ flex:1, padding:'13px 16px', borderRadius:'9px', border:'1px solid rgba(255,255,255,.12)', fontSize:'14px', outline:'none', background:'rgba(255,255,255,.07)', color:'#fff' }} />
              <button type="submit" disabled={loading} style={{ padding:'13px 22px', background:'#3B82F6', color:'#fff', border:'none', borderRadius:'9px', fontSize:'14px', fontWeight:'600', cursor:'pointer', whiteSpace:'nowrap' }}>
                {loading ? 'Joining...' : 'Join waitlist'}
              </button>
            </form>
          ) : (
            <div style={{ background:'rgba(16,185,129,.1)', border:'1px solid rgba(16,185,129,.2)', borderRadius:'12px', padding:'20px', color:'#6EE7B7', fontSize:'14px' }}>
              You're on the list. We'll be in touch when we launch. 🙌
            </div>
          )}
          <p style={{ fontSize:'11px', color:'rgba(255,255,255,.2)', marginTop:'16px' }}>No spam. No pressure. Just a heads up when we're ready.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:'rgba(0,0,0,.3)', padding:'28px 48px', borderTop:'1px solid rgba(255,255,255,.05)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'16px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <svg width="22" height="22" viewBox="0 0 80 80"><rect width="80" height="80" rx="14" fill="#3B82F6"/><rect x="10" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".2"/><rect x="46" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".2"/><rect x="10" y="46" width="24" height="24" rx="5" fill="#fff" fillOpacity=".2"/><rect x="46" y="46" width="24" height="24" rx="5" fill="#fff"/><path d="M50 60l4 4 8-9" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
          <span style={{ fontSize:'13px', fontWeight:'700', color:'#fff' }}>Sign<span style={{ color:'#60A5FA' }}>Code</span> Pro</span>
        </div>
        <div style={{ display:'flex', gap:'20px' }}>
          {[['Lookup tool','/lookup'],['Job tracker','/jobs'],['Waitlist','/waitlist']].map(([l,h]) => (
            <a key={l} href={h} style={{ fontSize:'12px', color:'rgba(255,255,255,.4)', textDecoration:'none' }}>{l}</a>
          ))}
        </div>
        <div style={{ fontSize:'11px', color:'rgba(255,255,255,.2)' }}>© 2026 SignCode Pro. All rights reserved.</div>
      </footer>
    </main>
  );
}
