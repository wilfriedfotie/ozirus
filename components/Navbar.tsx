'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${isScrolled
                ? 'backdrop-blur-xl bg-black/20 border border-white/10 shadow-2xl shadow-primary/20'
                : 'backdrop-blur-md bg-black/10 border border-white/5'
                } rounded-2xl px-6 py-3 w-[95%] max-w-4xl`}
        >
            <div className="flex items-center justify-between">
                {/* Logo */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="font-bricolage text-2xl font-bold"
                >
                    <img src="/logo.png" alt="Logo Ozirus" className='h-10' />
                </motion.div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    {[
                        { label: 'Services', id: 'services' },
                        { label: 'Processus', id: 'process' },
                        { label: 'Contact', id: 'contact' },
                    ].map((item) => (
                        <motion.button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-text-muted hover:text-text transition-colors duration-300 font-medium relative group"
                        >
                            {item.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full" />
                        </motion.button>
                    ))}
                </div>

                {/* CTA Button & Mobile Menu */}
                <div className="flex items-center space-x-4">
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(99, 102, 241, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => scrollToSection('contact')}
                        className="hidden sm:flex bg-gradient-to-r from-primary to-secondary text-white px-6 py-2.5 rounded-full font-semibold text-sm shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
                    >
                        Démarrer mon projet
                    </motion.button>

                    {/* Mobile Menu Button */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10"
                    >
                        <div className="w-5 h-5 flex flex-col justify-center items-center">
                            <span className={`w-full h-0.5 bg-text transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1'}`} />
                            <span className={`w-full h-0.5 bg-text transform transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                            <span className={`w-full h-0.5 bg-text transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-1'}`} />
                        </div>
                    </motion.button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden mt-4 pt-4 border-t border-white/10"
                    >
                        <div className="flex flex-col space-y-3">
                            {[
                                { label: 'Services', id: 'services' },
                                { label: 'Processus', id: 'process' },
                                { label: 'Contact', id: 'contact' },
                            ].map((item, index) => (
                                <motion.button
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => scrollToSection(item.id)}
                                    className="text-left text-text-muted hover:text-text transition-colors duration-300 py-2 px-3 rounded-lg hover:bg-white/5"
                                >
                                    {item.label}
                                </motion.button>
                            ))}
                            <motion.button
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                onClick={() => scrollToSection('contact')}
                                className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2.5 rounded-lg font-semibold text-sm mt-2 text-center"
                            >
                                Démarrer mon projet
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}