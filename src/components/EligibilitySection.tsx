import { Check, X } from "lucide-react";

const EligibilitySection = () => {
  const requirements = [
    {
      eligible: true,
      text: "Must be 18 years of age or older (minors require parent/guardian application)",
    },
    {
      eligible: true,
      text: "Must be a legal resident of Ghana or authorized to conduct business in Ghana",
    },
    {
      eligible: true,
      text: "Must have a business idea, prototype, or operating company",
    },
    {
      eligible: true,
      text: "Must be willing to present your pitch on camera and before a live audience",
    },
    {
      eligible: true,
      text: "Must voluntarily submit to a background verification check",
    },
    {
      eligible: false,
      text: "Must not provide false, misleading, or incomplete business information during application or pitching",
    },
    {
      eligible: false,
      text: "Cannot have any pending legal disputes regarding business ownership",
    },
  ];

  return (
    <section id="eligibility" className="py-24 hero-gradient">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Before You Apply</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-pure-white mt-3 mb-6">
              Eligibility Requirements
            </h2>
            <p className="text-soft-white/70 text-lg">
              Please ensure you meet the following criteria before submitting your application
            </p>
          </div>

          {/* Requirements List */}
          <div className="bg-secondary/50 backdrop-blur-sm rounded-2xl p-8 border border-primary/10">
            <div className="space-y-4">
              {requirements.map((req, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl bg-deep-black/30 hover:bg-deep-black/50 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    req.eligible ? 'bg-green-500/20' : 'bg-destructive/20'
                  }`}>
                    {req.eligible ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <X className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                  <p className="text-soft-white/90">{req.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Important Notice */}
          <div className="mt-8 p-6 rounded-xl border-2 border-primary/30 bg-primary/5">
            <p className="text-soft-white/80 text-sm leading-relaxed">
              <span className="text-primary font-semibold">Important Notice:</span> By submitting an application, you acknowledge that Duapa Werkspace has sole discretion in participant selection. All official communication will come from <span className="text-primary">@duapawerkspace.com</span> email addresses. Be wary of fraudulent communications from other domains.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EligibilitySection;
