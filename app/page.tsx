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
    } catch {
      setSubmitted(true);
    }
    setLoading(false);
  }

  return (
    <main style={{ fontFamily: 'Arial, Helvetica, sans-serif', background: '#F4F7FA', minHeight: '100vh' }}>
      <nav style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="28" height="28" viewBox="0 0 80 80"><rect width="80" height="80" rx="16" fill="#185FA5"/><rect x="10" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="10" y="46" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="46" width="24" height="24" rx="5" fill="#fff"/><path d="M49.5 60l4 4 8-9" stroke="#185FA5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
          <span style={{ fontSize: '15px', fontWeight: '700', color: '#0D1B2A' }}>Sign<span style={{ color: '#185FA5' }}>Code</span> <span style={{ fontSize: '11px', color: '#9BA8B4', fontWeight: '400' }}>Pro</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="/lookup" style={{ fontSize: '13px', color: '#5A6B7A', textDecoration: 'none' }}>Try lookup</a>
          <a href="/waitlist" style={{ padding: '8px 18px', background: '#185FA5', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: '500', textDecoration: 'none' }}>Join waitlist</a>
        </div>
      </nav>

      <section style={{ background: '#0D1B2A', padding: '80px 24px 90px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 14px', borderRadius: '20px', background: 'rgba(24,95,165,0.3)', color: '#85B7EB', fontSize: '12px', fontWeight: '500', marginBottom: '28px' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#85B7EB' }}></div>
            Built for the sign industry
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: '700', color: '#fff', lineHeight: '1.2', marginBottom: '20px' }}>
            Enter the address.<br />Cut sign permit research time.
          </h1>
          <p style={{ fontSize: '16px', color: '#85B7EB', lineHeight: '1.7', marginBottom: '36px', maxWidth: '580px', margin: '0 auto 36px' }}>
            SignCode Pro helps identify likely requirements, missing items, and code-backed next steps so your team can prepare cleaner submissions faster.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/waitlist" style={{ padding: '13px 28px', background: '#185FA5', color: '#fff', borderRadius: '8px', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>Join the waitlist</a>
            <a href="/lookup" style={{ padding: '13px 28px', background: 'rgba(255,255,255,0.08)', color: '#fff', borderRadius: '8px', fontSize: '14px', fontWeight: '500', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)' }}>Try the lookup tool →</a>
          </div>
          <p style={{ fontSize: '11px', color: '#5A6B7A', marginTop: '20px' }}>Built to improve permit efficiency and reduce wasted time in the sign permit process.</p>
        </div>
      </section>

      <section style={{ padding: '72px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#185FA5', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '16px' }}>The problem</div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#0D1B2A', marginBottom: '16px', lineHeight: '1.3' }}>Sign permitting wastes too much of your team's time</h2>
          <p style={{ fontSize: '15px', color: '#5A6B7A', lineHeight: '1.7', marginBottom: '48px' }}>Higher-paid employees spend hours digging through municipal websites. Newer staff struggle in unfamiliar jurisdictions. Rejected submittals add weeks to jobs. The information exists — it's just buried.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { stat: '2-4 hrs', label: 'Average research time per unfamiliar jurisdiction' },
              { stat: '4-8 wks', label: 'Added to a job from a single rejected submittal' },
              { stat: '100%', label: 'Of that time could be spent on billable work instead' },
            ].map(({ stat, label }) => (
              <div key={stat} style={{ padding: '24px', background: '#F4F7FA', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#185FA5', marginBottom: '8px' }}>{stat}</div>
                <div style={{ fontSize: '12px', color: '#5A6B7A', lineHeight: '1.5' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '72px 24px', background: '#F4F7FA' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#185FA5', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '16px' }}>How it works</div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#0D1B2A', lineHeight: '1.3' }}>From address to action in seconds</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { step: '01', title: 'Enter the job address and sign details', desc: 'Tell us where the sign is going, what type it is, and the basic dimensions.' },
              { step: '02', title: 'Get likely requirements instantly', desc: 'SignCode Pro identifies the jurisdiction and surfaces likely permit requirements, common red flags, and required documents for that sign type.' },
              { step: '03', title: "See what's missing before you submit", desc: 'A checklist shows exactly what you need to gather. Check items off as you collect them. No more rejected submittals from missing documents.' },
              { step: '04', title: 'Track every job from research to approval', desc: 'Every permit job lives in one place. Your whole team sees the status. Nothing falls through the cracks.' },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ display: 'flex', gap: '20px', background: '#fff', borderRadius: '10px', padding: '24px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#185FA5', minWidth: '28px' }}>{step}</div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: '#0D1B2A', marginBottom: '6px' }}>{title}</div>
                  <div style={{ fontSize: '13px', color: '#5A6B7A', lineHeight: '1.6' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '72px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#185FA5', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '16px' }}>Who it's for</div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#0D1B2A', lineHeight: '1.3' }}>Built for sign industry professionals</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {[
              { role: 'Permit coordinators', desc: 'Stop hunting through municipal websites. Get a clearer starting point for every job.' },
              { role: 'Project managers', desc: "See every permit job's status in one place. Know what's missing before it becomes a problem." },
              { role: 'Experienced permit runners', desc: 'Move faster in unfamiliar jurisdictions. Surface the gotchas before they cost you weeks.' },
              { role: 'Shop owners', desc: 'Less time on research means more time on billable work. Better submissions mean fewer delays.' },
            ].map(({ role, desc }) => (
              <div key={role} style={{ padding: '24px', background: '#F4F7FA', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#0D1B2A', marginBottom: '8px' }}>{role}</div>
                <div style={{ fontSize: '13px', color: '#5A6B7A', lineHeight: '1.6' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '72px 24px', background: '#F4F7FA' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#185FA5', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '16px' }}>The value</div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#0D1B2A', lineHeight: '1.3' }}>Efficiency and reduction.<br />That's the whole formula.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { icon: '⚡', title: 'Faster research', desc: 'Get to likely requirements in seconds instead of hours.' },
              { icon: '📋', title: 'Cleaner submissions', desc: "Know what's needed before you submit. Reduce rejections." },
              { icon: '👥', title: 'Team visibility', desc: "Everyone sees every job's status. No more status-check calls." },
              { icon: '🎯', title: 'Code-backed guidance', desc: 'Requirements sourced from official government publications.' },
              { icon: '⚠️', title: 'Red flag alerts', desc: 'Surface the jurisdiction-specific gotchas before they surprise you.' },
              { icon: '📞', title: 'Direct contact info', desc: 'Right department, right phone number, right portal. Every time.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ padding: '20px', background: '#fff', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>{icon}</div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#0D1B2A', marginBottom: '6px' }}>{title}</div>
                <div style={{ fontSize: '12px', color: '#5A6B7A', lineHeight: '1.5' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '32px 24px', background: '#fff', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#9BA8B4', lineHeight: '1.7' }}>
            SignCode Pro provides general permit guidance based on publicly available sources to help sign professionals work more efficiently. Requirements vary by jurisdiction and change over time. Always verify requirements directly with the jurisdiction before submitting. SignCode Pro is not a legal authority and does not guarantee permit approval.
          </p>
        </div>
      </section>

      <section style={{ padding: '72px 24px', background: '#F4F7FA' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#185FA5', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '16px' }}>Pricing</div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#0D1B2A', marginBottom: '12px' }}>Simple, justifiable pricing</h2>
            <p style={{ fontSize: '14px', color: '#5A6B7A' }}>One rejected submittal costs more than a year of SignCode Pro.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { name: 'Starter', price: '$79', period: '/mo', desc: 'Perfect for small shops and solo permit runners', features: ['Jurisdiction lookup', 'Document checklists', 'Up to 10 active jobs', 'Email support'], highlight: false },
              { name: 'Professional', price: '$199', period: '/mo', desc: 'For growing teams handling multiple jobs at once', features: ['Everything in Starter', 'Unlimited active jobs', 'Team dashboard', 'Job status tracking', 'Red flag alerts', 'Priority support'], highlight: true },
              { name: 'Enterprise', price: 'Custom', period: '', desc: 'For large operations and multi-location shops', features: ['Everything in Professional', 'Custom jurisdictions', 'API access', 'Dedicated support', 'Team training'], highlight: false },
            ].map(({ name, price, period, desc, features, highlight }) => (
              <div key={name} style={{ padding: '28px', background: highlight ? '#0D1B2A' : '#fff', borderRadius: '12px', border: highlight ? 'none' : '1px solid #E2E8F0', position: 'relative' }}>
                {highlight && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#185FA5', color: '#fff', fontSize: '11px', fontWeight: '600', padding: '3px 12px', borderRadius: '20px', whiteSpace: 'nowrap' }}>Most popular</div>}
                <div style={{ fontSize: '14px', fontWeight: '600', color: highlight ? '#85B7EB' : '#5A6B7A', marginBottom: '8px' }}>{name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '32px', fontWeight: '700', color: highlight ? '#fff' : '#0D1B2A' }}>{price}</span>
                  <span style={{ fontSize: '13px', color: highlight ? '#85B7EB' : '#9BA8B4' }}>{period}</span>
                </div>
                <div style={{ fontSize: '12px', color: highlight ? '#85B7EB' : '#5A6B7A', marginBottom: '20px', lineHeight: '1.5' }}>{desc}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                  {features.map(f => (
                    <div key={f} style={{ display: 'flex', gap: '8px', fontSize: '12px', color: highlight ? '#fff' : '#0D1B2A' }}>
                      <span style={{ color: '#185FA5', fontWeight: '700' }}>✓</span>{f}
                    </div>
                  ))}
                </div>
                <a href="/waitlist" style={{ display: 'block', textAlign: 'center', padding: '10px', background: highlight ? '#185FA5' : '#F4F7FA', color: highlight ? '#fff' : '#0D1B2A', borderRadius: '8px', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>Join waitlist</a>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#9BA8B4', marginTop: '24px' }}>Founding member pricing — 30% off Professional forever for early waitlist signups.</p>
        </div>
      </section>

      <section style={{ padding: '80px 24px', background: '#0D1B2A' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#fff', marginBottom: '16px', lineHeight: '1.3' }}>A better starting point for every permit job</h2>
          <p style={{ fontSize: '15px', color: '#85B7EB', marginBottom: '36px', lineHeight: '1.7' }}>Join sign professionals already on the waitlist. Be first when we launch.</p>
          {!submitted ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', maxWidth: '440px', margin: '0 auto' }}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your work email" required style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: 'none', fontSize: '14px', outline: 'none' }} />
              <button type="submit" disabled={loading} style={{ padding: '12px 22px', background: '#185FA5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {loading ? 'Joining...' : 'Join waitlist'}
              </button>
            </form>
          ) : (
            <div style={{ background: 'rgba(24,95,165,0.2)', border: '1px solid #185FA5', borderRadius: '10px', padding: '20px', color: '#85B7EB', fontSize: '14px' }}>
              You're on the list. We'll be in touch when we launch. 🙌
            </div>
          )}
          <p style={{ fontSize: '11px', color: '#5A6B7A', marginTop: '16px' }}>No spam. No pressure. Just a heads up when we're ready.</p>
        </div>
      </section>

      <footer style={{ background: '#0A1420', padding: '32px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="22" height="22" viewBox="0 0 80 80"><rect width="80" height="80" rx="16" fill="#185FA5"/><rect x="10" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="10" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="10" y="46" width="24" height="24" rx="5" fill="#fff" fillOpacity=".22"/><rect x="46" y="46" width="24" height="24" rx="5" fill="#fff"/><path d="M49.5 60l4 4 8-9" stroke="#185FA5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>Sign<span style={{ color: '#185FA5' }}>Code</span> Pro</span>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="/lookup" style={{ fontSize: '12px', color: '#5A6B7A', textDecoration: 'none' }}>Lookup tool</a>
            <a href="/waitlist" style={{ fontSize: '12px', color: '#5A6B7A', textDecoration: 'none' }}>Waitlist</a>
          </div>
          <div style={{ fontSize: '11px', color: '#5A6B7A' }}>© 2026 SignCode Pro. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}