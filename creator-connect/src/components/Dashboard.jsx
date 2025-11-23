import React, { useState } from 'react';
import { updatePassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Trophy, TrendingUp, Briefcase, Award, Lock, X, Loader2, CheckCircle, Clock, Fingerprint } from 'lucide-react';
import VerificationTool from './VerificationTool'; // Importing your tool

export default function Dashboard({ userData }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  
  // Password Change State
  const [newPassword, setNewPassword] = useState('');
  const [passMessage, setPassMessage] = useState({ type: '', text: '' });
  const [changingPass, setChangingPass] = useState(false);

  const leaderboard = [
    { id: 1, name: 'Creative Soul', role: 'YouTuber', score: 98 },
    { id: 2, name: 'Pixel Perfect', role: 'Instagrammer', score: 94 },
    { id: 3, name: 'Audio Wave', role: 'Podcaster', score: 91 },
  ];

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangingPass(true);
    setPassMessage({ type: '', text: '' });
    if (newPassword.length < 6) { setPassMessage({ type: 'error', text: 'Password must be > 6 chars.' }); setChangingPass(false); return; }
    const user = auth.currentUser;
    if (user) {
      try {
        await updatePassword(user, newPassword);
        setPassMessage({ type: 'success', text: 'Updated!' });
        setTimeout(() => setShowPasswordModal(false), 2000);
      } catch (error) { setPassMessage({ type: 'error', text: error.message }); }
    }
    setChangingPass(false);
  };

  if (!userData) return null;

  return (
    <div className="dashboard-grid relative">
      <div className="space-y-6">
        {/* Profile */}
        <div className="card profile-header">
          <div className="avatar">{userData.type === 'creator' ? userData.fullName[0] : userData.companyName[0]}</div>
          <h3 style={{ fontWeight: 'bold', fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            {userData.type === 'creator' ? userData.fullName : userData.companyName}
            {userData.verified && <span title="Verified Creator"><CheckCircle size={20} fill="#3b82f6" color="white" /></span>}
            {!userData.verified && userData.verificationStatus === 'pending' && <span title="Pending Review"><Clock size={20} color="#eab308" /></span>}
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase', margin: '0.5rem 0' }}>{userData.type} Account</p>
          <div className="stats-row"><div className="stat-box"><div className="stat-val">1.2k</div><div className="stat-lbl">Rank</div></div><div className="stat-box"><div className="stat-val">89</div><div className="stat-lbl">Score</div></div></div>
        </div>
        
        <div className="space-y-3">
            {/* Button triggers the new Verification Tool */}
            <button onClick={() => setShowVerifyModal(true)} className="btn w-full" style={{ background: '#1f2937', color: 'white', border: 'none' }}><Fingerprint size={18} /> Verify Identity</button>
            <button onClick={() => setShowPasswordModal(true)} className="btn w-full" style={{ background: 'white', border: '1px solid #e5e7eb', color: '#374151' }}><Lock size={16} /> Change Password</button>
        </div>
      </div>

      <div>
        <div className="card mb-6">
          <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '1rem' }}>Weekly Leaderboard</h2>
          {leaderboard.map((user, index) => (
            <div key={user.id} className="leaderboard-item">
              <div className={`rank ${index === 0 ? 'top' : ''}`}>#{index + 1}</div>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e5e7eb', margin: '0 1rem' }}></div>
              <div style={{ flex: 1 }}><h4 style={{ fontWeight: 'bold', fontSize: '0.95rem', margin: 0 }}>{user.name}</h4><p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0 }}>{user.role}</p></div>
              <div className="text-center"><div style={{ color: 'var(--success)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}><TrendingUp size={14} /> {user.score}</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* VERIFICATION MODAL - Uses the new component */}
      {showVerifyModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, backdropFilter: 'blur(4px)' }}>
          <div className="card" style={{ width: '100%', maxWidth: '420px', position: 'relative', padding: '0', overflow: 'hidden' }}>
            <button onClick={() => setShowVerifyModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', zIndex: 10 }}><X size={20} /></button>
            
            {/* Render the Verification Tool inside the modal */}
            <div style={{padding: '2.5rem'}}>
                <VerificationTool onClose={() => setShowVerifyModal(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', position: 'relative' }}>
            <button onClick={() => setShowPasswordModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><X size={20} /></button>
            <h3 style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--primary)' }}>Change Password</h3>
            <form onSubmit={handleChangePassword}>
              <div className="input-group"><label className="input-label">New Password</label><input className="form-input" type="password" required placeholder="Min 6 chars" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
              {passMessage.text && <div style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: '8px', backgroundColor: passMessage.type === 'error' ? '#fef2f2' : '#ecfdf5', color: passMessage.type === 'error' ? '#ef4444' : '#059669' }}>{passMessage.text}</div>}
              <button disabled={changingPass} className="btn btn-primary w-full">{changingPass ? <Loader2 className="animate-spin" /> : 'Update Password'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}