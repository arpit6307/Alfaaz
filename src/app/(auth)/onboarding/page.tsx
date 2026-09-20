'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Languages, Heart, HeartCrack, Moon, Sparkles, Flame, Laugh, UserRound, ArrowRight, SkipForward } from 'lucide-react';
import styles from './page.module.css';

const steps = [
  { id: 'language', title: 'Language' },
  { id: 'mood', title: 'Current Mood' },
  { id: 'poet', title: 'Favorite Poets' },
];

const languages = [
  { id: 'ur', label: 'Urdu', icon: Languages },
  { id: 'hi', label: 'Hindi', icon: Languages },
  { id: 'en', label: 'English', icon: Languages },
];

const moods = [
  { id: 'ishq', label: 'Ishq', icon: Heart },
  { id: 'judai', label: 'Judai', icon: HeartCrack },
  { id: 'tanhai', label: 'Tanhai', icon: Moon },
  { id: 'zindagi', label: 'Zindagi', icon: Sparkles },
  { id: 'sufi', label: 'Sufi', icon: Flame },
  { id: 'mazaahiya', label: 'Mazaahiya', icon: Laugh },
];

const poets = [
  { id: 'ghalib', label: 'Ghalib' },
  { id: 'faiz', label: 'Faiz' },
  { id: 'mir', label: 'Mir Taqi Mir' },
  { id: 'jaun', label: 'Jaun Elia' },
  { id: 'iqbal', label: 'Allama Iqbal' },
  { id: 'rahat', label: 'Rahat Indori' },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({
    languages: [] as string[],
    moods: [] as string[],
    poets: [] as string[],
  });

  const toggleSelection = (category: keyof typeof selections, item: string) => {
    setSelections(prev => {
      const current = prev[category];
      if (current.includes(item)) {
        return { ...prev, [category]: current.filter(i => i !== item) };
      }
      return { ...prev, [category]: [...current, item] };
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      // finish
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.progressContainer}>
        {steps.map((_, idx) => (
          <div 
            key={idx} 
            className={`${styles.progressBar} ${idx <= currentStep ? styles.activeBar : ''}`} 
          />
        ))}
      </div>

      <div className={styles.content}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={styles.stepContainer}
          >
            <h1 className={styles.title}>
              {currentStep === 0 && 'What languages do you read?'}
              {currentStep === 1 && 'What moves your heart today?'}
              {currentStep === 2 && 'Who do you admire?'}
            </h1>

            <div className={styles.grid}>
              {currentStep === 0 && languages.map(lang => (
                <button
                  key={lang.id}
                  className={`${styles.optionBtn} ${selections.languages.includes(lang.id) ? styles.selected : ''}`}
                  onClick={() => toggleSelection('languages', lang.id)}
                >
                  <lang.icon size={24} className={styles.optionIcon} />
                  <span>{lang.label}</span>
                </button>
              ))}

              {currentStep === 1 && moods.map(mood => (
                <button
                  key={mood.id}
                  className={`${styles.optionBtn} ${selections.moods.includes(mood.id) ? styles.selected : ''}`}
                  onClick={() => toggleSelection('moods', mood.id)}
                >
                  <mood.icon size={24} className={styles.optionIcon} />
                  <span>{mood.label}</span>
                </button>
              ))}

              {currentStep === 2 && poets.map(poet => (
                <button
                  key={poet.id}
                  className={`${styles.optionBtn} ${selections.poets.includes(poet.id) ? styles.selected : ''}`}
                  onClick={() => toggleSelection('poets', poet.id)}
                >
                  <UserRound size={24} className={styles.optionIcon} />
                  <span>{poet.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={styles.footer}>
        <button className={styles.skipBtn} onClick={nextStep}>
          <SkipForward size={16} /> Skip
        </button>
        <button className={styles.nextBtn} onClick={nextStep}>
          {currentStep === steps.length - 1 ? 'Finish' : 'Next'} <ArrowRight size={20} />
        </button>
      </div>
    </main>
  );
}
