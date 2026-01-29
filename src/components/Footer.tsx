import { Flame, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="hero-gradient py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-8 h-8 text-primary" />
              <span className="font-display text-2xl font-bold text-pure-white">Pitch 2 Angels</span>
            </div>
            <p className="text-soft-white/70 mb-4">
              Powered by Duapa Werkspace – empowering Ghana's next generation of entrepreneurs.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-bold text-pure-white mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-soft-white/70">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Takoradi, Western Region, Ghana</span>
              </div>
              <div className="flex items-center gap-3 text-soft-white/70">
                <Mail className="w-5 h-5 text-primary" />
                <span>apply@duapawerkspace.com</span>
              </div>
              <div className="flex items-center gap-3 text-soft-white/70">
                <Phone className="w-5 h-5 text-primary" />
                <span>+233 XX XXX XXXX</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-bold text-pure-white mb-4">Quick Links</h4>
            <div className="space-y-2">
              <a href="#about" className="block text-soft-white/70 hover:text-primary transition-colors">
                About the Program
              </a>
              <a href="#eligibility" className="block text-soft-white/70 hover:text-primary transition-colors">
                Eligibility Requirements
              </a>
              <a href="#application" className="block text-soft-white/70 hover:text-primary transition-colors">
                Apply Now
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-soft-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-soft-white/50 text-sm">
            © {new Date().getFullYear()} Pitch 2 Angels by Duapa Werkspace. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-soft-white/50 hover:text-primary text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-soft-white/50 hover:text-primary text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
