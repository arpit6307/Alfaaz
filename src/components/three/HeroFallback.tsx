'use client';

import React from 'react';
import Image from 'next/image';
import styles from './HeroFallback.module.css';

export default function HeroFallback() {
  return (
    <div className={styles.fallbackContainer} aria-hidden="true">
      <div className={styles.backdropGlow}></div>
      
      {/* Central Emblem Wax Seal */}
      <div className={styles.sealWrapper}>
        <Image
          src="/favicon.svg"
          alt="Alfaaz Seal"
          width={220}
          height={220}
          priority
          className={styles.sealImage}
        />
      </div>

      {/* Floating CSS Petals and Gold Sparkles */}
      <div className={styles.particlesContainer}>
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`${styles.petal} ${styles[`petal${i % 4}`]}`}></div>
        ))}
        {[...Array(18)].map((_, i) => (
          <div key={i} className={`${styles.goldSparkle} ${styles[`sparkle${i % 3}`]}`}></div>
        ))}
      </div>
    </div>
  );
}
