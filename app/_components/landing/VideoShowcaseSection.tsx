import { motion } from "framer-motion";
import heroVideo from "@/assets/hero-video.mp4";

const VideoShowcaseSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            See Nexly in Action
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch how easy it is to discover, analyze, and connect with the perfect creators for your brand.
          </p>
        </motion.div>

        {/* Video */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
            <video
              src={heroVideo}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto"
            />
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-10"
        >
          <a
            href="/auth"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started Free
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoShowcaseSection;
