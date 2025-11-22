import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './config/firebase';
import { Loader2 } from 'lucide-react';
import './App.css'; 

// Import Components
import Navbar from './components/Navbar';
import Login from './components/Login';
import SignupChoice from './components/SignupChoice';
import CreatorSignup from './components/CreatorSignup';
import BrandSignup from './components/BrandSignup';
import Dashboard from './components/Dashboard';

export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('login'); 

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
          console.error("Error fetching profile:", e);
          setUserData(null);
        }
      } else {
        setUserData(null);
        setView('login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setView('login');
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="spinner-container">
          <Loader2 className="animate-spin" size={48} color="var(--primary)" />
          <p className="mt-4" style={{color: 'var(--text-muted)', fontFamily: 'Playfair Display', fontSize: '1.1rem'}}>
            Credible
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar user={user} handleLogout={handleLogout} />

      {/* CONDITIONAL CLASS:
        - If !user: Use "container-center" to dead-center the login/signup cards.
        - If user: Use "container" for standard dashboard layout.
      */}
      <div className={!user ? "container-center" : "container"}>
        {!user ? (
          <div className="auth-container">
            {view === 'login' && <Login setView={setView} />}
            {view === 'signup-choice' && <SignupChoice setView={setView} />}
            {view === 'signup-creator' && <CreatorSignup setView={setView} />}
            {view === 'signup-brand' && <BrandSignup setView={setView} />}
          </div>
        ) : (
          userData ? (
            <Dashboard userData={userData} />
          ) : (
            <div className="spinner-container">
               <Loader2 className="animate-spin" size={32} color="var(--primary)" />
            </div>
          )
        )}
      </div>
    </div>
  );
}