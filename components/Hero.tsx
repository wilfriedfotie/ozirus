'use client';

import { motion } from 'framer-motion';
import LiquidEther from './LiquidEther/LiquidEther';

export default function Hero() {
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
            {/* Liquid Background */}
            <div className="absolute inset-0 z-0">
                <LiquidEther
                    colors={['#5227FF', '#FF9FFC', '#B19EEF']}
                    mouseForce={20}
                    cursorSize={100}
                    isViscous={false}
                    viscous={30}
                    iterationsViscous={32}
                    iterationsPoisson={32}
                    resolution={0.5}
                    isBounce={false}
                    autoDemo={true}
                    autoSpeed={0.5}
                    autoIntensity={2.2}
                    takeoverDuration={0.25}
                    autoResumeDelay={3000}
                    autoRampDuration={0.6}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background/80 z-10" />

            {/* Content */}
            <div className="relative z-20 max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">


                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="font-bricolage text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
                >
                    Passez de <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">l’idée</span>
                    <br />
                    au <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">produit </span>
                    en <span className="relative inline-block">
                        <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">90 jours</span>
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.8, delay: 1.2 }}
                            className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"
                        />
                    </span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className=" md:text-2xl text-text-muted mb-12 max-w-3xl mx-auto leading-relaxed"
                >
                    🚀 Nous transformons vos idées en
                    <span className="text-accent font-semibold"> solutions digitales prêtes à scaler</span>.
                    Profitez de notre process éprouvé pour lancer plus vite, avec moins de risques.
                </motion.p>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => scrollToSection('contact')}
                        className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-full text-lg font-semibold shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 min-w-[250px]"
                    >
                        Démarrer mon projet
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => scrollToSection('services')}
                        className="border-2 border-white/20 text-text backdrop-blur-sm px-8 py-4 rounded-full text-lg font-semibold hover:border-primary/50 transition-all duration-300 min-w-[250px]"
                    >
                        Voir nos services
                    </motion.button>
                </motion.div>

                {/* Proof points */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="mt-16 flex flex-wrap justify-center items-center gap-8 text-text-muted"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-green-500 font-bold">✓</span>
                        <span className="font-medium">Livraison garantie en 90 jours</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-primary font-bold">⚡</span>
                        <span className="font-medium">Technologies de pointe</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-secondary font-bold">💬</span>
                        <span className="font-medium">Support dédié 24/7</span>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex flex-col items-center gap-2 text-text-muted cursor-pointer"
                    onClick={() => scrollToSection('services')}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </motion.div>
            </motion.div>
        </section>
    );
}
