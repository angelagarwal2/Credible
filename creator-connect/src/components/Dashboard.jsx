import React, { useState } from 'react';
import { updatePassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Trophy, TrendingUp, Briefcase, Award, ArrowRight, Lock, X, Loader2, CheckCircle, Clock } from 'lucide-react';

export default function Dashboard({ userData }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [changingPass, setChangingPass] = useState(false);

  const leaderboard = [
    { id: 1, name: 'Creative Soul', role: 'YouTuber', score: 98 },
    { id: 2, name: 'Pixel Perfect', role: 'Instagrammer', score: 94 },
    { id: 3, name: 'Audio Wave', role: 'Podcaster', score: 91 },
  ];

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangingPass(true);
    setMessage({ type: '', text: '' });
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      setChangingPass(false);
      return;
    }
    const user = auth.currentUser;
    if (user) {
      try {
        await updatePassword(user, newPassword);
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        setNewPassword('');
        setTimeout(() => setShowPasswordModal(false), 2000);
      } catch (error) {
        if (error.code === 'auth/requires-recent-login') {
          setMessage({ type: 'error', text: 'Please logout and login again to change password.' });
        } else {
          setMessage({ type: 'error', text: error.message });
        }
      }
    }
    setChangingPass(false);
  };

  if (!userData) return null;

  return (
    <div className="dashboard-grid relative">
      <div className="space-y-6">
        {/* Profile Card */}
        <div className="card profile-header">
          <div className="avatar">
            {userData.type === 'creator' ? userData.fullName[0] : userData.companyName[0]}
          </div>
          
          {/* Name & Verification Badge */}
          <h3 style={{ fontWeight: 'bold', fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            {userData.type === 'creator' ? userData.fullName : userData.companyName}
            
            {/* VERIFIED BADGE */}
            {userData.verified && (
              <span title="Verified Creator">
                <CheckCircle size={20} fill="#3b82f6" color="white" />
              </span>
            )}

            {/* PENDING BADGE */}
            {!userData.verified && userData.verificationStatus === 'pending' && (
              <span title="Verification Pending Review">
                <Clock size={20} color="#eab308" />
              </span>
            )}
          </h3>

          <p style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase', margin: '0.5rem 0' }}>
            {userData.type} Account
          </p>
          
          {userData.type === 'creator' && userData.roles && (
            <div className="tag-container">
              {userData.roles.map(role => <span key={role} className="tag">{role}</span>)}
            </div>
          )}

          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-val">1.2k</div>
              <div className="stat-lbl">Rank</div>
            </div>
            <div className="stat-box">
              <div className="stat-val">89</div>
              <div className="stat-lbl">Score</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', border: '1px solid #fcd34d' }}>
          <div className="flex items-center gap-2 mb-2" style={{ color: '#b45309', fontWeight: 'bold' }}>
            <Award size={20} /> Premium
          </div>
          <p style={{ fontSize: '0.9rem', color: '#92400e', marginBottom: '1rem' }}>
            Unlock detailed analytics, verified badge, and brand deals.
          </p>
          <button className="btn w-full" style={{ background: '#fde68a', color: '#92400e' }}>Upgrade Plan</button>
        </div>

        <button 
          onClick={() => setShowPasswordModal(true)}
          className="btn w-full" 
          style={{ background: 'white', border: '1px solid #e5e7eb', color: '#374151' }}
        >
          <Lock size={16} /> Change Password
        </button>
      </div>

      <div>
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--primary)', margin: 0 }}>Weekly Leaderboard</h2>
              <p style={{ fontSize: '0.9rem', color: '#9ca3af', marginTop: '0.25rem' }}>AI-Driven Analysis • Updated 2m ago</p>
            </div>
          </div>
          
          {leaderboard.map((user, index) => (
            <div key={user.id} className="leaderboard-item">
              <div className={`rank ${index === 0 ? 'top' : ''}`}>#{index + 1}</div>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e5e7eb', margin: '0 1rem' }}></div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontWeight: 'bold', fontSize: '0.95rem', margin: 0 }}>{user.name}</h4>
                <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0 }}>{user.role}</p>
              </div>
              <div className="text-center">
                <div style={{ color: 'var(--success)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={14} /> {user.score}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Score</div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h2 className="mb-6" style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--primary)' }}>Achievement Feed</h2>
          
          <div className="flex gap-4 mb-6">
            <div style={{ padding: '0.5rem', background: '#f3e8ff', borderRadius: '50%', height: 'fit-content', color: '#9333ea' }}>
              <Trophy size={20} />
            </div>
            <div>
              <p style={{ fontSize: '0.95rem', margin: 0 }}><span style={{ fontWeight: 'bold' }}>Sarah Jenkins</span> reached 100k subs!</p>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '0.25rem 0 0 0' }}>2 hours ago</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div style={{ padding: '0.5rem', background: '#dbeafe', borderRadius: '50%', height: 'fit-content', color: '#2563eb' }}>
              <Briefcase size={20} />
            </div>
            <div>
              <p style={{ fontSize: '0.95rem', margin: 0 }}><span style={{ fontWeight: 'bold' }}>TechFlow</span> posted "Summer Gadget Review".</p>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '0.25rem 0 0 0' }}>5 hours ago</p>
              <button className="btn-link" style={{ fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '2px' }}>
                Apply Now <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', position: 'relative' }}>
            <button 
              onClick={() => setShowPasswordModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--primary)' }}>Change Password</h3>
            
            <form onSubmit={handleChangePassword}>
              <div className="input-group">
                <label className="input-label">New Password</label>
                <input className="form-input" type="password" required placeholder="Min 6 chars" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>

              {message.text && (
                <div style={{ 
                  marginBottom: '1rem', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem',
                  backgroundColor: message.type === 'error' ? '#fef2f2' : '#ecfdf5',
                  color: message.type === 'error' ? '#ef4444' : '#059669',
                  border: `1px solid ${message.type === 'error' ? '#fecaca' : '#a7f3d0'}`
                }}>
                  {message.text}
                </div>
              )}

              <button disabled={changingPass} className="btn btn-primary w-full">
                {changingPass ? <Loader2 className="animate-spin" /> : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}