'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Send, 
  Heart, 
  HeartCrack, 
  Moon, 
  Sparkles, 
  Flame, 
  Laugh,
  Plus,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  LogIn,
  Trophy
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/lib/hooks/useUser';
import styles from './page.module.css';

const TYPES = ['Sher', 'Ghazal', 'Nazm', 'Rubai', 'Quote'];
const LANGUAGES = [
  { id: 'hindi', label: 'देवनागरी (Hindi)' },
  { id: 'urdu', label: 'اردو (Urdu RTL)' },
  { id: 'roman', label: 'Roman / Hinglish' },
  { id: 'english', label: 'English' }
];
const MOODS = [
  { id: 'ishq', label: 'Ishq', icon: Heart },
  { id: 'judai', label: 'Judai', icon: HeartCrack },
  { id: 'tanhai', label: 'Tanhai', icon: Moon },
  { id: 'zindagi', label: 'Zindagi', icon: Sparkles },
  { id: 'sufi', label: 'Sufi', icon: Flame },
  { id: 'mazaah', label: 'Mazaahiya', icon: Laugh },
];

export default function ComposePage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const supabase = createClient();

  const [selectedType, setSelectedType] = useState('Sher');
  const [selectedLang, setSelectedLang] = useState('hindi');
  const [selectedMood, setSelectedMood] = useState('ishq');
  const [lines, setLines] = useState<string[]>([
    'हज़ारों ख़्वाहिशें ऐसी कि हर ख़्वाहिश पे दम निकले',
    'बहुत निकले मिरे अरमान लेकिन फिर भी कम निकले'
  ]);
  const [tags, setTags] = useState('ishq, dilli, ghalib');
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [challengeName, setChallengeName] = useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const challenge = params.get('challenge');
      const tag = params.get('tag');
      if (challenge) {
        setChallengeName(challenge);
      }
      if (tag) {
        setTags(prev => prev ? `${tag}, ${prev}` : tag);
      }
    }
  }, []);

  const handleLineChange = (index: number, val: string) => {
    const updated = [...lines];
    updated[index] = val;
    setLines(updated);
  };

  const addLine = () => {
    setLines([...lines, '']);
  };

  const removeLine = (index: number) => {
    if (lines.length <= 1) return;
    setLines(lines.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    setErrorMsg(null);

    if (!user) {
      setErrorMsg('Mehfil me sher pesh karne ke liye pehle Login karein.');
      return;
    }

    const validLines = lines.filter(l => l.trim().length > 0);
    if (validLines.length === 0) {
      setErrorMsg('Kam se kam ek misra likhna zaroori hai.');
      return;
    }

    try {
      setPublishing(true);

      const parsedTags = tags
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(Boolean)
        .map(t => (t.startsWith('#') ? t : `#${t}`));

      const scriptType = selectedLang === 'urdu' 
        ? 'nastaliq' 
        : selectedLang === 'hindi' 
          ? 'devanagari' 
          : 'roman';

      const { data, error } = await supabase.from('posts').insert([
        {
          author_id: user.id,
          type: selectedType.toLowerCase() as any,
          language: selectedLang,
          script: scriptType as any,
          lines: validLines.map((text, idx) => ({ number: idx + 1, text })),
          tags: parsedTags,
          mood: selectedMood,
          visibility: 'public'
        }
      ]).select().single();

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      setPublished(true);
      setTimeout(() => {
        router.push('/feed');
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Sher publish karne me dikkat aayi.');
    } finally {
      setPublishing(false);
    }
  };

  const isRtl = selectedLang === 'urdu';

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/feed" className={styles.backBtn} aria-label="Back">
          <ArrowLeft size={22} strokeWidth={2.5} />
        </Link>
        <div className={styles.headerTitleWrap}>
          <h1 className={styles.headerTitle}>NAYA ALFAAZ</h1>
          <span className={styles.headerSub}>Compose Poetry • क़लम</span>
        </div>
      </header>

      {/* CHALLENGE PARTICIPATION BANNER */}
      {challengeName && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: 'var(--gold, #D9A93B)',
          color: 'var(--ink, #140F14)',
          border: '3px solid var(--ink, #140F14)',
          boxShadow: '4px 4px 0 var(--ink, #140F14)',
          padding: '12px 16px',
          marginBottom: '20px',
          fontFamily: 'var(--font-space-mono), monospace',
          fontSize: '13px',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}>
          <Trophy size={20} />
          <span>Tarahi Misra Challenge Entry: #{challengeName}</span>
        </div>
      )}

      {/* NOT LOGGED IN WARNING BANNER */}
      {!userLoading && !user && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--blush, #F7C6D0)',
          border: '3px solid var(--ink, #140F14)',
          boxShadow: '4px 4px 0 var(--ink, #140F14)',
          padding: '12px 16px',
          marginBottom: '20px',
          fontFamily: 'var(--font-space-mono), monospace',
          fontSize: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} color="var(--maroon, #5A0F2E)" />
            <span>Sher Mehfil me live karne ke liye Login zaroori hai.</span>
          </div>
          <Link href="/login" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--maroon, #5A0F2E)',
            color: 'var(--parchment, #F6ECD9)',
            padding: '6px 12px',
            border: '2px solid var(--ink, #140F14)',
            fontWeight: 'bold',
            textDecoration: 'none'
          }}>
            <LogIn size={14} /> Login
          </Link>
        </div>
      )}

      {errorMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--blush, #F7C6D0)',
          border: '2px solid var(--ink, #140F14)',
          padding: '10px 14px',
          marginBottom: '16px',
          fontFamily: 'var(--font-space-mono), monospace',
          fontSize: '12px',
        }}>
          <AlertCircle size={16} color="var(--error, #DC2626)" />
          <span>{errorMsg}</span>
        </div>
      )}

      <main className={styles.main}>
        {/* TYPE & LANGUAGE SELECTOR */}
        <section className={styles.metaSection}>
          <div className={styles.metaRow}>
            <span className={styles.sectionLabel}>Type of Sukhan:</span>
            <div className={styles.pillGroup}>
              {TYPES.map(t => (
                <button
                  key={t}
                  className={`${styles.pillBtn} ${selectedType === t ? styles.pillActive : ''}`}
                  onClick={() => setSelectedType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.metaRow}>
            <span className={styles.sectionLabel}>Language / Script:</span>
            <div className={styles.pillGroup}>
              {LANGUAGES.map(lang => (
                <button
                  key={lang.id}
                  className={`${styles.pillBtn} ${selectedLang === lang.id ? styles.pillActiveRoyal : ''}`}
                  onClick={() => setSelectedLang(lang.id)}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* LINES / MISRA EDITOR */}
        <section className={styles.editorSection}>
          <div className={styles.editorHeader}>
            <span className={styles.sectionLabel}>Misra / Lines ({lines.length})</span>
            <button className={styles.addLineBtn} onClick={addLine}>
              <Plus size={16} strokeWidth={2.5} />
              <span>Add Misra</span>
            </button>
          </div>

          <div className={styles.linesList}>
            {lines.map((line, idx) => (
              <div key={idx} className={styles.lineContainer}>
                <span className={styles.lineIndex}>#{idx + 1}</span>
                <input
                  type="text"
                  dir={isRtl ? 'rtl' : 'ltr'}
                  className={`${styles.lineInput} ${isRtl ? styles.lineInputUrdu : ''}`}
                  value={line}
                  onChange={(e) => handleLineChange(idx, e.target.value)}
                  placeholder={`Misra ${idx + 1}...`}
                />
                {lines.length > 1 && (
                  <button 
                    className={styles.deleteLineBtn} 
                    onClick={() => removeLine(idx)}
                    title="Remove line"
                  >
                    <Trash2 size={16} strokeWidth={2} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* MOOD & TAGS */}
        <section className={styles.optionsSection}>
          <span className={styles.sectionLabel}>Choose Mood:</span>
          <div className={styles.moodGrid}>
            {MOODS.map(m => {
              const IconComp = m.icon;
              const isSelected = selectedMood === m.id;
              return (
                <button
                  key={m.id}
                  className={`${styles.moodBtn} ${isSelected ? styles.moodActive : ''}`}
                  onClick={() => setSelectedMood(m.id)}
                >
                  <IconComp size={16} strokeWidth={2} />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          <div className={styles.tagsInputWrap}>
            <span className={styles.sectionLabel}>Tags (comma-separated):</span>
            <input
              type="text"
              className={styles.tagsInput}
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="ishq, dilli, ghalib, dard"
            />
          </div>
        </section>

        {/* LIVE PREVIEW CARD */}
        <section className={styles.previewSection}>
          <div className={styles.previewHeader}>
            <Eye size={16} strokeWidth={2} />
            <span>Feed Preview</span>
          </div>
          <div className={styles.previewCard}>
            <div className={styles.previewCardTop}>
              <span className={styles.previewPoet}>
                {user ? (user.user_metadata?.takhallus || user.user_metadata?.full_name || 'Aapka Takhallus') : 'Aapka Takhallus'}
              </span>
              <span className={styles.previewBadge}>{selectedType} • {selectedMood}</span>
            </div>
            <div className={styles.previewVerseBox} dir={isRtl ? 'rtl' : 'ltr'}>
              {lines.map((l, i) => (
                <p key={i} className={isRtl ? styles.previewUrduText : styles.previewHindiText}>
                  {l || '...'}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* PUBLISH BUTTON */}
        <div className={styles.publishContainer}>
          <button 
            className={styles.publishBtn} 
            onClick={handlePublish}
            disabled={publishing || published}
          >
            {publishing ? (
              <>
                <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} strokeWidth={2.5} />
                <span>Publishing to Mehfil...</span>
              </>
            ) : published ? (
              <>
                <CheckCircle2 size={22} strokeWidth={2.5} />
                <span>Published to Mehfil!</span>
              </>
            ) : (
              <>
                <Send size={20} strokeWidth={2.5} />
                <span>Publish to Mehfil</span>
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
