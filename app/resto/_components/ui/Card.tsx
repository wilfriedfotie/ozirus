import { HTMLAttributes } from "react";
import { cn } from "@/app/resto/_lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border-[1.5px] border-border bg-surface p-6 shadow-[0_2px_8px_rgba(121,103,255,0.04)]",
        className,
      )}
      {...props}
    />
  );
}
