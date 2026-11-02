'use client';

/**
 * Carrousel des secteurs (section « Secteurs » de la home) : une carte centrale, les voisines
 * en retrait de part et d'autre, flèches, points, glisser au doigt et recherche (loupe).
 * L'index choisi (dans CAROUSEL) est remonté au parent, qui adapte la démo Ozirus OS.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Search,
  X,
  Dumbbell,
  HardHat,
  Hotel,
  Landmark,
  PartyPopper,
  Pill,
  ShoppingCart,
  Tractor,
  Truck,
  Warehouse,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { SECTORS } from './osData';
import { CAROUSEL, carouselStory } from './sectorStory';

const INK = '#0A0A0A';

const EXTRA_ICONS: Record<string, LucideIcon> = {
  pharmacie: Pill,
  hotellerie: Hotel,
  logistique: Truck,
  agriculture: Tractor,
  btp: HardHat,
  garage: Wrench,
  sport: Dumbbell,
  evenementiel: PartyPopper,
  finance: Landmark,
  ecommerce: ShoppingCart,
  distribution: Warehouse,
};
const iconFor = (id: string): LucideIcon => EXTRA_ICONS[id] ?? SECTORS.find(s => s.id === id)!.icon;

// recherche insensible aux accents et à la casse
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default function SectorCarousel({
  index,
  onChange,
  onSeeTool,
}: {
  index: number;
  onChange: (i: number) => void;
  onSeeTool: () => void;
}) {
  const count = CAROUSEL.length;
  const go = (dir: 1 | -1) => onChange((index + dir + count) % count);

  return (
    <div
      className="ozh-car"
      role="region"
      aria-roledescription="carrousel"
      aria-label="Secteurs d’activité"
      tabIndex={0}
      onKeyDown={e => {
        if (e.target instanceof HTMLInputElement) return; // on tape dans la recherche
        if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      }}
    >
      <motion.div
        className="ozh-car-stage"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        dragSnapToOrigin
        onDragEnd={(_, info) => {
          if (info.offset.x < -60) go(1);
          else if (info.offset.x > 60) go(-1);
        }}
      >
        {CAROUSEL.map((c, i) => {
          // décalage circulaire : -1 = carte de gauche, 0 = centre, 1 = droite
          let offset = i - index;
          if (offset > count / 2) offset -= count;
          if (offset < -count / 2) offset += count;
          const visible = Math.abs(offset) <= 1;
          const center = offset === 0;
          const story = carouselStory(c.id);
          const Icon = iconFor(c.id);
          return (
            <motion.article
              key={c.id}
              className="ozh-car-card"
              aria-hidden={!center}
              initial={false}
              animate={{
                x: `${offset * 24}%`,
                scale: center ? 1 : 0.84,
                opacity: visible ? (center ? 1 : 0.55) : 0,
                filter: center ? 'blur(0px)' : 'blur(1.5px)',
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 32 }}
              style={{ zIndex: center ? 3 : visible ? 2 : 1, pointerEvents: center ? 'auto' : 'none' }}
              onClick={() => !center && onChange(i)}
            >
              <div className="ozh-car-visual" style={{ ['--glow' as string]: story.glow }}>
                {/* images chargées seulement pour la carte affichée et ses voisines */}
                {visible && (
                  <motion.img
                    src={story.image}
                    alt=""
                    loading="lazy"
                    draggable={false}
                    className="ozh-car-img"
                    initial={false}
                    animate={{ scale: center ? 1.04 : 1.12 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
              </div>

              <div className="ozh-car-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: INK }}>
                  <Icon size={16} strokeWidth={2} /> {story.kicker}
                </div>
                <h3 className="ozh-car-title">{story.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.55, color: '#525252', margin: 0 }}>{story.body}</p>
                <button onClick={onSeeTool} className="ozh-link" tabIndex={center ? 0 : -1}>
                  Voir l’outil pour ce secteur <span className="ozh-link-dot"><ArrowRight size={11} /></span>
                </button>
                <div className="ozh-car-stats">
                  {story.stats.map(st => (
                    <div key={st.l}>
                      <div style={{ fontSize: 'clamp(20px, 2.2vw, 26px)', fontWeight: 500, letterSpacing: '-0.03em', color: INK }}>{st.v}</div>
                      <div style={{ fontSize: 12, color: '#737373', marginTop: 2 }}>{st.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.article>
          );
        })}
      </motion.div>

      <button className="ozh-car-arrow ozh-car-prev" onClick={() => go(-1)} aria-label="Secteur précédent">
        <ArrowLeft size={16} />
      </button>
      <button className="ozh-car-arrow ozh-car-next" onClick={() => go(1)} aria-label="Secteur suivant">
        <ArrowRight size={16} />
      </button>

      <div className="ozh-car-foot">
        <div className="ozh-car-dots" role="tablist" aria-label="Choisir un secteur">
          {CAROUSEL.map((c, i) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={i === index}
              aria-label={carouselStory(c.id).kicker}
              onClick={() => onChange(i)}
              style={{
                width: i === index ? 28 : 6,
                background: i === index ? `linear-gradient(90deg, ${carouselStory(c.id).glow}, #7967FF)` : '#D4D4D4',
              }}
            />
          ))}
        </div>
        <SectorSearch onPick={onChange} />
      </div>
    </div>
  );
}

/** Loupe : ouvre un champ de recherche et la liste filtrée des secteurs. */
function SectorSearch({ onPick }: { onPick: (i: number) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const n = norm(q.trim());
    return CAROUSEL.map((c, i) => ({ i, id: c.id, label: carouselStory(c.id).kicker })).filter(r => !n || norm(r.label).includes(n));
  }, [q]);

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const onDown = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const pick = (i: number) => { onPick(i); setOpen(false); setQ(''); };

  return (
    <div ref={box} className="ozh-car-search">
      <button className="ozh-car-search-btn" onClick={() => setOpen(o => !o)} aria-label="Rechercher votre secteur" aria-expanded={open}>
        {open ? <X size={15} /> : <Search size={15} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="ozh-car-search-pop"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            data-free-scroll
          >
            <div className="ozh-car-search-field">
              <Search size={15} color="#A1A1AA" />
              <input
                ref={input}
                value={q}
                onChange={e => setQ(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Escape') setOpen(false);
                  if (e.key === 'Enter' && results[0]) pick(results[0].i);
                }}
                placeholder="Rechercher votre secteur…"
                aria-label="Rechercher votre secteur"
              />
            </div>
            <ul role="listbox">
              {results.length === 0 && <li className="ozh-car-search-empty">Aucun secteur trouvé. Parlons-en quand même !</li>}
              {results.map(r => {
                const Icon = iconFor(r.id);
                return (
                  <li key={r.id}>
                    <button onClick={() => pick(r.i)}>
                      <Icon size={15} /> {r.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
