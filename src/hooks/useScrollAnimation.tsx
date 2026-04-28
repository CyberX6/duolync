import { useEffect, useRef } from "react";
import { useInView, useScroll, useTransform, MotionValue } from "framer-motion";

export const useScrollReveal = (threshold = 0.2) => {
  const ref = useRef<HTMLDivElement>(null);
  const margin = `-${Math.round(threshold * 100)}px 0px` as const;
  const isInView = useInView(ref, { once: true, margin: margin as any });
  
  return { ref, isInView };
};

export const useParallax = (value: MotionValue<number>, distance: number) => {
  return useTransform(value, [0, 1], [-distance, distance]);
};

export const useSmoothScroll = () => {
  useEffect(() => {
    // Add smooth scrolling to html element
    document.documentElement.style.scrollBehavior = "smooth";
    
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);
};

export const useScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  return scrollYProgress;
};

export const useSectionScroll = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  return { ref, scrollYProgress };
};
