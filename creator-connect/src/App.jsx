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
import BrandDashboard from './components/BrandDashboard'; // New
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
  const [isPremium, setIsPremium] = useState(false);

  // --- GLOBAL JOBS STATE ---
  const [jobs, setJobs] = useState([
    { 
      id: 1, 
      brand: "Nike", 
      logo: "N",
      title: "Summer Fitness Campaign", 
      budget: "$1000 - $2000", 
      description: "Looking for fitness creators to review our new running shoes.",
      pastHiring: [{ id: 1, creator: "FitFam", campaign: "Winter Run", date: "Dec 2023" }]
    }
  ]);

  const addJob = (job) => setJobs([job, ...jobs]);

  // --- GLOBAL FEED STATE ---
  const [feedPosts, setFeedPosts] = useState([
    { 
      id: 1, author: "Sarah Jenkins", avatar: "S",
      content: "Just hit 100k verified subscribers on YouTube! Thanks for the support everyone. 🚀", 
      time: "2 hours ago", likes: 24, comments: 5, likedByMe: false
    }
  ]);

  const addPost = (newPost) => setFeedPosts(prev => [newPost, ...prev]);

  // Interaction Handlers
  const handleLike = (postId) => {
    setFeedPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likedByMe ? p.likes-1 : p.likes+1, likedByMe: !p.likedByMe } : p));
  };
  const handleComment = (postId) => {
    setFeedPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
  };
  const handleUpgrade = () => { setIsPremium(true); alert("Payment Successful! Welcome to Premium."); };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            if (data.isPremium) setIsPremium(true);
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
    setIsPremium(false); 
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
            {/* ROUTING: Check user type to show correct dashboard */}
            {view === 'dashboard' && (
              userData.type === 'brand' ? (
                <BrandDashboard 
                  userData={userData} 
                  jobs={jobs} 
                  addJob={addJob} 
                />
              ) : (
                <Dashboard 
                  userData={userData} 
                  setView={setView} 
                  feedPosts={feedPosts} 
                  addPost={addPost}
                  handleLike={handleLike}
                  handleComment={handleComment}
                  isPremium={isPremium}       
                  onUpgrade={handleUpgrade}
                  jobs={jobs} // Pass jobs to creator
                />
              )
            )}
            {view === 'trending' && (
              <TrendingPage 
                setView={setView} 
                isPremium={isPremium}       
                onUpgrade={() => { setView('dashboard'); setTimeout(() => alert("Please click 'Upgrade Plan' on your dashboard."), 100); }} 
              />
            )}
            {view === 'templates' && (
              <TemplatesPage 
                setView={setView} 
                userData={userData} 
                addPost={addPost} 
                isPremium={isPremium}       
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
// import TrendingPage from './components/TrendingPage';
// import TemplatesPage from './components/TemplatesPage';
// import MyNewPage from './components/MyNewPage';
// import LandingPage from './components/LandingPage';
// import ChatBot from './components/ChatBot';

// export default function App() {
//   const [user, setUser] = useState(null);
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [view, setView] = useState('landing'); 
  
//   // Subscription State
//   const [isPremium, setIsPremium] = useState(false);

//   // --- GLOBAL FEED STATE ---
//   const [feedPosts, setFeedPosts] = useState([
//     { 
//       id: 1, 
//       author: "Sarah Jenkins", 
//       avatar: "S",
//       content: "Just hit 100k verified subscribers on YouTube! Thanks for the support everyone. 🚀", 
//       time: "2 hours ago", 
//       likes: 24, 
//       comments: 5,
//       likedByMe: false
//     },
//     { 
//       id: 2, 
//       author: "TechFlow", 
//       avatar: "T",
//       content: "Excited to announce our summer gadget review series with @CreativeSoul.", 
//       time: "1 day ago", 
//       likes: 89, 
//       comments: 12,
//       likedByMe: false
//     }
//   ]);

//   const addPost = (newPost) => {
//     setFeedPosts(prev => [newPost, ...prev]);
//   };

//   // --- NEW: INTERACTION LOGIC ---
//   const handleLike = (postId) => {
//     setFeedPosts(prev => prev.map(post => {
//       if (post.id === postId) {
//         // Toggle like logic
//         const isLiked = post.likedByMe;
//         return { 
//           ...post, 
//           likes: isLiked ? post.likes - 1 : post.likes + 1,
//           likedByMe: !isLiked
//         };
//       }
//       return post;
//     }));
//   };

//   const handleComment = (postId) => {
//     setFeedPosts(prev => prev.map(post => {
//       if (post.id === postId) {
//         return { ...post, comments: post.comments + 1 };
//       }
//       return post;
//     }));
//   };

//   const handleUpgrade = () => {
//     setIsPremium(true);
//     alert("Payment Successful! Welcome to Premium.");
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setUser(currentUser);
//       if (currentUser) {
//         try {
//           const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
//           if (userDoc.exists()) {
//             const data = userDoc.data();
//             setUserData(data);
//             if (data.isPremium) setIsPremium(true);
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
//     setIsPremium(false); 
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

//         {!user && view === 'landing' && (
//           <>
//             <LandingPage setView={setView} />
//             <section style={{ marginTop: '80px', paddingTop: '60px', borderTop: '1px solid #e2e8f0' }}>
//               <ChatBot />
//             </section>
//           </>
//         )}

//         {user && userData && (
//           <>
//             {view === 'dashboard' && (
//               <Dashboard 
//                 userData={userData} 
//                 setView={setView} 
//                 feedPosts={feedPosts} 
//                 addPost={addPost}
//                 handleLike={handleLike}       // Pass Like Handler
//                 handleComment={handleComment} // Pass Comment Handler
//                 isPremium={isPremium}       
//                 onUpgrade={handleUpgrade}   
//               />
//             )}
//             {view === 'trending' && (
//               <TrendingPage 
//                 setView={setView} 
//                 isPremium={isPremium}       
//                 onUpgrade={() => { setView('dashboard'); setTimeout(() => alert("Please click 'Upgrade Plan' on your dashboard."), 100); }} 
//               />
//             )}
//             {view === 'templates' && (
//               <TemplatesPage 
//                 setView={setView} 
//                 userData={userData} 
//                 addPost={addPost} 
//                 isPremium={isPremium}       
//               />
//             )}
//             {view === 'mynewpage' && <MyNewPage />}
//           </>
//         )}

//       </main>

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
// }// import React, { useState, useEffect } from 'react';
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
// import TrendingPage from './components/TrendingPage';
// import TemplatesPage from './components/TemplatesPage';
// import MyNewPage from './components/MyNewPage';
// import LandingPage from './components/LandingPage';
// import ChatBot from './components/ChatBot';

// export default function App() {
//   const [user, setUser] = useState(null);
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [view, setView] = useState('landing'); 
  
//   // --- NEW: SUBSCRIPTION STATE ---
//   // In a real app, this would come from userData.isPremium in Firebase
//   const [isPremium, setIsPremium] = useState(false);

//   // --- GLOBAL FEED STATE ---
//   const [feedPosts, setFeedPosts] = useState([
//     { 
//       id: 1, 
//       author: "Sarah Jenkins", 
//       avatar: "S",
//       content: "Just hit 100k verified subscribers on YouTube! Thanks for the support everyone. 🚀", 
//       time: "2 hours ago", 
//       likes: 24, 
//       comments: 5 
//     },
//     { 
//       id: 2, 
//       author: "TechFlow", 
//       avatar: "T",
//       content: "Excited to announce our summer gadget review series with @CreativeSoul.", 
//       time: "1 day ago", 
//       likes: 89, 
//       comments: 12 
//     }
//   ]);

//   const addPost = (newPost) => {
//     setFeedPosts(prev => [newPost, ...prev]);
//   };

//   // Function to handle upgrade (Simulates Payment Success)
//   const handleUpgrade = () => {
//     setIsPremium(true);
//     // In a real app, you would also update the Firestore document here
//     alert("Payment Successful! Welcome to Premium.");
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setUser(currentUser);
//       if (currentUser) {
//         try {
//           const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
//           if (userDoc.exists()) {
//             const data = userDoc.data();
//             setUserData(data);
//             // Sync premium status from DB if it exists, otherwise default to false
//             if (data.isPremium) setIsPremium(true);
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
//     setIsPremium(false); // Reset state on logout
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

//         {!user && view === 'landing' && (
//           <>
//             <LandingPage setView={setView} />
//             <section style={{ marginTop: '80px', paddingTop: '60px', borderTop: '1px solid #e2e8f0' }}>
//               <ChatBot />
//             </section>
//           </>
//         )}

//         {user && userData && (
//           <>
//             {view === 'dashboard' && (
//               <Dashboard 
//                 userData={userData} 
//                 setView={setView} 
//                 feedPosts={feedPosts} 
//                 addPost={addPost}
//                 isPremium={isPremium}       // Pass Premium State
//                 onUpgrade={handleUpgrade}   // Pass Upgrade Handler
//               />
//             )}
//             {view === 'trending' && (
//               <TrendingPage 
//                 setView={setView} 
//                 isPremium={isPremium}       // Pass Premium State
//                 onUpgrade={() => { setView('dashboard'); setTimeout(() => alert("Please click 'Upgrade Plan' on your dashboard."), 100); }} 
//               />
//             )}
//             {view === 'templates' && (
//               <TemplatesPage 
//                 setView={setView} 
//                 userData={userData} 
//                 addPost={addPost} 
//                 isPremium={isPremium}       // Pass Premium State
//               />
//             )}
//             {view === 'mynewpage' && <MyNewPage />}
//           </>
//         )}

//       </main>

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
// import TrendingPage from './components/TrendingPage';
// import TemplatesPage from './components/TemplatesPage';
// import MyNewPage from './components/MyNewPage';
// import LandingPage from './components/LandingPage';
// import ChatBot from './components/ChatBot';

// export default function App() {
//   const [user, setUser] = useState(null);
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [view, setView] = useState('landing'); 

//   // --- GLOBAL FEED STATE (Lifted) ---
//   const [feedPosts, setFeedPosts] = useState([
//     { 
//       id: 1, 
//       author: "Sarah Jenkins", 
//       avatar: "S",
//       content: "Just hit 100k verified subscribers on YouTube! Thanks for the support everyone. 🚀", 
//       time: "2 hours ago", 
//       likes: 24, 
//       comments: 5 
//     },
//     { 
//       id: 2, 
//       author: "TechFlow", 
//       avatar: "T",
//       content: "Excited to announce our summer gadget review series with @CreativeSoul.", 
//       time: "1 day ago", 
//       likes: 89, 
//       comments: 12 
//     }
//   ]);

//   // Function to add a post from ANY component
//   const addPost = (newPost) => {
//     setFeedPosts(prev => [newPost, ...prev]);
//   };

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

//         {!user && view === 'landing' && (
//           <>
//             <LandingPage setView={setView} />
//             <section style={{ marginTop: '80px', paddingTop: '60px', borderTop: '1px solid #e2e8f0' }}>
//               <ChatBot />
//             </section>
//           </>
//         )}

//         {user && userData && (
//           <>
//             {view === 'dashboard' && (
//               <Dashboard 
//                 userData={userData} 
//                 setView={setView} 
//                 feedPosts={feedPosts} // Pass Global Feed
//                 addPost={addPost}     // Pass Add Function
//               />
//             )}
//             {view === 'trending' && <TrendingPage setView={setView} />}
            
//             {/* Pass userData and addPost to Templates for the "Remix" feature */}
//             {view === 'templates' && (
//               <TemplatesPage 
//                 setView={setView} 
//                 userData={userData} 
//                 addPost={addPost} 
//               />
//             )}
            
//             {view === 'mynewpage' && <MyNewPage />}
//           </>
//         )}

//       </main>

//       <footer style={{ background: 'var(--dark)', color: 'white', padding: '10px 0', marginTop: 'auto', textAlign: 'center' }}>
//         <div style={{fontWeight: 900, fontSize: '2rem', color: 'white', letterSpacing: '-1px'}}>Credible</div>
//         <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginTop: '2px'}}>
//           Building the professional identity layer for the creator economy.
//         </div>
//         <div style={{marginTop: '2px', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem'}}>
//           &copy; 2024 Credible Technologies. All rights reserved.
//         </div>
//       </footer>
//     </div>
//   );
// }
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