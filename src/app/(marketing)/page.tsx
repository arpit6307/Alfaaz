'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  PenLine, 
  Palette, 
  UserPen, 
  Users, 
  Trophy, 
  BookOpen, 
  Hand, 
  Mic, 
  Repeat, 
  Heart, 
  ArrowRight, 
  Sparkles, 
  Share2, 
  Compass,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import dynamic from 'next/dynamic';
import HeroFallback from '@/components/three/HeroFallback';
import styles from './page.module.css';

const HeroCanvas = dynamic(() => import('@/components/three/HeroCanvas'), {
  ssr: false,
  loading: () => <HeroFallback />,
});

const couplets = [
  { text: "हज़ारों ख़्वाहिशें ऐसी कि हर ख़्वाहish पे दम निकले", poet: "मिर्ज़ा ग़ालिब" },
  { text: "hazāroñ ḳhvāhisheñ aisī ki har ḳhvāhish pe dam nikle", poet: "Mirza Ghalib" },
  { text: "इब्तिदा-ए-इश्क़ है रोता है क्या, आगे आगे देखिए होता है क्या", poet: "मीर तक़ी मीर" },
  { text: "ibtida-e-ishq hai rota hai kya, aage aage dekhiye hota hai kya", poet: "Mir Taqi Mir" },
  { text: "गुलों में रंग भरे बाद-ए-नौबहार चले, चले भी आओ कि गुलशन का कारोबार चले", poet: "फ़ैज़ अहमद फ़ैज़" },
  { text: "सितारों से आगे जहाँ और भी हैं, अभी इश्क़ के इम्तिहाँ और भी हैं", poet: "अल्लामा इक़बाल" },
  { text: "बुलाती है मगर जाने का नईं, ये दुनिया है इधर जाने का नईं", poet: "राहत इन्दौरी" },
];

const features = [
  { 
    icon: PenLine, 
    title: 'Compose (क़लम)', 
    desc: 'Write in Hindi (Devanagari), Urdu (Nastaliq RTL), Roman Hinglish or English. Clean typography with line-by-line misra layout.' 
  },
  { 
    icon: Palette, 
    title: 'Card Studio', 
    desc: 'Transform couplets into shareable brutalist cards for Instagram and WhatsApp with bespoke parchment and royal templates.' 
  },
  { 
    icon: UserPen, 
    title: 'Takhallus (तख़ल्लुस)', 
    desc: 'Claim your poetic pen-name identity — like Ghalib, Mir, and Faiz. Build your literary legacy and gather dedicated qadardans.' 
  },
  { 
    icon: Users, 
    title: 'Mehfil (महफ़िल)', 
    desc: 'Digital mushaira spaces. Connect with poets across Delhi, Lahore, Lucknow, Dhaka, and worldwide diaspora communities.' 
  },
  { 
    icon: Trophy, 
    title: 'Daily Misra & Bait-Bazi', 
    desc: 'Compete in daily line completion challenges and classical chain poetry games. Climb the Shair-e-Sukhan leaderboards.' 
  },
  { 
    icon: BookOpen, 
    title: 'Diwan (दीवान)', 
    desc: 'Compile your verses into your very own digital poetry anthology book. Ready to read, share, and preserve for generations.' 
  },
];

export default function MarketingPage() {
  const [activeReactions, setActiveReactions] = useState<{ [key: string]: number }>({
    wah: 142,
    irshad: 89,
    mukarrar: 64,
    dilSe: 230,
  });
  const [reacted, setReacted] = useState<{ [key: string]: boolean }>({});
  const [saved, setSaved] = useState(false);

  const toggleReaction = (type: string) => {
    setReacted(prev => {
      const isAlready = prev[type];
      setActiveReactions(counts => ({
        ...counts,
        [type]: isAlready ? counts[type] - 1 : counts[type] + 1
      }));
      return { ...prev, [type]: !isAlready };
    });
  };

  return (
    <div className={styles.container}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        {/* 3D HERO CANVAS (BEHIND CONTENT) */}
        <HeroCanvas />

        <div className={styles.heroContent}>
          <div className={styles.heroDecorTop}>
            <span className={styles.sticker}>100% FREE & OPEN SOURCE</span>
            <span className={styles.stickerGold}>WORLDWIDE MULTI-SCRIPT</span>
          </div>

          <div className={styles.brandBadge}>
            <Sparkles size={16} className={styles.sparkleIcon} />
            <span>INSTAGRAM + REKHTA + DISCORD FOR SHAYARS</span>
          </div>

          <h1 className={styles.mainTitle}>
            <span className={styles.titleHindi}>अल्फ़ाज़</span>
            <span className={styles.titleUrdu}>الفاظ</span>
            <span className={styles.titleEnglish}>ALFAAZ</span>
          </h1>

          <p className={styles.heroTagline}>
            &ldquo;जहाँ लफ़्ज़ ज़िंदा हैं — Jahan Lafz Zinda Hain&rdquo;
          </p>

          <p className={styles.heroDescription}>
            The dedicated social platform for poets, readers, and lovers of Urdu, Hindi, and Hinglish poetry.
            Compose with authentic script support, receive real Daad, design stunning cards, and join live Mehfils.
          </p>

          <div className={styles.ctaGroup}>
            <Link href="/signup" className={styles.primaryBtn}>
              Likhna Shuru Karo <ArrowRight size={20} strokeWidth={2.5} />
            </Link>
            <Link href="/feed" className={styles.secondaryBtn}>
              Explore Mehfil <Compass size={20} strokeWidth={2.5} />
            </Link>
          </div>

          <div className={styles.supportedScripts}>
            <span className={styles.scriptPill}><CheckCircle2 size={14} /> देवनागरी (Hindi)</span>
            <span className={styles.scriptPill}><CheckCircle2 size={14} /> نستعلیق (Urdu RTL)</span>
            <span className={styles.scriptPill}><CheckCircle2 size={14} /> Roman / Hinglish</span>
            <span className={styles.scriptPill}><CheckCircle2 size={14} /> English Poetry</span>
          </div>
        </div>
      </section>

      {/* MARQUEE COUPLIT TICKER */}
      <div className={styles.tickerContainer}>
        <div className={styles.tickerTrack}>
          {couplets.concat(couplets).map((item, idx) => (
            <div key={idx} className={styles.tickerItem}>
              <span className={styles.tickerText}>&ldquo;{item.text}&rdquo;</span>
              <span className={styles.tickerPoet}>— {item.poet}</span>
              <span className={styles.tickerDivider}>✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* INTERACTIVE SHAYARI SHOWCASE */}
      <section className={styles.showcaseSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>LIVE DEMO</span>
          <h2 className={styles.sectionHeading}>SHER-E-KHAAS</h2>
          <p className={styles.sectionSubtitle}>
            Experience how poetry breathes on Alfaaz with authentic typography, takhallus recognition, and cultural reactions.
          </p>
        </div>

        <div className={styles.cardContainer}>
          <article className={styles.poemCard}>
            <div className={styles.cardTop}>
              <div className={styles.poetInfo}>
                <div className={styles.poetAvatar}>G</div>
                <div>
                  <div className={styles.poetNameRow}>
                    <h3 className={styles.poetName}>Mirza Asadullah Baig</h3>
                    <span className={styles.takhallusBadge}>तख़ल्लुस: ग़ालिब</span>
                  </div>
                  <span className={styles.postMeta}>Dilli, Hindustan • Classical Sher</span>
                </div>
              </div>
              <button 
                className={`${styles.bookmarkButton} ${saved ? styles.savedActive : ''}`} 
                onClick={() => setSaved(!saved)}
                aria-label="Save poem"
              >
                <Bookmark size={20} fill={saved ? 'var(--gold)' : 'none'} strokeWidth={2} />
              </button>
            </div>

            <div className={styles.verseBody}>
              <p className={styles.misraUrdu} dir="rtl">
                ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم نکلے<br />
                بہت نکلے مرے ارمان لیکن پھر بھی کم نکلے
              </p>
              <div className={styles.dividerLine}></div>
              <p className={styles.misraHindi}>
                हज़ारों ख़्वाहिशें ऐसी कि हर ख़्वाहिश पे दम निकले<br />
                बहुत निकले मिरे अरमान लेकिन फिर भी कम निकले
              </p>
            </div>

            <div className={styles.tagsRow}>
              <span className={styles.tagPill}>#ghazal</span>
              <span className={styles.tagPill}>#ishq</span>
              <span className={styles.tagPill}>#classic</span>
              <span className={styles.tagPill}>#ghalib</span>
            </div>

            <div className={styles.reactionsBar}>
              <button 
                className={`${styles.reactionButton} ${reacted.wah ? styles.reactionActive : ''}`}
                onClick={() => toggleReaction('wah')}
              >
                <Hand size={18} strokeWidth={2} />
                <span>Wah Wah</span>
                <span className={styles.reactionCount}>{activeReactions.wah}</span>
              </button>

              <button 
                className={`${styles.reactionButton} ${reacted.irshad ? styles.reactionActive : ''}`}
                onClick={() => toggleReaction('irshad')}
              >
                <Mic size={18} strokeWidth={2} />
                <span>Irshad</span>
                <span className={styles.reactionCount}>{activeReactions.irshad}</span>
              </button>

              <button 
                className={`${styles.reactionButton} ${reacted.mukarrar ? styles.reactionActive : ''}`}
                onClick={() => toggleReaction('mukarrar')}
              >
                <Repeat size={18} strokeWidth={2} />
                <span>Mukarrar</span>
                <span className={styles.reactionCount}>{activeReactions.mukarrar}</span>
              </button>

              <button 
                className={`${styles.reactionButton} ${reacted.dilSe ? styles.reactionActiveRose : ''}`}
                onClick={() => toggleReaction('dilSe')}
              >
                <Heart size={18} strokeWidth={2} fill={reacted.dilSe ? 'var(--rose)' : 'none'} />
                <span>Dil Se</span>
                <span className={styles.reactionCount}>{activeReactions.dilSe}</span>
              </button>

              <Link href="/card-studio" className={styles.cardStudioActionBtn} title="Convert to Card">
                <Palette size={18} strokeWidth={2} />
                <span>Card Studio</span>
              </Link>

              <button className={styles.shareActionBtn} title="Share">
                <Share2 size={18} strokeWidth={2} />
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>PLATFORM ARCHITECTURE</span>
          <h2 className={styles.sectionHeading}>BUILT FOR THE POETRY ECOSYSTEM</h2>
          <p className={styles.sectionSubtitle}>
            Every feature designed specifically around the traditions of Urdu, Hindi, and world poetry communities.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <div key={idx} className={styles.featureCard}>
                <div className={styles.featureIconBox}>
                  <IconComponent size={28} strokeWidth={2.5} className={styles.featureIcon} />
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* BIG CTA BANNER */}
      <section className={styles.ctaBannerSection}>
        <div className={styles.ctaBanner}>
          <h2 className={styles.ctaBannerTitle}>
            Aapki Shayari Ka Safar Yahan Se Shuru Hota Hai.
          </h2>
          <p className={styles.ctaBannerSub}>
            Join thousands of shayars, writers, and readers across India, Pakistan, and across the globe. Zero fees, forever.
          </p>
          <div className={styles.ctaBannerButtons}>
            <Link href="/signup" className={styles.ctaBannerPrimaryBtn}>
              Apna Takhallus Claim Karein <ArrowRight size={20} strokeWidth={2.5} />
            </Link>
            <Link href="/feed" className={styles.ctaBannerSecondaryBtn}>
              Mehfil Me Dakhil Hon
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
