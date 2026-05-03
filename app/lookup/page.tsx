'use client';
import { useState } from 'react';

const JURISDICTIONS = [
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

export default function LookupPage() {
    const [jur, setJur] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [tab, setTab] = useState('signs');

  async function lookup() {
        if (!jur) return;
        setLoading(true);
        setError('');
        setData(null);
        setTab('signs');
        try {
            const res = await fetch('/api/lookup?jurisdiction=' + jur);
                const json = await res.json();
                const result = json.data || json;
                setData(result);
        } catch {
                setError('Failed to load. Please try again.');
        }
        setLoading(false);
  }

  return (
        <div style={{ fontFamily: 'DM Sans, sans-serif', minHeight: '100vh', background: '#F4F7FA' }}>
                <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} @keyframes spin{to{transform:rotate(360deg)}} @keyframes glow{0%,100%{opacity:.4}50%{opacity:.7}}`}</style>style>
        
              <nav style={{ background: 'rgba(255,255,255,0.96)', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 50 }}>
                      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                                            <svg width="26" height="26" viewBox="0 0 80 80"></style>
