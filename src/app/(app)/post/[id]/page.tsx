'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Hand, 
  Mic, 
  Repeat, 
  Heart, 
  MessageCircle, 
  Copy, 
  Share2, 
  Palette, 
  Send,
  RefreshCw,
  Check,
  Bookmark
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/lib/hooks/useUser';
import styles from './page.module.css';

interface CommentItem {
  id: string;
  body: string;
  created_at: string;
  author: {
    username: string;
    takhallus?: string;
  };
}

interface PostDetail {
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
    mukarrar: number;
    dil_se: number;
    comments: number;
  };
  author: {
    username: string;
    takhallus?: string;
  };
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = 'then' in params ? use(params) : params;
  const postId = resolvedParams.id;

  const supabase = createClient();
  const { user } = useUser();

  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [reactions, setReactions] = useState<{ [key: string]: boolean }>({});
  const [counts, setCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    async function loadPostAndComments() {
      try {
        setLoading(true);

        // 1. Fetch Post
        const { data: postData, error } = await supabase
          .from('posts')
          .select(`
            id,
            type,
            language,
            script,
            title,
            lines,
            tags,
            counters,
            author:users (
              username,
              takhallus
            )
          `)
          .eq('id', postId)
          .maybeSingle();

        if (postData) {
          const authorObj = Array.isArray(postData.author) ? postData.author[0] : postData.author;
          setPost({
            id: postData.id,
            type: postData.type,
            language: postData.language,
            script: postData.script,
            title: postData.title || undefined,
            lines: postData.lines,
            tags: postData.tags || [],
            counters: {
              wah_wah: postData.counters?.wah_wah || 0,
              irshad: postData.counters?.irshad || 0,
              mukarrar: postData.counters?.mukarrar || 0,
              dil_se: postData.counters?.dil_se || 0,
              comments: postData.counters?.comments || 0,
            },
            author: {
              username: authorObj?.username || 'shayar',
              takhallus: authorObj?.takhallus || 'Shayar'
            }
          });

          setCounts({
            wah_wah: postData.counters?.wah_wah || 0,
            irshad: postData.counters?.irshad || 0,
            mukarrar: postData.counters?.mukarrar || 0,
            dil_se: postData.counters?.dil_se || 0,
          });
        } else {
          // Fallback demo for sample IDs
          setPost({
            id: postId,
            type: 'sher',
            language: 'urdu',
            script: 'devanagari',
            lines: [
              { number: 1, text: 'Main bhi bahut ajeeb hun itna ajeeb hun ki bas' },
              { number: 2, text: 'Khud ko tabaah kar liya aur malaal bhi nahin' }
            ],
            tags: ['#jaun', '#tanhai', '#classic'],
            counters: { wah_wah: 1200, irshad: 450, mukarrar: 890, dil_se: 1400, comments: 2 },
            author: { username: 'jaun_elia', takhallus: 'जौन एलिया (Jaun Elia)' }
          });
        }

        // 2. Fetch Comments
        const { data: commentsData } = await supabase
          .from('comments')
          .select(`
            id,
            body,
            created_at,
            author:users (
              username,
              takhallus
            )
          `)
          .eq('post_id', postId)
          .order('created_at', { ascending: true });

        if (commentsData) {
          setComments(commentsData.map((c: any) => ({
            id: c.id,
            body: c.body,
            created_at: c.created_at,
            author: {
              username: c.author?.username || 'user',
              takhallus: c.author?.takhallus || c.author?.username || 'Shayar'
            }
          })));
        }
      } catch (err) {
        console.error('Error fetching post detail:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPostAndComments();
  }, [postId, supabase]);

  const toggleReaction = async (type: string) => {
    const isAlready = !!reactions[type];
    setReactions(prev => ({ ...prev, [type]: !isAlready }));
    setCounts(prev => ({
      ...prev,
      [type]: isAlready ? Math.max(0, (prev[type] || 0) - 1) : (prev[type] || 0) + 1
    }));

    if (user && !postId.startsWith('sample-')) {
      try {
        if (!isAlready) {
          await supabase.from('reactions').insert({
            post_id: postId,
            user_id: user.id,
            type: type as any
          });
        } else {
          await supabase.from('reactions').delete().match({
            post_id: postId,
            user_id: user.id,
            type: type
          });
        }
      } catch (e) {
        console.error('Reaction sync error:', e);
      }
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!user) {
      alert('Comment karne ke liye pehle login karein.');
      return;
    }

    try {
      setSubmittingComment(true);
      const text = newComment.trim();

      // Optimistic comment
      const tempId = `temp-${Date.now()}`;
      setComments(prev => [
        ...prev,
        {
          id: tempId,
          body: text,
          created_at: new Date().toISOString(),
          author: {
            username: user.user_metadata?.username || 'aap',
            takhallus: user.user_metadata?.takhallus || user.user_metadata?.full_name || 'Aap'
          }
        }
      ]);
      setNewComment('');

      // Insert in database
      const { data, error } = await supabase.from('comments').insert({
        post_id: postId,
        author_id: user.id,
        body: text
      }).select().single();

      if (data) {
        setComments(prev => prev.map(c => c.id === tempId ? { ...c, id: data.id } : c));
      }
    } catch (e) {
      console.error('Comment error:', e);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Sher by ${post?.author.takhallus || 'Alfaaz'}`,
          url: window.location.href,
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  if (loading) {
    return (
      <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className={styles.container} style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>Sher Dastyab Nahin</h2>
        <Link href="/feed">Back to Mehfil</Link>
      </div>
    );
  }

  const linesFormatted = Array.isArray(post.lines) 
    ? post.lines.map((l: any) => l.text).join('\n') 
    : '';

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/feed" className={styles.backBtn}>
          <ArrowLeft size={24} strokeWidth={2.5} />
        </Link>
        <h1 className={styles.title}>Kalaam</h1>
      </header>

      <main className={styles.main}>
        <article className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.author}>
              <div className={styles.avatar}>
                {(post.author.takhallus || post.author.username)[0]?.toUpperCase()}
              </div>
              <div>
                <Link href={`/u/${post.author.username.toLowerCase()}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h3 className={styles.authorName}>{post.author.takhallus || post.author.username}</h3>
                </Link>
                <span className={styles.time}>@{post.author.username} • {post.type.toUpperCase()}</span>
              </div>
            </div>
          </div>
          
          <div className={styles.content}>
            <p className={styles.sher} style={{ whiteSpace: 'pre-line' }}>
              {linesFormatted}
            </p>
          </div>

          <div className={styles.actions}>
            <button 
              className={`${styles.actionBtn} ${reactions.wah_wah ? styles.actionActive : ''}`}
              onClick={() => toggleReaction('wah_wah')}
              title="Wah Wah"
            >
              <Hand size={20} strokeWidth={2} /> <span>{counts.wah_wah || 0}</span>
            </button>
            <button 
              className={`${styles.actionBtn} ${reactions.irshad ? styles.actionActive : ''}`}
              onClick={() => toggleReaction('irshad')}
              title="Irshad"
            >
              <Mic size={20} strokeWidth={2} /> <span>{counts.irshad || 0}</span>
            </button>
            <button 
              className={`${styles.actionBtn} ${reactions.mukarrar ? styles.actionActive : ''}`}
              onClick={() => toggleReaction('mukarrar')}
              title="Mukarrar"
            >
              <Repeat size={20} strokeWidth={2} /> <span>{counts.mukarrar || 0}</span>
            </button>
            <button 
              className={`${styles.actionBtn} ${reactions.dil_se ? styles.actionActiveRose : ''}`}
              onClick={() => toggleReaction('dil_se')}
              title="Dil Se"
            >
              <Heart size={20} strokeWidth={2} fill={reactions.dil_se ? 'var(--rose, #E8386D)' : 'none'} /> <span>{counts.dil_se || 0}</span>
            </button>
          </div>
          
          <div className={styles.shareActions}>
            <button className={styles.shareBtn} onClick={handleCopy}>
              {copied ? <Check size={18} /> : <Copy size={18} />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
            <button className={styles.shareBtn} onClick={handleShare}>
              <Share2 size={18} />
              <span>Share</span>
            </button>
            <Link href={`/card-studio`} className={styles.shareBtn} style={{ textDecoration: 'none' }}>
              <Palette size={18} />
              <span>Card Studio</span>
            </Link>
          </div>
        </article>

        {/* COMMENTS SECTION */}
        <section className={styles.commentsSection}>
          <h2 className={styles.sectionTitle}>
            <MessageCircle size={22} />
            <span>Guftagu & Comments ({comments.length})</span>
          </h2>
          
          <form className={styles.commentInput} onSubmit={handleAddComment}>
            <input 
              type="text" 
              placeholder={user ? "Sher par apni daad dein..." : "Comment karne ke liye login karein..."} 
              className={styles.input} 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={submittingComment || !user}
            />
            <button type="submit" className={styles.sendBtn} disabled={submittingComment || !user}>
              <Send size={18} strokeWidth={2.5} />
            </button>
          </form>

          <div className={styles.commentsList}>
            {comments.length === 0 ? (
              <p style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: '13px', color: '#777', padding: '12px 0' }}>
                Abhi koi comment nahi hai. Pehli daad aap pesh karein!
              </p>
            ) : (
              comments.map(c => (
                <div key={c.id} className={styles.comment}>
                  <div className={styles.commentAvatar}>
                    {(c.author.takhallus || c.author.username)[0]?.toUpperCase()}
                  </div>
                  <div className={styles.commentContent}>
                    <h4 className={styles.commentAuthor}>{c.author.takhallus || c.author.username}</h4>
                    <p className={styles.commentText}>{c.body}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
