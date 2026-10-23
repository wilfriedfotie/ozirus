'use client';

import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';
import { ADMIN, inputStyle } from '@/lib/adminUi';

// Liste déroulante maison, à utiliser à la place du <select> natif (rendu système, non stylable).
// Le déclencheur reprend `inputStyle` du backoffice ; la liste est rendue dans un portal en
// position fixe pour ne pas être rognée par un conteneur qui scrolle (modale, panneau admin).

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  /** Couleur d'accent (focus, option choisie). Violet du backoffice par défaut. */
  accent?: string;
  style?: React.CSSProperties;
  'aria-labelledby'?: string;
}

const MAX_LIST_HEIGHT = 264;
const MIN_LIST_WIDTH = 160;
const GAP = 6;
// Comparaison insensible aux accents et à la casse (« sen » → « Sénégal »).
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function Select({ options, value, onChange, id, placeholder = 'Sélectionner…', invalid, disabled, accent = ADMIN.primary, style, ...aria }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState(false);
  const [pos, setPos] = useState<{ left: number; width: number; top?: number; bottom?: number; maxHeight: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: '', at: 0 });
  const listId = useId();

  const selectedIndex = options.findIndex(o => o.value === value);
  const selected = options[selectedIndex];

  const place = () => {
    const r = triggerRef.current?.getBoundingClientRect();
    if (!r) return;
    const below = window.innerHeight - r.bottom - GAP - 8;
    const above = r.top - GAP - 8;
    // On ouvre vers le haut seulement s'il manque de place en bas et qu'il y en a plus en haut.
    const up = below < Math.min(MAX_LIST_HEIGHT, 160) && above > below;
    // Un déclencheur étroit (ex. nombre de personnes) garde une liste lisible, sans sortir de l'écran.
    const width = Math.max(r.width, MIN_LIST_WIDTH);
    const left = Math.max(8, Math.min(r.left, window.innerWidth - width - 8));
    setPos(up
      ? { left, width, bottom: window.innerHeight - r.top + GAP, maxHeight: Math.min(MAX_LIST_HEIGHT, above) }
      : { left, width, top: r.bottom + GAP, maxHeight: Math.min(MAX_LIST_HEIGHT, below) });
  };

  const openList = () => {
    if (disabled) return;
    setActive(selectedIndex >= 0 ? selectedIndex : 0);
    place();
    setOpen(true);
  };
  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  };
  const choose = (i: number) => {
    const o = options[i];
    if (!o) return;
    onChange(o.value);
    close();
  };

  // Suit le déclencheur si la page ou la modale scrolle pendant que la liste est ouverte.
  useLayoutEffect(() => {
    if (!open) return;
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!triggerRef.current?.contains(t) && !listRef.current?.contains(t)) close(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  const typeAhead = (key: string) => {
    const now = Date.now();
    typed.current = { text: now - typed.current.at < 600 ? typed.current.text + key : key, at: now };
    const q = norm(typed.current.text);
    const i = options.findIndex(o => norm(o.label).startsWith(q));
    if (i < 0) return;
    if (open) setActive(i);
    else onChange(options[i].value);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = options.length - 1;
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        e.preventDefault();
        if (!open) return openList();
        const step = e.key === 'ArrowDown' ? 1 : -1;
        setActive(a => Math.min(last, Math.max(0, a + step)));
        return;
      }
      case 'Home':
      case 'End':
        if (!open) return;
        e.preventDefault();
        setActive(e.key === 'Home' ? 0 : last);
        return;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (open) choose(active);
        else openList();
        return;
      case 'Escape':
        if (!open) return;
        // Ferme la liste sans fermer la modale qui la contient.
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        close();
        return;
      case 'Tab':
        if (open) close(false);
        return;
      default:
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) typeAhead(e.key);
    }
  };

  const borderColor = invalid ? '#E5132B' : open || focused ? accent : ADMIN.border;
  // Les options suivent la taille du champ (13px par défaut, comme les champs admin).
  const optionSize = typeof style?.fontSize === 'number' ? style.fontSize : 13;

  return (
    <>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        aria-invalid={invalid || undefined}
        aria-labelledby={aria['aria-labelledby']}
        disabled={disabled}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputStyle,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
          textAlign: 'left', fontFamily: 'inherit', color: selected ? ADMIN.ink : ADMIN.faint,
          cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
          borderColor, boxShadow: open || focused ? `0 0 0 3px ${accent}1F` : 'none',
          transition: 'border-color .15s, box-shadow .15s',
          ...style,
          // Le texte d'invite reste grisé même si `style` impose une couleur de texte.
          ...(selected ? null : { color: ADMIN.faint }),
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selected ? selected.label : placeholder}</span>
        <ChevronDown size={16} color={open ? accent : ADMIN.faint} style={{ flexShrink: 0, transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>

      {open && pos && createPortal(
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-labelledby={aria['aria-labelledby']}
          style={{
            position: 'fixed', zIndex: 1000, left: pos.left, width: pos.width, top: pos.top, bottom: pos.bottom, maxHeight: pos.maxHeight,
            overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: `${ADMIN.border} transparent`,
            margin: 0, padding: 4, listStyle: 'none', background: '#FFF',
            border: `1px solid ${ADMIN.border}`, borderRadius: 12, boxShadow: '0 16px 40px -12px rgba(15,23,42,0.22)',
            fontFamily: 'var(--font-sans-loaded), DM Sans, sans-serif',
          }}
        >
          {options.map((o, i) => {
            const isSelected = o.value === value;
            const isActive = i === active;
            return (
              <li
                key={o.value}
                id={`${listId}-${i}`}
                data-index={i}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActive(i)}
                onMouseDown={e => e.preventDefault()}
                onClick={() => choose(i)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                  padding: optionSize > 14 ? '11px 14px' : '9px 12px', borderRadius: 8, cursor: 'pointer',
                  background: isActive ? ADMIN.surface : 'transparent',
                }}
              >
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: optionSize, fontWeight: isSelected ? 700 : 500, color: isSelected ? accent : ADMIN.ink }}>{o.label}</span>
                  {o.description && <span style={{ display: 'block', fontSize: optionSize - 1.5, color: ADMIN.faint, marginTop: 1 }}>{o.description}</span>}
                </span>
                {isSelected && <Check size={15} color={accent} strokeWidth={2.5} style={{ flexShrink: 0 }} />}
              </li>
            );
          })}
        </ul>,
        document.body,
      )}
    </>
  );
}
