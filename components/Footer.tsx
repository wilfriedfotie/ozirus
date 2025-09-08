'use client';

import { motion } from 'framer-motion';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer id="contact" className="bg-surface border-t border-white/10 pt-16 pb-8 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
                    {/* Company Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-1"
                    >
                        <div className="mb-6">
                            <h3 className="font-bricolage text-3xl font-bold mb-4">
                                <img src="/logo.png" alt="Logo Ozirus" className='h-10' />

                            </h3>
                            <p className="text-text-muted leading-relaxed mb-6">
                                Votre partenaire pour l'innovation digitale rapide.
                                Nous transformons vos idées en produits exceptionnels en 90 jours.
                            </p>
                        </div>

                        {/* Social Links */}
                        <div className="flex space-x-4">
                            {[
                                { name: 'LinkedIn', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
                                { name: 'Twitter', icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' },
                                { name: 'GitHub', icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' }
                            ].map((social) => (
                                <motion.a
                                    key={social.name}
                                    href="#"
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-10 h-10 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/30 rounded-lg flex items-center justify-center transition-all duration-300"
                                >
                                    <svg className="w-5 h-5 text-text-muted hover:text-primary transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d={social.icon} />
                                    </svg>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <h3 className="font-bricolage text-2xl font-bold mb-6 text-text">
                            Démarrons votre projet
                        </h3>

                        <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Votre nom"
                                        className="w-full px-4 py-3 bg-background/50 border border-white/10 rounded-xl text-text placeholder-text-muted focus:border-primary/50 focus:outline-none transition-colors duration-300"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Votre email"
                                        className="w-full px-4 py-3 bg-background/50 border border-white/10 rounded-xl text-text placeholder-text-muted focus:border-primary/50 focus:outline-none transition-colors duration-300"
                                    />
                                </div>
                            </div>

                            <div>
                                <input
                                    type="text"
                                    placeholder="Nom de votre projet"
                                    className="w-full px-4 py-3 bg-background/50 border border-white/10 rounded-xl text-text placeholder-text-muted focus:border-primary/50 focus:outline-none transition-colors duration-300"
                                />
                            </div>

                            <div>
                                <textarea
                                    rows={4}
                                    placeholder="Décrivez votre vision en quelques mots..."
                                    className="w-full px-4 py-3 bg-background/50 border border-white/10 rounded-xl text-text placeholder-text-muted focus:border-primary/50 focus:outline-none transition-colors duration-300 resize-none"
                                />
                            </div>

                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(99, 102, 241, 0.4)" }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
                            >
                                Envoyer ma demande →
                            </motion.button>
                        </form>

                        {/* Contact Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-white/10">
                            <div className="text-center md:text-left">
                                <h4 className="font-semibold text-text mb-2">Email</h4>
                                <a href="mailto:hello@ozirus.com" className="text-text-muted hover:text-primary transition-colors duration-300">
                                    contact@ozirus.agency
                                </a>
                            </div>

                            <div className="text-center md:text-left">
                                <h4 className="font-semibold text-text mb-2">Téléphone</h4>
                                <a href="tel:+33123456789" className="text-text-muted hover:text-primary transition-colors duration-300">
                                    +237 6 78 61 56 77
                                </a>
                            </div>

                            <div className="text-center md:text-left">
                                <h4 className="font-semibold text-text mb-2">Localisation</h4>
                                <p className="text-text-muted">Yaoundé, Cameroun</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-text-muted text-sm"
                >
                    <p>
                        © {currentYear} Ozirus. Tous droits réservés. Fait avec ❤️ pour les entrepreneurs ambitieux.
                    </p>

                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-primary transition-colors duration-300">Mentions légales</a>
                        <a href="#" className="hover:text-primary transition-colors duration-300">Politique de confidentialité</a>
                        <a href="#" className="hover:text-primary transition-colors duration-300">CGV</a>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}