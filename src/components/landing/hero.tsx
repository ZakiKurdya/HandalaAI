"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, useCallback } from "react";
import { useI18n } from "@/i18n/provider";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

export function Hero() {
  const { t, dir } = useI18n();
  const ref = useRef<HTMLDivElement>(null);

  // Scroll parallax
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const characterY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity    = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // Mouse parallax for character
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 18 });

  const handleMouse = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mouseX.set((e.clientX - cx) / 22);
    mouseY.set((e.clientY - cy) / 22);
  }, [mouseX, mouseY]);

  const resetMouse = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <section
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
      className="relative overflow-hidden min-h-[90vh] flex items-center"
    >
      {/* Kufiya watermark */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04] dark:opacity-[0.06]" aria-hidden>
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="kuf2" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
              <g stroke="currentColor" strokeWidth="0.8" fill="none">
                <path d="M0 24 L12 12 L24 24 L36 12 L48 24"/>
                <path d="M0 48 L12 36 L24 48 L36 36 L48 48"/>
                <path d="M24 0 L24 48" strokeDasharray="2 6" opacity="0.5"/>
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#kuf2)" className="text-olive-900 dark:text-olive-200"/>
        </svg>
      </div>



      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">

        {/* ── Left: text ── */}
        <motion.div style={{ opacity }} className="order-2 lg:order-1 z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="block h-px w-10 bg-carmine-500" />
            <span className="text-xs font-medium uppercase tracking-widest text-muted">
              {t.landing.eyebrow}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.06 }}
            className="text-4xl sm:text-5xl xl:text-6xl font-bold leading-[1.08] tracking-tight"
          >
            {t.landing.heroTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.14 }}
            className="mt-5 font-arabic text-2xl sm:text-3xl font-semibold accent-text"
          >
            {t.tagline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 text-base sm:text-lg text-muted leading-relaxed max-w-xl"
          >
            {t.landing.heroSub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Link href="/chat">
              <Button size="lg" className="group">
                {t.landing.ctaStart}
                <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </Button>
            </Link>
          </motion.div>

          {/* Palestinian flag stripe */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
            style={{ transformOrigin: dir === "rtl" ? "right" : "left" }}
            className="mt-10 flex h-1.5 w-48 overflow-hidden rounded-full"
          >
            <span className="flex-1 bg-black dark:bg-white" />
            <span className="flex-1 bg-white dark:bg-black border-y border-olive-200/30" />
            <span className="flex-1 bg-olive-600" />
            <span className="w-6 bg-carmine-600" />
          </motion.div>
        </motion.div>

        {/* ── Right: Handala character ── */}
        <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
          <motion.div
            style={{ y: characterY, x: springX, rotateY: springX }}
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10"
          >
            {/* Warm glow behind */}
            <div
              className="absolute inset-[-15%] rounded-full pointer-events-none -z-10 opacity-60"
              style={{
                background: "radial-gradient(ellipse at center, rgb(148 168 81 / 0.18) 0%, transparent 70%)",
              }}
              aria-hidden
            />

            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, -1, 1, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.04, rotate: -3 }}
            >
              <Image
                src="/handala-character.png"
                alt="Handala — the Palestinian witness"
                width={400}
                height={490}
                priority
                className="w-52 sm:w-72 lg:w-80 xl:w-96 h-auto object-contain drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-6 w-full"
        style={{
          backgroundImage: "url('/black-white kufia.jpg')",
          backgroundSize: "100px",
          backgroundRepeat: "repeat",
        }}
      />
    </section>
  );
}
