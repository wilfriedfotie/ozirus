'use client';

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Process from '../components/Process';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import Realizations from '@/components/Realizations';
import Team from '@/components/Team';


export default function HomePage() {

  return (
    <main className="min-h-screen bg-background text-text">
      <Navbar />
      <Hero />
      <Services />
      <Realizations />
      <Process />
      <CTA />
      <Team />
      <Footer />
    </main>
  );
}