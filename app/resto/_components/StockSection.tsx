import {
  AlertTriangle,
  BellRing,
  Brain,
  CheckCircle2,
  History,
  Send,
  Truck,
} from "lucide-react";

const BENEFITS = [
  {
    icon: CheckCircle2,
    title: "Décompté à chaque commande",
    body: "Un Poulet DG commandé sur WhatsApp retire poulet et plantain du stock. Sans saisie.",
  },
  {
    icon: BellRing,
    title: "Alerte avant la rupture",
    body: "Un seuil par ingrédient : vous êtes prévenu quand il baisse, pas quand le client attend.",
  },
  {
    icon: Brain,
    title: "Commande fournisseur suggérée",
    body: "L'IA prépare la commande selon vos ventes, la météo et les jours fériés. Vous validez, elle part.",
  },
  {
    icon: History,
    title: "Chaque mouvement tracé",
    body: "Entrées, sorties, écarts d'inventaire : qui a fait quoi, et quand.",
  },
];

export function StockSection() {
  return (
    <section id="stock" className="scroll-mt-[66px] px-6 py-20 sm:py-24">
      <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12">
        <div>
          <span className="inline-flex rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
            Gestion de stock
          </span>
          <h2 className="mt-4 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-tight tracking-tight text-text">
            Votre stock se met à jour tout seul, à chaque commande.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-text-2">
            Fini l&apos;inventaire au cahier le soir. Ingrédients, fournisseurs et mouvements sont suivis au même
            endroit que vos commandes.
          </p>

          <ul className="mt-7 flex flex-col gap-4">
            {BENEFITS.map((benefit) => (
              <li key={benefit.title} className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-primary-light">
                  <benefit.icon className="h-[18px] w-[18px] text-primary" strokeWidth={2} />
                </div>
                <div>
                  <p className="font-display text-base font-semibold text-text">{benefit.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-text-2">{benefit.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <StockFlowAnimation />
      </div>
    </section>
  );
}

const STOCK_FLOW = [
  { icon: CheckCircle2, title: "Commande reçue", body: "Poulet DG · 2 portions", tone: "text-primary", delay: "0s" },
  { icon: History, title: "Stock actualisé", body: "Plantain mûr · −3 kg", tone: "text-amber-600", delay: "0.7s" },
  { icon: AlertTriangle, title: "Alerte déclenchée", body: "Huile de palme · seuil bas", tone: "text-red-600", delay: "1.4s" },
  { icon: Truck, title: "Commande suggérée par l’IA", body: "20 L chez Huilerie du Littoral", tone: "text-primary", delay: "2.1s" },
];

function StockFlowAnimation() {
  return (
    <div className="relative mx-auto w-full max-w-[520px] rounded-2xl border-[1.5px] border-border bg-bg-2 p-5 shadow-[0_20px_48px_rgba(10,10,15,0.08)] sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-text">Le stock suit le service</p>
          <p className="mt-1 text-xs text-text-3">Chaque action déclenche la suivante.</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-[#d6f8e4] px-2.5 py-1 text-[11px] font-semibold text-[#159447]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#159447]" />
          En direct
        </span>
      </div>

      <div className="relative space-y-3 pl-5 before:absolute before:bottom-6 before:left-[9px] before:top-6 before:w-px before:bg-primary/20">
        {STOCK_FLOW.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.title}
              className="hero-step relative flex items-center gap-3 rounded-xl border border-border bg-white px-3 py-3 shadow-[0_8px_24px_rgba(10,10,15,0.05)]"
              style={{ animationDelay: step.delay }}
            >
              <div className="absolute -left-[25px] flex h-[19px] w-[19px] items-center justify-center rounded-full border-4 border-bg-2 bg-primary" />
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-primary-light">
                <Icon className={`h-4 w-4 ${step.tone}`} strokeWidth={2.25} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-text">{step.title}</p>
                <p className="mt-0.5 truncate text-xs text-text-2">{step.body}</p>
              </div>
              <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-primary" strokeWidth={2.25} />
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-primary px-4 py-3 text-white">
        <div>
          <p className="text-xs font-semibold">Résultat</p>
          <p className="mt-0.5 text-[11px] text-white/75">Aucune rupture pendant le service.</p>
        </div>
        <Brain className="h-5 w-5 text-white/80" strokeWidth={2} />
      </div>
    </div>
  );
}
