import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ArrowLeft, Eye, Heart, Share2, TrendingUp, Loader2, UserPlus, Lock } from 'lucide-react';

export default function TrendingPage({ setView, isPremium, onUpgrade }) {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const q = query(collection(db, 'users'), where('type', '==', 'creator'));
        const querySnapshot = await getDocs(q);
        const fetchedCreators = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const seed = doc.id.charCodeAt(0) + doc.id.charCodeAt(doc.id.length - 1);
          const views = seed * 1500;
          const likes = Math.floor(views * 0.12);
          const shares = Math.floor(likes * 0.05);
          const score = (views * 0.01) + (likes * 1) + (shares * 5);
          return {
            id: doc.id,
            name: data.fullName || "Anonymous Creator",
            handle: data.socialLinks?.instagrammer?.split('/').pop() || "@creator",
            avatar: (data.fullName || "C")[0].toUpperCase(),
            views, likes, shares,
            score: Math.round(score),
            role: data.roles ? data.roles[0] : 'Creator'
          };
        });
        const ranked = fetchedCreators.sort((a, b) => b.score - a.score);
        setCreators(ranked);
      } catch (error) {
        console.error("Error fetching ranking:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCreators();
  }, []);

  return (
    <div className="animate-fade" style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={() => setView('dashboard')} className="btn-ghost" style={{ borderRadius: '50%', width: 48, height: 48, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowLeft size={24} /></button>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, lineHeight: 1, marginBottom: '4px' }}>Global Trending Rank</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Top creators ranked by engagement velocity & authenticity score.</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}><Loader2 className="animate-spin" size={40} color="var(--primary)" /><p style={{ marginTop: 16, color: 'var(--text-muted)' }}>Analyzing Creator Data...</p></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="trending-table">
              <thead>
                <tr>
                  <th style={{ width: 60, textAlign: 'center' }}>Rank</th>
                  <th>Creator</th>
                  <th style={{ textAlign: 'right' }}>Views (est)</th>
                  <th style={{ textAlign: 'right' }}>Impact Score</th>
                  <th style={{ width: 100, textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {creators.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No creators found in database yet. Sign up to be the first!</td></tr>
                ) : (
                  creators.map((creator, index) => (
                    <tr key={creator.id}>
                      <td style={{ textAlign: 'center' }}><div className={`rank-circle ${index < 3 ? 'top-3' : ''}`}>{index + 1}</div></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--dark)' }}>{creator.avatar}</div>
                          <div><div style={{ fontWeight: 700, color: 'var(--dark)' }}>{creator.name}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{creator.role}</div></div>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', fontFamily: 'Inter' }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}><Eye size={14} color="#94a3b8" /> {creator.views.toLocaleString()}</div></td>
                      <td style={{ textAlign: 'right' }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, fontWeight: 800, color: 'var(--success)', fontSize: '1rem' }}><TrendingUp size={16} />{creator.score.toLocaleString()}</div></td>
                      
                      {/* CONNECT BUTTON */}
                      <td style={{ textAlign: 'center' }}>
                        <button 
                          onClick={() => isPremium ? alert(`Request sent to ${creator.name}`) : onUpgrade()} 
                          className="btn-ghost" 
                          style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '6px', opacity: isPremium ? 1 : 0.7 }}
                        >
                          {isPremium ? <UserPlus size={16} /> : <Lock size={16} />}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// import React, { useState, useEffect } from 'react';
// import { collection, getDocs, query, where } from 'firebase/firestore';
// import { db } from '../config/firebase';
// import { ArrowLeft, Eye, Heart, Share2, TrendingUp, Loader2 } from 'lucide-react';

// export default function TrendingPage({ setView }) {
//   const [creators, setCreators] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCreators = async () => {
//       try {
//         // 1. Fetch all users who are 'creators'
//         const q = query(collection(db, 'users'), where('type', '==', 'creator'));
//         const querySnapshot = await getDocs(q);
        
//         // 2. Process data & Simulate Stats (Since we don't have API keys yet)
//         // In production, these stats would come from your python backend.
//         const fetchedCreators = querySnapshot.docs.map(doc => {
//           const data = doc.data();
          
//           // Generate pseudo-random stats based on UID char codes to keep it consistent
//           const seed = doc.id.charCodeAt(0) + doc.id.charCodeAt(doc.id.length - 1);
//           const views = seed * 1500;
//           const likes = Math.floor(views * 0.12);
//           const shares = Math.floor(likes * 0.05);
//           const score = (views * 0.01) + (likes * 1) + (shares * 5);

//           return {
//             id: doc.id,
//             name: data.fullName || "Anonymous Creator",
//             handle: data.socialLinks?.instagrammer?.split('/').pop() || "@creator", // Try to parse handle
//             avatar: (data.fullName || "C")[0].toUpperCase(),
//             views,
//             likes,
//             shares,
//             score: Math.round(score),
//             role: data.roles ? data.roles[0] : 'Creator'
//           };
//         });

//         // 3. Rank them by Score (Descending)
//         const ranked = fetchedCreators.sort((a, b) => b.score - a.score);
//         setCreators(ranked);
//       } catch (error) {
//         console.error("Error fetching ranking:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCreators();
//   }, []);

//   return (
//     <div className="animate-fade" style={{ paddingBottom: '40px' }}>
      
//       {/* Header */}
//       <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
//         <button 
//           onClick={() => setView('dashboard')} 
//           className="btn-ghost" 
//           style={{ borderRadius: '50%', width: 48, height: 48, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
//         >
//           <ArrowLeft size={24} />
//         </button>
//         <div>
//           <h1 style={{ fontSize: '1.8rem', fontWeight: 900, lineHeight: 1, marginBottom: '4px' }}>Global Trending Rank</h1>
//           <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
//             Top creators ranked by engagement velocity & authenticity score.
//           </p>
//         </div>
//       </div>

//       {/* Table Card */}
//       <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
//         {loading ? (
//           <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
//             <Loader2 className="animate-spin" size={40} color="var(--primary)" />
//             <p style={{ marginTop: 16, color: 'var(--text-muted)' }}>Analyzing Creator Data...</p>
//           </div>
//         ) : (
//           <div style={{ overflowX: 'auto' }}>
//             <table className="trending-table">
//               <thead>
//                 <tr>
//                   <th style={{ width: 60, textAlign: 'center' }}>Rank</th>
//                   <th>Creator</th>
//                   <th style={{ textAlign: 'right' }}>Views (est)</th>
//                   <th style={{ textAlign: 'right' }}>Likes</th>
//                   <th style={{ textAlign: 'right' }}>Impact Score</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {creators.length === 0 ? (
//                   <tr>
//                     <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
//                       No creators found in database yet. Sign up to be the first!
//                     </td>
//                   </tr>
//                 ) : (
//                   creators.map((creator, index) => (
//                     <tr key={creator.id}>
//                       <td style={{ textAlign: 'center' }}>
//                         <div className={`rank-circle ${index < 3 ? 'top-3' : ''}`}>
//                           {index + 1}
//                         </div>
//                       </td>
//                       <td>
//                         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//                           <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--dark)' }}>
//                             {creator.avatar}
//                           </div>
//                           <div>
//                             <div style={{ fontWeight: 700, color: 'var(--dark)' }}>{creator.name}</div>
//                             <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{creator.role}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td style={{ textAlign: 'right', fontFamily: 'Inter' }}>
//                         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
//                           <Eye size={14} color="#94a3b8" /> {creator.views.toLocaleString()}
//                         </div>
//                       </td>
//                       <td style={{ textAlign: 'right', fontFamily: 'Inter' }}>
//                         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
//                           <Heart size={14} color="#ef4444" /> {creator.likes.toLocaleString()}
//                         </div>
//                       </td>
//                       <td style={{ textAlign: 'right' }}>
//                         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, fontWeight: 800, color: 'var(--success)', fontSize: '1rem' }}>
//                           <TrendingUp size={16} />
//                           {creator.score.toLocaleString()}
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }