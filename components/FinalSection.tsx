"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { birthday } from "@/data/birthday";
import { SectionTitle } from "@/components/Shared";
import { getAudio } from "@/lib/audio";
import { cannons, celebrate, PARTY } from "@/lib/confetti";

const LAUNCH_EVENT = "havai-fisek";

function Fireworks() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    type Rocket = { x: number; y: number; vx: number; vy: number; color: string };
    type Spark = { x: number; y: number; vx: number; vy: number; life: number; decay: number; color: string };
    const rockets: Rocket[] = [];
    const sparks: Spark[] = [];
    const GRAVITY = 0.06;
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let nextLaunch = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const launch = () => {
      const rise = h * (0.5 + Math.random() * 0.3);
      rockets.push({
        x: w * (0.12 + Math.random() * 0.76),
        y: h,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -Math.sqrt(2 * GRAVITY * rise),
        color: PARTY[Math.floor(Math.random() * PARTY.length)],
      });
    };

    const explode = (r: Rocket) => {
      const count = 70 + Math.floor(Math.random() * 45);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.6 + 0.6;
        sparks.push({
          x: r.x,
          y: r.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.009 + Math.random() * 0.012,
          color: Math.random() < 0.2 ? "#fff4d6" : r.color,
        });
      }
    };

    const frame = (t: number) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      if (t > nextLaunch) {
        launch();
        nextLaunch = t + 650 + Math.random() * 900;
      }

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.x += r.vx;
        r.y += r.vy;
        r.vy += GRAVITY;
        ctx.globalAlpha = 1;
        ctx.fillStyle = r.color;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
        if (r.vy >= -0.4) {
          explode(r);
          rockets.splice(i, 1);
        }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.vx *= 0.985;
        s.vy = s.vy * 0.985 + 0.035;
        s.x += s.vx;
        s.y += s.vy;
        s.life -= s.decay;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = s.life;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    const volley = () => {
      for (let i = 0; i < 6; i++) window.setTimeout(launch, i * 140);
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(frame);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });

    resize();
    io.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener(LAUNCH_EVENT, volley);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener(LAUNCH_EVENT, volley);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}

const WISHES = ["Sağlık", "Huzur", "Bol kahkaha", "Bereket", "Güzel yolculuklar", "Sevdiklerinle uzun sofralar"];

export default function FinalSection() {
  const [count, setCount] = useState(0);

  const again = () => {
    setCount((c) => c + 1);
    cannons();
    window.setTimeout(() => celebrate(1800), 300);
    window.dispatchEvent(new Event(LAUNCH_EVENT));
    getAudio().chime();
  };

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-32">
      <Fireworks />

      <div className="relative z-10 flex flex-col items-center">
        <SectionTitle eyebrow="Ve son olarak" title={<>Nice mutlu yaşlara, <em>{birthday.name}</em></>}>
          Yeni yaşın sana güzel şeylerle gelsin. Seni seven çok insan var, bugün bunu unutma. 🤍
        </SectionTitle>

        <div className="-mt-4 flex max-w-lg flex-wrap justify-center gap-2">
          {WISHES.map((wish, i) => (
            <motion.span
              key={wish}
              className="rounded-full border border-gold/25 bg-gold/[0.07] px-4 py-1.5 text-sm text-gold-soft"
              initial={{ opacity: 0, y: 14, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 200, damping: 16 }}
            >
              {wish}
            </motion.span>
          ))}
        </div>

        <motion.button
          type="button"
          onClick={again}
          className="mt-12 rounded-full bg-gradient-to-r from-gold via-gold-soft to-gold px-8 py-4 text-sm font-semibold text-night shadow-[0_15px_40px_-10px_rgba(243,199,123,.6)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
        >
          🎉 Bir daha kutla
        </motion.button>

        <div className="mt-4 h-5 text-xs text-cream/45">
          <AnimatePresence mode="wait">
            {count > 1 && (
              <motion.span key={count} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {count}. kez kutlandın — hak ediyorsun 🥳
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <p className="absolute inset-x-0 bottom-8 z-10 text-center text-xs text-cream/40">
        Sevgiyle hazırlandı · {birthday.from} ve seni sevenler
      </p>
    </section>
  );
}
