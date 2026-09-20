'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  UserRound, 
  UserPlus, 
  UserCheck, 
  FileText, 
  Bookmark, 
  Settings, 
  Hand, 
  MessageCircle, 
  Award,
  RefreshCw,
  Sparkles,
  Share2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/lib/hooks/useUser';
import styles from './page.module.css';

interface ProfileData {
  id: string;
  username: string;
  takhallus: string;
  bio: string;
  avatar_url?: string;
  role: string;
  badges: string[];
  counters: {
    posts: number;
    followers: number;
    following: number;
  };
}

interface PostData {
  id: string;
  type: string;
  language: string;
  script: string;
  title?: string;
  lines: { number: number; text: string }[] | any;
  tags: string[];
  counters: {
    wah_wah: number;
    irshad: number;
    comments: number;
  };
}

export default function ProfilePage({ params }: { params: Promise<{ username: string }> | { username: string } }) {
  const resolvedParams = 'then' in params ? use(params) : params;
  const usernameParam = decodeURIComponent(resolvedParams.username).toLowerCase();

  const supabase = createClient();
  const { user: currentUser } = useUser();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'wahs'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = currentUser && profile && currentUser.id === profile.id;

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        // 1. Fetch user by username
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .ilike('username', usernameParam)
          .single();

        if (userError || !userData) {
          // Check if it's one of the classical poets before failing
          const fallbackPoets: { [key: string]: ProfileData } = {
            mirza_ghalib: {
              id: '11111111-0000-0000-0000-000000000001',
              username: 'mirza_ghalib',
              takhallus: 'मिर्ज़ा ग़ालिब (Ghalib)',
              bio: 'Mirza Asadullah Khan Ghalib (1797–1869). The emperor of Urdu & Persian ghazals.',
              role: 'classical_curated',
              badges: ['classical', 'shair_e_azam'],
              counters: { posts: 7, followers: 84000, following: 0 }
            },
            mir_taqi_mir: {
              id: '11111111-0000-0000-0000-000000000002',
              username: 'mir_taqi_mir',
              takhallus: 'मीर तक़ी मीर (Mir)',
              bio: 'Khuda-e-Sukhan (God of Poetry), pioneer of the classic Delhi Ghazal.',
              role: 'classical_curated',
              badges: ['classical', 'khuda_e_sukhan'],
              counters: { posts: 5, followers: 62000, following: 0 }
            },
            allama_iqbal: {
              id: '11111111-0000-0000-0000-000000000003',
              username: 'allama_iqbal',
              takhallus: 'अल्लामा इक़बाल (Iqbal)',
              bio: 'Visionary philosopher-poet, author of Bang-e-Dara & Shikwa.',
              role: 'classical_curated',
              badges: ['classical', 'mufakkir_e_mashriq'],
              counters: { posts: 4, followers: 79000, following: 0 }
            }
          };

          if (fallbackPoets[usernameParam]) {
            setProfile(fallbackPoets[usernameParam]);
          } else {
            // Profile not found
            setProfile(null);
          }
          setLoading(false);
          return;
        }

        setProfile(userData as ProfileData);

        // 2. Fetch posts by this user
        const { data: postsData } = await supabase
          .from('posts')
          .select('*')
          .eq('author_id', userData.id)
          .order('created_at', { ascending: false });

        if (postsData) {
          setPosts(postsData as PostData[]);
        }

        // 3. Check if current user is following this profile
        if (currentUser && currentUser.id !== userData.id) {
          const { data: followData } = await supabase
            .from('follows')
            .select('*')
            .match({ follower_id: currentUser.id, followee_id: userData.id })
            .maybeSingle();

          setIsFollowing(!!followData);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [usernameParam, currentUser, supabase]);

  const handleFollowToggle = async () => {
    if (!currentUser || !profile || isOwnProfile || followLoading) return;

    try {
      setFollowLoading(true);
      if (isFollowing) {
        await supabase
          .from('follows')
          .delete()
          .match({ follower_id: currentUser.id, followee_id: profile.id });
        setIsFollowing(false);
        setProfile(p => p ? {
          ...p,
          counters: { ...p.counters, followers: Math.max(0, p.counters.followers - 1) }
        } : null);
      } else {
        await supabase
          .from('follows')
          .insert({ follower_id: currentUser.id, followee_id: profile.id });
        setIsFollowing(true);
        setProfile(p => p ? {
          ...p,
          counters: { ...p.counters, followers: p.counters.followers + 1 }
        } : null);
      }
    } catch (e) {
      console.error('Follow error:', e);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.container} style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h1 className={styles.name}>Shayar Dastyab Nahin</h1>
        <p className={styles.bio}>@{usernameParam} naam ka koi shayar Mehfil me mojood nahi hai.</p>
        <Link href="/feed" className={styles.followBtn} style={{ display: 'inline-flex', marginTop: '20px' }}>
          Back to Feed
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.cover}>
        <div className={styles.avatarWrapper}>
          <div className={styles.avatar}>
            <span style={{
              fontFamily: 'var(--font-heading), "Archivo Black", sans-serif',
              fontSize: '2rem',
              color: 'var(--ink, #140F14)'
            }}>
              {(profile.takhallus || profile.username)[0]?.toUpperCase()}
            </span>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.profileInfo}>
          <div className={styles.headerRow}>
            <div>
              <h1 className={styles.name}>{profile.takhallus || profile.username}</h1>
              <p className={styles.handle}>@{profile.username}</p>
            </div>

            {isOwnProfile ? (
              <Link href="/settings" className={styles.followBtn} style={{ textDecoration: 'none' }}>
                <Settings size={18} strokeWidth={2} />
                <span>Edit Profile</span>
              </Link>
            ) : (
              <button 
                className={styles.followBtn} 
                onClick={handleFollowToggle}
                disabled={followLoading}
                style={{
                  backgroundColor: isFollowing ? 'var(--parchment, #F6ECD9)' : 'var(--ink, #140F14)',
                  color: isFollowing ? 'var(--ink, #140F14)' : 'var(--parchment, #F6ECD9)'
                }}
              >
                {isFollowing ? (
                  <>
                    <UserCheck size={18} strokeWidth={2} />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={18} strokeWidth={2} />
                    <span>Follow</span>
                  </>
                )}
              </button>
            )}
          </div>

          <p className={styles.bio}>{profile.bio || 'Words are all I have.'}</p>

          {/* BADGES */}
          {profile.badges && profile.badges.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
              {profile.badges.map(b => (
                <span key={b} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: b === 'classical' ? 'var(--gold, #D9A93B)' : 'var(--rose, #E8386D)',
                  color: 'var(--ink, #140F14)',
                  padding: '4px 10px',
                  border: '2px solid var(--ink, #140F14)',
                  fontFamily: 'var(--font-space-mono), monospace',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  <Award size={12} /> {b.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          )}
          
          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              <span className={styles.statNum}>{posts.length || profile.counters?.posts || 0}</span>
              <span className={styles.statLabel}>Shers</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNum}>{profile.counters?.followers || 0}</span>
              <span className={styles.statLabel}>Qadardan</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNum}>{profile.counters?.following || 0}</span>
              <span className={styles.statLabel}>Following</span>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'posts' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            <FileText size={18} /> Shers ({posts.length})
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'saved' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            <Bookmark size={18} /> Diwan
          </button>
        </div>

        {/* POSTS GRID */}
        <div className={styles.contentGrid}>
          {posts.length === 0 ? (
            <div style={{
              padding: '36px',
              border: '3px solid var(--ink, #140F14)',
              background: 'var(--white)',
              textAlign: 'center',
              fontFamily: 'var(--font-space-mono), monospace'
            }}>
              <p>Abhi is shayar ne koi sher pesh nahi kiya hai.</p>
              {isOwnProfile && (
                <Link href="/compose" className={styles.followBtn} style={{ display: 'inline-flex', marginTop: '12px' }}>
                  Pehla Sher Likhein
                </Link>
              )}
            </div>
          ) : (
            posts.map((post) => {
              const linesText = Array.isArray(post.lines) 
                ? post.lines.map((l: any) => l.text).join('\n') 
                : '';

              return (
                <article key={post.id} className={styles.postCard}>
                  <p className={styles.sher} style={{ whiteSpace: 'pre-line' }}>
                    {linesText}
                  </p>

                  <div className={styles.postActions}>
                    <span className={styles.actionCount}>
                      <Hand size={16} /> {post.counters?.wah_wah || 0} Wah
                    </span>
                    <span className={styles.actionCount}>
                      <MessageCircle size={16} /> {post.counters?.comments || 0}
                    </span>
                    <Link href={`/post/${post.id}`} style={{
                      marginLeft: 'auto',
                      fontFamily: 'var(--font-space-mono), monospace',
                      fontSize: '11px',
                      color: 'var(--rose, #E8386D)',
                      textDecoration: 'none',
                      fontWeight: 'bold'
                    }}>
                      View Sher →
                    </Link>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
