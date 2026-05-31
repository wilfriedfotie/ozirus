'use client';

import { useEffect, useState } from 'react';

type LoaderMode = 'full' | 'line';

export default function GlobalLoader() {
  const [mode, setMode] = useState<LoaderMode | null>(null);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const storageKey = 'ozirus-loader-seen';
    const hasSeenLoader = window.localStorage.getItem(storageKey) === 'true';
    const nextMode: LoaderMode = hasSeenLoader ? 'line' : 'full';
    const leaveDelay = nextMode === 'full' ? 950 : 650;
    const removeDelay = nextMode === 'full' ? 1250 : 900;

    setLeaving(false);
    setMode(nextMode);
    window.localStorage.setItem(storageKey, 'true');

    const leaveTimer = window.setTimeout(() => setLeaving(true), leaveDelay);
    const removeTimer = window.setTimeout(() => setMode(null), removeDelay);
    const loadTimer = window.setTimeout(() => {
      if (document.readyState === 'complete') {
        setLeaving(true);
        window.setTimeout(() => setMode(null), 280);
      }
    }, 500);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(removeTimer);
      window.clearTimeout(loadTimer);
    };
  }, []);

  if (!mode) return null;

  if (mode === 'line') {
    return (
      <div className={`global-loader-line ${leaving ? 'global-loader-line--leaving' : ''}`} aria-hidden="true">
        <span />
      </div>
    );
  }

  return (
    <div className={`global-loader ${leaving ? 'global-loader--leaving' : ''}`} role="status" aria-live="polite" aria-label="Chargement du site">
      <div className="global-loader__glow global-loader__glow--one" />
      <div className="global-loader__glow global-loader__glow--two" />

      <div className="global-loader__stage">
        <div className="global-loader__mark">
          <span className="global-loader__ring" />
          <img src="/logo.png" alt="Ozirus" className="global-loader__logo" />
        </div>

        <div className="global-loader__copy">
          <p className="global-loader__eyebrow">Ozirus Agency</p>
          <p className="global-loader__text">Préparation de l'expérience</p>
        </div>
      </div>
    </div>
  );
}
