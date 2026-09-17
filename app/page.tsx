"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import GiftGate from "@/components/GiftGate";
import Hero from "@/components/Hero";
import TimeSection from "@/components/TimeSection";
import CakeSection from "@/components/CakeSection";
import LettersSection from "@/components/LettersSection";
import ScratchSection from "@/components/ScratchSection";
import MemoriesSection from "@/components/MemoriesSection";
import FinalSection from "@/components/FinalSection";
import { MusicToggle, StarField, Toaster } from "@/components/Shared";
import { getAudio } from "@/lib/audio";

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [musicOn, setMusicOn] = useState(false);

  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    if (opened) window.scrollTo(0, 0);
  }, [opened]);

  const start = useCallback(() => {
    getAudio().play();
    setMusicOn(true);
  }, []);

  const finishGate = useCallback(() => setOpened(true), []);

  const toggleMusic = () => {
    const audio = getAudio();
    if (audio.playing) audio.pause();
    else audio.play();
    setMusicOn(audio.playing);
  };

  return (
    <main className="relative">
      <StarField />
      <Toaster />

      <AnimatePresence>{!opened && <GiftGate key="gate" onStart={start} onDone={finishGate} />}</AnimatePresence>

      {opened && (
        <>
          <Hero />
          <TimeSection />
          <CakeSection />
          <LettersSection />
          <ScratchSection />
          <MemoriesSection />
          <FinalSection />
          <MusicToggle on={musicOn} onToggle={toggleMusic} />
        </>
      )}
    </main>
  );
}
