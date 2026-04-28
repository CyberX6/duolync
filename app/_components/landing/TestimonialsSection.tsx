import { Star, Quote } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Fashion Influencer",
    avatar: "SM",
    followers: "2.5M Followers",
    content: "Nexly completely transformed how I work with brands. The platform made it so easy to find partnerships that truly align with my style and values.",
    rating: 5,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    name: "David Chen",
    role: "Marketing Director, TechBrand",
    avatar: "DC",
    followers: "Fortune 500",
    content: "We've seen a 340% increase in engagement since using Nexly. The AI matching is incredible - every creator we've worked with has been perfect for our brand.",
    rating: 5,
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    name: "Emma Rodriguez",
    role: "Lifestyle Creator",
    avatar: "ER",
    followers: "850K Followers",
    content: "The best part about Nexly is the transparency. I know exactly what to expect from each collaboration, and payments are always on time.",
    rating: 5,
    gradient: "from-orange-500 to-yellow-500",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <ScrollReveal delay={0}>
            <span className="badge-new mb-6 inline-block">Testimonials</span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Loved by{" "}
              <span className="gradient-text">Thousands</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-muted-foreground text-lg">
              See what brands and creators are saying about their experience with Nexly.
            </p>
          </ScrollReveal>
        </div>

        {/* Testimonials Grid */}
        <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
          {testimonials.map((testimonial, index) => (
            <StaggerItem key={index}>
              <div className="card-interactive p-8 relative bg-white h-full">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 text-primary/10">
                  <Quote size={40} />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-foreground mb-8 leading-relaxed relative z-10">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-sm`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-xs text-primary font-medium">{testimonial.followers}</div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default TestimonialsSection;
