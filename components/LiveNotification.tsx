'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { CheckCircle, Users, Clock } from 'lucide-react';

const notifications = [
    {
        icon: <CheckCircle className="w-4 h-4 text-green-500" />,
        text: "Emma vient de planifier un appel découverte",
        time: "Il y a quelques minutes",
        color: "from-green-500/20 to-emerald-500/20",
        border: "border-green-500/30",
    },
    {
        icon: <Users className="w-4 h-4 text-blue-500" />,
        text: "Lucas a lancé son projet avec Ozirus",
        time: "Il y a 10 minutes",
        color: "from-blue-500/20 to-cyan-500/20",
        border: "border-blue-500/30",
    },
    {
        icon: <Clock className="w-4 h-4 text-purple-500" />,
        text: "Sophie a reçu une première estimation",
        time: "Il y a 15 minutes",
        color: "from-purple-500/20 to-pink-500/20",
        border: "border-purple-500/30",
    },
    {
        icon: <CheckCircle className="w-4 h-4 text-green-500" />,
        text: "Alexandre vient de réserver une démo",
        time: "Il y a 20 minutes",
        color: "from-green-500/20 to-emerald-500/20",
        border: "border-green-500/30",
    },
    {
        icon: <Users className="w-4 h-4 text-blue-500" />,
        text: "Clara discute de son idée d’application",
        time: "Il y a 25 minutes",
        color: "from-blue-500/20 to-cyan-500/20",
        border: "border-blue-500/30",
    },
    {
        icon: <Clock className="w-4 h-4 text-purple-500" />,
        text: "Nicolas a téléchargé sa proposition",
        time: "Il y a 30 minutes",
        color: "from-purple-500/20 to-pink-500/20",
        border: "border-purple-500/30",
    },
    {
        icon: <CheckCircle className="w-4 h-4 text-green-500" />,
        text: "Laura avance sur son nouveau site",
        time: "Il y a 40 minutes",
        color: "from-green-500/20 to-emerald-500/20",
        border: "border-green-500/30",
    },
];

export default function LiveNotification() {
    const [currentNotification, setCurrentNotification] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setIsVisible(true);
            setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => {
                    setCurrentNotification(
                        (prev) => (prev + 1) % notifications.length
                    );
                }, 500);
            }, 5000); // notif visible 5s
        }, 20000); // toutes les 20s

        // première notif après 5s
        setTimeout(() => setIsVisible(true), 5000);

        return () => clearInterval(timer);
    }, []);

    const notification = notifications[currentNotification];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    transition={{
                        type: "spring",
                        stiffness: 250,
                        damping: 25,
                        opacity: { duration: 0.3 },
                    }}
                    className="fixed bottom-6 left-6 z-50 max-w-sm"
                >
                    <div
                        className={`bg-gradient-to-r ${notification.color} backdrop-blur-xl border ${notification.border} rounded-xl p-4 shadow-xl`}
                    >
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5">{notification.icon}</div>
                            <div className="flex-1">
                                <p className="text-white font-medium text-sm leading-tight">
                                    {notification.text}
                                </p>
                                <p className="text-white/70 text-xs mt-1">
                                    {notification.time}
                                </p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsVisible(false)}
                                className="text-white/50 hover:text-white/80 transition-colors"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </motion.button>
                        </div>
                    </div>

                    {/* Petit effet pulse */}
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
