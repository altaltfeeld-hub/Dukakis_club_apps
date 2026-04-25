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
  ChevronLeft,
  ShieldX,
  Shield,
  Ban,
  CheckCircle,
  Download,
  Trash2
} from 'lucide-react';
import clsx from 'clsx';
import { db } from './firebase';
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';

const SUPER_ADMIN = 'l_turgeneva';

/* ============================
   SPLASH SCREEN
   ============================ */
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

/* ============================
   BLOCKED SCREEN
   ============================ */
function BlockedScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: 40 }}>
      <div className="glass" style={{ padding: 40, textAlign: 'center', maxWidth: 340 }}>
        <ShieldX size={48} style={{ color: 'var(--accent-pink)', marginBottom: 20 }} />
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Доступ заблокирован</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
          Твой аккаунт был деактивирован администратором клуба. Если это ошибка — свяжись с администратором.
        </p>
        <button className="main-btn secondary-btn" onClick={onRetry}>Попробовать снова</button>
      </div>
    </div>
  );
}

/* ============================
   HOME TAB
   ============================ */
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

/* ============================
   RECIPES TAB
   ============================ */
function RecipesTab({ onBack }: { onBack: () => void }) {
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const recipes = [
    { id: 1, name: "Зеленая овсянка с авокадо", category: "Завтраки", time: "20 мин", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600&auto=format&fit=crop" },
  ];
  if (selectedRecipe) return (
    <div className="recipe-detail-view fade-in">
      <button onClick={() => setSelectedRecipe(null)} style={{ background:'none', border:'none', color:'#fff', padding: 20 }}><ChevronLeft size={24} /></button>
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

/* ============================
   PROFILE TAB
   ============================ */
function ProfileTab({ user, onLogout }: { user: any, onLogout: () => void }) {
  return (
    <div className="fade-in" style={{ padding: '20px' }}>
      <div className="glass" style={{ width: '100%', padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div className="logo-image-wrap" style={{ borderRadius: '40px', width: '80px', height: '80px', overflow: 'hidden' }}>
          <img src="/logo_final.jpg" alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '700' }}>{user.firstName} {user.lastName}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '-8px' }}>@{user.tgNick.replace('@', '')}</p>
        
        <div style={{ width: '100%', background: 'rgba(0,0,0,0.2)', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Дата рождения:</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{user.birthDate}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Email:</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{user.email}</span>
          </div>
        </div>

      </div>
      <button className="main-btn secondary-btn" onClick={onLogout} style={{ background: 'rgba(255, 75, 75, 0.15)', color: '#FF4B4B' }}>Выйти из аккаунта</button>
    </div>
  );
}

/* ============================
   ADMIN TAB (только для l_turgeneva)
   ============================ */
function AdminTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, 'users'));
    const list: any[] = [];
    snap.forEach(d => list.push({ id: d.id, ...d.data() }));
    list.sort((a, b) => (a.firstName || '').localeCompare(b.firstName || ''));
    setUsers(list);
    setLoading(false);
  };

  useEffect(() => { loadUsers(); }, []);

  const toggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
    await updateDoc(doc(db, 'users', userId), { status: newStatus });
    loadUsers();
  };

  const deleteUser = async (userId: string) => {
    if (confirm(`Удалить ${userId}? Это действие нельзя отменить.`)) {
      await deleteDoc(doc(db, 'users', userId));
      loadUsers();
    }
  };

  const exportData = async () => {
    const snap = await getDocs(collection(db, 'users'));
    const data: any[] = [];
    snap.forEach(d => data.push({ id: d.id, ...d.data() }));
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dukalis_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fade-in" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Админ-панель</h2>
        <button onClick={exportData} style={{ background: 'rgba(120,184,180,0.2)', border: 'none', color: 'var(--accent-teal)', padding: '8px 14px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
          <Download size={16} /> Бэкап
        </button>
      </div>

      {loading ? <p style={{ opacity: 0.5 }}>Загрузка...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {users.map(u => (
            <div key={u.id} className="glass" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 15 }}>{u.firstName} {u.lastName}</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>@{u.tgNick || u.id}</p>
                <p style={{ fontSize: 11, color: u.status === 'blocked' ? '#FF4B4B' : 'var(--accent-teal)', fontWeight: 700, textTransform: 'uppercase', marginTop: 4 }}>
                  {u.status === 'blocked' ? '⛔ Заблокирован' : '✅ Активен'}
                </p>
              </div>
              <button onClick={() => toggleStatus(u.id, u.status)} style={{ background: u.status === 'blocked' ? 'rgba(120,184,180,0.2)' : 'rgba(255,75,75,0.15)', border: 'none', borderRadius: 12, padding: '8px 10px', color: u.status === 'blocked' ? 'var(--accent-teal)' : '#FF4B4B' }}>
                {u.status === 'blocked' ? <CheckCircle size={20} /> : <Ban size={20} />}
              </button>
              <button onClick={() => deleteUser(u.id)} style={{ background: 'rgba(255,75,75,0.1)', border: 'none', borderRadius: 12, padding: '8px 10px', color: '#FF4B4B' }}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================
   MAIN APP
   ============================ */
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState({ firstName: '', lastName: '', tgNick: '', email: '', password: '', birthDate: '', about: '' });

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const birthDateRef = useRef<HTMLInputElement>(null);
  const tgNickRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  /* --- ПРОВЕРКА СТАТУСА ПОЛЬЗОВАТЕЛЯ В FIRESTORE --- */
  const checkUserStatus = async (userData: any): Promise<'active' | 'blocked' | 'not_found'> => {
    try {
      const userKey = userData.tgNick || userData.firstName;
      const userDoc = await getDoc(doc(db, "users", userKey));
      if (!userDoc.exists()) return 'not_found';
      const data = userDoc.data();
      return data.status === 'blocked' ? 'blocked' : 'active';
    } catch {
      return 'active'; // При ошибке сети — пускаем (оффлайн-режим)
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);

    // ✅ ИСПОЛЬЗУЕМ localStorage ВМЕСТО sessionStorage — данные сохраняются навсегда
    const savedUser = localStorage.getItem('clubUser');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      // Проверяем статус в Firestore перед тем как пустить
      checkUserStatus(parsed).then(status => {
        if (status === 'blocked') {
          setIsBlocked(true);
          setIsAuthenticated(false);
        } else if (status === 'not_found') {
          // Документ удалён — очищаем localStorage, показываем форму
          localStorage.removeItem('clubUser');
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      });
    }

    // Telegram WebApp auto-fill
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      if (tg.initDataUnsafe?.user) {
        const tgUser = tg.initDataUnsafe.user;
        setUser(prev => ({
          ...prev,
          firstName: tgUser.first_name || prev.firstName,
          lastName: tgUser.last_name || prev.lastName,
          tgNick: tgUser.username || prev.tgNick,
        }));

        // Проверяем, есть ли пользователь в базе
        const checkTgUser = async () => {
          const userDoc = await getDoc(doc(db, "users", tgUser.username || tgUser.id.toString()));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.status === 'blocked') {
              setIsBlocked(true);
            } else {
              setUser(userData as any);
              setIsAuthenticated(true);
              localStorage.setItem('clubUser', JSON.stringify(userData));
            }
          }
        };
        checkTgUser();
      }
    }

    return () => clearTimeout(timer);
  }, []);

  /* --- РЕГИСТРАЦИЯ / ВХОД --- */
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoginError('');

    if (user.firstName && user.lastName && user.tgNick && user.email && user.password && user.birthDate) {
      // Нормализуем ник для базы данных: убираем '@' и переводим в нижний регистр, чтобы избежать двойных регистраций
      const cleanTgNick = user.tgNick.trim().replace(/^@/, '').toLowerCase();
      const userKey = cleanTgNick || user.firstName.trim();

      // Проверяем, существует ли пользователь с таким ником
      const existingDoc = await getDoc(doc(db, "users", userKey));
      
      if (existingDoc.exists()) {
        const existingData = existingDoc.data();

        // Заблокирован?
        if (existingData.status === 'blocked') {
          setIsBlocked(true);
          return;
        }

        // Ожидает одобрения?
        if (existingData.status === 'pending') {
          setLoginError('Твоя заявка на рассмотрении. Ожидай одобрения администратора.');
          return;
        }

        // ПРОВЕРКА ПАРОЛЯ
        if (existingData.password !== user.password) {
          setLoginError('Неверный пароль. Этот ник уже зарегистрирован.');
          return;
        }

        // Пароль совпал — скачиваем все данные пользователя из базы, игнорируя то, что он сейчас ввёл (например, другую дату)
        localStorage.setItem('clubUser', JSON.stringify(existingData));
        setUser(existingData as any);
        setIsAuthenticated(true);
        return;
      }

      // Новый пользователь — регистрация
      const userData = {
        ...user,
        tgNick: cleanTgNick,
        status: 'active',
        registeredAt: new Date().toISOString(),
      };
      await setDoc(doc(db, "users", userKey), userData);
      localStorage.setItem('clubUser', JSON.stringify(userData));
      setUser(userData as any);
      setIsAuthenticated(true);
    }
  };

  /* --- ВЫХОД --- */
  const handleLogout = () => {
    localStorage.removeItem('clubUser');
    setIsAuthenticated(false);
    setUser({ firstName: '', lastName: '', tgNick: '', email: '', password: '', birthDate: '', about: '' });
  };

  /* --- ПОВТОРНАЯ ПРОВЕРКА (для blocked экрана) --- */
  const handleRetry = async () => {
    const savedUser = localStorage.getItem('clubUser');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      const status = await checkUserStatus(parsed);
      if (status === 'active') {
        setIsBlocked(false);
        setIsAuthenticated(true);
      } else if (status === 'not_found') {
        localStorage.removeItem('clubUser');
        setIsBlocked(false);
        setIsAuthenticated(false);
      }
    } else {
      setIsBlocked(false);
    }
  };

  /* --- RENDER --- */
  if (showSplash) return <SplashScreen />;
  if (isBlocked) return <BlockedScreen onRetry={handleRetry} />;

  if (!isAuthenticated) return (
    <div className="app-container">
      <div className="auth-wrapper fade-in" style={{ padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass auth-card" style={{ padding: '30px 20px', width: '100%', maxWidth: '400px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ width: 80, height: 80, borderRadius: 24, marginBottom: 16, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
              <img src="/logo_final.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h1 style={{ fontSize: 24, textAlign: 'center', marginBottom: 8, fontWeight: 700 }}>Dukalis Club</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 240, lineHeight: 1.4 }}>
              Для приватности клуба регистрация выполняется только один раз.
            </p>
          </div>
          <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap: 15, width: '100%' }}>
            <input ref={firstNameRef} type="text" className="input-field" placeholder="Имя" value={user.firstName} onChange={e => setUser({...user, firstName: e.target.value})} onKeyDown={e => e.key === 'Enter' && lastNameRef.current?.focus()} required />
            <input ref={lastNameRef} type="text" className="input-field" placeholder="Фамилия" value={user.lastName} onChange={e => setUser({...user, lastName: e.target.value})} onKeyDown={e => e.key === 'Enter' && birthDateRef.current?.focus()} required />
            <div style={{ position:'relative' }}>
              <CalendarDays size={16} style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', opacity:0.5 }} />
              <input ref={birthDateRef} type="text" className="input-field" placeholder="ДД.ММ.ГГГГ" style={{ paddingLeft: 44 }} value={user.birthDate} 
                onChange={e => {
                  let val = e.target.value.replace(/\D/g, ''); 
                  if (val.length > 8) val = val.slice(0, 8);
                  if (val.length >= 5) {
                    val = `${val.slice(0, 2)}.${val.slice(2, 4)}.${val.slice(4)}`;
                  } else if (val.length >= 3) {
                    val = `${val.slice(0, 2)}.${val.slice(2)}`;
                  }
                  setUser({...user, birthDate: val});
                }} 
                onKeyDown={e => e.key === 'Enter' && tgNickRef.current?.focus()} required 
              />
            </div>
            <div style={{ position:'relative' }}><AtSign size={16} style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', opacity:0.5 }} /><input ref={tgNickRef} type="text" className="input-field" placeholder="Telegram" style={{ paddingLeft: 44 }} value={user.tgNick} onChange={e => setUser({...user, tgNick: e.target.value})} onKeyDown={e => e.key === 'Enter' && emailRef.current?.focus()} required /></div>
            <div style={{ position:'relative' }}><Mail size={16} style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', opacity:0.5 }} /><input ref={emailRef} type="email" className="input-field" placeholder="Email" style={{ paddingLeft: 44 }} value={user.email} onChange={e => setUser({...user, email: e.target.value})} onKeyDown={e => e.key === 'Enter' && passwordRef.current?.focus()} required /></div>
            <div style={{ position:'relative' }}><LockKeyhole size={16} style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', opacity:0.5 }} /><input ref={passwordRef} type="password" className="input-field" placeholder="Пароль" style={{ paddingLeft: 44 }} value={user.password} onChange={e => setUser({...user, password: e.target.value})} required /></div>
            {loginError && <p style={{ color: '#FF4B4B', fontSize: 13, textAlign: 'center' }}>{loginError}</p>}
            <button type="submit" className="main-btn">Войти <ArrowRight size={18} /></button>
          </form>
        </div>
      </div>
    </div>
  );

  const isAdmin = user.tgNick === SUPER_ADMIN;

  return (
    <div className="app-container" style={{ position:'relative', height:'100vh' }}>
      <div className="scroll-area" style={{ height:'100%', overflowY:'auto', paddingBottom: 120 }}>
        {activeTab === 'home' && <HomeTab user={user} onGoProfile={() => setActiveTab('profile')} setTab={setActiveTab} />}
        {activeTab === 'recipes' && <RecipesTab onBack={() => setActiveTab('home')} />}
        {activeTab === 'profile' && <ProfileTab user={user} onLogout={handleLogout} />}
        {activeTab === 'admin' && isAdmin && <AdminTab />}
      </div>
      <div className="bottom-tab-bar" style={{ position:'absolute', bottom:0, width:'100%', padding: '20px' }}>
        <div className="glass tabs-container" style={{ display:'flex', justifyContent:'space-around', padding: 10, borderRadius: 100 }}>
          <button className={clsx('tab-item', activeTab === 'home' && 'active')} onClick={() => setActiveTab('home')} style={{ background:'none', border:'none', color:'#fff', opacity: activeTab === 'home' ? 1 : 0.5 }}><MapPin size={24} /><span>Главная</span></button>
          <button className={clsx('tab-item', activeTab === 'profile' && 'active')} onClick={() => setActiveTab('profile')} style={{ background:'none', border:'none', color:'#fff', opacity: activeTab === 'profile' ? 1 : 0.5 }}><User size={24} /><span>Профиль</span></button>
          {isAdmin && <button className={clsx('tab-item', activeTab === 'admin' && 'active')} onClick={() => setActiveTab('admin')} style={{ background:'none', border:'none', color:'#fff', opacity: activeTab === 'admin' ? 1 : 0.5 }}><Shield size={20} /><span>Админ</span></button>}
        </div>
      </div>
    </div>
  );
}
