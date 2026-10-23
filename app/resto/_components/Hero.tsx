import Link from "next/link";
import { RESTO_WHATSAPP_URL } from "@/app/resto/_lib/links";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/app/resto/_components/ui/Button";
import { WhatsAppFlowShowcase } from "@/app/resto/_components/WhatsAppFlowShowcase";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-[66px]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-28 top-12 h-[520px] w-[520px] rounded-full bg-primary-light blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-0 h-[360px] w-[360px] rounded-full bg-[#d6f8e4] opacity-50 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-8 sm:py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="max-w-[650px]">
          <span className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full bg-primary-light px-4 py-1.5 text-sm font-medium text-primary-dark">
            <Sparkles className="h-4 w-4" strokeWidth={2.25} />
            Un client mange chez vous. Puis il disparaît.
          </span>

          <h1 className="animate-slide-up text-[clamp(2.5rem,6vw,4.8rem)] font-semibold leading-[1.02] tracking-tight text-text">
            Connaissez enfin{" "}
            <span className="bg-gradient-to-br from-primary to-primary-mid bg-clip-text text-transparent">
              vos clients
            </span>
          </h1>

          <p
            className="animate-slide-up mt-6 max-w-[560px] text-lg leading-relaxed text-text-2"
            style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
          >
            Ozirus Resto enregistre chaque client à la commande WhatsApp et le relance automatiquement.
            Vous gardez le contact. Il revient.
          </p>

          <div
            className="animate-slide-up mt-9 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "0.15s", animationFillMode: "backwards" }}
          >
            <Link href={RESTO_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg">
                Essayer gratuitement
                <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
              </Button>
            </Link>
            <a href="#fonctionnalites">
              <Button size="lg" variant="secondary">
                Voir comment ça marche
              </Button>
            </a>
          </div>

          <div
            className="animate-slide-up mt-8 flex flex-wrap gap-4 text-sm text-text-3"
            style={{ animationDelay: "0.2s", animationFillMode: "backwards" }}
          >
            {["Sans engagement", "Configuration en 3 jours", "Vos fonds restent sur votre compte"].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" strokeWidth={2.25} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: "0.12s", animationFillMode: "backwards" }}>
          <WhatsAppFlowShowcase />
        </div>
      </div>
    </section>
  );
}
