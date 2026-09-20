'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Plus, MessageCircle, User } from 'lucide-react';
import styles from './BottomNav.module.css';

export default function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    {
      id: 'home',
      href: '/feed',
      label: 'Home',
      icon: (active: boolean) => <Home size={24} strokeWidth={active ? 2.5 : 2} />
    },
    {
      id: 'explore',
      href: '/explore',
      label: 'Explore',
      icon: (active: boolean) => <Compass size={24} strokeWidth={active ? 2.5 : 2} />
    }
  ];

  const rightTabs = [
    {
      id: 'chat',
      href: '/chat',
      label: 'Chat',
      icon: (active: boolean) => <MessageCircle size={24} strokeWidth={active ? 2.5 : 2} />
    },
    {
      id: 'profile',
      href: '/profile',
      label: 'Profile',
      icon: (active: boolean) => <User size={24} strokeWidth={active ? 2.5 : 2} />
    }
  ];

  return (
    <nav className={styles.bottomNav}>
      {tabs.map(tab => {
        const isActive = pathname === tab.href;
        return (
          <Link key={tab.id} href={tab.href} className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}>
            {tab.icon(isActive)}
            {isActive && <span className={styles.label}>{tab.label}</span>}
            {isActive && <div className={styles.indicator} />}
          </Link>
        );
      })}

      <div className={styles.composeWrapper}>
        <Link href="/compose" className={styles.composeTab} aria-label="Compose">
          <Plus size={28} strokeWidth={2.5} />
        </Link>
      </div>

      {rightTabs.map(tab => {
        const isActive = pathname === tab.href;
        return (
          <Link key={tab.id} href={tab.href} className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}>
            {tab.icon(isActive)}
            {isActive && <span className={styles.label}>{tab.label}</span>}
            {isActive && <div className={styles.indicator} />}
          </Link>
        );
      })}
    </nav>
  );
}
