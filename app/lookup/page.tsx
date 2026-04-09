'use client';
import { useState } from 'react';

const JURISDICTIONS: Record<string, any> = {
  'miami-dade': {
    name: 'Miami-Dade County, FL',
    code: 'MDC §33-82 – §33-99',
    portal: 'https://www.miamidade.gov/permits',
    strictness: 'Moderate',
    maxPylon: 35,
    maxMonument: 8,
    maxArea: 200,
    setback: 5,
    emc: true,
    turnaround: '6–8 weeks',
    fee: '$180 + $4/sq ft',
    notes: 'Signs in the Urban Development Boundary may have additional restrictions. EMC signs must have 8-second minimum hold time.',
    docs: ['Permit application (Form BP-2)', 'Site plan — 1/4"=1\' scale', 'Elevation drawing with dimensions', 'Electrical calculations (if illuminated)', 'Owner/landlord authorization'],
  },
  'broward': {
    name: 'Broward County, FL',
    code: 'Broward County Code Ch. 4',
    portal: 'https://www.broward.org/permits',
    strictness: 'Moderate',
    maxPylon: 30,
    maxMonument: 8,
    maxArea: 180,
    setback: 5,
    emc: true,
    turnaround: '4–6 weeks',
    fee: '$150 + $3.50/sq ft',
    notes: 'Individual municipalities within Broward may have stricter rules. Always verify with the specific city.',
    docs: ['Completed permit application', 'Two sets of signed/sealed drawings', 'Site plan showing all existing signs', 'Electrical permit (if illuminated)', 'Property owner authorization'],
  },
  'pompano-beach': {
    name: 'City of Pompano Beach, FL',
    code: 'Pompano Beach Code Ch. 155',
    portal: 'https://www.pompanobeachfl.gov/permits',
    strictness: 'Moderate',
    maxPylon: 30,
    maxMonument: 8,
    maxArea: 180,
    setback: 5,
    emc: true,
    turnaround: '4–6 weeks',
    fee: '$140 + $3.50/sq ft',
    notes: 'Atlantic Blvd corridor has overlay restrictions. EMC signs require 8-second minimum hold.',
    docs: ['Pompano Beach permit application', 'Site plan showing all existing signs', 'Construction drawings', 'Property owner authorization'],
  },
  'fort-lauderdale': {
    name: 'City of Fort Lauderdale, FL',
    code: 'ULDR Ch. 47',
    portal: 'https://www.fortlauderdale.gov/permits',
    strictness: 'Moderate',
    maxPylon: 35,
    maxMonument: 8,
    maxArea: 200,
    setback: 8,
    emc: true,
    turnaround: '5–7 weeks',
    fee: '$160 + $3.75/sq ft',
    notes: 'Downtown overlay district has stricter requirements. City contractor registration required.',
    docs: ['FTL permit application', 'Two sets signed drawings', 'Structural calculations (freestanding)', 'City contractor registration', 'Electrical permit (if illuminated)'],
  },
  'palm-beach': {
    name: 'Palm Beach County, FL',
    code: 'PBC Unified Land Development Code',
    portal: 'https://www.pbcgov.org/pzb/permits',
    strictness: 'Moderate',
    maxPylon: 35,
    maxMonument: 8,
    maxArea: 200,
    setback: 5,
    emc: true,
    turnaround: '5–7 weeks',
    fee: '$155 + $3.50/sq ft',
    notes: 'Coastal areas and historic districts may have additional restrictions.',
    docs: ['Permit application', 'Site plan', 'Elevation drawings', 'Electrical calculations', 'Owner authorization'],
  },
  'boca-raton': {
    name: 'City of Boca Raton, FL',
    code: 'Boca Raton Code Ch. 28',
    portal: 'https://www.myboca.us/permits',
    strictness: 'Strict',
    maxPylon: 20,
    maxMonument: 6,
    maxArea: 100,
    setback: 10,
    emc: false,
    turnaround: '8–12 weeks',
    fee: '$250 + $6/sq ft',
    notes: 'One of the strictest sign codes in South Florida. No EMC/digital signs allowed in most zones. Design review required.',
    docs: ['Permit application', 'Design review board approval', 'Site plan', 'Elevation drawings', 'Material samples'],
  },
  'miami-beach': {
    name: 'City of Miami Beach, FL',
    code: 'Miami Beach Code Ch. 138',
    portal: 'https://www.miamibeachfl.gov/permits',
    strictness: 'Strict',
    maxPylon: 20,
    maxMonument: 6,
    maxArea: 100,
    setback: 10,
    emc: false,
    turnaround: '8–12 weeks',
    fee: '$250 + $6/sq ft',
    notes: 'Historic districts require design board approval. Art Deco district has special requirements.',
    docs: ['Permit application', 'Historic preservation review (if applicable)', 'Site plan', 'Elevation drawings', 'Material specifications'],
  },
  'orlando': {
    name: 'City of Orlando, FL',
    code: 'LDC Ch. 64',
    portal: 'https://www.orlando.gov/permits',
    strictness: 'Moderate',
    maxPylon: 25,
    maxMonument: 6,
    maxArea: 150,
    setback: 10,
    emc: true,
    turnaround: '3–5 weeks',
    fee: '$125 + $3/sq ft',
    notes: 'Applications submitted through MyPermitNow online portal. EMC signs must meet 0.3 fc max illumination at property line.',
    docs: ['MyPermitNow online application', 'Sign drawing with specs', 'Contractor license & insurance', 'Electrical permit (if illuminated)'],
  },
  'hillsborough': {
    name: 'Hillsborough County, FL',
    code: 'Hillsborough County LDC Art. 6',
    portal: 'https://www.hillsboroughcounty.org/permits',
    strictness: 'Moderate',
    maxPylon: 35,
    maxMonument: 8,
    maxArea: 200,
    setback: 5,
    emc: true,
    turnaround: '4–6 weeks',
    fee: '$140 + $3/sq ft',
    notes: 'Tampa city limits have separate requirements. Verify jurisdiction before applying.',
    docs: ['Permit application', 'Site plan', 'Elevation drawings', 'Electrical calculations', 'Owner authorization'],
  },
  'tampa': {
    name: 'City of Tampa, FL',
    code: 'Tampa City Code Ch. 20.5',
    portal: 'https://www.tampagov.net/permits',
    strictness: 'Moderate',
    maxPylon: 30,
    maxMonument: 8,
    maxArea: 180,
    setback: 5,
    emc: true,
    turnaround: '4–6 weeks',
    fee: '$145 + $3.25/sq ft',
    notes: 'Ybor City historic district has special requirements. Channel District overlay applies downtown.',
    docs: ['Tampa permit application', 'Site plan', 'Elevation drawings', 'Structural calculations', 'Electrical permit'],
  },
};

const CITY_MAP: Record<string, string> = {
  'miami': 'miami-dade',
  'miami-dade': 'miami-dade',
  'hialeah': 'miami-dade',
  'coral gables': 'miami-dade',
  'doral': 'miami-dade',
  'homestead': 'miami-dade',
  'kendall': 'miami-dade',
  'miami gardens': 'miami-dade',
  'broward': 'broward',
  'hollywood': 'broward',
  'pembroke pines': 'broward',
  'miramar': 'broward',
  'sunrise': 'broward',
  'plantation': 'broward',
  'davie': 'broward',
  'weston': 'broward',
  'deerfield beach': 'broward',
  'margate': 'broward',
  'coral springs': 'broward',
  'pompano beach': 'pompano-beach',
  'pompano': 'pompano-beach',
  'fort lauderdale': 'fort-lauderdale',
  'ft lauderdale': 'fort-lauderdale',
  'ft. lauderdale': 'fort-lauderdale',
  'lauderdale': 'fort-lauderdale',
  'boca raton': 'boca-raton',
  'boca': 'boca-raton',
  'delray beach': 'palm-beach',
  'west palm beach': 'palm-beach',
  'palm beach': 'palm-beach',
  'boynton beach': 'palm-beach',
  'lake worth': 'palm-beach',
  'wellington': 'palm-beach',
  'jupiter': 'palm-beach',
  'miami beach': 'miami-beach',
  'south beach': 'miami-beach',
  'orlando': 'orlando',
  'tampa': 'tampa',
  'hillsborough': 'hillsborough',
  'brandon': 'hillsborough',
  'riverview': 'hillsborough',
};

function findJurisdiction(query: string): string | null {
  const q = query.toLowerCase().trim();
  for (const [key, val] of Object.entries(CITY_MAP)) {
    if (q.includes(key)) return val;
  }
  return null;
}

const strictColor: Record<string, string> = {
  'Strict': '#FCEBEB',
  'Moderate': '#FAEEDA',
  'Permissive': '#EAF3DE',
};
const strictText: Record<string, string> = {
  'Strict': '#791F1F',
  'Moderate': '#633806',
  'Permissive': '#27500A',
};

export default function LookupPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [status, setStatus] = useState<'idle'|'loading'|'found'|'notfound'>('idle');

  function lookup() {
    if (!query.trim()) return;
    setStatus('loading');
    setResult(null);
    setTimeout(() => {
      const key = findJurisdiction(query);
      if (key && JURISDICTIONS[key]) {
        setResult(JURISDICTIONS[key]);
        setStatus('found');
      } else {
        setStatus('notfound');
      }
    }, 800);
  }

  return (
    <main style={{minHeight:'100vh',background:'#F4F7FA',fontFamily:'Arial,Helvetica,sans-serif'}}>

      {/* NAV */}
      <nav style={{background:'#fff',borderBottom:'1px solid #E2E8F0',padding:'0 40px',display:'flex',alignItems:'center',justifyContent:'space-between',height:'56px'}}>
        <a href="/" style={{display:'flex',alignItems:'center',gap:'8px',textDecoration:'none'}}>
          <svg width="26" height="26" viewBox="0 0 80 80"><rect width="80" height="80" rx="16" fill="#185FA5"/><rect x="10" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="10" y="46" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="46" width="24" height="24" rx="5" fill="#fff"/><path d="M49.5 60l4 4 8-9" stroke="#185FA5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
          <span style={{fontSize:'14px',fontWeight:'700',color:'#0D1B2A'}}>Sign<span style={{color:'#185FA5'}}>Code</span> <span style={{fontSize:'10px',color:'#9BA8B4',fontWeight:'400'}}>Pro</span></span>
        </a>
        <a href="/waitlist" style={{padding:'7px 16px',background:'#185FA5',color:'#fff',borderRadius:'7px',fontSize:'13px',fontWeight:'500',textDecoration:'none'}}>Join waitlist</a>
      </nav>

      <div style={{maxWidth:'780px',margin:'0 auto',padding:'48px 24px'}}>

        {/* HEADER */}
        <div style={{textAlign:'center',marginBottom:'36px'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'6px',padding:'4px 12px',borderRadius:'20px',background:'#E6F1FB',color:'#185FA5',fontSize:'12px',fontWeight:'500',marginBottom:'16px'}}>
            <div style={{width:'5px',height:'5px',borderRadius:'50%',background:'#185FA5'}}></div>
            AI-powered jurisdiction lookup
          </div>
          <h1 style={{fontSize:'28px',fontWeight:'700',color:'#0D1B2A',marginBottom:'10px'}}>Look up any Florida jurisdiction</h1>
          <p style={{fontSize:'14px',color:'#5A6B7A',lineHeight:'1.6'}}>Enter any city, county, or address in Florida to get instant sign code requirements.</p>
        </div>

        {/* SEARCH */}
        <div style={{background:'#fff',borderRadius:'12px',border:'1px solid #E2E8F0',padding:'20px',marginBottom:'20px'}}>
          <div style={{display:'flex',gap:'10px'}}>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && lookup()}
              placeholder="e.g. 1500 Biscayne Blvd, Miami — or just type Miami-Dade, Pompano Beach, Orlando..."
              style={{flex:1,padding:'11px 14px',border:'1px solid #E2E8F0',borderRadius:'8px',fontSize:'13px',color:'#0D1B2A',background:'#fff',outline:'none'}}
            />
            <button
              onClick={lookup}
              disabled={status==='loading'}
              style={{padding:'11px 22px',background:'#185FA5',color:'#fff',border:'none',borderRadius:'8px',fontSize:'13px',fontWeight:'500',cursor:'pointer',whiteSpace:'nowrap'}}
            >
              {status==='loading' ? 'Searching...' : 'Look up code'}
            </button>
          </div>

          {/* Quick picks */}
          <div style={{marginTop:'12px',display:'flex',gap:'8px',flexWrap:'wrap'}}>
            <span style={{fontSize:'11px',color:'#9BA8B4'}}>Quick:</span>
            {['Miami-Dade','Fort Lauderdale','Pompano Beach','Boca Raton','Orlando','Tampa'].map(c => (
              <button key={c} onClick={() => { setQuery(c); setTimeout(() => { const k = findJurisdiction(c); if(k && JURISDICTIONS[k]){setResult(JURISDICTIONS[k]);setStatus('found');}}, 50); }} style={{padding:'3px 10px',border:'1px solid #E2E8F0',borderRadius:'20px',fontSize:'11px',color:'#5A6B7A',background:'#fff',cursor:'pointer'}}>{c}</button>
            ))}
          </div>
        </div>

        {/* NOT FOUND */}
        {status==='notfound' && (
          <div style={{background:'#FAEEDA',border:'1px solid #F5C4B3',borderRadius:'10px',padding:'16px 20px',marginBottom:'20px',fontSize:'13px',color:'#633806'}}>
            We don't have data for that jurisdiction yet. <strong>South Florida and Orlando</strong> are fully covered. More jurisdictions coming soon — <a href="/waitlist" style={{color:'#185FA5'}}>join the waitlist</a> to get notified.
          </div>
        )}

        {/* RESULT */}
        {status==='found' && result && (
          <div style={{background:'#fff',borderRadius:'12px',border:'1px solid #E2E8F0',overflow:'hidden'}}>

            {/* Result header */}
            <div style={{padding:'20px 24px',borderBottom:'1px solid #E2E8F0',display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
              <div>
                <div style={{fontSize:'18px',fontWeight:'700',color:'#0D1B2A',marginBottom:'3px'}}>{result.name}</div>
                <div style={{fontSize:'12px',color:'#9BA8B4'}}>{result.code}</div>
              </div>
              <span style={{padding:'4px 10px',borderRadius:'20px',fontSize:'12px',fontWeight:'500',background:strictColor[result.strictness],color:strictText[result.strictness]}}>{result.strictness}</span>
            </div>

            {/* Data grid */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0',borderBottom:'1px solid #E2E8F0'}}>
              <div style={{padding:'20px 24px',borderRight:'1px solid #E2E8F0'}}>
                <div style={{fontSize:'10px',fontWeight:'600',color:'#9BA8B4',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:'14px'}}>Size limits</div>
                {[
                  ['Max pylon height', result.maxPylon + ' ft'],
                  ['Max monument height', result.maxMonument + ' ft'],
                  ['Max sign area (B-2)', result.maxArea + ' sq ft'],
                  ['Min setback from ROW', result.setback + ' ft'],
                  ['EMC / digital signs', result.emc ? 'Allowed' : 'Not allowed'],
                ].map(([l,v]) => (
                  <div key={l as string} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid #F4F7FA',fontSize:'13px'}}>
                    <span style={{color:'#5A6B7A'}}>{l}</span>
                    <span style={{fontWeight:'500',color:l==='EMC / digital signs'?(result.emc?'#3B6D11':'#791F1F'):'#0D1B2A'}}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{padding:'20px 24px'}}>
                <div style={{fontSize:'10px',fontWeight:'600',color:'#9BA8B4',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:'14px'}}>Fees & timeline</div>
                {[
                  ['Permit fee', result.fee],
                  ['Avg. turnaround', result.turnaround],
                  ['Official portal', result.portal],
                ].map(([l,v]) => (
                  <div key={l as string} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid #F4F7FA',fontSize:'13px'}}>
                    <span style={{color:'#5A6B7A'}}>{l}</span>
                    {l==='Official portal'
                      ? <a href={v as string} target="_blank" rel="noreferrer" style={{color:'#185FA5',textDecoration:'none',fontWeight:'500',fontSize:'12px'}}>View portal</a>
                      : <span style={{fontWeight:'500',color:'#0D1B2A'}}>{v}</span>
                    }
                  </div>
                ))}
              </div>
            </div>

            {/* Required docs */}
            <div style={{padding:'20px 24px',borderBottom:'1px solid #E2E8F0'}}>
              <div style={{fontSize:'10px',fontWeight:'600',color:'#9BA8B4',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:'14px'}}>Required documents</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
                {result.docs.map((d: string) => (
                  <div key={d} style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'13px',color:'#0D1B2A'}}>
                    <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#185FA5',flexShrink:0}}></div>
                    {d}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div style={{padding:'20px 24px',background:'#F4F7FA',borderBottom:'1px solid #E2E8F0'}}>
              <div style={{fontSize:'10px',fontWeight:'600',color:'#9BA8B4',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:'8px'}}>Practitioner notes</div>
              <div style={{fontSize:'13px',color:'#5A6B7A',lineHeight:'1.6'}}>{result.notes}</div>
            </div>

            {/* CTA */}
            <div style={{padding:'16px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div style={{fontSize:'12px',color:'#9BA8B4'}}>Data verified by SignCode Pro team · Updated April 2025</div>
              <a href="/waitlist" style={{padding:'8px 18px',background:'#185FA5',color:'#fff',borderRadius:'7px',fontSize:'12px',fontWeight:'500',textDecoration:'none'}}>Get full access →</a>
            </div>
          </div>
        )}

        {/* Covered jurisdictions */}
        {status==='idle' && (
          <div style={{background:'#fff',borderRadius:'12px',border:'1px solid #E2E8F0',padding:'20px 24px'}}>
            <div style={{fontSize:'12px',fontWeight:'600',color:'#0D1B2A',marginBottom:'14px'}}>Currently covered — Florida</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px'}}>
              {Object.values(JURISDICTIONS).map((j: any) => (
                <div key={j.name} style={{padding:'8px 12px',background:'#F4F7FA',borderRadius:'7px',fontSize:'12px',color:'#5A6B7A'}}>{j.name}</div>
              ))}
            </div>
            <div style={{fontSize:'11px',color:'#9BA8B4',marginTop:'14px'}}>More jurisdictions added weekly. <a href="/waitlist" style={{color:'#185FA5'}}>Join the waitlist</a> to request your jurisdiction.</div>
          </div>
        )}

      </div>
    </main>
  );
}