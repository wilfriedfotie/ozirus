import Link from "next/link";
import { RESTO_WHATSAPP_URL } from "@/app/resto/_lib/links";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { Button } from "@/app/resto/_components/ui/Button";
import BookingWidget from "@/components/booking/BookingWidget";

const GUARANTEES = ["Essai gratuit 14 jours", "Sans engagement", "Support WhatsApp"];

export function FinalCta() {
  return (
    <section id="contact" className="bg-bg-2 px-6 py-24">
      <div className="mx-auto max-w-[640px] text-center">
        <h2 className="whitespace-nowrap text-[clamp(1.6rem,4.5vw,3rem)] font-semibold leading-[1.1] tracking-tight text-text">
          Prêt à connaître vos clients ?
        </h2>
        <p className="mx-auto mt-4 max-w-[480px] text-lg leading-relaxed text-text-2">
          Configurez votre menu aujourd&apos;hui. Sans carte bancaire.
        </p>

        <div className="mt-8 text-left">
          <BookingWidget
            slug="mvp-appel"
            source="landing-resto"
            fallback={(
              <div className="rounded-xl border border-border bg-white p-4 text-center text-sm text-text-2">
                Réservation momentanément indisponible. Écrivez-nous sur WhatsApp pour choisir un créneau.
              </div>
            )}
          />
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href={RESTO_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <Button size="lg">
              Écrire sur WhatsApp
              <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
            </Button>
          </Link>
          <a
            href={RESTO_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-lg border-[1.5px] border-[#25D366] px-6 text-base font-semibold text-[#25D366] transition-colors hover:bg-[#25D366] hover:text-white"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={2.25} />
            WhatsApp
          </a>
        </div>

        <div className="mt-9 flex flex-wrap justify-center gap-6">
          {GUARANTEES.map((label) => (
            <div key={label} className="flex items-center gap-1.5 text-[13px] text-text-2">
              <Check className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} /> {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
