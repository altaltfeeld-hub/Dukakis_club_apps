import { useState, useEffect, useRef } from 'react';
import { 
  User, 
  MapPin, 
  ChevronRight, 
  Mail, 
  AtSign, 
  ArrowRight, 
  LockKeyhole, 
  CalendarDays, 
  ChevronLeft
} from 'lucide-react';
import clsx from 'clsx';
import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

function SplashScreen() {
  const stars = Array.from({ length: 20 }).map((_, i) => ({
    id: i, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
    duration: `${2.5 + Math.random() * 3.5}s`, delay: `${Math.random() * 3}s`, size: `${4 + Math.random() * 8}px`
  }));
  return (
    <div className="splash-fullscreen">
      <div className="stars-container">{stars.map(star => (<div key={star.id} className="star" style={{ top: star.top, left: star.left, '--duration': star.duration, '--delay': star.delay, '--size': star.size } as any} />))}</div>
      <div className="splash-logo-box"><img src="/logo_final.jpg" alt="Logo" /></div>
    </div>
  );
}

function HomeTab({ user, onGoProfile, setTab }: { user: any, onGoProfile: () => void, setTab: (t: string) => void }) {
  const moscowTime = new Date(new Date().toLocaleString("en-US", {timeZone: "Europe/Moscow"}));
  const dayNum = moscowTime.getDate();
  const monthName = moscowTime.toLocaleDateString('ru-RU', { month: 'short' }).replace('.', '');
  const CALENDAR_ID = "1411216cba515736814d4f56a1e419347f970d9e94d1dc041c9cc0986d1dd94e@group.calendar.google.com";
  
  return (
    <div className="home-screen fade-in">
      <div className="home-header" onClick={onGoProfile}>
        <div className="greeting-text">
          <p className="greeting-sub">Рады тебя видеть,</p>
          <h2 className="greeting-name">{user.firstName || 'Гостья'}! 👋</h2>
        </div>
        <div className="user-avatar-small"><img src={user.photoURL || "/logo_final.jpg"} alt="User" /></div>
      </div>
      <div className="glass theme-card" style={{ padding: '12px 16px', marginBottom: '10px' }}>
        <div className="theme-tag" style={{ fontSize: '9px', marginBottom: '2px' }}>Тема месяца</div>
        <h3 className="theme-title" style={{ fontSize: '18px' }}>Эмоциональный Интеллект</h3>
        <p style={{ fontSize: '13px', opacity: 0.6 }}>Управление чувствами</p>
      </div>
      <div className="calendar-grid">
        <div className="glass date-tile"><span className="day-num">{dayNum}</span><span className="month-name">{monthName}</span></div>
        <a href={`https://calendar.google.com/calendar/u/0/r?src=${CALENDAR_ID}`} target="_blank" rel="noopener noreferrer" className="glass calendar-full-btn"><span>Календарь клуба</span><ChevronRight size={18} /></a>
      </div>
      <div className="doc-bar">
        <a href="https://docs.google.com/spreadsheets/d/1uesCou32MDZhkhi8Q5myvROC2KBWiMbyn8ou1lH3Izo/edit" target="_blank" rel="noopener noreferrer" className="doc-item">
          <div className="doc-icon-sq"><img src="/icon_doctors.png" alt="Doctors" /></div>
          <span className="doc-label">Врачи</span>
        </a>
        <div className="doc-item" onClick={() => window.open("https://open.spotify.com/playlist/2GOjsccJOAZxViZQhOhilF", "_blank")}>
          <div className="doc-icon-sq"><img src="/icon_spotify.png" alt="Spotify" /></div>
          <span className="doc-label">Spotify</span>
        </div>
        <div className="doc-item" onClick={() => window.open("https://music.yandex.ru/users/lisasofd/playlists/1002", "_blank")}>
          <div className="doc-icon-sq"><img src="/icon_yandex.png" alt="Yandex" /></div>
          <span className="doc-label">Я.Музыка</span>
        </div>
        <div className="doc-item" onClick={() => setTab('recipes')}>
          <div className="doc-icon-sq"><img src="/icon_recipes.png" alt="Recipes" /></div>
          <span className="doc-label">Рецепты</span>
        </div>
      </div>
    </div>
  );
}

function RecipesTab({ onBack }: { onBack: () => void }) {
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const recipes = [
    { id: 1, name: "Зеленая овсянка с авокадо", category: "Завтраки", time: "20 мин", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600&auto=format&fit=crop" },
  ];
  if (selectedRecipe) return (
    <div className="recipe-detail-view fade-in">
      <button onClick={() => setSelectedRecipe(null)} className="back-btn-round" style={{ background:'none', border:'none', color:'#fff', padding: 20 }}><ChevronLeft size={24} /></button>
      <div style={{ padding: '20px' }}><h2>{selectedRecipe.name}</h2></div>
    </div>
  );
  return (
    <div className="recipes-screen fade-in" style={{ padding: '20px' }}>
      <button onClick={onBack} style={{ background:'none', border:'none', color:'#fff', display:'flex', alignItems:'center', gap: 5, marginBottom: 20 }}><ChevronLeft size={20} /> Назад</button>
      {recipes.map(r => (
        <div key={r.id} className="glass recipe-card" onClick={() => setSelectedRecipe(r)} style={{ marginBottom: 15 }}>
          <img src={r.image} alt={r.name} style={{ width:'100%', height: 140, objectFit:'cover', borderRadius: '20px 20px 0 0' }} />
          <div style={{ padding: 15 }}><h3>{r.name}</h3></div>
        </div>
      ))}
    </div>
  );
}

function ProfileTab({ user, onLogout }: { user: any, onLogout: () => void }) {
  return (
    <div className="fade-in" style={{ padding: '20px' }}>
      <div className="glass" style={{ width: '100%', padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div className="logo-image-wrap" style={{ borderRadius: '40px', width: '80px', height: '80px' }}><img src="/logo_final.jpg" alt="Avatar" /></div>
        <h2 style={{ fontSize: '20px', fontWeight: '700' }}>{user.firstName} {user.lastName}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>@{user.tgNick}</p>
      </div>
      <button className="main-btn secondary-btn" onClick={onLogout}>Выйти из аккаунта</button>
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState({ firstName: '', lastName: '', tgNick: '', email: '', password: '', birthDate: '', about: '' });

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const birthDateRef = useRef<HTMLInputElement>(null);
  const tgNickRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    const savedUser = sessionStorage.getItem('clubUser');
    if (savedUser) { setUser(JSON.parse(savedUser)); setIsAuthenticated(true); }
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    if (user.firstName && user.lastName) {
      await setDoc(doc(db, "users", user.tgNick || user.firstName), user);
      sessionStorage.setItem('clubUser', JSON.stringify(user));
      setIsAuthenticated(true);
    }
  };

  if (showSplash) return <SplashScreen />;

  if (!isAuthenticated) return (
    <div className="app-container">
      <div className="auth-wrapper fade-in" style={{ padding: '100px 20px' }}>
        <div className="glass auth-card" style={{ padding: 25 }}>
          <h1 style={{ fontSize: 24, textAlign:'center', marginBottom: 20 }}>Dukalis Club</h1>
          <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap: 15 }}>
            <input ref={firstNameRef} type="text" className="input-field" placeholder="Имя" value={user.firstName} onChange={e => setUser({...user, firstName: e.target.value})} onKeyDown={e => e.key === 'Enter' && lastNameRef.current?.focus()} />
            <input ref={lastNameRef} type="text" className="input-field" placeholder="Фамилия" value={user.lastName} onChange={e => setUser({...user, lastName: e.target.value})} onKeyDown={e => e.key === 'Enter' && birthDateRef.current?.focus()} />
            <div style={{ position:'relative' }}><CalendarDays size={16} style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', opacity:0.5 }} /><input ref={birthDateRef} type="text" className="input-field" placeholder="ДД.ММ.ГГГГ" style={{ paddingLeft: 44 }} value={user.birthDate} onChange={e => setUser({...user, birthDate: e.target.value})} onKeyDown={e => e.key === 'Enter' && tgNickRef.current?.focus()} /></div>
            <div style={{ position:'relative' }}><AtSign size={16} style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', opacity:0.5 }} /><input ref={tgNickRef} type="text" className="input-field" placeholder="Telegram" style={{ paddingLeft: 44 }} value={user.tgNick} onChange={e => setUser({...user, tgNick: e.target.value})} onKeyDown={e => e.key === 'Enter' && emailRef.current?.focus()} /></div>
            <div style={{ position:'relative' }}><Mail size={16} style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', opacity:0.5 }} /><input ref={emailRef} type="email" className="input-field" placeholder="Email" style={{ paddingLeft: 44 }} value={user.email} onChange={e => setUser({...user, email: e.target.value})} onKeyDown={e => e.key === 'Enter' && passwordRef.current?.focus()} /></div>
            <div style={{ position:'relative' }}><LockKeyhole size={16} style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', opacity:0.5 }} /><input ref={passwordRef} type="password" className="input-field" placeholder="Пароль" style={{ paddingLeft: 44 }} value={user.password} onChange={e => setUser({...user, password: e.target.value})} /></div>
            <button type="submit" className="main-btn">Войти <ArrowRight size={18} /></button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-container" style={{ position:'relative', height:'100vh' }}>
      <div className="scroll-area" style={{ height:'100%', overflowY:'auto', paddingBottom: 120 }}>
        {activeTab === 'home' && <HomeTab user={user} onGoProfile={() => setActiveTab('profile')} setTab={setActiveTab} />}
        {activeTab === 'recipes' && <RecipesTab onBack={() => setActiveTab('home')} />}
        {activeTab === 'profile' && <ProfileTab user={user} onLogout={() => { sessionStorage.removeItem('clubUser'); setIsAuthenticated(false); }} />}
      </div>
      <div className="bottom-tab-bar" style={{ position:'absolute', bottom:0, width:'100%', padding: '20px' }}>
        <div className="glass tabs-container" style={{ display:'flex', justifyContent:'space-around', padding: 10, borderRadius: 100 }}>
          <button className={clsx('tab-item', activeTab === 'home' && 'active')} onClick={() => setActiveTab('home')} style={{ background:'none', border:'none', color:'#fff', opacity: activeTab === 'home' ? 1 : 0.5 }}><MapPin size={24} /><span>Главная</span></button>
          <button className={clsx('tab-item', activeTab === 'profile' && 'active')} onClick={() => setActiveTab('profile')} style={{ background:'none', border:'none', color:'#fff', opacity: activeTab === 'profile' ? 1 : 0.5 }}><User size={24} /><span>Профиль</span></button>
        </div>
      </div>
    </div>
  );
}
