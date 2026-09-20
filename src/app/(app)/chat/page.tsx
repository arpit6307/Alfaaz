'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  MessageSquare, 
  Sparkles, 
  Flame, 
  Users, 
  Plus, 
  CheckCheck
} from 'lucide-react';
import styles from './page.module.css';

interface ChatRoom {
  id: string;
  name: string;
  takhallus: string;
  avatarColor: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isRoom?: boolean;
}

const INITIAL_CHATS: ChatRoom[] = [
  {
    id: 'bait_bazi',
    name: 'Bait-Bazi Arena (बैत-बाज़ी)',
    takhallus: 'Live Arena',
    avatarColor: 'var(--rose, #E8386D)',
    lastMessage: 'Raheel: "नग़्मा-ए-शौक़ को बे-परदा सदा रहने दो..." (हरफ़: दाल)',
    time: 'Live',
    unreadCount: 5,
    isRoom: true
  },
  {
    id: 'mirza_ghalib',
    name: 'Mirza Ghalib',
    takhallus: 'मिर्ज़ा ग़ालिब',
    avatarColor: 'var(--maroon, #5A0F2E)',
    lastMessage: 'हज़ारों ख़्वाहिशें ऐसी कि हर ख़्वाहिश पे दम निकले...',
    time: '5m ago'
  },
  {
    id: 'allama_iqbal',
    name: 'Allama Iqbal',
    takhallus: 'अल्लामा इक़बाल',
    avatarColor: 'var(--royal, #3A1C71)',
    lastMessage: 'सितारों से आगे जहाँ और भी हैं, अभी इश्क़ के इम्तिहाँ और भी हैं...',
    time: '1h ago'
  },
  {
    id: 'dilli_darbar',
    name: 'Dilli Darbar Mehfil',
    takhallus: 'Community',
    avatarColor: 'var(--gold, #D9A93B)',
    lastMessage: 'Faizan: Irshad! Agla sher suniye janab...',
    time: '3h ago',
    isRoom: true
  },
  {
    id: 'faiz_ahmed',
    name: 'Faiz Ahmed Faiz',
    takhallus: 'फ़ैज़',
    avatarColor: 'var(--maroon, #5A0F2E)',
    lastMessage: 'मुझ से पहली सी मोहब्बत मिरे महबूब न माँग...',
    time: '1d ago'
  }
];

export default function ChatInboxPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = INITIAL_CHATS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.takhallus.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Guftagu (गुफ़्तगू / Messages)</h1>
          <p style={{
            margin: '4px 0 0 0',
            fontFamily: 'var(--font-space-mono), monospace',
            fontSize: '12px',
            color: 'var(--text-secondary, #666)'
          }}>
            शोरा और क़दरदानों के साथ रूबरू बातचीत और बैत-बाज़ी
          </p>
        </div>
      </header>

      <div className={styles.searchBar}>
        <Search size={20} className={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="Guftagu ya shayar search karein..." 
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <main className={styles.main}>
        {filteredChats.map((chat) => (
          <Link href={`/chat/${chat.id}`} key={chat.id} className={styles.chatCard}>
            <div 
              className={styles.avatar}
              style={{ backgroundColor: chat.avatarColor }}
            >
              <span style={{
                fontFamily: 'var(--font-heading), "Archivo Black", sans-serif',
                color: 'var(--parchment, #F6ECD9)',
                fontSize: '1.2rem'
              }}>
                {chat.name[0]?.toUpperCase()}
              </span>
            </div>

            <div className={styles.chatInfo}>
              <div className={styles.chatHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 className={styles.chatName}>{chat.name}</h3>
                  <span style={{
                    fontFamily: 'var(--font-space-mono), monospace',
                    fontSize: '10px',
                    backgroundColor: 'var(--parchment, #F6ECD9)',
                    border: '1px solid var(--ink, #140F14)',
                    padding: '1px 6px',
                    fontWeight: 'bold',
                    color: 'var(--ink, #140F14)'
                  }}>
                    {chat.takhallus}
                  </span>
                </div>
                <span className={styles.time}>{chat.time}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p className={styles.lastMessage}>{chat.lastMessage}</p>
                {chat.unreadCount && (
                  <span style={{
                    background: 'var(--rose, #E8386D)',
                    color: 'var(--white)',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    fontFamily: 'var(--font-space-mono), monospace',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '8px'
                  }}>
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}

