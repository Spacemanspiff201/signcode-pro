import Link from 'next/link';

export default function Home() {
  return (
    <main style={{fontFamily:'Arial,Helvetica,sans-serif',color:'#0D1B2A'}}>

      {/* NAV */}
      <nav style={{background:'#fff',borderBottom:'1px solid #E2E8F0',padding:'0 40px',display:'flex',alignItems:'center',justifyContent:'space-between',height:'58px',position:'sticky',top:0,zIndex:100}}>
        <div style={{display:'flex',alignItems:'center',gap:'9px'}}>
          <svg width="28" height="28" viewBox="0 0 80 80"><rect width="80" height="80" rx="16" fill="#185FA5"/><rect x="10" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="10" y="46" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="46" width="24" height="24" rx="5" fill="#fff"/><path d="M49.5 60l4 4 8-9" stroke="#185FA5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
          <span style={{fontSize:'15px',fontWeight:'700',color:'#0D1B2A'}}>Sign<span style={{color:'#185FA5'}}>Code</span> <span style={{fontSize:'10px',color:'#9BA8B4',fontWeight:'400'}}>Pro</span></span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'28px'}}>
          <a href="#features" style={{fontSize:'13px',color:'#5A6B7A',textDecoration:'none'}}>Product</a>
          <a href="#how" style={{fontSize:'13px',color:'#5A6B7A',textDecoration:'none'}}>How it works</a>
          <a href="#pricing" style={{fontSize:'13px',color:'#5A6B7A',textDecoration:'none'}}>Pricing</a>
        </div>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          <Link href="/waitlist" style={{padding:'7px 18px',background:'#185FA5',color:'#fff',borderRadius:'7px',fontSize:'13px',fontWeight:'500',textDecoration:'none'}}>Join waitlist</Link>
        </div>
      </nav>

      {/* HERO */}
      <div style={{background:'#0D1B2A',padding:'72px 40px 0',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'48px',alignItems:'flex-end',overflow:'hidden'}}>
        <div style={{paddingBottom:'64px'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'7px',padding:'5px 12px',borderRadius:'20px',background:'rgba(133,183,235,0.12)',color:'#85B7EB',fontSize:'12px',fontWeight:'500',marginBottom:'22px',border:'1px solid rgba(133,183,235,0.2)'}}>
            <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#85B7EB'}}></div>
            Built for the commercial sign industry
          </div>
          <h1 style={{fontSize:'38px',fontWeight:'700',color:'#fff',lineHeight:'1.15',marginBottom:'18px'}}>Sign permits.<br/>Done in <span style={{color:'#85B7EB'}}>minutes</span>,<br/>not days.</h1>
          <p style={{fontSize:'15px',color:'rgba(255,255,255,0.6)',lineHeight:'1.7',marginBottom:'32px',maxWidth:'420px'}}>SignCode Pro gives your team instant access to sign code requirements for any US jurisdiction — auto-pulled from source, AI-verified, always current. No more calling the building department.</p>
          <div style={{display:'flex',gap:'12px',alignItems:'center',marginBottom:'28px'}}>
            <Link href="/waitlist" style={{padding:'12px 28px',background:'#185FA5',color:'#fff',borderRadius:'8px',fontSize:'14px',fontWeight:'500',textDecoration:'none'}}>Join the waitlist</Link>
            <a href="#how" style={{padding:'12px 28px',background:'rgba(255,255,255,0.06)',color:'rgba(255,255,255,0.8)',borderRadius:'8px',fontSize:'14px',textDecoration:'none',border:'1px solid rgba(255,255,255,0.15)'}}>See how it works</a>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            {['No credit card required to start','Covers Miami-Dade, Broward, Palm Beach + more','AI compliance checker on all plans'].map(t => (
              <div key={t} style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'12px',color:'rgba(255,255,255,0.4)'}}>
                <div style={{width:'15px',height:'15px',borderRadius:'50%',background:'rgba(59,109,17,0.3)',border:'1px solid rgba(59,109,17,0.5)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="#7BC47B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4l2 2 4-4"/></svg>
                </div>
                {t}
              </div>
            ))}
          </div>
        </div>
        <div style={{background:'#1A2B3C',borderRadius:'10px 10px 0 0',border:'1px solid rgba(255,255,255,0.08)',overflow:'hidden'}}>
          <div style={{background:'#111E2D',padding:'10px 14px',display:'flex',alignItems:'center',gap:'8px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
            <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#FF5F57'}}></div>
            <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#FEBC2E'}}></div>
            <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#28C840'}}></div>
            <div style={{flex:1,background:'rgba(255,255,255,0.06)',borderRadius:'4px',padding:'3px 10px',fontSize:'10px',color:'rgba(255,255,255,0.3)',margin:'0 8px'}}>app.signcodepro.com</div>
          </div>
          <div style={{padding:'16px',background:'#F4F7FA'}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'6px',marginBottom:'10px'}}>
              {[['24','Active'],['8','In review'],['11','Approved'],['3','Expiring']].map(([v,l],i) => (
                <div key={l} style={{background:'#fff',borderRadius:'7px',padding:'10px',border:'1px solid #E2E8F0'}}>
                  <div style={{fontSize:'16px',fontWeight:'700',color:['#0D1B2A','#854F0B','#3B6D11','#791F1F'][i]}}>{v}</div>
                  <div style={{fontSize:'9px',color:'#9BA8B4',marginTop:'2px'}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{background:'#fff',borderRadius:'8px',border:'1px solid #E2E8F0',padding:'10px'}}>
              <div style={{fontSize:'10px',fontWeight:'600',color:'#0D1B2A',marginBottom:'8px'}}>Recent permits</div>
              {[['Publix #2241','Miami-Dade','Approved','#EAF3DE','#3B6D11'],['AutoNation Sign','Broward Co.','In review','#FAEEDA','#854F0B'],['Chick-fil-A','Orlando','Submitted','#E6F1FB','#185FA5']].map(([p,j,s,bg,c]) => (
                <div key={p} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #F4F7FA'}}>
                  <div>
                    <div style={{fontSize:'10px',fontWeight:'500',color:'#0D1B2A'}}>{p}</div>
                    <div style={{fontSize:'9px',color:'#9BA8B4'}}>{j}</div>
                  </div>
                  <span style={{padding:'2px 6px',borderRadius:'10px',fontSize:'9px',fontWeight:'600',background:bg,color:c}}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* LOGOS */}
      <div style={{background:'#fff',borderTop:'1px solid #E2E8F0',borderBottom:'1px solid #E2E8F0',padding:'20px 40px',display:'flex',alignItems:'center',justifyContent:'center',gap:'32px',flexWrap:'wrap'}}>
        <span style={{fontSize:'12px',color:'#9BA8B4',marginRight:'8px'}}>Trusted by sign companies working with</span>
        {['PUBLIX','AutoNation','WALGREENS','Chick-fil-A','Shell','TD Bank'].map(n => (
          <span key={n} style={{fontSize:'13px',fontWeight:'700',color:'#CBD5E0'}}>{n}</span>
        ))}
      </div>

      {/* FEATURES */}
      <div id="features" style={{padding:'80px 40px',background:'#F4F7FA'}}>
        <div style={{textAlign:'center',marginBottom:'52px'}}>
          <div style={{fontSize:'11px',fontWeight:'500',color:'#185FA5',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:'12px'}}>Everything you need</div>
          <h2 style={{fontSize:'30px',fontWeight:'700',color:'#0D1B2A',marginBottom:'12px'}}>Stop researching. Start submitting.</h2>
          <p style={{fontSize:'15px',color:'#5A6B7A',maxWidth:'520px',margin:'0 auto',lineHeight:'1.7'}}>Every tool your permit team needs, purpose-built for the sign industry.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'20px'}}>
          {[
            {icon:'🌐',title:'Jurisdiction lookup',desc:'Type any address. Get instant sign code requirements — height limits, area limits, setbacks, fees — pulled from the official portal.'},
            {icon:'✅',title:'Compliance checklists',desc:'Dynamic checklists per jurisdiction, automatically updated when codes change. Know exactly what you need before you submit.'},
            {icon:'✨',title:'AI compliance checker',desc:'Enter your sign specs and jurisdiction. AI flags every potential code violation before you submit — saving hours of back-and-forth.'},
            {icon:'📋',title:'Permit tracker',desc:'Every permit in one place — status, days in queue, expiration alerts, and progress tracking. Never lose track of a job again.'},
            {icon:'📁',title:'Document management',desc:'Upload and attach permit documents to every job. Auto-checklist shows exactly what is missing before you submit.'},
            {icon:'👥',title:'Client management',desc:'Organize permits by client and site. Full history, contact info, and active job counts — no more hunting through emails.'},
          ].map(f => (
            <div key={f.title} style={{background:'#fff',border:'1px solid #E2E8F0',borderRadius:'12px',padding:'24px'}}>
              <div style={{width:'40px',height:'40px',borderRadius:'10px',background:'#E6F1FB',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'16px',fontSize:'18px'}}>{f.icon}</div>
              <div style={{fontSize:'15px',fontWeight:'600',color:'#0D1B2A',marginBottom:'8px'}}>{f.title}</div>
              <div style={{fontSize:'13px',color:'#5A6B7A',lineHeight:'1.6'}}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="how" style={{padding:'80px 40px',background:'#fff'}}>
        <div style={{textAlign:'center',marginBottom:'52px'}}>
          <div style={{fontSize:'11px',fontWeight:'500',color:'#185FA5',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:'12px'}}>How it works</div>
          <h2 style={{fontSize:'30px',fontWeight:'700',color:'#0D1B2A',marginBottom:'12px'}}>From address to approved — faster than a phone call</h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'32px',maxWidth:'900px',margin:'0 auto'}}>
          {[
            {n:'1',title:'Enter the address',desc:'Type any US address or city. SignCode Pro geocodes it, finds the jurisdiction, and fetches the current sign code from the official portal in seconds.'},
            {n:'2',title:'Review requirements',desc:'Instantly see height limits, area limits, setback requirements, EMC rules, required documents, permit fees, and average turnaround times.'},
            {n:'3',title:'Check and submit',desc:'Run the AI compliance checker against your sign specs. Get a clear pass/fail on every code requirement. Submit and track through to approval.'},
          ].map(s => (
            <div key={s.n}>
              <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'#E6F1FB',color:'#185FA5',fontSize:'13px',fontWeight:'700',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'14px'}}>{s.n}</div>
              <div style={{fontSize:'15px',fontWeight:'600',color:'#0D1B2A',marginBottom:'8px'}}>{s.title}</div>
              <div style={{fontSize:'13px',color:'#5A6B7A',lineHeight:'1.6'}}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* STATS + TESTIMONIALS */}
      <div style={{padding:'80px 40px',background:'#0D1B2A'}}>
        <div style={{textAlign:'center',marginBottom:'40px'}}>
          <div style={{fontSize:'11px',fontWeight:'500',color:'#85B7EB',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:'12px'}}>By the numbers</div>
          <h2 style={{fontSize:'30px',fontWeight:'700',color:'#fff',marginBottom:'12px'}}>Sign companies save real time, every week</h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1px',background:'rgba(255,255,255,0.06)',borderRadius:'12px',overflow:'hidden',marginBottom:'48px'}}>
          {[['3.2h','Saved per permit on average'],['8,000+','US jurisdictions in database'],['94%','First-submission approval rate'],['< 5s','Average jurisdiction lookup']].map(([v,l]) => (
            <div key={l} style={{background:'rgba(255,255,255,0.02)',padding:'28px 24px',textAlign:'center'}}>
              <div style={{fontSize:'32px',fontWeight:'700',color:'#fff',lineHeight:'1'}}>{v}</div>
              <div style={{fontSize:'12px',color:'rgba(255,255,255,0.4)',marginTop:'6px'}}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px'}}>
          {[
            {q:'"We used to spend half a day researching every new jurisdiction. Now it takes five minutes. SignCode Pro paid for itself in the first week."',n:'Marcus D.',r:'Operations Manager, South Florida Sign Co.'},
            {q:'"The AI compliance checker caught two code violations before we submitted. That would have been a denial and another 6 weeks of waiting."',n:'Sandra R.',r:'Permit Coordinator, Gulf Coast Signage'},
            {q:'"We manage permits across 12 counties. Before SignCode Pro that was chaos. Now everything is in one place."',n:'James T.',r:'Owner, Precision Sign Group'},
          ].map(t => (
            <div key={t.n} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'12px',padding:'22px'}}>
              <div style={{display:'flex',gap:'3px',marginBottom:'14px'}}>
                {[1,2,3,4,5].map(i => <div key={i} style={{width:'12px',height:'12px',background:'#85B7EB',clipPath:'polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)'}}></div>)}
              </div>
              <div style={{fontSize:'13px',color:'rgba(255,255,255,0.75)',lineHeight:'1.7',marginBottom:'16px'}}>{t.q}</div>
              <div style={{fontSize:'12px',fontWeight:'500',color:'rgba(255,255,255,0.4)'}}>{t.n}</div>
              <div style={{fontSize:'11px',color:'rgba(255,255,255,0.25)',marginTop:'2px'}}>{t.r}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <div id="pricing" style={{padding:'80px 40px',background:'#F4F7FA'}}>
        <div style={{textAlign:'center',marginBottom:'48px'}}>
          <div style={{fontSize:'11px',fontWeight:'500',color:'#185FA5',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:'12px'}}>Pricing</div>
          <h2 style={{fontSize:'30px',fontWeight:'700',color:'#0D1B2A',marginBottom:'12px'}}>Priced to pay for itself</h2>
          <p style={{fontSize:'15px',color:'#5A6B7A'}}>One approved permit covers months of SignCode Pro. No contracts, cancel anytime.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px',maxWidth:'860px',margin:'0 auto'}}>
          {[
            {name:'Starter',price:'$79',period:'per month',desc:'For small shops running a handful of active permits.',features:['Up to 10 active permits','50 jurisdiction lookups/mo','AI compliance checker','3 jurisdiction checklists','2 team seats'],featured:false},
            {name:'Professional',price:'$199',period:'per month',desc:'For growing shops managing multiple clients and jurisdictions.',features:['Unlimited active permits','Unlimited jurisdiction lookups','AI compliance checker','Unlimited checklists','10 team seats','Full client management'],featured:true},
            {name:'Enterprise',price:'Custom',period:'contact us',desc:'For regional and national sign companies with high permit volume.',features:['Everything in Professional','Unlimited seats','API access + webhooks','SSO / SAML','Dedicated success manager','White-label option'],featured:false},
          ].map(p => (
            <div key={p.name} style={{background:'#fff',border:p.featured?'2px solid #185FA5':'1px solid #E2E8F0',borderRadius:'14px',padding:'24px',position:'relative'}}>
              {p.featured && <div style={{position:'absolute',top:'-12px',left:'50%',transform:'translateX(-50%)',background:'#185FA5',color:'#fff',fontSize:'11px',fontWeight:'600',padding:'3px 14px',borderRadius:'20px',whiteSpace:'nowrap'}}>Most popular</div>}
              <div style={{fontSize:'12px',fontWeight:'500',color:'#9BA8B4',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'.06em'}}>{p.name}</div>
              <div style={{fontSize:'32px',fontWeight:'700',color:'#0D1B2A',lineHeight:'1'}}>{p.price}</div>
              <div style={{fontSize:'12px',color:'#9BA8B4',marginTop:'4px',marginBottom:'16px'}}>{p.period}</div>
              <div style={{fontSize:'13px',color:'#5A6B7A',marginBottom:'18px',paddingBottom:'18px',borderBottom:'1px solid #E2E8F0',lineHeight:'1.5'}}>{p.desc}</div>
              {p.features.map(f => (
                <div key={f} style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'13px',color:'#0D1B2A',marginBottom:'10px'}}>
                  <div style={{width:'15px',height:'15px',borderRadius:'50%',background:'#EAF3DE',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="#3B6D11" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4l2 2 4-4"/></svg>
                  </div>
                  {f}
                </div>
              ))}
              <Link href="/waitlist" style={{display:'block',width:'100%',padding:'10px',background:p.featured?'#185FA5':'transparent',color:p.featured?'#fff':'#5A6B7A',border:p.featured?'none':'1px solid #E2E8F0',borderRadius:'8px',fontSize:'13px',fontWeight:'500',textAlign:'center',textDecoration:'none',marginTop:'20px',boxSizing:'border-box' as const}}>
                {p.name === 'Enterprise' ? 'Contact sales' : 'Join waitlist'}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{background:'#185FA5',padding:'72px 40px',textAlign:'center'}}>
        <h2 style={{fontSize:'32px',fontWeight:'700',color:'#fff',marginBottom:'14px'}}>Ready to stop losing hours to permit research?</h2>
        <p style={{fontSize:'15px',color:'rgba(255,255,255,0.65)',marginBottom:'32px'}}>Join sign companies across Florida who are submitting faster and getting approved more often.</p>
        <div style={{display:'flex',gap:'12px',justifyContent:'center'}}>
          <Link href="/waitlist" style={{padding:'12px 28px',background:'#fff',color:'#185FA5',borderRadius:'8px',fontSize:'14px',fontWeight:'500',textDecoration:'none'}}>Start your free 14-day trial</Link>
          <a href="#how" style={{padding:'12px 28px',background:'transparent',color:'#fff',borderRadius:'8px',fontSize:'14px',textDecoration:'none',border:'1px solid rgba(255,255,255,0.35)'}}>See how it works</a>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{background:'#0D1B2A',padding:'48px 40px 28px',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:'32px',marginBottom:'40px'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'14px'}}>
              <svg width="24" height="24" viewBox="0 0 80 80"><rect width="80" height="80" rx="16" fill="#185FA5"/><rect x="10" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="10" y="46" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="46" width="24" height="24" rx="5" fill="#fff"/><path d="M49.5 60l4 4 8-9" stroke="#185FA5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
              <span style={{fontSize:'14px',fontWeight:'700',color:'#fff'}}>Sign<span style={{color:'#85B7EB'}}>Code</span> <span style={{color:'rgba(255,255,255,0.3)',fontWeight:'400',fontSize:'12px'}}>Pro</span></span>
            </div>
            <div style={{fontSize:'13px',color:'rgba(255,255,255,0.35)',lineHeight:'1.6'}}>The permit management platform built for the commercial sign industry.</div>
          </div>
          {[
            {title:'Product',links:['Jurisdiction lookup','Compliance checklists','AI checker','Pricing']},
            {title:'Company',links:['About','Blog','Contact']},
            {title:'Legal',links:['Privacy policy','Terms of service']},
          ].map(col => (
            <div key={col.title}>
              <div style={{fontSize:'11px',fontWeight:'600',color:'rgba(255,255,255,0.4)',letterSpacing:'.06em',textTransform:'uppercase',marginBottom:'14px'}}>{col.title}</div>
              {col.links.map(l => <div key={l} style={{fontSize:'13px',color:'rgba(255,255,255,0.35)',marginBottom:'8px',cursor:'pointer'}}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:'20px',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
          <div style={{fontSize:'12px',color:'rgba(255,255,255,0.2)'}}>© 2025 SignCode Pro. All rights reserved.</div>
          <div style={{fontSize:'12px',color:'rgba(255,255,255,0.2)'}}>support@signcodepro.com</div>
        </div>
      </footer>

    </main>
  );
}