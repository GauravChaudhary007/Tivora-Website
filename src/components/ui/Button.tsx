"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { MouseEvent, ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost-dark" | "ghost-light" | "white";
  size?: "md" | "lg";
  arrow?: boolean;
  className?: string;
  onClick?: (e?: MouseEvent<HTMLAnchorElement>) => void;
};

const variants = {
  primary:
    "bg-indigo text-white shadow-[0_8px_24px_-8px_rgb(58_75_224/0.7),inset_0_1px_0_rgb(255_255_255/0.2)] hover:bg-[#4757ea]",
  white: "bg-white text-midnight hover:bg-mist",
  "ghost-dark": "text-white ring-1 ring-inset ring-white/15 hover:bg-white/[0.06] hover:ring-white/25",
  "ghost-light": "text-midnight ring-1 ring-inset ring-midnight/15 hover:bg-midnight/[0.04]",
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  arrow = false,
  className = "",
  onClick,
}: ButtonProps) {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200 ${
        size === "lg" ? "h-12 px-6 text-[15px]" : "h-10 px-4.5 text-sm"
      } ${variants[variant]} ${className}`}
    >
      {children}
      {arrow && (
        <ArrowRight
          aria-hidden
          className="size-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5"
        />
      )}
    </motion.a>
  );
}
