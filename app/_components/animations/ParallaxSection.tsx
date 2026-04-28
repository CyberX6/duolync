import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down";
}

export const ParallaxElement = ({
  children,
  className = "",
  speed = 0.5,
  direction = "up",
}: ParallaxSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const multiplier = direction === "up" ? -1 : 1;
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed * multiplier, -100 * speed * multiplier]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

interface StickyScrollSectionProps {
  children: ReactNode;
  className?: string;
  backgroundColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export const StickyScrollSection = ({
  children,
  className = "",
  backgroundColor,
  gradientFrom,
  gradientTo,
}: StickyScrollSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.95, 1, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);

  const style: React.CSSProperties = {};
  if (backgroundColor) {
    style.backgroundColor = backgroundColor;
  }
  if (gradientFrom && gradientTo) {
    style.background = `linear-gradient(180deg, ${gradientFrom} 0%, ${gradientTo} 100%)`;
  }

  return (
    <motion.section
      ref={ref}
      style={{ scale, opacity, ...style }}
      className={`relative ${className}`}
    >
      {children}
    </motion.section>
  );
};

interface GradientTransitionProps {
  children: ReactNode;
  className?: string;
}

export const GradientTransitionSection = ({
  children,
  className = "",
}: GradientTransitionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div
        style={{ opacity: backgroundOpacity }}
        className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white pointer-events-none"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
