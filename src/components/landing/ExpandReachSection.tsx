import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Rocket, ChevronDown } from "lucide-react";
import expandHeroImage from "@/assets/expand-hero-creator.jpg";

const MagicExpandSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Image fades in as user scrolls (0.3 -> 1)
  const imageOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.7, 1]);
  
  // Card stays visible throughout
  const cardOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 1]);
  
  // Scroll indicator fades out as user starts scrolling
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  return (
    <section 
      ref={containerRef}
      className="min-h-screen bg-[#faf9f7] relative"
    >
      {/* Normal scrolling container */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background image with fade effect */}
        <motion.div 
          className="absolute inset-0"
          style={{ opacity: imageOpacity }}
        >
          <img
            src={expandHeroImage}
            alt="Creator with phone"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </motion.div>
        
        {/* Single card - bottom half, 60% width */}
        <motion.div 
          className="absolute bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 w-[90%] md:w-[60%]"
          style={{ opacity: cardOpacity }}
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 md:p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              {/* Badge */}
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-purple-600 text-white px-3 py-1 rounded-full">
                <Rocket size={12} />
                GROW
              </span>
              {/* Title */}
              <h2 className="font-display text-xl md:text-2xl font-bold text-gray-900">
                Expand Your Reach
              </h2>
            </div>
            
            {/* Description */}
            <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-5">
              Connect with brands that align with your values and grow your influence. Our AI-powered matching helps you find the perfect collaboration opportunities to take your content career to the next level.
            </p>
            
            {/* Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                className="rounded-full px-6 py-2 h-auto text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white"
              >
                Start Growing
              </Button>
              <Button
                variant="ghost"
                className="rounded-full px-6 py-2 h-auto text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Learn more
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          style={{ opacity: scrollIndicatorOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        >
          <span className="text-white/90 text-sm font-medium tracking-wide drop-shadow-md">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-6 h-6 text-white/90 drop-shadow-md" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default MagicExpandSection;
