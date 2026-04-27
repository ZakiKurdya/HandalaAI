"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export function ScrollingOliveBranch() {
  const { scrollYProgress } = useScroll();

  // Diagonal sweep: starts visible at right, drifts all the way to the left
  const rawX = useTransform(scrollYProgress, [0, 1], ["0vw", "-95vw"]);
  // Gentle vertical arc across the page
  const rawY = useTransform(
    scrollYProgress,
    [0, 0.3, 0.65, 1],
    ["0vh", "20vh", "45vh", "65vh"]
  );
  // Slow tumbling rotation — full 270° over the whole scroll
  const rawRotate = useTransform(scrollYProgress, [0, 1], [10, -180]);
  // Subtle scale pulse: slightly larger mid-page
  const rawScale = useTransform(
    scrollYProgress,
    [0, 0.45, 0.8, 1],
    [0.9, 1.12, 1.0, 0.85]
  );

  // Very soft springs for lag-free, buttery motion
  const x      = useSpring(rawX,      { stiffness: 18, damping: 14 });
  const y      = useSpring(rawY,      { stiffness: 18, damping: 14 });
  const rotate = useSpring(rawRotate, { stiffness: 18, damping: 14 });
  const scale  = useSpring(rawScale,  { stiffness: 18, damping: 14 });

  return (
    <motion.div
      aria-hidden
      style={{ x, y, rotate, scale }}
      className="pointer-events-none fixed top-[8vh] right-0 z-[1] w-[44vw] max-w-xl"
    >
      <Image
        src="/olive-branch-light.png"
        alt=""
        width={900}
        height={900}
        className="w-full h-auto object-contain opacity-[0.15]"
        style={{ mixBlendMode: "screen" }}
      />
    </motion.div>
  );
}
