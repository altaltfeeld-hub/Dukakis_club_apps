import React, { useState, useEffect } from 'react';
import { User, Sparkles, MapPin, Search, Calendar, ChevronRight, Mail, AtSign, ArrowRight, LockKeyhole, CalendarDays } from 'lucide-react';
import clsx from 'clsx';

function SplashScreen() {
  return (
    <div className="splash-fullscreen">
      <div className="splash-logo-box">
        <img src="/logo.jpeg" alt="Dukalis Club Logo" />
      </div>
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  
  const [user, setUser] = useState({ 
    firstName: '', 
    lastName: '', 
    tgNick: '', 
    email: '', 
    password: '',
    birthDate: '',
    about: 'Привет! Я обожаю саморазвитие, маркетинг и психологию. Рада быть частью этого комьюнити!'
  });

  useEffect(() => {
    // Включаем таймер для сплэш-экрана
    const timer = setTimeout(() => setShowSplash(false), 2500);
    
    // Telegram Web App init
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      if (tg.initDataUnsafe?.user) {
        setUser(prev => ({
          ...prev,
          firstName: tg.initDataUnsafe.user.first_name || prev.firstName,
          lastName: tg.initDataUnsafe.user.last_name || prev.lastName,
          tgNick: tg.initDataUnsafe.user.username || prev.tgNick,
        }));
      }
    }

    // Используем sessionStorage, чтобы при перезагрузке можно было заново тестировать форму входа
    const savedUser = sessionStorage.getItem('clubUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user.firstName && user.lastName && user.tgNick && user.email && user.password && user.birthDate) {
      sessionStorage.setItem('clubUser', JSON.stringify(user));
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('clubUser');
    setIsAuthenticated(false);
    setUser({ ...user, firstName: '', lastName: '', password: '' });
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!isAuthenticated) {
    return (
      <div className="app-container">
        <div className="auth-wrapper fade-in">
          <div className="header-centered">
            <h1 className="header-title">Dukalis Club</h1>
            <p className="header-subtitle">Для приватности клуба регистрация выполняется только один раз.</p>
          </div>

          <div className="glass auth-card">
            <div className="main-logo-wrap">
              <img src="/logo.jpeg" alt="Main Logo" />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Вход в клуб</h2>
            
            <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div className="input-group" style={{ flex: 1 }}>
                  <span className="input-label">Имя</span>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Анна"
                    value={user.firstName}
                    onChange={(e) => setUser({...user, firstName: e.target.value})}
                    required 
                  />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <span className="input-label">Фамилия</span>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Иванова"
                    value={user.lastName}
                    onChange={(e) => setUser({...user, lastName: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="input-group">
                <span className="input-label">Дата рождения</span>
                <div style={{ position: 'relative' }}>
                  <CalendarDays size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: '#8E8E93' }} />
                  <input 
                    type="date" 
                    className="input-field" 
                    style={{ paddingLeft: '40px' }}
                    value={user.birthDate}
                    onChange={(e) => setUser({...user, birthDate: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="input-group">
                <span className="input-label">Ник в Telegram</span>
                <div style={{ position: 'relative' }}>
                  <AtSign size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: '#8E8E93' }} />
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="anya_ivanova"
                    style={{ paddingLeft: '40px' }}
                    value={user.tgNick}
                    onChange={(e) => setUser({...user, tgNick: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="input-group">
                <span className="input-label">Почта</span>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: '#8E8E93' }} />
                  <input 
                    type="email" 
                    className="input-field" 
                    placeholder="email@example.com"
                    style={{ paddingLeft: '40px' }}
                    value={user.email}
                    onChange={(e) => setUser({...user, email: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="input-group">
                <span className="input-label">Придумайте пароль</span>
                <div style={{ position: 'relative' }}>
                  <LockKeyhole size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: '#8E8E93' }} />
                  <input 
                    type="password" 
                    className="input-field" 
                    placeholder="••••••••"
                    style={{ paddingLeft: '40px' }}
                    value={user.password}
                    onChange={(e) => setUser({...user, password: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div style={{ marginTop: '8px' }}>
                <button type="submit" className="main-btn">
                  Войти
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="scroll-area">
        {activeTab === 'home' && <HomeTab firstName={user.firstName} onGoProfile={() => setActiveTab('profile')} />}
        {activeTab === 'profile' && <ProfileTab user={user} onLogout={handleLogout} />}
      </div>

      {/* Bottom Tabs */}
      <div className="bottom-tab-bar">
        <div className="glass tabs-container">
          <button 
            className={clsx('tab-item', activeTab === 'home' && 'active')}
            onClick={() => setActiveTab('home')}
          >
            <MapPin size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
            <span>Главная</span>
          </button>
          
          <button 
            className={clsx('tab-item', activeTab === 'search' && 'active')}
            onClick={() => setActiveTab('search')}
          >
            <Search size={24} strokeWidth={activeTab === 'search' ? 2.5 : 2} />
            <span>Ветки</span>
          </button>

          <button 
            className={clsx('tab-item', activeTab === 'profile' && 'active')}
            onClick={() => setActiveTab('profile')}
          >
            <User size={24} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
            <span>Профиль</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function HomeTab({ firstName, onGoProfile }: { firstName: string, onGoProfile: () => void }) {
  // Текущая дата
  const today = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

  return (
    <div className="fade-in">
      <div className="glass" style={{ padding: '24px 20px', textAlign: 'left', marginBottom: '28px', cursor: 'pointer' }} onClick={onGoProfile}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '6px' }}>
          Привет, {firstName}! 🖐
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Нажми сюда, чтобы перейти в профиль и заполнить информацию.
        </p>
      </div>

      <h3 className="section-title">Тема месяца</h3>
      <div className="glass" style={{ padding: '20px', marginBottom: '28px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(212, 102, 130, 0.2) 0%, rgba(120, 184, 180, 0.2) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <Sparkles color="var(--accent-pink)" size={28} />
          <h4 style={{ fontSize: '20px', fontWeight: '700' }}>Эмоциональный Интеллект</h4>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
          В этом месяце мы погружаемся в искусство управления своими эмоциями, разбираем выгорание и учимся находить ресурс в себе.
        </p>
      </div>

      <h3 className="section-title">Календарь клуба</h3>
      <div className="nav-grid">
        <div className="glass nav-grid-item" style={{ background: 'rgba(212, 102, 130, 0.1)' }}>
          <div className="nav-icon" style={{ background: 'rgba(212, 102, 130, 0.2)', color: 'var(--accent-pink)' }}><CalendarDays size={24} /></div>
          <div style={{ fontWeight: '600', fontSize: '15px' }}>Общий календарь</div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Все события месяца</p>
        </div>
        <div className="glass nav-grid-item" style={{ background: 'rgba(120, 184, 180, 0.1)' }}>
          <div className="nav-icon" style={{ background: 'rgba(120, 184, 180, 0.2)', color: 'var(--accent-teal)' }}><MapPin size={24} /></div>
          <div style={{ fontWeight: '600', fontSize: '15px' }}>Встречи Оффлайн</div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Записи на оффлайн</p>
        </div>
      </div>

      <h3 className="section-title">События сегодня ({today})</h3>
      <div className="activity-list">
        <div className="glass activity-card">
          <div className="activity-avatar" style={{ color: 'var(--accent-teal)' }}>🎙️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>Эфир: Психология эмоций</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
               <Calendar size={12} /> Сегодня в 19:00
            </div>
          </div>
          <ChevronRight size={18} color="#A8A8B3" />
        </div>
        
        <div className="glass activity-card">
          <div className="activity-avatar" style={{ color: 'var(--accent-pink)' }}>📖</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>Обсуждение книжного клуба</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
               <Calendar size={12} /> Сегодня в 20:30
            </div>
          </div>
          <ChevronRight size={18} color="#A8A8B3" />
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ user, onLogout }: { user: any, onLogout: () => void }) {
  
  // Проверка на День Рождения.
  const checkBirthday = () => {
    if (!user.birthDate) return false;
    const today = new Date();
    const bd = new Date(user.birthDate);
    return today.getMonth() === bd.getMonth() && today.getDate() === bd.getDate();
  };
  
  const isBirthday = checkBirthday();

  return (
    <div className="fade-in">
      <div className="glass" style={{ width: '100%', padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div className="logo-image-wrap" style={{ borderRadius: '40px', width: '80px', height: '80px' }}>
           <img src="/logo.jpeg" alt="Avatar" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            {user.firstName} {user.lastName}
            {isBirthday && <span style={{ fontSize: '22px' }}>🎂</span>}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>@{user.tgNick}</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '4px' }}>
          <div style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '18px', fontWeight: '700' }}>12</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Штампов</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '18px', fontWeight: '700' }}>4</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Ачивки</div>
          </div>
        </div>
      </div>

      <div className="glass" style={{ padding: '20px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Почта</span>
          <span style={{ fontWeight: '500', fontSize: '14px' }}>{user.email}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Дата рождения</span>
          <span style={{ fontWeight: '500', fontSize: '14px' }}>{new Date(user.birthDate).toLocaleDateString('ru-RU')}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>О себе</span>
          <p style={{ fontSize: '14px', lineHeight: '1.4', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '12px' }}>
            {user.about}
          </p>
        </div>
      </div>

      <h3 className="section-title">Мои интересы</h3>
      <div className="pill-group" style={{ marginBottom: '24px' }}>
        <div className="pill">Книжный клуб</div>
        <div className="pill">Оффлайн</div>
        <div className="pill">Саморазвитие</div>
        <div className="pill">Эфиры</div>
      </div>

      <button className="main-btn secondary-btn" style={{ marginBottom: '40px' }} onClick={onLogout}>
        Выйти из аккаунта
      </button>
    </div>
  );
}

export default App;
