'use client';

import React from 'react';
import { Hand, Heart, UserPlus, MessageCircle, AtSign, CheckCheck, Bell } from 'lucide-react';
import styles from './page.module.css';

export default function NotificationsPage() {
  const notifications = [
    { id: 1, type: 'wah', user: 'ahmad_faraz', text: 'reacted Wah to your sher', time: '2m ago' },
    { id: 2, type: 'dil', user: 'faiz_ahmad', text: 'gave Dil Se to your post', time: '1h ago' },
    { id: 3, type: 'follow', user: 'rekhta_fan', text: 'started following you', time: '3h ago' },
    { id: 4, type: 'comment', user: 'shayar_lover', text: 'commented on your post', time: '5h ago' },
    { id: 5, type: 'mention', user: 'urdu_adab', text: 'mentioned you in a post', time: '1d ago' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'wah': return <Hand size={20} className={styles.iconWah} />;
      case 'dil': return <Heart size={20} className={styles.iconDil} />;
      case 'follow': return <UserPlus size={20} className={styles.iconFollow} />;
      case 'comment': return <MessageCircle size={20} className={styles.iconComment} />;
      case 'mention': return <AtSign size={20} className={styles.iconMention} />;
      default: return <Bell size={20} />;
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Notifications</h1>
        <button className={styles.markReadBtn}>
          <CheckCheck size={20} />
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.list}>
          {notifications.map((notif) => (
            <div key={notif.id} className={styles.notificationCard}>
              <div className={styles.iconWrapper}>
                {getIcon(notif.type)}
              </div>
              <div className={styles.content}>
                <p className={styles.text}>
                  <span className={styles.username}>@{notif.user}</span> {notif.text}
                </p>
                <span className={styles.time}>{notif.time}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
