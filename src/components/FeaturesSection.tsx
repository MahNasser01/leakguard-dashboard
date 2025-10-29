import { Shield, Lock, Zap, Globe, AlertTriangle, BarChart } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Real-time Threat Detection",
    description: "Identify and block prompt injection, data leakage, and adversarial attacks in real-time across your AI applications.",
  },
  {
    icon: Lock,
    title: "Data Privacy & Compliance",
    description: "Ensure GDPR and regional compliance with advanced data protection and privacy controls tailored for MENA regulations.",
  },
  {
    icon: Zap,
    title: "Lightning Fast Performance",
    description: "Sub-30ms latency ensures your AI applications remain responsive while staying secure against emerging threats.",
  },
  {
    icon: Globe,
    title: "Multi-language Support",
    description: "Native Arabic language support along with 40+ languages, perfectly suited for the diverse MENA market.",
  },
  {
    icon: AlertTriangle,
    title: "Proactive Monitoring",
    description: "24/7 monitoring with intelligent alerts to keep your team informed of potential security risks before they escalate.",
  },
  {
    icon: BarChart,
    title: "Advanced Analytics",
    description: "Comprehensive insights and reporting on AI interactions, threats detected, and security posture improvements.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold">
              Comprehensive{" "}
              <span className="bg-gradient-accent bg-clip-text text-transparent">
                AI security
              </span>
              {" "}for modern enterprises
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Protect your AI investments with enterprise-grade security designed for the unique challenges of the MENA region
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-glow transition-all duration-300 space-y-4"
              >
                <div className="inline-flex p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;