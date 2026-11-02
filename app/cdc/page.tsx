'use client';

// Landing CDC (cdc.ozirus.agency) — contenu, stratégie, croissance pour les PME camerounaises :
// restaurants, salons, salles de sport, boutiques. DA inspirée d'une affiche sportswear :
// orange brûlé granuleux, flou de mouvement, noir profond, cartes photo inclinées.
// Grand écran : pagination section par section (usePagedScroll de la home, header flottant → offset 0).

import { ArrowUpRight, LayoutDashboard, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePagedScroll } from '@/components/home/usePagedScroll';
import styles from './cdc.module.css';

const WHATSAPP =
  'https://wa.me/237694086571?text=Bonjour%20Ozirus%2C%20je%20souhaite%20parler%20de%20l%27offre%20CDC%20pour%20mon%20entreprise.';

const img = (id: string, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const PHOTOS = {
  hero: img('1539701938214-0d9736e1c16b', 1600), // silhouette de profil sur fond clair (multipliée sur l'orange)
  offer: img('1717089256239-dc2ed4d9dfc6', 1600), // barbier au travail
};

/** Cartes inclinées de la page « Secteurs ». */
const FAN = [
  { src: img('1762745103094-6760fab8eb50', 600), label: 'Salon de coiffure', alt: 'Cliente dans un salon de coiffure' },
  { src: img('1635863872991-040c52b4cfbe', 600), label: 'Salle de sport', alt: 'Coach sportive en tenue orange' },
  { src: img('1567894340315-735d7c361db0', 600), label: 'Barbershop', alt: 'Barbier coupant les cheveux d’un client' },
  { src: img('1610851467843-fe4a65aea9c0', 600), label: 'Pâtisserie', alt: 'Pâtissier décorant des cupcakes' },
  { src: img('1687422808311-a776f467a468', 600), label: 'Boutique', alt: 'Commerçante au comptoir de sa boutique' },
];

/** Métiers qui défilent dans la promesse du héros (« Votre … , en pleine lumière »). */
const HERO_WORDS = ['restaurant', 'salon', 'barbershop', 'boutique', 'pâtisserie', 'gym', 'maquis'];
const HERO_CYCLE = 'Être vu • Attirer • Convertir • Fidéliser • ';

const SECTORS_LINE = ['Restaurants & maquis', 'Salons de beauté', 'Barbershops', 'Salles de sport & Pilates', 'Boutiques & prêt-à-porter', 'Pâtisseries', 'Épiceries', 'Couture'];

/** Ce que l'on livre, métier par métier. */
const TRADES = [
  {
    id: 'resto',
    tab: 'Restaurant',
    title: 'Des plats qui donnent faim avant même d’arriver.',
    photo: img('1636447155412-d57350005073', 1200),
    alt: 'Cuisinier au grill dans un restaurant',
    items: ['Photos et vidéos des plats, prêtes pour les statuts', 'Menu et commandes directement sur WhatsApp', 'Fiche Google Maps et avis clients soignés', 'Le plat du jour diffusé chaque matin'],
  },
  {
    id: 'salon',
    tab: 'Salon & barber',
    title: 'Chaque coiffure devient votre meilleure publicité.',
    photo: img('1653758265969-b048bb0b328a', 1200),
    alt: 'Barbier et son client dans un barbershop',
    items: ['Avant / après filmés en Reels et TikTok', 'Prise de rendez-vous en ligne, sans appels', 'Catalogue des coiffures avec les prix', 'Rappel WhatsApp la veille du rendez-vous'],
  },
  {
    id: 'fitness',
    tab: 'Sport & Pilates',
    title: 'Des cours pleins, des membres qui reviennent.',
    photo: img('1717500251741-cdbc93342d5a', 1200),
    alt: 'Femme en séance de Pilates sur reformer',
    items: ['Vidéos de séances qui donnent envie d’essayer', 'Réservation des cours et des places', 'Abonnements présentés clairement', 'Relance des membres qui ne viennent plus'],
  },
  {
    id: 'boutique',
    tab: 'Boutique',
    title: 'Votre vitrine ouverte jour et nuit, dans la poche du client.',
    photo: img('1585540083814-ea6ee8af9e4f', 1200),
    alt: 'Commerçante devant son étal au marché',
    items: ['Shooting produits simple et lumineux', 'Catalogue WhatsApp toujours à jour', 'Paiement Mobile Money (Orange Money, MoMo)', 'Annonce des nouveaux arrivages'],
  },
];

/** Formules mensuelles (prix validés par Ozirus, nov. 2026). Budget publicitaire payé à part. */
const PLANS = [
  {
    id: 'presence',
    name: 'Présence',
    price: '75 000',
    pitch: 'Être trouvé et faire bonne impression.',
    items: ['-30 % sur Ozirus OS', 'Fiche Google Maps optimisée', 'WhatsApp Business avec catalogue', '1 shooting photo par mois', '8 publications par mois'],
  },
  {
    id: 'croissance',
    name: 'Croissance',
    price: '150 000',
    pitch: 'Attirer chaque mois de nouveaux clients.',
    featured: true,
    items: ['Tout Présence, plus :', '4 vidéos Reels / TikTok par mois', 'Page web de votre entreprise', 'Gestion de vos pages et réponses aux messages', 'Rapport mensuel des résultats'],
  },
  {
    id: 'pilote',
    name: 'Pilote auto',
    price: '250 000',
    pitch: 'Vendre et réserver, même quand vous êtes occupé.',
    items: ['Tout Croissance, plus :', 'Assistant IA WhatsApp : commandes et rendez-vous', 'Réservation en ligne', 'Campagnes publicitaires gérées'],
  },
];

const STEPS = [
  ['01', 'Votre histoire', 'On clarifie ce qui vous rend unique et le message que vos clients doivent retenir.'],
  ['02', 'Votre contenu', 'Photos, vidéos et publications produites sur place, à votre image, au rythme qui vous convient.'],
  ['03', 'Vos demandes', 'Page, WhatsApp et relances : chaque curieux sait comment commander ou réserver.'],
];

const PAGES = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'secteurs', label: 'Secteurs' },
  { id: 'offre', label: 'L’offre' },
  { id: 'metiers', label: 'Par métier' },
  { id: 'tarifs', label: 'Tarifs' },
  { id: 'methode', label: 'Méthode' },
  { id: 'contact', label: 'Contact' },
];

const NAV_LINKS = [
  { id: 'secteurs', label: 'Secteurs' },
  { id: 'metiers', label: 'Par métier' },
  { id: 'tarifs', label: 'Tarifs' },
  { id: 'methode', label: 'Méthode' },
];

const openWhatsApp = (text?: string) =>
  window.open(text ? `https://wa.me/237694086571?text=${encodeURIComponent(text)}` : WHATSAPP, '_blank', 'noopener,noreferrer');

export default function CdcPage() {
  const { active, paged, goTo } = usePagedScroll({ navOffset: 0 });
  const [trade, setTrade] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [word, setWord] = useState(0);
  const [leaving, setLeaving] = useState(false);

  // Promesse du héros : le métier change toutes les 2,4 s (sortie floue, puis entrée floue).
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let swap = 0;
    const tick = window.setInterval(() => {
      setLeaving(true);
      swap = window.setTimeout(() => { setWord(w => (w + 1) % HERO_WORDS.length); setLeaving(false); }, 380);
    }, 2400);
    return () => { window.clearInterval(tick); window.clearTimeout(swap); };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (e: React.MouseEvent, id: string) => {
    const idx = PAGES.findIndex(p => p.id === id);
    if (!paged || idx < 0) return; // défilement natif (scroll-margin gère le header)
    e.preventDefault();
    goTo(idx);
  };

  const isActive = (id: string) => PAGES[active]?.id === id;
  const current = TRADES[trade];

  return (
    <div className={styles.page}>
      <header className={styles.header} data-solid={scrolled ? '' : undefined}>
        <div className={styles.headerInner}>
          <a href="#accueil" className={styles.logo} onClick={e => go(e, 'accueil')}>
            <img src="/logo.png" alt="Ozirus" className={styles.logoImg} />
          </a>
          <nav className={styles.headerLinks} aria-label="Sections">
            {NAV_LINKS.map(l => (
              <a key={l.id} href={`#${l.id}`} onClick={e => go(e, l.id)}>{l.label}</a>
            ))}
          </nav>
          <button type="button" className={styles.headerCta} onClick={() => openWhatsApp()}>Parler à Ozirus</button>
        </div>
      </header>

      {paged && (
        <nav className={styles.rail} aria-label="Pages">
          {PAGES.map((p, i) => (
            <button key={p.id} type="button" onClick={() => goTo(i)} aria-current={i === active ? 'true' : undefined} aria-label={p.label} />
          ))}
        </nav>
      )}

      <main>
        {/* ══ 01 · Héros ══ */}
        <section id="accueil" data-page className={`${styles.section} ${styles.hero}`} data-active={isActive('accueil') ? '' : undefined}>
          <div aria-hidden className={styles.heroMedia}>
            <img src={PHOTOS.hero} alt="" className={styles.heroImg} />
            <img src={PHOTOS.hero} alt="" className={styles.heroGhost} />
          </div>
          <div aria-hidden className={styles.heroTint} />
          <div aria-hidden className={styles.grain} />
          <div className={`${styles.container} ${styles.heroCopy}`}>
            <h1 className={styles.heroTitle} aria-label="Votre business, en pleine lumière">
              <span aria-hidden>
                Votre{' '}
                <span key={word} className={styles.heroWord} data-leaving={leaving ? '' : undefined}>{HERO_WORDS[word]}</span>,
                <br />en pleine lumière
              </span>
            </h1>
            <p className={styles.heroLead}>
              Restaurants, salons, salles de sport, boutiques : Ozirus crée les contenus, la page et le parcours
              WhatsApp qui transforment les curieux en clients fidèles.
            </p>
            <button type="button" className={styles.ghostBtn} onClick={() => openWhatsApp()}>
              Avancer avec <strong>Ozirus</strong>
            </button>
          </div>
          {/* Badge circulaire : la proposition de valeur en cycle, la promesse au centre. */}
          <button type="button" className={styles.cycle} onClick={() => openWhatsApp()} aria-label="Être vu, attirer, convertir, fidéliser : plus de clients. Écrire à Ozirus">
            <svg viewBox="0 0 200 200" aria-hidden className={styles.cycleRing}>
              <defs><path id="cdc-cycle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
              <text><textPath href="#cdc-cycle" textLength="488">{HERO_CYCLE.repeat(2)}</textPath></text>
            </svg>
            <span className={styles.cycleCore} aria-hidden>
              <span>Plus de<br />clients</span>
              <ArrowUpRight size={18} />
            </span>
          </button>
        </section>

        {/* ══ 02 · Secteurs ══ */}
        <section id="secteurs" data-page className={`${styles.section} ${styles.dark}`} data-active={isActive('secteurs') || !paged ? '' : undefined}>
          <div className={styles.container}>
            <div className={styles.fan}>
              {FAN.map((f, i) => (
                <figure key={f.label} className={styles.fanCard} style={{ ['--i' as string]: i - (FAN.length - 1) / 2 }}>
                  <img src={f.src} alt={f.alt} loading="lazy" />
                  <figcaption>{f.label}</figcaption>
                </figure>
              ))}
            </div>
            <p className={styles.fanCaption}>Un look moderne pour<br />les business du quotidien</p>
            <div className={styles.marquee} aria-label="Secteurs accompagnés">
              <div className={styles.marqueeTrack}>
                {[...SECTORS_LINE, ...SECTORS_LINE].map((s, i) => <span key={i} aria-hidden={i >= SECTORS_LINE.length}>{s}</span>)}
              </div>
            </div>
          </div>
        </section>

        {/* ══ 03 · L'offre ══ */}
        <section id="offre" data-page className={`${styles.section} ${styles.dark}`} data-active={isActive('offre') || !paged ? '' : undefined}>
          <div className={styles.container}>
            <article className={styles.offerCard}>
              <div aria-hidden className={styles.offerMedia}>
                <img src={PHOTOS.offer} alt="" className={styles.offerImg} />
                <img src={PHOTOS.offer} alt="" className={styles.offerGhost} />
              </div>
              <div aria-hidden className={styles.offerTint} />
              <div aria-hidden className={styles.grain} />
              <div className={styles.offerBody}>
                <div className={styles.tags}><span>Sprint visibilité</span><span data-filled>Nouveau</span></div>
                <h2 className={styles.offerTitle}>Prenez<br />l’avantage.</h2>
                <p className={styles.offerText}>
                  Un accompagnement court pour clarifier votre message, produire vos premiers contenus pro et
                  installer un parcours simple jusqu’à votre WhatsApp.
                </p>
                <button type="button" className={styles.lightBtn} onClick={() => openWhatsApp()}>
                  Découvrir l’offre <ArrowUpRight size={16} />
                </button>
              </div>
            </article>
          </div>
        </section>

        {/* ══ 04 · Par métier ══ */}
        <section id="metiers" data-page className={`${styles.section} ${styles.dark}`}>
          <div className={`${styles.container} ${styles.trades}`}>
            <div className={styles.tradesCopy}>
              <h2 className={styles.h2}>Ce qu’on fait,<br /><span>selon votre métier.</span></h2>
              <div className={styles.tabs} role="tablist" aria-label="Métiers">
                {TRADES.map((t, i) => (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    id={`tab-${t.id}`}
                    aria-selected={i === trade}
                    aria-controls="trade-panel"
                    className={styles.tab}
                    onClick={() => setTrade(i)}
                    onKeyDown={e => {
                      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                        e.preventDefault();
                        const next = (trade + (e.key === 'ArrowRight' ? 1 : TRADES.length - 1)) % TRADES.length;
                        setTrade(next);
                        document.getElementById(`tab-${TRADES[next].id}`)?.focus();
                      }
                    }}
                  >
                    {t.tab}
                  </button>
                ))}
              </div>
              <div id="trade-panel" role="tabpanel" aria-labelledby={`tab-${current.id}`} key={current.id} className={styles.tradePanel}>
                <h3>{current.title}</h3>
                <ul>{current.items.map(it => <li key={it}>{it}</li>)}</ul>
              </div>
            </div>
            <div className={styles.tradePhoto}>
              {TRADES.map((t, i) => (
                <img key={t.id} src={t.photo} alt={t.alt} loading="lazy" data-on={i === trade ? '' : undefined} />
              ))}
            </div>
          </div>
        </section>

        {/* ══ 05 · Tarifs ══ */}
        <section id="tarifs" data-page className={`${styles.section} ${styles.dark}`} data-active={isActive('tarifs') || !paged ? '' : undefined}>
          <div className={styles.container}>
            <div className={styles.plansHead}>
              <h2 className={styles.h2}>Des formules claires,<br /><span>pour chaque étape.</span></h2>
              <p className={styles.plansNote}>Prix mensuels en FCFA. Le budget publicitaire (Facebook, Instagram, TikTok) est réglé à part, directement par vous.</p>
            </div>
            <div className={styles.plans}>
              {PLANS.map(p => (
                <article key={p.id} className={styles.plan} data-featured={p.featured ? '' : undefined}>
                  <div className={styles.planTop}>
                    <h3>{p.name}</h3>
                    {p.featured && <span className={styles.planBadge}>Recommandée</span>}
                  </div>
                  <p className={styles.planPitch}>{p.pitch}</p>
                  <p className={styles.planPrice}><strong>{p.price}</strong> FCFA<span>/mois</span></p>
                  <ul>{p.items.map(it => <li key={it}>{it}</li>)}</ul>
                  <button
                    type="button"
                    className={p.featured ? styles.lightBtn : styles.outlineBtn}
                    onClick={() => openWhatsApp(`Bonjour Ozirus, la formule ${p.name} (${p.price} FCFA/mois) m'intéresse pour mon entreprise.`)}
                  >
                    Choisir {p.name} <ArrowUpRight size={16} />
                  </button>
                </article>
              ))}
            </div>
            <div className={styles.osBand}>
              <span className={styles.osIcon}><LayoutDashboard size={20} /></span>
              <span className={styles.osDeal}>-30 %</span>
              <p>
                <strong>Sur Ozirus OS, pour tous nos clients CDC.</strong> Notre logiciel pour tout suivre au même
                endroit : commandes, réservations, stock, clients et résultats de vos contenus.
              </p>
            </div>
          </div>
        </section>

        {/* ══ 06 · Méthode ══ */}
        <section id="methode" data-page className={`${styles.section} ${styles.dark}`} data-active={isActive('methode') || !paged ? '' : undefined}>
          <div className={styles.container}>
            <h2 className={styles.h2}>Pas seulement<br /><span>de belles images.</span></h2>
            <div className={styles.steps}>
              {STEPS.map(([n, title, body]) => (
                <article key={n} className={styles.step}>
                  <span className={styles.stepNum}>{n}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 07 · Contact ══ */}
        <section id="contact" data-page className={`${styles.section} ${styles.cta}`}>
          <div aria-hidden className={styles.grain} />
          <div className={`${styles.container} ${styles.ctaInner}`}>
            <h2 className={styles.ctaTitle}>Faites bouger<br />votre business.</h2>
            <p className={styles.ctaText}>
              Présentez-nous votre activité. On vous dit ce qu’il faut montrer, dire et construire ensuite.
            </p>
            <button type="button" className={styles.darkBtn} onClick={() => openWhatsApp()}>
              <MessageCircle size={17} /> Écrire sur WhatsApp
            </button>
          </div>
          <footer className={styles.footer}>
            <div className={`${styles.container} ${styles.footerInner}`}>
              <img src="/logo.png" alt="Ozirus" className={styles.footerLogo} />
              <span>Contenu · Stratégie · Croissance</span>
              <span>Douala · Yaoundé</span>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}
