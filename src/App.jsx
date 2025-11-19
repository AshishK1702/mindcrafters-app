import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Users, BookOpen, Code, Trophy, LogOut, 
  LayoutDashboard, Plus, Play, CheckCircle, 
  Search, Menu, X, ChevronDown, ChevronRight, ChevronLeft,
  Github, Mail, Lock, Video, FileText,
  BarChart, Award, Trash2, Edit, Save, Star,
  Terminal, Settings, User, Zap, Globe, Coffee,
  ArrowRight, Monitor, Layers, ShoppingCart, CreditCard, Download, Smartphone, Infinity,
  Briefcase, Check, Laptop, Twitter, Linkedin, Facebook, AlertTriangle, Calendar,
  MessageSquare, Send, Bot, Printer, Share2, BadgeCheck
} from 'lucide-react';
import { 
  initializeApp 
} from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  signInAnonymously,
  signInWithCustomToken
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy, 
  setDoc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  arrayUnion
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';

// --- FIREBASE INITIALIZATION ---
const firebaseConfig = {
  apiKey: "AIzaSyDdXixOANBcFY-oexLJT1wzAsMSkCf7p5w",
  authDomain: "mindcrafters-app.firebaseapp.com",
  projectId: "mindcrafters-app",
  storageBucket: "mindcrafters-app.firebasestorage.app",
  messagingSenderId: "1067604346696",
  appId: "1:1067604346696:web:4eceac80c1865dd590957d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// --- DATA PATH HELPERS ---
const appId = typeof __app_id !== 'undefined' ? __app_id : 'mindcrafters-default';

const getCollectionRef = (collectionName) => {
  return collection(db, 'artifacts', appId, 'public', 'data', collectionName);
};

const getDocumentRef = (collectionName, docId) => {
  return doc(db, 'artifacts', appId, 'public', 'data', collectionName, docId);
};

// --- MOCK DATA ---
const MOCK_COURSES = [
  {
      id: 'mock-1',
      title: "The Complete React Full-Stack Guide",
      description: "Master React, Node.js, Express, and MongoDB. Build a complete e-commerce platform from scratch with payment integration.",
      category: "Development",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 49.99,
      rating: 4.8,
      reviews: 1240,
      enrolledCount: 5400
  },
  {
      id: 'mock-2',
      title: "Python for Data Science & AI (Free)",
      description: "From zero to hero in Python. Learn Pandas, NumPy, Matplotlib, and Scikit-Learn to analyze data and build ML models. Completely Free.",
      category: "Data Science",
      thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 0, // Free Course
      rating: 4.9,
      reviews: 890,
      enrolledCount: 3200
  },
  {
      id: 'mock-3',
      title: "UI/UX Design Masterclass 2025",
      description: "Design beautiful interfaces with Figma. Learn user research, wireframing, prototyping, and handoff to developers.",
      category: "Design",
      thumbnail: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 44.99,
      rating: 4.7,
      reviews: 650,
      enrolledCount: 1800
  },
  {
      id: 'mock-4',
      title: "Flutter & Dart: Build IOS & Android Apps (Free)",
      description: "Create native mobile applications using a single codebase. Hot reload, beautiful widgets, and seamless performance. Start for free.",
      category: "Mobile",
      thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 0, // Free Course
      rating: 4.6,
      reviews: 420,
      enrolledCount: 1100
  },
  {
      id: 'mock-5',
      title: "Advanced JavaScript Concepts",
      description: "Deep dive into closures, prototypes, event loop, and async programming. Write clean, efficient, and scalable JS code.",
      category: "Development",
      thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 34.99,
      rating: 4.8,
      reviews: 2100,
      enrolledCount: 6700
  },
  {
      id: 'mock-6',
      title: "Cybersecurity: Zero to Hero",
      description: "Learn ethical hacking, network security, and how to protect systems from cyber threats. Hands-on labs included.",
      category: "Security",
      thumbnail: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 69.99,
      rating: 4.9,
      reviews: 340,
      enrolledCount: 950
  }
];

const MOCK_CATEGORIES = ["Development", "Data Science", "Design", "Mobile", "Security", "Business"];

const MOCK_BLOGS = [
    { 
        id: 1, 
        title: "The Future of React Server Components", 
        category: "Tech", 
        readTime: "5 min", 
        author: "Sarah Jenkins",
        date: "Nov 15, 2024",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        content: [
            "React Server Components (RSC) represent a paradigm shift...",
            "Traditionally, React apps were client-heavy..."
        ]
    },
    { 
        id: 2, 
        title: "Mastering CSS Grid Layouts", 
        category: "Design", 
        readTime: "8 min", 
        author: "Mike Ross",
        date: "Oct 22, 2024",
        image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        content: ["CSS Grid has revolutionized web layout design..."]
    },
    { 
        id: 3, 
        title: "Why Python Won the AI Wars", 
        category: "Data Science", 
        readTime: "6 min", 
        author: "Dr. Elena Vo",
        date: "Sep 10, 2024",
        image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        content: ["Python won because of its simplicity and its ecosystem..."]
    }
];

// --- THEME CONSTANTS ---
const THEME = {
  primary: 'bg-[#1A8F3A]',
  primaryHover: 'hover:bg-[#14702D]',
  leaf: 'text-[#3CB371]',
  forest: 'text-[#064E3B]',
  mint: 'bg-[#D8FFE0]',
  bg: 'bg-[#FBFFF9]',
  glass: 'bg-white/90 backdrop-blur-xl border border-white/40 shadow-xl',
  input: 'bg-white border border-gray-200 focus:ring-2 focus:ring-[#1A8F3A] focus:outline-none rounded-xl px-4 py-3 w-full transition-all shadow-sm',
  card: 'bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300'
};

// --- UTILITY COMPONENTS ---
const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, ...props }) => {
  const baseStyle = "px-6 py-3 rounded-xl font-bold transition-all duration-200 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";
  const variants = {
    primary: `bg-gradient-to-r from-[#1A8F3A] to-[#14702D] text-white shadow-green-900/20`,
    secondary: "bg-white text-[#1A8F3A] border-2 border-[#1A8F3A] hover:bg-green-50",
    ghost: "text-gray-600 hover:text-[#1A8F3A] hover:bg-green-50/50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 shadow-sm border border-red-200",
    dark: "bg-[#064E3B] text-white hover:bg-[#0A5C46]",
    accent: "bg-purple-600 text-white hover:bg-purple-700 shadow-purple-900/20",
    white: "bg-white text-[#064E3B] hover:bg-gray-100 shadow-lg"
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Input = ({ label, ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 tracking-wide">{label}</label>}
    <input className={THEME.input} {...props} />
  </div>
);

const Badge = ({ children, color = 'green', className = '' }) => {
    const colors = {
        green: 'bg-green-100 text-green-800',
        blue: 'bg-blue-100 text-blue-800',
        purple: 'bg-purple-100 text-purple-800',
        orange: 'bg-orange-100 text-orange-800',
        red: 'bg-red-100 text-red-800'
    };
    return <span className={`${colors[color] || colors.green} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${className}`}>{children}</span>
};

const Loader = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-[#FBFFF9]">
    <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-[#1A8F3A]"></div>
    <p className="mt-4 text-[#064E3B] font-bold animate-pulse">Loading MindCrafters...</p>
  </div>
);

// --- MAIN COMPONENT ---
export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('home'); 
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [activeBlogId, setActiveBlogId] = useState(null);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const [courses, setCourses] = useState(MOCK_COURSES);
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [blogs, setBlogs] = useState(MOCK_BLOGS);

  // --- EFFECTS ---

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && currentUser.isAnonymous) {
          await signOut(auth);
          setUser(null);
          setUserData(null);
          setLoading(false);
          return;
      }
      setUser(currentUser);
      if (currentUser) {
        const userRef = getDocumentRef('users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          const usersSnap = await getDocs(getCollectionRef('users'));
          const isFirstUser = usersSnap.empty;
          let displayName = 'User';
          if (currentUser.displayName) {
            displayName = currentUser.displayName;
          } else if (currentUser.email) {
            displayName = currentUser.email.split('@')[0];
          }
          const newUserData = {
            email: currentUser.email,
            displayName: displayName,
            role: isFirstUser ? 'admin' : 'student',
            createdAt: serverTimestamp(),
            enrolledCourses: [],
            certificates: [],
            progress: {} 
          };
          await setDoc(userRef, newUserData);
          setUserData(newUserData);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(getCollectionRef('courses')); 
    const unsubscribeData = onSnapshot(q, (snapshot) => {
      const coursesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (coursesList.length > 0) {
          setCourses(coursesList);
          const cats = [...new Set(coursesList.map(c => c.category))];
          setCategories(cats.length > 0 ? cats : MOCK_CATEGORIES);
      }
    }, (error) => {
      console.log("Using mock data (Auth required for real-time updates)");
    });
    return () => unsubscribeData();
  }, []); 

  const navigateTo = (newView, params = {}) => {
    setView(newView);
    if (params.courseId) setActiveCourseId(params.courseId);
    if (params.blogId) setActiveBlogId(params.blogId);
    setIsMenuOpen(false);
    setShowCategoryMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateProfile = async (updates) => {
      if (!user) return;
      try {
          if (updates.displayName) {
              await updateProfile(user, { displayName: updates.displayName });
          }
          const userRef = getDocumentRef('users', user.uid);
          await updateDoc(userRef, updates);
          setUserData(prev => ({ ...prev, ...updates }));
          setUser({...user, ...updates});
      } catch (error) {
          console.error("Profile update failed:", error);
          throw error;
      }
  };

  const handleAuth = async (e, mode) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const fullName = e.target.fullName ? e.target.fullName.value : '';
    const interest = e.target.interest ? e.target.interest.value : '';

    try {
        if (mode === 'login') {
            await signInWithEmailAndPassword(auth, email, password);
        } else if (mode === 'signup') {
            if (password.length < 6) throw new Error("Password must be at least 6 characters.");
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newUser = userCredential.user;
            const usersSnap = await getDocs(getCollectionRef('users'));
            const isFirstUser = usersSnap.empty;
            await updateProfile(newUser, { displayName: fullName || email.split('@')[0] });
            await setDoc(getDocumentRef('users', newUser.uid), {
                email: newUser.email,
                displayName: fullName || email.split('@')[0],
                interest: interest || 'General',
                role: isFirstUser ? 'admin' : 'student',
                createdAt: serverTimestamp(),
                enrolledCourses: [],
                certificates: [],
                progress: {} 
            });
        } else if (mode === 'reset') {
            await sendPasswordResetEmail(auth, email);
            alert('Reset link sent!');
            return;
        }
        setShowAuthModal(false);
    } catch (err) { console.error(err); alert(err.message); }
  };

  const handleGoogleLogin = async () => {
    try { await signInWithPopup(auth, new GoogleAuthProvider()); setShowAuthModal(false); } 
    catch (err) { console.error(err.message); }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setView('home');
  };

  const groupedCourses = useMemo(() => {
    const groups = {};
    courses.forEach(c => {
      const cat = c.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      if (groups[cat].length < 4) groups[cat].push(c);
    });
    return groups;
  }, [courses]);

  if (loading) return <Loader />;

  return (
    <div className={`min-h-screen ${THEME.bg} font-sans text-gray-800 selection:bg-green-200 selection:text-green-900`}>
      {/* HEADER */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${THEME.glass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center cursor-pointer group" onClick={() => navigateTo('home')}>
              <div className="w-10 h-10 bg-gradient-to-br from-[#1A8F3A] to-[#064E3B] rounded-xl flex items-center justify-center mr-3 shadow-lg group-hover:scale-110 transition-transform">
                <Zap className="text-white" size={20} fill="currentColor"/>
              </div>
              <div className="flex flex-col">
                  <span className={`text-xl font-black tracking-tight ${THEME.forest}`}>MINDCRAFTERS</span>
                  <span className="text-[10px] font-bold text-[#3CB371] tracking-[0.2em] uppercase">Elevate Future</span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => navigateTo('home')} className={`text-sm font-bold hover:text-[#1A8F3A] transition-colors ${view === 'home' ? 'text-[#1A8F3A]' : 'text-gray-600'}`}>Home</button>
              <div className="relative group h-20 flex items-center" onMouseEnter={() => setShowCategoryMenu(true)} onMouseLeave={() => setShowCategoryMenu(false)}>
                  <button onClick={() => navigateTo('courses')} className={`text-sm font-bold flex items-center gap-1 hover:text-[#1A8F3A] transition-colors ${view === 'courses' ? 'text-[#1A8F3A]' : 'text-gray-600'}`}>
                    Courses <ChevronDown size={14}/>
                  </button>
                  {showCategoryMenu && (
                      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-[900px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 animate-fade-in-up cursor-default z-50 flex gap-8">
                          <div className="w-1/4 border-r border-gray-100 pr-4">
                             <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Categories</h4>
                             {categories.slice(0, 6).map(cat => (
                                 <div key={cat} onClick={() => navigateTo('courses', { category: cat })} className="py-2 px-3 rounded-lg hover:bg-green-50 text-sm font-medium text-gray-700 cursor-pointer flex justify-between items-center group/cat">
                                     {cat} <ChevronRight size={14} className="opacity-0 group-hover/cat:opacity-100 text-[#1A8F3A]"/>
                                 </div>
                             ))}
                             <div className="mt-4 pt-4 border-t">
                                 <div className="py-2 px-3 rounded-lg bg-gray-900 text-white text-sm font-bold cursor-pointer hover:bg-gray-800 flex items-center gap-2" onClick={() => navigateTo('courses')}>
                                     View All Courses <ArrowRight size={14}/>
                                 </div>
                             </div>
                          </div>
                          <div className="w-3/4">
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Popular Now</h4>
                              <div className="grid grid-cols-2 gap-6">
                                  {Object.entries(groupedCourses).slice(0, 4).map(([cat, courseList]) => (
                                      <div key={cat}>
                                          <h5 className="font-bold text-[#1A8F3A] mb-2 text-sm">{cat}</h5>
                                          <ul className="space-y-2">
                                              {courseList.map(c => (
                                                  <li key={c.id} onClick={() => navigateTo('course-detail', {courseId: c.id})} className="text-sm text-gray-600 hover:text-gray-900 hover:underline cursor-pointer truncate">
                                                      {c.title}
                                                  </li>
                                              ))}
                                          </ul>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>
                  )}
              </div>
              <button onClick={() => navigateTo('blogs')} className={`text-sm font-bold hover:text-[#1A8F3A] transition-colors ${view === 'blogs' ? 'text-[#1A8F3A]' : 'text-gray-600'}`}>Blogs</button>
              <button onClick={() => navigateTo('tools')} className={`text-sm font-bold hover:text-[#1A8F3A] transition-colors ${view === 'tools' ? 'text-[#1A8F3A]' : 'text-gray-600'}`}>Playground</button>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center gap-3 group relative">
                   <div className="hidden sm:block text-right cursor-pointer" onClick={() => navigateTo('dashboard')}>
                       <div className="text-sm font-bold text-gray-900">{userData?.displayName || 'User'}</div>
                       <div className="text-[10px] font-bold text-[#1A8F3A] uppercase tracking-wide">{userData?.role}</div>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-green-200 border-2 border-white shadow-md flex items-center justify-center text-[#064E3B] font-bold cursor-pointer hover:scale-105 transition-transform" onClick={() => navigateTo('dashboard')}>
                       {(user.email || 'U')[0].toUpperCase()}
                   </div>
                   <button onClick={handleLogout} className="absolute -bottom-10 right-0 bg-white shadow-lg px-3 py-1 rounded-lg text-xs font-bold text-red-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">Logout</button>
                </div>
              ) : (
                <Button onClick={() => setShowAuthModal(true)} className="shadow-none">Sign In</Button>
              )}
              <button className="md:hidden text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="pt-20">
        {view === 'home' && <HomeView navigateTo={navigateTo} courses={courses} blogs={blogs} setShowAuthModal={setShowAuthModal} user={user} />}
        {view === 'courses' && <CoursesView courses={courses} categories={categories} navigateTo={navigateTo} />}
        {view === 'course-detail' && <CourseDetailView courseId={activeCourseId} user={user} userData={userData} setUserData={setUserData} navigateTo={navigateTo} setShowAuthModal={setShowAuthModal} />}
        {view === 'certificate' && <CertificateView courseId={activeCourseId} userData={userData} courses={courses} />}
        {view === 'blog-detail' && <BlogDetailView blogId={activeBlogId} blogs={blogs} navigateTo={navigateTo} />}
        {view === 'dashboard' && <DashboardView user={user} userData={userData} courses={courses} navigateTo={navigateTo} handleLogout={handleLogout} />}
        {view === 'tools' && <ToolsView />}
        {view === 'blogs' && <BlogsView blogs={blogs} navigateTo={navigateTo} />}
        {view === 'admin' && <AdminView user={user} userData={userData} />}
      </main>

      {/* HELP BOT */}
      <HelpBot user={user} navigateTo={navigateTo} updateUserProfile={handleUpdateProfile} />

      {/* FOOTER */}
      <footer className="bg-[#022c22] text-white pt-20 pb-10 relative overflow-hidden mt-20">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1A8F3A] via-[#3CB371] to-[#1A8F3A]"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                  <div className="space-y-6">
                      <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-[#1A8F3A] rounded-lg flex items-center justify-center"><Zap size={18}/></div>
                          <span className="font-bold text-xl tracking-tight">MINDCRAFTERS</span>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">Empowering the next generation of developers with interactive, high-quality, and accessible education.</p>
                      <div className="flex gap-4">
                          <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1A8F3A] transition-colors"><Github size={20}/></a>
                          <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1A8F3A] transition-colors"><Twitter size={20}/></a>
                          <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1A8F3A] transition-colors"><Linkedin size={20}/></a>
                      </div>
                  </div>
                  <div>
                      <h4 className="font-bold text-lg mb-6 text-[#3CB371]">Platform</h4>
                      <ul className="space-y-4 text-sm text-gray-400">
                          <li><button onClick={() => navigateTo('courses')} className="hover:text-white transition-colors text-left">Browse Courses</button></li>
                          <li><button onClick={() => navigateTo('tools')} className="hover:text-white transition-colors text-left">Code Playground</button></li>
                          <li><button onClick={() => navigateTo('blogs')} className="hover:text-white transition-colors text-left">Tech Blog</button></li>
                      </ul>
                  </div>
                  <div>
                      <h4 className="font-bold text-lg mb-6 text-[#3CB371]">Company</h4>
                      <ul className="space-y-4 text-sm text-gray-400">
                          <li><button className="hover:text-white transition-colors text-left">About Us</button></li>
                          <li><button className="hover:text-white transition-colors text-left">Careers</button></li>
                          <li><button className="hover:text-white transition-colors text-left">Contact Support</button></li>
                      </ul>
                  </div>
                  <div>
                      <h4 className="font-bold text-lg mb-6 text-[#3CB371]">Stay Updated</h4>
                      <p className="text-gray-400 text-sm mb-4">Get the latest trends directly to your inbox.</p>
                      <div className="flex flex-col gap-3">
                          <input type="email" placeholder="Enter your email" className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1A8F3A]"/>
                          <button className="bg-[#1A8F3A] hover:bg-[#14702D] text-white font-bold py-3 rounded-lg transition-colors">Subscribe</button>
                      </div>
                  </div>
              </div>
              <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-gray-500 text-sm">© {new Date().getFullYear()} MindCrafters Inc. All rights reserved.</div>
                  <div className="flex gap-8 text-sm text-gray-500">
                      <button className="hover:text-white transition-colors">Privacy Policy</button>
                      <button className="hover:text-white transition-colors">Terms of Service</button>
                  </div>
              </div>
          </div>
      </footer>

      {/* AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
            <div className="p-8">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#1A8F3A]">
                        <User size={32}/>
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                    {authMode === 'login' ? 'Welcome Back' : authMode === 'signup' ? 'Join MindCrafters' : 'Reset Password'}
                    </h2>
                    <p className="text-gray-500 text-sm mt-2">Your gateway to tech mastery</p>
                </div>
                {authMode === 'reset' ? (
                    <form onSubmit={(e) => handleAuth(e, 'reset')}>
                        <Input name="email" type="email" placeholder="Enter your email" required />
                        <Button type="submit" className="w-full mt-4">Send Link</Button>
                        <button type="button" onClick={() => setAuthMode('login')} className="w-full text-center mt-4 text-sm text-gray-500 hover:text-green-600">Back</button>
                    </form>
                ) : (
                    <form onSubmit={(e) => handleAuth(e, authMode)} className="space-y-4">
                        {authMode === 'signup' && (
                            <div className="grid grid-cols-2 gap-4 animate-fade-in">
                                <div className="col-span-2 md:col-span-1">
                                    <Input name="fullName" placeholder="John Doe" label="Full Name" required />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <div className="mb-4">
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 tracking-wide">Interest</label>
                                        <select name="interest" className={THEME.input}>
                                            <option value="Development">Development</option>
                                            <option value="Design">Design</option>
                                            <option value="Data Science">Data Science</option>
                                            <option value="Mobile">Mobile</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                        <Input name="email" type="email" placeholder="you@example.com" label="Email" required autoComplete="email" />
                        <Input name="password" type="password" placeholder="••••••••" label="Password" required autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'} />
                        <Button type="submit" className="w-full shadow-lg shadow-green-200">
                            {authMode === 'login' ? 'Sign In' : 'Create Account'}
                        </Button>
                        <button type="button" onClick={handleGoogleLogin} className="w-full flex items-center justify-center px-4 py-3 border-2 border-gray-100 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all transform hover:scale-[1.01]">Google</button>
                    </form>
                )}
                <div className="mt-6 text-center text-sm text-gray-500">
                    {authMode === 'login' ? (
                        <>New here? <button onClick={() => setAuthMode('signup')} className="text-[#1A8F3A] font-bold hover:underline">Sign up</button></>
                    ) : (
                        <>Have an account? <button onClick={() => setAuthMode('login')} className="text-[#1A8F3A] font-bold hover:underline">Log in</button></>
                    )}
                </div>
            </div>
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24}/></button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB COMPONENTS ---

function HelpBot({ user, navigateTo, updateUserProfile }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm Crafty, your AI guide. I can help you navigate, submit feedback, or update your profile.", sender: 'bot' }
    ]);
    const [input, setInput] = useState("");
    const [mode, setMode] = useState('chat'); 
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const userMsg = input.trim();
        setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
        setInput("");

        if (mode === 'feedback') {
            try {
                await addDoc(getCollectionRef('feedback'), {
                    userId: user?.uid || 'anonymous',
                    userEmail: user?.email || 'anonymous',
                    message: userMsg,
                    createdAt: serverTimestamp()
                });
                reply(`Thanks! I've logged your feedback and forwarded it to support.`);
            } catch (err) {
                reply("I had trouble saving your feedback, but I've noted it.");
            }
            setMode('chat');
            return;
        }
        
        if (mode === 'profile_name') {
             if (user) {
                 try {
                     await updateUserProfile({ displayName: userMsg });
                     reply(`Great! I've updated your profile name to "${userMsg}".`);
                 } catch (err) {
                     reply("Sorry, I couldn't update your profile right now.");
                 }
             } else {
                 reply("You need to be logged in to update your profile.");
             }
             setMode('chat');
             return;
         }

        const lower = userMsg.toLowerCase();
        if (lower.includes('go to') || lower.includes('open') || lower.includes('show me')) {
            if (lower.includes('home')) { navigateTo('home'); reply("Navigating to Home."); }
            else if (lower.includes('course')) { navigateTo('courses'); reply("Opening Courses."); }
            else if (lower.includes('dashboard')) { 
                if (!user) reply("You need to log in.");
                else { navigateTo('dashboard'); reply("Opening Dashboard."); }
            }
            else reply("I can take you to Home, Courses, or Dashboard.");
            return;
        }

        if (lower.includes('feedback') || lower.includes('support')) {
            setMode('feedback');
            reply("Please type your feedback below.");
            return;
        }
        
        if (lower.includes('update') || lower.includes('change')) {
             if (lower.includes('profile') || lower.includes('name')) {
                 setMode('profile_name');
                 reply("What should your new name be?");
                 return;
             }
         }

        reply("I'm Crafty. Ask me to navigate or give feedback.");
    };

    const reply = (text) => {
        setTimeout(() => {
            setMessages(prev => [...prev, { text, sender: 'bot' }]);
        }, 600);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            {isOpen && (
                <div className="bg-white w-80 h-96 rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-fade-in-up mb-4">
                    <div className="bg-[#1A8F3A] p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"><Bot size={18}/></div>
                            <span className="font-bold">Crafty Support</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded"><X size={16}/></button>
                    </div>
                    <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-gray-50">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-[#1A8F3A] text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-700 rounded-bl-none shadow-sm'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={handleSend} className="p-3 bg-white border-t flex gap-2">
                        <input className="flex-grow bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none" placeholder="Type a message..." value={input} onChange={(e) => setInput(e.target.value)} />
                        <button type="submit" className="bg-[#1A8F3A] text-white p-2 rounded-full hover:bg-green-700"><Send size={16}/></button>
                    </form>
                </div>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="w-14 h-14 bg-[#1A8F3A] rounded-full shadow-xl flex items-center justify-center text-white hover:scale-110 transition-transform hover:bg-green-700">
                {isOpen ? <X size={24}/> : <MessageSquare size={24}/>}
            </button>
        </div>
    );
}

function HomeView({ navigateTo, courses, blogs, setShowAuthModal, user }) {
    const [activeSlide, setActiveSlide] = useState(0);
    const slides = [
        { 
            title: "Master Full-Stack Dev", 
            subtitle: "Build real-world projects from scratch with React, Node, and modern tools.", 
            bgImage: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80",
            cta: "Start Coding",
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        { 
            title: "Data Science & AI", 
            subtitle: "Unlock the power of data with Python, Machine Learning, and deep analytics.", 
            bgImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80",
            cta: "Explore AI",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        { 
            title: "Mobile App Design", 
            subtitle: "Create beautiful, responsive interfaces for iOS & Android using Flutter & Figma.", 
            bgImage: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80",
            cta: "View Courses",
            image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => setActiveSlide((prev) => (prev + 1) % slides.length), 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="animate-fade-in">
            <style>{`@keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } } .animate-float { animation: float 6s ease-in-out infinite; }`}</style>
            <div className="relative h-[600px] overflow-hidden">
                {slides.map((slide, idx) => (
                    <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'} flex items-center`}>
                        <div className="absolute inset-0">
                             <img src={slide.bgImage} className="w-full h-full object-cover" alt="background"/>
                             <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30"></div>
                        </div>
                        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 items-center relative h-full">
                            <div className="space-y-8 animate-slide-in-left z-20 relative">
                                <Badge color="green">Premium Learning</Badge>
                                <h1 className="text-5xl md:text-7xl font-black text-white leading-tight drop-shadow-lg">{slide.title}</h1>
                                <p className="text-xl text-green-100 max-w-md font-light">{slide.subtitle}</p>
                                <div className="flex gap-4">
                                    <Button variant="secondary" className="bg-white text-green-900 border-none hover:bg-gray-100" onClick={() => navigateTo('courses')}>{slide.cta} <ArrowRight size={18}/></Button>
                                </div>
                            </div>
                            <div className="hidden md:flex justify-center items-center relative h-full">
                                <div className="w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0"></div>
                                <img src={slide.image} alt={slide.title} className="relative z-10 animate-float drop-shadow-2xl rounded-2xl border-4 border-white/10 object-cover h-[400px] w-[600px] shadow-black/50" />
                            </div>
                        </div>
                    </div>
                ))}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
                    {slides.map((_, idx) => (
                        <button key={idx} onClick={() => setActiveSlide(idx)} className={`h-3 rounded-full transition-all duration-300 ${idx === activeSlide ? 'bg-white w-8' : 'bg-white/40 w-3 hover:bg-white/60'}`} />
                    ))}
                </div>
            </div>
            <div className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute top-1/2 -left-24 w-72 h-72 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
                </div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <Badge color="green">Our Mission</Badge>
                        <h2 className="text-4xl font-black text-[#064E3B] mt-4 mb-6">Reinventing How You Learn Tech</h2>
                        <p className="text-lg text-gray-600">We believe education should be accessible, practical, and directly linked to industry needs. Here is how we are different.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { icon: <Monitor size={32}/>, title: "Project-Based Learning", desc: "Stop watching tutorials. Start building real applications that solve real problems." },
                            { icon: <Users size={32}/>, title: "Peer Code Reviews", desc: "Get feedback from experienced developers and improve your code quality instantly." },
                            { icon: <Trophy size={32}/>, title: "Gamified Progress", desc: "Earn XP, badges, and certificates as you master new skills and complete challenges." }
                        ].map((item, i) => (
                            <div key={i} className="bg-[#FBFFF9] p-8 rounded-3xl border border-green-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
                                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-[#1A8F3A] mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">{item.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 border-t border-gray-100 pt-12">
                        {[
                            { num: "50k+", label: "Active Learners" },
                            { num: "120+", label: "Expert Mentors" },
                            { num: "4.9", label: "Average Rating" },
                            { num: "95%", label: "Job Placement" }
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-4xl font-black text-[#1A8F3A] mb-2">{stat.num}</div>
                                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1 relative">
                        <div className="absolute inset-0 bg-[#D8FFE0] rounded-3xl transform rotate-3"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                            alt="Career Success" 
                            className="relative rounded-3xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500 w-full object-cover h-[500px]"
                        />
                    </div>
                    <div className="order-1 md:order-2 space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-[#1A8F3A] rounded-full font-bold text-sm">
                            <Briefcase size={18}/> Career Accelerator
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 leading-tight">Unlock Your True Potential With Industry Experts</h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Don't just learn to code—learn to build. Our curriculum is crafted by tech leaders to bridge the gap between theory and the real world. Get hired by top companies.
                        </p>
                        <div className="space-y-4">
                             {['Certified Learning', 'Job Ready Skills', 'Community Mentorship'].map((item, i) => (
                                 <div key={i} className="flex gap-4 items-start">
                                    <div className="bg-green-100 p-2 rounded-lg text-green-700"><Check size={20}/></div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{item}</h4>
                                        <p className="text-sm text-gray-500">Industry recognized and practical.</p>
                                    </div>
                                 </div>
                             ))}
                        </div>
                        <Button onClick={() => !user ? setShowAuthModal(true) : navigateTo('courses')}>Start Your Journey</Button>
                    </div>
                </div>
            </div>
            <div className="py-20 bg-gray-50">
                 <div className="max-w-7xl mx-auto px-6">
                     <div className="flex justify-between items-end mb-12">
                         <div><h2 className="text-3xl font-bold text-[#064E3B]">Popular Courses</h2><p className="text-gray-500 mt-2">Join thousands today</p></div>
                         <button onClick={() => navigateTo('courses')} className="text-[#1A8F3A] font-bold hover:underline">View All <ArrowRight size={16}/></button>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         {courses.slice(0, 3).map(course => (
                             <div key={course.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
                                 <div className="h-48 relative overflow-hidden">
                                     <img src={course.thumbnail} className="w-full h-full object-cover" />
                                     {course.price === 0 && <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">FREE</div>}
                                 </div>
                                 <div className="p-6 flex-grow flex flex-col">
                                     <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                                     <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                                         <span className="text-2xl font-bold text-gray-900">{course.price === 0 ? 'Free' : `$${course.price}`}</span>
                                         <button onClick={() => navigateTo('course-detail', {courseId: course.id})} className="bg-green-50 text-[#1A8F3A] px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#1A8F3A] hover:text-white transition-all">Details</button>
                                     </div>
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>
            </div>
            <div className="py-24 bg-gradient-to-br from-gray-900 to-[#064E3B] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/hexellence.png')]"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div className="text-white"><Badge color="green" className="bg-green-500/20 text-green-300">Latest Insights</Badge><h2 className="text-4xl font-black mt-4">Stories & Articles</h2></div>
                        <Button variant="white" onClick={() => navigateTo('blogs')}>Read the Blog <ArrowRight size={18}/></Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {blogs.slice(0, 3).map((blog, i) => (
                            <div key={blog.id} onClick={() => navigateTo('blog-detail', {blogId: blog.id})} className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer shadow-2xl border border-white/10">
                                <img src={blog.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 transition-opacity group-hover:opacity-90"></div>
                                <div className="absolute bottom-0 left-0 p-8 w-full transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                                    <div className="text-[#3CB371] text-xs font-bold uppercase tracking-wider mb-2">{blog.category}</div>
                                    <h3 className="text-2xl font-bold text-white mb-4">{blog.title}</h3>
                                    <div className="flex items-center gap-4 text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        <span>{blog.readTime} read</span>
                                        <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                                        <span className="flex items-center gap-1 text-[#3CB371]">Read Now <ArrowRight size={14}/></span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="bg-[#FBFFF9] py-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 mb-10">
                    <h2 className="text-3xl font-bold text-[#064E3B]">Trusted by Learners</h2>
                </div>
                <div className="flex space-x-6 px-6 overflow-x-auto pb-10 scrollbar-hide snap-x">
                    {[1,2,3,4,5].map((i) => (
                        <div key={i} className="snap-center shrink-0 w-[350px] bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative">
                            <div className="absolute -top-4 -right-4 bg-green-100 p-3 rounded-full"><Star className="text-[#1A8F3A]" fill="currentColor" size={24}/></div>
                            <p className="text-gray-600 italic mb-6 leading-relaxed">"This platform completely changed my career trajectory. The simplified approach to complex topics is unmatched."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden"><img src={`https://i.pravatar.cc/150?img=${i+10}`} alt="User" /></div>
                                <div>
                                    <div className="font-bold text-gray-900">Alex Johnson</div>
                                    <div className="text-xs text-gray-500">Frontend Developer @ TechCorp</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function CoursesView({ courses, categories, navigateTo }) {
    const [filter, setFilter] = useState('All');
    const filtered = courses.filter(c => filter === 'All' || c.category === filter);
    return (
        <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen animate-fade-in">
            <div className="text-center mb-16"><h1 className="text-4xl font-black text-[#064E3B] mb-4">Explore Our Curriculum</h1></div>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
                <button onClick={() => setFilter('All')} className={`px-6 py-2 rounded-full font-bold transition-all ${filter === 'All' ? 'bg-[#1A8F3A] text-white shadow-lg' : 'bg-white text-gray-600 border hover:border-[#1A8F3A]'}`}>All</button>
                {categories.map(cat => (
                    <button key={cat} onClick={() => setFilter(cat)} className={`px-6 py-2 rounded-full font-bold transition-all ${filter === cat ? 'bg-[#1A8F3A] text-white shadow-lg' : 'bg-white text-gray-600 border hover:border-[#1A8F3A]'}`}>{cat}</button>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map(course => (
                    <div key={course.id} onClick={() => navigateTo('course-detail', {courseId: course.id})} className={`${THEME.card} flex flex-col cursor-pointer group`}>
                        <div className="h-52 bg-gray-100 relative overflow-hidden rounded-t-2xl">
                            <img src={course.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                             {course.price === 0 && <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">FREE</div>}
                        </div>
                        <div className="p-6 flex-grow flex flex-col">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                            <p className="text-gray-500 text-sm line-clamp-2 mb-4">{course.description}</p>
                            <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                                <span className="font-bold">{course.price === 0 ? 'Free' : `$${course.price}`}</span>
                                <div className="text-[#1A8F3A] font-bold text-sm flex items-center gap-1">Details <ArrowRight size={14}/></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function CourseDetailView({ courseId, user, userData, setUserData, navigateTo, setShowAuthModal }) {
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState({});
  const [activeLesson, setActiveLesson] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [showPayment, setShowPayment] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);

  useEffect(() => {
    if (!courseId) return;
    const fetchData = async () => {
        const mockCourse = MOCK_COURSES.find(c => c.id === courseId);
        let dbCourse = null;
        try {
            const courseSnap = await getDoc(getDocumentRef('courses', courseId));
            if (courseSnap.exists()) dbCourse = { id: courseSnap.id, ...courseSnap.data() };
        } catch(e) { console.log("Checking mock data..."); }

        const finalCourse = dbCourse || mockCourse;
        if (finalCourse) {
            setCourse(finalCourse);
            // Setup Modules/Lessons (Mock logic for brevity, extend for DB in prod)
            const mockMods = [
                { id: 'm1', title: 'Introduction & Setup' },
                { id: 'm2', title: 'Core Concepts Deep Dive' },
                { id: 'm3', title: 'Building the Project' }
            ];
            setModules(mockMods);
            const mockLess = {};
            let allLess = [];
            mockMods.forEach(m => {
                const mLessons = [
                    { id: `l${m.id}1`, title: 'Welcome to the Module' },
                    { id: `l${m.id}2`, title: 'Getting Started' },
                    { id: `l${m.id}3`, title: 'Hands-on Exercise' }
                ];
                mockLess[m.id] = mLessons;
                allLess = [...allLess, ...mLessons];
            });
            setLessons(mockLess);
            setExpandedModules({'m1': true});
        }
    };
    fetchData();
    
    // Load progress
    if (userData?.progress?.[courseId]?.completedLessons) {
        setCompletedLessons(userData.progress[courseId].completedLessons);
    }
  }, [courseId, userData]);

  const handleEnroll = async () => {
      if (!user) return setShowAuthModal(true);
      if (course.price > 0) return setShowPayment(true);
      
      // Free enrollment
      setProcessing(true);
      try {
          const userRef = getDocumentRef('users', user.uid);
          const currentEnrolled = userData.enrolledCourses || [];
          if (!currentEnrolled.includes(courseId)) {
              await updateDoc(userRef, { enrolledCourses: [...currentEnrolled, courseId] });
              setUserData(prev => ({ ...prev, enrolledCourses: [...prev.enrolledCourses, courseId] }));
              alert("Enrolled successfully!");
          }
      } catch(e) { console.error(e); }
      setProcessing(false);
  };

  const handlePaymentSuccess = async () => {
      const userRef = getDocumentRef('users', user.uid);
      const currentEnrolled = userData?.enrolledCourses || [];
      await updateDoc(userRef, { enrolledCourses: [...currentEnrolled, courseId] });
      setUserData(prev => ({ ...prev, enrolledCourses: [...prev.enrolledCourses, courseId] }));
      setShowPayment(false);
      alert("Purchase Successful!");
  };

  const markComplete = async (lessonId) => {
      if (!completedLessons.includes(lessonId)) {
          const newCompleted = [...completedLessons, lessonId];
          setCompletedLessons(newCompleted);
          
          // Save to Firestore
          const userRef = getDocumentRef('users', user.uid);
          const progressUpdate = {};
          progressUpdate[`progress.${courseId}.completedLessons`] = newCompleted;
          await updateDoc(userRef, progressUpdate);

          // Check Certificate Eligibility
          const totalLessons = Object.values(lessons).flat().length;
          if (newCompleted.length === totalLessons) {
              alert("Course Completed! You earned a certificate.");
              await updateDoc(userRef, { 
                  certificates: arrayUnion({ 
                      courseId, 
                      title: course.title, 
                      date: new Date().toISOString() 
                  }) 
              });
          }
      }
  };

  const isEnrolled = userData?.enrolledCourses?.includes(courseId);
  const isCourseComplete = completedLessons.length > 0 && completedLessons.length === Object.values(lessons).flat().length;

  if (!course) return <Loader />;

  if (activeLesson) {
      return (
          <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] bg-white animate-fade-in">
              <div className="flex-grow bg-black flex flex-col">
                  <div className="h-14 flex items-center px-4 bg-[#111] border-b border-[#222] text-gray-400 justify-between">
                      <button onClick={() => setActiveLesson(null)} className="hover:text-white flex items-center gap-2 text-sm"><ChevronLeft size={16}/> Back to Course</button>
                      <span className="text-sm font-bold text-white truncate max-w-md">{activeLesson.title}</span>
                  </div>
                  <div className="flex-grow flex items-center justify-center relative bg-[#000]">
                       <div className="text-gray-500">Video Placeholder</div>
                  </div>
                  <div className="p-4 bg-[#111] border-t border-[#222] flex justify-end">
                      <Button onClick={() => markComplete(activeLesson.id)} disabled={completedLessons.includes(activeLesson.id)}>
                          {completedLessons.includes(activeLesson.id) ? "Completed" : "Mark Complete"}
                      </Button>
                  </div>
              </div>
              <div className="w-full lg:w-96 border-l bg-white flex flex-col h-full overflow-hidden">
                   <div className="p-4 border-b font-bold text-gray-800 bg-gray-50">Course Content</div>
                   <div className="flex-grow overflow-y-auto">
                       {modules.map(mod => (
                           <div key={mod.id}>
                               <div className="px-4 py-3 bg-gray-100 text-xs font-bold text-gray-500 uppercase">{mod.title}</div>
                               {lessons[mod.id]?.map(l => (
                                   <div key={l.id} onClick={() => setActiveLesson(l)} className={`px-4 py-3 border-b border-gray-50 text-sm cursor-pointer hover:bg-green-50 flex gap-3 items-center ${activeLesson.id === l.id ? 'bg-green-100 text-green-800 font-bold' : 'text-gray-600'}`}>
                                       {completedLessons.includes(l.id) ? <CheckCircle size={16} className="text-green-600"/> : <div className="w-4 h-4 rounded-full border border-gray-300"></div>}
                                       {l.title}
                                   </div>
                               ))}
                           </div>
                       ))}
                   </div>
              </div>
          </div>
      )
  }

  return (
      <div className="bg-[#FBFFF9] animate-fade-in">
          <div className="bg-[#1e1e1c] text-white py-12">
              <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row gap-12 relative">
                  <div className="lg:w-2/3 space-y-6">
                       <Badge color="green" className="bg-green-500/20 text-green-300">{course.category}</Badge>
                       <h1 className="text-4xl font-black leading-tight">{course.title}</h1>
                       <p className="text-lg text-gray-300">{course.description}</p>
                       {isEnrolled ? (
                           <div className="flex gap-4">
                               <Button onClick={() => setActiveLesson(lessons[modules[0].id][0])}>Continue Learning</Button>
                               {isCourseComplete && <Button variant="secondary" onClick={() => navigateTo('certificate', {courseId})}>Claim Certificate</Button>}
                           </div>
                       ) : (
                           <div className="flex gap-4 items-center">
                               <span className="text-3xl font-bold">{course.price === 0 ? 'Free' : `$${course.price}`}</span>
                               <Button onClick={handleEnroll} disabled={processing}>{processing ? "Enrolling..." : "Enroll Now"}</Button>
                           </div>
                       )}
                  </div>
              </div>
          </div>
          <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold mb-6">Course Content</h2>
                  <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                      {modules.map(mod => (
                          <div key={mod.id} className="border-b last:border-0">
                              <div className="p-4 bg-gray-50 font-bold text-gray-800 flex justify-between cursor-pointer" onClick={() => setExpandedModules(p => ({...p, [mod.id]: !p[mod.id]}))}>
                                  {mod.title} <ChevronDown size={16}/>
                              </div>
                              {expandedModules[mod.id] && (
                                  <div className="bg-white">
                                      {lessons[mod.id]?.map(l => (
                                          <div key={l.id} className="p-3 pl-8 border-b flex items-center gap-3 text-sm text-gray-600 hover:text-green-600 cursor-pointer" onClick={() => isEnrolled ? setActiveLesson(l) : alert("Enroll first")}>
                                              <Video size={14}/> {l.title}
                                              {!isEnrolled && <Lock size={12} className="ml-auto text-gray-300"/>}
                                          </div>
                                      ))}
                                  </div>
                              )}
                          </div>
                      ))}
                  </div>
              </div>
          </div>
          {showPayment && (
              <div className="fixed inset-0 z-[80] bg-black/70 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                      <h3 className="text-xl font-bold mb-4">Secure Checkout</h3>
                      <div className="space-y-4">
                          <div className="p-4 bg-gray-50 border rounded flex justify-between">
                              <span className="font-bold">{course.title}</span>
                              <span>${course.price}</span>
                          </div>
                          <Button className="w-full" onClick={handlePaymentSuccess}>Pay Now (Simulated)</Button>
                          <button onClick={() => setShowPayment(false)} className="w-full text-center text-sm text-gray-500 mt-2">Cancel</button>
                      </div>
                  </div>
              </div>
          )}
      </div>
  );
}

function CertificateView({ courseId, userData, courses }) {
    const course = courses.find(c => c.id === courseId) || MOCK_COURSES.find(c => c.id === courseId);
    const certificateRef = useRef();

    const handleDownload = () => {
        const script = document.createElement('script');
        script.src = "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
        script.onload = () => {
            window.html2canvas(certificateRef.current).then(canvas => {
                const link = document.createElement('a');
                link.download = `Certificate_${course.title}.png`;
                link.href = canvas.toDataURL();
                link.click();
            });
        };
        document.body.appendChild(script);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12">
            <div ref={certificateRef} className="bg-white w-[800px] h-[600px] shadow-2xl p-12 text-center border-[20px] border-[#064E3B] relative flex flex-col justify-center">
                 {/* Decorative Seal */}
                 <div className="absolute top-10 left-1/2 transform -translate-x-1/2 opacity-5 pointer-events-none">
                     <Zap size={400}/>
                 </div>
                 <div className="absolute bottom-12 right-12 opacity-20">
                     <BadgeCheck size={100} className="text-[#1A8F3A]"/>
                 </div>

                 {/* Brand Name Header */}
                 <div className="absolute top-10 left-0 w-full text-center">
                    <div className="flex items-center justify-center gap-2 opacity-80">
                        <Zap size={20} className="text-[#064E3B]"/>
                        <span className="text-[#064E3B] font-bold tracking-[0.4em] text-sm uppercase">MINDCRAFTERS</span>
                    </div>
                 </div>

                 <h1 className="text-5xl font-serif font-bold text-[#064E3B] mb-2 uppercase tracking-widest mt-8">Certificate</h1>
                 <h2 className="text-2xl font-serif text-gray-500 mb-12">OF COMPLETION</h2>
                 
                 <p className="text-gray-500 text-lg mb-2">This is to certify that</p>
                 <h2 className="text-4xl font-bold text-gray-900 mb-2 border-b-2 border-gray-300 inline-block px-12 pb-2 mx-auto font-serif italic">{userData?.displayName || 'Student Name'}</h2>
                 
                 <p className="text-gray-500 text-lg mt-8 mb-2">has successfully completed the course</p>
                 <h3 className="text-3xl font-bold text-[#1A8F3A] mb-12">{course?.title}</h3>
                 
                 <div className="flex justify-between items-end px-20 mt-auto">
                     <div className="text-center">
                         <div className="font-serif italic text-xl text-gray-800 mb-1">Mr. ASHISH KHATAVKAR</div>
                         <div className="h-px w-48 bg-gray-400 mb-2"></div>
                         <p className="font-bold text-gray-700 text-sm uppercase">MindCrafters CEO</p>
                     </div>
                     <div className="text-center">
                         <p className="font-bold text-gray-900 mb-2">{new Date().toLocaleDateString()}</p>
                         <div className="h-px w-48 bg-gray-400 mb-2"></div>
                         <p className="font-bold text-gray-700 text-sm uppercase">Date Issued</p>
                     </div>
                 </div>
            </div>
            <Button onClick={handleDownload} className="mt-8 flex gap-2"><Download size={18}/> Download Certificate</Button>
        </div>
    )
}

function DashboardView({ user, userData, courses, navigateTo, handleLogout }) {
    const [editMode, setEditMode] = useState(false);
    const [newName, setNewName] = useState(userData?.displayName || '');
    
    if (!user) return <div className="flex items-center justify-center h-screen">Please Log In</div>;
    
    const enrolled = courses.filter(c => userData?.enrolledCourses?.includes(c.id));
    const certificates = userData?.certificates || [];

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className={`${THEME.card} md:col-span-2 p-8 bg-gradient-to-r from-[#064E3B] to-[#1A8F3A] text-white border-none`}>
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {userData?.displayName}!</h1>
                    <p className="text-green-100 mb-4">Keep pushing forward.</p>
                    <button onClick={handleLogout} className="text-xs bg-red-500/20 px-3 py-1 rounded border border-red-400/30">Logout</button>
                </div>
                <div className={`${THEME.card} p-6 flex flex-col justify-center items-center`}>
                    <Trophy size={32} className="text-yellow-500 mb-2"/>
                    <div className="text-3xl font-bold">{certificates.length}</div>
                    <div className="text-gray-500 text-sm">Certificates</div>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Certificates</h2>
            {certificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {certificates.map((cert, i) => (
                        <div key={i} className="bg-white border p-6 rounded-xl shadow-sm flex items-center justify-between">
                            <div>
                                <div className="font-bold text-gray-900">{cert.title}</div>
                                <div className="text-xs text-gray-500">{new Date(cert.date).toLocaleDateString()}</div>
                            </div>
                            <Button size="sm" variant="ghost" onClick={() => navigateTo('certificate', {courseId: cert.courseId})}><Download size={16}/></Button>
                        </div>
                    ))}
                </div>
            ) : <p className="text-gray-500 mb-12">No certificates earned yet.</p>}

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Enrolled Courses</h2>
            {enrolled.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {enrolled.map(course => (
                        <div key={course.id} className={`${THEME.card} p-6 border-l-4 border-l-[#1A8F3A]`}>
                            <h3 className="font-bold text-lg mb-2 truncate">{course.title}</h3>
                            <button onClick={() => navigateTo('course-detail', {courseId: course.id})} className="text-xs font-bold bg-[#1A8F3A] text-white px-3 py-1.5 rounded-lg">Resume</button>
                        </div>
                    ))}
                </div>
            ) : <p>No courses enrolled.</p>}
        </div>
    );
}

function AdminView({ user, userData }) {
  const [activeTab, setActiveTab] = useState('courses');
  const [adminCourses, setAdminCourses] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', category: '', thumbnail: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      getDocs(query(getCollectionRef('courses'))).then(s => setAdminCourses(s.docs.map(d => ({id:d.id, ...d.data()}))));
      const fetchUsers = async () => {
          const usersQuery = query(getCollectionRef('users'), orderBy('createdAt', 'desc'));
          const snapshot = await getDocs(usersQuery);
          setAdminUsers(snapshot.docs.map(d => ({id: d.id, ...d.data()})));
      };
      fetchUsers();
  }, []);

  const createCourse = async (e) => {
      e.preventDefault();
      await addDoc(getCollectionRef('courses'), { ...form, enrolledCount: 0, createdAt: serverTimestamp() });
      alert("Course Created");
      window.location.reload();
  };

  const seedDatabase = async () => {
      if(!confirm("This will add sample courses to the database. Continue?")) return;
      setLoading(true);
      const sampleCourses = [
          {
              title: "Complete React Developer in 2025",
              description: "Become a Senior React Developer. Build massive e-commerce apps with Redux, Hooks, GraphQL, ContextAPI, Stripe, Firebase.",
              category: "Development",
              thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
              enrolledCount: 1540
          },
          {
              title: "Python for Data Science and Machine Learning",
              description: "Learn how to use NumPy, Pandas, Seaborn , Matplotlib , Plotly , Scikit-Learn , Machine Learning, Tensorflow , and more!",
              category: "Data Science",
              thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
              enrolledCount: 2300
          },
          {
              title: "The Complete UI/UX Design Masterclass",
              description: "Start your UI/UX career in 2025. Learn Figma, prototyping, user research, and build a complete portfolio case study.",
              category: "Design",
              thumbnail: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
              enrolledCount: 890
          },
          {
              title: "iOS 18 App Development Bootcamp",
              description: "From beginner to iOS app developer with just one course. Fully updated for iOS 18 and Xcode 16.",
              category: "Mobile",
              thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
              enrolledCount: 1100
          }
      ];

      try {
          for (const course of sampleCourses) {
             const docRef = await addDoc(getCollectionRef('courses'), {
                 ...course,
                 createdAt: serverTimestamp()
             });
             await addDoc(getCollectionRef('modules'), { courseId: docRef.id, title: "Introduction", order: 1 });
             await addDoc(getCollectionRef('modules'), { courseId: docRef.id, title: "Core Concepts", order: 2 });
          }
          alert("Database seeded successfully!");
          window.location.reload();
      } catch (e) {
          console.error(e);
          alert("Error seeding: " + e.message);
      }
      setLoading(false);
  };

  if (userData?.role !== 'admin') return <div className="pt-32 text-center">Admin Only</div>;

  return (
      <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button 
                    onClick={() => setActiveTab('courses')}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'courses' ? 'bg-white shadow text-[#1A8F3A]' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Courses
                  </button>
                  <button 
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-white shadow text-[#1A8F3A]' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    User Tracking
                  </button>
              </div>
          </div>
          
          {activeTab === 'courses' ? (
            <>
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 mb-8 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-blue-800">Quick Actions</h3>
                        <p className="text-blue-600 text-sm">Setup your platform content quickly.</p>
                    </div>
                    <Button onClick={seedDatabase} disabled={loading}>{loading ? "Seeding..." : "Seed Database with Courses"}</Button>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
                    <h2 className="font-bold mb-4">Create Course</h2>
                    <form onSubmit={createCourse} className="space-y-4">
                        <Input placeholder="Title" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} required />
                        <Input placeholder="Description" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} required />
                        <Input placeholder="Category" value={form.category} onChange={e=>setForm({...form, category: e.target.value})} required />
                        <Input placeholder="Thumbnail URL" value={form.thumbnail} onChange={e=>setForm({...form, thumbnail: e.target.value})} />
                        <Button type="submit">Create</Button>
                    </form>
                </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="font-bold text-lg">Registered Users ({adminUsers.length})</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 font-bold text-gray-600">Name</th>
                                <th className="p-4 font-bold text-gray-600">Email</th>
                                <th className="p-4 font-bold text-gray-600">Role</th>
                                <th className="p-4 font-bold text-gray-600">Interest</th>
                                <th className="p-4 font-bold text-gray-600">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {adminUsers.map(u => (
                                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-bold text-gray-900">{u.displayName || 'N/A'}</td>
                                    <td className="p-4 text-gray-600">{u.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-600">{u.interest || '-'}</td>
                                    <td className="p-4 text-gray-500">
                                        {u.createdAt?.seconds ? new Date(u.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                                    </td>
                                </tr>
                            ))}
                            {adminUsers.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">No users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
          )}
      </div>
  );
}

function BlogsView({ blogs, navigateTo }) {
    return (
        <div className="max-w-5xl mx-auto px-6 py-12 animate-fade-in">
            <div className="text-center mb-16">
                <Badge color="blue">Tech Articles</Badge>
                <h1 className="text-4xl font-black text-gray-900 mt-4">MindCrafters Blog</h1>
            </div>
            <div className="space-y-12">
                {blogs.map(blog => (
                    <div key={blog.id} onClick={() => navigateTo('blog-detail', {blogId: blog.id})} className="flex flex-col md:flex-row gap-8 items-center group cursor-pointer border-b border-gray-100 pb-12">
                        <div className="w-full md:w-1/2 h-64 rounded-2xl overflow-hidden shadow-md">
                            <img src={blog.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                        </div>
                        <div className="w-full md:w-1/2">
                            <div className="text-sm font-bold text-[#1A8F3A] mb-2 uppercase tracking-wider">{blog.category}</div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#1A8F3A] transition-colors">{blog.title}</h2>
                            <p className="text-gray-500 mb-6 line-clamp-2">{blog.content[0]}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                <span className="flex items-center gap-1"><User size={14}/> {blog.author}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span>{blog.readTime} read</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function BlogDetailView({ blogId, blogs, navigateTo }) {
    const blog = blogs.find(b => b.id === parseInt(blogId));

    if (!blog) return <div className="text-center py-20">Blog not found.</div>;

    return (
        <div className="animate-fade-in bg-white min-h-screen">
             <div className="h-[400px] w-full relative">
                  <img src={blog.image} className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-black/50"></div>
                  <div className="absolute bottom-0 left-0 w-full p-8 max-w-4xl mx-auto text-white">
                        <button onClick={() => navigateTo('blogs')} className="flex items-center gap-2 text-sm font-bold mb-4 hover:text-green-300 transition-colors"><ChevronLeft/> Back to Blogs</button>
                        <Badge color="green" className="bg-green-500/20 text-green-200 mb-4">{blog.category}</Badge>
                        <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">{blog.title}</h1>
                        <div className="flex items-center gap-6 text-sm font-medium text-gray-300">
                             <span className="flex items-center gap-2"><User size={16}/> {blog.author}</span>
                             <span className="flex items-center gap-2"><Calendar size={16}/> {blog.date}</span>
                             <span className="flex items-center gap-2"><Coffee size={16}/> {blog.readTime}</span>
                        </div>
                  </div>
             </div>
             
             <div className="max-w-3xl mx-auto px-6 py-12">
                  <article className="prose prose-lg prose-green mx-auto text-gray-700">
                      {blog.content.map((paragraph, index) => (
                          <p key={index} className="mb-6 leading-relaxed">{paragraph}</p>
                      ))}
                  </article>
                  
                  <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
                       <div className="font-bold text-gray-900">Share this article</div>
                       <div className="flex gap-4">
                           <button className="p-2 rounded-full bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"><Twitter size={20}/></button>
                           <button className="p-2 rounded-full bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-700 transition-colors"><Linkedin size={20}/></button>
                           <button className="p-2 rounded-full bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-800 transition-colors"><Facebook size={20}/></button>
                       </div>
                  </div>
             </div>
        </div>
    )
}

function ToolsView() {
    const [lang, setLang] = useState('javascript');
    const [code, setCode] = useState('// Write JavaScript here\nconsole.log("Hello World");');
    const [output, setOutput] = useState([]);

    const runCode = () => {
        if (lang !== 'javascript') {
            setOutput([`[System]: Running ${lang} requires a backend environment.`, '[System]: This is a simulated UI for demonstration.']);
            return;
        }
        const logs = [];
        const originalLog = console.log;
        console.log = (...args) => logs.push(args.join(' '));
        try { new Function(code)(); } catch (e) { logs.push(`Error: ${e.message}`); }
        console.log = originalLog;
        setOutput(logs);
    };

    return (
        <div className="h-[calc(100vh-80px)] bg-[#1e1e1e] flex flex-col text-gray-300 font-mono">
            <div className="h-14 bg-[#252526] border-b border-[#333] flex items-center px-4 justify-between">
                <div className="flex items-center gap-2">
                    <Terminal size={18} className="text-[#1A8F3A]"/>
                    <span className="font-bold text-sm">MindCrafters IDE</span>
                </div>
                <div className="flex gap-2">
                    <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-[#333] text-white text-xs px-3 py-1 rounded outline-none border border-gray-600">
                        <option value="javascript">JavaScript (Node)</option>
                        <option value="python">Python 3</option>
                        <option value="sql">SQL (SQLite)</option>
                    </select>
                    <button onClick={runCode} className="bg-[#1A8F3A] text-white px-4 py-1 rounded text-xs font-bold hover:bg-green-600 flex items-center gap-2">
                        <Play size={12} fill="currentColor"/> Run Code
                    </button>
                </div>
            </div>
            <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
                <textarea 
                    className="flex-grow bg-[#1e1e1e] text-[#d4d4d4] p-6 outline-none resize-none font-mono text-sm leading-relaxed"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    spellCheck="false"
                />
                <div className="h-1/3 md:h-full md:w-1/3 bg-[#1e1e1e] border-t md:border-t-0 md:border-l border-[#333] flex flex-col">
                    <div className="bg-[#252526] px-4 py-2 text-xs font-bold text-gray-400 uppercase">Terminal Output</div>
                    <div className="p-4 overflow-y-auto flex-grow text-sm font-mono">
                        {output.length === 0 && <span className="text-gray-600"> Ready to execute...</span>}
                        {output.map((line, i) => (
                            <div key={i} className="mb-1 text-green-400 font-bold">➜ {line}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}