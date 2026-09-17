"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { birthday, type Letter } from "@/data/birthday";
import { SectionTitle } from "@/components/Shared";
import { getAudio } from "@/lib/audio";
import { celebrate, hearts } from "@/lib/confetti";
import { toast } from "@/lib/toast";

const STORAGE_KEY = "emre-dogum-gunu:okunan";

const PAPER = "linear-gradient(160deg,#fbf3e4 0%,#f1e2c8 100%)";
const FLAP = "linear-gradient(180deg,#f3e3c8 0%,#e6cfaa 100%)";
const LETTER_PAPER = "radial-gradient(120% 80% at 50% 0%,#fffaf0 0%,#f6ecda 60%,#efdfc3 100%)";
const GOLD_PAPER = "radial-gradient(120% 80% at 50% 0%,#fff8e6 0%,#f7e2b2 60%,#eccb85 100%)";

function WaxSeal({ color, emoji, size = 56, broken = false }: { color: string; emoji: string; size?: number; broken?: boolean }) {
  return (
    <div
      className="relative grid place-items-center"
      style={{
        width: size,
        height: size,
        borderRadius: "48% 52% 50% 50% / 52% 48% 52% 48%",
        background: `radial-gradient(circle at 35% 30%, color-mix(in srgb, ${color} 60%, white), ${color} 55%, color-mix(in srgb, ${color} 70%, black))`,
        boxShadow: "0 4px 10px -2px rgba(0,0,0,.45), inset 0 -3px 6px rgba(0,0,0,.25), inset 0 2px 4px rgba(255,255,255,.25)",
      }}
    >
      <div className="absolute inset-[5px] rounded-full border border-white/25" />
      <span style={{ fontSize: size * 0.4, lineHeight: 1 }}>{emoji}</span>
      {broken && (
        <svg className="absolute inset-0" viewBox="0 0 56 56" aria-hidden>
          <path d="M22 3 L27 18 L22 27 L30 38 L26 53" stroke="rgba(40,20,10,.55)" strokeWidth="1.6" fill="none" />
        </svg>
      )}
    </div>
  );
}

function EnvelopeCard({ letter, index, isRead, onOpen }: { letter: Letter; index: number; isRead: boolean; onOpen: () => void }) {
  const tilt = index % 2 === 0 ? -1.5 : 1.5;
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label={`${letter.title} mektubunu aç`}
      className="group relative aspect-[4/3] w-[calc(50%-0.5rem)] rounded-2xl sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] text-left outline-none focus-visible:ring-2 focus-visible:ring-gold"
      initial={{ opacity: 0, y: 50, rotate: tilt * 3 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.75, delay: index * 0.09, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={{ y: -8, rotate: 0 }}
      whileTap={{ scale: 0.96 }}
    >
      {!isRead && <span aria-hidden className="unread-glow absolute -inset-1 rounded-[20px]" />}
      <div className="absolute inset-0 overflow-hidden rounded-2xl shadow-[0_22px_40px_-18px_rgba(0,0,0,.8)]" style={{ background: PAPER }}>
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden>
          <path d="M0 300 L200 160 L400 300" stroke="rgba(58,42,30,.14)" strokeWidth="2" fill="none" />
        </svg>
        <div className="absolute inset-0" style={{ filter: "drop-shadow(0 3px 3px rgba(58,42,30,.18))" }}>
          <div className="absolute inset-0" style={{ background: FLAP, clipPath: "polygon(0 0,100% 0,50% 58%)" }} />
        </div>
        <div className="absolute top-[56%] left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 group-hover:scale-110">
          <div className="sm:hidden">
            <WaxSeal color={letter.seal} emoji={letter.emoji} size={42} broken={isRead} />
          </div>
          <div className="hidden sm:block">
            <WaxSeal color={letter.seal} emoji={letter.emoji} size={54} broken={isRead} />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-2 text-center sm:bottom-3">
          <p className="font-hand text-[1.45rem] leading-none text-ink sm:text-[1.9rem]">{letter.title}</p>
        </div>
        {isRead && (
          <span className="absolute top-2 right-2 rounded-full bg-ink/80 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-cream">
            Okundu
          </span>
        )}
      </div>
    </motion.button>
  );
}

function SecretCard({ unlocked, readCount, total, onOpen }: { unlocked: boolean; readCount: number; total: number; onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      disabled={!unlocked}
      onClick={onOpen}
      className={`relative w-full overflow-hidden rounded-2xl border px-6 py-8 text-center ${
        unlocked ? "cursor-pointer border-gold/60" : "cursor-not-allowed border-dashed border-white/15"
      }`}
      style={{
        background: unlocked
          ? "linear-gradient(135deg, rgba(243,199,123,.22), rgba(255,122,147,.12))"
          : "rgba(255,255,255,.03)",
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.2 }}
      whileHover={unlocked ? { scale: 1.015 } : undefined}
      whileTap={unlocked ? { scale: 0.98 } : undefined}
    >
      {unlocked && <span aria-hidden className="sheen absolute inset-0" />}
      <motion.div
        key={unlocked ? "open" : "locked"}
        className="relative text-4xl"
        initial={unlocked ? { scale: 0.4, rotate: -30 } : false}
        animate={unlocked ? { scale: [0.4, 1.3, 1], rotate: [-30, 12, 0] } : {}}
        transition={{ duration: 0.9 }}
      >
        {unlocked ? "💌" : "🔒"}
      </motion.div>
      <p className="font-display relative mt-3 text-2xl sm:text-3xl">{unlocked ? "Gizli bir mektup daha var" : "Gizli mektup"}</p>
      <p className="relative mt-2 text-sm text-cream/60">
        {unlocked
          ? "Hepsini okudun. Bu da son sürpriz, aç bakalım."
          : `Tüm mektupları okuyunca kilidi açılır · ${readCount}/${total}`}
      </p>
    </motion.button>
  );
}

type Phase = "sealed" | "opening" | "sliding" | "reading";

function LetterModal({ letter, secret, onClose }: { letter: Letter; secret: boolean; onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>("sealed");
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const timers = [
      window.setTimeout(() => {
        setPhase("opening");
        getAudio().sparkle();
      }, 500),
      window.setTimeout(() => setPhase("sliding"), 1150),
      window.setTimeout(() => {
        setPhase("reading");
        hearts(secret);
      }, 1950),
    ];
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [secret]);

  const paragraphs = letter.message
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const paper = secret ? GOLD_PAPER : LETTER_PAPER;
  const flapOpen = phase !== "sealed";
  const flapInFront = phase === "sealed" || phase === "opening";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={`${letter.title} mektubu`}
    >
      <div className="absolute inset-0 bg-[#07050d]/80 backdrop-blur-md" onClick={onClose} />

      <AnimatePresence mode="wait">
        {phase !== "reading" ? (
          <motion.div
            key="envelope"
            className="relative aspect-[4/3] w-[min(86vw,400px)]"
            style={{ perspective: 1200 }}
            initial={{ scale: 0.6, y: 60, opacity: 0, rotate: -6 }}
            animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 140, opacity: 0, scale: 0.9, transition: { duration: 0.45, ease: "easeIn" } }}
            transition={{ type: "spring", stiffness: 150, damping: 17 }}
          >
            {/* İç yüz */}
            <div className="absolute inset-0 rounded-2xl" style={{ background: "linear-gradient(180deg,#cdb38a,#e6d3b2)", zIndex: 0 }} />

            {/* İçerideki mektup */}
            <motion.div
              className="absolute inset-x-[7%] bottom-[5%] h-[88%] rounded-lg p-5 shadow-md"
              style={{ background: paper, zIndex: 1 }}
              animate={{ y: phase === "sliding" ? "-58%" : "0%" }}
              transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <div className="space-y-2.5 opacity-50">
                {[70, 92, 84, 60].map((w, i) => (
                  <div key={i} className="h-[3px] rounded bg-ink/30" style={{ width: `${w}%` }} />
                ))}
              </div>
            </motion.div>

            {/* Ön cep */}
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: PAPER,
                clipPath: "polygon(0 36%, 50% 70%, 100% 36%, 100% 100%, 0 100%)",
                zIndex: 2,
              }}
            />

            {/* Kapak */}
            <motion.div
              className="absolute inset-x-0 top-0 h-[62%]"
              style={{ transformOrigin: "50% 0%", zIndex: flapInFront ? 3 : 0, filter: "drop-shadow(0 4px 4px rgba(58,42,30,.2))" }}
              animate={{ rotateX: flapOpen ? 180 : 0 }}
              transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="absolute inset-0 rounded-t-2xl" style={{ background: FLAP, clipPath: "polygon(0 0,100% 0,50% 100%)" }} />
            </motion.div>

            {/* Mühür */}
            <motion.div
              className="absolute top-[62%] left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ zIndex: 4 }}
              animate={flapOpen ? { scale: [1, 1.25, 0], rotate: [0, -10, 25], opacity: [1, 1, 0] } : { scale: [1, 1.06, 1] }}
              transition={flapOpen ? { duration: 0.45 } : { duration: 0.9, repeat: Infinity }}
            >
              <WaxSeal color={letter.seal} emoji={letter.emoji} size={64} />
            </motion.div>
          </motion.div>
        ) : (
          <motion.article
            key="letter"
            className="relative max-h-[86svh] w-full max-w-[560px] overflow-y-auto overscroll-contain rounded-[22px] px-6 pt-10 pb-8 text-ink shadow-[0_40px_80px_-20px_rgba(0,0,0,.8)] sm:px-10"
            style={{ background: paper }}
            initial={{ y: 160, scale: 0.8, opacity: 0, rotate: -3 }}
            animate={{ y: 0, scale: 1, opacity: 1, rotate: 0 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Kapat"
              className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full text-ink/50 transition-colors hover:bg-ink/10 hover:text-ink"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>

            <div className="flex flex-col items-center text-center">
              <WaxSeal color={letter.seal} emoji={letter.emoji} size={52} broken />
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-ink/45">
                {secret ? "Gizli mektup" : "Sana bir mektup"}
              </p>
              <h3 className="font-hand mt-1 text-4xl leading-none sm:text-5xl">{letter.title}</h3>
              {letter.name && <p className="mt-1 text-sm text-ink/50">{letter.name}</p>}
            </div>

            <div className="mx-auto my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-ink/15" />
              <span className="text-xs text-ink/30">✦</span>
              <div className="h-px flex-1 bg-ink/15" />
            </div>

            {paragraphs.length > 0 ? (
              <>
                {paragraphs.map((p, i) => (
                  <motion.p
                    key={i}
                    className="font-hand mb-4 text-[1.5rem] leading-[1.35] whitespace-pre-line sm:text-[1.65rem]"
                    initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.35 + i * 0.4, duration: 0.7 }}
                  >
                    {p}
                  </motion.p>
                ))}
                <motion.p
                  className="font-hand mt-6 text-right text-3xl"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + paragraphs.length * 0.4, duration: 0.7 }}
                >
                  — {letter.signature || letter.title}
                </motion.p>
              </>
            ) : (
              <p className="font-hand py-6 text-center text-2xl leading-snug text-ink/60">
                Bu mektup henüz yolda… ✉️
                <br />
                Çok yakında burada olacak.
              </p>
            )}

            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-cream transition-transform active:scale-95"
              >
                Zarfı kapat
              </button>
            </div>
          </motion.article>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function LettersSection() {
  const letters = birthday.letters;
  const [read, setRead] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState<{ letter: Letter; secret: boolean } | null>(null);
  const wasAllRead = useRef<boolean | null>(null);

  useEffect(() => {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(parsed)) setRead(parsed.filter((x): x is string => typeof x === "string"));
    } catch {
      // depolama kapalıysa okunanlar bu oturumla sınırlı kalır
    }
    setLoaded(true);
  }, []);

  const markRead = (id: string) => {
    setRead((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // yok say
      }
      return next;
    });
  };

  const readCount = letters.filter((l) => read.includes(l.id)).length;
  const allRead = letters.length > 0 && readCount === letters.length;

  // Son mektup kapanınca gizli mektubun kilidi açılır
  useEffect(() => {
    if (!loaded) return;
    if (wasAllRead.current === null) {
      wasAllRead.current = allRead;
      return;
    }
    if (!allRead) {
      wasAllRead.current = false;
      return;
    }
    if (!wasAllRead.current && !active) {
      wasAllRead.current = true;
      const t = window.setTimeout(() => {
        celebrate(1600);
        getAudio().chime();
        toast("Gizli mektubun kilidi açıldı 🔓");
      }, 450);
      return () => window.clearTimeout(t);
    }
  }, [loaded, allRead, active]);

  const close = useCallback(() => setActive(null), []);

  const open = (letter: Letter, secret = false) => {
    if (!secret) markRead(letter.id);
    setActive({ letter, secret });
  };

  return (
    <section id="mektuplar" className="relative px-5 py-24 md:py-32">
      <SectionTitle eyebrow="Posta kutun dolu" title={<>Sana <em>mektuplar</em> var</>}>
        Seni sevenler yazdı. Her zarfa dokun, mührü kır ve oku. Acele etme.
      </SectionTitle>

      <div className="mx-auto mb-10 max-w-xs">
        <div className="flex justify-between text-xs text-cream/55">
          <span>Okunan mektuplar</span>
          <span className="tabular-nums">
            {readCount}/{letters.length}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-gold to-rose"
            initial={false}
            animate={{ width: `${letters.length ? (readCount / letters.length) * 100 : 0}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-4 sm:gap-6">
        {letters.map((letter, i) => (
          <EnvelopeCard key={letter.id} letter={letter} index={i} isRead={read.includes(letter.id)} onOpen={() => open(letter)} />
        ))}
        <SecretCard
          unlocked={allRead}
          readCount={readCount}
          total={letters.length}
          onOpen={() => open(birthday.secretLetter, true)}
        />
      </div>

      <AnimatePresence>
        {active && <LetterModal key={active.letter.id} letter={active.letter} secret={active.secret} onClose={close} />}
      </AnimatePresence>
    </section>
  );
}
