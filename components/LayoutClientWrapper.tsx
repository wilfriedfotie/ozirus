'use client';

import React, { useState } from 'react';
import { useSelectedLayoutSegment } from 'next/navigation';
import { Analytics } from "@vercel/analytics/next"
import GlobalLoader from '@/components/GlobalLoader';
import SharedNav from '@/components/SharedNav';
import ContactModal from '@/components/ContactModal';

export default function LayoutClientWrapper({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Pas de loader plein écran sur les pages /book/* (intégrées en iframe), ni sur la landing /mvp :
  // son hero est rendu côté serveur et s'anime en CSS, le loader ne ferait que le masquer.
  const segment = useSelectedLayoutSegment();
  const noLoader = segment === 'book' || segment === 'mvp';

  React.useEffect(() => {
    const openContactModal = () => setIsModalOpen(true);

    window.addEventListener('ozirus:open-contact-modal', openContactModal);
    return () => window.removeEventListener('ozirus:open-contact-modal', openContactModal);
  }, []);

  return (
    <>
      {!noLoader && <GlobalLoader />}
      <Analytics />
      <SharedNav onContactClick={() => setIsModalOpen(true)} />
      {children}
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
