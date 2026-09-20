'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserRound, AtSign, Feather, Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import styles from './page.module.css';

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [takhallus, setTakhallus] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const getStrengthScore = () => {
    let score = 0;
    if (password.length > 7) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrengthScore();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      const cleanUsername = username.toLowerCase().trim().replace(/[^a-z0-9_]/g, '');

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username: cleanUsername || `shayar_${Date.now().toString().slice(-4)}`,
            takhallus: takhallus || fullName,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      if (data.session) {
        setSuccessMsg('Account created! Entering Mehfil...');
        setTimeout(() => {
          router.push('/onboarding');
        }, 1200);
      } else if (data.user) {
        setSuccessMsg('Account created! Please check your email to confirm your account, then log in.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Signup failed. Please try again.');
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
        <h1 className={styles.title}>Join Mehfil</h1>

        {errorMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--blush, #F7C6D0)',
            border: '2px solid var(--ink, #140F14)',
            padding: '10px',
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
            padding: '10px',
            marginBottom: '16px',
            fontFamily: 'var(--font-space-mono), monospace',
            fontSize: '12px',
            color: 'var(--ink, #140F14)',
          }}>
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        <form className={styles.form} onSubmit={handleSignup}>
          <div className={styles.inputGroup}>
            <UserRound size={20} className={styles.inputIcon} />
            <input 
              type="text" 
              placeholder="Full Name" 
              className={styles.input} 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <AtSign size={20} className={styles.inputIcon} />
            <input 
              type="text" 
              placeholder="Username (unique identifier)" 
              className={styles.input} 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <Feather size={20} className={styles.inputIcon} />
            <input 
              type="text" 
              placeholder="Takhallus (Pen Name, e.g. ग़ालिब)" 
              className={styles.input} 
              value={takhallus}
              onChange={(e) => setTakhallus(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <Mail size={20} className={styles.inputIcon} />
            <input 
              type="email" 
              placeholder="Email address" 
              className={styles.input} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              required
            />
            <button 
              type="button"
              className={styles.toggleBtn}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {password.length > 0 && (
            <div className={styles.strengthMeter}>
              <div className={`${styles.strengthBar} ${strength >= 1 ? styles.active : ''}`} />
              <div className={`${styles.strengthBar} ${strength >= 2 ? styles.active : ''}`} />
              <div className={`${styles.strengthBar} ${strength >= 3 ? styles.active : ''}`} />
              <div className={`${styles.strengthBar} ${strength >= 4 ? styles.active : ''}`} />
            </div>
          )}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Creating Account...</span>
              </span>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <p className={styles.footerText}>
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </motion.div>
    </main>
  );
}
