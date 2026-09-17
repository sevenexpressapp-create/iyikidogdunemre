"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { birthday, type Photo } from "@/data/birthday";
import { SectionTitle } from "@/components/Shared";

export default function MemoriesSection() {
  const photos = birthday.photos;
  const [active, setActive] = useState<Photo | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  if (photos.length === 0) return null;

  return (
    <section className="relative px-5 py-24 md:py-32">
      <SectionTitle eyebrow="Anılar" title={<>Biriktirdiğimiz <em>güzel anlar</em></>}>
        Fotoğraflara dokun, büyüsün.
      </SectionTitle>

      <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-6">
        {photos.map((photo, i) => {
          const tilt = [-4, 3, -2, 5, -3, 2][i % 6];
          return (
            <motion.button
              key={photo.src}
              type="button"
              onClick={() => setActive(photo)}
              className="w-[44%] rounded-sm bg-cream p-2.5 pb-10 text-left shadow-[0_25px_40px_-20px_rgba(0,0,0,.9)] sm:w-60"
              initial={{ opacity: 0, y: 40, rotate: tilt * 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: tilt }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              whileHover={{ rotate: 0, scale: 1.04, zIndex: 5 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.src} alt={photo.caption ?? "Anı"} loading="lazy" className="aspect-square w-full object-cover" />
              {photo.caption && <p className="font-hand mt-2 text-center text-xl leading-tight text-ink">{photo.caption}</p>}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#07050d]/90 p-5 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.figure
              className="max-w-3xl rounded-sm bg-cream p-3 pb-4"
              initial={{ scale: 0.8, rotate: -4 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={active.src} alt={active.caption ?? "Anı"} className="max-h-[75svh] w-auto object-contain" />
              {active.caption && <figcaption className="font-hand mt-3 text-center text-2xl text-ink">{active.caption}</figcaption>}
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
