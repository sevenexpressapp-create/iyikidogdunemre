"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { subscribeToasts, type ToastItem } from "@/lib/toast";

export function SectionTitle({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto mb-12 max-w-2xl px-2 text-center md:mb-16">
      <motion.p
        className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold/80"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        className="font-display mt-4 text-[2.6rem] leading-[1.02] font-light sm:text-5xl md:text-6xl"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
      >
        {title}
      </motion.h2>
      {children && (
        <motion.p
          className="mt-5 text-base leading-relaxed text-cream/65 md:text-lg"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {children}
        </motion.p>
      )}
    </div>
  );
}

type Star = { x: number; y: number; s: number; d: number; delay: number };

export function StarField() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const count = window.innerWidth < 640 ? 45 : 90;
    setStars(
      Array.from({ length: count }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: Math.random() * 1.8 + 0.6,
        d: 2 + Math.random() * 4,
        delay: -Math.random() * 6,
      }))
    );
  }, []);

  return (
    <div aria-hidden className="sky pointer-events-none fixed inset-0 -z-10">
      {stars.map((s, i) => (
        <span
          key={i}
          className="star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.s,
            height: s.s,
            animationDuration: `${s.d}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
      <div className="grain absolute inset-0 opacity-[0.035]" />
    </div>
  );
}

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(
    () =>
      subscribeToasts((t) => {
        setItems((list) => [...list.slice(-2), t]);
        window.setTimeout(() => setItems((list) => list.filter((x) => x.id !== t.id)), 2800);
      }),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[90] flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            layout
            className="rounded-full border border-gold/25 bg-night-2/85 px-5 py-2.5 text-center text-sm text-cream shadow-[0_10px_30px_-10px_rgba(0,0,0,.7)] backdrop-blur-xl"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function MusicToggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-label={on ? "Müziği durdur" : "Müziği çal"}
      className="fixed right-4 bottom-4 z-40 grid h-11 w-11 place-items-center rounded-full border border-gold/25 bg-night-2/80 text-gold/90 shadow-[0_10px_30px_-10px_rgba(0,0,0,.8)] backdrop-blur-xl"
      style={{ marginBottom: "env(safe-area-inset-bottom, 0)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      whileTap={{ scale: 0.94 }}
    >
      <span className="flex h-4 items-end gap-[3px]">
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="w-[3px] rounded-full bg-gold"
            animate={on ? { height: [4, 15, 7, 12, 4] } : { height: 4 }}
            transition={on ? { duration: 1, repeat: Infinity, delay: i * 0.15 } : { duration: 0.3 }}
          />
        ))}
      </span>
    </motion.button>
  );
}
