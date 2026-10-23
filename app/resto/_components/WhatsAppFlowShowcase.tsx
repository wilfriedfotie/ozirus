"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Bike,
  Check,
  CheckCheck,
  ChefHat,
  CreditCard,
  MapPin,
  MoreVertical,
  Paperclip,
  Plus,
  Search,
  Send,
  ShoppingCart,
  Signal,
  Utensils,
  Wifi,
} from "lucide-react";
import { cn } from "@/app/resto/_lib/cn";
import { DEMO_ONBOARDING_DATA } from "@/app/resto/_lib/demo-data";
import { formatCurrency } from "@/app/resto/_lib/format";

const RESTO_NAME = DEMO_ONBOARDING_DATA.restaurantName;

const DRAG_THRESHOLD_PX = 6;

function useDragScroll<T extends HTMLElement>(externalRef?: React.RefObject<T | null>) {
  const ownRef = useRef<T>(null);
  const ref = externalRef ?? ownRef;
  const state = useRef({ active: false, dragging: false, startY: 0, startScrollTop: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function onWheel(e: WheelEvent) {
      e.stopPropagation();
    }

    function onPointerDown(e: PointerEvent) {
      if (!el || e.button !== 0) return;
      state.current = { active: true, dragging: false, startY: e.clientY, startScrollTop: el.scrollTop };
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    }

    function onPointerMove(e: PointerEvent) {
      if (!el || !state.current.active) return;
      const delta = e.clientY - state.current.startY;
      if (!state.current.dragging && Math.abs(delta) > DRAG_THRESHOLD_PX) {
        state.current.dragging = true;
      }
      if (state.current.dragging) {
        el.scrollTop = state.current.startScrollTop - delta;
      }
    }

    function onPointerUp() {
      state.current.active = false;
      state.current.dragging = false;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    }

    el.addEventListener("wheel", onWheel, { passive: true });
    el.addEventListener("pointerdown", onPointerDown);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [ref]);

  return ref;
}

const DRINK_KEYWORDS = ["jus", "boisson", "soda", "eau"];

function categoryFor(name: string): "Boissons" | "Plats" {
  const lower = name.toLowerCase();
  return DRINK_KEYWORDS.some((kw) => lower.includes(kw)) ? "Boissons" : "Plats";
}

const DISHES = DEMO_ONBOARDING_DATA.dishes.map((dish) => ({ ...dish, category: categoryFor(dish.name) }));
const CATEGORY_ORDER = ["Plats", "Boissons"] as const;

type AutoStep = {
  kind: "auto";
  from: "client" | "resto";
  bubble: { kind: "text"; text: string; read?: boolean } | { kind: "action"; icon: typeof CreditCard; title: string; subtitle: string };
  time: string;
};

type CatalogStep = { kind: "catalog"; time: string };
type PromptStep = { kind: "prompt"; suggestion: string; time: string };
type LocationStep = { kind: "location"; address: string; time: string };

type Step = AutoStep | CatalogStep | PromptStep | LocationStep;

type Scenario = {
  id: string;
  label: string;
  steps: Step[];
};

function auto(from: "client" | "resto", text: string, time: string, read?: boolean): AutoStep {
  return { kind: "auto", from, bubble: { kind: "text", text, read }, time };
}

function action(icon: typeof CreditCard, title: string, subtitle: string, time: string): AutoStep {
  return { kind: "auto", from: "resto", bubble: { kind: "action", icon, title, subtitle }, time };
}

const SCENARIOS: Scenario[] = [
  {
    id: "livraison",
    label: "Commande à livrer",
    steps: [
      auto("resto", "Bonsoir ! Voici notre catalogue, servez-vous 👇", "20:11"),
      { kind: "catalog", time: "20:12" },
      auto("resto", "Parfait 👍 Vous préférez récupérer sur place ou vous faire livrer ?", "20:12"),
      { kind: "prompt", suggestion: "À livrer, s'il vous plaît 🛵", time: "20:12" },
      { kind: "location", address: "Rue des Jardins, Cocody, près de la pharmacie", time: "20:13" },
      action(MapPin, "Adresse enregistrée", "Livraison estimée 25-30 min", "20:13"),
      auto("resto", "Total : 8 000 FCFA + 500 FCFA de livraison. Voici le lien de paiement 👇", "20:13"),
      action(CreditCard, "Paiement Mobile Money", "8 500 FCFA · Orange Money", "20:13"),
      auto("client", "Paiement envoyé ✅", "20:14", true),
      auto("resto", "Merci ! Paiement confirmé 🎉 On s'occupe de vous", "20:14"),
      action(ChefHat, "Commande envoyée en cuisine", "Préparation en cours", "20:14"),
      auto("resto", "Votre commande est en préparation 👨‍🍳", "20:18"),
      action(Bike, "Livreur en route", "Arrivée estimée dans 12 min", "20:32"),
      auto("resto", "Bon appétit 🍗 Merci pour votre commande !", "20:45"),
    ],
  },
  {
    id: "sur-place",
    label: "Commande sur place",
    steps: [
      auto("resto", "Bonsoir ! Bien sûr, voici la carte du midi 👇", "12:32"),
      { kind: "catalog", time: "12:33" },
      auto("resto", "Top ! Vous êtes sur place ou à emporter ?", "12:33"),
      { kind: "prompt", suggestion: "Sur place, s'il vous plaît", time: "12:33" },
      { kind: "prompt", suggestion: "On est à la table 6", time: "12:33" },
      action(Utensils, "Table 6 confirmée", "Service à table activé", "12:34"),
      auto("resto", "Total : 8 000 FCFA. Vous pouvez régler maintenant ou après le repas 👇", "12:34"),
      action(CreditCard, "Paiement Mobile Money", "8 000 FCFA · Wave", "12:34"),
      auto("client", "Paiement envoyé ✅", "12:35", true),
      auto("resto", "Paiement confirmé 🎉 Merci !", "12:35"),
      action(ChefHat, "Commande envoyée en cuisine", "Prête dans ~15 min", "12:35"),
      auto("resto", "Votre plat arrive à table dans quelques minutes 🍽️", "12:47"),
      auto("resto", "Bon appétit ! Dites-nous si tout va bien 😊", "12:50"),
    ],
  },
];

type CommittedStep = { step: Step; text?: string };

const TYPING_MS_BASE = 700;
const AUTO_FIRST_DELAY_MS = 500;

export function WhatsAppFlowShowcase() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [committed, setCommitted] = useState<CommittedStep[]>([]);
  const [typing, setTyping] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const [inputValue, setInputValue] = useState(() => {
    const first = SCENARIOS[0].steps[0];
    return first?.kind === "prompt" ? first.suggestion : "";
  });

  const scenario = SCENARIOS[scenarioIndex];
  const currentStep: Step | undefined = scenario.steps[stepIndex];
  const isFinished = stepIndex >= scenario.steps.length;

  function resetAll(index: number) {
    const firstStep = SCENARIOS[index].steps[0];
    setScenarioIndex(index);
    setStepIndex(0);
    setCommitted([]);
    setTyping(false);
    setShowCatalog(false);
    setInputValue(firstStep?.kind === "prompt" ? firstStep.suggestion : "");
  }

  function commitCurrentStep(text?: string) {
    if (!currentStep) return;
    setCommitted((prev) => [...prev, { step: currentStep, text }]);

    const nextStep = scenario.steps[stepIndex + 1];
    setInputValue(nextStep?.kind === "prompt" ? nextStep.suggestion : "");
    setStepIndex((i) => i + 1);
  }

  // Auto-play "resto"/"client-auto" steps; interactive steps (catalog/prompt) wait for the visitor.
  useEffect(() => {
    if (!currentStep || currentStep.kind !== "auto" || typing || showCatalog) return;

    const delay = stepIndex === 0 ? AUTO_FIRST_DELAY_MS : 500;
    const timeout = setTimeout(() => setTyping(true), delay);
    return () => clearTimeout(timeout);
  }, [currentStep, stepIndex, typing, showCatalog]);

  useEffect(() => {
    if (!typing || !currentStep || currentStep.kind !== "auto") return;

    const length = currentStep.bubble.kind === "text" ? currentStep.bubble.text.length : 24;
    const duration = Math.min(1800, TYPING_MS_BASE + length * 16);

    const timeout = setTimeout(() => {
      setTyping(false);
      commitCurrentStep();
    }, duration);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typing, currentStep]);

  function handleSend() {
    if (!currentStep || currentStep.kind !== "prompt") return;
    const text = inputValue.trim();
    if (!text) return;
    commitCurrentStep(text);
  }

  function handleCatalogConfirm(summary: string) {
    commitCurrentStep(summary);
    setShowCatalog(false);
  }

  function handleShareLocation() {
    if (!currentStep || currentStep.kind !== "location") return;
    commitCurrentStep();
  }

  const awaitingCatalog = currentStep?.kind === "catalog" && !showCatalog;
  const awaitingFreeText = currentStep?.kind === "prompt" && !typing;
  const awaitingLocation = currentStep?.kind === "location" && !typing;

  return (
    <div className="relative">
      <div className="mb-3 flex items-center justify-center gap-2 pt-2">
        {SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => resetAll(i)}
            aria-pressed={i === scenarioIndex}
            className={cn(
              "rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors",
              i === scenarioIndex ? "bg-primary-light text-primary-dark" : "text-text-3 hover:bg-bg-2 hover:text-text-2",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mx-auto w-full max-w-[300px]">
        <PhoneFrame
          committed={committed}
          typing={typing}
          showCatalog={showCatalog}
          awaitingCatalog={awaitingCatalog}
          awaitingFreeText={awaitingFreeText}
          awaitingLocation={awaitingLocation}
          isFinished={isFinished}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSend={handleSend}
          onOpenCatalog={() => setShowCatalog(true)}
          onCatalogConfirm={handleCatalogConfirm}
          onCatalogCancel={() => setShowCatalog(false)}
          onShareLocation={handleShareLocation}
        />
      </div>
    </div>
  );
}

function PhoneFrame({
  committed,
  typing,
  showCatalog,
  awaitingCatalog,
  awaitingFreeText,
  awaitingLocation,
  isFinished,
  inputValue,
  onInputChange,
  onSend,
  onOpenCatalog,
  onCatalogConfirm,
  onCatalogCancel,
  onShareLocation,
}: {
  committed: CommittedStep[];
  typing: boolean;
  showCatalog: boolean;
  awaitingCatalog: boolean;
  awaitingFreeText: boolean;
  awaitingLocation: boolean;
  isFinished: boolean;
  inputValue: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
  onOpenCatalog: () => void;
  onCatalogConfirm: (summary: string) => void;
  onCatalogCancel: () => void;
  onShareLocation: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useDragScroll(scrollRef);
  const stickToBottomRef = useRef(true);

  useEffect(() => {
    if (showCatalog || !stickToBottomRef.current) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [committed.length, typing, showCatalog]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    stickToBottomRef.current = distanceFromBottom < 24;
  }

  return (
    <div className="relative mx-auto">
      {/* side buttons */}
      <div aria-hidden className="absolute -left-[3px] top-[108px] h-6 w-[3px] rounded-l-sm bg-[#3a3a3f]" />
      <div aria-hidden className="absolute -left-[3px] top-[144px] h-10 w-[3px] rounded-l-sm bg-[#3a3a3f]" />
      <div aria-hidden className="absolute -left-[3px] top-[188px] h-10 w-[3px] rounded-l-sm bg-[#3a3a3f]" />
      <div aria-hidden className="absolute -right-[3px] top-[150px] h-14 w-[3px] rounded-r-sm bg-[#3a3a3f]" />

      <div className="relative rounded-[3rem] bg-gradient-to-b from-[#2c2c30] to-[#0d0d0f] p-[3px] shadow-[0_40px_90px_rgba(10,10,15,0.35)]">
        <div className="rounded-[2.9rem] bg-black p-2">
          <div className="relative h-[600px] w-[280px] overflow-hidden rounded-[2.4rem] bg-[#e5ddd5]">
            {/* status bar */}
            <div className="absolute inset-x-0 top-0 z-30 flex h-11 items-center justify-between px-6 pt-1.5">
              <span className="text-[13px] font-semibold text-white">20:14</span>
              <div className="flex items-center gap-1.5">
                <Signal className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                <Wifi className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                <div className="h-3 w-6 rounded-[3px] border border-white/80 p-[1.5px]">
                  <div className="h-full w-4/5 rounded-[1px] bg-white" />
                </div>
              </div>
            </div>
            {/* dynamic island */}
            <div className="absolute left-1/2 top-2 z-40 h-[22px] w-[92px] -translate-x-1/2 rounded-full bg-black" />

            {showCatalog ? (
              <CatalogScreen onConfirm={onCatalogConfirm} onCancel={onCatalogCancel} />
            ) : (
              <div className="relative flex h-full flex-col">
                <div className="flex items-center gap-2.5 bg-[#075e54] px-3 pb-2.5 pt-11 text-white">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-[12px] font-semibold">
                    {RESTO_NAME.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold leading-tight">{RESTO_NAME}</p>
                    <p className="text-[10px] leading-tight text-white/70">{typing ? "en train d'écrire…" : "en ligne"}</p>
                  </div>
                </div>

                <div
                  ref={scrollRef}
                  onScroll={handleScroll}
                  className="flex-1 space-y-2 overflow-y-auto overscroll-contain px-2.5 py-3 pb-4 [-webkit-overflow-scrolling:touch]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 20% 20%, rgba(0,0,0,0.03) 0%, transparent 8%), radial-gradient(circle at 80% 60%, rgba(0,0,0,0.03) 0%, transparent 8%)",
                    touchAction: "pan-y",
                  }}
                >
                  {committed.map((item, idx) => (
                    <CommittedBubble key={idx} item={item} />
                  ))}
                  {awaitingCatalog && (
                    <div className="flex animate-fade-in justify-start">
                      <button
                        type="button"
                        onClick={onOpenCatalog}
                        className="flex max-w-[85%] items-center gap-2.5 rounded-lg rounded-tl-none bg-white p-2.5 text-left shadow-sm transition hover:bg-bg-2"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                          <ShoppingCart className="h-4 w-4" strokeWidth={2.25} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[11px] font-semibold text-text">Toucher pour voir le catalogue</p>
                          <p className="truncate text-[10px] text-text-2">
                            {RESTO_NAME} · {DISHES.length} plats
                          </p>
                        </div>
                      </button>
                    </div>
                  )}
                  {typing && (
                    <div className="flex animate-fade-in justify-start">
                      <div className="flex items-center gap-1 rounded-lg rounded-tl-none bg-white px-3 py-2 shadow-sm">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-3 [animation-delay:-0.2s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-3 [animation-delay:-0.1s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-3" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-[#f0f0f0] pb-7">
                  {awaitingLocation ? (
                    <div className="px-2 py-2">
                      <button
                        type="button"
                        onClick={onShareLocation}
                        className="flex w-full animate-fade-in items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-[12px] font-semibold text-white shadow-[0_10px_28px_rgba(121,103,255,0.35)] transition hover:bg-primary-dark"
                      >
                        <MapPin className="h-3.5 w-3.5" strokeWidth={2.5} />
                        Partager ma position
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2 py-2">
                      <Plus className="h-4.5 w-4.5 shrink-0 text-text-3" strokeWidth={2} />
                      {awaitingFreeText ? (
                        <input
                          value={inputValue}
                          onChange={(e) => onInputChange(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") onSend();
                          }}
                          placeholder="Message"
                          className="min-w-0 flex-1 rounded-full bg-white px-3 py-2 text-[11px] text-text outline-none"
                        />
                      ) : (
                        <div className="min-w-0 flex-1 rounded-full bg-white px-3 py-2 text-[11px] text-text-3">
                          {awaitingCatalog ? "Ouvrez le catalogue ci-dessus 👆" : isFinished ? "Conversation terminée" : "Message"}
                        </div>
                      )}
                      {awaitingFreeText ? (
                        <button
                          type="button"
                          onClick={onSend}
                          disabled={!inputValue.trim()}
                          aria-label="Envoyer"
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-white transition disabled:opacity-40"
                        >
                          <Send className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </button>
                      ) : (
                        <>
                          <Paperclip className="h-4 w-4 shrink-0 text-text-3" strokeWidth={2} />
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#25d366]/50 text-white">
                            <Send className="h-3.5 w-3.5" strokeWidth={2.5} />
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* home indicator */}
            <div className="absolute inset-x-0 bottom-1.5 z-30 flex justify-center">
              <div className="h-1 w-32 rounded-full bg-black/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CatalogScreen({
  onConfirm,
  onCancel,
}: {
  onConfirm: (summary: string) => void;
  onCancel: () => void;
}) {
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState<"Tous" | (typeof CATEGORY_ORDER)[number]>("Tous");
  const scrollRef = useDragScroll<HTMLDivElement>();

  function toggle(id: string) {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = 1;
      }
      return next;
    });
  }

  const selectedIds = Object.keys(selected);
  const count = selectedIds.reduce((sum, id) => sum + selected[id], 0);
  const total = selectedIds.reduce((sum, id) => {
    const dish = DISHES.find((d) => d.id === id);
    return sum + (dish ? Number(dish.price) * selected[id] : 0);
  }, 0);

  function confirm() {
    const summary = selectedIds
      .map((id) => {
        const dish = DISHES.find((d) => d.id === id);
        const qty = selected[id];
        return dish ? `${qty} ${dish.name}` : "";
      })
      .filter(Boolean)
      .join(" + ");
    onConfirm(summary || "Ma commande");
  }

  return (
    <div className="flex h-full animate-fade-in flex-col overflow-hidden bg-white">
      <div className="flex items-center gap-3 bg-[#075e54] px-3 pb-2.5 pt-11 text-white">
        <button type="button" onClick={onCancel} aria-label="Retour">
          <ArrowLeft className="h-4.5 w-4.5" strokeWidth={2.25} />
        </button>
        <p className="flex-1 text-[15px] font-semibold">Catalogue</p>
        <Search className="h-4 w-4" strokeWidth={2.25} />
        <ShoppingCart className="h-4 w-4" strokeWidth={2.25} />
        <MoreVertical className="h-4 w-4" strokeWidth={2.25} />
      </div>

      <div
        ref={scrollRef}
        className="flex-1 cursor-grab overflow-y-auto overscroll-contain pb-16 active:cursor-grabbing [-webkit-overflow-scrolling:touch]"
        style={{ touchAction: "pan-y" }}
      >
        <div className="relative aspect-[16/9] w-full">
          <Image
            src="https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=225&fit=crop&q=80"
            alt={RESTO_NAME}
            fill
            sizes="280px"
            className="object-cover"
          />
        </div>
        <div className="px-3 py-2.5">
          <p className="text-[13px] font-bold text-text">{RESTO_NAME} ›</p>
          <p className="mt-0.5 text-[10px] leading-snug text-text-2">
            Cuisine maison, commandée sur WhatsApp. Touchez un plat pour l&apos;ajouter à votre commande.
          </p>
        </div>

        <div className="flex items-center gap-2 border-y border-border-soft bg-bg-2 px-3 py-2">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={2.25} />
          <div className="min-w-0">
            <p className="truncate text-[10.5px] font-medium text-text">
              {DEMO_ONBOARDING_DATA.city}, {DEMO_ONBOARDING_DATA.address}
            </p>
            <p className="text-[9px] text-text-3">Toucher pour changer l&apos;adresse</p>
          </div>
        </div>

        <div className="px-3 pt-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[12.5px] font-bold text-text">Notre carte</p>
            <p className="text-[10px] font-semibold text-primary">{DISHES.length} articles</p>
          </div>
          <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1">
            {(["Tous", ...CATEGORY_ORDER] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-[10.5px] font-semibold transition",
                  activeCategory === cat ? "bg-primary text-white" : "bg-bg-2 text-text-2",
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="px-3 pb-4 pt-2">
          {CATEGORY_ORDER.filter((cat) => activeCategory === "Tous" || activeCategory === cat).map((cat) => {
            const dishesInCategory = DISHES.filter((d) => d.category === cat);
            if (dishesInCategory.length === 0) return null;
            return (
              <div key={cat} className="mb-3 last:mb-0">
                <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-wide text-text-3">{cat}</p>
                <div className="space-y-2.5">
                  {dishesInCategory.map((dish) => {
                    const isSelected = Boolean(selected[dish.id]);
                    return (
                      <button
                        key={dish.id}
                        type="button"
                        onClick={() => toggle(dish.id)}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left transition",
                          isSelected ? "bg-primary-light" : "hover:bg-bg-2",
                        )}
                      >
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-bg-2">
                          {dish.imageUrl && (
                            <Image src={dish.imageUrl} alt={dish.name} fill sizes="48px" className="object-cover" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[11px] font-medium text-text">{dish.name}</p>
                          <span className="text-[10.5px] font-semibold text-text">{formatCurrency(Number(dish.price))}</span>
                        </div>
                        <div
                          className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition",
                            isSelected ? "border-primary bg-primary text-white" : "border-border text-primary",
                          )}
                        >
                          {isSelected ? (
                            <Check className="h-3.5 w-3.5" strokeWidth={3} />
                          ) : (
                            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {count > 0 && (
        <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center px-3">
          <button
            type="button"
            onClick={confirm}
            className="flex w-full animate-fade-in items-center justify-between gap-2 rounded-full bg-primary px-4 py-2.5 text-[12px] font-semibold text-white shadow-[0_10px_28px_rgba(121,103,255,0.4)] transition hover:bg-primary-dark"
          >
            <span>
              Voir le panier ({count}) → {formatCurrency(total)}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

function CommittedBubble({ item }: { item: CommittedStep }) {
  const { step, text } = item;

  if (step.kind === "catalog") {
    return <ChatBubble from="client" time={step.time} text={text ?? "Ma commande"} read />;
  }

  if (step.kind === "prompt") {
    return <ChatBubble from="client" time={step.time} text={text ?? step.suggestion} read />;
  }

  if (step.kind === "location") {
    return <LocationBubble address={step.address} time={step.time} />;
  }

  if (step.bubble.kind === "action") {
    return (
      <ChatBubble
        from={step.from}
        time={step.time}
        action={{ icon: step.bubble.icon, title: step.bubble.title, subtitle: step.bubble.subtitle }}
      />
    );
  }

  return <ChatBubble from={step.from} time={step.time} text={step.bubble.text} read={step.bubble.read} />;
}

function LocationBubble({ address, time }: { address: string; time: string }) {
  return (
    <div className="flex animate-fade-in justify-end">
      <div className="max-w-[85%] overflow-hidden rounded-lg rounded-tr-none bg-[#dcf8c6] shadow-sm">
        <div
          className="relative aspect-[4/3] w-full overflow-hidden bg-[#e8ecef]"
          style={{
            backgroundImage:
              "linear-gradient(#c9d3d8 1px, transparent 1px), linear-gradient(90deg, #c9d3d8 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#dce4e8]/60 to-transparent" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
            <MapPin className="h-6 w-6 fill-[#ff3b30] text-[#ff3b30] drop-shadow-sm" strokeWidth={1.5} />
          </div>
        </div>
        <div className="px-2.5 py-1.5">
          <p className="text-[11px] font-semibold text-text">📍 Position partagée</p>
          <p className="mt-0.5 text-[10px] leading-snug text-text-2">{address}</p>
          <div className="mt-0.5 flex items-center justify-end gap-1">
            <span className="text-[9px] text-text-3">{time}</span>
            <CheckCheck className="h-3 w-3 text-[#53bdeb]" strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({
  from,
  time,
  text,
  read,
  action,
}: {
  from: "client" | "resto";
  time: string;
  text?: string;
  read?: boolean;
  action?: { icon: typeof CreditCard; title: string; subtitle: string };
}) {
  const isClient = from === "client";

  return (
    <div className={cn("flex animate-fade-in", isClient ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-2.5 py-1.5 text-[11.5px] leading-snug shadow-sm",
          isClient ? "rounded-tr-none bg-[#dcf8c6]" : "rounded-tl-none bg-white",
        )}
      >
        {action ? (
          <div className="flex items-center gap-2 py-0.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
              <action.icon className="h-4 w-4" strokeWidth={2.25} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold text-text">{action.title}</p>
              <p className="truncate text-[10px] text-text-2">{action.subtitle}</p>
            </div>
          </div>
        ) : (
          <p className="text-text">{text}</p>
        )}
        <div className="mt-0.5 flex items-center justify-end gap-1">
          <span className="text-[9px] text-text-3">{time}</span>
          {isClient && read !== undefined && (
            <CheckCheck className={cn("h-3 w-3", read ? "text-[#53bdeb]" : "text-text-3")} strokeWidth={2.5} />
          )}
        </div>
      </div>
    </div>
  );
}
