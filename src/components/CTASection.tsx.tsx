import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl border border-primary/20 bg-gradient-to-br from-card to-secondary/50 p-12 md:p-16 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-glow opacity-50" />
            
            {/* Content */}
            <div className="relative z-10 text-center space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold">
                Ready to secure your{" "}
                <span className="bg-gradient-accent bg-clip-text text-transparent">
                  AI applications?
                </span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Join leading MENA enterprises in protecting their AI infrastructure. Get started in minutes.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button variant="heroPrimary" size="lg" className="text-base px-8">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="hero" size="lg" className="text-base px-8">
                  Contact Sales
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;