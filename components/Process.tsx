'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const processSteps = [
    {
        number: 1,
        title: 'Discovery & Stratégie',
        duration: '7-14 jours',
        description: 'Analyse approfondie de votre vision, définition des objectifs et planification technique détaillée pour maximiser l\'impact.',
        deliverables: ['Cahier des charges détaillé', 'Architecture technique', 'Planning projet', 'Maquettes wireframes'],
        icon: '🔍'
    },
    {
        number: 2,
        title: 'Design & Prototypage',
        duration: '14-21 jours',
        description: 'Création des maquettes haute fidélité, validation de l\'expérience utilisateur et développement du prototype interactif.',
        deliverables: ['Design system complet', 'Maquettes HD', 'Prototype cliquable', 'Guide UX/UI'],
        icon: '🎨'
    },
    {
        number: 3,
        title: 'Développement Agile',
        duration: '45-60 jours',
        description: 'Développement itératif avec feedback continu, intégration des dernières technologies et ajustements en temps réel.',
        deliverables: ['MVP fonctionnel', 'Tests automatisés', 'Documentation code', 'Intégrations API'],
        icon: '⚡'
    },
    {
        number: 4,
        title: 'Lancement & Optimisation',
        duration: '7-14 jours',
        description: 'Déploiement sécurisé, tests de performance et optimisations pour un lancement réussi sur le marché.',
        deliverables: ['Déploiement production', 'Tests de charge', 'Monitoring', 'Formation équipe'],
        icon: '🚀'
    }
];

export default function Process() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section id="process" className="py-24 bg-gradient-to-b from-background to-surface/20 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10" ref={ref}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <h2 className="font-bricolage text-4xl md:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">
                            Notre processus en{' '}
                        </span>
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            90 jours
                        </span>
                    </h2>
                    <p className="text-xl text-text-muted max-w-3xl mx-auto leading-relaxed">
                        Une méthodologie éprouvée pour livrer des produits exceptionnels en temps record
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                    {/* Connecting Line */}
                    <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-accent transform -translate-x-1/2" />

                    {/* Steps */}
                    <div className="space-y-16 lg:space-y-24">
                        {processSteps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                className={`flex flex-col lg:flex-row items-center gap-8 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                                    }`}
                            >
                                {/* Content Card */}
                                <div className="flex-1 max-w-lg">
                                    <div className="bg-surface/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="text-4xl">{step.icon}</div>
                                            <div>
                                                <h3 className="font-bricolage text-2xl font-bold text-text mb-1">
                                                    {step.title}
                                                </h3>
                                                <span className="text-primary font-semibold">{step.duration}</span>
                                            </div>
                                        </div>

                                        <p className="text-text-muted mb-6 leading-relaxed">
                                            {step.description}
                                        </p>

                                        <div>
                                            <h4 className="font-semibold text-text mb-3">Livrables clés :</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {step.deliverables.map((deliverable, deliverableIndex) => (
                                                    <motion.div
                                                        key={deliverableIndex}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        whileInView={{ opacity: 1, x: 0 }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 0.4, delay: (index * 0.2) + (deliverableIndex * 0.1) }}
                                                        className="flex items-center gap-2 text-sm"
                                                    >
                                                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                                        <span className="text-text-muted">{deliverable}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Step Number */}
                                <div className="relative lg:mx-8">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                                        className="relative z-10"
                                    >
                                        <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-2xl shadow-primary/30">
                                            <span className="text-2xl font-bold text-white">{step.number}</span>
                                        </div>

                                        {/* Pulsing Ring */}
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                                            className="absolute inset-0 border-2 border-primary rounded-full"
                                        />
                                    </motion.div>
                                </div>

                                {/* Spacer for mobile */}
                                <div className="flex-1 max-w-lg lg:hidden" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Timeline Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="mt-20 text-center"
                >
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 backdrop-blur-xl rounded-3xl p-8 max-w-4xl mx-auto">
                        <h3 className="font-bricolage text-2xl font-bold mb-4 text-text">
                            Suivi en temps réel
                        </h3>
                        <p className="text-text-muted mb-6">
                            Dashboard client pour suivre l'avancement, accéder aux livrables et communiquer avec l'équipe en permanence.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-text mb-1">Progress tracking</h4>
                                <p className="text-sm text-text-muted">Suivi en temps réel de l'avancement</p>
                            </div>

                            <div className="text-center">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-text mb-1">Communication</h4>
                                <p className="text-sm text-text-muted">Chat direct avec l'équipe</p>
                            </div>

                            <div className="text-center">
                                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-text mb-1">Livrables</h4>
                                <p className="text-sm text-text-muted">Accès instant aux documents</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}