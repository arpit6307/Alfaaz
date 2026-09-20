'use client';

import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import styles from './Footer.module.css';

interface FooterProps {
  minimal?: boolean;
}

export default function Footer({ minimal = false }: FooterProps) {
  if (minimal) {
    return (
      <footer className={styles.minimalFooter}>
        <div className={styles.creditLine}>
          <span>Developed with</span>
          <Heart size={16} className={styles.heartIcon} fill="var(--rose, #E8386D)" strokeWidth={2} />
          <span className={styles.authorName}>Arpit Singh Yadav</span>
        </div>
      </footer>
    );
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.topSection}>
        <Link href="/" className={styles.logo}>
          अल्फ़ाज़
        </Link>
        <span className={styles.logoTagline}>ALFAAZ • WORLDWIDE SHAYARI PLATFORM</span>
        <nav className={styles.navLinks}>
          <Link href="/about" className={styles.link}>About</Link>
          <Link href="/feed" className={styles.link}>Mehfil Feed</Link>
          <Link href="/card-studio" className={styles.link}>Card Studio</Link>
          <Link href="/challenges" className={styles.link}>Challenges</Link>
          <Link href="/login" className={styles.link}>Dakhil Hon</Link>
        </nav>
      </div>
      
      <div className={styles.divider}></div>

      <div className={styles.bottomSection}>
        <div className={styles.creditLine}>
          <span>Developed with</span>
          <Heart size={16} className={styles.heartIcon} fill="var(--rose, #E8386D)" strokeWidth={2} />
          <span className={styles.authorName}>Arpit Singh Yadav</span>
        </div>
        <p className={styles.copyright}>
          Alfaaz © 2026 • 100% Free & Open Source for Poets Worldwide
        </p>
      </div>
    </footer>
  );
}
