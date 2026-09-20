'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  Plus, 
  Menu, 
  X, 
  User, 
  Bookmark, 
  Settings, 
  LogOut, 
  Compass, 
  Trophy, 
  Sparkles,
  Home
} from 'lucide-react';
import { useUser } from '@/lib/hooks/useUser';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useUser();

  const [theme, setTheme] = useState('light');
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('alfaaz-theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('alfaaz-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'shayar';
  const takhallus = user?.user_metadata?.takhallus || username;
  const avatarLetter = (takhallus || username || 'S')[0]?.toUpperCase();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <Link href="/feed" className={styles.logoContainer}>
          <span className={styles.logoHindi}>अल्फ़ाज़</span>
          <span className={styles.logoEnglish}>ALFAAZ</span>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <div className={styles.desktopLinks}>
          <Link 
            href="/feed" 
            className={`${styles.navLink} ${pathname === '/feed' ? styles.navLinkActive : ''}`}
          >
            Feed
          </Link>
          <Link 
            href="/explore" 
            className={`${styles.navLink} ${pathname === '/explore' ? styles.navLinkActive : ''}`}
          >
            Explore
          </Link>
          <Link 
            href="/challenges" 
            className={`${styles.navLink} ${pathname === '/challenges' ? styles.navLinkActive : ''}`}
          >
            Challenges
          </Link>
          <Link 
            href="/card-studio" 
            className={`${styles.navLink} ${pathname === '/card-studio' ? styles.navLinkActive : ''}`}
          >
            Card Studio
          </Link>
        </div>
      </div>

      <div className={styles.navRight}>
        {/* SEARCH BUTTON (Links to /explore) */}
        <Link 
          href="/explore" 
          className={`${styles.iconBtn} ${pathname === '/explore' ? styles.iconBtnActive : ''}`} 
          aria-label="Search"
          title="Search / तलाश"
        >
          <Search size={20} strokeWidth={2.5} />
        </Link>

        {/* NOTIFICATIONS BUTTON (Links to /notifications) */}
        <Link 
          href="/notifications" 
          className={`${styles.iconBtn} ${pathname === '/notifications' ? styles.iconBtnActive : ''}`} 
          aria-label="Notifications"
          title="Notifications / इत्तिला"
        >
          <Bell size={20} strokeWidth={2.5} />
          <span className={styles.badgeDot} />
        </Link>

        {/* DARK/LIGHT MODE TOGGLE */}
        <button 
          className={styles.iconBtn} 
          onClick={toggleTheme} 
          aria-label="Toggle Theme"
          title={theme === 'light' ? 'रात मोड (Dark)' : 'दिन मोड (Light)'}
        >
          {theme === 'light' ? <Moon size={20} strokeWidth={2.5} /> : <Sun size={20} strokeWidth={2.5} />}
        </button>

        {/* COMPOSE BUTTON */}
        <Link href="/compose" className={styles.composeBtn} aria-label="Compose Sher" title="शेर लिखें">
          <Plus size={20} strokeWidth={3} />
          <span className={styles.composeText}>Likhein</span>
        </Link>

        {/* USER PROFILE / AUTH SECTION */}
        {user ? (
          <div className={styles.profileWrapper} ref={dropdownRef}>
            <button 
              className={styles.avatarBtn} 
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              aria-label="User Profile Menu"
              title={takhallus}
            >
              <span className={styles.avatarText}>{avatarLetter}</span>
            </button>

            {profileDropdownOpen && (
              <div className={styles.profileDropdown}>
                <div className={styles.dropdownHeader}>
                  <span className={styles.dropdownTakhallus}>{takhallus}</span>
                  <span className={styles.dropdownHandle}>@{username}</span>
                </div>

                <div className={styles.dropdownDivider} />

                <Link href={`/u/${username.toLowerCase()}`} className={styles.dropdownItem}>
                  <User size={16} />
                  <span>Mera Diwan (Profile)</span>
                </Link>

                <Link href="/saved" className={styles.dropdownItem}>
                  <Bookmark size={16} />
                  <span>Mehfooz (Saved)</span>
                </Link>

                <Link href="/settings" className={styles.dropdownItem}>
                  <Settings size={16} />
                  <span>Settings</span>
                </Link>

                <div className={styles.dropdownDivider} />

                <button 
                  onClick={() => { signOut(); setProfileDropdownOpen(false); }} 
                  className={`${styles.dropdownItem} ${styles.logoutItem}`}
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className={styles.loginBtn}>
            लॉग इन
          </Link>
        )}

        {/* MOBILE HAMBURGER BUTTON */}
        <button className={styles.hamburgerBtn} onClick={toggleMenu} aria-label="Menu">
          {menuOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
        </button>
      </div>

      {/* MOBILE MENU DRAWER */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {user ? (
            <div className={styles.mobileUserHeader}>
              <div className={styles.mobileAvatar}>{avatarLetter}</div>
              <div>
                <div className={styles.mobileUserName}>{takhallus}</div>
                <div className={styles.mobileUserHandle}>@{username}</div>
              </div>
            </div>
          ) : (
            <div className={styles.mobileAuthRow}>
              <Link href="/login" className={styles.mobileLoginBtn}>लॉग इन (Login)</Link>
              <Link href="/signup" className={styles.mobileSignupBtn}>रजिस्टर (Sign Up)</Link>
            </div>
          )}

          <div className={styles.mobileNavLinks}>
            <Link href="/feed" className={styles.mobileNavLink}>
              <Home size={20} />
              <span>Feed (तज़ा कलाम)</span>
            </Link>
            <Link href="/explore" className={styles.mobileNavLink}>
              <Search size={20} />
              <span>Explore & Search (तलाश)</span>
            </Link>
            <Link href="/compose" className={styles.mobileNavLink}>
              <Plus size={20} />
              <span>Likhein (शेर लिखें)</span>
            </Link>
            <Link href="/card-studio" className={styles.mobileNavLink}>
              <Sparkles size={20} />
              <span>Card Studio (कार्ड बनाएं)</span>
            </Link>
            <Link href="/challenges" className={styles.mobileNavLink}>
              <Trophy size={20} />
              <span>Challenges (तराही मिसरा)</span>
            </Link>
            <Link href="/notifications" className={styles.mobileNavLink}>
              <Bell size={20} />
              <span>Notifications (इत्तिला)</span>
            </Link>
            {user && (
              <>
                <Link href={`/u/${username.toLowerCase()}`} className={styles.mobileNavLink}>
                  <User size={20} />
                  <span>Mera Diwan (Profile)</span>
                </Link>
                <Link href="/saved" className={styles.mobileNavLink}>
                  <Bookmark size={20} />
                  <span>Mehfooz Shers (Saved)</span>
                </Link>
                <Link href="/settings" className={styles.mobileNavLink}>
                  <Settings size={20} />
                  <span>Settings</span>
                </Link>
              </>
            )}
          </div>

          <div className={styles.mobileMenuFooter}>
            <button className={styles.mobileThemeBtn} onClick={toggleTheme}>
              {theme === 'light' ? (
                <>
                  <Moon size={18} />
                  <span>Raat Mode (रात)</span>
                </>
              ) : (
                <>
                  <Sun size={18} />
                  <span>Din Mode (दिन)</span>
                </>
              )}
            </button>

            {user && (
              <button onClick={() => { signOut(); setMenuOpen(false); }} className={styles.mobileLogoutBtn}>
                <LogOut size={18} />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
