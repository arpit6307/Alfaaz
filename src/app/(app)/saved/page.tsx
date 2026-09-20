'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bookmark, 
  Trash2, 
  Palette, 
  ArrowRight, 
  Copy, 
  Check, 
  RefreshCw,
  BookOpen
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/lib/hooks/useUser';
import styles from './page.module.css';

interface SavedSher {
  id: string;
  postId: string;
  author: string;
  takhallus: string;
  text: string;
  script: string;
  tags: string[];
}

const DEFAULT_CURATED_SAVED: SavedSher[] = [
  {
    id: 'curated-1',
    postId: 'sample-1',
    author: 'mirza_ghalib',
    takhallus: 'मिर्ज़ा ग़ालिब (Ghalib)',
    text: 'हज़ारों ख़्वाहिशें ऐसी कि हर ख़्वाहish पे दम निकले\nबहुत निकले मिरे अरमान लेकिन फिर भी कम निकले',
    script: 'devanagari',
    tags: ['#ishq', '#classic', '#ghazal']
  },
  {
    id: 'curated-2',
    postId: 'sample-2',
    author: 'mir_taqi_mir',
    takhallus: 'मीर तक़ी मीर (Mir)',
    text: 'पत्ता पत्ता बूटा बूटा हाल हमारा जाने है\nजाने न जाने गुल ही न जाने बाग़ तो सारा जाने है',
    script: 'devanagari',
    tags: ['#dilli', '#judai', '#mir']
  },
  {
    id: 'curated-3',
    postId: 'sample-3',
    author: 'allama_iqbal',
    takhallus: 'अल्लामा इक़बाल (Iqbal)',
    text: 'सितारों से आगे जहाँ और भी हैं\nअभी इश्क़ के इम्तिहाँ और भी हैं',
    script: 'devanagari',
    tags: ['#shikwa', '#inquilab']
  }
];

export default function SavedPage() {
  const supabase = createClient();
  const { user } = useUser();

  const [savedShers, setSavedShers] = useState<SavedSher[]>(DEFAULT_CURATED_SAVED);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch real saved posts for logged-in user
  useEffect(() => {
    if (!user) return;
    const userId = user.id;

    async function loadSaved(uid: string) {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('saved_posts')
          .select(`
            id,
            post_id,
            created_at,
            post:posts (
              id,
              type,
              language,
              script,
              lines,
              tags,
              author:users (
                username,
                takhallus
              )
            )
          `)
          .eq('user_id', uid)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const formatted: SavedSher[] = data
            .filter((item: any) => item.post)
            .map((item: any) => {
              const p = item.post;
              const authorObj = Array.isArray(p.author) ? p.author[0] : p.author;
              const authorName = authorObj?.username || 'Shayar';
              const takhallus = authorObj?.takhallus || authorName;
              const linesList = Array.isArray(p.lines) 
                ? p.lines.map((l: any) => l.text).join('\n') 
                : '';

              return {
                id: item.id,
                postId: p.id,
                author: authorName,
                takhallus: takhallus,
                text: linesList,
                script: p.script || 'devanagari',
                tags: p.tags || []
              };
            });

          if (formatted.length > 0) {
            setSavedShers(formatted);
          }
        }
      } catch (err) {
        console.error('Error fetching saved:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSaved(userId);
  }, [user, supabase]);

  // Remove saved post handler
  const handleRemove = async (sher: SavedSher) => {
    // Optimistically remove from state
    setSavedShers(prev => prev.filter(s => s.id !== sher.id));

    if (user && !sher.id.startsWith('curated-')) {
      try {
        await supabase
          .from('saved_posts')
          .delete()
          .eq('id', sher.id);
      } catch (e) {
        console.error('Failed to remove bookmark:', e);
      }
    }
  };

  const handleCopy = (sher: SavedSher) => {
    navigator.clipboard.writeText(`${sher.text}\n— ${sher.takhallus}`);
    setCopiedId(sher.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className={styles.headerBadge}>
            <Bookmark size={20} />
          </div>
          <div>
            <h1 className={styles.title}>Mehfooz Shers (दीवान / Saved)</h1>
            <p className={styles.subtitle}>Aapke pasandeeda kalaam jo aapne mehfooz kiye hain ({savedShers.length})</p>
          </div>
        </div>
      </header>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
          <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      )}

      {savedShers.length === 0 ? (
        <div className={styles.emptyState}>
          <BookOpen size={48} className={styles.emptyIcon} />
          <h2 className={styles.emptyTitle}>Koi Sher Mehfooz Nahi Hai</h2>
          <p className={styles.emptyText}>Feed par shers padhein aur Bookmark icon daba kar apne diwan me shamil karein.</p>
          <Link href="/feed" className={styles.exploreBtn}>
            Feed Dekhein →
          </Link>
        </div>
      ) : (
        <main className={styles.grid}>
          {savedShers.map((sher) => (
            <article key={sher.id} className={styles.card}>
              <div className={styles.cardTop}>
                <Link href={`/u/${sher.author.toLowerCase()}`} className={styles.authorBadge}>
                  <div className={styles.authorLetter}>
                    {sher.takhallus[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className={styles.authorName}>{sher.takhallus}</div>
                    <div className={styles.authorHandle}>@{sher.author}</div>
                  </div>
                </Link>

                <button 
                  className={styles.removeBtn} 
                  onClick={() => handleRemove(sher)}
                  title="Remove from Saved (हटाएं)"
                  aria-label="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className={styles.verseBox}>
                <p className={styles.sher}>
                  {sher.text}
                </p>
              </div>

              {sher.tags && sher.tags.length > 0 && (
                <div className={styles.tagsRow}>
                  {sher.tags.map((t, i) => (
                    <span key={i} className={styles.tag}>{t}</span>
                  ))}
                </div>
              )}

              <div className={styles.cardFooter}>
                <button 
                  type="button" 
                  className={styles.actionBtn}
                  onClick={() => handleCopy(sher)}
                  title="Copy Sher"
                >
                  {copiedId === sher.id ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedId === sher.id ? 'Copied' : 'Copy'}</span>
                </button>

                <Link 
                  href={`/card-studio`} 
                  className={styles.actionBtn}
                  title="Make Image Card"
                >
                  <Palette size={14} />
                  <span>Card</span>
                </Link>

                <Link 
                  href={`/post/${sher.postId}`} 
                  className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                  title="View Couplet"
                >
                  <span>View</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </main>
      )}
    </div>
  );
}

