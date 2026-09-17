"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { birthday } from "@/data/birthday";
import { SectionTitle } from "@/components/Shared";
import { getAudio } from "@/lib/audio";
import { burst } from "@/lib/confetti";

export default function ScratchSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  const strokes = useRef(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const paint = () => {
      const r = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const g = ctx.createLinearGradient(0, 0, r.width, r.height);
      g.addColorStop(0, "#c9953f");
      g.addColorStop(0.35, "#f7d98f");
      g.addColorStop(0.55, "#e2b35e");
      g.addColorStop(0.8, "#fbe7b4");
      g.addColorStop(1, "#b98532");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, r.width, r.height);

      for (let i = 0; i < 320; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.55})`;
        ctx.fillRect(Math.random() * r.width, Math.random() * r.height, 1.6, 1.6);
      }

      const root = getComputedStyle(document.documentElement);
      const display = root.getPropertyValue("--font-fraunces").trim() || "Georgia, serif";
      const sans = root.getPropertyValue("--font-manrope").trim() || "system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(92,58,14,.85)";
      ctx.font = `italic 500 ${Math.round(Math.min(46, Math.max(30, r.width / 9)))}px ${display}`;
      ctx.fillText("Kazı ✨", r.width / 2, r.height / 2 - 10);
      ctx.font = `600 12px ${sans}`;
      ctx.fillStyle = "rgba(92,58,14,.65)";
      ctx.fillText("PARMAĞINLA KAZI, ALTINDA NE VAR GÖR", r.width / 2, r.height / 2 + 28);
    };

    void document.fonts.ready.then(paint);
  }, []);

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const check = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || done) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * 23) {
      total += 1;
      if (data[i] < 100) clear += 1;
    }
    if (total && clear / total > 0.5) {
      setDone(true);
      getAudio().chime();
      const r = canvas.getBoundingClientRect();
      burst({
        particleCount: 120,
        spread: 90,
        startVelocity: 40,
        origin: { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight },
      });
    }
  };

  const scratch = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 42;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x + 0.01, b.y);
    ctx.stroke();
    strokes.current += 1;
    if (strokes.current % 14 === 0) check();
  };

  return (
    <section className="relative px-5 py-24 md:py-32">
      <SectionTitle eyebrow="Kazı kazan" title={<>Sana küçük bir <em>not</em> bıraktık</>}>
        Altın kaplamanın altında bir şey var. Kazı bakalım.
      </SectionTitle>

      <motion.div
        ref={wrapRef}
        className="relative mx-auto aspect-[16/10] w-full max-w-md overflow-hidden rounded-3xl shadow-[0_30px_60px_-25px_rgba(0,0,0,.9)]"
        initial={{ opacity: 0, y: 30, rotate: -2 }}
        whileInView={{ opacity: 1, y: 0, rotate: -1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-gold/25 bg-[linear-gradient(160deg,#261b40,#17112b)] p-6 text-center">
          <motion.span
            className="text-5xl"
            animate={done ? { scale: [0.6, 1.25, 1], rotate: [0, -10, 0] } : {}}
            transition={{ duration: 0.7 }}
          >
            {birthday.scratch.emoji}
          </motion.span>
          <p className="font-display mt-3 text-2xl text-cream sm:text-3xl">{birthday.scratch.title}</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-cream/70 sm:text-base">{birthday.scratch.text}</p>
        </div>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full cursor-grab touch-none transition-opacity duration-700"
          style={{ opacity: done ? 0 : 1, pointerEvents: done ? "none" : "auto" }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            const p = point(e);
            last.current = p;
            scratch(p, p);
          }}
          onPointerMove={(e) => {
            if (!last.current) return;
            const p = point(e);
            scratch(last.current, p);
            last.current = p;
          }}
          onPointerUp={() => {
            last.current = null;
            check();
          }}
          onPointerCancel={() => {
            last.current = null;
          }}
        />
      </motion.div>
    </section>
  );
}
