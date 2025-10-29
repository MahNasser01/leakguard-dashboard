const TrustSection = () => {
    const partners = [
      "Saudi Aramco",
      "Emirates NBD",
      "Qatar Airways",
      "Etisalat",
      "Majid Al Futtaim",
      "ADNOC",
    ];
  
    return (
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            {/* Section Title */}
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                Trusted by{" "}
                <span className="bg-gradient-accent bg-clip-text text-transparent">
                  MENA's leading enterprises
                </span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Protecting AI applications for organizations across the Middle East and North Africa
              </p>
            </div>
  
            {/* Partner Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8">
              {partners.map((partner, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center p-6 rounded-lg border border-border/50 bg-card/50 hover:border-primary/30 hover:bg-card transition-all duration-300"
                >
                  <span className="text-lg font-semibold text-muted-foreground">
                    {partner}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default TrustSection;