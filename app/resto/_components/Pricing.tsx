import Link from "next/link";
import { RESTO_WHATSAPP_URL } from "@/app/resto/_lib/links";
import { Check } from "lucide-react";
import { Button } from "@/app/resto/_components/ui/Button";
import { cn } from "@/app/resto/_lib/cn";
import { PRICING_PLANS } from "@/app/resto/_lib/content";

export function Pricing() {
  return (
    <section id="tarifs" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-[560px] text-center">
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-tight tracking-tight text-text">
            Des tarifs simples
          </h2>
          <p className="mt-3 text-base leading-relaxed text-text-2">
            Sans commission. Sans engagement.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "flex flex-col rounded-2xl border-[1.5px] p-8",
                plan.highlighted ? "border-primary bg-primary-light" : "border-border-soft bg-white",
              )}
            >
              {plan.highlighted && (
                <span className="mb-4 inline-block w-fit rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-white">
                  Le plus populaire
                </span>
              )}
              <p className="font-display text-lg font-semibold text-text">{plan.name}</p>
              <p className="mt-1 text-sm text-text-2">{plan.description}</p>
              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="font-display text-3xl font-semibold text-text">{plan.price}</span>
                <span className="text-sm text-text-3">{plan.period}</span>
              </div>
              <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-text-2">
                    <Check className="h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href={RESTO_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-7">
                <Button variant={plan.highlighted ? "primary" : "secondary"} className="w-full justify-center">
                  Choisir {plan.name}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
