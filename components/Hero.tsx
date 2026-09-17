"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { birthday } from "@/data/birthday";
import { getAudio } from "@/lib/audio";
import { burst, emojiRain } from "@/lib/confetti";
import { toast } from "@/lib/toast";

const PALETTE: Array<[string, string]> = [
  ["#f3c77b", "#b9852f"],
  ["#ff7a93", "#c23f60"],
  ["#b8a4ff", "#7258d4"],
  ["#7fdcc1", "#379e82"],
  ["#fbe3ec", "#cf98ad"],
];

const POP_LINES = [
  "Pat! Bu balondan sağlık çıktı 🍀",
  "Pat! İçinden bol kazanç çıktı 💸",
  "Pat! Bu balonda kahkaha varmış 😂",
  "Pat! Bir tatil çıktı, hayırlı olsun ✈️",
  "Pat! Bu balon sana bir sarılma borçlu 🤗",
  "Pat! İçinden huzur çıktı 🕊️",
  "Pat! Şans balonuydu bu 🌟",
  "Pat! Bir dilek hakkı daha kazandın ✨",
  "Pat! İçinden koca bir pasta dilimi çıktı 🍰",
];

type Balloon = { id: number; x: number; c: number; dur: number; delay: number; size: number; sway: number; popped: boolean };

let uid = 0;
const makeBalloon = (initial: boolean): Balloon => ({
  id: ++uid,
  x: 3 + Math.random() * 86,
  c: Math.floor(Math.random() * PALETTE.length),
  dur: 11 + Math.random() * 8,
  delay: initial ? -Math.random() * 13 : Math.random() * 1.5,
  size: 48 + Math.random() * 26,
  sway: 2.6 + Math.random() * 2,
  popped: false,
});

function Balloons() {
  const [list, setList] = useState<Balloon[]>([]);
  const pops = useRef(0);

  useEffect(() => {
    const count = window.innerWidth < 640 ? 6 : 10;
    setList(Array.from({ length: count }, () => makeBalloon(true)));
  }, []);

  const replace = useCallback((id: number) => {
    setList((l) => l.map((b) => (b.id === id ? makeBalloon(false) : b)));
  }, []);

  const pop = (b: Balloon, e: React.PointerEvent<HTMLButtonElement>) => {
    if (b.popped) return;
    const r = e.currentTarget.getBoundingClientRect();
    burst({
      particleCount: 40,
      spread: 80,
      startVelocity: 24,
      scalar: 0.8,
      ticks: 90,
      colors: [PALETTE[b.c][0], "#fbf3e4", PALETTE[b.c][1]],
      origin: { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.width * 0.55) / window.innerHeight },
    });
    getAudio().pop();
    pops.current += 1;
    toast(
      pops.current % 10 === 0
        ? `${pops.current} balon! Resmen balon avcısısın 🏆`
        : POP_LINES[Math.floor(Math.random() * POP_LINES.length)]
    );
    setList((l) => l.map((x) => (x.id === b.id ? { ...x, popped: true } : x)));
    window.setTimeout(() => replace(b.id), 400);
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {list.map((b) => {
        const [color, shade] = PALETTE[b.c];
        return (
          <div
            key={b.id}
            className="balloon-rise absolute"
            style={{ left: `${b.x}%`, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }}
            onAnimationEnd={(e) => {
              if (e.target === e.currentTarget) replace(b.id);
            }}
          >
            <div className="balloon-sway" style={{ animationDuration: `${b.sway}s` }}>
              <motion.button
                type="button"
                tabIndex={-1}
                aria-label="Balonu patlat"
                onPointerDown={(e) => pop(b, e)}
                className="block cursor-pointer touch-manipulation"
                style={{ width: b.size }}
                animate={b.popped ? { scale: 1.5, opacity: 0 } : { scale: 1, opacity: 1 }}
                transition={{ duration: 0.16 }}
              >
                <svg viewBox="0 0 60 150" className="block w-full overflow-visible">
                  <defs>
                    <radialGradient id={`bg${b.id}`} cx="36%" cy="30%" r="72%">
                      <stop offset="0" stopColor="#fff" stopOpacity=".6" />
                      <stop offset=".22" stopColor={color} />
                      <stop offset="1" stopColor={shade} />
                    </radialGradient>
                  </defs>
                  <path d="M30 2 C 48 2 58 18 58 35 C 58 55 42 70 30 74 C 18 70 2 55 2 35 C 2 18 12 2 30 2 Z" fill={`url(#bg${b.id})`} />
                  <path d="M26 73 L34 73 L32 80 L28 80 Z" fill={shade} />
                  <ellipse cx="19" cy="22" rx="4.5" ry="9" fill="#fff" opacity=".35" transform="rotate(-25 19 22)" />
                  <path d="M30 80 C 24 94 36 108 30 122 C 25 134 33 142 30 150" stroke="rgba(255,255,255,.35)" strokeWidth="1" fill="none" />
                </svg>
              </motion.button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Hero() {
  const taps = useRef(0);

  const onNameTap = () => {
    taps.current += 1;
    if (taps.current >= 3) {
      taps.current = 0;
      emojiRain(["🎉", "🥳", "🎂", "🎈"]);
      getAudio().chime();
      toast("Gizli sürprizi buldun! 🥳");
    }
  };

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 py-24">
      <Balloons />

      <div className="pointer-events-none relative z-10 max-w-3xl text-center">
        <motion.p
          className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold/85"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {birthday.age ? `${birthday.age}. yaşın kutlu olsun` : "Bugün senin günün"}
        </motion.p>

        <h1 className="font-display mt-6 leading-[0.92]">
          <motion.span
            className="block text-4xl font-light text-cream/85 italic sm:text-5xl md:text-6xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
          >
            İyi ki doğdun,
          </motion.span>
          <motion.button
            type="button"
            onClick={onNameTap}
            className="shimmer-text pointer-events-auto mx-auto mt-2 block cursor-default text-[6rem] font-normal select-none sm:text-[9rem] md:text-[11rem]"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            whileTap={{ scale: 0.96 }}
          >
            {birthday.name}
          </motion.button>
        </h1>

        <motion.p
          className="mx-auto mt-8 max-w-md text-base leading-relaxed text-cream/70 sm:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1 }}
        >
          Bugün her şey senin için. Aşağıda bir pasta, seni sevenlerden mektuplar ve birkaç sürpriz var. Acele etme, tadını çıkar.
        </motion.p>

        <motion.div
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-cream/70 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <motion.span animate={{ rotate: [0, -12, 12, 0] }} transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1.5 }}>
            🎈
          </motion.span>
          Balonlara dokun, bakalım içlerinden ne çıkacak
        </motion.div>
      </div>

      <motion.div
        className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-gold/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
      >
        Kaydır
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </motion.div>
    </section>
  );
}
