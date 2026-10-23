import { AlertCircle, Brain, CheckCircle2, ChefHat, CreditCard, FileText, MessageCircle, PackageCheck, QrCode, ReceiptText, Send, Smartphone } from "lucide-react";
import { RestoAvatar } from "@/app/resto/_components/RestoAvatar";

const DEMO_STEPS = [
  { icon: MessageCircle, label: "Commande WhatsApp", value: "12:04" },
  { icon: ReceiptText, label: "Paiement confirmé", value: "12:05" },
  { icon: PackageCheck, label: "Cuisine notifiée", value: "12:06" },
];

const PROCESS_STEPS = [
  { label: "Scan QR", icon: QrCode, delay: "0s" },
  { label: "Commande", icon: Smartphone, delay: "0.7s" },
  { label: "Paiement", icon: CreditCard, delay: "1.4s" },
  { label: "Cuisine", icon: ChefHat, delay: "2.1s" },
  { label: "Relance", icon: Send, delay: "2.8s" },
  { label: "IA", icon: Brain, delay: "3.5s" },
];

const BEFORE_ARGUMENTS = [
  "Les commandes arrivent sur plusieurs téléphones",
  "Le stock est vérifié trop tard, souvent à la main",
  "Les clients ne sont pas enregistrés ni relancés",
];

const AFTER_ARGUMENTS = [
  "Chaque commande WhatsApp crée une fiche client",
  "Paiement, cuisine et stock avancent dans le même flux",
  "Les relances clients partent automatiquement",
];

export function ProductStory() {
  return (
    <>
      <section id="avant-apres" className="bg-bg-2 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-[680px] text-center">
            <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-tight tracking-tight text-text">
              Avant, tout dépend du papier. Après, tout se pilote au même endroit.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-text-2">
              Deux façons de vivre le même service du soir : des commandes dispersées, ou une équipe alignée en temps réel.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <BeforeAfterImage
              eyebrow="Avant"
              title="Le service se disperse"
              description="Tickets papier, appels, messages WhatsApp et stocks notés à la main : l'équipe perd du temps à recouper les informations."
              argumentsList={BEFORE_ARGUMENTS}
              mode="before"
            />
            <BeforeAfterImage
              eyebrow="Après"
              title="Le service est synchronisé"
              description="Commandes, paiements, cuisine et stock avancent ensemble depuis WhatsApp et le tableau de bord du restaurant."
              argumentsList={AFTER_ARGUMENTS}
              mode="after"
              highlighted
            />
          </div>
        </div>
      </section>

      <section id="demo" className="overflow-hidden bg-white px-6 py-24">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary-dark">
              Démo produit
            </span>
            <h2 className="mt-5 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-tight tracking-tight text-text">
              Le parcours complet, directement sur WhatsApp
            </h2>
            <p className="mt-4 text-base leading-relaxed text-text-2">
              La zone démo présente le passage d&apos;une commande WhatsApp vers le paiement, puis vers la cuisine, jusqu&apos;à
              la relance automatique du client.
            </p>

            <div className="mt-7 grid gap-3">
              {DEMO_STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.label} className="flex items-center justify-between gap-3 rounded-xl bg-bg-2 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary-light">
                        <Icon className="h-4.5 w-4.5 text-primary" strokeWidth={2.25} />
                      </div>
                      <span className="text-sm font-medium text-text">{step.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-primary">{step.value}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <ProcessAnimation />
        </div>
      </section>
    </>
  );
}

function ProcessAnimation() {
  return (
    <div className="relative min-h-[520px]">
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10 bg-primary-light/35"
      />
      <div
        aria-hidden
        className="hero-orbit absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-primary/30"
      />

      <div className="absolute left-1/2 top-1/2 z-10 w-[230px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border-[1.5px] border-border bg-white p-5 shadow-[0_24px_70px_rgba(121,103,255,0.18)]">
        <div className="flex items-center justify-between">
          <RestoAvatar size={52} pose="celebrate" badge="✓" />
          <span className="rounded-full bg-[#d6f8e4] px-2.5 py-1 text-[11px] font-semibold text-[#159447]">Live</span>
        </div>
        <p className="font-display mt-5 text-xl font-semibold text-text">Ozirus Resto</p>
        <p className="mt-2 text-sm leading-relaxed text-text-2">Le client est reconnu, servi, puis relancé automatiquement.</p>
        <div className="mt-5 space-y-2">
          {["Fiche client créée", "Commande traitée", "Relance planifiée"].map((item) => (
            <div key={item} className="flex items-center gap-2 text-xs font-medium text-text-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" strokeWidth={2.4} />
              {item}
            </div>
          ))}
        </div>
      </div>

      {PROCESS_STEPS.map((step, index) => {
        const Icon = step.icon;
        const positions = [
          "left-[3%] top-[12%]",
          "right-[3%] top-[10%]",
          "right-[0%] top-[46%]",
          "right-[14%] bottom-[6%]",
          "left-[16%] bottom-[7%]",
          "left-[0%] top-[46%]",
        ];
        return (
          <div
            key={step.label}
            className={`hero-step absolute ${positions[index]} rounded-2xl border-[1.5px] border-border bg-white/92 p-4 shadow-[0_18px_48px_rgba(10,10,15,0.10)] backdrop-blur`}
            style={{ animationDelay: step.delay }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-primary-light">
                <Icon className="h-5 w-5 text-primary" strokeWidth={2.25} />
              </div>
              <div>
                <p className="text-sm font-semibold text-text">{step.label}</p>
                <p className="text-xs text-text-3">{getStepCopy(step.label)}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getStepCopy(label: string) {
  const copy: Record<string, string> = {
    "Scan QR": "menu ouvert",
    Commande: "WhatsApp reçu",
    Paiement: "Mobile Money",
    Cuisine: "ticket clair",
    Relance: "client revient",
    IA: "offre suggérée",
  };
  return copy[label];
}

function BeforeAfterImage({
  eyebrow,
  title,
  description,
  argumentsList,
  mode,
  highlighted = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  argumentsList: string[];
  mode: "before" | "after";
  highlighted?: boolean;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border-[1.5px] border-border bg-white shadow-[0_18px_48px_rgba(121,103,255,0.08)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-bg-2 px-5 py-6 sm:px-8">
        <StoryIllustration mode={mode} />
        <div className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-text shadow-sm">
          {eyebrow}
        </div>
      </div>
      <div className={highlighted ? "bg-primary-light p-6 sm:p-7" : "p-6 sm:p-7"}>
        <div className="flex items-start gap-3">
          {highlighted && <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" strokeWidth={2.25} />}
          <div>
            <h3 className="font-display text-xl font-semibold text-text">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-2">{description}</p>
          </div>
        </div>
        <ul className="mt-5 space-y-3 border-t border-border-soft pt-5">
          {argumentsList.map((argument) => (
            <li key={argument} className="flex gap-2.5 text-sm leading-relaxed text-text-2">
              {highlighted ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.25} />
              ) : (
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-text-3" />
              )}
              <span>{argument}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function StoryIllustration({ mode }: { mode: "before" | "after" }) {
  const isBefore = mode === "before";
  const items = isBefore
    ? [
        { icon: FileText, label: "Tickets papier", tone: "bg-[#FFF7ED] text-[#C2410C]" },
        { icon: Smartphone, label: "Appels", tone: "bg-[#F1F5F9] text-[#475569]" },
        { icon: MessageCircle, label: "WhatsApp", tone: "bg-[#ECFDF3] text-[#159447]" },
      ]
    : [
        { icon: MessageCircle, label: "Commande", tone: "bg-[#ECFDF3] text-[#159447]" },
        { icon: CreditCard, label: "Paiement", tone: "bg-primary-light text-primary" },
        { icon: ChefHat, label: "Cuisine", tone: "bg-primary-light text-primary" },
      ];

  return (
    <div className="flex h-full min-h-[220px] flex-col justify-center gap-5" aria-label={isBefore ? "Commandes dispersées" : "Flux de commande synchronisé"}>
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.tone}`}>
                <Icon className="h-5 w-5" strokeWidth={2.1} />
              </div>
              <span className="text-center text-[11px] font-semibold text-text-2 sm:text-xs">{item.label}</span>
              {index < items.length - 1 && (
                <span className="absolute hidden" aria-hidden>
                  →
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-2 text-text-3" aria-hidden>
        <span className="h-px flex-1 bg-border" />
        <span className="text-lg">{isBefore ? "×" : "↓"}</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="flex items-center justify-center gap-3">
        <RestoAvatar size={64} pose={isBefore ? "alert" : "happy"} badge={isBefore ? "!" : "✓"} />
        <div className="rounded-2xl border border-border bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-text">
            {isBefore ? <AlertCircle className="h-4 w-4 text-[#F97316]" /> : <CheckCircle2 className="h-4 w-4 text-primary" />}
            {isBefore ? "Informations éparpillées" : "Tout avance ensemble"}
          </div>
          <div className="mt-2 h-1.5 w-28 rounded-full bg-border-soft">
            <div className={`h-full rounded-full ${isBefore ? "w-1/3 bg-[#FDBA74]" : "w-full bg-primary"}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
