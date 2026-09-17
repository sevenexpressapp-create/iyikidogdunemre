"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { birthday } from "@/data/birthday";
import { getAudio } from "@/lib/audio";
import { burst, cannons } from "@/lib/confetti";

type Phase = "idle" | "shake" | "burst" | "reveal";

export default function GiftGate({ onStart, onDone }: { onStart: () => void; onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const open = () => {
    if (phase !== "idle") return;
    onStart();
    setPhase("shake");
    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
    at(800, () => {
      setPhase("burst");
      getAudio().pop();
      getAudio().chime();
      burst({ particleCount: 150, spread: 95, startVelocity: 50, origin: { x: 0.5, y: 0.6 } });
    });
    at(1150, cannons);
    at(2100, () => setPhase("reveal"));
    at(4700, onDone);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-hidden px-6"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9 }}
    >
      <AnimatePresence mode="wait">
        {phase !== "reveal" ? (
          <motion.div
            key="box"
            className="flex flex-col items-center text-center"
            exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.4 } }}
          >
            <motion.p
              className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold/80"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: phase === "idle" ? 1 : 0, y: 0 }}
              transition={{ duration: 0.7, delay: phase === "idle" ? 0.3 : 0 }}
            >
              Özel teslimat
            </motion.p>
            <motion.h1
              className="font-display mt-4 text-[2.5rem] leading-[1.05] font-light sm:text-6xl"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: phase === "idle" ? 1 : 0, y: 0 }}
              transition={{ duration: 0.8, delay: phase === "idle" ? 0.5 : 0 }}
            >
              {birthday.name}, sana
              <br />
              <em>bir paket var</em>
            </motion.h1>

            <GiftBox phase={phase} onOpen={open} />

            <motion.p
              className="text-sm text-cream/55"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "idle" ? 1 : 0 }}
              transition={{ duration: 0.6, delay: phase === "idle" ? 1.2 : 0 }}
            >
              Kutuya dokun · sesin açık olsun 🔊
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 110, damping: 14 }}
          >
            <p className="font-display text-3xl font-light text-cream/85 italic sm:text-4xl">İyi ki doğdun,</p>
            <p className="font-display shimmer-text mt-1 text-[5.5rem] leading-none sm:text-9xl">{birthday.name}</p>
            <motion.p
              className="mt-6 text-sm tracking-wide text-cream/60"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              Hazır ol, sürprizler başlıyor…
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function GiftBox({ phase, onOpen }: { phase: Phase; onOpen: () => void }) {
  const opened = phase === "burst";

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label="Hediyeyi aç"
      className="relative my-12 h-[200px] w-[190px] cursor-pointer outline-none"
      animate={
        phase === "idle"
          ? { y: [0, -16, 0, -6, 0], rotate: [0, -3, 3, -1, 0] }
          : phase === "shake"
            ? { rotate: [0, -9, 9, -12, 12, -7, 7, 0], scale: [1, 1.04, 1.05, 1.07, 1.08, 1.06, 1.03, 1], y: 0 }
            : { rotate: 0, scale: 1, y: 0 }
      }
      transition={
        phase === "idle"
          ? { duration: 1.6, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }
          : { duration: 0.8 }
      }
      whileTap={phase === "idle" ? { scale: 0.94 } : undefined}
    >
      {/* Işık hüzmeleri */}
      <motion.div
        aria-hidden
        className="rays pointer-events-none absolute top-[55%] left-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        initial={{ opacity: 0, scale: 0.3 }}
        animate={opened ? { opacity: 1, scale: 1, rotate: 45 } : { opacity: 0, scale: 0.3 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />
      {/* Bekleme parıltısı */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,122,147,.28),transparent)]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      {/* Gölge */}
      <div aria-hidden className="absolute -bottom-4 left-1/2 h-5 w-44 -translate-x-1/2 rounded-[50%] bg-black/60 blur-md" />

      {/* Gövde */}
      <div
        className="absolute top-[78px] right-[10px] bottom-0 left-[10px] overflow-hidden rounded-t-sm rounded-b-xl"
        style={{
          background: "linear-gradient(135deg,#f0708c 0%,#d9476a 55%,#b3345a 100%)",
          boxShadow: "inset -18px 0 30px rgba(0,0,0,.18), 0 24px 50px -12px rgba(217,71,106,.55)",
        }}
      >
        <div className="dots absolute inset-0 opacity-40" />
        <div className="ribbon absolute inset-y-0 left-1/2 w-7 -translate-x-1/2" />
        <div className="absolute inset-x-0 top-0 h-3 bg-black/15" />
      </div>

      {/* Kutudan taşan ışık */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[80px] left-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#fff6d6_0%,rgba(243,199,123,.7)_30%,transparent_70%)]"
        initial={{ opacity: 0, scale: 0.4 }}
        animate={opened ? { opacity: [0, 1, 0.6], scale: [0.4, 1.4, 1.2] } : { opacity: 0, scale: 0.4 }}
        transition={{ duration: 1 }}
      />

      {/* Kapak */}
      <motion.div
        className="absolute top-[46px] right-0 left-0 h-[42px]"
        animate={opened ? { y: -280, x: 80, rotate: 40, opacity: 0 } : { y: 0, x: 0, rotate: 0, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div
          className="absolute inset-0 rounded-md"
          style={{
            background: "linear-gradient(135deg,#ff8aa3,#e25577 60%,#c23c63)",
            boxShadow: "0 8px 14px rgba(0,0,0,.25)",
          }}
        />
        <div className="ribbon absolute inset-y-0 left-1/2 w-7 -translate-x-1/2" />
        <svg viewBox="0 0 120 50" className="absolute bottom-[calc(100%-8px)] left-1/2 w-[124px] -translate-x-1/2">
          <defs>
            <linearGradient id="bow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fbe3a8" />
              <stop offset=".5" stopColor="#f3c77b" />
              <stop offset="1" stopColor="#c9953f" />
            </linearGradient>
          </defs>
          <path d="M60 44 C 40 8, 4 2, 7 26 C 10 46, 40 47, 60 44 Z" fill="url(#bow)" />
          <path d="M60 44 C 80 8, 116 2, 113 26 C 110 46, 80 47, 60 44 Z" fill="url(#bow)" />
          <path d="M58 42 C 44 28 26 20 16 24" stroke="#a87a30" strokeOpacity=".45" fill="none" />
          <path d="M62 42 C 76 28 94 20 104 24" stroke="#a87a30" strokeOpacity=".45" fill="none" />
          <ellipse cx="60" cy="42" rx="11" ry="8" fill="#e6b15c" />
        </svg>
      </motion.div>
    </motion.button>
  );
}
