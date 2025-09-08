'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const teamMembers = [
    {
        id: 1,
        name: 'Wilfried Fotie',
        role: 'Lead Frontend & Mobile',
        speciality: 'Développement Mobile & Web',
        description:
            'Expert en développement mobile et frontend. J’ai conçu et déployé plus de 15 applications et participé à plus de 10 projets digitaux innovants, avec une approche centrée sur la performance et l’expérience utilisateur.',
        image:
            'https://media.licdn.com/dms/image/v2/D4D03AQG0d2xN_homWA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1719834793182?e=2147483647&v=beta&t=4vS7SCzndPi92Ju1WMyYJ4bRMX7W9YXYaShAvVjY1xE',
        skills: ['Flutter', 'React', 'TypeScript', 'Clean Architecture'],
        gradient: 'from-blue-500 to-purple-600',
        socials: {
            linkedin: 'https://www.linkedin.com/in/wilfried-fotie/',
        },
        achievements: ['15+ apps déployées', '10+ projets', 'CTO & Architecte'],
    },
    {
        id: 3,
        name: 'Luc Nguemoue',
        role: 'Lead Backend',
        speciality: 'Backend & Développement Logiciel',
        description:
            'Lead Backend chez Kamix, diplômé de l’IAI Cameroun. Passionné par la conception de systèmes performants et fiables, toujours à la recherche de solutions robustes et scalables.',
        image:
            'https://media.licdn.com/dms/image/v2/D4D03AQE6fFmF4gZsCg/profile-displayphoto-shrink_400_400/0/1648740323456?e=2147483647&v=beta&t=-placeholder-', // remplacer par sa vraie photo LinkedIn si dispo
        skills: ['Ruby', 'Node.js', 'API Design', 'Scalabilité'],
        gradient: 'from-purple-500 to-indigo-600',
        socials: {
            linkedin: 'https://www.linkedin.com/in/nguemoue/',
        },
        achievements: ['Lead Backend @ Kamix', 'Projets SaaS & e-learning'],
    },
    {
        id: 4,
        name: 'Lorentz Konwo',
        role: 'Product Designer (UI/UX)',
        speciality: 'Design produit & Expérience utilisateur',
        description:
            'Designer expérimenté (Neero, Propagam, Revobridge, freelance) spécialisé dans le design web et mobile, la recherche utilisateur et les prototypes interactifs.',
        image:
            'https://media.licdn.com/dms/image/v2/D4D03AQGuYvVmDpbdgw/profile-displayphoto-shrink_400_400/0/1631022437564?e=2147483647&v=beta&t=-placeholder-', // remplacer par sa vraie photo LinkedIn si dispo
        skills: ['Figma', 'Adobe XD', 'UX Research', 'Wireframing', 'Prototyping'],
        gradient: 'from-pink-500 to-rose-600',
        socials: {
            linkedin: 'https://www.linkedin.com/in/konwolorentz/',
        },
        achievements: ['10+ ans en design', 'Senior Product Designer @ Neero'],
    },
    {
        id: 2,
        name: 'Wilson Ikeda Koffi Ehalj',
        role: 'Stagiaire Développeur',
        speciality: 'Développement & Apprentissage',
        description:
            'Stagiaire motivé, en apprentissage actif sur le développement web et mobile. Contribue aux projets tout en renforçant ses compétences techniques et méthodologiques.',
        image:
            'https://media.licdn.com/dms/image/v2/D4D35AQFrGZP6Z9VQhg/profile-framedphoto-shrink_400_400/profile-framedphoto-shrink_400_400/0/1712316018996?e=1726230000&v=beta&t=6OHgUg67-W6oX3hwMGpt3gFGPAoaxJYrFXcBQd8wANk',
        skills: ['JavaScript', 'React', 'Flutter', 'Apprentissage continu'],
        gradient: 'from-green-500 to-teal-600',
        socials: {
            linkedin: 'https://www.linkedin.com/in/wilson-ikeda-koffi-ehalj/',
        },
        achievements: ['Stage en cours', 'Développement web & mobile'],
    },

];


const values = [
    {
        icon: '⚡',
        title: 'Livraison rapide',
        description: 'Nous livrons vos projets en 90 jours maximum, sans compromis sur la qualité.'
    },
    {
        icon: '🚀',
        title: 'Innovation continue',
        description: 'Nous utilisons les dernières technologies pour créer des solutions avant-gardistes.'
    },
    {
        icon: '🤝',
        title: 'Partenariat authentique',
        description: 'Nous travaillons comme une extension de votre équipe, pas comme un prestataire.'
    },
    {
        icon: '💎',
        title: 'Excellence technique',
        description: 'Code clean, architecture robuste, sécurité maximale sur tous nos projets.'
    }
];

export default function Team() {
    const [hoveredMember, setHoveredMember] = useState<number | null>(null);

    return (
        <section id="team" className="py-24 bg-background relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
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
                            Une équipe d'
                        </span>
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            experts
                        </span>
                    </h2>
                    <p className="text-xl text-text-muted max-w-3xl mx-auto leading-relaxed">
                        Des professionnels passionnés, issus des meilleures entreprises tech, unis pour{' '}
                        <span className="text-accent font-semibold">transformer vos idées en succès</span>
                    </p>
                </motion.div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {teamMembers.map((member, index) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            onMouseEnter={() => setHoveredMember(member.id)}
                            onMouseLeave={() => setHoveredMember(null)}
                            className="group relative"
                        >
                            <div className="relative bg-surface/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden h-full transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10">
                                {/* Profile Image */}
                                <div className="relative h-64 overflow-hidden">
                                    <motion.img
                                        src={member.image}
                                        alt={member.name}
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.6 }}
                                        className="w-full h-full object-cover"
                                    />
                                    <motion.div
                                        whileHover={{ opacity: 0.4 }}
                                        transition={{ duration: 0.3 }}
                                        className={`absolute inset-0 bg-gradient-to-b ${member.gradient} opacity-60`}
                                    />

                                    {/* Social Links - appear on hover */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{
                                            opacity: hoveredMember === member.id ? 1 : 0,
                                            y: hoveredMember === member.id ? 0 : 20
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute bottom-4 left-4 right-4 flex justify-center gap-3"
                                    >
                                        {Object.entries(member.socials).map(([platform, url]) => (
                                            <motion.a
                                                key={platform}
                                                href={url}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-300"
                                            >
                                                {platform === 'linkedin' && (
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" />
                                                    </svg>
                                                )}
                                                {platform === 'github' && (
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                                {platform === 'twitter' && (
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                                                    </svg>
                                                )}
                                                {platform === 'dribbble' && (
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10c5.51 0 10-4.48 10-10S15.51 0 10 0zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM10 1.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0110 1.475zm-2.516.566c.235.358 1.757 2.449 3.145 4.966-3.999 1.065-7.54 1.04-7.954 1.04a8.581 8.581 0 014.809-6.006zm-4.79 7.443c0-.119.016-.237.016-.357 0-.078.005-.154.015-.23.38.005 4.555.054 8.875-1.225.33.675.634 1.371.91 2.075a8.98 8.98 0 00-1.341.598c-3.675 1.495-5.61 4.566-5.61 4.566S2.694 12.78 2.694 10.484zm7.29 7.291c-2.148 0-4.103-.774-5.613-2.055 0 0 1.748-2.835 5.090-4.185 1.47-.594 2.77-.95 3.545-1.199.75 1.95 1.059 3.596 1.138 4.045a8.48 8.48 0 01-4.16 3.394zm5.237-2.754c-.054-.317-.317-1.830-.964-3.708.326-.054.652-.084.98-.084 1.122 0 2.193.174 3.194.479a8.496 8.496 0 01-3.21 3.313z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                                {platform === 'medium' && (
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M2.846 6.36c.03-.295-.083-.586-.303-.784l-2.24-2.7v-.403H6.22l5.536 12.14 4.87-12.14h5.54v.403l-1.917 1.837c-.165.126-.25.333-.213.538v13.498c-.037.204.048.411.213.537l1.871 1.837v.403h-9.412v-.403l1.939-1.882c.19-.19.19-.246.19-.537V7.794l-5.389 13.688h-.728L4.278 7.794v9.174c-.052.386.076.774.347 1.053l2.521 3.058v.404H0v-.404l2.521-3.058c.27-.279.39-.67.325-1.053V6.36z" />
                                                    </svg>
                                                )}
                                            </motion.a>
                                        ))}
                                    </motion.div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Name & Role */}
                                    <h3 className="font-bricolage text-xl font-bold text-text mb-1">
                                        {member.name}
                                    </h3>
                                    <p className="text-primary font-semibold mb-1">{member.role}</p>
                                    <p className="text-sm text-text-muted mb-4">{member.speciality}</p>

                                    {/* Description */}
                                    <p className="text-text-muted text-sm mb-4 leading-relaxed">
                                        {member.description}
                                    </p>

                                    {/* Skills */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {member.skills.map((skill, skillIndex) => (
                                            <span
                                                key={skillIndex}
                                                className="bg-primary/10 text-primary px-2 py-1 rounded-lg text-xs font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Achievements */}
                                    <div className="grid grid-cols-3 gap-2">
                                        {member.achievements.map((achievement, achIndex) => (
                                            <motion.div
                                                key={achIndex}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.4, delay: (index * 0.1) + (achIndex * 0.05) }}
                                                className="text-center bg-surface/30 rounded-lg p-2"
                                            >
                                                <div className="text-xs font-semibold text-accent">
                                                    {achievement}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <motion.div
                                    animate={{
                                        rotate: hoveredMember === member.id ? 180 : 0,
                                        scale: hoveredMember === member.id ? 1.2 : 1
                                    }}
                                    transition={{ duration: 1, ease: "easeInOut" }}
                                    className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Values Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <h3 className="font-bricolage text-3xl font-bold text-center mb-12">
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Nos valeurs
                        </span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="text-center p-6 bg-surface/30 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-primary/30 transition-all duration-300"
                            >
                                <div className="text-4xl mb-4">{value.icon}</div>
                                <h4 className="font-bricolage text-lg font-bold text-text mb-2">
                                    {value.title}
                                </h4>
                                <p className="text-text-muted text-sm leading-relaxed">
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center"
                >
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 backdrop-blur-xl rounded-3xl p-8 max-w-3xl mx-auto">
                        <h3 className="font-bricolage text-2xl font-bold mb-4 text-text">
                            Prêt à travailler avec notre équipe ?
                        </h3>
                        <p className="text-text-muted mb-6 leading-relaxed">
                            Discutons de votre projet et découvrons comment notre expertise peut transformer votre vision en réalité exceptionnelle.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(99, 102, 241, 0.4)" }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
                            >
                                Rencontrer l'équipe 👋
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                                whileTap={{ scale: 0.95 }}
                                className="border-2 border-white/20 text-text backdrop-blur-sm px-8 py-3 rounded-full font-semibold hover:border-primary/50 transition-all duration-300"
                            >
                                Voir nos projets
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}