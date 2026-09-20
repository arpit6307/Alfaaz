'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, RefreshCw, LogIn } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Kripya email aur password dono enter karein.');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrorMsg('Galat Email ya Password. Kripya check karke dobara enter karein.');
        } else if (error.message.includes('Email not confirmed')) {
          setErrorMsg('Email confirm nahi hua hai. Kripya apna email check karein ya Supabase me Confirm Email off karein.');
        } else {
          setErrorMsg(error.message);
        }
        return;
      }

      if (data.session) {
        setSuccessMsg('Pehchaan Kamyab! Mehfil me khair-maqdam hai...');
        setTimeout(() => {
          router.push('/feed');
        }, 800);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login karne me dikkat aayi. Kripya dobara try karein.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <motion.div 
        className={styles.card}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 className={styles.title}>Enter Mehfil</h1>
          <p style={{
            fontFamily: 'var(--font-space-mono), monospace',
            fontSize: '12px',
            color: '#666',
            marginTop: '4px'
          }}>
            Apne Email & Password se dakhil hon
          </p>
        </div>
        
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
            color: 'var(--ink, #140F14)',
          }}>
            <AlertCircle size={16} color="var(--error, #DC2626)" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--gold, #D9A93B)',
            border: '2px solid var(--ink, #140F14)',
            padding: '10px 14px',
            marginBottom: '16px',
            fontFamily: 'var(--font-space-mono), monospace',
            fontSize: '12px',
            color: 'var(--ink, #140F14)',
          }}>
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* CLEAN EMAIL & PASSWORD FORM */}
        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <Mail size={20} className={styles.inputIcon} />
            <input 
              type="email" 
              placeholder="Email address" 
              className={styles.input} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <Lock size={20} className={styles.inputIcon} />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              className={styles.input} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button 
              type="button"
              className={styles.toggleBtn}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Entering Mehfil...</span>
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <LogIn size={18} />
                <span>Login</span>
              </span>
            )}
          </button>
        </form>

        <p className={styles.footerText} style={{ marginTop: '24px', textAlign: 'center' }}>
          No takhallus yet? <Link href="/signup">Sign up</Link>
        </p>
      </motion.div>
    </main>
  );
}
