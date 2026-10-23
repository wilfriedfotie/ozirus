'use client';

// Page publique de réservation : /book/<slug>. Intégrable sur n'importe quel site :
// <iframe src="https://ozirus.agency/book/<slug>?embed=1"> — en mode embed, le fond est
// transparent et la page publie sa hauteur au parent (message `ozirus-booking:height`).
import React, { Suspense, use, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import BookingWidget from '@/components/booking/BookingWidget';

export default function BookingPublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <Suspense fallback={null}><BookingPublicContent slug={slug} /></Suspense>;
}

function BookingPublicContent({ slug }: { slug: string }) {
  const embed = useSearchParams().get('embed') === '1';

  useEffect(() => {
    if (!embed || window.parent === window) return;
    const post = () => window.parent.postMessage({ type: 'ozirus-booking:height', slug, height: document.documentElement.scrollHeight }, '*');
    const observer = new ResizeObserver(post);
    observer.observe(document.body);
    post();
    return () => observer.disconnect();
  }, [embed, slug]);

  return (
    <main style={{ minHeight: embed ? undefined : '100vh', background: embed ? 'transparent' : '#F8FAFC', padding: embed ? 0 : '48px 16px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      {embed && <style>{'html,body{background:transparent!important}'}</style>}
      <div style={{ width: '100%', maxWidth: 1000 }}>
        <BookingWidget slug={slug} source={embed ? `embed:${typeof document !== 'undefined' ? document.referrer : ''}` : undefined} />
        {!embed && <p style={{ textAlign: 'center', fontSize: 12, color: '#94A3B8', marginTop: 18 }}>Réservation propulsée par <a href="https://ozirus.agency" style={{ color: '#64748B' }}>Ozirus</a></p>}
      </div>
    </main>
  );
}
