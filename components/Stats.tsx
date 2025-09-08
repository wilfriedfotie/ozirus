'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Zap, CheckCircle2, Rocket, Shield } from "lucide-react";

const stats = [
    { number: 90, suffix: '', label: 'Jours maximum', icon: <Zap className="w-8 h-8 text-primary" /> },
    { number: 100, suffix: '%', label: 'Produits fonctionnels', icon: <CheckCircle2 className="w-8 h-8 text-green-500" /> },
    { number: 15, suffix: '+', label: 'Projets livrés', icon: <Rocket className="w-8 h-8 text-purple-500" /> },
    { number: 24, suffix: '/7', label: 'Support dédié', icon: <Shield className="w-8 h-8 text-blue-500" /> },
];

function Counter({ end, suffix, duration = 2000 }: { end: number; suffix: string; duration?: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref);

    useEffect(() => {
        if (!isInView) return;

        let startTime: number;
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeOutCubic * end));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [isInView, end, duration]);

    return (
        <span ref={ref} className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            {count}{suffix}
        </span>
    );
}

export default function Stats() {
    return (
        <section className="py-20 bg-gradient-to-b from-background via-surface/10 to-background relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{
                                scale: 1.05,
                                transition: { duration: 0.2 }
                            }}
                            className="group relative"
                        >
                            <div className="text-center p-8 bg-surface/30 backdrop-blur-xl border border-white/10 rounded-3xl hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
                                {/* Icon */}
                                <motion.div
                                    whileHover={{ scale: 1.2, rotate: 10 }}
                                    className="text-4xl mb-4 inline-block"
                                >
                                    {stat.icon}
                                </motion.div>

                                {/* Number */}
                                <div className="mb-3">
                                    <Counter end={stat.number} suffix={stat.suffix} />
                                </div>

                                {/* Label */}
                                <p className="text-text-muted font-medium text-lg group-hover:text-text transition-colors duration-300">
                                    {stat.label}
                                </p>

                                {/* Hover Effect */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileHover={{ scale: 1 }}
                                    className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl -z-10"
                                />

                                {/* Floating Orb */}
                                <motion.div
                                    animate={{
                                        y: [0, -10, 0],
                                        opacity: [0.3, 0.6, 0.3]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        delay: index * 0.5
                                    }}
                                    className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full blur-lg opacity-30"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Additional Info */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-16"
                >
                    <div className="max-w-3xl mx-auto">
                        <h3 className="font-bricolage text-2xl md:text-3xl font-bold mb-6 text-text">
                            Pourquoi choisir Ozirus ?
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-text-muted">
                            <div className="flex flex-col items-center p-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-text mb-2">Vitesse d'exécution</h4>
                                <p className="text-sm">Méthodologie agile optimisée pour livrer rapidement sans compromettre la qualité.</p>
                            </div>

                            <div className="flex flex-col items-center p-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-text mb-2">Qualité garantie</h4>
                                <p className="text-sm">Code clean, tests automatisés, documentation complète pour un produit prêt à évoluer.</p>
                            </div>

                            <div className="flex flex-col items-center p-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-text mb-2">Équipe dédiée</h4>
                                <p className="text-sm">Des experts passionnés qui accompagnent votre projet de A à Z avec transparence.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}