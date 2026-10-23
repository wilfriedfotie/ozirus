import { CreditCard, Heart, Package, Users, type LucideIcon } from "lucide-react";
import { Card } from "@/app/resto/_components/ui/Card";
import { WHY_ITEMS } from "@/app/resto/_lib/content";

const ICONS: Record<string, LucideIcon> = {
  Users,
  CreditCard,
  Package,
  Heart,
};

export function WhySection() {
  return (
    <section id="fonctionnalites" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-12 max-w-[560px] text-center">
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-tight tracking-tight text-text">
            Un client fidèle vaut 5 nouveaux clients
          </h2>
          <p className="mt-3 text-base leading-relaxed text-text-2">
            Voici comment Ozirus Resto vous aide à les garder.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_ITEMS.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <Card key={item.title} className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-primary-light">
                  <Icon className="h-5 w-5 text-primary" strokeWidth={2} />
                </div>
                <p className="font-display mt-4 text-base font-semibold text-text">{item.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-text-2">{item.body}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
