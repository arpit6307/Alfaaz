'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Palette, 
  Download, 
  Share2, 
  ArrowLeft, 
  Type, 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw,
  Sliders,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Shuffle,
  Crop,
  Smartphone,
  Square
} from 'lucide-react';
import { toPng, toBlob } from 'html-to-image';
import styles from './page.module.css';

const PRESET_COUPLETS = [
  {
    verse: 'हज़ारों ख़्वाहिशें ऐसी कि हर ख़्वाहिश पे दम निकले\nबहुत निकले मिरे अरमान लेकिन फिर भी कम निकले',
    poet: 'मिर्ज़ा ग़ालिब (Mirza Ghalib)'
  },
  {
    verse: 'پتہ پتہ بوٹا بوٹا حال ہمارا جانے ہے\nجانے نہ جانے گل ہی نہ جانے باغ تو سارا جانے ہے',
    poet: 'میر تقی میر (Mir Taqi Mir)'
  },
  {
    verse: 'मुझ से पहली सी मोहब्बत मिरे महबूब न माँग\nमैंने समझा था कि तू है तो दरख़्शाँ है हयात',
    poet: 'फ़ैज़ अहमद फ़ैज़ (Faiz Ahmed Faiz)'
  },
  {
    verse: 'सितारों से आगे जहाँ और भी हैं\nअभी इश्क़ के इम्तिहाँ और भी हैं',
    poet: 'अल्लामा इक़बाल (Allama Iqbal)'
  },
  {
    verse: 'Main bhi bahut ajeeb hun itna ajeeb hun ki bas\nKhud ko tabaah kar liya aur malaal bhi nahin',
    poet: 'Jaun Elia (जौन एलिया)'
  },
  {
    verse: 'बुलाती है मगर जाने का नईं\nये दुनिया है इधर जाने का नईं',
    poet: 'राहत इन्दौरी (Rahat Indori)'
  }
];

const TEMPLATES = [
  {
    id: 'classic',
    name: 'Parchment & Ink',
    bg: '#F6ECD9',
    text: '#140F14',
    accent: '#5A0F2E',
    border: '4px solid #140F14',
    font: 'var(--font-royal)',
  },
  {
    id: 'royal',
    name: 'Royal Maroon',
    bg: '#5A0F2E',
    text: '#F6ECD9',
    accent: '#D9A93B',
    border: '4px solid #D9A93B',
    font: 'var(--font-royal)',
  },
  {
    id: 'night',
    name: 'Raat Mode (Purple)',
    bg: '#1A1520',
    text: '#F6ECD9',
    accent: '#E8386D',
    border: '4px solid #E8386D',
    font: 'var(--font-heading)',
  },
  {
    id: 'rose',
    name: 'Gulaabi Rose',
    bg: '#F7C6D0',
    text: '#5A0F2E',
    accent: '#140F14',
    border: '4px solid #140F14',
    font: 'var(--font-royal)',
  },
  {
    id: 'gold',
    name: 'Zardaar Gold',
    bg: '#D9A93B',
    text: '#140F14',
    accent: '#5A0F2E',
    border: '4px solid #140F14',
    font: 'var(--font-heading)',
  },
  {
    id: 'minimal',
    name: 'Khaam Modern (BW)',
    bg: '#FFFFFF',
    text: '#140F14',
    accent: '#E8386D',
    border: '4px solid #140F14',
    font: 'var(--font-mono)',
  },
];

export default function CardStudioPage() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [verse, setVerse] = useState(PRESET_COUPLETS[0].verse);
  const [poet, setPoet] = useState(PRESET_COUPLETS[0].poet);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [textAlign, setTextAlign] = useState<'center' | 'left' | 'right'>('center');
  const [aspectRatio, setAspectRatio] = useState<'4/5' | '1/1'>('4/5');
  const [fontSize, setFontSize] = useState<number>(22);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Randomize couplet preset
  const handleRandomize = () => {
    const nextIdx = Math.floor(Math.random() * PRESET_COUPLETS.length);
    setVerse(PRESET_COUPLETS[nextIdx].verse);
    setPoet(PRESET_COUPLETS[nextIdx].poet);
    setStatusMessage('New Couplet Loaded!');
    setTimeout(() => setStatusMessage(null), 2000);
  };

  // Real PNG Download implementation
  const handleDownload = async () => {
    if (!cardRef.current || isGenerating) return;

    try {
      setIsGenerating(true);
      setStatusMessage('Rendering high-res card...');

      // High-resolution export (3x pixel ratio for retina/print sharpness)
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        quality: 0.98,
        filter: (node) => {
          // Exclude any ignore elements if needed
          return true;
        }
      });

      // Create download trigger
      const link = document.createElement('a');
      const sanitizedPoet = poet.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20) || 'shayari';
      link.download = `alfaaz_${sanitizedPoet}_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      setDownloadSuccess(true);
      setStatusMessage('Card Downloaded Successfully!');
      setTimeout(() => {
        setDownloadSuccess(false);
        setStatusMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error generating card image:', error);
      setStatusMessage('Export failed. Please try again.');
      setTimeout(() => setStatusMessage(null), 3000);
    } finally {
      setIsGenerating(false);
    }
  };

  // Real Web Share API or PNG Download Fallback
  const handleShare = async () => {
    if (!cardRef.current || isGenerating) return;

    try {
      setIsGenerating(true);
      setStatusMessage('Preparing card for share...');

      const blob = await toBlob(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        quality: 0.98,
      });

      if (!blob) throw new Error('Blob generation failed');

      const file = new File([blob], 'alfaaz-poetry.png', { type: 'image/png' });

      // Check if native Web Share API with files is supported (iOS Safari, Android Chrome)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Alfaaz Shayari Card',
          text: `${verse}\n\n— ${poet}\n\nCreated on Alfaaz (alfaaz.app)`,
          files: [file],
        });
        setShareSuccess(true);
        setStatusMessage('Shared successfully!');
      } else {
        // Desktop / Unsupported fallback: copy text and trigger direct download
        navigator.clipboard.writeText(`${verse}\n\n— ${poet}\n\nCreated on Alfaaz: https://alfaaz.app`);
        const dataUrl = await toPng(cardRef.current, { pixelRatio: 3 });
        const link = document.createElement('a');
        link.download = `alfaaz_share_${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
        setShareSuccess(true);
        setStatusMessage('Image downloaded & text copied to clipboard!');
      }

      setTimeout(() => {
        setShareSuccess(false);
        setStatusMessage(null);
      }, 3500);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Share error:', error);
        setStatusMessage('Share cancelled or not supported.');
        setTimeout(() => setStatusMessage(null), 2500);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(`${verse}\n\n— ${poet}\nVia Alfaaz (alfaaz.app)`);
    setCopied(true);
    setStatusMessage('Text copied to clipboard!');
    setTimeout(() => {
      setCopied(false);
      setStatusMessage(null);
    }, 2000);
  };

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <header className={styles.header}>
        <Link href="/feed" className={styles.backBtn} aria-label="Back to feed">
          <ArrowLeft size={22} strokeWidth={2.5} />
        </Link>
        <div className={styles.titleWrap}>
          <h1 className={styles.title}>
            <Palette size={26} className={styles.titleIcon} strokeWidth={2.5} />
            CARD STUDIO
          </h1>
          <span className={styles.subtitle}>Viral Poetry Card Generator • Export Real PNG</span>
        </div>

        <button 
          className={styles.randomizeBtn} 
          onClick={handleRandomize}
          title="Load Random Classical Sher"
        >
          <Shuffle size={18} strokeWidth={2} />
          <span>Random Sher</span>
        </button>
      </header>

      {/* STATUS BANNER */}
      {statusMessage && (
        <div className={styles.statusBar}>
          <Sparkles size={16} className={styles.statusIcon} />
          <span>{statusMessage}</span>
        </div>
      )}

      <main className={styles.main}>
        {/* LEFT COLUMN: LIVE CARD PREVIEW & CAPTURE TARGET */}
        <section className={styles.previewSection}>
          <div className={styles.cardPreviewContainer}>
            {/* THIS ELEMENT IS CAPTURED AS PNG */}
            <div 
              ref={cardRef}
              className={styles.cardFrame}
              style={{
                backgroundColor: selectedTemplate.bg,
                color: selectedTemplate.text,
                border: selectedTemplate.border,
                textAlign: textAlign,
                aspectRatio: aspectRatio === '4/5' ? '4 / 5' : '1 / 1',
              }}
            >
              {/* Card Header Stamp */}
              <div className={styles.cardWatermarkTop}>
                <span className={styles.brandMarkText}>अल्फ़ाज़ • ALFAAZ</span>
                <div 
                  className={styles.brandDot} 
                  style={{ backgroundColor: selectedTemplate.accent }}
                ></div>
                <span className={styles.brandSubtext}>SHER-O-SUKHAN</span>
              </div>

              {/* Card Main Verse Body */}
              <div className={styles.cardContent}>
                <p 
                  className={styles.cardVerse}
                  style={{ 
                    fontSize: `${fontSize}px`,
                    fontFamily: selectedTemplate.font
                  }}
                >
                  {verse}
                </p>
                <div 
                  className={styles.cardDivider}
                  style={{ backgroundColor: selectedTemplate.accent }}
                ></div>
                <p 
                  className={styles.cardPoet}
                  style={{ color: selectedTemplate.accent }}
                >
                  — {poet}
                </p>
              </div>

              {/* Card Footer Watermark */}
              <div className={styles.cardWatermarkBottom}>
                <span>alfaaz.app • The World&apos;s Poetry Platform</span>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS: DOWNLOAD & SHARE */}
          <div className={styles.actionsRow}>
            <button 
              className={styles.primaryActionBtn} 
              onClick={handleDownload}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={20} className={styles.spinIcon} strokeWidth={2.5} />
                  <span>Rendering...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check size={20} strokeWidth={2.5} />
                  <span>PNG Saved!</span>
                </>
              ) : (
                <>
                  <Download size={20} strokeWidth={2.5} />
                  <span>Download PNG</span>
                </>
              )}
            </button>

            <button 
              className={styles.shareActionBtn} 
              onClick={handleShare}
              disabled={isGenerating}
              title="Share to WhatsApp, Instagram or Stories"
            >
              {shareSuccess ? (
                <>
                  <Check size={20} strokeWidth={2.5} />
                  <span>Shared!</span>
                </>
              ) : (
                <>
                  <Share2 size={20} strokeWidth={2.5} />
                  <span>Share Card</span>
                </>
              )}
            </button>

            <button 
              className={styles.secondaryActionBtn} 
              onClick={handleCopyText}
              title="Copy verse text"
            >
              {copied ? (
                <Check size={20} strokeWidth={2.5} />
              ) : (
                <Copy size={20} strokeWidth={2.5} />
              )}
            </button>
          </div>
        </section>

        {/* RIGHT COLUMN: CONTROLS & TEMPLATES */}
        <section className={styles.controlsSection}>
          {/* VERSE INPUT */}
          <div className={styles.controlBox}>
            <label className={styles.label}>
              <Type size={16} strokeWidth={2} />
              <span>Shayari Text (Sher / Ghazal / Nazm)</span>
            </label>
            <textarea
              className={styles.textarea}
              rows={4}
              value={verse}
              onChange={(e) => setVerse(e.target.value)}
              placeholder="Apna sher yahan likhein..."
            />
          </div>

          {/* POET NAME */}
          <div className={styles.controlBox}>
            <label className={styles.label}>
              <span>Poet / Takhallus</span>
            </label>
            <input
              type="text"
              className={styles.input}
              value={poet}
              onChange={(e) => setPoet(e.target.value)}
              placeholder="Shayar ka naam / Takhallus..."
            />
          </div>

          {/* TEMPLATE PICKER */}
          <div className={styles.controlBox}>
            <label className={styles.label}>
              <Palette size={16} strokeWidth={2} />
              <span>Choose Card Theme ({TEMPLATES.length})</span>
            </label>
            <div className={styles.templateGrid}>
              {TEMPLATES.map((tmpl) => {
                const isSelected = selectedTemplate.id === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    className={`${styles.templateCard} ${isSelected ? styles.templateSelected : ''}`}
                    style={{ backgroundColor: tmpl.bg, color: tmpl.text }}
                    onClick={() => setSelectedTemplate(tmpl)}
                  >
                    <span className={styles.templateName}>{tmpl.name}</span>
                    {isSelected && <Check size={16} className={styles.templateCheck} strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STYLING & ASPECT RATIO CONTROLS */}
          <div className={styles.controlBox}>
            <label className={styles.label}>
              <Sliders size={16} strokeWidth={2} />
              <span>Formatting & Aspect Ratio</span>
            </label>
            
            <div className={styles.subControlRow}>
              {/* Text Alignment */}
              <div className={styles.alignGroup}>
                <button 
                  className={`${styles.alignBtn} ${textAlign === 'left' ? styles.alignActive : ''}`}
                  onClick={() => setTextAlign('left')}
                  title="Align Left"
                >
                  <AlignLeft size={18} strokeWidth={2} />
                </button>
                <button 
                  className={`${styles.alignBtn} ${textAlign === 'center' ? styles.alignActive : ''}`}
                  onClick={() => setTextAlign('center')}
                  title="Align Center"
                >
                  <AlignCenter size={18} strokeWidth={2} />
                </button>
                <button 
                  className={`${styles.alignBtn} ${textAlign === 'right' ? styles.alignActive : ''}`}
                  onClick={() => setTextAlign('right')}
                  title="Align Right"
                >
                  <AlignRight size={18} strokeWidth={2} />
                </button>
              </div>

              {/* Aspect Ratio Switcher (Post vs Story/Square) */}
              <div className={styles.aspectGroup}>
                <button
                  className={`${styles.aspectBtn} ${aspectRatio === '4/5' ? styles.alignActive : ''}`}
                  onClick={() => setAspectRatio('4/5')}
                  title="Portrait 4:5 (Instagram Feed & Stories)"
                >
                  <Smartphone size={16} strokeWidth={2} />
                  <span>4:5</span>
                </button>
                <button
                  className={`${styles.aspectBtn} ${aspectRatio === '1/1' ? styles.alignActive : ''}`}
                  onClick={() => setAspectRatio('1/1')}
                  title="Square 1:1"
                >
                  <Square size={16} strokeWidth={2} />
                  <span>1:1</span>
                </button>
              </div>
            </div>

            {/* Font Size Slider */}
            <div className={styles.fontSizeControlRow}>
              <span className={styles.sliderLabel}>Font Size: {fontSize}px</span>
              <input 
                type="range" 
                min="16" 
                max="34" 
                value={fontSize} 
                onChange={(e) => setFontSize(Number(e.target.value))}
                className={styles.rangeInput}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
