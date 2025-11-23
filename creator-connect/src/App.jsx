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
import TrendingPage from './components/TrendingPage';
import TemplatesPage from './components/TemplatesPage';
import MyNewPage from './components/MyNewPage';
import LandingPage from './components/LandingPage';
import ChatBot from './components/ChatBot';

export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('landing'); 

  // --- GLOBAL FEED STATE (Lifted) ---
  const [feedPosts, setFeedPosts] = useState([
    { 
      id: 1, 
      author: "Sarah Jenkins", 
      avatar: "S",
      content: "Just hit 100k verified subscribers on YouTube! Thanks for the support everyone. 🚀", 
      time: "2 hours ago", 
      likes: 24, 
      comments: 5 
    },
    { 
      id: 2, 
      author: "TechFlow", 
      avatar: "T",
      content: "Excited to announce our summer gadget review series with @CreativeSoul.", 
      time: "1 day ago", 
      likes: 89, 
      comments: 12 
    }
  ]);

  // Function to add a post from ANY component
  const addPost = (newPost) => {
    setFeedPosts(prev => [newPost, ...prev]);
  };

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
        
        {!user && view !== 'landing' && (
          <div className="container-center">
            <div className="auth-container">
              {view === 'login' && <Login setView={setView} />}
              {view === 'signup-choice' && <SignupChoice setView={setView} />}
              {view === 'signup-creator' && <CreatorSignup setView={setView} />}
              {view === 'signup-brand' && <BrandSignup setView={setView} />}
            </div>
          </div>
        )}

        {!user && view === 'landing' && (
          <>
            <LandingPage setView={setView} />
            <section style={{ marginTop: '80px', paddingTop: '60px', borderTop: '1px solid #e2e8f0' }}>
              <ChatBot />
            </section>
          </>
        )}

        {user && userData && (
          <>
            {view === 'dashboard' && (
              <Dashboard 
                userData={userData} 
                setView={setView} 
                feedPosts={feedPosts} // Pass Global Feed
                addPost={addPost}     // Pass Add Function
              />
            )}
            {view === 'trending' && <TrendingPage setView={setView} />}
            
            {/* Pass userData and addPost to Templates for the "Remix" feature */}
            {view === 'templates' && (
              <TemplatesPage 
                setView={setView} 
                userData={userData} 
                addPost={addPost} 
              />
            )}
            
            {view === 'mynewpage' && <MyNewPage />}
          </>
        )}

      </main>

      <footer style={{ background: 'var(--dark)', color: 'white', padding: '10px 0', marginTop: 'auto', textAlign: 'center' }}>
        <div style={{fontWeight: 900, fontSize: '2rem', color: 'white', letterSpacing: '-1px'}}>Credible</div>
        <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginTop: '2px'}}>
          Building the professional identity layer for the creator economy.
        </div>
        <div style={{marginTop: '2px', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem'}}>
          &copy; 2024 Credible Technologies. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
// import React, { useState, useEffect } from 'react';
// import { onAuthStateChanged, signOut } from 'firebase/auth';
// import { doc, getDoc } from 'firebase/firestore';
// import { auth, db } from './config/firebase';
// import { Loader2 } from 'lucide-react';
// import './App.css'; 

// // Components
// import Navbar from './components/Navbar';
// import Login from './components/Login';
// import SignupChoice from './components/SignupChoice';
// import CreatorSignup from './components/CreatorSignup';
// import BrandSignup from './components/BrandSignup';
// import Dashboard from './components/Dashboard';
// import TrendingPage from './components/TrendingPage'; // New Import
// import MyNewPage from './components/MyNewPage';
// import LandingPage from './components/LandingPage';
// import ChatBot from './components/ChatBot';

// export default function App() {
//   const [user, setUser] = useState(null);
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [view, setView] = useState('landing'); 

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setUser(currentUser);
//       if (currentUser) {
//         try {
//           const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
//           if (userDoc.exists()) {
//             setUserData(userDoc.data());
//             setView('dashboard'); 
//           } else {
//             setUserData(null);
//             setView('signup-choice');
//           }
//         } catch (e) {
//           console.error(e);
//           setUserData(null);
//         }
//       } else {
//         setUserData(null);
//         setView('landing'); 
//       }
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   const handleLogout = async () => {
//     await signOut(auth);
//     setView('landing');
//   };

//   if (loading) {
//     return (
//       <div className="app-container">
//         <div className="spinner-container"><Loader2 className="animate-spin" size={48} color="var(--primary)" /></div>
//       </div>
//     );
//   }

//   return (
//     <div className="app-container">
//       <Navbar user={user} handleLogout={handleLogout} setView={setView} />
      
//       <main className="container">
        
//         {/* --- AUTH FLOW --- */}
//         {!user && view !== 'landing' && (
//           <div className="container-center">
//             <div className="auth-container">
//               {view === 'login' && <Login setView={setView} />}
//               {view === 'signup-choice' && <SignupChoice setView={setView} />}
//               {view === 'signup-creator' && <CreatorSignup setView={setView} />}
//               {view === 'signup-brand' && <BrandSignup setView={setView} />}
//             </div>
//           </div>
//         )}

//         {/* --- LANDING PAGE (Chatbot only here) --- */}
//         {!user && view === 'landing' && (
//           <>
//             <LandingPage setView={setView} />
//             <section style={{ marginTop: '80px', paddingTop: '60px', borderTop: '1px solid #e2e8f0' }}>
//               <ChatBot />
//             </section>
//           </>
//         )}

//         {/* --- LOGGED IN VIEWS --- */}
//         {user && userData && (
//           <>
//             {view === 'dashboard' && <Dashboard userData={userData} setView={setView} />}
//             {view === 'trending' && <TrendingPage setView={setView} />}
//             {view === 'mynewpage' && <MyNewPage />}
//           </>
//         )}

//       </main>

//       {/* FOOTER */}
//       <footer style={{ background: 'var(--dark)', color: 'white', padding: '60px 0', marginTop: 'auto', textAlign: 'center' }}>
//         <div style={{fontWeight: 900, fontSize: '2rem', color: 'white', letterSpacing: '-1px'}}>Credible</div>
//         <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginTop: '12px'}}>
//           Building the professional identity layer for the creator economy.
//         </div>
//         <div style={{marginTop: '40px', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem'}}>
//           &copy; 2024 Credible Technologies. All rights reserved.
//         </div>
//       </footer>
//     </div>
//   );
// }