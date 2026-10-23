import Image from "next/image";
import { cn } from "@/app/resto/_lib/cn";

type AvatarPose = "idle" | "happy" | "alert" | "celebrate";

const POSE_CLASSES: Record<AvatarPose, string> = {
  idle: "",
  happy: "rotate-2",
  alert: "-rotate-6",
  celebrate: "rotate-6 scale-105",
};

export function RestoAvatar({
  size = 48,
  pose = "idle",
  badge,
  className,
}: {
  size?: number;
  pose?: AvatarPose;
  badge?: string;
  className?: string;
}) {
  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Avatar Ozirus Resto"
    >
      <span className={cn("relative block h-full w-full transition-transform duration-300", POSE_CLASSES[pose])}>
        <Image
          src="/resto/marketing/ozirus-avatar-3d.svg"
          alt=""
          fill
          sizes={`${size}px`}
          className="object-contain"
        />
      </span>
      {badge && (
        <span className="absolute -right-2 -top-2 rounded-full border border-white bg-white px-1.5 py-0.5 text-[10px] font-bold leading-none shadow-sm">
          {badge}
        </span>
      )}
    </span>
  );
}
