'use client';

import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Home } from 'lucide-react';
import Footer from '../components/layout/Footer';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <main className={styles.main}>
      <div className={styles.contentWrap}>
        <motion.div 
          className={styles.container}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h1 className={styles.title}>404</h1>
          <p className={styles.urduText}>
            dhūñDoge agar mulkoñ mulkoñ milne ke nahīñ nāyāb haiñ ham
          </p>
          <p className={styles.translation}>
            (You won&apos;t find us even if you search country by country, for we are rare)
          </p>
          <Link href="/" className={styles.homeBtn}>
            <Home size={20} /> Go Home
          </Link>
        </motion.div>
      </div>
      <Footer minimal={true} />
    </main>
  );
}
