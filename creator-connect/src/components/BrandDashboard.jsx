import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Users, Plus, Trash2, Search, MapPin, CheckCircle, 
  TrendingUp, Send, FileText, X, LayoutTemplate, MoreHorizontal, Loader2
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function BrandDashboard({ userData, jobs, addJob }) {
  const [activeTab, setActiveTab] = useState('hiring'); 
  
  // --- PAST HIRING STATE ---
  const [pastHiring, setPastHiring] = useState([
    { id: 1, creator: "Sarah Jenkins", campaign: "Summer Launch", date: "Aug 2024", status: "Completed" },
    { id: 2, creator: "TechGuru", campaign: "Tech Review", date: "Jun 2024", status: "Completed" },
  ]);
  const [newHire, setNewHire] = useState({ creator: "", campaign: "" });
  const [showHireModal, setShowHireModal] = useState(false);

  // --- JOB POSTING STATE ---
  const [showJobModal, setShowJobModal] = useState(false);
  const [newJob, setNewJob] = useState({ title: "", budget: "", description: "" });

  // --- REAL CREATOR DATA STATE ---
  const [creators, setCreators] = useState([]);
  const [loadingCreators, setLoadingCreators] = useState(false);
  
  // --- NEW: VIEW PROFILE STATE ---
  const [viewingCreator, setViewingCreator] = useState(null);

  // FETCH CREATORS
  useEffect(() => {
    if (activeTab === 'discovery') {
      const fetchCreators = async () => {
        setLoadingCreators(true);
        try {
          const q = query(collection(db, 'users'), where('type', '==', 'creator'));
          const querySnapshot = await getDocs(q);
          const realCreators = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const seed = doc.id.charCodeAt(0); 
            return {
              id: doc.id,
              name: data.fullName || "Anonymous Creator",
              niche: data.roles && data.roles.length > 0 ? data.roles[0] : "General Content",
              followers: `${(seed * 500).toLocaleString()}`, 
              score: data.weeklyScore || 85,
              avatar: (data.fullName || "C")[0],
              feed: ["Updates coming soon..."], 
              verified: data.verified || false,
              // FETCH THE PORTFOLIO FIELD FROM DB
              portfolio: data.portfolio || [] 
            };
          });
          setCreators(realCreators);
        } catch (error) { console.error("Error fetching creators:", error); } 
        finally { setLoadingCreators(false); }
      };
      fetchCreators();
    }
  }, [activeTab]);

  // --- HANDLERS ---
  const handleAddHire = (e) => {
    e.preventDefault();
    if(!newHire.creator) return;
    setPastHiring([{ id: Date.now(), ...newHire, date: "Just now", status: "Active" }, ...pastHiring]);
    setNewHire({ creator: "", campaign: "" });
    setShowHireModal(false);
  };

  const handlePostJob = (e) => {
    e.preventDefault();
    if(!newJob.title) return;
    addJob({
      id: Date.now(),
      brand: userData.companyName || "My Brand",
      logo: (userData.companyName || "B")[0],
      title: newJob.title,
      budget: newJob.budget,
      description: newJob.description,
      pastHiring: pastHiring 
    });
    setNewJob({ title: "", budget: "", description: "" });
    setShowJobModal(false);
    alert("Job Posted! Creators can now see it.");
  };

  return (
    <div className="dashboard-grid">
      
      {/* LEFT SIDEBAR */}
      <div className="space-y-6">
        <div className="card profile-header">
          <div className="avatar" style={{background: '#e0f2fe', color: '#0369a1'}}>{(userData.companyName || "B")[0]}</div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '4px' }}>{userData.companyName || "Brand Account"}</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Verified Brand</p>
          <div style={{ marginTop: '16px', padding: '12px', background: '#f8fafc', borderRadius: '12px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <div style={{textAlign: 'center'}}><div style={{fontWeight: 900, fontSize: '1.2rem'}}>{pastHiring.length}</div><div style={{fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase'}}>Hires</div></div>
            <div style={{width: 1, background: '#e2e8f0'}}></div>
            <div style={{textAlign: 'center'}}><div style={{fontWeight: 900, fontSize: '1.2rem'}}>{jobs.length}</div><div style={{fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase'}}>Active Jobs</div></div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>Past Hiring</h4>
            <button onClick={() => setShowHireModal(true)} className="btn-ghost" style={{ padding: '4px 8px', fontSize: '0.75rem' }}><Plus size={14}/> Add</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pastHiring.map(hire => (
              <div key={hire.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                <div><div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{hire.creator}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{hire.campaign}</div></div>
                <div style={{ fontSize: '0.75rem', background: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: '12px' }}>{hire.status}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px' }}>Actions</h4>
          <button onClick={() => setShowJobModal(true)} className="btn w-full" style={{ background: 'var(--dark)', color: 'white' }}><Briefcase size={18} /> Post New Job</button>
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid #e2e8f0' }}>
          <button onClick={() => setActiveTab('hiring')} style={{ padding: '12px', borderBottom: activeTab === 'hiring' ? '3px solid var(--primary)' : 'none', fontWeight: 700, color: activeTab === 'hiring' ? 'var(--dark)' : 'var(--text-muted)', background: 'none', cursor: 'pointer' }}>Active Jobs</button>
          <button onClick={() => setActiveTab('discovery')} style={{ padding: '12px', borderBottom: activeTab === 'discovery' ? '3px solid var(--primary)' : 'none', fontWeight: 700, color: activeTab === 'discovery' ? 'var(--dark)' : 'var(--text-muted)', background: 'none', cursor: 'pointer' }}>Creator Discovery</button>
        </div>

        {activeTab === 'hiring' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {jobs.length === 0 && <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No active jobs. Click "Post New Job" to start hiring.</div>}
            {jobs.map(job => (
              <div key={job.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{job.title}</h3>
                  <span style={{ background: '#ecfdf5', color: '#047857', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>{job.budget}</span>
                </div>
                <p style={{ color: 'var(--text-main)', marginBottom: '16px' }}>{job.description}</p>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}><span>Posted by: You</span><span>•</span><span>0 Applications</span></div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'discovery' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {loadingCreators && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}><Loader2 className="animate-spin" size={32} color="var(--primary)" style={{ margin: '0 auto' }} /><p style={{ color: 'var(--text-muted)', marginTop: 12 }}>Searching database...</p></div>}
            {!loadingCreators && creators.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No creators found in the database yet.</div>}
            {!loadingCreators && creators.map(creator => (
              <div key={creator.id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{creator.avatar}</div>
                  <div><div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>{creator.name}{creator.verified && <CheckCircle size={14} fill="#10b981" color="white" />}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{creator.niche}</div></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '16px', background: '#f8fafc', padding: '8px', borderRadius: '8px' }}><span><strong>{creator.followers}</strong> Followers</span><span style={{ color: 'var(--success)', fontWeight: 700 }}>{creator.score} Score</span></div>
                
                {/* VIEW PROFILE BUTTON - Now active */}
                <button 
                  onClick={() => setViewingCreator(creator)}
                  className="btn btn-ghost" 
                  style={{ width: '100%' }}
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- MODALS --- */}
      
      {/* 1. VIEW CREATOR PROFILE MODAL */}
      {viewingCreator && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700 }}>
                  {viewingCreator.avatar}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>{viewingCreator.name}</h2>
                  <p style={{ color: 'var(--text-muted)' }}>{viewingCreator.niche}</p>
                </div>
              </div>
              <button onClick={() => setViewingCreator(null)} style={{ background: 'none',color:'black', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>

            {/* Portfolio Section */}
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Portfolio</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {viewingCreator.portfolio && viewingCreator.portfolio.length > 0 ? (
                viewingCreator.portfolio.map((item, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 700 }}>{item.brand}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{item.role} • {item.date}</div>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No portfolio items added yet.</p>
              )}
            </div>

            {/* Stats Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{viewingCreator.followers}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Followers</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--success)' }}>{viewingCreator.score}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Trust Score</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => alert("Invite sent!")}>Invite to Campaign</button>
              <button className="btn btn-ghost" style={{ flex: 1 }}>Message</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. ADD PAST HIRE MODAL */}
      {showHireModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
            <h3 style={{ marginBottom: 16, fontWeight: 800 }}>Add Past Hire</h3>
            <div className="input-group"><label className="input-label">Creator Name</label><input className="form-input" value={newHire.creator} onChange={e => setNewHire({...newHire, creator: e.target.value})} /></div>
            <div className="input-group"><label className="input-label">Campaign</label><input className="form-input" value={newHire.campaign} onChange={e => setNewHire({...newHire, campaign: e.target.value})} /></div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={handleAddHire} className="btn btn-primary" style={{ flex: 1 }}>Save</button>
              <button onClick={() => setShowHireModal(false)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. POST NEW JOB MODAL */}
      {showJobModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
            <h3 style={{ marginBottom: 16, fontWeight: 800 }}>Post New Job</h3>
            <div className="input-group"><label className="input-label">Job Title</label><input className="form-input" placeholder="e.g. Tech Reviewer needed" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} /></div>
            <div className="input-group"><label className="input-label">Budget</label><input className="form-input" placeholder="e.g. $500 - $1000" value={newJob.budget} onChange={e => setNewJob({...newJob, budget: e.target.value})} /></div>
            <div className="input-group"><label className="input-label">Description</label><textarea className="form-input" rows="3" placeholder="Describe the campaign..." value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} /></div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={handlePostJob} className="btn btn-primary" style={{ flex: 1 }}>Post Job</button>
              <button onClick={() => setShowJobModal(false)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}