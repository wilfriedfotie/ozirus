'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const services = [
    {
        icon: '⚡',
        title: 'Plateformes SaaS',
        description: 'Nous concevons des logiciels robustes et évolutifs, du cloud au frontend, capables de soutenir votre croissance et vos premiers milliers d’utilisateurs.',
        features: ['Architecture robuste', 'CI/CD automatisé', 'Observabilité & monitoring', 'Sécurité de niveau entreprise'],
        gradient: 'from-blue-500 to-purple-600'
    },
    {
        icon: '📲',
        title: 'Applications Mobiles',
        description: 'Nous développons des applications iOS & Android fluides, performantes et prêtes à séduire vos utilisateurs dès leur lancement.',
        features: ['Flutter', 'Design system unifié', 'Performance optimisée', 'Publication App Store & Play Store'],
        gradient: 'from-green-500 to-teal-600'
    },
    {
        icon: '🧩',
        title: 'IA & Automatisation',
        description: 'Nous créons des agents intelligents et des workflows automatisés (n8n, APIs, modèles IA) pour accélérer vos opérations et éliminer les tâches répétitives.',
        features: ['Agents AI sur-mesure', 'Workflows n8n & intégrations API', 'NLP & analyse de données', 'Automatisation de processus métiers'],
        gradient: 'from-purple-500 to-pink-600'
    },
    {
        icon: '✦',
        title: 'Expériences Créatives',
        description: 'Nous allions technologie et esthétique pour concevoir des expériences numériques immersives qui laissent une empreinte durable.',
        features: ['WebGL & Three.js', 'Animations fluides', 'Design immersif', 'Performance haute'],
        gradient: 'from-orange-500 to-red-600'
    }
];


export default function Services() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <section id="services" className="py-24 bg-background relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/20 to-background" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="font-bricolage text-4xl md:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">
                            Nos domaines d'
                        </span>
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            expertise
                        </span>
                    </h2>
                    <p className="text-xl text-text-muted max-w-3xl mx-auto leading-relaxed">
                        Des technologies de pointe pour transformer vos idées en
                        <span className="text-accent font-semibold"> produits révolutionnaires</span>
                    </p>
                </motion.div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className="group relative"
                        >
                            <div className="relative bg-surface/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-full transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10">
                                {/* Gradient Background on Hover */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: hoveredIndex === index ? 0.1 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`absolute inset-0 bg-gradient-to-br ${service.gradient} rounded-3xl`}
                                />

                                {/* Content */}
                                <div className="relative z-10">
                                    {/* Icon */}
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className="text-6xl mb-6 inline-block"
                                    >
                                        {service.icon}
                                    </motion.div>

                                    {/* Title */}
                                    <h3 className="font-bricolage text-2xl font-bold mb-4 text-text group-hover:text-white transition-colors duration-300">
                                        {service.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-text-muted mb-6 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                                        {service.description}
                                    </p>

                                    {/* Features */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {service.features.map((feature, featureIndex) => (
                                            <motion.div
                                                key={featureIndex}
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.4, delay: (index * 0.1) + (featureIndex * 0.05) }}
                                                className="flex items-center gap-2 text-sm"
                                            >
                                                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                                <span className="text-text-muted group-hover:text-white/70 transition-colors duration-300">
                                                    {feature}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* CTA */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="mt-8 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-full font-semibold text-sm shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0"
                                    >
                                        Découvrir ce service →
                                    </motion.button>
                                </div>

                                {/* Floating Elements */}
                                <motion.div
                                    animate={{
                                        rotate: hoveredIndex === index ? 360 : 0,
                                        scale: hoveredIndex === index ? 1.1 : 1
                                    }}
                                    transition={{ duration: 2, ease: "easeInOut" }}
                                    className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-16"
                >
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 backdrop-blur-xl rounded-2xl p-8 max-w-2xl mx-auto">
                        <h3 className="font-bricolage text-2xl font-bold mb-4 text-text">
                            Un projet en tête ?
                        </h3>
                        <p className="text-text-muted mb-6">
                            Discutons de votre vision et découvrons comment nous pouvons la transformer en réalité en 90 jours.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(99, 102, 241, 0.4)" }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
                        >
                            Planifier un appel découverte
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}