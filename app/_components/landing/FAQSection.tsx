import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Nexly?",
    answer: "Nexly is a dual-sided marketplace that connects content creators with brands for collaboration opportunities. Our platform uses AI-powered matching to help brands find the perfect creators for their campaigns, while giving creators access to exclusive partnership opportunities.",
  },
  {
    question: "How do I get started as a creator?",
    answer: "Simply sign up for a free account, connect your social media accounts, and complete your creator profile. Our AI will start matching you with relevant brand opportunities based on your niche, audience, and engagement metrics.",
  },
  {
    question: "Is Nexly free to use?",
    answer: "We offer a free tier for creators that includes basic profile features and access to browse opportunities. Premium plans unlock advanced features like priority placement, direct messaging with brands, and detailed analytics.",
  },
  {
    question: "How does the brand-creator matching work?",
    answer: "Our AI analyzes multiple factors including audience demographics, engagement rates, content style, and brand values to suggest the best creator-brand matches. Brands can also use filters to search for creators manually.",
  },
  {
    question: "What platforms are supported?",
    answer: "Nexly supports all major social platforms including TikTok, YouTube, Instagram, Twitter/X, Twitch, and LinkedIn. You can connect multiple accounts to showcase your full creator portfolio.",
  },
  {
    question: "How do payments work?",
    answer: "Nexly facilitates secure payments between brands and creators. Brands deposit funds into escrow when a collaboration is agreed upon, and creators receive payment upon successful completion of deliverables.",
  },
  {
    question: "What kind of brands use Nexly?",
    answer: "Our platform serves businesses of all sizes - from startups and small businesses to Fortune 500 companies. Any brand looking to leverage influencer marketing can benefit from our creator network.",
  },
  {
    question: "How is my data protected?",
    answer: "We take data privacy seriously. Your personal information is encrypted and never shared without consent. We comply with GDPR and other privacy regulations. See our Privacy Policy for complete details.",
  },
  {
    question: "Can I use Nexly for commercial collaborations?",
    answer: "Absolutely! Nexly is designed specifically for commercial collaborations between creators and brands. All collaborations facilitated through our platform are intended for commercial purposes.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          {/* Left column - Title */}
          <div className="lg:col-span-4">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 sticky top-24">
              Frequently asked
              <br />
              questions
            </h2>
          </div>

          {/* Right column - Accordion */}
          <div className="lg:col-span-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border-b border-gray-200 py-2"
                >
                  <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline py-4 text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
