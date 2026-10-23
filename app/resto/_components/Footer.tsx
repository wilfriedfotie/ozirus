import Link from "next/link";
import { RESTO_WHATSAPP_URL } from "@/app/resto/_lib/links";
import { Heart } from "lucide-react";
import { RestoAvatar } from "@/app/resto/_components/RestoAvatar";

const FOOTER_LINKS = [
  { label: "Fonctionnalités", href: "#fonctionnalites" },
  { label: "Stock", href: "#stock" },
  { label: "Tarifs", href: "#tarifs" },
  { label: "Contact", href: "#contact" },
  { label: "Essai gratuit", href: RESTO_WHATSAPP_URL },
];

export function Footer() {
  return (
    <footer className="border-t-[1.5px] border-border-soft bg-white py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2">
          <RestoAvatar size={28} pose="idle" />
          <span className="font-display text-sm font-semibold text-text">Ozirus Resto</span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-text-2 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="flex items-center gap-1.5 text-[13px] text-text-3">
          Conçu avec <Heart className="h-3.5 w-3.5 fill-primary text-primary" /> au Cameroun
        </p>
      </div>
    </footer>
  );
}
