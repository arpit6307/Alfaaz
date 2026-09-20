'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  UserRound, 
  Paintbrush, 
  Bell, 
  Shield, 
  FileText, 
  Info, 
  LogOut, 
  Trash2, 
  Check, 
  Moon, 
  Sun, 
  Save, 
  RefreshCw, 
  Heart, 
  Sparkles,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/lib/hooks/useUser';
import styles from './page.module.css';

type SettingsTab = 'profile' | 'appearance' | 'notifications' | 'privacy' | 'language' | 'about';

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const { user, signOut } = useUser();

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('standard');
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile Form States
  const [takhallus, setTakhallus] = useState('');
  const [bio, setBio] = useState('');
  const [preferredScript, setPreferredScript] = useState('devanagari');

  // Notification Preferences
  const [notifWah, setNotifWah] = useState(true);
  const [notifComments, setNotifComments] = useState(true);
  const [notifFollowers, setNotifFollowers] = useState(true);
  const [notifDigest, setNotifDigest] = useState(false);

  // Privacy & Safety
  const [dmPermission, setDmPermission] = useState('everyone');
  const [profileVisibility, setProfileVisibility] = useState('public');

  // Load existing user profile & preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem('alfaaz-theme') || 'light';
    setTheme(savedTheme);

    const savedNotifs = localStorage.getItem('alfaaz-notif-prefs');
    if (savedNotifs) {
      try {
        const parsed = JSON.parse(savedNotifs);
        if (parsed.wah !== undefined) setNotifWah(parsed.wah);
        if (parsed.comments !== undefined) setNotifComments(parsed.comments);
        if (parsed.followers !== undefined) setNotifFollowers(parsed.followers);
        if (parsed.digest !== undefined) setNotifDigest(parsed.digest);
      } catch (e) {}
    }

    if (user) {
      const activeUserId = user.id;
      const activeMeta = user.user_metadata;
      async function loadUserData(uid: string, meta: any) {
        const { data } = await supabase
          .from('users')
          .select('takhallus, bio')
          .eq('id', uid)
          .maybeSingle();

        if (data) {
          if (data.takhallus) setTakhallus(data.takhallus);
          if (data.bio) setBio(data.bio);
        } else if (meta) {
          if (meta.takhallus) setTakhallus(meta.takhallus);
          if (meta.username) setTakhallus(meta.username);
        }
      }
      loadUserData(activeUserId, activeMeta);
    }
  }, [user, supabase]);

  // Handle Theme Change
  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('alfaaz-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Handle Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Kripya pehle log in karein.');
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('users')
        .update({
          takhallus: takhallus.trim(),
          bio: bio.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error saving profile:', error);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Notification Toggle Save
  const toggleNotif = (key: 'wah' | 'comments' | 'followers' | 'digest') => {
    const updated = {
      wah: notifWah,
      comments: notifComments,
      followers: notifFollowers,
      digest: notifDigest,
    };

    if (key === 'wah') { setNotifWah(!notifWah); updated.wah = !notifWah; }
    if (key === 'comments') { setNotifComments(!notifComments); updated.comments = !notifComments; }
    if (key === 'followers') { setNotifFollowers(!notifFollowers); updated.followers = !notifFollowers; }
    if (key === 'digest') { setNotifDigest(!notifDigest); updated.digest = !notifDigest; }

    localStorage.setItem('alfaaz-notif-prefs', JSON.stringify(updated));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // Handle Sign Out
  const handleSignOut = async () => {
    if (confirm('Kya aap waqai log out karna chahte hain?')) {
      await signOut();
      router.push('/login');
    }
  };

  // Handle Clear / Delete Session
  const handleResetSession = () => {
    if (confirm('Aapki local settings aur session reset ho jayenge. Kya aap aage badhna chahte hain?')) {
      localStorage.removeItem('alfaaz-theme');
      localStorage.removeItem('alfaaz-notif-prefs');
      signOut();
      router.push('/login');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Settings (तरतीब)</h1>
          <p className={styles.subtitle}>Apne account, theme aur zaban ki preferences manage karein</p>
        </div>
      </header>

      {/* TABS NAVIGATION */}
      <div className={styles.tabsNav}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'profile' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <UserRound size={16} />
          <span>Profile</span>
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'appearance' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('appearance')}
        >
          <Paintbrush size={16} />
          <span>Theme</span>
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'notifications' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <Bell size={16} />
          <span>Alerts</span>
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'language' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('language')}
        >
          <FileText size={16} />
          <span>Zaban</span>
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'privacy' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('privacy')}
        >
          <Shield size={16} />
          <span>Privacy</span>
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'about' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('about')}
        >
          <Info size={16} />
          <span>About</span>
        </button>
      </div>

      {saveSuccess && (
        <div className={styles.toastSuccess}>
          <Check size={18} />
          <span>Settings kamyabi se mehfooz ho gayi hain! (Saved)</span>
        </div>
      )}

      <main className={styles.main}>
        {/* 1. PROFILE SETTINGS */}
        {activeTab === 'profile' && (
          <div className={styles.panelCard}>
            <div className={styles.panelHeader}>
              <UserRound size={24} className={styles.panelIcon} />
              <div>
                <h2 className={styles.panelTitle}>Profile Settings (शायर प्रोफ़ाइल)</h2>
                <p className={styles.panelSub}>Apna takhallus aur bio update karein</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className={styles.form}>
              <div className={styles.inputWrap}>
                <label className={styles.label}>Account Email</label>
                <input 
                  type="text" 
                  disabled 
                  value={user?.email || 'Guest User (Not Logged In)'} 
                  className={`${styles.input} ${styles.inputDisabled}`} 
                />
              </div>

              <div className={styles.inputWrap}>
                <label className={styles.label}>Takhallus (तख़ल्लुस / Pen Name)</label>
                <input 
                  type="text" 
                  placeholder="e.g. ग़ालिब, Mir, साहिर..." 
                  value={takhallus}
                  onChange={(e) => setTakhallus(e.target.value)}
                  className={styles.input}
                  required
                />
                <span className={styles.helperText}>Aapke shers ke niche yahi naam dikhayi dega.</span>
              </div>

              <div className={styles.inputWrap}>
                <label className={styles.label}>Bio (शायरी परिचय / About)</label>
                <textarea 
                  rows={3}
                  placeholder="Apne baare me kuch alfaaz likhein..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.inputWrap}>
                <label className={styles.label}>Preferred Writing Script (पसंदीदा लिपि)</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioOption}>
                    <input 
                      type="radio" 
                      name="script" 
                      checked={preferredScript === 'devanagari'}
                      onChange={() => setPreferredScript('devanagari')} 
                    />
                    <span>देवनागरी (Devanagari Hindi)</span>
                  </label>
                  <label className={styles.radioOption}>
                    <input 
                      type="radio" 
                      name="script" 
                      checked={preferredScript === 'nastaliq'}
                      onChange={() => setPreferredScript('nastaliq')} 
                    />
                    <span>اُردُو (Nastaliq Urdu)</span>
                  </label>
                  <label className={styles.radioOption}>
                    <input 
                      type="radio" 
                      name="script" 
                      checked={preferredScript === 'roman'}
                      onChange={() => setPreferredScript('roman')} 
                    />
                    <span>Roman English</span>
                  </label>
                </div>
              </div>

              <button type="submit" className={styles.saveBtn} disabled={loading}>
                {loading ? <RefreshCw size={18} className={styles.spin} /> : <Save size={18} />}
                <span>Save Changes (महफ़ूज़ करें)</span>
              </button>
            </form>
          </div>
        )}

        {/* 2. APPEARANCE SETTINGS */}
        {activeTab === 'appearance' && (
          <div className={styles.panelCard}>
            <div className={styles.panelHeader}>
              <Paintbrush size={24} className={styles.panelIcon} />
              <div>
                <h2 className={styles.panelTitle}>Appearance (दिखावट & थीम)</h2>
                <p className={styles.panelSub}>Din aur Raat mode ke darmiyan chunav karein</p>
              </div>
            </div>

            <div className={styles.themeSelectorGroup}>
              <button 
                type="button"
                className={`${styles.themeBox} ${theme === 'light' ? styles.themeBoxActive : ''}`}
                onClick={() => handleThemeChange('light')}
              >
                <div className={styles.themePreviewLight}>
                  <div className={styles.previewDot} style={{ background: '#5A0F2E' }} />
                  <div className={styles.previewLine} />
                  <div className={styles.previewLineShort} />
                </div>
                <div className={styles.themeBoxFooter}>
                  <Sun size={18} />
                  <span>Din Mode (Light Parchment)</span>
                </div>
              </button>

              <button 
                type="button"
                className={`${styles.themeBox} ${theme === 'dark' ? styles.themeBoxActive : ''}`}
                onClick={() => handleThemeChange('dark')}
              >
                <div className={styles.themePreviewDark}>
                  <div className={styles.previewDot} style={{ background: '#D9A93B' }} />
                  <div className={styles.previewLineDark} />
                  <div className={styles.previewLineDarkShort} />
                </div>
                <div className={styles.themeBoxFooter}>
                  <Moon size={18} />
                  <span>Raat Mode (Dark Chandni)</span>
                </div>
              </button>
            </div>

            <div className={styles.inputWrap} style={{ marginTop: '24px' }}>
              <label className={styles.label}>Font Display Scale (फ़ॉन्ट साइज़)</label>
              <div className={styles.radioGroup}>
                <button 
                  type="button" 
                  className={`${styles.scaleBtn} ${fontSize === 'standard' ? styles.scaleActive : ''}`}
                  onClick={() => setFontSize('standard')}
                >
                  Standard (आमतौर)
                </button>
                <button 
                  type="button" 
                  className={`${styles.scaleBtn} ${fontSize === 'large' ? styles.scaleActive : ''}`}
                  onClick={() => setFontSize('large')}
                >
                  Bada (बड़ा / Large)
                </button>
                <button 
                  type="button" 
                  className={`${styles.scaleBtn} ${fontSize === 'xlarge' ? styles.scaleActive : ''}`}
                  onClick={() => setFontSize('xlarge')}
                >
                  Jali (जली / Extra Bold)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. NOTIFICATIONS SETTINGS */}
        {activeTab === 'notifications' && (
          <div className={styles.panelCard}>
            <div className={styles.panelHeader}>
              <Bell size={24} className={styles.panelIcon} />
              <div>
                <h2 className={styles.panelTitle}>Notifications Preferences (इत्तिला)</h2>
                <p className={styles.panelSub}>Chunein aapko kab alert milna chahiye</p>
              </div>
            </div>

            <div className={styles.toggleList}>
              <div className={styles.toggleRow}>
                <div>
                  <div className={styles.toggleTitle}>Wah-Wah & Reactions Alert</div>
                  <div className={styles.toggleDesc}>Jab koi aapke sher par Wah, Irshad ya Dil Se react kare</div>
                </div>
                <button 
                  type="button"
                  className={`${styles.switchBtn} ${notifWah ? styles.switchOn : ''}`}
                  onClick={() => toggleNotif('wah')}
                >
                  <div className={styles.switchHandle} />
                </button>
              </div>

              <div className={styles.toggleRow}>
                <div>
                  <div className={styles.toggleTitle}>Comments & Guftagu Alert</div>
                  <div className={styles.toggleDesc}>Jab koi aapki ghazal ya sher par comment likhe</div>
                </div>
                <button 
                  type="button"
                  className={`${styles.switchBtn} ${notifComments ? styles.switchOn : ''}`}
                  onClick={() => toggleNotif('comments')}
                >
                  <div className={styles.switchHandle} />
                </button>
              </div>

              <div className={styles.toggleRow}>
                <div>
                  <div className={styles.toggleTitle}>Naye Qadardan (Followers)</div>
                  <div className={styles.toggleDesc}>Jab koi shayar ya reader aapko follow karna shuru kare</div>
                </div>
                <button 
                  type="button"
                  className={`${styles.switchBtn} ${notifFollowers ? styles.switchOn : ''}`}
                  onClick={() => toggleNotif('followers')}
                >
                  <div className={styles.switchHandle} />
                </button>
              </div>

              <div className={styles.toggleRow}>
                <div>
                  <div className={styles.toggleTitle}>Haftawar Sher-e-Din Digest</div>
                  <div className={styles.toggleDesc}>Hafte ke sabse pasandeeda shers ka khulaasa</div>
                </div>
                <button 
                  type="button"
                  className={`${styles.switchBtn} ${notifDigest ? styles.switchOn : ''}`}
                  onClick={() => toggleNotif('digest')}
                >
                  <div className={styles.switchHandle} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. LANGUAGE SETTINGS */}
        {activeTab === 'language' && (
          <div className={styles.panelCard}>
            <div className={styles.panelHeader}>
              <FileText size={24} className={styles.panelIcon} />
              <div>
                <h2 className={styles.panelTitle}>Content Language & Script (ज़बान & लिपि)</h2>
                <p className={styles.panelSub}>Apni primary script aur transliteration chunein</p>
              </div>
            </div>

            <div className={styles.toggleList}>
              <div className={styles.toggleRow}>
                <div>
                  <div className={styles.toggleTitle}>Primary Reading Script</div>
                  <div className={styles.toggleDesc}>Feed par pehli tarjeeh kis rasm-ul-khat ko mile</div>
                </div>
                <select 
                  className={styles.select}
                  value={preferredScript}
                  onChange={(e) => {
                    setPreferredScript(e.target.value);
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 2000);
                  }}
                >
                  <option value="devanagari">हिन्दी (Devanagari)</option>
                  <option value="nastaliq">اُردُو (Nastaliq)</option>
                  <option value="roman">Roman (English)</option>
                </select>
              </div>

              <div className={styles.toggleRow}>
                <div>
                  <div className={styles.toggleTitle}>Auto Transliteration Assistant</div>
                  <div className={styles.toggleDesc}>Roman likhne par khud-ba-khud Devanagari aur Urdu me badalna</div>
                </div>
                <span className={styles.badgeActive}>Active (फ़आल)</span>
              </div>
            </div>
          </div>
        )}

        {/* 5. PRIVACY & SAFETY */}
        {activeTab === 'privacy' && (
          <div className={styles.panelCard}>
            <div className={styles.panelHeader}>
              <Shield size={24} className={styles.panelIcon} />
              <div>
                <h2 className={styles.panelTitle}>Privacy & Safety (राज़दारी)</h2>
                <p className={styles.panelSub}>Aapke shers aur messages ki hifazat</p>
              </div>
            </div>

            <div className={styles.toggleList}>
              <div className={styles.toggleRow}>
                <div>
                  <div className={styles.toggleTitle}>Who Can Message You (Guftagu)</div>
                  <div className={styles.toggleDesc}>Aapko direct message kaun bhej sakta hai</div>
                </div>
                <select 
                  className={styles.select}
                  value={dmPermission}
                  onChange={(e) => {
                    setDmPermission(e.target.value);
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 2000);
                  }}
                >
                  <option value="everyone">Everyone (Sabhi Qadardan)</option>
                  <option value="followers">Only Followers (Sirf Followers)</option>
                  <option value="none">No One (Bandh)</option>
                </select>
              </div>

              <div className={styles.toggleRow}>
                <div>
                  <div className={styles.toggleTitle}>Diwan Visibility</div>
                  <div className={styles.toggleDesc}>Aapka diwan aur profile public hai ya protected</div>
                </div>
                <select 
                  className={styles.select}
                  value={profileVisibility}
                  onChange={(e) => {
                    setProfileVisibility(e.target.value);
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 2000);
                  }}
                >
                  <option value="public">Aawami (Public)</option>
                  <option value="private">Mehfooz (Private)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 6. ABOUT ALFAAZ */}
        {activeTab === 'about' && (
          <div className={styles.panelCard}>
            <div className={styles.panelHeader}>
              <Info size={24} className={styles.panelIcon} />
              <div>
                <h2 className={styles.panelTitle}>About Alfaaz (अल्फ़ाज़ का तआरुफ़)</h2>
                <p className={styles.panelSub}>Jahan Lafz Zinda Hain</p>
              </div>
            </div>

            <div className={styles.aboutContent}>
              <div className={styles.aboutBadge}>ALFAAZ v1.0.0 — CODE: JAUN</div>
              <p className={styles.aboutText}>
                <strong>Alfaaz (अल्फ़ाज़)</strong> shairi, ghazal aur nazm ke deewano ke liye ek dedicated multi-script brutalist platform hai. Yahan Devanagari, Nastaliq aur Roman teeno lipiyo me lafz mehfooz hain.
              </p>

              <div className={styles.creditBox}>
                <Heart size={20} className={styles.heartIcon} />
                <span>Developed with ❤️ <strong>Arpit Singh Yadav</strong></span>
              </div>

              <div style={{ marginTop: '16px' }}>
                <Link href="/about" className={styles.manifestoLink}>
                  <span>Read Full Manifesto (हमारा मक़सद)</span>
                  <ExternalLink size={16} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* DANGER ZONE */}
        <div className={styles.dangerZone}>
          <button type="button" className={styles.logoutBtn} onClick={handleSignOut}>
            <LogOut size={20} />
            <span>Log Out (लॉग आउट)</span>
          </button>
          <button type="button" className={styles.deleteBtn} onClick={handleResetSession}>
            <Trash2 size={20} />
            <span>Reset Local Preferences & Session</span>
          </button>
        </div>
      </main>
    </div>
  );
}

