'use client';

import React, { useState } from 'react';
import { Analytics } from "@vercel/analytics/next"
import GlobalLoader from '@/components/GlobalLoader';
import SharedNav from '@/components/SharedNav';
import ContactModal from '@/components/ContactModal';

export default function LayoutClientWrapper({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <GlobalLoader />
      <Analytics />
      <SharedNav onContactClick={() => setIsModalOpen(true)} />
      {children}
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
