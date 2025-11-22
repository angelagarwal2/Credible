import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { Loader2 } from 'lucide-react';

export default function BrandSignup({ setView }) {
  const [formData, setFormData] = useState({ companyName: '', website: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const uc = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      // Save to Firestore
      await setDoc(doc(db, 'users', uc.user.uid), {
        uid: uc.user.uid,
        type: 'brand',
        companyName: formData.companyName,
        website: formData.website,
        email: formData.email,
        joinedAt: new Date().toISOString()
      });
    } catch (err) { 
      setError(err.message); 
      setLoading(false); 
    }
  };

  return (
    <div className="card">
      <button onClick={() => setView('signup-choice')} className="btn-link mb-4" style={{fontSize: '0.9rem'}}>&larr; Back</button>
      <h2 className="mb-6" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>Brand Signup</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group"><label className="input-label">Company Name</label><input className="form-input" required value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} /></div>
        <div className="input-group"><label className="input-label">Website</label><input className="form-input" required value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} /></div>
        <div className="input-group"><label className="input-label">Work Email</label><input className="form-input" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
        <div className="input-group"><label className="input-label">Password</label><input className="form-input" type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} /></div>
        
        {error && <p style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>{error}</p>}
        <button disabled={loading} className="btn btn-primary w-full mt-4">{loading ? <Loader2 className="animate-spin"/> : 'Join as Brand'}</button>
      </form>
    </div>
  );
}