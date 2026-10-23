"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/app/resto/_components/ui/Button";
import { cn } from "@/app/resto/_lib/cn";
import { RestoAvatar } from "@/app/resto/_components/RestoAvatar";

const NAV_LINKS = [
  { label: "Fonctionnalités", id: "fonctionnalites" },
  { label: "Stock", id: "stock" },
  { label: "Tarifs", id: "tarifs" },
  { label: "Contact", id: "contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-all",
          scrolled ? "border-border bg-white/90 backdrop-blur-md" : "border-transparent bg-transparent",
        )}
      >
        <nav className="mx-auto flex h-[66px] max-w-6xl items-center justify-between px-6">
          <Link href="#" className="flex items-center gap-2">
            <RestoAvatar size={34} pose="happy" />
            <span className="font-display text-base font-semibold text-text">Ozirus Resto</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-text-2 transition-colors hover:bg-bg-2 hover:text-text"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" className="hidden sm:inline-flex" onClick={() => scrollTo("contact")}>
              Nous contacter
            </Button>
            <a href="#fonctionnalites">
              <Button size="sm">Voir comment ça marche</Button>
            </a>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menu"
              className="flex h-[38px] w-[38px] flex-col items-center justify-center gap-1.5 rounded-lg border-[1.5px] border-border bg-bg-2 md:hidden"
            >
              <span
                className={cn(
                  "block h-[1.5px] w-4 rounded-full bg-text transition-transform",
                  menuOpen && "translate-y-[5px] rotate-45",
                )}
              />
              <span className={cn("block h-[1.5px] w-4 rounded-full bg-text transition-opacity", menuOpen && "opacity-0")} />
              <span
                className={cn(
                  "block h-[1.5px] w-4 rounded-full bg-text transition-transform",
                  menuOpen && "-translate-y-[5px] -rotate-45",
                )}
              />
            </button>
          </div>
        </nav>
      </header>

      {menuOpen && (
        <div className="fixed inset-x-0 top-[66px] z-40 border-b border-border bg-white px-6 py-4 shadow-lg md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="rounded-lg px-3 py-3 text-left text-sm font-medium text-text-2 hover:bg-bg-2"
              >
                {link.label}
              </button>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <Button variant="secondary" size="sm" onClick={() => scrollTo("contact")} className="justify-center">
                Nous contacter
              </Button>
              <a href="#fonctionnalites" onClick={() => setMenuOpen(false)}>
                <Button size="sm" className="w-full justify-center">
                  Voir comment ça marche
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
