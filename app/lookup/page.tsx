'use client';

import { useState, useRef, useEffect } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────
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
  rawData?: Record<string, unknown>;
}

// ── City → jurisdiction key map ────────────────────────────────────────────
const CITY_MAP: Record<string, string> = {
  // Miami-Dade
  'miami': 'miami-dade',
  'miami-dade': 'miami-dade',
  'miami dade': 'miami-dade',
  'miami dade county': 'miami-dade',
  // Broward
  'broward': 'broward',
  'broward county': 'broward',
  'unincorporated broward': 'broward',
  // Palm Beach
  'palm beach': 'palm-beach',
  'palm beach county': 'palm-beach',
  // Fort Lauderdale
  'fort lauderdale': 'fort-lauderdale',
  'ft lauderdale': 'fort-lauderdale',
  // Pompano Beach
  'pompano beach': 'pompano-beach',
  'pompano': 'pompano-beach',
  // Boca Raton
  'boca raton': 'boca-raton',
  'boca': 'boca-raton',
  // Miami Beach
  'miami beach': 'miami-beach',
  // Orlando
  'orlando': 'orlando',
  // Tampa
  'tampa': 'tampa',
  // Hillsborough
  'hillsborough': 'hillsborough',
  'hillsborough county': 'hillsborough',
  // Southeast FL new 8
  'hollywood': 'hollywood',
  'deerfield beach': 'deerfield-beach',
  'deerfield': 'deerfield-beach',
  'pembroke pines': 'pembroke-pines',
  'coral springs': 'coral-springs',
  'miramar': 'miramar',
  'west palm beach': 'west-palm-beach',
  'west palm': 'west-palm-beach',
  'delray beach': 'delray-beach',
  'delray': 'delray-beach',
  'sunrise': 'sunrise',
};

// ── Dropdown options (alphabetical) ───────────────────────────────────────
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

// ── Small helpers ──────────────────────────────────────────────────────────
function Badge({ children, color = 'blue' }: { children: React.ReactNode; color?: 'blue' | 'red' | 'green' | 'yellow' | 'gray' }) {
  const colors = {
    blue: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    red: 'bg-red-500/15 text-red-300 border-red-500/30',
    green: 'bg-green-500/15 text-green-300 border-green-500/30',
    yellow: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
    gray: 'bg-white/5 text-white/40 border-white/10',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color]}`}>
      {children}
    </span>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function LookupPage() {
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('');
  const [result, setResult] = useState<JurisdictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [codeTab, setCodeTab] = useState<'verbatim' | 'simplified'>('simplified');
  const [codeOpen, setCodeOpen] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLookup();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0A1628;
          font-family: 'DM Sans', sans-serif;
          color: #E8EDF5;
          min-height: 100vh;
        }

        .page-wrap {
          min-height: 100vh;
          background: #0A1628;
          padding-bottom: 80px;
        }

        /* ── Top bar ── */
        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 32px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(10,22,40,0.95);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .logo-mark {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3px;
          width: 28px;
          height: 28px;
        }
        .logo-sq {
          border-radius: 3px;
          background: #185FA5;
        }
        .logo-sq.check {
          position: relative;
          background: #185FA5;
          display: flex; align-items: center; justify-content: center;
        }
        .logo-sq.check::after {
          content: '✓';
          font-size: 9px;
          color: white;
          font-weight: 700;
        }
        .logo-text {
          font-size: 17px;
          font-weight: 700;
          color: #E8EDF5;
          letter-spacing: -0.3px;
          margin-left: 10px;
        }
        .logo-text span { color: #4A9FE8; }
        .nav-links { display: flex; gap: 24px; align-items: center; }
        .nav-link {
          font-size: 14px;
          color: rgba(232,237,245,0.55);
          text-decoration: none;
          transition: color 0.2s;
          font-weight: 500;
        }
        .nav-link:hover { color: #E8EDF5; }
        .nav-link.active { color: #4A9FE8; }
        .btn-nav {
          background: #185FA5;
          color: white;
          border: none;
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s;
        }
        .btn-nav:hover { background: #1a6fbe; }

        /* ── Hero ── */
        .hero {
          text-align: center;
          padding: 72px 24px 48px;
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute;
          top: -60px; left: 50%; transform: translateX(-50%);
          width: 700px; height: 400px;
          background: radial-gradient(ellipse at center, rgba(24,95,165,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(24,95,165,0.15);
          border: 1px solid rgba(74,159,232,0.25);
          border-radius: 100px;
          padding: 5px 14px;
          font-size: 12px;
          font-weight: 600;
          color: #4A9FE8;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 20px;
        }
        .hero-title {
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 700;
          line-height: 1.12;
          letter-spacing: -1.5px;
          color: #E8EDF5;
          margin-bottom: 16px;
        }
        .hero-title em {
          font-style: normal;
          background: linear-gradient(135deg, #4A9FE8 0%, #185FA5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-sub {
          font-size: 17px;
          color: rgba(232,237,245,0.55);
          max-width: 540px;
          margin: 0 auto 44px;
          line-height: 1.6;
          font-weight: 400;
        }

        /* ── Search area ── */
        .search-wrap {
          max-width: 720px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .search-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 20px;
          padding: 28px;
          backdrop-filter: blur(12px);
        }
        .search-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 14px;
        }
        .input-label {
          font-size: 11px;
          font-weight: 600;
          color: rgba(232,237,245,0.4);
          letter-spacing: 0.8px;
          text-transform: uppercase;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .coming-soon-pill {
          background: rgba(255,193,7,0.15);
          border: 1px solid rgba(255,193,7,0.3);
          color: #FFC107;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          padding: 2px 7px;
          border-radius: 100px;
        }
        .address-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 11px;
          padding: 13px 16px;
          font-size: 14px;
          color: rgba(232,237,245,0.3);
          font-family: 'DM Sans', sans-serif;
          cursor: not-allowed;
          outline: none;
        }
        .address-input::placeholder { color: rgba(232,237,245,0.2); }
        .select-input {
          width: 100%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(74,159,232,0.2);
          border-radius: 11px;
          padding: 13px 16px;
          font-size: 14px;
          color: #E8EDF5;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          outline: none;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234A9FE8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 42px;
          transition: border-color 0.2s;
        }
        .select-input:focus { border-color: rgba(74,159,232,0.6); }
        .select-input option { background: #0D1B2A; color: #E8EDF5; }

        .btn-lookup {
          width: 100%;
          background: linear-gradient(135deg, #185FA5 0%, #1a6fbe 100%);
          color: white;
          border: none;
          padding: 14px;
          border-radius: 11px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 20px rgba(24,95,165,0.35);
        }
        .btn-lookup:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(24,95,165,0.5);
        }
        .btn-lookup:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          transform: none;
        }

        /* ── Stats row ── */
        .stats-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 28px;
          margin-top: 20px;
          flex-wrap: wrap;
        }
        .stat-item {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
          color: rgba(232,237,245,0.4);
        }
        .stat-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #185FA5;
          flex-shrink: 0;
        }

        /* ── Result card ── */
        .results-wrap {
          max-width: 860px;
          margin: 48px auto 0;
          padding: 0 24px;
        }
        .result-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 28px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .result-title {
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.6px;
          color: #E8EDF5;
        }
        .result-subtitle {
          font-size: 14px;
          color: rgba(232,237,245,0.4);
          margin-top: 4px;
          font-weight: 400;
        }
        .result-badges { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }

        /* Info grid */
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 14px;
          margin-bottom: 24px;
        }
        .info-tile {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 18px;
          transition: border-color 0.2s;
        }
        .info-tile:hover { border-color: rgba(74,159,232,0.2); }
        .tile-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: rgba(232,237,245,0.35);
          margin-bottom: 6px;
        }
        .tile-value {
          font-size: 20px;
          font-weight: 700;
          color: #4A9FE8;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }
        .tile-note {
          font-size: 11px;
          color: rgba(232,237,245,0.35);
          margin-top: 4px;
          line-height: 1.4;
        }

        /* Section card */
        .section-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 22px 24px;
          margin-bottom: 16px;
        }
        .section-title {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: rgba(232,237,245,0.35);
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .section-title-icon {
          width: 20px; height: 20px;
          border-radius: 5px;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px;
          flex-shrink: 0;
        }
        .icon-blue { background: rgba(24,95,165,0.25); color: #4A9FE8; }
        .icon-red { background: rgba(239,68,68,0.15); color: #F87171; }
        .icon-green { background: rgba(34,197,94,0.12); color: #4ADE80; }
        .icon-yellow { background: rgba(234,179,8,0.12); color: #FACC15; }

        .list-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 9px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          font-size: 14px;
          color: rgba(232,237,245,0.75);
          line-height: 1.5;
        }
        .list-item:last-child { border-bottom: none; padding-bottom: 0; }
        .list-bullet {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #185FA5;
          flex-shrink: 0;
          margin-top: 8px;
        }
        .list-bullet.red { background: #EF4444; }
        .list-bullet.yellow { background: #EAB308; }
        .list-bullet.green { background: #22C55E; }

        /* EMC badge */
        .emc-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          border-radius: 11px;
          margin-bottom: 14px;
          font-size: 14px;
          font-weight: 500;
        }
        .emc-allowed { background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2); color: #4ADE80; }
        .emc-banned { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: #F87171; }

        /* ── Code Language section ── */
        .code-section {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          margin-bottom: 16px;
          overflow: hidden;
        }
        .code-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          cursor: pointer;
          transition: background 0.2s;
          user-select: none;
        }
        .code-header:hover { background: rgba(255,255,255,0.02); }
        .code-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .code-icon {
          width: 36px; height: 36px;
          background: rgba(24,95,165,0.2);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }
        .code-header-title {
          font-size: 14px;
          font-weight: 600;
          color: #E8EDF5;
        }
        .code-header-sub {
          font-size: 12px;
          color: rgba(232,237,245,0.35);
          margin-top: 2px;
        }
        .code-chevron {
          color: rgba(232,237,245,0.35);
          transition: transform 0.25s;
          font-size: 18px;
        }
        .code-chevron.open { transform: rotate(180deg); }

        .code-body {
          border-top: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
        }

        /* Tab toggle */
        .tab-toggle {
          display: flex;
          gap: 4px;
          padding: 16px 24px 0;
        }
        .tab-btn {
          padding: 7px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tab-btn.active {
          background: rgba(24,95,165,0.25);
          border-color: rgba(74,159,232,0.35);
          color: #4A9FE8;
        }
        .tab-btn.inactive {
          background: transparent;
          border-color: rgba(255,255,255,0.08);
          color: rgba(232,237,245,0.45);
        }
        .tab-btn.inactive:hover {
          color: rgba(232,237,245,0.7);
          border-color: rgba(255,255,255,0.15);
        }

        .code-sections-list { padding: 16px 24px 24px; }

        .code-entry {
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding: 16px 0;
        }
        .code-entry:last-child { border-bottom: none; padding-bottom: 0; }
        .code-entry-header {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 8px;
        }
        .code-section-num {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          color: #4A9FE8;
          background: rgba(24,95,165,0.15);
          padding: 2px 8px;
          border-radius: 5px;
          flex-shrink: 0;
        }
        .code-entry-title {
          font-size: 13px;
          font-weight: 600;
          color: rgba(232,237,245,0.65);
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }
        .code-verbatim {
          font-family: 'DM Mono', monospace;
          font-size: 12.5px;
          line-height: 1.7;
          color: rgba(232,237,245,0.65);
          background: rgba(0,0,0,0.2);
          border-left: 3px solid rgba(74,159,232,0.3);
          padding: 12px 16px;
          border-radius: 0 8px 8px 0;
        }
        .code-simplified {
          font-size: 14px;
          line-height: 1.65;
          color: rgba(232,237,245,0.75);
          background: rgba(34,197,94,0.04);
          border-left: 3px solid rgba(34,197,94,0.25);
          padding: 12px 16px;
          border-radius: 0 8px 8px 0;
        }

        /* ── Contacts ── */
        .contacts-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .contact-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .contact-label {
          font-size: 13px;
          color: rgba(232,237,245,0.45);
          font-weight: 500;
          min-width: 130px;
        }
        .contact-value {
          font-size: 13px;
          color: #E8EDF5;
          font-weight: 500;
          text-align: right;
        }

        /* ── Loading ── */
        .loading-wrap {
          text-align: center;
          padding: 56px 24px;
        }
        .spinner {
          width: 40px; height: 40px;
          border: 3px solid rgba(74,159,232,0.2);
          border-top-color: #185FA5;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 16px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Error ── */
        .error-box {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 12px;
          padding: 16px 20px;
          color: #F87171;
          font-size: 14px;
          margin-top: 24px;
          max-width: 720px;
          margin-left: auto;
          margin-right: auto;
        }

        /* ── Practitioner notes ── */
        .note-item {
          display: flex;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          font-size: 13.5px;
          color: rgba(232,237,245,0.65);
          line-height: 1.55;
        }
        .note-item:last-child { border-bottom: none; }
        .note-emoji { flex-shrink: 0; }

        @media (max-width: 640px) {
          .search-grid { grid-template-columns: 1fr; }
          .topbar { padding: 14px 18px; }
          .nav-links { gap: 14px; }
          .result-header { flex-direction: column; }
          .info-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="page-wrap">
        {/* Top bar */}
        <nav className="topbar">
          <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: 0 }}>
            <div className="logo-mark">
              <div className="logo-sq" />
              <div className="logo-sq" />
              <div className="logo-sq" />
              <div className="logo-sq check" />
            </div>
            <span className="logo-text">Sign<span>Code</span> Pro</span>
          </a>
          <div className="nav-links">
            <a href="/lookup" className="nav-link active">Lookup</a>
            <a href="/jobs" className="nav-link">Jobs</a>
            <a href="/waitlist" className="nav-link">Waitlist</a>
            <button className="btn-nav" onClick={() => window.location.href = '/waitlist'}>Get Beta Access</button>
          </div>
        </nav>

        {/* Hero */}
        <section className="hero">
          <div className="hero-eyebrow">
            <span>⚡</span> Florida Sign Permit Intelligence
          </div>
          <h1 className="hero-title">
            Look up any jurisdiction.<br />
            <em>In seconds, not hours.</em>
          </h1>
          <p className="hero-sub">
            Sign codes, required docs, red flags, and real contact info — researched and verified for Florida's most active markets.
          </p>
        </section>

        {/* Search card */}
        <div className="search-wrap">
          <div className="search-card">
            <div className="search-grid">
              {/* Address search — coming soon */}
              <div>
                <div className="input-label">
                  📍 Address Search
                  <span className="coming-soon-pill">Coming Soon</span>
                </div>
                <input
                  className="address-input"
                  type="text"
                  placeholder="123 Main St, Fort Lauderdale, FL…"
                  disabled
                />
              </div>

              {/* Jurisdiction dropdown */}
              <div>
                <div className="input-label">
                  🗂 Select Jurisdiction
                </div>
                <select
                  className="select-input"
                  value={selectedJurisdiction}
                  onChange={e => setSelectedJurisdiction(e.target.value)}
                  onKeyDown={handleKeyDown}
                >
                  <option value="">— Choose a city or county —</option>
                  {JURISDICTION_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              className="btn-lookup"
              onClick={handleLookup}
              disabled={!selectedJurisdiction || loading}
            >
              {loading ? (
                <>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                  Looking up…
                </>
              ) : (
                <>🔍 Run Permit Lookup</>
              )}
            </button>
          </div>

          {/* Stats row */}
          <div className="stats-row">
            <div className="stat-item"><span className="stat-dot" />18 jurisdictions covered</div>
            <div className="stat-item"><span className="stat-dot" />Verified sign code data</div>
            <div className="stat-item"><span className="stat-dot" />Real-world practitioner notes</div>
            <div className="stat-item"><span className="stat-dot" />Verbatim ordinance text</div>
          </div>
        </div>

        {/* Error */}
        {error && <div className="error-box">⚠️ {error}</div>}

        {/* Loading */}
        {loading && (
          <div className="loading-wrap">
            <div className="spinner" />
            <p style={{ color: 'rgba(232,237,245,0.4)', fontSize: 14 }}>Pulling jurisdiction data…</p>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="results-wrap" ref={resultRef}>
            {/* Header */}
            <div className="result-header">
              <div>
                <div className="result-title">{result.jurisdiction}</div>
                {result.county && <div className="result-subtitle">{result.county}</div>}
              </div>
              <div className="result-badges">
                {result.emcAllowed === true && <Badge color="green">✓ EMC Allowed</Badge>}
                {result.emcAllowed === false && <Badge color="red">✗ EMC Banned</Badge>}
                {result.turnaround && <Badge color="blue">⏱ {result.turnaround}</Badge>}
              </div>
            </div>

            {/* Key numbers */}
            <div className="info-grid">
              {result.maxHeight && (
                <div className="info-tile">
                  <div className="tile-label">Max Height</div>
                  <div className="tile-value">{result.maxHeight}</div>
                </div>
              )}
              {result.maxArea && (
                <div className="info-tile">
                  <div className="tile-label">Max Sign Area</div>
                  <div className="tile-value">{result.maxArea}</div>
                </div>
              )}
              {result.setback && (
                <div className="info-tile">
                  <div className="tile-label">Setback</div>
                  <div className="tile-value">{result.setback}</div>
                </div>
              )}
              {result.fees && (
                <div className="info-tile">
                  <div className="tile-label">Permit Fees</div>
                  <div className="tile-value" style={{ fontSize: 16 }}>{result.fees}</div>
                </div>
              )}
            </div>

            {/* EMC note */}
            {result.emcNotes && (
              <div className={`emc-row ${result.emcAllowed ? 'emc-allowed' : 'emc-banned'}`}>
                <span>{result.emcAllowed ? '✅' : '🚫'}</span>
                <span>{result.emcNotes}</span>
              </div>
            )}

            {/* Red flags */}
            {result.redFlags && result.redFlags.length > 0 && (
              <div className="section-card">
                <div className="section-title">
                  <div className="section-title-icon icon-red">🚩</div>
                  Red Flags & Watch Items
                </div>
                {result.redFlags.map((flag, i) => (
                  <div key={i} className="list-item">
                    <div className="list-bullet red" />
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Required docs */}
            {result.requiredDocs && result.requiredDocs.length > 0 && (
              <div className="section-card">
                <div className="section-title">
                  <div className="section-title-icon icon-blue">📋</div>
                  Required Documents
                </div>
                {result.requiredDocs.map((doc, i) => (
                  <div key={i} className="list-item">
                    <div className="list-bullet" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Contacts */}
            {result.contacts && result.contacts.length > 0 && (
              <div className="section-card">
                <div className="section-title">
                  <div className="section-title-icon icon-green">📞</div>
                  Contacts & Portals
                </div>
                <div className="contacts-grid">
                  {result.contacts.map((c, i) => (
                    <div key={i} className="contact-row">
                      <span className="contact-label">{c.label}</span>
                      <span className="contact-value">{c.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Practitioner notes */}
            {result.practitionerNotes && result.practitionerNotes.length > 0 && (
              <div className="section-card">
                <div className="section-title">
                  <div className="section-title-icon icon-yellow">🔧</div>
                  Field Notes
                </div>
                {result.practitionerNotes.map((note, i) => (
                  <div key={i} className="note-item">
                    <span className="note-emoji">→</span>
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            )}

            {/* ── Official Code Language ── */}
            {result.codeLanguage && result.codeLanguage.length > 0 && (
              <div className="code-section">
                <div className="code-header" onClick={() => setCodeOpen(o => !o)}>
                  <div className="code-header-left">
                    <div className="code-icon">📜</div>
                    <div>
                      <div className="code-header-title">Official Code Language</div>
                      <div className="code-header-sub">{result.codeLanguage.length} ordinance sections · verbatim + plain English</div>
                    </div>
                  </div>
                  <span className={`code-chevron ${codeOpen ? 'open' : ''}`}>⌄</span>
                </div>

                {codeOpen && (
                  <div className="code-body">
                    <div className="tab-toggle">
                      <button
                        className={`tab-btn ${codeTab === 'simplified' ? 'active' : 'inactive'}`}
                        onClick={() => setCodeTab('simplified')}
                      >
                        ✏️ Plain English
                      </button>
                      <button
                        className={`tab-btn ${codeTab === 'verbatim' ? 'active' : 'inactive'}`}
                        onClick={() => setCodeTab('verbatim')}
                      >
                        ⚖️ Verbatim Code
                      </button>
                    </div>

                    <div className="code-sections-list">
                      {result.codeLanguage.map((cs, i) => (
                        <div key={i} className="code-entry">
                          <div className="code-entry-header">
                            <span className="code-section-num">{cs.section}</span>
                            <span className="code-entry-title">{cs.title}</span>
                          </div>
                          {codeTab === 'verbatim' ? (
                            <div className="code-verbatim">{cs.verbatim}</div>
                          ) : (
                            <div className="code-simplified">{cs.simplified}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
