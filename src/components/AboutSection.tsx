import { Target, Users, Lightbulb, TrendingUp } from "lucide-react";
import entrepreneursImage from "@/assets/entrepreneurs.jpg";
import partnershipImage from "@/assets/partnership.jpg";

const AboutSection = () => {
  const features = [
    {
      icon: Target,
      title: "Pitch to Investors",
      description: "Present your startup to a panel of experienced angel investors ready to fund promising ventures.",
    },
    {
      icon: Users,
      title: "Inclusive Programs",
      description: "Tailored support for youth and women entrepreneurs fostering diversity in Ghana's startup ecosystem.",
    },
    {
      icon: Lightbulb,
      title: "Expert Mentorship",
      description: "Access guidance from seasoned entrepreneurs and industry leaders who've built successful businesses.",
    },
    {
      icon: TrendingUp,
      title: "Accelerate Growth",
      description: "Connect with resources, networks, and opportunities to scale your business sustainably.",
    },
  ];

  return (
    <section id="about" className="py-24 bg-soft-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">About The Program</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-deep-black mt-3 mb-6">
            Powered by <span className="text-gradient-flame">Duapa Werkspace</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Based in Takoradi, we empower startups and entrepreneurs with essential support, resources, and mentorship to accelerate growth while connecting partners with sustainable innovation opportunities.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-6 rounded-2xl bg-pure-white shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-14 h-14 rounded-xl flame-gradient flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold text-deep-black mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Image Section */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="relative">
            <img 
              src={entrepreneursImage}
              alt="Entrepreneurs collaborating"
              className="rounded-2xl shadow-elevated w-full"
            />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/20 rounded-2xl -z-10" />
          </div>
          <div className="space-y-6">
            <h3 className="font-display text-3xl font-bold text-deep-black">
              Building Ghana's Next Generation of Business Leaders
            </h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Our tailored programs for youth and women foster inclusivity, skill development, and access to funding, driving sustainable success within the entrepreneurial ecosystem through community networking and collaboration.
            </p>
            <div className="relative">
              <img 
                src={partnershipImage}
                alt="Business partnership"
                className="rounded-2xl shadow-card w-full max-w-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
