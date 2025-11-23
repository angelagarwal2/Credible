import React from 'react';
import { Briefcase, Zap, DollarSign, Code, Shield, X, Network, Globe, TrendingUp, UserCheck, MessageSquare, Search, Award, ArrowRight, Lock } from 'lucide-react';

// --- Sub-Components ---
const FeatureCard = ({ Icon, title, description }) => (
  <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem', height: '100%' }}>
    <div style={{margin: '0 auto 16px', width: 56, height: 56, background: '#fffbeb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Icon size={28} color="var(--primary)" />
    </div>
    <h3 style={{fontWeight: 700, marginBottom: 8, fontSize: '1.1rem'}}>{title}</h3>
    <p style={{fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5}}>{description}</p>
  </div>
);

const RevenueSummary = () => {
  const revenueData = [
    { source: "Pro Creator", details: "₹499/mo (1,000 users)", monthly: "4,99,000" },
    { source: "Elite Creator", details: "$21.49/mo (150 users)", monthly: "2,24,850" },
    { source: "Brand Dashboard", details: "₹4,999/mo (50 brands)", monthly: "2,49,950" },
    { source: "Enterprise API", details: "₹24,999/mo (5 agencies)", monthly: "1,24,995" },
  ];
  
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #f3f4f6' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--dark)', fontWeight: 800, margin: 0 }}>Revenue Projection (Month 12)</h3>
        <DollarSign color="var(--success)" />
      </div>
      <div style={{overflowX: 'auto'}}>
        <table style={{width:'100%', borderCollapse:'collapse', fontSize:'0.9rem'}}>
          <thead>
            <tr style={{background:'#f9fafb', color:'var(--text-muted)', textTransform:'uppercase', fontSize:'0.75rem'}}>
              <th style={{textAlign:'left', padding:'12px'}}>Source</th>
              <th style={{textAlign:'left', padding:'12px'}}>Details</th>
              <th style={{textAlign:'right', padding:'12px'}}>Monthly (₹)</th>
            </tr>
          </thead>
          <tbody>
            {revenueData.map((row, i) => (
              <tr key={i} style={{borderBottom: '1px solid #f3f4f6'}}>
                <td style={{padding:'12px', fontWeight:600}}>{row.source}</td>
                <td style={{padding:'12px', color:'var(--text-muted)'}}>{row.details}</td>
                <td style={{padding:'12px', textAlign:'right', fontWeight:700, color:'var(--primary)'}}>{row.monthly}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{marginTop:'16px', padding:'12px', background:'#ecfdf5', borderRadius:'8px', display:'flex', justifyContent:'space-between', fontWeight:800, color:'#065f46'}}>
        <span>TOTAL PROJECTED</span>
        <span>₹9,73,795</span>
      </div>
    </div>
  );
};

export default function LandingPage({ setView }) {
  const features = [
    { title: "Verified Profiles", description: "Identity for YouTubers & Instagrammers using API data.", icon: UserCheck },
    { title: "Professional Feed", description: "Only career updates. Zero content feed distractions.", icon: MessageSquare },
    { title: "Creator Ranking", description: "Weekly leaderboards provide trusted visibility based on growth.", icon: Award },
    { title: "Brand Discovery", description: "Smart filters allow brands to find authentic creators.", icon: Search },
    { title: "Global Compliance", description: "Built with DPDPA 2023 compliance first. Data sovereignty.", icon: Shield },
    { title: "AI-Powered Tools", description: "Media kit generator & pitch templates to close deals.", icon: Zap },
  ];

  return (
    <div className="landing-wrapper animate-fade">
      
      {/* HERO */}
      <section className="hero">
        <div className="kicker"><TrendingUp size={16} /> The Professional Network for Creators</div>
        <h1 className="hero-title">Credible<br/><span className="gradient-text"></span></h1>
        <p className="hero-sub">
          A trusted hub for creators and brands to connect, verify, and grow their careers—<strong>without posting content</strong>.
        </p>
        <div className="cta-group">
          <button onClick={() => setView('signup-choice')} className="btn btn-primary">
            Get Verified Now <Briefcase size={18} style={{marginLeft:8}}/>
          </button>
          <button onClick={() => document.getElementById('solution').scrollIntoView()} className="btn btn-ghost">
            How it Works <ArrowRight size={18} style={{marginLeft:8}}/>
          </button>
        </div>
      </section>

      {/* PROBLEM */}
      <section id="problem">
        <div className="section-divider"><X size={40} color="var(--primary)" strokeWidth={3} /></div>
        <div style={{textAlign:'center', marginBottom: 40}}>
          <h3 className="section-heading">The Creator Identity Problem</h3>
          <p className="section-sub" style={{margin:'0 auto'}}>Entertainment platforms fail creators by providing no professional identity.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          <div className="card">
            <h3 style={{fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', color: 'var(--dark)'}}>Key Pain Points</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <li style={{display:'flex', gap:10}}><X size={20} color="#ef4444"/> <strong>No Verification:</strong> Anyone can claim to be an influencer.</li>
              <li style={{display:'flex', gap:10}}><X size={20} color="#ef4444"/> <strong>Data Inflation:</strong> Screenshots are easily faked.</li>
              <li style={{display:'flex', gap:10}}><X size={20} color="#ef4444"/> <strong>Distraction:</strong> Professional feeds mixed with memes.</li>
            </ul>
          </div>
          <div className="card card-dark" style={{textAlign:'center', display:'flex', flexDirection:'column', justifyContent:'center'}}>
            <Globe size={48} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
            <div style={{ fontSize: '0.9rem', color: '#fcd34d', fontWeight: 700, textTransform: 'uppercase' }}>Target Market (India)</div>
            <div style={{ fontSize: '3.5rem', fontWeight: 900, margin: '8px 0', color: 'white' }}>12M+</div>
            <p style={{ color: '#d1d5db', fontSize: '0.95rem' }}>Underserved creators needing professional validation.</p>
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section id="solution" style={{marginTop: 60}}>
        <div className="section-divider"><Network size={40} color="var(--primary)" strokeWidth={3} /></div>
        <div style={{textAlign:'center', marginBottom: 40}}>
          <h2 className="section-heading">The Credible Solution</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {features.map((f, i) => <FeatureCard key={i} Icon={f.icon} title={f.title} description={f.description} />)}
        </div>
      </section>

      {/* REVENUE */}
      <section id="revenue" style={{marginTop: 60}}>
        <div className="section-divider"><DollarSign size={40} color="var(--primary)" strokeWidth={3} /></div>
        <div style={{textAlign:'center', marginBottom: 40}}>
          <h2 className="section-heading">Sustainable Revenue</h2>
        </div>
        <RevenueSummary />
      </section>

    </div>
  );
}