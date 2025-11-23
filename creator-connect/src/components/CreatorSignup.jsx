import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { Youtube, Instagram, Mic, Video, CheckCircle, Loader2, Copy, ShieldCheck, Clock } from 'lucide-react';

export default function CreatorSignup({ setView }) {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', selectedRoles: [], socialLinks: {} });
  const [verificationData, setVerificationData] = useState({}); 
  const [verificationStatus, setVerificationStatus] = useState({}); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = [
    { id: 'youtuber', label: 'YouTuber', icon: <Youtube size={18} /> },
    { id: 'instagrammer', label: 'Instagrammer', icon: <Instagram size={18} /> },
    { id: 'tiktoker', label: 'TikToker', icon: <Video size={18} /> },
    { id: 'podcaster', label: 'Podcaster', icon: <Mic size={18} /> },
  ];

  const toggleRole = (roleId) => {
    setFormData(prev => {
      const isSelected = prev.selectedRoles.includes(roleId);
      const newRoles = isSelected ? prev.selectedRoles.filter(r => r !== roleId) : [...prev.selectedRoles, roleId];
      const newLinks = { ...prev.socialLinks };
      if (isSelected) delete newLinks[roleId];
      return { ...prev, selectedRoles: newRoles, socialLinks: newLinks };
    });
  };

  const handleLinkChange = (roleId, value) => {
    setFormData(p => ({...p, socialLinks: {...p.socialLinks, [roleId]: value}}));
    if (verificationStatus[roleId] === 'pending') setVerificationStatus(p => ({...p, [roleId]: 'idle'}));
  };

  const startVerification = (roleId) => {
    const uniqueCode = `CR-${Math.floor(1000 + Math.random() * 9000)}`;
    setVerificationData(prev => ({ ...prev, [roleId]: uniqueCode }));
    setVerificationStatus(prev => ({ ...prev, [roleId]: 'idle' }));
  };

  const submitForReview = (roleId) => {
    setVerificationStatus(prev => ({ ...prev, [roleId]: 'checking' }));
    setTimeout(() => {
      setVerificationStatus(prev => ({ ...prev, [roleId]: 'pending' }));
    }, 1500);
  };

  const copyToClipboard = (text) => navigator.clipboard.writeText(text);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.selectedRoles.length === 0) { setError("Please select at least one role."); return; }
    const pendingRoles = Object.keys(verificationStatus).filter(key => verificationStatus[key] === 'pending');
    setLoading(true);
    try {
      const uc = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await setDoc(doc(db, 'users', uc.user.uid), {
        uid: uc.user.uid,
        type: 'creator',
        fullName: formData.fullName,
        email: formData.email,
        roles: formData.selectedRoles,
        socialLinks: formData.socialLinks,
        verified: false, 
        verificationStatus: pendingRoles.length > 0 ? 'pending' : 'unverified',
        weeklyScore: 0,
        joinedAt: new Date().toISOString()
      });
    } catch (err) { setError(err.message); setLoading(false); }
  };

  return (
    <div className="card">
      <button onClick={() => setView('signup-choice')} className="btn-link mb-4">&larr; Back</button>
      <h2 className="mb-6" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>Creator Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group"><input className="form-input" placeholder="Full Name" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} /></div>
        <div className="input-group"><input className="form-input" type="email" placeholder="Email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
        <div className="input-group"><input className="form-input" type="password" placeholder="Password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} /></div>
        <div className="mb-4">
          <label className="input-label">Select Roles:</label>
          <div className="role-grid">
            {roles.map(role => (
              <div key={role.id} onClick={() => toggleRole(role.id)} className={`role-btn ${formData.selectedRoles.includes(role.id) ? 'selected' : ''}`}>
                {role.icon}<span>{role.label}</span>{formData.selectedRoles.includes(role.id) && <CheckCircle size={16} style={{ marginLeft: 'auto' }} />}
              </div>
            ))}
          </div>
        </div>
        {formData.selectedRoles.length > 0 && (
          <div className="mb-6" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
             <label className="input-label" style={{marginBottom: '1rem'}}>Verification</label>
             {formData.selectedRoles.map(roleId => {
               const role = roles.find(r => r.id === roleId);
               const status = verificationStatus[roleId];
               const currentCode = verificationData[roleId];
               const isPending = status === 'pending';
               return (
                 <div key={roleId} className="mb-6 last:mb-0">
                   <div className="flex items-center gap-2 mb-2">
                     <div style={{ width: '30px', display: 'flex', justifyContent: 'center', color: 'var(--primary)' }}>{role.icon}</div>
                     <input className="form-input" placeholder={`Paste your ${role.label} URL here`} style={{ padding: '0.6rem', fontSize: '0.9rem', borderColor: isPending ? '#eab308' : '' }} required value={formData.socialLinks[roleId] || ''} onChange={(e) => handleLinkChange(roleId, e.target.value)} disabled={isPending} />
                     {isPending && <Clock size={20} style={{ color: '#eab308' }} />}
                   </div>
                   {formData.socialLinks[roleId] && (
                     <div style={{ marginLeft: '38px', background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '0.85rem' }}>
                        {!currentCode && !isPending && (
                           <button type="button" onClick={() => startVerification(roleId)} className="btn-link" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}><ShieldCheck size={16} /> Verify ownership</button>
                        )}
                        {currentCode && !isPending && (
                          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <p style={{ marginBottom: '0.5rem', color: '#64748b' }}>Paste this code into your <strong>{role.label} Bio</strong>:</p>
                            <div className="flex items-center gap-2 mb-3">
                              <code style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', color: 'var(--primary)', border: '1px solid #cbd5e1' }}>{currentCode}</code>
                              <button type="button" onClick={() => copyToClipboard(currentCode)} className="btn-ghost" style={{ padding: '4px 8px', fontSize: '0.75rem' }}><Copy size={14} /> Copy</button>
                            </div>
                            <button type="button" onClick={() => submitForReview(roleId)} className="btn" disabled={status === 'checking'} style={{ background: 'var(--primary)', color: 'white', padding: '0.4rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>{status === 'checking' ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}{status === 'checking' ? 'Submitting...' : 'I have pasted it, Submit'}</button>
                          </div>
                        )}
                        {isPending && <div className="flex items-start gap-2 text-amber-700 bg-amber-50 p-3 rounded border border-amber-100"><Clock size={16} className="mt-0.5 shrink-0" color="#b45309" /><div><p style={{fontWeight: '600', color: '#b45309', margin: 0}}>Verification Pending</p></div></div>}
                     </div>
                   )}
                 </div>
               )
             })}
          </div>
        )}
        {error && <p style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>{error}</p>}
        <button disabled={loading} className="btn btn-primary w-full mt-4">{loading ? <Loader2 className="animate-spin"/> : 'Complete Signup'}</button>
      </form>
    </div>
  );
}