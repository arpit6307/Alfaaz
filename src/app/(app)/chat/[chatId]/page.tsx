'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Send, 
  BookOpen, 
  Sparkles, 
  Heart, 
  Hand,
  CheckCheck
} from 'lucide-react';
import { useUser } from '@/lib/hooks/useUser';
import styles from './page.module.css';

interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
  isSher?: boolean;
}

const CHAT_PROFILES: { [key: string]: { name: string; takhallus: string; bio: string; initial: string; initialMessages: Message[]; autoReplies: string[] } } = {
  mirza_ghalib: {
    name: 'Mirza Asadullah Khan',
    takhallus: 'मिर्ज़ा ग़ालिब (Ghalib)',
    bio: 'Shair-e-Azam • Delhi',
    initial: 'G',
    initialMessages: [
      { id: '1', sender: 'them', text: 'आदाब! कहिए आज क्या ख़्याल है?', time: '11:45 AM' },
      { id: '2', sender: 'them', text: 'हज़ारों ख़्वाहिशें ऐसी कि हर ख़्वाहिश पे दम निकले\nबहुत निकले मिरे अरमान लेकिन फिर भी कम निकले', time: '11:46 AM', isSher: true }
    ],
    autoReplies: [
      'रंज से ख़ूगर हुआ इंसाँ तो मिट जाता है रंज\nमुश्किलें मुझ पर पड़ीं इतनी कि आसाँ हो गईं',
      'इश्क़ पर ज़ोर नहीं है ये वो आतिश ग़ालिब\nकि लगाए न लगे और बुझाए न बने',
      'दिल-ए-नादाँ तुझे हुआ क्या है\nआख़िर इस दर्द की दवा क्या है'
    ]
  },
  allama_iqbal: {
    name: 'Allama Muhammad Iqbal',
    takhallus: 'अल्लामा इक़बाल (Iqbal)',
    bio: 'Mufakkir-e-Mashriq',
    initial: 'I',
    initialMessages: [
      { id: '1', sender: 'them', text: 'ख़ुदी को कर बुलंद इतना कि हर तक़दीर से पहले\nख़ुदा बंदे से ख़ुद पूछे बता तेरी रज़ा क्या है', time: '10:15 AM', isSher: true }
    ],
    autoReplies: [
      'सितारों से आगे जहाँ और भी हैं\nअभी इश्क़ के इम्तिहाँ और भी हैं',
      'हज़ारों साल नर्गिस अपनी बे-नूरी पे रोती है\nबड़ी मुश्किल से होता है चमन में दीदा-वर पैदा'
    ]
  },
  bait_bazi: {
    name: 'Bait-Bazi Live Arena',
    takhallus: 'Live Round #4',
    bio: 'हरफ़-ए-आख़िर: ' + 'नून' + ' (N)',
    initial: 'B',
    initialMessages: [
      { id: '1', sender: 'them', text: 'Mehfil me khush-aamdeed! Naya sher "नून" (N) se pesh karein.', time: 'Just now' },
      { id: '2', sender: 'them', text: 'नाज़ुकी उस के लब की क्या कहिए\nपंखुड़ी इक गुलाब की सी है', time: 'Just now', isSher: true }
    ],
    autoReplies: [
      'यह न थी हमारी क़िस्मत कि विसाल-ए-यार होता\nअगर और जीते रहते यही इंतज़ार होता',
      'तुम आए हो न शब-ए-इंतज़ार गुज़री है\nतलाश में है सहर बार बार गुज़री है'
    ]
  },
  dilli_darbar: {
    name: 'Dilli Darbar Mehfil',
    takhallus: 'Community Mehfil',
    bio: '42 Poets in room',
    initial: 'D',
    initialMessages: [
      { id: '1', sender: 'them', text: 'इरशाद! कोई नया कलाम सुनाइए जनाब.', time: '12:00 PM' }
    ],
    autoReplies: [
      'वाह वाह! बहुत ख़ूबसूरत मिसरा है!',
      'मुकर्रर! एक बार फिर इरशाद फरमाएं!'
    ]
  }
};

export default function ChatThreadPage({ params }: { params: Promise<{ chatId: string }> | { chatId: string } }) {
  const resolvedParams = 'then' in params ? use(params) : params;
  const chatId = resolvedParams.chatId.toLowerCase();

  const { user } = useUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const profile = CHAT_PROFILES[chatId] || {
    name: chatId.replace(/_/g, ' ').toUpperCase(),
    takhallus: `@${chatId}`,
    bio: 'Alfaaz Shayar',
    initial: chatId[0]?.toUpperCase() || 'S',
    initialMessages: [
      { id: '1', sender: 'them' as const, text: 'Adaab! Arz kiya hai...', time: '12:00 PM' }
    ],
    autoReplies: ['Wah! Kya khoob sher hai!', 'Bohot umdah kalaam!']
  };

  const [messages, setMessages] = useState<Message[]>(profile.initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isSherMode, setIsSherMode] = useState(false);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'me',
      text: text,
      time: timeStr,
      isSher: isSherMode || text.includes('\n')
    };

    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
    setIsSherMode(false);

    // Poetic auto-reply simulation after 1.5s
    setTimeout(() => {
      const replies = profile.autoReplies;
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'them',
          text: randomReply,
          time: replyTime,
          isSher: randomReply.includes('\n')
        }
      ]);
    }, 1200);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/chat" className={styles.backBtn} aria-label="Back to messages">
            <ArrowLeft size={22} strokeWidth={2.5} />
          </Link>
          
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              <span style={{ fontFamily: 'var(--font-heading), sans-serif', color: 'var(--parchment, #F6ECD9)', fontWeight: 'bold' }}>
                {profile.initial}
              </span>
            </div>
            <div>
              <h2 className={styles.userName}>{profile.name}</h2>
              <span style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: '11px', color: 'var(--text-secondary, #666)' }}>
                {profile.takhallus} • {profile.bio}
              </span>
            </div>
          </div>
        </div>

        <Link 
          href={`/u/${chatId}`} 
          style={{
            fontFamily: 'var(--font-space-mono), monospace',
            fontSize: '11px',
            color: 'var(--rose, #E8386D)',
            fontWeight: 'bold',
            textDecoration: 'none'
          }}
        >
          View Profile →
        </Link>
      </header>

      <main className={styles.messageList}>
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`${styles.message} ${msg.sender === 'me' ? styles.sent : styles.received} ${msg.isSher ? styles.sherMessage : ''}`}
          >
            {msg.isSher && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: 'var(--maroon, #5A0F2E)', fontWeight: 'bold', fontSize: '11px', fontFamily: 'var(--font-space-mono), monospace' }}>
                <BookOpen size={14} />
                <span>ARZ KIYA HAI (शेर)</span>
              </div>
            )}
            <p className={styles.text} style={{ whiteSpace: 'pre-line' }}>
              {msg.text}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <span className={styles.time}>{msg.time}</span>
              {msg.sender === 'me' && <CheckCheck size={12} style={{ color: 'var(--rose, #E8386D)' }} />}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      <footer className={styles.inputArea}>
        <button 
          type="button"
          className={`${styles.attachBtn} ${isSherMode ? styles.attachBtnActive : ''}`}
          onClick={() => setIsSherMode(!isSherMode)}
          title={isSherMode ? 'Sher mode active' : 'Switch to Sher couplet mode'}
        >
          <BookOpen size={20} strokeWidth={2} />
        </button>

        <form onSubmit={handleSendMessage} style={{ display: 'flex', flex: 1, gap: '8px' }}>
          <input 
            type="text" 
            placeholder={isSherMode ? 'Misra likhein (e.g. पहला मिसरा...)' : 'Type a message ya sher...'} 
            className={styles.input} 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className={styles.sendBtn} aria-label="Send message">
            <Send size={20} strokeWidth={2} />
          </button>
        </form>
      </footer>
    </div>
  );
}

