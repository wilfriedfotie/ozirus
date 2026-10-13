'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  motion, AnimatePresence, MotionConfig, useInView, useMotionValue, useMotionValueEvent, useReducedMotion,
  useScroll, useSpring, useTransform,
} from 'framer-motion';
import {
  ArrowRight, CheckCircle2, Check, ChevronDown, Shield, Briefcase, Sparkles, Package, Play, Clock,
  Layers, FileText, Award, UserRound, X, MessageCircle, MapPin, Flag, Lightbulb, Target, Wrench, Calculator,
} from 'lucide-react';
import { useMainSiteHref } from '@/lib/useMainSiteHref';

/* ─── config de la session ──────────────────────────── */
const OFFER = {
  prix: '100 000',
  prixNum: 100000,
  prixJour: '3 300',
  // Trois versements étalés sur le mois de formation (total = prix).
  versements: [
    { montant: '40 000', quand: 'à l\'inscription' },
    { montant: '30 000', quand: 'à J+10' },
    { montant: '30 000', quand: 'à J+20' },
  ],
  placesTotales: 25,
  placesPrises: 14,
  prochaineSession: new Date(2026, 10, 2), // 2 novembre 2026
  whatsapp: '237694086571',
  whatsappText: 'Bonjour Ozirus, je souhaite réserver ma place pour la formation « Gagner de l\'argent avec l\'IA » (100 000 FCFA, payable en 3 fois). Mon métier : ',
};
const WHATSAPP_URL = `https://wa.me/${OFFER.whatsapp}?text=${encodeURIComponent(OFFER.whatsappText)}`;

// Date formatée à la main plutôt que via Intl : rendu identique côté serveur et navigateur.
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const SESSION_COURTE = `${OFFER.prochaineSession.getDate()} ${MOIS[OFFER.prochaineSession.getMonth()]}`;
const PLACES_RESTANTES = OFFER.placesTotales - OFFER.placesPrises;
// Même formatage manuel que /mvp : l'espace insécable d'Intl diffère entre Node et le navigateur.
const frNum = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

/* ─── tokens (blanc & rouge) ────────────────────────── */
const BG = '#FFFFFF';
const SOFT = '#FFF6F7';
const SURFACE = '#FAF7F7';
const LINE = '#EFE4E5';
const INK = '#140A0C';
const MUTED = '#5F5658';
const FAINT = '#9A9193';
const RED = '#E5132B';
const RED_HI = '#FF3B4E';
const RED_DEEP = '#B30F22';
const RED_TINT = '#FDECEE';
const DISPLAY = 'var(--font-display-loaded), Clash Display, sans-serif';
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const CARD_SHADOW = '0 1px 2px rgba(20,10,12,0.04), 0 18px 40px -18px rgba(20,10,12,0.14)';

const upView = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, delay, ease: EASE },
});

/* ─── données ───────────────────────────────────────── */
// Cible : des gens qui ont déjà un métier, en Afrique francophone, et qui veulent, à partir d'une
// culture générale de l'IA, un revenu complémentaire sans quitter leur emploi. Les situations
// reprennent des réalités locales (salaire du 25, famille élargie, rappels qui tardent, Mobile Money).
const PERSONAS = [
  {
    id: 'comptable',
    tab: 'Comptable',
    name: 'Mireille',
    age: 34,
    city: 'Douala',
    country: 'Cameroun',
    situation: 'Comptable dans une PME de Bonabéri',
    thought: 'Le 25, le salaire tombe. Le 5, il est déjà parti : loyer, scolarité des enfants, et la famille au village.',
    pains: [
      'Aucune augmentation depuis trois ans, alors que tout augmente au marché',
      'La famille élargie compte sur elle, et elle ne peut dire non à personne',
      'Elle utilise ChatGPT pour ses mails, sans voir comment en tirer de l\'argent',
    ],
    gains: [
      'Un kit trésorerie automatisé par l\'IA, vendu aux boutiques et quincailleries du quartier',
      'Des clients qui paient chaque mois par Orange Money ou MoMo',
      'Un vrai « gombo » à côté de son poste, qui ne dépend pas de son patron',
    ],
  },
  {
    id: 'enseignant',
    tab: 'Enseignant',
    name: 'Serge',
    age: 41,
    city: 'Yaoundé',
    country: 'Cameroun',
    situation: 'Professeur de maths dans un lycée public',
    thought: 'Entre les rappels qui tardent et les répétitions à domicile, je cours toute la semaine en moto pour joindre les deux bouts.',
    pains: [
      'Des répétitions de maison en maison, dans les embouteillages, le soir et le week-end',
      'Un revenu qui s\'arrête dès qu\'il arrête de parler',
      'La peur que l\'IA rende son métier inutile',
    ],
    gains: [
      'Un programme de révision BEPC et Bac, préparé avec l\'IA et corrigé par lui',
      'Un groupe WhatsApp de parents abonnés chaque mois, au lieu d\'heures vendues une à une',
      'L\'IA qui travaille pour lui, pas contre lui',
    ],
  },
  {
    id: 'rh',
    tab: 'RH',
    name: 'Aminata',
    age: 37,
    city: 'Abidjan',
    country: 'Côte d\'Ivoire',
    situation: 'Responsable RH dans un groupe au Plateau',
    thought: 'Les patrons de mon réseau m\'appellent pour recruter. Je les aide gratuitement, par respect.',
    pains: [
      'Un savoir-faire que tout le monde lui demande, et qu\'elle n\'a jamais facturé',
      'Pas le temps de monter un cabinet à côté d\'un poste exigeant',
      'Aucune idée du prix à demander sans paraître gourmande',
    ],
    gains: [
      'Un pack recrutement pour PME : fiche de poste, annonce, tri des CV, intégration',
      'Une livraison en quelques heures, grâce à l\'IA',
      'Un prix clair, assumé, et des patrons qui la recommandent entre eux',
    ],
  },
  {
    id: 'banque',
    tab: 'Commercial',
    name: 'Moussa',
    age: 32,
    city: 'Dakar',
    country: 'Sénégal',
    situation: 'Conseiller clientèle dans une banque',
    thought: 'Je connais tous les commerçants du quartier. Mais je n\'ai rien à leur vendre, à moi.',
    pains: [
      'Des objectifs commerciaux qui enrichissent la banque, pas lui',
      'Des commerçants qui vendent encore uniquement au bouche-à-oreille',
      'Des idées de business plein la tête, jamais lancées',
    ],
    gains: [
      'Un catalogue WhatsApp Business et des visuels faits avec l\'IA pour les commerçants',
      'Une offre mensuelle « vendre sur WhatsApp », payée par Wave',
      'Son carnet d\'adresses enfin transformé en revenu',
    ],
  },
  {
    id: 'sante',
    tab: 'Santé',
    name: 'Grâce',
    age: 29,
    city: 'Cotonou',
    country: 'Bénin',
    situation: 'Infirmière diplômée d\'État',
    thought: 'Mes gardes de nuit paient le loyer. Pas mon avenir.',
    pains: [
      'Des gardes épuisantes pour un salaire qui ne bouge pas',
      'Des cliniques privées et pharmacies invisibles sur les réseaux',
      'Pas d\'énergie pour un deuxième travail physique',
    ],
    gains: [
      'Des contenus de prévention santé (posts, vidéos courtes) produits avec l\'IA',
      'Un abonnement mensuel vendu aux cliniques et pharmacies de sa ville',
      'Un revenu en plus, depuis son téléphone, entre deux gardes',
    ],
  },
];

const BEFORE_AFTER = [
  { k: 'Vos revenus', before: 'Un seul salaire, qui ne bouge plus.', after: 'Un 2e revenu, en plus de votre salaire.' },
  { k: 'Votre métier', before: 'Vous l\'exercez pour un seul employeur.', after: 'Vous le vendez aussi à d\'autres, sous forme d\'offre.' },
  { k: 'L\'IA', before: 'Vous l\'utilisez pour reformuler des emails.', after: 'Elle produit, automatise et livre à votre place.' },
  { k: 'Votre offre', before: '« Je ne vois pas ce que je pourrais vendre. »', after: 'Un nom, un périmètre, un délai, un prix. Écrits noir sur blanc.' },
  { k: 'Vos clients', before: 'Personne ne sait que vous pourriez l\'aider.', after: 'Votre réseau sait exactement ce que vous vendez, et à combien.' },
  { k: 'Vos soirées', before: 'Passées à scroller, fatigué.', after: '5 à 7 h par semaine sur un projet qui rapporte.' },
];

const MODULES = [
  { week: 1, n: '01', title: 'Les outils IA indispensables', desc: 'Claude, ChatGPT, générateurs d\'images et de vidéos, automatisations : le kit de base, expliqué simplement, sans jargon ni code.' },
  { week: 1, n: '02', title: 'Faire travailler l\'IA sur votre métier', desc: 'Les bons prompts pour votre secteur. Vous automatisez vos propres tâches et découvrez ce que l\'IA peut faire de votre savoir-faire.' },
  { week: 2, n: '03', title: 'L\'offre cachée dans votre métier', desc: 'Repérer ce que vous savez faire et que d\'autres paieraient : les problèmes de votre secteur, les clients qui les vivent, ce qu\'ils dépensent déjà.' },
  { week: 2, n: '04', title: 'Construire votre produit avec l\'IA', desc: 'Tableaux automatisés, mini-sites, documents types, petits outils en ligne : fabriquer ce que vous allez vendre, même sans être technique.' },
  { week: 3, n: '05', title: 'Contenus et vidéos avec l\'IA', desc: 'Visuels, vidéos courtes, présentations pro : produire de quoi montrer votre offre et la rendre crédible, sans studio ni graphiste.' },
  { week: 3, n: '06', title: 'Livrer vite, à côté de votre emploi', desc: 'Automatiser la livraison pour qu\'un client vous prenne quelques heures, pas des semaines. Tenir en 5 à 7 heures par semaine.' },
  { week: 4, n: '07', title: 'Packager son offre', desc: 'Transformer votre savoir-faire en produit à prix fixe : nom, périmètre, livrables, délai, prix. Exactement comme nos offres Ozirus.' },
  { week: 4, n: '08', title: 'Vendre à son réseau et encaisser', desc: 'Votre entourage professionnel, WhatsApp, LinkedIn, l\'appel de vente, le paiement Mobile Money : le système pour signer vos premiers clients.' },
];

const ONE_TO_ONE = [
  'Choix de l\'offre la plus rentable à partir de VOTRE métier',
  'Construction de votre offre packagée avec vous (prix, livrables, délai)',
  'Revue de votre page de vente et de votre message de prospection',
  'Simulation d\'un appel de vente et corrections',
  'Plan d\'action sur 90 jours avec objectifs chiffrés',
];

// Une marche de l'escalier = une semaine. `deliverable` = ce que l'élève a entre les mains en fin de semaine.
const WEEKS = [
  { n: 1, theme: 'Les bases de l\'IA', deliverable: 'Vos propres tâches de travail automatisées par l\'IA.' },
  { n: 2, theme: 'Trouver votre offre', deliverable: 'L\'idée d\'offre tirée de votre métier, et un premier prototype.' },
  { n: 3, theme: 'Produire & livrer', deliverable: 'Votre produit prêt, avec les contenus pour le présenter.' },
  { n: 4, theme: 'Packaging & vente', deliverable: 'Votre offre packagée et votre script de prospection.' },
  { n: 5, theme: 'Coaching 1:1', deliverable: 'Votre offre lancée et un plan 90 jours chiffré.' },
];

// Études de cas : des CAS TYPES construits avec la méthode de la formation (pas des témoignages
// d'élèves). Prix et temps sont indicatifs ; le calculateur laisse le visiteur faire ses propres hypothèses.
const CASES = [
  {
    id: 'compta',
    metier: 'Comptable',
    icon: Calculator,
    title: 'Le kit trésorerie pour petits commerces',
    savoir: 'Elle sait lire des chiffres, prévoir les mois difficiles et repérer les fuites d\'argent.',
    probleme: 'Les boutiques et restaurants de son quartier ne savent jamais combien il leur reste vraiment à la fin du mois.',
    offre: 'Un tableau de trésorerie automatisé, installé en 1 heure, avec un point mensuel de 30 minutes.',
    ia: ['Génération du tableau et des formules', 'Rapport mensuel rédigé automatiquement', 'Vidéo explicative pour le client'],
    prix: 45000,
    unite: 'client / mois',
    temps: '≈ 2 h par client et par mois',
    max: 8,
  },
  {
    id: 'prof',
    metier: 'Enseignant',
    icon: Lightbulb,
    title: 'Le programme de révision du bac',
    savoir: 'Il sait où les élèves bloquent et comment expliquer une notion autrement.',
    probleme: 'Les parents paient des cours particuliers chers, sans suivi entre deux séances.',
    offre: 'Un programme de révision personnalisé chaque semaine, exercices corrigés, et un groupe WhatsApp de questions.',
    ia: ['Exercices générés par niveau, relus par lui', 'Corrections détaillées automatiques', 'Fiches de synthèse illustrées'],
    prix: 15000,
    unite: 'élève / mois',
    temps: '≈ 4 h par semaine pour tout le groupe',
    max: 30,
  },
  {
    id: 'rh',
    metier: 'Ressources humaines',
    icon: Target,
    title: 'Le pack recrutement PME',
    savoir: 'Elle sait écrire une fiche de poste, trier des candidatures et faire réussir une intégration.',
    probleme: 'Les PME recrutent dans l\'urgence, sur recommandation, et se trompent souvent.',
    offre: 'Fiche de poste, annonce, grille de tri des CV et plan d\'intégration, livrés en 48 h.',
    ia: ['Fiche de poste et annonce rédigées', 'Tri et synthèse des CV reçus', 'Kit d\'intégration du nouvel employé'],
    prix: 75000,
    unite: 'recrutement',
    temps: '≈ 3 h par recrutement',
    max: 6,
  },
];

const FAQS = [
  { q: 'Mon métier peut-il marcher ?', a: 'Si, dans votre travail, vous savez résoudre un problème que d\'autres ont aussi, oui. Comptabilité, enseignement, RH, santé, commerce, droit, logistique, artisanat : la semaine 2 sert justement à trouver l\'offre cachée dans votre métier, et la semaine en 1:1 à la valider avec vous.' },
  { q: 'Je ne suis pas du tout technique. Est-ce pour moi ?', a: 'Oui. Il suffit de savoir utiliser un ordinateur et d\'avoir déjà entendu parler de ChatGPT. Aucune ligne de code n\'est demandée : vous apprenez à piloter les outils, pas à les programmer.' },
  { q: 'Combien vais-je gagner ?', a: 'Personne d\'honnête ne peut vous le promettre. Ce que l\'on garantit : à la fin des 5 semaines, vous avez une offre tirée de votre métier, un prix, un script pour la vendre et un plan sur 90 jours. Ensuite, le revenu dépend du nombre de personnes que vous contactez.' },
  { q: 'J\'ai un emploi à plein temps. Ai-je le temps ?', a: 'C\'est pour vous que la formation est conçue. Comptez 5 à 7 heures par semaine. Les lives sont enregistrés et les créneaux de la semaine en 1:1 se calent sur votre emploi du temps.' },
  { q: 'Et mon employeur ?', a: 'Vérifiez votre contrat de travail (clause d\'exclusivité ou de non-concurrence). Pendant le coaching, on choisit une offre qui ne concurrence pas votre employeur : en général, on vise des clients différents des siens.' },
  { q: 'Comment fonctionne le paiement en 3 fois ?', a: 'Le total est de 100 000 FCFA, payable en une fois ou en 3 versements pendant le mois de formation : 40 000 FCFA à l\'inscription, 30 000 FCFA à J+10, 30 000 FCFA à J+20. Orange Money, MTN Mobile Money, Wave ou virement.' },
  { q: 'Quel matériel faut-il ?', a: 'Un ordinateur et une connexion internet. Les outils utilisés ont des versions gratuites ; on vous indique les quelques abonnements utiles quand ils deviennent rentables.' },
];

/* ─── utilitaires ───────────────────────────────────── */
// Texte révélé mot à mot (montée + flou). `inView` : au défilement ; sinon dès le chargement.
function Words({ text, delay = 0, stagger = 0.05, inView = false }: { text: string; delay?: number; stagger?: number; inView?: boolean }) {
  const words = text.split(' ');
  const shown = { opacity: 1, y: 0, filter: 'blur(0px)' };
  return (
    <>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ opacity: 0, y: '0.45em', filter: 'blur(8px)' }}
            {...(inView ? { whileInView: shown, viewport: { once: true, margin: '-40px' } } : { animate: shown })}
            transition={{ duration: 0.6, ease: EASE, delay: delay + i * stagger }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </>
  );
}

// Nombre qui défile jusqu'à `value` quand il entre à l'écran, puis suit ses changements (ressort).
function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 80, damping: 20 });
  const text = useTransform(spring, v => frNum(v));
  useEffect(() => {
    if (!inView) return;
    if (reduce) { mv.jump(value); spring.jump(value); } else mv.set(value);
  }, [inView, value, reduce, mv, spring]);
  return <motion.span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>{text}</motion.span>;
}

function useIsMobile(query = '(max-width: 720px)') {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return mobile;
}

function CtaButton({ children, href = WHATSAPP_URL, big = false }: { children: React.ReactNode; href?: string; big?: boolean }) {
  const external = href.startsWith('http');
  return (
    <motion.a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      whileHover={{ scale: 1.02, boxShadow: '0 18px 44px rgba(229,19,43,0.38)' }}
      whileTap={{ scale: 0.98 }}
      style={{
        position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        padding: big ? '19px 38px' : '15px 28px', borderRadius: 14, overflow: 'hidden',
        background: `linear-gradient(135deg, ${RED_HI} 0%, ${RED} 60%, ${RED_DEEP} 100%)`,
        color: '#fff', fontSize: big ? 18 : 16, fontWeight: 700, textDecoration: 'none',
        boxShadow: '0 10px 30px rgba(229,19,43,0.28), inset 0 1px 0 rgba(255,255,255,0.25)',
      }}
    >
      <motion.span
        aria-hidden
        animate={{ left: ['-60%', '160%'] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'linear', repeatDelay: 1.4 }}
        style={{ position: 'absolute', top: 0, width: '40%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }}
      />
      <span style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10 }}>{children}</span>
    </motion.a>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: RED, marginBottom: 16 }}>
      <motion.span initial={{ width: 0 }} whileInView={{ width: 18 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE, delay: 0.2 }} style={{ height: 2, background: RED, borderRadius: 2 }} />
      {children}
    </p>
  );
}

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: React.ReactNode; sub?: string }) {
  return (
    <motion.div {...upView()} className="fo-shead" style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 56px' }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(1.9rem, 4.2vw, 3rem)', lineHeight: 1.05, letterSpacing: '-0.02em', color: INK, marginBottom: sub ? 18 : 0 }}>{title}</h2>
      {sub && <p className="fo-ssub" style={{ fontSize: 17, color: MUTED, lineHeight: 1.7 }}>{sub}</p>}
    </motion.div>
  );
}

function Section({ id, children, style }: { id?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <section id={id} className="fo-section" style={{ position: 'relative', padding: '96px 20px', scrollMarginTop: 64, ...style }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>{children}</div>
    </section>
  );
}

const Red = ({ children }: { children: React.ReactNode }) => <span style={{ color: RED }}>{children}</span>;

/* ─── éléments de page de vente ─────────────────────── */
// Vidéo de présentation. Renseigner `src` (fichier déposé dans public/, ex. '/videos/formation.mp4')
// OU `youtubeId`. Tant que les deux sont vides, l'affiche reste visible avec « Bientôt disponible ».
const VIDEO = {
  src: '',
  youtubeId: '',
  poster: '',
  duration: '6 min',
};

// Mot clé du titre : en rouge, souligné d'un trait « au feutre » qui se dessine.
function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', color: RED, whiteSpace: 'nowrap' }}>
      {children}
      <svg aria-hidden viewBox="0 0 300 20" preserveAspectRatio="none" style={{ position: 'absolute', left: '-2%', bottom: '-0.12em', width: '104%', height: '0.28em', overflow: 'visible' }}>
        <motion.path
          d="M4 14 C 70 4, 150 4, 296 10"
          fill="none"
          stroke={RED}
          strokeWidth={7}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 1 }}
        />
      </svg>
    </span>
  );
}

function VideoBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const tilt = useTransform(scrollYProgress, [0, 1], [14, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const ready = Boolean(VIDEO.src || VIDEO.youtubeId);

  return (
    <div ref={ref} style={{ perspective: 1400, margin: '0 auto' }}>
      <motion.div
        className="fo-video" style={{ rotateX: tilt, scale, transformOrigin: 'center top', position: 'relative', aspectRatio: '16 / 9', borderRadius: 24, overflow: 'hidden', background: '#0D0607', border: `6px solid #fff`, boxShadow: '0 50px 100px -30px rgba(229,19,43,0.45), 0 0 0 1px rgba(20,10,12,0.08)' }}
      >
        {playing && VIDEO.youtubeId ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${VIDEO.youtubeId}?autoplay=1&rel=0`}
            title="Présentation de la formation"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
          />
        ) : playing && VIDEO.src ? (
          <video src={VIDEO.src} poster={VIDEO.poster || undefined} controls autoPlay playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <button
            onClick={() => ready && setPlaying(true)}
            aria-label={ready ? 'Lancer la vidéo' : 'Vidéo bientôt disponible'}
            style={{ position: 'absolute', inset: 0, width: '100%', border: 'none', padding: 0, cursor: ready ? 'pointer' : 'default', background: VIDEO.poster ? `center / cover url(${VIDEO.poster})` : `radial-gradient(ellipse at 70% 20%, rgba(229,19,43,0.55), transparent 60%), radial-gradient(ellipse at 10% 100%, rgba(229,19,43,0.35), transparent 55%), #0D0607`, color: '#fff' }}
          >
            {!VIDEO.poster && (
              <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
            )}
            <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'clamp(12px, 3vw, 26px)', padding: 20 }}>
              <span style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'clamp(64px, 11vw, 96px)', height: 'clamp(64px, 11vw, 96px)' }}>
                {[0, 1].map(i => (
                  <motion.span key={i} aria-hidden animate={{ scale: [1, 1.9], opacity: [0.5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i, ease: 'easeOut' }} style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: RED }} />
                ))}
                <span style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 40px rgba(229,19,43,0.6)' }}>
                  <Play size={34} fill="#fff" color="#fff" style={{ marginLeft: 5 }} />
                </span>
              </span>
              <p style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.05rem, 2.6vw, 1.8rem)', fontWeight: 600, lineHeight: 1.2, maxWidth: 560, textAlign: 'center' }}>
                Comment transformer votre métier en 2<sup>e</sup> revenu avec l&apos;IA
              </p>
              <span style={{ fontSize: 13, fontWeight: 600, padding: '6px 12px', borderRadius: 99, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
                {ready ? `Regardez avant de vous inscrire · ${VIDEO.duration}` : 'Vidéo bientôt disponible'}
              </span>
            </div>
          </button>
        )}
      </motion.div>
    </div>
  );
}

const FOR_YOU = [
  'Vous avez un métier, salarié ou indépendant, et quelques années d\'expérience',
  'Vous connaissez l\'IA de nom, ou vous utilisez ChatGPT de temps en temps',
  'Vous voulez un revenu en plus, sans quitter votre emploi',
  'Vous pouvez dégager 5 à 7 heures par semaine pendant 5 semaines',
  'Vous êtes prêt à parler de votre offre à de vrais clients',
];
const NOT_FOR_YOU = [
  'Vous cherchez de l\'argent facile, sans rien faire',
  'Vous voulez devenir développeur ou ingénieur en IA',
  'Vous voulez de la théorie, sans passer à l\'action',
  'Vous attendez qu\'on vous garantisse un montant de revenus',
];

function ForWho() {
  return (
    <div className="fo-paths" style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 20 }}>
      <motion.div {...upView()} style={{ borderRadius: 24, padding: 34, background: '#fff', border: `2px solid ${RED}`, boxShadow: '0 30px 60px -30px rgba(229,19,43,0.35)' }}>
        <p style={{ fontFamily: DISPLAY, fontSize: 24, fontWeight: 600, marginBottom: 22 }}>C&apos;est pour vous si…</p>
        <div style={{ display: 'grid', gap: 16 }}>
          {FOR_YOU.map((t, i) => (
            <motion.div key={t} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE, delay: 0.2 + i * 0.08 }} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <motion.span initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.3 + i * 0.08 }} style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={14} color="#fff" strokeWidth={3} /></motion.span>
              <span style={{ fontSize: 16, lineHeight: 1.5, fontWeight: 500 }}>{t}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <motion.div {...upView(0.1)} style={{ borderRadius: 24, padding: 34, background: '#F3F0F0', border: `1px solid ${LINE}` }}>
        <p style={{ fontFamily: DISPLAY, fontSize: 24, fontWeight: 600, marginBottom: 22, color: MUTED }}>Ce n&apos;est pas pour vous si…</p>
        <div style={{ display: 'grid', gap: 16 }}>
          {NOT_FOR_YOU.map((t, i) => (
            <motion.div key={t} initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 + i * 0.08 }} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, background: '#D9D1D2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={14} color="#fff" strokeWidth={3} /></span>
              <span style={{ fontSize: 16, lineHeight: 1.5, color: MUTED }}>{t}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// Le contenu de la formation présenté comme un « kit » : des cartes empilées en 3D qui se posent
// une à une, et que la souris fait pivoter.
const KIT = [
  { icon: Layers, t: '4 semaines de formation en groupe', s: '8 modules pratiques · lives enregistrés' },
  { icon: UserRound, t: '1 semaine de coaching 1:1', s: 'Votre offre construite avec vous' },
  { icon: Sparkles, t: 'Bibliothèque de prompts par métier', s: 'Prête à copier-coller' },
  { icon: FileText, t: 'Modèles de devis, contrats, fiches d\'offre', s: 'Pour vendre dès la semaine 4' },
  { icon: MessageCircle, t: 'Scripts de vente', s: 'WhatsApp, LinkedIn, appel de closing' },
  { icon: Award, t: 'Groupe privé à vie + certificat Ozirus', s: 'Le réseau reste après la formation' },
];

function KitStack() {
  const ref = useRef<HTMLDivElement>(null);
  const mobile = useIsMobile();
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-22, 2]), { stiffness: 70, damping: 16 });
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [24, 8]), { stiffness: 70, damping: 16 });
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { px.set(0); py.set(0); };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ perspective: 1400, padding: '10px 0' }}>
      <motion.div style={{ rotateX: mobile ? 0 : rotX, rotateY: mobile ? 0 : rotY, transformStyle: 'preserve-3d', display: 'grid', gap: mobile ? 10 : 12 }}>
        {KIT.map((k, i) => (
          <motion.div
            key={k.t}
            initial={{ opacity: 0, z: 160, y: -30 }}
            animate={inView ? { opacity: 1, z: i * 6, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 + i * 0.12 }}
            style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 18px', borderRadius: 18, background: '#fff', border: `1px solid ${LINE}`, boxShadow: '0 18px 36px -16px rgba(20,10,12,0.25)' }}
          >
            <span style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0, background: i < 2 ? RED : RED_TINT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <k.icon size={21} color={i < 2 ? '#fff' : RED} />
            </span>
            <span style={{ flex: 1 }}>
              <span style={{ display: 'block', fontSize: 16, fontWeight: 700, lineHeight: 1.3 }}>{k.t}</span>
              <span style={{ display: 'block', fontSize: 13.5, color: MUTED, marginTop: 2 }}>{k.s}</span>
            </span>
            <Check size={20} color={RED} strokeWidth={3} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// Sceau rond « Satisfait ou remboursé » dont le texte tourne lentement.
function GuaranteeSeal() {
  const text = 'SATISFAIT OU REMBOURSÉ · 14 JOURS · SATISFAIT OU REMBOURSÉ · 14 JOURS · ';
  return (
    <div className="fo-seal" style={{ position: 'relative', width: 170, height: 170, flexShrink: 0 }}>
      <motion.svg viewBox="0 0 200 200" animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', inset: 0 }}>
        <defs><path id="fo-seal" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
        <circle cx="100" cy="100" r="98" fill={RED} />
        <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeDasharray="3 5" />
        <text fill="#fff" fontSize="13.5" fontWeight="800" letterSpacing="2.2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          <textPath href="#fo-seal">{text}</textPath>
        </text>
      </motion.svg>
      <div style={{ position: 'absolute', inset: 34, borderRadius: '50%', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 0 3px rgba(229,19,43,0.15)' }}>
        <span style={{ fontFamily: DISPLAY, fontSize: 40, fontWeight: 700, color: RED, lineHeight: 1 }}>14</span>
        <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', color: INK }}>JOURS</span>
      </div>
    </div>
  );
}

/* ─── personas ──────────────────────────────────────── */
const PERSONA_MS = 7000;
const COUNTRIES = ['Cameroun', 'Côte d\'Ivoire', 'Sénégal', 'Bénin', 'Togo', 'Gabon', 'Congo', 'RD Congo', 'Burkina Faso', 'Mali', 'Guinée', 'Niger', 'Tchad', 'Centrafrique'];

function Personas() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const playing = auto && inView && !reduce;
  const p = PERSONAS[active];

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setActive(a => (a + 1) % PERSONAS.length), PERSONA_MS);
    return () => clearTimeout(t);
  }, [active, playing]);

  // Sur mobile les onglets défilent horizontalement : on garde l'onglet actif visible.
  const tabsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const list = tabsRef.current;
    const btn = list?.children[active] as HTMLElement | undefined;
    if (!list || !btn || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: btn.offsetLeft - 16, behavior: 'smooth' });
  }, [active]);

  return (
    <div ref={ref}>
      <div ref={tabsRef} role="tablist" aria-label="Métiers" className="fo-ptabs fo-scrolltabs" style={{ display: 'grid', gridTemplateColumns: `repeat(${PERSONAS.length}, 1fr)`, gap: 10, marginBottom: 28 }}>
        {PERSONAS.map((x, i) => {
          const on = i === active;
          return (
            <button
              key={x.id}
              role="tab"
              aria-selected={on}
              onClick={() => { setAuto(false); setActive(i); }}
              style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 16, cursor: 'pointer', textAlign: 'left', border: `1.5px solid ${on ? RED : LINE}`, background: on ? RED : '#fff', color: on ? '#fff' : INK, boxShadow: on ? '0 12px 26px -10px rgba(229,19,43,0.5)' : 'none', transition: 'all .2s' }}
            >
              {on && playing && (
                <motion.span key={active} aria-hidden initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: PERSONA_MS / 1000, ease: 'linear' }} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, background: 'rgba(255,255,255,0.75)', transformOrigin: '0 50%' }} />
              )}
              <span style={{ width: 36, height: 36, borderRadius: 11, flexShrink: 0, background: on ? 'rgba(255,255,255,0.2)' : RED_TINT, color: on ? '#fff' : RED, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15 }}>{x.name[0]}</span>
              <span style={{ minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 14.5, fontWeight: 700, lineHeight: 1.2 }}>{x.tab}</span>
                <span style={{ display: 'block', fontSize: 12, opacity: on ? 0.85 : 1, color: on ? '#fff' : FAINT, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{x.city}, {x.country}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ perspective: 1600 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={p.id}
            initial={{ opacity: 0, rotateY: -25, x: 40 }}
            animate={{ opacity: 1, rotateY: 0, x: 0 }}
            exit={{ opacity: 0, rotateY: 25, x: -40 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{ borderRadius: 28, background: '#fff', border: `1px solid ${LINE}`, overflow: 'hidden', boxShadow: CARD_SHADOW }}
          >
            <div className="fo-phead" style={{ padding: '36px 36px 30px', borderBottom: `1px solid ${LINE}`, display: 'flex', gap: 22, alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="fo-pavatar" style={{ width: 76, height: 76, borderRadius: 22, flexShrink: 0, background: `linear-gradient(135deg, ${RED_HI}, ${RED_DEEP})`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 32, fontWeight: 600, boxShadow: '0 12px 30px rgba(229,19,43,0.3)' }}>
                {p.name[0]}
              </div>
              <div style={{ flex: 1, minWidth: 240 }}>
                <p className="fo-pmeta" style={{ fontSize: 14, color: FAINT, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <strong style={{ color: INK, fontSize: 16 }}>{p.name}, {p.age} ans</strong>
                  <span>·</span><MapPin size={13} />{p.city}, {p.country}<span>·</span>{p.situation}
                </p>
                <p className="fo-pquote" style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.25rem, 2.6vw, 1.7rem)', lineHeight: 1.3, fontWeight: 500, color: INK }}>
                  « {p.thought} »
                </p>
              </div>
            </div>
            <div className="fo-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <div style={{ padding: 36, background: SURFACE }}>
                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: FAINT, marginBottom: 18 }}>Aujourd&apos;hui</p>
                <div style={{ display: 'grid', gap: 14 }}>
                  {p.pains.map(t => (
                    <div key={t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <X size={18} color={FAINT} style={{ marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: 15.5, lineHeight: 1.55, color: MUTED }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: 36, background: SOFT, borderLeft: `1px solid ${RED_TINT}` }}>
                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: RED, marginBottom: 18 }}>Dans 5 semaines</p>
                <div style={{ display: 'grid', gap: 14 }}>
                  {p.gains.map(t => (
                    <div key={t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <CheckCircle2 size={18} color={RED} style={{ marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: 15.5, lineHeight: 1.55, fontWeight: 500, color: INK }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <motion.p {...upView()} style={{ textAlign: 'center', fontSize: 15, color: MUTED, marginTop: 28 }}>
        Votre métier n&apos;est pas dans la liste ? S&apos;il vous apprend à résoudre un problème que d&apos;autres ont aussi, <strong style={{ color: INK }}>il contient une offre</strong>.
      </motion.p>
      <motion.div {...upView(0.1)} style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '10px 22px', padding: '18px 22px', borderRadius: 18, background: SURFACE, border: `1px solid ${LINE}` }}>
        <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: RED }}>100 % en ligne, en français</span>
        <div style={{ flex: '1 1 300px', minWidth: 0, overflow: 'hidden', maskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)' }}>
          <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 26, repeat: Infinity, ease: 'linear' }} style={{ display: 'flex', width: 'max-content' }}>
            {[...COUNTRIES, ...COUNTRIES].map((c, i) => (
              <span key={i} style={{ fontSize: 14, color: MUTED, whiteSpace: 'nowrap', padding: '0 14px', display: 'inline-flex', alignItems: 'center', gap: 14 }}>
                {c}<span style={{ width: 4, height: 4, borderRadius: '50%', background: RED, opacity: 0.6 }} />
              </span>
            ))}
          </motion.div>
        </div>
        <span style={{ fontSize: 14, fontWeight: 600 }}>Paiement Orange Money, MTN MoMo, Wave</span>
      </motion.div>
    </div>
  );
}

/* ─── avant / après : cartes qui basculent en 3D ────── */
function BeforeAfter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [after, setAfter] = useState(false);
  const [touched, setTouched] = useState(false);

  // Bascule automatique une fois la section vue, tant que le visiteur n'a pas pris la main.
  useEffect(() => {
    if (!inView || touched) return;
    const t = setTimeout(() => setAfter(true), 1600);
    return () => clearTimeout(t);
  }, [inView, touched]);

  const pick = (v: boolean) => { setTouched(true); setAfter(v); };

  return (
    <div ref={ref}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
        <div role="radiogroup" aria-label="Avant ou après la formation" style={{ position: 'relative', display: 'flex', padding: 5, borderRadius: 99, background: '#fff', border: `1px solid ${LINE}`, boxShadow: CARD_SHADOW }}>
          <motion.span
            aria-hidden
            animate={{ x: after ? '100%' : '0%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ position: 'absolute', top: 5, left: 5, width: 'calc(50% - 5px)', height: 'calc(100% - 10px)', borderRadius: 99, background: after ? `linear-gradient(135deg, ${RED_HI}, ${RED})` : '#EDE7E8', boxShadow: after ? '0 8px 24px rgba(229,19,43,0.3)' : 'none' }}
          />
          {([['Avant', false], ['Après', true]] as const).map(([label, v]) => (
            <button
              key={label}
              role="radio"
              aria-checked={after === v}
              onClick={() => pick(v)}
              style={{ position: 'relative', width: 150, padding: '12px 0', border: 'none', background: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 700, color: after === v ? (v ? '#fff' : INK) : FAINT }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gap: 14, maxWidth: 900, margin: '0 auto' }}>
        {BEFORE_AFTER.map((row, i) => (
          <div key={row.k} className="fo-barow" style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 18, alignItems: 'center' }}>
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: after ? RED : FAINT, transition: 'color .4s' }}>{row.k}</p>
            <div style={{ perspective: 1200 }}>
              <motion.div
                animate={{ rotateX: after ? 180 : 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: i * 0.09 }}
                style={{ display: 'grid', transformStyle: 'preserve-3d' }}
              >
                <div style={{ gridArea: '1 / 1', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', padding: 'var(--fo-face-pad, 20px 24px)', borderRadius: 16, background: '#F3F0F0', border: `1px solid ${LINE}`, display: 'flex', gap: 14, alignItems: 'center' }}>
                  <X size={18} color={FAINT} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 16, lineHeight: 1.5, color: MUTED }}>{row.before}</span>
                </div>
                <div style={{ gridArea: '1 / 1', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateX(180deg)', padding: '20px 24px', borderRadius: 16, background: '#fff', border: `1.5px solid ${RED}`, display: 'flex', gap: 14, alignItems: 'center', boxShadow: '0 14px 30px -12px rgba(229,19,43,0.3)' }}>
                  <CheckCircle2 size={18} color={RED} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 16, lineHeight: 1.5, fontWeight: 600, color: INK }}>{row.after}</span>
                </div>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── parcours : escalier isométrique en SVG ────────── */
const ISO = { w: 96, d: 110, h: 38 };
const C30 = Math.cos(Math.PI / 6);
// Axe x (la progression) vers le haut à droite, axe y (la profondeur) vers le bas à droite :
// chaque marche apparaît plus haute que la précédente.
const iso = (x: number, y: number, z: number): [number, number] => [(x + y) * C30, (y - x) * 0.5 - z];
const poly = (pts: [number, number, number][]) => pts.map(p => iso(...p).map(n => n.toFixed(1)).join(',')).join(' ');

function Staircase() {
  const [sel, setSel] = useState(0);
  const boxes = WEEKS.map((w, i) => {
    const x0 = i * ISO.w, x1 = x0 + ISO.w, d = ISO.d, h = (i + 1) * ISO.h;
    return {
      week: w,
      top: poly([[x0, 0, h], [x1, 0, h], [x1, d, h], [x0, d, h]]),
      front: poly([[x0, d, 0], [x1, d, 0], [x1, d, h], [x0, d, h]]),
      side: poly([[x0, 0, 0], [x0, d, 0], [x0, d, h], [x0, 0, h]]),
      label: iso((x0 + x1) / 2, d / 2, h),
    };
  });
  const all = boxes.flatMap((_, i) => {
    const x0 = i * ISO.w, x1 = x0 + ISO.w, h = (i + 1) * ISO.h;
    return [iso(x0, 0, 0), iso(x0, ISO.d, 0), iso(x1, ISO.d, 0), iso(x0, 0, h), iso(x1, 0, h), iso(x1, ISO.d, h)];
  });
  const minX = Math.min(...all.map(p => p[0])) - 40;
  const maxX = Math.max(...all.map(p => p[0])) + 130;
  const minY = Math.min(...all.map(p => p[1])) - 80;
  const maxY = Math.max(...all.map(p => p[1])) + 40;

  const colors = (i: number) => {
    if (i === sel) return { top: RED_HI, front: RED, side: RED_DEEP, text: '#fff' };
    if (i < sel) return { top: '#FFC2C9', front: '#F6909C', side: '#E86676', text: RED_DEEP };
    return { top: '#F6F1F1', front: '#E9E1E2', side: '#DDD2D3', text: FAINT };
  };

  const w = WEEKS[sel];
  const mods = MODULES.filter(m => m.week === w.n);
  const flag = boxes[boxes.length - 1].label;
  const start = iso(0, ISO.d / 2, 0);

  return (
    <div className="fo-stairs" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 40, alignItems: 'center' }}>
      <div>
        <svg viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }} role="group" aria-label="Les 5 semaines du parcours">
          {/* de la marche la plus lointaine à la plus proche */}
          {boxes.map((b, i) => ({ b, i })).reverse().map(({ b, i }) => {
            const c = colors(i);
            return (
              <motion.g
                key={b.week.n}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.12 }}
                onClick={() => setSel(i)}
                style={{ cursor: 'pointer' }}
                role="button"
                tabIndex={0}
                aria-label={`Semaine ${b.week.n} : ${b.week.theme}`}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(i); } }}
              >
                <polygon points={b.side} fill={c.side} stroke="#fff" strokeWidth={1.5} style={{ transition: 'fill .35s' }} />
                <polygon points={b.front} fill={c.front} stroke="#fff" strokeWidth={1.5} style={{ transition: 'fill .35s' }} />
                <polygon points={b.top} fill={c.top} stroke="#fff" strokeWidth={1.5} style={{ transition: 'fill .35s' }} />
                <text x={b.label[0]} y={b.label[1] + 7} textAnchor="middle" fill={c.text} fontSize={20} fontWeight={800} style={{ pointerEvents: 'none', fontFamily: 'DM Sans, sans-serif', transition: 'fill .35s' }}>
                  {b.week.n === 5 ? '1:1' : `S${b.week.n}`}
                </text>
              </motion.g>
            );
          })}
          <motion.g initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.9 }}>
            <line x1={flag[0] + 30} y1={flag[1] - 6} x2={flag[0] + 30} y2={flag[1] - 62} stroke={INK} strokeWidth={2} />
            <polygon points={`${flag[0] + 31},${flag[1] - 62} ${flag[0] + 66},${flag[1] - 52} ${flag[0] + 31},${flag[1] - 42}`} fill={RED} />
            <text x={flag[0] + 72} y={flag[1] - 46} fill={INK} fontSize={15} fontWeight={700} style={{ fontFamily: 'DM Sans, sans-serif' }}>2e revenu lancé</text>
          </motion.g>
          <text x={start[0]} y={start[1] + 34} textAnchor="middle" fill={FAINT} fontSize={14} fontWeight={600} style={{ fontFamily: 'DM Sans, sans-serif' }}>Aujourd&apos;hui</text>
        </svg>
        <p style={{ textAlign: 'center', fontSize: 13, color: FAINT, marginTop: 8 }}>Cliquez sur une marche pour voir la semaine.</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={w.n}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35, ease: EASE }}
          style={{ borderRadius: 24, padding: 32, background: '#fff', border: `1px solid ${w.n === 5 ? RED : LINE}`, boxShadow: CARD_SHADOW }}
        >
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            {w.n === 5 && <UserRound size={16} color={RED} />}
            <span style={{ color: RED }}>Semaine {w.n}</span>
            <span style={{ color: FAINT }}>· {w.theme}</span>
          </p>
          {w.n === 5 ? (
            <>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: INK, marginBottom: 18 }}>Une semaine en tête-à-tête pour lancer votre offre</h3>
              <div style={{ display: 'grid', gap: 10, marginBottom: 24 }}>
                {ONE_TO_ONE.map(t => (
                  <div key={t} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <CheckCircle2 size={16} color={RED} style={{ marginTop: 3, flexShrink: 0 }} />
                    <span style={{ fontSize: 15, color: INK, lineHeight: 1.5 }}>{t}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ display: 'grid', gap: 20, marginBottom: 24 }}>
              {mods.map(m => (
                <div key={m.n}>
                  <p style={{ fontSize: 12, fontWeight: 800, color: RED, marginBottom: 6 }}>MODULE {m.n}</p>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: INK, marginBottom: 6 }}>{m.title}</h3>
                  <p style={{ fontSize: 14.5, color: MUTED, lineHeight: 1.6 }}>{m.desc}</p>
                </div>
              ))}
            </div>
          )}
          <div style={{ padding: '16px 18px', borderRadius: 14, background: SOFT, border: `1px solid ${RED_TINT}`, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <Flag size={18} color={RED} style={{ marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: 14.5, lineHeight: 1.5, color: INK }}><strong>En fin de semaine, vous avez :</strong> <span style={{ color: MUTED }}>{w.deliverable}</span></p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 22 }}>
            <button onClick={() => setSel(Math.max(0, sel - 1))} disabled={sel === 0} style={{ background: 'none', border: 'none', color: sel === 0 ? '#D6CDCE' : MUTED, cursor: sel === 0 ? 'default' : 'pointer', fontSize: 14, fontWeight: 600 }}>← Précédente</button>
            <button onClick={() => setSel(Math.min(WEEKS.length - 1, sel + 1))} disabled={sel === WEEKS.length - 1} style={{ background: 'none', border: 'none', color: sel === WEEKS.length - 1 ? '#D6CDCE' : RED, cursor: sel === WEEKS.length - 1 ? 'default' : 'pointer', fontSize: 14, fontWeight: 700 }}>Suivante →</button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─── études de cas ─────────────────────────────────── */
function CaseStudies() {
  const [active, setActive] = useState(0);
  const [clients, setClients] = useState(3);
  const c = CASES[active];
  const Icon = c.icon;
  const total = clients * c.prix;

  const select = (i: number) => {
    setActive(i);
    setClients(Math.min(3, CASES[i].max));
  };

  const steps = [
    { icon: Briefcase, label: 'Le savoir-faire', text: c.savoir },
    { icon: Target, label: 'Le problème repéré', text: c.probleme },
    { icon: Package, label: 'L\'offre construite', text: c.offre },
  ];

  return (
    <div>
      <div role="tablist" aria-label="Études de cas" className="fo-scrolltabs" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 32 }}>
        {CASES.map((x, i) => {
          const on = i === active;
          const XIcon = x.icon;
          return (
            <button
              key={x.id}
              role="tab"
              aria-selected={on}
              onClick={() => select(i)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 18px', borderRadius: 99, cursor: 'pointer', fontSize: 14.5, fontWeight: 600, border: `1px solid ${on ? RED : LINE}`, background: on ? RED : '#fff', color: on ? '#fff' : MUTED, transition: 'all .2s' }}
            >
              <XIcon size={15} /> {x.metier}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="fo-case"
          style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 24 }}
        >
          {/* le raisonnement */}
          <div className="fo-ccard" style={{ borderRadius: 28, padding: 34, background: '#fff', border: `1px solid ${LINE}`, boxShadow: CARD_SHADOW }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 26 }}>
              <span style={{ width: 48, height: 48, borderRadius: 14, background: RED_TINT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={22} color={RED} /></span>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: RED }}>Cas type · {c.metier}</p>
                <h3 style={{ fontFamily: DISPLAY, fontSize: 24, fontWeight: 600, color: INK, lineHeight: 1.2 }}>{c.title}</h3>
              </div>
            </div>
            <div style={{ position: 'relative', display: 'grid', gap: 22 }}>
              <span aria-hidden style={{ position: 'absolute', left: 17, top: 18, bottom: 18, width: 2, background: `linear-gradient(${RED_TINT}, ${RED})` }} />
              {steps.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.12, ease: EASE }} style={{ position: 'relative', display: 'flex', gap: 16 }}>
                  <span style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: i === 2 ? RED : '#fff', border: `2px solid ${RED}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <s.icon size={16} color={i === 2 ? '#fff' : RED} />
                  </span>
                  <div>
                    <p style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: FAINT, marginBottom: 4 }}>{s.label}</p>
                    <p style={{ fontSize: 15.5, lineHeight: 1.6, color: i === 2 ? INK : MUTED, fontWeight: i === 2 ? 600 : 400 }}>{s.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div style={{ marginTop: 26, padding: 18, borderRadius: 16, background: SURFACE, border: `1px solid ${LINE}` }}>
              <p style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: FAINT, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><Wrench size={13} /> Ce que fait l&apos;IA</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {c.ia.map(t => (
                  <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 99, background: '#fff', border: `1px solid ${LINE}`, fontSize: 13.5, fontWeight: 500, color: INK }}>
                    <Sparkles size={13} color={RED} /> {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* le calcul */}
          <div className="fo-ccard" style={{ position: 'relative', borderRadius: 28, padding: 34, background: `linear-gradient(160deg, ${RED} 0%, ${RED_DEEP} 100%)`, color: '#fff', overflow: 'hidden', boxShadow: '0 30px 70px -20px rgba(229,19,43,0.45)', display: 'flex', flexDirection: 'column' }}>
            <div aria-hidden style={{ position: 'absolute', top: -100, right: -100, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.2), transparent 70%)' }} />
            <p style={{ position: 'relative', fontSize: 12.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.85, marginBottom: 18 }}>Faites le calcul</p>
            <div style={{ position: 'relative', display: 'grid', gap: 10, fontSize: 15, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ opacity: 0.8 }}>Prix</span><strong>{frNum(c.prix)} F / {c.unite}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><span style={{ opacity: 0.8 }}>Temps</span><strong style={{ textAlign: 'right' }}>{c.temps}</strong></div>
            </div>
            <label htmlFor="fo-clients" style={{ position: 'relative', fontSize: 14, fontWeight: 600, marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
              <span>Nombre de {c.unite.split(' ')[0]}s par mois</span>
              <span style={{ fontSize: 18, fontWeight: 800 }}>{clients}</span>
            </label>
            <input
              id="fo-clients"
              className="fo-range"
              type="range"
              min={1}
              max={c.max}
              value={clients}
              onChange={e => setClients(Number(e.target.value))}
              style={{ position: 'relative', width: '100%', marginBottom: 28 }}
            />
            <div style={{ position: 'relative', marginTop: 'auto', padding: 20, borderRadius: 18, background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.25)' }}>
              <p style={{ fontSize: 13, opacity: 0.85, marginBottom: 4 }}>Revenu complémentaire potentiel</p>
              <p style={{ fontFamily: DISPLAY, fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 600, lineHeight: 1.05 }}>
                <AnimatedNumber value={total} /> <span style={{ fontSize: '0.5em' }}>F / mois</span>
              </p>
              <p style={{ fontSize: 12.5, opacity: 0.8, marginTop: 6 }}>{clients} × {frNum(c.prix)} F, en plus de votre salaire</p>
            </div>
            <p style={{ position: 'relative', fontSize: 11.5, opacity: 0.7, marginTop: 14, lineHeight: 1.5 }}>
              Cas type construit avec la méthode de la formation. Les montants sont indicatifs, pas une promesse de revenus.
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─── FAQ ───────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${LINE}` }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '22px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: INK }}
      >
        <span style={{ fontSize: 16.5, fontWeight: 600 }}>{q}</span>
        <ChevronDown size={18} color={open ? RED : FAINT} style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }} style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: MUTED, paddingBottom: 22 }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── page ──────────────────────────────────────────── */
export default function FormationPage() {
  const siteHref = useMainSiteHref();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  const [showSticky, setShowSticky] = useState(false);
  useMotionValueEvent(scrollY, 'change', v => setShowSticky(v > 700));

  return (
    <MotionConfig reducedMotion="user">
      <main style={{ background: BG, color: INK, fontFamily: 'DM Sans, sans-serif', overflowX: 'clip' }}>
        <style>{`
          .fo-navlink { color: ${MUTED}; font-size: 14px; font-weight: 500; text-decoration: none; transition: color .15s; }
          .fo-navlink:hover { color: ${RED}; }
          .fo-sticky { display: none; }
          .fo-range { -webkit-appearance: none; appearance: none; height: 6px; border-radius: 6px; background: rgba(255,255,255,0.3); outline: none; cursor: pointer; }
          .fo-range::-webkit-slider-thumb { -webkit-appearance: none; width: 24px; height: 24px; border-radius: 50%; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.25); }
          .fo-range::-moz-range-thumb { width: 24px; height: 24px; border: none; border-radius: 50%; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.25); }
          @media (max-width: 900px) {
            .fo-hero, .fo-stairs, .fo-offer, .fo-paths, .fo-case { grid-template-columns: 1fr !important; }
            .fo-trust { grid-template-columns: 1fr 1fr !important; }
            .fo-ptabs { grid-template-columns: repeat(3, 1fr) !important; }
          }
          .fo-short { display: none; }
          .fo-scrolltabs { scrollbar-width: none; }
          .fo-scrolltabs::-webkit-scrollbar { display: none; }
          @media (max-width: 720px) {
            .fo-nav, .fo-hbadge, .fo-long { display: none !important; }
            .fo-short { display: inline; }
            .fo-section { padding: 60px 16px !important; }
            .fo-shead { margin-bottom: 32px !important; }
            .fo-ssub { font-size: 15.5px !important; }
            .fo-herosec { padding: 28px 16px 52px !important; }
            .fo-badge { font-size: 12.5px !important; padding: 6px 12px !important; margin-bottom: 20px !important; }
            .fo-h1 { font-size: clamp(2.05rem, 9.4vw, 2.6rem) !important; margin-bottom: 18px !important; }
            .fo-lead { font-size: 16px !important; margin-bottom: 28px !important; }
            .fo-video { border-width: 3px !important; border-radius: 18px !important; }
            .fo-cta-wrap { margin-top: 28px !important; align-items: stretch !important; }
            .fo-cta-wrap > a { width: 100%; padding: 17px 20px !important; font-size: 16.5px !important; }
            .fo-trust { grid-template-columns: 1fr 1fr !important; gap: 8px !important; margin-top: 28px !important; }
            .fo-trust-item { padding: 10px !important; gap: 9px !important; }
            .fo-trust-item > span:first-child { width: 32px !important; height: 32px !important; }
            .fo-trust-sub { display: none !important; }
            .fo-band { padding: 60px 18px 68px !important; }
            .fo-band-text { font-size: 1.45rem !important; }
            .fo-scrolltabs { display: flex !important; flex-wrap: nowrap !important; justify-content: flex-start !important; overflow-x: auto; scroll-snap-type: x mandatory; margin-left: -16px; margin-right: -16px; padding: 4px 16px 6px; }
            .fo-scrolltabs > button { flex: 0 0 auto; scroll-snap-align: start; }
            .fo-phead { padding: 22px !important; gap: 14px !important; flex-wrap: nowrap !important; align-items: flex-start !important; }
            .fo-phead > div:last-child { min-width: 0 !important; }
            .fo-pmeta { font-size: 13px !important; }
            .fo-pavatar { width: 44px !important; height: 44px !important; font-size: 19px !important; border-radius: 13px !important; }
            .fo-pquote { font-size: 1.15rem !important; }
            .fo-ccard { padding: 22px !important; border-radius: 22px !important; }
            .fo-barow { --fo-face-pad: 14px 16px; }
            .fo-guar { padding: 26px 20px !important; justify-content: center; text-align: center; gap: 12px !important; }
            .fo-seal { transform: scale(0.8); margin: -16px auto; }
            .fo-faq { padding: 2px 18px !important; }
            .fo-split { grid-template-columns: 1fr !important; }
            .fo-split > div { border-left: none !important; padding: 26px !important; }
            .fo-barow { grid-template-columns: 1fr !important; gap: 8px !important; }
            .fo-sticky { display: flex; }
            .fo-footer { padding-bottom: 96px !important; }
          }
        `}</style>

        <motion.div aria-hidden style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 70, background: `linear-gradient(90deg, ${RED_HI}, ${RED})`, scaleX: progress, transformOrigin: '0 50%' }} />

        {/* ── HEADER (autonome : la page vit sur formation.ozirus.agency) ── */}
        <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderBottom: `1px solid ${LINE}` }}>
          <div style={{ maxWidth: 1080, margin: '0 auto', height: 64, padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <a href="#" aria-label="Haut de page" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <img src="/logo.png" alt="Ozirus" style={{ height: 28, filter: 'brightness(0)' }} />
              <span className="fo-hbadge" style={{ fontSize: 12, fontWeight: 700, color: RED, padding: '3px 8px', borderRadius: 6, background: RED_TINT }}>Formation</span>
            </a>
            <nav className="fo-nav" style={{ display: 'flex', gap: 26 }}>
              {[['#pour-qui', 'Pour qui'], ['#avant-apres', 'Avant / Après'], ['#parcours', 'Parcours'], ['#etudes-de-cas', 'Études de cas'], ['#faq', 'FAQ']].map(([href, label]) => (
                <a key={href} href={href} className="fo-navlink">{label}</a>
              ))}
            </nav>
            <a href="#inscription" style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 18px', borderRadius: 10, background: RED, color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(229,19,43,0.28)' }}>
              <span className="fo-long">Réserver ma place</span><span className="fo-short">Réserver</span>
            </a>
          </div>
        </header>

        {/* ── HERO : promesse + vidéo + CTA ── */}
        <section className="fo-herosec" style={{ position: 'relative', padding: '64px 20px 72px', overflow: 'hidden', background: `radial-gradient(ellipse 70% 55% at 50% 0%, ${RED_TINT} 0%, rgba(255,255,255,0) 70%)` }}>
          <motion.div aria-hidden animate={{ x: [0, 60, 0], y: [0, 30, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', top: 80, left: '-8%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(229,19,43,0.14), transparent 65%)', filter: 'blur(10px)', pointerEvents: 'none' }} />
          <motion.div aria-hidden animate={{ x: [0, -50, 0], y: [0, 40, 0] }} transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', top: 260, right: '-10%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(229,19,43,0.12), transparent 65%)', filter: 'blur(10px)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
              <span className="fo-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 99, background: '#fff', border: `1px solid ${RED_TINT}`, boxShadow: '0 6px 20px -8px rgba(229,19,43,0.3)', fontSize: 14, fontWeight: 600, marginBottom: 28 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: RED }} />
                Pour les salariés et indépendants qui ont déjà un métier
              </span>
              <h1 className="fo-h1" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(2.4rem, 6.4vw, 5rem)', lineHeight: 1.02, letterSpacing: '-0.035em', marginBottom: 26, textWrap: 'balance' }}>
                <Words text="Transformez votre métier en" delay={0.1} />{' '}
                <motion.span initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: EASE, delay: 0.4 }} style={{ display: 'inline-block' }}>
                  <Highlight>2<sup style={{ fontSize: '0.5em' }}>e</sup> revenu</Highlight>
                </motion.span>{' '}
                <Words text="grâce à l'IA." delay={0.55} />
              </h1>
              <p className="fo-lead" style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: MUTED, lineHeight: 1.65, maxWidth: 700, margin: '0 auto 44px' }}>
                En 5 semaines, apprenez à transformer ce que vous savez déjà faire en <strong style={{ color: INK }}>une offre que des clients paient</strong>. Sans quitter votre emploi, même si vous ne connaissez l&apos;IA que de nom.
              </p>
            </motion.div>

            <VideoBlock />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.3 }} className="fo-cta-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginTop: 44 }}>
              <CtaButton href="#inscription" big>Oui, je veux mon 2ᵉ revenu <ArrowRight size={20} /></CtaButton>
              <p style={{ fontSize: 14, color: MUTED }}>
                <strong style={{ color: INK }}>{OFFER.prix} FCFA</strong> · payable en 3 fois · satisfait ou remboursé 14 jours
              </p>
            </motion.div>

            <div className="fo-trust" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 48 }}>
              {[
                { icon: Clock, t: '5 à 7 h / semaine', s: 'Compatible avec un emploi' },
                { icon: Layers, t: 'Lives enregistrés', s: 'À revoir quand vous voulez' },
                { icon: UserRound, t: 'Coaching 1:1', s: 'Une semaine en tête-à-tête' },
                { icon: Shield, t: 'Garantie 14 jours', s: 'Remboursé sans question' },
              ].map(({ icon: Icon, t, s }, i) => (
                <motion.div key={t} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -4, boxShadow: CARD_SHADOW }} transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }} className="fo-trust-item" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, background: '#fff', border: `1px solid ${LINE}`, textAlign: 'left' }}>
                  <span style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0, background: RED_TINT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={18} color={RED} /></span>
                  <span>
                    <span style={{ display: 'block', fontSize: 14, fontWeight: 700 }}>{t}</span>
                    <span className="fo-trust-sub" style={{ display: 'block', fontSize: 12.5, color: FAINT }}>{s}</span>
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LE PROBLÈME (bandeau rouge) ── */}
        <section className="fo-band" style={{ position: 'relative', padding: '88px 20px', background: `linear-gradient(160deg, ${RED} 0%, ${RED_DEEP} 100%)`, color: '#fff', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', top: -160, right: -120, width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.16), transparent 70%)' }} />
          <motion.div {...upView()} style={{ position: 'relative', maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.8, marginBottom: 20 }}>Soyons honnêtes</p>
            <p className="fo-band-text" style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.6rem, 3.8vw, 2.7rem)', lineHeight: 1.2, fontWeight: 600 }}>
              Vous connaissez ChatGPT. On vous répète que l&apos;IA « va tout changer ».
              Mais personne ne vous a montré <motion.span
                initial={{ backgroundSize: '0% 100%', color: '#FFFFFF' }}
                whileInView={{ backgroundSize: '100% 100%', color: RED }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
                style={{ backgroundImage: 'linear-gradient(#fff, #fff)', backgroundRepeat: 'no-repeat', backgroundPosition: 'left center', padding: '0 10px', borderRadius: 8, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}
              >comment elle peut vous rapporter de l&apos;argent</motion.span>, avec ce que vous savez déjà faire.
            </p>
            <p style={{ fontSize: 18, opacity: 0.85, marginTop: 26, lineHeight: 1.7 }}>
              Le problème n&apos;est ni l&apos;outil, ni votre niveau. C&apos;est qu&apos;on vous parle d&apos;IA en général, jamais de <strong>votre</strong> métier.
            </p>
          </motion.div>
        </section>

        {/* ── PERSONAS ── */}
        <Section id="pour-qui">
          <SectionHead eyebrow="Pour qui" title={<>Vous vous <Red>reconnaissez</Red> ?</>} sub="Du Cameroun au Sénégal : un vrai métier, un salaire qui ne suffit plus, une famille qui compte sur vous. Choisissez le profil qui vous ressemble." />
          <Personas />
        </Section>

        {/* ── POUR VOUS / PAS POUR VOUS ── */}
        <Section style={{ background: SURFACE }}>
          <SectionHead eyebrow="Avant d'aller plus loin" title={<>Cette formation <Red>n&apos;est pas pour tout le monde</Red></>} />
          <ForWho />
        </Section>

        {/* ── AVANT / APRÈS ── */}
        <Section id="avant-apres">
          <SectionHead eyebrow="Avant / Après" title={<>Ce qui change <Red>en 5 semaines</Red></>} sub="Basculez pour voir la différence. Pas de promesse de chiffre : ce que vous aurez concrètement entre les mains." />
          <BeforeAfter />
          <motion.div {...upView()} style={{ display: 'flex', justifyContent: 'center', marginTop: 48 }}>
            <CtaButton href="#inscription">Je veux mon 2ᵉ revenu <ArrowRight size={18} /></CtaButton>
          </motion.div>
        </Section>

        {/* ── PARCOURS ── */}
        <Section id="parcours" style={{ background: SURFACE }}>
          <SectionHead eyebrow="Le parcours" title={<>5 marches. <Red>Un 2<sup style={{ fontSize: '0.5em' }}>e</sup> revenu</Red> au sommet.</>} sub="De la culture générale de l'IA à une offre lancée. Chaque semaine se termine par un livrable concret." />
          <Staircase />
        </Section>

        {/* ── ÉTUDES DE CAS ── */}
        <Section id="etudes-de-cas">
          <SectionHead eyebrow="Études de cas" title={<>Du métier <Red>à l&apos;offre</Red>, étape par étape</>} sub="Trois cas types pour voir le raisonnement de la formation. Choisissez un métier, puis faites vos propres calculs." />
          <CaseStudies />
        </Section>

        {/* ── OFFRE ── */}
        <Section id="inscription" style={{ background: SURFACE }}>
          <SectionHead eyebrow="L'offre" title={<>Tout ce que vous recevez pour <Red>lancer votre offre</Red></>} />
          <div className="fo-offer" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'stretch' }}>
            <div>
              <KitStack />
              <p style={{ marginTop: 18, padding: '14px 18px', borderRadius: 14, background: '#fff', border: `1px solid ${LINE}`, fontSize: 14.5, color: MUTED, lineHeight: 1.6 }}>
                Soit environ <strong style={{ color: INK }}>{OFFER.prixJour} FCFA par jour</strong> pendant un mois. Dans le cas type RH, deux recrutements suffisent à la rembourser.
              </p>
            </div>

            <motion.div
              {...upView(0.1)}
              style={{ position: 'relative', borderRadius: 24, padding: 36, color: '#fff', background: `linear-gradient(160deg, ${RED} 0%, ${RED_DEEP} 100%)`, boxShadow: '0 40px 90px -30px rgba(229,19,43,0.55)', overflow: 'hidden' }}
            >
              <div aria-hidden style={{ position: 'absolute', top: -120, right: -120, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.2), transparent 70%)' }} />
              <p style={{ position: 'relative', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.85, marginBottom: 10 }}>Session du {SESSION_COURTE}</p>
              <p style={{ position: 'relative', fontFamily: DISPLAY, fontSize: 'clamp(2.4rem, 5vw, 3.4rem)', fontWeight: 600, lineHeight: 1 }}><AnimatedNumber value={OFFER.prixNum} /> <span style={{ fontSize: '0.45em' }}>FCFA</span></p>
              <p style={{ position: 'relative', fontSize: 14.5, opacity: 0.85, marginTop: 10, marginBottom: 26 }}>1 mois en groupe + 1 semaine de coaching 1:1</p>
              <p style={{ position: 'relative', fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Ou en 3 versements</p>
              <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 28 }}>
                {OFFER.versements.map(v => (
                  <div key={v.quand} style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.22)', borderRadius: 12, padding: '12px 6px', textAlign: 'center' }}>
                    <p style={{ fontSize: 16, fontWeight: 800 }}>{v.montant} F</p>
                    <p style={{ fontSize: 11.5, opacity: 0.85, marginTop: 3 }}>{v.quand}</p>
                  </div>
                ))}
              </div>
              <motion.a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#fff', color: RED, padding: 18, borderRadius: 14, fontSize: 16.5, fontWeight: 800, textDecoration: 'none', boxShadow: '0 12px 30px rgba(0,0,0,0.18)' }}
              >
                <MessageCircle size={19} /> Réserver via WhatsApp
              </motion.a>
              <div style={{ position: 'relative', marginTop: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, opacity: 0.9, marginBottom: 6 }}>
                  <span>{OFFER.placesPrises} places prises</span><span>{PLACES_RESTANTES} restantes</span>
                </div>
                <div style={{ height: 6, borderRadius: 6, background: 'rgba(0,0,0,0.2)', overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${(OFFER.placesPrises / OFFER.placesTotales) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1.2, ease: EASE }} style={{ height: '100%', background: '#fff', borderRadius: 6 }} />
                </div>
                <p style={{ fontSize: 12, opacity: 0.8, marginTop: 12, textAlign: 'center' }}>Orange Money, MTN Mobile Money, Wave ou virement.</p>
              </div>
            </motion.div>
          </div>

          {/* garantie */}
          <motion.div {...upView()} className="fo-guar" style={{ marginTop: 40, borderRadius: 28, padding: '36px 40px', background: '#fff', border: `2px dashed ${RED}`, display: 'flex', alignItems: 'center', gap: 34, flexWrap: 'wrap' }}>
            <GuaranteeSeal />
            <div style={{ flex: 1, minWidth: 260 }}>
              <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: RED, marginBottom: 8 }}>Garantie sans risque</p>
              <h3 style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 600, lineHeight: 1.15, marginBottom: 12 }}>14 jours pour juger. Remboursé sinon.</h3>
              <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.65 }}>Suivez les deux premières semaines. Si la formation ne vous apporte rien de concret pour votre métier, nous vous remboursons intégralement, sans poser de questions. Le risque est de notre côté, pas du vôtre.</p>
            </div>
          </motion.div>
        </Section>

        {/* ── FAQ ── */}
        <Section id="faq">
          <SectionHead eyebrow="FAQ" title="Questions fréquentes" />
          <motion.div {...upView()} style={{ maxWidth: 760, margin: '0 auto', borderRadius: 24, padding: '6px 32px', background: '#fff', border: `1px solid ${LINE}`, boxShadow: CARD_SHADOW }} className="fo-faq">
            {FAQS.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </motion.div>
        </Section>

        {/* ── DEUX CHEMINS (bandeau rouge final) ── */}
        <section className="fo-band" style={{ position: 'relative', padding: '96px 20px 110px', background: `linear-gradient(160deg, ${RED} 0%, ${RED_DEEP} 100%)`, color: '#fff', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', bottom: -200, left: -150, width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.14), transparent 70%)' }} />
          <div style={{ position: 'relative', maxWidth: 960, margin: '0 auto' }}>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(2rem, 5vw, 3.4rem)', lineHeight: 1.05, letterSpacing: '-0.03em', textAlign: 'center', marginBottom: 48 }}>
              <Words text="Dans 5 semaines," inView /><br /><Words text="vous serez où ?" inView delay={0.25} />
            </h2>
            <div className="fo-paths" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20, alignItems: 'stretch' }}>
              <motion.div {...upView()} style={{ borderRadius: 24, padding: 32, background: 'rgba(0,0,0,0.16)', border: '1px solid rgba(255,255,255,0.18)' }}>
                <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 14 }}>Chemin 1 · Vous attendez</p>
                <p style={{ fontSize: 16.5, opacity: 0.85, lineHeight: 1.7 }}>
                  Vous fermez cet onglet. Vous continuez à utiliser l&apos;IA pour vos emails. Dans 5 semaines, vous avez toujours un seul revenu, et le même salaire.
                </p>
              </motion.div>
              <motion.div {...upView(0.1)} style={{ borderRadius: 24, padding: 32, background: '#fff', color: INK, boxShadow: '0 40px 80px -30px rgba(0,0,0,0.45)' }}>
                <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: RED, marginBottom: 14 }}>Chemin 2 · Vous construisez</p>
                <p style={{ fontSize: 16.5, lineHeight: 1.7, marginBottom: 26 }}>
                  Le {SESSION_COURTE}, vous commencez. Dans 5 semaines, vous avez une offre tirée de votre métier, un prix, un script pour la vendre et un plan sur 90 jours.
                </p>
                <div className="fo-cta-wrap"><CtaButton big>Je réserve ma place <ArrowRight size={20} /></CtaButton></div>
                <p style={{ fontSize: 13, color: MUTED, marginTop: 14 }}>{OFFER.prix} FCFA · en 3 fois · garantie 14 jours</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="fo-footer" style={{ borderTop: `1px solid ${LINE}`, padding: '24px 20px' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src="/logo.png" alt="Ozirus" style={{ height: 22, filter: 'brightness(0)', opacity: 0.5 }} />
              <span style={{ fontSize: 13, color: FAINT }}>© {new Date().getFullYear()} Ozirus Agency</span>
            </div>
            <div style={{ display: 'flex', gap: 20, fontSize: 13 }}>
              <Link href={siteHref('/')} style={{ color: FAINT, textDecoration: 'none' }}>Accueil</Link>
              <Link href={siteHref('/terms')} style={{ color: FAINT, textDecoration: 'none' }}>Conditions</Link>
              <Link href={siteHref('/privacy')} style={{ color: FAINT, textDecoration: 'none' }}>Confidentialité</Link>
            </div>
          </div>
        </footer>

        {/* ── CTA collant mobile ── */}
        <motion.div className="fo-sticky" initial={{ y: '110%' }} animate={{ y: showSticky ? '0%' : '110%' }} transition={{ duration: 0.4, ease: EASE }} style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 60, padding: '12px 16px calc(12px + env(safe-area-inset-bottom))', gap: 12, alignItems: 'center', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderTop: `1px solid ${LINE}`, boxShadow: '0 -10px 30px rgba(20,10,12,0.08)' }}>
          <div style={{ flex: 1, lineHeight: 1.25 }}>
            <p style={{ fontSize: 15, fontWeight: 800 }}>{OFFER.prix} F <span style={{ fontSize: 12, fontWeight: 500, color: FAINT }}>· en 3 fois</span></p>
            <p style={{ fontSize: 12, color: RED, fontWeight: 600 }}>{PLACES_RESTANTES} places restantes</p>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" style={{ padding: '13px 18px', borderRadius: 12, background: RED, color: '#fff', fontWeight: 700, fontSize: 14.5, textDecoration: 'none', whiteSpace: 'nowrap' }}>Réserver</a>
        </motion.div>
      </main>
    </MotionConfig>
  );
}
