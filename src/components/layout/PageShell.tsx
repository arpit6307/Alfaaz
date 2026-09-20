import React from 'react';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import Footer from './Footer';
import styles from './PageShell.module.css';

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.pageShell}>
      <Navbar />
      <main className={styles.content}>
        {children}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
