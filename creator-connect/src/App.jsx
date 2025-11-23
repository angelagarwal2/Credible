import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './config/firebase';
import { Loader2 } from 'lucide-react';
import './App.css'; 

// Components
import Navbar from './components/Navbar';
import Login from './components/Login';
import SignupChoice from './components/SignupChoice';
import CreatorSignup from './components/CreatorSignup';
import BrandSignup from './components/BrandSignup';
import Dashboard from './components/Dashboard';
import MyNewPage from './components/MyNewPage';
import LandingPage from './components/LandingPage';
import ChatBot from './components/ChatBot';

export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('landing'); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
            setView('dashboard'); 
          } else {
            setUserData(null);
            setView('signup-choice');
          }
        } catch (e) {
          console.error(e);
          setUserData(null);
        }
      } else {
        setUserData(null);
        setView('landing'); 
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setView('landing');
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="spinner-container"><Loader2 className="animate-spin" size={48} color="var(--primary)" /></div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar user={user} handleLogout={handleLogout} setView={setView} />
      
      <main className="container">
        {/* AUTH & DASHBOARD VIEWS */}
        {view !== 'landing' && (
          <div className={!user ? "container-center" : ""}>
            {!user ? (
              <div className="auth-container">
                {view === 'login' && <Login setView={setView} />}
                {view === 'signup-choice' && <SignupChoice setView={setView} />}
                {view === 'signup-creator' && <CreatorSignup setView={setView} />}
                {view === 'signup-brand' && <BrandSignup setView={setView} />}
              </div>
            ) : (
              <>
                {view === 'dashboard' && <Dashboard userData={userData} />}
                {view === 'mynewpage' && <MyNewPage />}
              </>
            )}
          </div>
        )}

        {/* LANDING PAGE CONTENT (Only show when view is 'landing') */}
        {view === 'landing' && <LandingPage setView={setView} />}

        {/* CHATBOT SECTION (Always visible at bottom) */}
        <section style={{ marginTop: '100px', paddingTop: '60px', borderTop: '1px solid #e5e7eb' }}>
          <ChatBot />
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{ background: 'var(--dark)', color: 'white', padding: '60px 0', marginTop: '80px', textAlign: 'center' }}>
        <div style={{fontWeight: 900, fontSize: '2rem', color: 'white', letterSpacing: '-1px'}}>Credible</div>
        <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginTop: '12px'}}>
          Building the professional identity layer for the creator economy.
        </div>
        <div style={{marginTop: '40px', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem'}}>
          &copy; 2024 Credible Technologies. All rights reserved.
        </div>
      </footer>
    </div>
  );
}