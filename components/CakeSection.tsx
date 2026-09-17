"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { birthday } from "@/data/birthday";
import { SectionTitle } from "@/components/Shared";
import { getAudio } from "@/lib/audio";
import { celebrate } from "@/lib/confetti";
import { toast } from "@/lib/toast";

const CANDLES = Math.min(9, Math.max(1, Math.round(birthday.candles)));

// Krema damlaları — soldan sağa sabit derinlikler
function dripPath(depths: number[]) {
  const w = 200 / depths.length;
  let d = "M0 0 L200 0 L200 10";
  for (let i = depths.length - 1; i >= 0; i--) {
    const x1 = (i + 1) * w;
    const x0 = i * w;
    const depth = depths[i];
    d += ` L${x1 - w * 0.22} 10 C${x1 - w * 0.22} ${depth + 6} ${x0 + w * 0.22} ${depth + 6} ${x0 + w * 0.22} 10 L${x0} 10`;
  }
  return d + " Z";
}

const TOP_DRIPS = dripPath([22, 12, 28, 14, 20, 30, 12, 24]);
const BOTTOM_DRIPS = dripPath([18, 30, 12, 24, 16, 28, 14, 22, 30, 16]);

function Tier({
  top,
  width,
  height,
  body,
  frost,
  surface,
  drips,
  z,
  children,
}: {
  top: number;
  width: number;
  height: number;
  body: string;
  frost: string;
  surface: string;
  drips: string;
  z: number;
  children?: React.ReactNode;
}) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2" style={{ top, width, height, zIndex: z }}>
      <div
        className="absolute inset-x-0 bottom-0 overflow-hidden rounded-b-[50%_24px]"
        style={{ top: 12, background: body, boxShadow: "inset 0 -10px 20px rgba(0,0,0,.12)" }}
      >
        {children}
      </div>
      <svg className="absolute inset-x-0" style={{ top: 10 }} width="100%" height="36" viewBox="0 0 200 40" preserveAspectRatio="none">
        <path d={drips} fill={frost} />
      </svg>
      <div className="absolute inset-x-0 top-0 h-6 rounded-[50%]" style={{ background: surface }} />
    </div>
  );
}

function Candle({ lit, index, onBlow }: { lit: boolean; index: number; onBlow: () => void }) {
  return (
    <button
      type="button"
      onClick={onBlow}
      aria-label={lit ? `${index + 1}. mumu söndür` : `${index + 1}. mum söndü`}
      className="relative flex h-[96px] w-[20px] cursor-pointer flex-col items-center justify-end touch-manipulation"
    >
      <div className="relative h-[34px] w-full">
        <AnimatePresence>
          {lit && (
            <motion.div
              key="flame"
              className="absolute bottom-[1px] left-1/2 -ml-[7px]"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.2, opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              style={{ transformOrigin: "50% 100%" }}
            >
              <div className="flame" style={{ animationDelay: `${index * -0.17}s` }} />
            </motion.div>
          )}
        </AnimatePresence>
        {!lit && (
          <>
            <span className="smoke" style={{ ["--dx" as string]: "-8px" }} />
            <span className="smoke" style={{ ["--dx" as string]: "6px", animationDelay: "0.15s" }} />
            <span className="smoke" style={{ ["--dx" as string]: "-2px", animationDelay: "0.3s" }} />
          </>
        )}
      </div>
      <div className="h-[7px] w-[2px] rounded-t bg-[#3a2a1e]" />
      <div className="candle-stripes h-[48px] w-[10px] rounded-t-[3px]" />
    </button>
  );
}

const SPRINKLES = [
  [12, 40, 20, "#f3c77b"], [24, 62, -30, "#7fdcc1"], [36, 48, 60, "#fbf3e4"], [48, 70, 10, "#b8a4ff"],
  [58, 44, -45, "#f3c77b"], [70, 64, 35, "#fbf3e4"], [82, 50, -15, "#7fdcc1"], [90, 70, 50, "#b8a4ff"],
  [18, 78, 70, "#fbf3e4"], [64, 80, -60, "#f3c77b"],
] as const;

export default function CakeSection() {
  const [lit, setLit] = useState<boolean[]>(() => Array(CANDLES).fill(true));
  const [listening, setListening] = useState(false);
  const [celebrated, setCelebrated] = useState(false);
  const litRef = useRef(lit);
  const meterRef = useRef<HTMLDivElement>(null);
  const micRef = useRef<{ stream: MediaStream; ctx: AudioContext; raf: number } | null>(null);

  litRef.current = lit;
  const litCount = lit.filter(Boolean).length;

  const blow = useCallback((i: number) => {
    if (!litRef.current[i]) return;
    getAudio().puff();
    setLit((prev) => prev.map((v, k) => (k === i ? false : v)));
  }, []);

  const blowRandom = useCallback(() => {
    const idx = litRef.current.map((v, i) => (v ? i : -1)).filter((i) => i >= 0);
    if (idx.length) blow(idx[Math.floor(Math.random() * idx.length)]);
  }, [blow]);

  const stopMic = useCallback(() => {
    const m = micRef.current;
    if (!m) return;
    cancelAnimationFrame(m.raf);
    m.stream.getTracks().forEach((t) => t.stop());
    void m.ctx.close();
    micRef.current = null;
    setListening(false);
    getAudio().duck(false);
  }, []);

  const startMic = async () => {
    if (micRef.current) {
      stopMic();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const buf = new Uint8Array(analyser.fftSize);
      let hot = 0;
      let cool = 0;

      const loop = () => {
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) {
          const v = (buf[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / buf.length);
        if (meterRef.current) meterRef.current.style.transform = `scaleX(${Math.min(1, rms * 4)})`;
        if (cool > 0) cool -= 1;
        else if (rms > 0.13) {
          hot += 1;
          if (hot > 5) {
            blowRandom();
            hot = 0;
            cool = 14;
          }
        } else hot = Math.max(0, hot - 1);
        if (micRef.current) micRef.current.raf = requestAnimationFrame(loop);
      };

      micRef.current = { stream, ctx, raf: 0 };
      micRef.current.raf = requestAnimationFrame(loop);
      getAudio().duck(true);
      setListening(true);
      toast("Dinliyorum… telefona doğru üfle 🌬️");
    } catch {
      toast("Mikrofona ulaşamadım — mumlara dokunarak da söndürebilirsin 🙂");
    }
  };

  useEffect(() => stopMic, [stopMic]);

  useEffect(() => {
    if (litCount > 0 || celebrated) return;
    stopMic();
    setCelebrated(true);
    const t = window.setTimeout(() => {
      celebrate(2800);
      getAudio().chime();
    }, 500);
    return () => window.clearTimeout(t);
  }, [litCount, celebrated, stopMic]);

  const relight = () => {
    setCelebrated(false);
    setLit(Array(CANDLES).fill(true));
    getAudio().sparkle();
  };

  return (
    <section className="relative overflow-hidden px-5 py-24 md:py-32">
      <SectionTitle eyebrow="Dilek zamanı" title={<>Gözlerini kapat, <em>bir dilek tut</em></>}>
        Sonra mumları üfle. Gerçekten üfleyebilirsin: mikrofonu aç ve telefona doğru üfle. Ya da mumlara dokun.
      </SectionTitle>

      <motion.div
        className="relative mx-auto h-[300px] w-[300px]"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
      >
        {/* Mum ışığı */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 left-1/2 h-[300px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,190,90,.32),transparent)] transition-opacity duration-700"
          style={{ opacity: litCount / CANDLES }}
        />

        {/* Tabak */}
        <div
          className="absolute top-[240px] left-1/2 h-[38px] w-[300px] -translate-x-1/2 rounded-[50%]"
          style={{
            background: "radial-gradient(ellipse at 50% 30%, #f7f1ff, #b9b0cf 72%)",
            boxShadow: "0 18px 30px -10px rgba(0,0,0,.7)",
            zIndex: 1,
          }}
        />

        <Tier
          top={150}
          width={262}
          height={106}
          z={2}
          body="linear-gradient(90deg,#b8385b 0%,#ee7892 35%,#e8657f 62%,#a93255 100%)"
          frost="#fde9dc"
          surface="radial-gradient(ellipse at 50% 40%,#fff6ee,#f4d5c3)"
          drips={BOTTOM_DRIPS}
        >
          {SPRINKLES.map(([x, y, r, c], i) => (
            <span
              key={i}
              className="absolute h-[3px] w-[9px] rounded-full"
              style={{ left: `${x}%`, top: `${y}%`, background: c, transform: `rotate(${r}deg)` }}
            />
          ))}
        </Tier>

        <Tier
          top={80}
          width={190}
          height={88}
          z={3}
          body="linear-gradient(90deg,#d79c65 0%,#f6d7ae 38%,#f1cb9b 62%,#c98c56 100%)"
          frost="#fff7ea"
          surface="radial-gradient(ellipse at 50% 40%,#fffcf5,#f3e3c8)"
          drips={TOP_DRIPS}
        >
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-[10px]">
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} className="h-[6px] w-[6px] rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff,#e9d3a8)]" />
            ))}
          </div>
        </Tier>

        {/* Mumlar */}
        <div className="absolute top-0 left-1/2 flex -translate-x-1/2 gap-[6px]" style={{ zIndex: 4 }}>
          {lit.map((on, i) => (
            <Candle key={i} lit={on} index={i} onBlow={() => blow(i)} />
          ))}
        </div>
      </motion.div>

      <div className="mt-12 flex min-h-[120px] flex-col items-center text-center">
        <AnimatePresence mode="wait">
          {litCount > 0 ? (
            <motion.div
              key="controls"
              className="flex flex-col items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <motion.button
                type="button"
                onClick={startMic}
                className={`rounded-full border px-6 py-3 text-sm font-medium transition-colors ${
                  listening ? "border-rose/60 bg-rose/15 text-cream" : "border-gold/40 bg-gold/10 text-gold"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {listening ? "🎙️ Dinliyorum — üfle! (durdur)" : "🎙️ Üflemek için tıkla"}
              </motion.button>
              <div className="h-1 w-40 overflow-hidden rounded-full bg-white/10" style={{ opacity: listening ? 1 : 0 }}>
                <div ref={meterRef} className="h-full w-full origin-left bg-gradient-to-r from-gold to-rose" style={{ transform: "scaleX(0)" }} />
              </div>
              <p className="text-xs text-cream/50">
                {litCount} mum yanıyor · ya da mumlara tek tek dokun
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="wished"
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 140, damping: 14, delay: 0.4 }}
            >
              <p className="font-display text-[2.1rem] sm:text-5xl">
                Dileğin <em className="whitespace-nowrap text-gold italic">kabul olsun ✨</em>
              </p>
              <p className="mt-3 text-sm text-cream/60">Ne dilediğini söyleme ama, yoksa olmaz 🤫</p>
              <button
                type="button"
                onClick={relight}
                className="mt-6 rounded-full border border-white/15 px-5 py-2.5 text-xs text-cream/70 transition-colors hover:border-gold/40 hover:text-gold"
              >
                Mumları yeniden yak
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
