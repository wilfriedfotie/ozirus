'use client';

import React, { useState } from 'react';
import { useSelectedLayoutSegment } from 'next/navigation';
import { Analytics } from "@vercel/analytics/next"
import GlobalLoader from '@/components/GlobalLoader';
import SharedNav from '@/components/SharedNav';
import ContactModal from '@/components/ContactModal';

export default function LayoutClientWrapper({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Les pages /book/* sont faites pour être intégrées (iframe) : pas de loader plein écran.
  const isBookingPage = useSelectedLayoutSegment() === 'book';

  React.useEffect(() => {
    const openContactModal = () => setIsModalOpen(true);

    window.addEventListener('ozirus:open-contact-modal', openContactModal);
    return () => window.removeEventListener('ozirus:open-contact-modal', openContactModal);
  }, []);

  return (
    <>
      {!isBookingPage && <GlobalLoader />}
      <Analytics />
      <SharedNav onContactClick={() => setIsModalOpen(true)} />
      {children}
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
