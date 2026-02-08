import { ArrowRight, MicVocal  } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-pitch.jpg";

const HeroSection = () => {
  const scrollToApplication = () => {
    document.getElementById("application")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Pitch 2 Angels event stage"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-pitch-black/80 via-deep-black/60 to-pitch-black/90" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-40 right-20 w-48 h-48 bg-primary/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <MicVocal className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Season 1 Applications Now Open</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-pure-white mb-6 leading-tight">
            PITCH <span className="text-gradient-flame">2</span> ANGELS
          </h1>
          
          <p className="text-xl md:text-2xl text-soft-white/80 max-w-3xl mx-auto mb-4 font-body">
            Ghana's Premier Investment Showcase
          </p>
          
          <p className="text-lg text-soft-white/60 max-w-2xl mx-auto mb-10 font-body">
            Secure funding, gain mentorship, and scale your startup with Ghana's top angel investors
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="flame" 
              size="xl" 
              onClick={scrollToApplication}
              className="group"
            >
              Apply Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="flameOutline" 
              size="xl"
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { value: "₵500K+", label: "Investment Pool" },
            { value: "10+", label: "Angel Investors" },
            { value: "50+", label: "Startups to Pitch" },
            { value: "1", label: "Transformative Event" },
          ].map((stat, index) => (
            <div 
              key={index} 
              className="text-center animate-fade-up"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <div className="text-3xl md:text-4xl font-bold text-gradient-flame font-display">{stat.value}</div>
              <div className="text-soft-white/60 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
