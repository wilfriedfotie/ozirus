'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const projects = [
    {
        id: 1,
        title: 'FinTech Revolution',
        category: 'Plateforme SaaS',
        description: 'Plateforme de trading automatisé avec IA intégrée pour 50k+ utilisateurs actifs',
        image: 'https://images.unsplash.com/photo-1641974306019-1a07d5a7a5ee?auto=format&fit=crop&w=1200&q=80',
        tags: ['React', 'Node.js', 'AI/ML', 'WebSocket'],
        results: ['50k+ utilisateurs', '99.9% uptime', '40% ROI client'],
        duration: '85 jours',
        gradient: 'from-blue-500 to-purple-600',
        year: '2024'
    },
    {
        id: 2,
        title: 'EcoTrace',
        category: 'Application Mobile',
        description: 'App de tracking carbone avec gamification et impact social pour entreprises',
        image: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c28?auto=format&fit=crop&w=1200&q=80',
        tags: ['Flutter', 'Firebase', 'Analytics', 'Gamification'],
        results: ['200+ entreprises', '4.8★ stores', '60% engagement'],
        duration: '72 jours',
        gradient: 'from-green-500 to-teal-600',
        year: '2024'
    },
    {
        id: 3,
        title: 'AutoFlow',
        category: 'IA & Automatisation',
        description: 'Système d\'automatisation RH avec agents IA pour PME et startups',
        image: 'https://images.unsplash.com/photo-1664575602554-2080f84a6d52?auto=format&fit=crop&w=1200&q=80',
        tags: ['n8n', 'OpenAI', 'Zapier', 'Analytics'],
        results: ['80% temps gagné', '10x ROI', '500+ workflows'],
        duration: '63 jours',
        gradient: 'from-purple-500 to-pink-600',
        year: '2023'
    },
    {
        id: 4,
        title: 'NeuralViz',
        category: 'Expérience Créative',
        description: 'Plateforme de visualisation de données scientifiques en temps réel 3D',
        image: 'https://images.unsplash.com/photo-1624620994712-bf7bff8e9c62?auto=format&fit=crop&w=1200&q=80',
        tags: ['Three.js', 'WebGL', 'Real-time', 'DataViz'],
        results: ['Prix innovation', '1M+ vues', 'Viral LinkedIn'],
        duration: '78 jours',
        gradient: 'from-orange-500 to-red-600',
        year: '2023'
    },
    {
        id: 5,
        title: 'MedConnect',
        category: 'Plateforme SaaS',
        description: 'Télémédecine sécurisée avec prescription digitale et suivi patient',
        image: 'https://images.unsplash.com/photo-1581091870622-1e7e6e6af2f4?auto=format&fit=crop&w=1200&q=80',
        tags: ['HIPAA', 'Video', 'Security', 'React'],
        results: ['1000+ médecins', 'Certification', '95% satisfaction'],
        duration: '89 jours',
        gradient: 'from-cyan-500 to-blue-600',
        year: '2023'
    },
    {
        id: 6,
        title: 'RetailBot',
        category: 'IA & Automatisation',
        description: 'Chatbot commerce avec recommandations IA et gestion inventaire',
        image: 'https://images.unsplash.com/photo-1674758591465-fc2fba9fc5f1?auto=format&fit=crop&w=1200&q=80',
        tags: ['LLM', 'E-commerce', 'Analytics', 'API'],
        results: ['300% conversion', '24/7 support', '50k+ interactions'],
        duration: '56 jours',
        gradient: 'from-violet-500 to-purple-600',
        year: '2024'
    }
];

const categories = ['Tous', 'Plateforme SaaS', 'Application Mobile', 'IA & Automatisation', 'Expérience Créative'];

export default function Realizations() {
    const [activeCategory, setActiveCategory] = useState('Tous');
    const [hoveredProject, setHoveredProject] = useState<number | null>(null);

    const filteredProjects = activeCategory === 'Tous'
        ? projects
        : projects.filter(project => project.category === activeCategory);

    return (
        <section id="realizations" className="py-24 bg-gradient-to-b from-background to-surface/20 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl" />
            </div>

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
                            Nos{' '}
                        </span>
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            réalisations
                        </span>
                    </h2>
                    <p className="text-xl text-text-muted max-w-3xl mx-auto leading-relaxed">
                        Des projets concrets qui ont transformé des visions en{' '}
                        <span className="text-accent font-semibold">succès mesurables</span>
                        {' '}en moins de 90 jours
                    </p>
                </motion.div>

                {/* Category Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-4 mb-16"
                >
                    {categories.map((category) => (
                        <motion.button
                            key={category}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveCategory(category)}
                            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${activeCategory === category
                                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30'
                                : 'bg-surface/50 backdrop-blur-xl border border-white/10 text-text-muted hover:border-primary/30 hover:text-text'
                                }`}
                        >
                            {category}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Projects Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {filteredProjects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            layout
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            onMouseEnter={() => setHoveredProject(project.id)}
                            onMouseLeave={() => setHoveredProject(null)}
                            className="group relative"
                        >
                            <div className="relative bg-surface/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden h-full transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10">
                                {/* Project Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <motion.img
                                        src={project.image}
                                        alt={project.title}
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.6 }}
                                        className="w-full h-full object-cover"
                                    />
                                    <motion.div
                                        whileHover={{ opacity: 0.3 }}
                                        transition={{ duration: 0.3 }}
                                        className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-60`}
                                    />

                                    {/* Overlay Icon */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <motion.div
                                            animate={{
                                                rotate: hoveredProject === project.id ? 360 : 0,
                                                scale: hoveredProject === project.id ? 1.2 : 1
                                            }}
                                            transition={{ duration: 1 }}
                                            className="text-4xl text-white/90 bg-black/30 backdrop-blur-sm rounded-full p-4"
                                        >
                                            {project.category === 'Plateforme SaaS' && '💼'}
                                            {project.category === 'Application Mobile' && '📱'}
                                            {project.category === 'IA & Automatisation' && '🤖'}
                                            {project.category === 'Expérience Créative' && '✨'}
                                        </motion.div>
                                    </div>

                                    {/* Year Badge */}
                                    <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-semibold">
                                        {project.year}
                                    </div>

                                    {/* Duration Badge */}
                                    <div className="absolute top-4 left-4 bg-green-500/80 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-semibold">
                                        {project.duration}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Category */}
                                    <span className="text-primary text-sm font-semibold uppercase tracking-wide">
                                        {project.category}
                                    </span>

                                    {/* Title */}
                                    <h3 className="font-bricolage text-xl font-bold mt-2 mb-3 text-text group-hover:text-white transition-colors duration-300">
                                        {project.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-text-muted text-sm mb-4 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                                        {project.description}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.tags.map((tag, tagIndex) => (
                                            <span
                                                key={tagIndex}
                                                className="bg-primary/10 text-primary px-2 py-1 rounded-lg text-xs font-medium"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Results */}
                                    <div className="grid grid-cols-1 gap-2 mb-4">
                                        {project.results.map((result, resultIndex) => (
                                            <motion.div
                                                key={resultIndex}
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.4, delay: (index * 0.1) + (resultIndex * 0.05) }}
                                                className="flex items-center gap-2 text-sm"
                                            >
                                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                                                <span className="text-text-muted group-hover:text-white/70 transition-colors duration-300">
                                                    {result}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* CTA */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-semibold text-sm shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0"
                                    >
                                        Voir le case study →
                                    </motion.button>
                                </div>

                                {/* Floating Elements */}
                                <motion.div
                                    animate={{
                                        rotate: hoveredProject === project.id ? 180 : 0,
                                        scale: hoveredProject === project.id ? 1.2 : 1
                                    }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                    className="absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl"
                                />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-20"
                >
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 backdrop-blur-xl rounded-3xl p-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                    className="text-4xl font-bold text-primary mb-2"
                                >
                                    10+
                                </motion.div>
                                <p className="text-text-muted">Projets livrés</p>
                            </div>
                            <div>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="text-4xl font-bold text-secondary mb-2"
                                >
                                    87%
                                </motion.div>
                                <p className="text-text-muted">Livrés en avance</p>
                            </div>
                            <div>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    className="text-4xl font-bold text-accent mb-2"
                                >
                                    4.9/5
                                </motion.div>
                                <p className="text-text-muted">Satisfaction client</p>
                            </div>
                            <div>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className="text-4xl font-bold text-primary mb-2"
                                >
                                    250k+
                                </motion.div>
                                <p className="text-text-muted">Utilisateurs impactés</p>
                            </div>
                        </div>

                        <div className="text-center mt-8">
                            <h3 className="font-bricolage text-2xl font-bold mb-4 text-text">
                                Votre projet pourrait être le prochain
                            </h3>
                            <p className="text-text-muted mb-6">
                                Rejoignez nos clients qui ont transformé leur vision en succès mesurable
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(99, 102, 241, 0.4)" }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
                            >
                                Démarrer mon projet 🚀
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div >
        </section >
    );
}