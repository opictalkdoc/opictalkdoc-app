"use client";

import { motion, type Variant } from "framer-motion";
import type { ReactNode } from "react";

/* ── 프리셋 애니메이션 ── */
const presets = {
  "fade-up": {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-down": {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-left": {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  "fade-right": {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
  "fade-in": {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "scale-up": {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
} satisfies Record<string, { hidden: Variant; visible: Variant }>;

type Preset = keyof typeof presets;

interface ScrollRevealProps {
  children: ReactNode;
  preset?: Preset;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
  as?: "div" | "section" | "li" | "span" | "p";
}

export default function ScrollReveal({
  children,
  preset = "fade-up",
  delay = 0,
  duration = 0.6,
  className,
  once = true,
  amount = 0.2,
  as = "div",
}: ScrollRevealProps) {
  const variants = presets[preset];
  const Component = motion[as] as typeof motion.div;

  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </Component>
  );
}
