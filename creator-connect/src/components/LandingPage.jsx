import React from 'react';
import { Briefcase, Zap, DollarSign, Code, Shield, X, Network, Globe, TrendingUp, UserCheck, MessageSquare, Search, Award, ArrowRight, Lock, Check } from 'lucide-react';

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

// New Pricing Card Component based on your Screenshot
const PricingTier = ({ title, price, features, isDark }) => (
  <div className={`card ${isDark ? 'card-dark' : ''}`} style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden' }}>
    {isDark && <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--primary)', color: 'black', fontSize: '0.7rem', fontWeight: 800, padding: '4px 12px', borderBottomLeftRadius: '8px' }}>RECOMMENDED</div>}
    
    <div style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #f3f4f6', paddingBottom: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: isDark ? 'white' : 'var(--dark)', marginBottom: '8px' }}>{title}</h3>
        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{price}<span style={{fontSize: '1rem', color: isDark ? '#9ca3af' : '#6b7280', fontWeight: 500}}>/month</span></div>
    </div>
    
    <div style={{ display: 'grid', gap: '24px', flex: 1 }}>
        {features.map((f, i) => (
            <div key={i}>
                <div style={{ fontWeight: 700, color: isDark ? 'white' : 'var(--dark)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: 4, height: 18, background: 'var(--primary)', borderRadius: 2 }}></div>
                    {f.title}
                </div>
                <p style={{ fontSize: '0.9rem', color: isDark ? '#d1d5db' : 'var(--text-muted)', lineHeight: 1.5, paddingLeft: '14px', margin: 0 }}>{f.desc}</p>
            </div>
        ))}
    </div>
    
    <button className="btn btn-primary" style={{ marginTop: '32px', width: '100%', padding: '1rem' }}>
      Get Started <ArrowRight size={18} style={{marginLeft: 8}}/>
    </button>
  </div>
);

export default function LandingPage({ setView }) {
  const features = [
    { title: "Verified Profiles", description: "Identity for YouTubers & Instagrammers using API data.", icon: UserCheck },
    { title: "Professional Feed", description: "Only career updates. Zero content feed distractions.", icon: MessageSquare },
    { title: "Creator Ranking", description: "Weekly leaderboards provide trusted visibility based on growth.", icon: Award },
    { title: "Brand Discovery", description: "Smart filters allow brands to find authentic creators.", icon: Search },
    { title: "Global Compliance", description: "Built with DPDPA 2023 compliance first. Data sovereignty.", icon: Shield },
    { title: "AI-Powered Tools", description: "Media kit generator & pitch templates to close deals.", icon: Zap },
  ];

  // Data from your Screenshot
  const proCreatorFeatures = [
    {title: "Live Analytics Dashboard", desc: "Real-time engagement tracking across platforms. Audience demographic breakdowns (age, gender, geography)."},
    {title: "AI Enabled Premium Templates", desc: "Prompt Based Videos/Reels are automatically generated for your media kit."},
    {title: "Brand Discovery", desc: "Get discovered by verified brands. Priority visibility in search results. Apply to campaigns directly."},
    {title: "Performance Insights", desc: "Growth trajectory analysis. Benchmark against similar creators. Best-performing content identification."}
  ];

  const brandFeatures = [
    {title: "Unlimited Searches", desc: "Search across 10,000+ verified creators by niche, location, engagement rate. Advanced filters for Tier-2/3 cities."},
    {title: "Verified Data Export", desc: "Export CSV with live metrics for campaign planning. Historical performance data access. Competitor analysis."},
    {title: "Campaign Tracking", desc: "UTM-powered attribution links. Real-time ROI dashboard. Multi-creator campaign management in single view."},
    {title: "Trust Scoring", desc: "AI-powered fake engagement detection. Audience quality metrics. Risk assessment for every partnership."}
  ];

  return (
    <div className="landing-wrapper animate-fade">
      
      {/* HERO */}
      <section className="hero">
        <div className="kicker"><TrendingUp size={16} /> The Professional Network for Creators</div>
        <h1 className="hero-title">Trust is the new<br/><span className="gradient-text">Currency.</span></h1>
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
          <h2 className="section-heading">The Creator Identity Problem</h2>
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

      {/* NEW: PREMIUM TIER BREAKDOWN (From Screenshot) */}
      <section id="pricing" style={{marginTop: 80}}>
        <div className="section-divider"><DollarSign size={40} color="var(--primary)" strokeWidth={3} /></div>
        <div style={{textAlign:'center', marginBottom: 60}}>
          <h2 className="section-heading">Premium Tier Breakdown</h2>
          <p className="section-sub" style={{margin:'0 auto'}}>Choose the plan that fits your professional needs.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
          {/* Plan 1: Pro Creator */}
          <PricingTier 
            title="Pro Creator" 
            price="₹499" 
            features={proCreatorFeatures} 
          />
          
          {/* Plan 2: Brand Dashboard */}
          <PricingTier 
            title="Brand Dashboard" 
            price="₹4,999" 
            features={brandFeatures}
            isDark={true}
          />
        </div>
      </section>

    </div>
  );
}







// import React from 'react';
// import { Briefcase, Zap, DollarSign, Code, Shield, X, Network, Globe, TrendingUp, UserCheck, MessageSquare, Search, Award, ArrowRight, Lock } from 'lucide-react';

// // --- Sub-Components ---
// const FeatureCard = ({ Icon, title, description }) => (
//   <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem', height: '100%' }}>
//     <div style={{margin: '0 auto 16px', width: 56, height: 56, background: '#fffbeb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
//       <Icon size={28} color="var(--primary)" />
//     </div>
//     <h3 style={{fontWeight: 700, marginBottom: 8, fontSize: '1.1rem'}}>{title}</h3>
//     <p style={{fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5}}>{description}</p>
//   </div>
// );

// const RevenueSummary = () => {
//   const revenueData = [
//     { source: "Pro Creator", details: "₹499/mo (1,000 users)", monthly: "4,99,000" },
//     { source: "Elite Creator", details: "$21.49/mo (150 users)", monthly: "2,24,850" },
//     { source: "Brand Dashboard", details: "₹4,999/mo (50 brands)", monthly: "2,49,950" },
//     { source: "Enterprise API", details: "₹24,999/mo (5 agencies)", monthly: "1,24,995" },
//   ];
  
//   return (
//     <div className="card" style={{ overflow: 'hidden' }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #f3f4f6' }}>
//         <h3 style={{ fontSize: '1.2rem', color: 'var(--dark)', fontWeight: 800, margin: 0 }}>Revenue Projection (Month 12)</h3>
//         <DollarSign color="var(--success)" />
//       </div>
//       <div style={{overflowX: 'auto'}}>
//         <table style={{width:'100%', borderCollapse:'collapse', fontSize:'0.9rem'}}>
//           <thead>
//             <tr style={{background:'#f9fafb', color:'var(--text-muted)', textTransform:'uppercase', fontSize:'0.75rem'}}>
//               <th style={{textAlign:'left', padding:'12px'}}>Source</th>
//               <th style={{textAlign:'left', padding:'12px'}}>Details</th>
//               <th style={{textAlign:'right', padding:'12px'}}>Monthly (₹)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {revenueData.map((row, i) => (
//               <tr key={i} style={{borderBottom: '1px solid #f3f4f6'}}>
//                 <td style={{padding:'12px', fontWeight:600}}>{row.source}</td>
//                 <td style={{padding:'12px', color:'var(--text-muted)'}}>{row.details}</td>
//                 <td style={{padding:'12px', textAlign:'right', fontWeight:700, color:'var(--primary)'}}>{row.monthly}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <div style={{marginTop:'16px', padding:'12px', background:'#ecfdf5', borderRadius:'8px', display:'flex', justifyContent:'space-between', fontWeight:800, color:'#065f46'}}>
//         <span>TOTAL PROJECTED</span>
//         <span>₹9,73,795</span>
//       </div>
//     </div>
//   );
// };

// export default function LandingPage({ setView }) {
//   const features = [
//     { title: "Verified Profiles", description: "Identity for YouTubers & Instagrammers using API data.", icon: UserCheck },
//     { title: "Professional Feed", description: "Only career updates. Zero content feed distractions.", icon: MessageSquare },
//     { title: "Creator Ranking", description: "Weekly leaderboards provide trusted visibility based on growth.", icon: Award },
//     { title: "Brand Discovery", description: "Smart filters allow brands to find authentic creators.", icon: Search },
//     { title: "Global Compliance", description: "Built with DPDPA 2023 compliance first. Data sovereignty.", icon: Shield },
//     { title: "AI-Powered Tools", description: "Media kit generator & pitch templates to close deals.", icon: Zap },
//   ];

//   return (
//     <div className="landing-wrapper animate-fade">
      
//       {/* HERO */}
//       <section className="hero">
//         <div className="kicker"><TrendingUp size={16} /> The Professional Network for Creators</div>
//         <h1 className="hero-title">Credible<br/><span className="gradient-text"></span></h1>
//         <p className="hero-sub">
//           A trusted hub for creators and brands to connect, verify, and grow their careers—<strong>without posting content</strong>.
//         </p>
//         <div className="cta-group">
//           <button onClick={() => setView('signup-choice')} className="btn btn-primary">
//             Get Verified Now <Briefcase size={18} style={{marginLeft:8}}/>
//           </button>
//           <button onClick={() => document.getElementById('solution').scrollIntoView()} className="btn btn-ghost">
//             How it Works <ArrowRight size={18} style={{marginLeft:8}}/>
//           </button>
//         </div>
//       </section>

//       {/* PROBLEM */}
//       <section id="problem">
//         <div className="section-divider"><X size={40} color="var(--primary)" strokeWidth={3} /></div>
//         <div style={{textAlign:'center', marginBottom: 40}}>
//           <h3 className="section-heading">The Creator Identity Problem</h3>
//           <p className="section-sub" style={{margin:'0 auto'}}>Entertainment platforms fail creators by providing no professional identity.</p>
//         </div>
        
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
//           <div className="card">
//             <h3 style={{fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', color: 'var(--dark)'}}>Key Pain Points</h3>
//             <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
//               <li style={{display:'flex', gap:10}}><X size={20} color="#ef4444"/> <strong>No Verification:</strong> Anyone can claim to be an influencer.</li>
//               <li style={{display:'flex', gap:10}}><X size={20} color="#ef4444"/> <strong>Data Inflation:</strong> Screenshots are easily faked.</li>
//               <li style={{display:'flex', gap:10}}><X size={20} color="#ef4444"/> <strong>Distraction:</strong> Professional feeds mixed with memes.</li>
//             </ul>
//           </div>
//           <div className="card card-dark" style={{textAlign:'center', display:'flex', flexDirection:'column', justifyContent:'center'}}>
//             <Globe size={48} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
//             <div style={{ fontSize: '0.9rem', color: '#fcd34d', fontWeight: 700, textTransform: 'uppercase' }}>Target Market (India)</div>
//             <div style={{ fontSize: '3.5rem', fontWeight: 900, margin: '8px 0', color: 'white' }}>12M+</div>
//             <p style={{ color: '#d1d5db', fontSize: '0.95rem' }}>Underserved creators needing professional validation.</p>
//           </div>
//         </div>
//       </section>

//       {/* SOLUTION */}
//       <section id="solution" style={{marginTop: 60}}>
//         <div className="section-divider"><Network size={40} color="var(--primary)" strokeWidth={3} /></div>
//         <div style={{textAlign:'center', marginBottom: 40}}>
//           <h2 className="section-heading">The Credible Solution</h2>
//         </div>
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
//           {features.map((f, i) => <FeatureCard key={i} Icon={f.icon} title={f.title} description={f.description} />)}
//         </div>
//       </section>

//       {/* REVENUE */}
//       <section id="revenue" style={{marginTop: 60}}>
//         <div className="section-divider"><DollarSign size={40} color="var(--primary)" strokeWidth={3} /></div>
//         <div style={{textAlign:'center', marginBottom: 40}}>
//           <h2 className="section-heading">Sustainable Revenue</h2>
//         </div>
//         <RevenueSummary />
//       </section>

//     </div>
//   );
// }