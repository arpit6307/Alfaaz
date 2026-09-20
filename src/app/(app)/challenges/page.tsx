'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  Medal, 
  Flame, 
  Clock, 
  Sparkles, 
  PenTool, 
  Users, 
  Award,
  ChevronRight
} from 'lucide-react';
import styles from './page.module.css';

const LEADERBOARD_POETS = [
  { rank: 1, username: 'mirza_ghalib', name: 'मिर्ज़ा ग़ालिब (Ghalib)', pts: 12400, badge: 'Shair-e-Azam' },
  { rank: 2, username: 'allama_iqbal', name: 'अल्लामा इक़बाल (Iqbal)', pts: 10850, badge: 'Mufakkir' },
  { rank: 3, username: 'mir_taqi_mir', name: 'मीर तक़ी मीर (Mir)', pts: 9700, badge: 'Khuda-e-Sukhan' },
  { rank: 4, username: 'daagh_dehlvi', name: 'दाग़ देहलवी (Daagh)', pts: 8400, badge: 'Ustad' },
  { rank: 5, username: 'faiz_ahmed', name: 'फ़ैज़ अहमद फ़ैज़ (Faiz)', pts: 7950, badge: 'Inquilab' }
];

export default function ChallengesPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className={styles.headerBadge}>
            <Trophy size={22} />
          </div>
          <div>
            <h1 className={styles.title}>Shayari Challenges (मुक़ाबला & बज़्म)</h1>
            <p className={styles.subtitle}>तराही मिसरा और बैत-बाज़ी में शिरकत करें और क़दरदानों से वाह-वाह पाएं</p>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* ACTIVE TARAHI MISRA CHALLENGE */}
        <section className={styles.activeChallenge}>
          <div className={styles.challengeBadge}>
            <Clock size={14} />
            <span>Live • 3 Din Baki</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold, #D9A93B)' }}>
            <Sparkles size={18} />
            <span style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Haftawar Tarahi Misra #14
            </span>
          </div>

          <h2 className={styles.challengeTitle}>#Maazi (माज़ी / The Past)</h2>
          
          <p className={styles.challengeDesc}>
            Mausam badal rahe hain aur yaadein zinda hain. Is hafte ka tarahi misra hai:
          </p>

          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            border: '2px dashed var(--gold, #D9A93B)',
            textAlign: 'center',
            fontFamily: 'var(--font-royal), serif',
            fontSize: '1.25rem',
            fontStyle: 'italic',
            color: 'var(--gold, #D9A93B)'
          }}>
            &ldquo;गए दिनों की बात है जब हम भी बा-वफ़ा थे...&rdquo;
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginTop: '4px' }}>
            <span style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={16} /> 248 Shayars participating
            </span>

            <Link 
              href="/compose?challenge=Maazi&tag=maazi" 
              className={styles.participateBtn}
            >
              <PenTool size={18} />
              <span>Participate Now (शेर कहें)</span>
            </Link>
          </div>
        </section>

        {/* BAIT-BAZI QUICK ROOM */}
        <section style={{
          background: 'var(--white)',
          border: '3px solid var(--ink, #140F14)',
          boxShadow: '5px 5px 0 var(--ink, #140F14)',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{
                  background: 'var(--rose, #E8386D)',
                  color: 'var(--ink, #140F14)',
                  padding: '2px 8px',
                  fontFamily: 'var(--font-heading), sans-serif',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  Live Arena
                </span>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-heading), sans-serif', fontSize: '1.2rem', textTransform: 'uppercase' }}>
                  Bait-Bazi Round #4
                </h3>
              </div>
              <p style={{ margin: 0, fontFamily: 'var(--font-space-mono), monospace', fontSize: '0.85rem', color: 'var(--text-secondary, #666)' }}>
                Agla sher aakhiri harf <strong>'नून' (N)</strong> se shuru karein.
              </p>
            </div>

            <Link 
              href="/chat/bait_bazi" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                background: 'var(--gold, #D9A93B)',
                color: 'var(--ink, #140F14)',
                border: '2px solid var(--ink, #140F14)',
                boxShadow: '3px 3px 0 var(--ink, #140F14)',
                fontFamily: 'var(--font-heading), sans-serif',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                textDecoration: 'none'
              }}
            >
              <span>Join Arena</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </section>

        {/* LEADERBOARD */}
        <section className={styles.leaderboard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className={styles.sectionTitle}>
              <Medal size={22} />
              <span>Leaderboard (सरफ़राज़ शोरा)</span>
            </h2>
            <span style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: '11px', color: 'var(--text-secondary, #666)' }}>
              Weekly Rankings
            </span>
          </div>

          <div className={styles.list}>
            {LEADERBOARD_POETS.map((poet) => (
              <Link 
                href={`/u/${poet.username}`}
                key={poet.rank} 
                className={styles.rankCard}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className={styles.rankNum}>#{poet.rank}</div>
                <div className={styles.rankAvatar}>
                  {poet.name[0]?.toUpperCase()}
                </div>
                <div className={styles.rankInfo}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 className={styles.rankName}>{poet.name}</h3>
                    <span style={{
                      fontFamily: 'var(--font-space-mono), monospace',
                      fontSize: '10px',
                      background: 'var(--blush, #F7C6D0)',
                      border: '1px solid var(--ink, #140F14)',
                      padding: '1px 6px',
                      color: 'var(--maroon, #5A0F2E)',
                      fontWeight: 'bold'
                    }}>
                      {poet.badge}
                    </span>
                  </div>
                  <span className={styles.points}>
                    <Flame size={14} color="var(--rose, #E8386D)" /> {poet.pts.toLocaleString()} Wah points
                  </span>
                </div>
                <ChevronRight size={18} style={{ color: 'var(--text-secondary, #666)' }} />
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

