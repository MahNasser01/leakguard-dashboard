import { Shield, Globe, Zap } from "lucide-react";

const stats = [
  {
    icon: Shield,
    text: "Monitoring 500K+ daily AI interactions",
  },
  {
    icon: Globe,
    text: "Supporting Arabic & 40+ languages",
  },
  {
    icon: Zap,
    text: "Delivering sub-30ms response time",
  },
];

const StatsTicker = () => {
  return (
    <div className="relative border-y border-border/50 bg-secondary/30 backdrop-blur-sm overflow-hidden">
      <div className="container mx-auto py-8">
        {/* Desktop: Static Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-center gap-3 px-6">
              <stat.icon className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">{stat.text}</span>
            </div>
          ))}
        </div>

        {/* Mobile: Scrolling Animation */}
        <div className="md:hidden flex gap-12 animate-slide-left">
          {[...stats, ...stats, ...stats].map((stat, index) => (
            <div key={index} className="flex items-center gap-3 px-6 whitespace-nowrap">
              <stat.icon className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">{stat.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsTicker;