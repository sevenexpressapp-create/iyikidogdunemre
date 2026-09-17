"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { birthday } from "@/data/birthday";
import { SectionTitle } from "@/components/Shared";

function parseBirth(value: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

function fullYears(born: Date, now: Date) {
  let y = now.getFullYear() - born.getFullYear();
  if (now.getMonth() < born.getMonth() || (now.getMonth() === born.getMonth() && now.getDate() < born.getDate())) y -= 1;
  return y;
}

function Ticker({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-5 text-center backdrop-blur sm:py-7">
      <div className="font-display relative h-[1.1em] overflow-hidden text-4xl text-gold tabular-nums sm:text-5xl">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            className="block"
            initial={{ y: "-70%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "70%", opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-cream/55">{label}</p>
    </div>
  );
}

export default function TimeSection() {
  const born = useMemo(() => parseBirth(birthday.birthDate), []);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    if (!born) return;
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, [born]);

  if (!born || !now) return null;

  const totalSec = Math.max(0, Math.floor((now.getTime() - born.getTime()) / 1000));
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  const heartbeats = Math.round((totalSec / 60) * 75);
  const weekday = born.toLocaleDateString("tr-TR", { weekday: "long" });
  const fmt = (n: number) => n.toLocaleString("tr-TR");

  return (
    <section className="relative px-5 py-24 md:py-32">
      <SectionTitle eyebrow="Hesapladık" title={<>Tam bu kadar zamandır <em>iyi ki varsın</em></>}>
        Sayaç durmuyor. Sen bu satırı okurken bile büyüyorsun 🙂
      </SectionTitle>

      <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <Ticker value={fmt(days)} label="gün" />
        <Ticker value={String(hours).padStart(2, "0")} label="saat" />
        <Ticker value={String(minutes).padStart(2, "0")} label="dakika" />
        <Ticker value={String(seconds).padStart(2, "0")} label="saniye" />
      </div>

      <motion.div
        className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3 text-sm text-cream/70"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
          ☀️ Güneşin etrafında <b className="text-cream">{fullYears(born, now)}</b> tur
        </span>
        <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
          ❤️ Yaklaşık <b className="text-cream">{fmt(heartbeats)}</b> kalp atışı
        </span>
        <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
          📅 Dünyaya geldiğin gün: <b className="text-cream capitalize">{weekday}</b>
        </span>
      </motion.div>
    </section>
  );
}
