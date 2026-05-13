import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";

const FinalCTASection = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-primary/5 via-white to-accent/5 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Start using Duolync for free 🌟
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Embark freely and witness Duolync's magic firsthand. When the stars
              align for growth, scale at your own rhythm. Freedom to cancel
              anytime, no pressure, no hidden fees – just endless possibilities.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <Button
              className="btn-gradient text-base h-14 px-10 gap-2 shadow-xl rounded-full"
              asChild
            >
              <Link href="/auth">
                Start for Free
                <ArrowRight size={18} />
              </Link>
            </Button>

            <Button
              variant="outline"
              className="h-14 px-8 rounded-full border-2 gap-2"
              asChild
            >
              <Link href="/auth">
                <Chrome size={18} />
                Or download our free extension
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
