'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Heart, 
  HeartCrack, 
  Moon, 
  Sparkles, 
  Flame, 
  Laugh, 
  TrendingUp,
  BookOpen,
  UserRound,
  RefreshCw,
  Hand,
  MessageCircle,
  X
} from 'lucide-react';
import styles from './page.module.css';

const MOODS = [
  { id: 'ishq', label: 'Ishq', icon: Heart, className: 'ishq' },
  { id: 'judai', label: 'Judai', icon: HeartCrack, className: 'judai' },
  { id: 'tanhai', label: 'Tanhai', icon: Moon, className: 'tanhai' },
  { id: 'zindagi', label: 'Zindagi', icon: Sparkles, className: 'zindagi' },
  { id: 'sufi', label: 'Sufi', icon: Flame, className: 'sufi' },
  { id: 'mazaah', label: 'Mazaahiya', icon: Laugh, className: 'mazaahiya' },
];

const POPULAR_TAGS = ['#ghalib', '#mir', '#ishq', '#dilli', '#zindagi', '#classical', '#judai', '#sufi'];

const CLASSICAL_MASTERS = [
  { username: 'mirza_ghalib', name: 'मिर्ज़ा ग़ालिब', era: '1797–1869', sher: 'हज़ारों ख़्वाहिशें ऐसी कि हर ख़्वाहिश पे दम निकले' },
  { username: 'mir_taqi_mir', name: 'मीर तक़ी मीर', era: '1723–1810', sher: 'पत्ता पत्ता बूटा बूटा हाल हमारा जाने है' },
  { username: 'allama_iqbal', name: 'अल्लामा इक़बाल', era: '1877–1938', sher: 'सितारों से आगे जहाँ और भी हैं' },
  { username: 'daagh_dehlvi', name: 'दाग़ देहलवी', era: '1831–1905', sher: 'उर्दू है जिस का नाम हमीं जानते हैं दाग़' },
];

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<{ poets: any[]; posts: any[] } | null>(null);
  const [searching, setSearching] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchTerm.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Execute Search
  useEffect(() => {
    if (!debouncedQuery) {
      setResults(null);
      return;
    }

    async function runSearch() {
      try {
        setSearching(true);
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        const json = await res.json();
        setResults(json);
      } catch (e) {
        console.error('Search failed:', e);
      } finally {
        setSearching(false);
      }
    }

    runSearch();
  }, [debouncedQuery]);

  const handleTagClick = (tag: string) => {
    setSearchTerm(tag.replace('#', ''));
  };

  const handleMoodClick = (moodId: string) => {
    if (selectedMood === moodId) {
      setSelectedMood(null);
      setSearchTerm('');
    } else {
      setSelectedMood(moodId);
      setSearchTerm(moodId);
    }
  };

  const isSearchActive = !!debouncedQuery;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.searchBar}>
          <Search size={20} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Shayar, sher, tag ya lafz search karein..." 
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => { setSearchTerm(''); setSelectedMood(null); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </header>

      <main className={styles.main}>
        {/* SEARCH LOADING */}
        {searching && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
            <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        )}

        {/* SEARCH RESULTS VIEW */}
        {isSearchActive && results && !searching && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading), sans-serif', textTransform: 'uppercase', marginBottom: '16px', fontSize: '1.3rem' }}>
              Nateeje: &ldquo;{debouncedQuery}&rdquo;
            </h2>

            {results.poets.length === 0 && results.posts.length === 0 ? (
              <div style={{
                padding: '40px 20px',
                border: '3px solid var(--ink, #140F14)',
                background: 'var(--white)',
                boxShadow: '4px 4px 0 var(--ink, #140F14)',
                textAlign: 'center',
                fontFamily: 'var(--font-space-mono), monospace'
              }}>
                <h3>Kuch Nahi Mila</h3>
                <p style={{ marginTop: '8px', color: '#666' }}>
                  Aapke lafz &ldquo;{debouncedQuery}&rdquo; par koi sher ya shayar nahi mila. Dusra lafz try karein jaise &ldquo;इश्क़&rdquo;, &ldquo;Ghalib&rdquo;, ya &ldquo;दर्द&rdquo;.
                </p>
              </div>
            ) : (
              <>
                {/* POETS RESULTS */}
                {results.poets.length > 0 && (
                  <section style={{ marginBottom: '28px' }}>
                    <h3 style={{ fontFamily: 'var(--font-space-mono), monospace', textTransform: 'uppercase', fontSize: '0.9rem', marginBottom: '12px' }}>
                      Shayars ({results.poets.length})
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                      {results.poets.map(poet => (
                        <Link 
                          key={poet.id} 
                          href={`/u/${poet.username}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            border: '2px solid var(--ink, #140F14)',
                            background: 'var(--white)',
                            boxShadow: '3px 3px 0 var(--ink, #140F14)',
                            textDecoration: 'none',
                            color: 'inherit'
                          }}
                        >
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '0px',
                            background: 'var(--maroon, #5A0F2E)',
                            color: 'var(--parchment, #F6ECD9)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            border: '2px solid var(--ink, #140F14)'
                          }}>
                            {(poet.takhallus || poet.username)[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{poet.takhallus || poet.username}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary, #666)', fontFamily: 'var(--font-space-mono), monospace' }}>@{poet.username}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                {/* POSTS RESULTS */}
                {results.posts.length > 0 && (
                  <section>
                    <h3 style={{ fontFamily: 'var(--font-space-mono), monospace', textTransform: 'uppercase', fontSize: '0.9rem', marginBottom: '12px' }}>
                      Kalaam / Shers ({results.posts.length})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {results.posts.map(post => {
                        const linesText = Array.isArray(post.lines) 
                          ? post.lines.map((l: any) => l.text).join('\n') 
                          : '';
                        const author = Array.isArray(post.author) ? post.author[0] : post.author;

                        return (
                          <article key={post.id} style={{
                            padding: '20px',
                            background: 'var(--white)',
                            border: '3px solid var(--ink, #140F14)',
                            boxShadow: '4px 4px 0 var(--ink, #140F14)'
                          }}>
                            <p style={{
                              fontFamily: 'var(--font-royal), "Playfair Display", serif',
                              fontSize: '1.2rem',
                              lineHeight: 1.8,
                              whiteSpace: 'pre-line',
                              margin: '0 0 12px 0'
                            }}>
                              {linesText}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: '12px', fontWeight: 'bold' }}>
                                — {author?.takhallus || author?.username || 'Shayar'}
                              </span>
                              <Link href={`/post/${post.id}`} style={{
                                fontFamily: 'var(--font-space-mono), monospace',
                                fontSize: '11px',
                                color: 'var(--rose, #E8386D)',
                                textDecoration: 'none',
                                fontWeight: 'bold'
                              }}>
                                View Details →
                              </Link>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        )}

        {/* DEFAULT EXPLORE VIEW (WHEN NOT SEARCHING) */}
        {!isSearchActive && (
          <>
            {/* CLASSICAL LIBRARY SHOWCASE */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <BookOpen size={24} />
                Classical Library (क्लासिकल दीवान)
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                {CLASSICAL_MASTERS.map(m => (
                  <Link 
                    key={m.username} 
                    href={`/u/${m.username}`}
                    style={{
                      background: 'var(--parchment, #F6ECD9)',
                      border: '3px solid var(--ink, #140F14)',
                      boxShadow: '5px 5px 0 var(--ink, #140F14)',
                      padding: '16px',
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontFamily: 'var(--font-heading), sans-serif', fontSize: '1.1rem' }}>{m.name}</h3>
                        <span style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: '11px', color: '#666' }}>{m.era}</span>
                      </div>
                      <p style={{
                        fontFamily: 'var(--font-royal), serif',
                        fontSize: '0.95rem',
                        marginTop: '10px',
                        lineHeight: 1.6,
                        fontStyle: 'italic',
                        color: 'var(--maroon, #5A0F2E)'
                      }}>
                        &ldquo;{m.sher}&rdquo;
                      </p>
                    </div>
                    <span style={{
                      marginTop: '12px',
                      fontFamily: 'var(--font-space-mono), monospace',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      color: 'var(--rose, #E8386D)'
                    }}>
                      Poet Profile Dekhein →
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* TRENDING MOODS */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <TrendingUp size={24} />
                Trending Moods
              </h2>
              <div className={styles.moodGrid}>
                {MOODS.map(m => {
                  const IconComp = m.icon;
                  return (
                    <button 
                      key={m.id}
                      className={`${styles.moodCard} ${styles[m.className]}`}
                      onClick={() => handleMoodClick(m.id)}
                    >
                      <IconComp size={32} strokeWidth={2} />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* POPULAR TAGS */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Popular Tags</h2>
              <div className={styles.tagsContainer}>
                {POPULAR_TAGS.map(tag => (
                  <button 
                    key={tag} 
                    className={styles.tag}
                    onClick={() => handleTagClick(tag)}
                    style={{ cursor: 'pointer', border: '2px solid var(--ink, #140F14)', background: 'var(--parchment, #F6ECD9)' }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
