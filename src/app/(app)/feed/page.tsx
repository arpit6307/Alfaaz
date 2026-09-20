'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Hand, 
  Mic, 
  Repeat, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Plus, 
  Trophy, 
  Sparkles,
  Palette,
  Check,
  RefreshCw
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/lib/hooks/useUser';
import styles from './page.module.css';

interface PostItem {
  id: string;
  author: string;
  takhallus: string;
  avatarLetter: string;
  avatarBg: string;
  time: string;
  type: string;
  urdu?: string;
  hindi?: string;
  roman?: string;
  tags: string[];
  counters: {
    wah: number;
    irshad: number;
    mukarrar: number;
    dilSe: number;
    comments: number;
  };
}

const INITIAL_SAMPLE_POSTS: PostItem[] = [
  {
    id: 'sample-1',
    author: 'Mirza Asadullah Khan',
    takhallus: 'ग़ालिब (Ghalib)',
    avatarLetter: 'G',
    avatarBg: 'var(--maroon, #5A0F2E)',
    time: 'Classical Sher',
    type: 'Sher',
    urdu: 'ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم نکلے\nبہت نکلے مرے ارمان لیکن پھر بھی کم نکلے',
    hindi: 'हज़ारों ख़्वाहिशें ऐसी कि हर ख़्वाहिश पे दम निकले\nबहुत निकले मिरे अरमान लेकिन फिर भी कम निकले',
    tags: ['#ghazal', '#ishq', '#classic'],
    counters: { wah: 342, irshad: 120, mukarrar: 78, dilSe: 512, comments: 24 }
  },
  {
    id: 'sample-2',
    author: 'Mir Taqi Mir',
    takhallus: 'मीर (Mir)',
    avatarLetter: 'M',
    avatarBg: 'var(--royal, #3A1C71)',
    time: 'Classical Sher',
    type: 'Sher',
    urdu: 'پتہ پتہ بوٹا بوٹا حال ہمارا جانے ہے\nجانے نہ جانے گل ہی نہ جانے باغ تو سارا جانے ہے',
    hindi: 'पत्ता पत्ता बूटा बूटा हाल हमारा जाने है\nजाने न जाने गुल ही न जाने बाग़ तो सारा जाने है',
    tags: ['#dilli', '#judai', '#mir'],
    counters: { wah: 219, irshad: 95, mukarrar: 44, dilSe: 310, comments: 18 }
  },
  {
    id: 'sample-3',
    author: 'Faiz Ahmed Faiz',
    takhallus: 'फ़ैज़ (Faiz)',
    avatarLetter: 'F',
    avatarBg: 'var(--rose, #E8386D)',
    time: 'Classical Nazm',
    type: 'Nazm',
    hindi: 'मुझ से पहली सी मोहब्बत मिरे महबूब न माँग\nमैंने समझा था कि तू है तो दरख़्शाँ है हयात',
    roman: 'Mujh se pehli si mohabbat mere mehboob na maang\nMaine samjha tha ki tu hai toh darakhshan hai hayat',
    tags: ['#nazm', '#inquilab', '#ishq'],
    counters: { wah: 489, irshad: 230, mukarrar: 112, dilSe: 740, comments: 56 }
  }
];

export default function FeedPage() {
  const supabase = createClient();
  const { user } = useUser();

  const [activeTab, setActiveTab] = useState<'following' | 'discover' | 'latest'>('discover');
  const [posts, setPosts] = useState<PostItem[]>(INITIAL_SAMPLE_POSTS);
  const [loading, setLoading] = useState(false);
  const [reactions, setReactions] = useState<{ [postId: string]: { [type: string]: boolean } }>({});
  const [counts, setCounts] = useState<{ [postId: string]: { [type: string]: number } }>({});
  const [savedPosts, setSavedPosts] = useState<{ [postId: string]: boolean }>({});
  const [shareToast, setShareToast] = useState<string | null>(null);

  // Fetch real posts from Supabase
  useEffect(() => {
    async function loadFeed() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('posts')
          .select(`
            id,
            type,
            language,
            script,
            lines,
            tags,
            mood,
            counters,
            created_at,
            author:users (
              id,
              username,
              takhallus
            )
          `)
          .order('created_at', { ascending: false })
          .limit(20);

        if (!error && data && data.length > 0) {
          const formatted: PostItem[] = data.map((item: any) => {
            const authorObj = Array.isArray(item.author) ? item.author[0] : item.author;
            const authorName = authorObj?.username || 'Shayar';
            const takhallus = authorObj?.takhallus || authorName;
            
            // Format lines
            const linesList = Array.isArray(item.lines) ? item.lines.map((l: any) => l.text).join('\n') : '';

            return {
              id: item.id,
              author: authorName,
              takhallus: takhallus,
              avatarLetter: (takhallus || authorName)[0]?.toUpperCase() || 'S',
              avatarBg: 'var(--maroon, #5A0F2E)',
              time: 'Taza Sher',
              type: item.type?.toUpperCase() || 'SHER',
              hindi: item.script === 'devanagari' ? linesList : undefined,
              urdu: item.script === 'nastaliq' ? linesList : undefined,
              roman: item.script === 'roman' || item.script === 'english' ? linesList : undefined,
              tags: item.tags || [],
              counters: {
                wah: item.counters?.wah_wah || 0,
                irshad: item.counters?.irshad || 0,
                mukarrar: item.counters?.mukarrar || 0,
                dilSe: item.counters?.dil_se || 0,
                comments: item.counters?.comments || 0,
              }
            };
          });

          // Prepend real posts to the sample classical list
          setPosts([...formatted, ...INITIAL_SAMPLE_POSTS]);
        }
      } catch (err) {
        console.error('Error fetching real feed:', err);
      } finally {
        setLoading(false);
      }
    }

    loadFeed();
  }, [supabase]);

  // Handle reactions
  const toggleReaction = async (postId: string, type: string) => {
    const postReactions = reactions[postId] || {};
    const isAlready = !!postReactions[type];

    // Optimistic UI update
    setReactions(prev => ({
      ...prev,
      [postId]: {
        ...(prev[postId] || {}),
        [type]: !isAlready
      }
    }));

    setCounts(cPrev => {
      const current = cPrev[postId]?.[type] ?? 0;
      return {
        ...cPrev,
        [postId]: {
          ...(cPrev[postId] || {}),
          [type]: isAlready ? Math.max(0, current - 1) : current + 1
        }
      };
    });

    // If real user and real post, sync with Supabase
    if (user && !postId.startsWith('sample-')) {
      const dbTypeMap: { [key: string]: string } = {
        wah: 'wah_wah',
        irshad: 'irshad',
        mukarrar: 'mukarrar',
        dilSe: 'dil_se'
      };

      try {
        if (!isAlready) {
          await supabase.from('reactions').insert([
            {
              post_id: postId,
              user_id: user.id,
              type: dbTypeMap[type] as any
            }
          ]);
        } else {
          await supabase.from('reactions').delete().match({
            post_id: postId,
            user_id: user.id,
            type: dbTypeMap[type]
          });
        }
      } catch (e) {
        console.error('Failed to sync reaction:', e);
      }
    }
  };

  const toggleSave = async (postId: string) => {
    const isSaved = !!savedPosts[postId];
    setSavedPosts(prev => ({
      ...prev,
      [postId]: !isSaved
    }));

    if (user && !postId.startsWith('sample-')) {
      try {
        if (!isSaved) {
          await supabase.from('saved_posts').insert([
            {
              post_id: postId,
              user_id: user.id
            }
          ]);
        } else {
          await supabase.from('saved_posts').delete().match({
            post_id: postId,
            user_id: user.id
          });
        }
      } catch (e) {
        console.error('Failed to save bookmark:', e);
      }
    }
  };

  const handleShare = (post: PostItem) => {
    const text = `${post.hindi || post.urdu || post.roman}\n— ${post.author}\nRead on Alfaaz: https://alfaaz.app`;
    navigator.clipboard.writeText(text);
    setShareToast(post.id);
    setTimeout(() => setShareToast(null), 2000);
  };

  return (
    <div className={styles.container}>
      {/* TOP HEADER */}
      <header className={styles.feedHeader}>
        <div className={styles.feedTabs}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'following' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('following')}
          >
            Following
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'discover' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('discover')}
          >
            Discover
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'latest' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('latest')}
          >
            Latest
          </button>
        </div>
      </header>

      {/* PINNED SHER-E-DIN */}
      <div className={styles.pinnedBanner}>
        <div className={styles.pinnedHeader}>
          <div className={styles.pinnedBadge}>
            <Trophy size={16} strokeWidth={2.5} />
            <span>SHER-E-DIN</span>
          </div>
          <span className={styles.pinnedTagline}>Curated Classical Couplet</span>
        </div>
        <p className={styles.pinnedVerse}>
          &ldquo;सितारों से आगे जहाँ और भी हैं<br />
          अभी इश्क़ के इम्तिहाँ और भी हैं&rdquo;
        </p>
        <div className={styles.pinnedFooter}>
          <span className={styles.pinnedPoet}>— Allama Iqbal (अल्लामा इक़बाल)</span>
          <Link href="/card-studio" className={styles.pinnedCardStudioLink}>
            <Palette size={14} /> Make Card
          </Link>
        </div>
      </div>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
          <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      )}

      {/* POSTS LIST */}
      <main className={styles.feedList}>
        {posts.map((post) => {
          const postReactions = reactions[post.id] || {};
          const currentCounts = counts[post.id] || {};
          const wahCount = (post.counters.wah || 0) + (currentCounts.wah || 0);
          const irshadCount = (post.counters.irshad || 0) + (currentCounts.irshad || 0);
          const mukarrarCount = (post.counters.mukarrar || 0) + (currentCounts.mukarrar || 0);
          const dilSeCount = (post.counters.dilSe || 0) + (currentCounts.dilSe || 0);
          const isSaved = !!savedPosts[post.id];

          return (
            <article key={post.id} className={styles.postCard}>
              {/* AUTHOR HEADER */}
              <div className={styles.cardHeader}>
                <div className={styles.authorSection}>
                  <div 
                    className={styles.avatar}
                    style={{ backgroundColor: post.avatarBg }}
                  >
                    {post.avatarLetter}
                  </div>
                  <div>
                    <div className={styles.authorNameRow}>
                      <Link href={`/u/${post.author.toLowerCase().replace(/\s+/g, '_')}`} className={styles.authorName}>
                        {post.author}
                      </Link>
                      <span className={styles.takhallusBadge}>{post.takhallus}</span>
                    </div>
                    <span className={styles.timestamp}>{post.time} • {post.type}</span>
                  </div>
                </div>

                <button 
                  className={`${styles.saveButton} ${isSaved ? styles.savedActive : ''}`}
                  onClick={() => toggleSave(post.id)}
                  aria-label="Bookmark"
                >
                  <Bookmark size={20} fill={isSaved ? 'var(--gold)' : 'none'} strokeWidth={2} />
                </button>
              </div>

              {/* VERSES */}
              <div className={styles.versesWrapper}>
                {post.urdu && (
                  <p className={styles.urduVerse} dir="rtl">
                    {post.urdu}
                  </p>
                )}
                {post.hindi && (
                  <p className={styles.hindiVerse}>
                    {post.hindi}
                  </p>
                )}
                {post.roman && (
                  <p className={styles.romanVerse}>
                    {post.roman}
                  </p>
                )}
              </div>

              {/* TAGS */}
              <div className={styles.tagsContainer}>
                {post.tags.map((t, idx) => (
                  <span key={idx} className={styles.tag}>
                    {t}
                  </span>
                ))}
              </div>

              {/* REACTION BAR */}
              <div className={styles.reactionsBar}>
                <button 
                  className={`${styles.reactionBtn} ${postReactions.wah ? styles.reactionBtnActive : ''}`}
                  onClick={() => toggleReaction(post.id, 'wah')}
                  title="Wah Wah"
                >
                  <Hand size={18} strokeWidth={2} />
                  <span>Wah</span>
                  <span className={styles.reactionNumber}>{wahCount}</span>
                </button>

                <button 
                  className={`${styles.reactionBtn} ${postReactions.irshad ? styles.reactionBtnActive : ''}`}
                  onClick={() => toggleReaction(post.id, 'irshad')}
                  title="Irshad"
                >
                  <Mic size={18} strokeWidth={2} />
                  <span>Irshad</span>
                  <span className={styles.reactionNumber}>{irshadCount}</span>
                </button>

                <button 
                  className={`${styles.reactionBtn} ${postReactions.mukarrar ? styles.reactionBtnActive : ''}`}
                  onClick={() => toggleReaction(post.id, 'mukarrar')}
                  title="Mukarrar"
                >
                  <Repeat size={18} strokeWidth={2} />
                  <span>Mukarrar</span>
                  <span className={styles.reactionNumber}>{mukarrarCount}</span>
                </button>

                <button 
                  className={`${styles.reactionBtn} ${postReactions.dilSe ? styles.reactionBtnRose : ''}`}
                  onClick={() => toggleReaction(post.id, 'dilSe')}
                  title="Dil Se"
                >
                  <Heart size={18} strokeWidth={2} fill={postReactions.dilSe ? 'var(--rose)' : 'none'} />
                  <span>Dil Se</span>
                  <span className={styles.reactionNumber}>{dilSeCount}</span>
                </button>

                <Link href={`/post/${post.id}`} className={styles.commentBtn} title="Comments">
                  <MessageCircle size={18} strokeWidth={2} />
                  <span className={styles.reactionNumber}>{post.counters.comments}</span>
                </Link>

                <button 
                  className={styles.shareBtn} 
                  onClick={() => handleShare(post)}
                  title="Share"
                >
                  {shareToast === post.id ? <Check size={18} /> : <Share2 size={18} strokeWidth={2} />}
                </button>
              </div>
            </article>
          );
        })}
      </main>

      {/* FLOATING ACTION BUTTON TO COMPOSE */}
      <Link href="/compose" className={styles.fab} aria-label="Compose new shayari">
        <Plus size={28} strokeWidth={3} />
      </Link>
    </div>
  );
}
