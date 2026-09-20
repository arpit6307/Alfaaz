'use client';

import { motion } from 'motion/react';
import { Quote, Feather, Heart, Coffee } from 'lucide-react';
import styles from './page.module.css';

export default function AboutPage() {
  return (
    <main className={styles.main}>
      <motion.div 
        className={styles.header}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className={styles.title}>About Alfaaz</h1>
        <p className={styles.subtitle}>Bringing classical poetry to the brutalist web.</p>
      </motion.div>

      <div className={styles.content}>
        <section className={styles.section}>
          <div className={styles.iconWrapper}><Quote size={32} /></div>
          <h2>Our Mission</h2>
          <p>Alfaaz is built for the lovers of Urdu and Hindi poetry. We believe that words (alfaaz) have the power to heal, inspire, and connect. Our brutalist design philosophy strips away the noise, letting the poetry speak for itself.</p>
        </section>

        <section className={styles.section}>
          <div className={styles.iconWrapper}><Feather size={32} /></div>
          <h2>The Takhallus</h2>
          <p>Every great poet adopts a takhallus (pen name). Here, you can claim yours and build a unique identity in our digital mehfil (gathering). No real names required, only real emotions.</p>
        </section>

        <section className={styles.section}>
          <div className={styles.iconWrapper}><Heart size={32} /></div>
          <h2>Community</h2>
          <p>We are a community of writers, readers, and critics. Whether you are reciting in a public mehfil or publishing your personal diwan, you are surrounded by people who understand the weight of your words.</p>
        </section>

        <section className={styles.section}>
          <div className={styles.iconWrapper}><Coffee size={32} /></div>
          <h2>Support</h2>
          <p>Built with passion. If you find joy in Alfaaz, consider writing more, sharing your verses, and keeping the art of poetry alive in the digital age.</p>
        </section>
      </div>
    </main>
  );
}
