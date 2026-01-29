import { useState, FormEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, Send, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const businessCategories = [
  "Food & Beverage",
  "Technology",
  "App / Website",
  "Agriculture / Agritech",
  "Health / Wellness",
  "Fitness",
  "Education / Edtech",
  "Beauty",
  "Clothing / Fashion",
  "Entertainment",
  "Financial Services / Fintech",
  "Transportation / Logistics",
  "Energy / CleanTech",
  "Manufacturing",
  "Other",
];

const businessPhases = [
  { value: "idea", label: "Idea Stage" },
  { value: "research", label: "Research & Development" },
  { value: "prototype", label: "Prototype / Beta Testing" },
  { value: "crowdfunding", label: "Crowdfunding" },
  { value: "operating", label: "Operating / Revenue Generating" },
];

const regions = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Central",
  "Eastern",
  "Volta",
  "Northern",
  "Upper East",
  "Upper West",
  "Brong-Ahafo",
  "Western North",
  "Ahafo",
  "Bono East",
  "Oti",
  "Savannah",
  "North East",
];

interface FormData {
  firstName: string;
  lastName: string;
  guardianName: string;
  phone: string;
  email: string;
  city: string;
  region: string;
  pronouns: string;
  occupation: string;
  businessName: string;
  website: string;
  categories: string[];
  phase: string;
  hasCollaborators: string;
  collaboratorNames: string;
  description: string;
  productImage: File | null;
  agreedToTerms: boolean;
  signature: string;
}

const ApplicationForm = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    guardianName: "",
    phone: "",
    email: "",
    city: "",
    region: "",
    pronouns: "",
    occupation: "",
    businessName: "",
    website: "",
    categories: [],
    phase: "",
    hasCollaborators: "",
    collaboratorNames: "",
    description: "",
    productImage: null,
    agreedToTerms: false,
    signature: "",
  });

  const updateField = (field: keyof FormData, value: FormData[keyof FormData]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateField("productImage", file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    toast({
      title: "Application Submitted!",
      description: "We'll review your application and get back to you soon.",
    });
  };

  if (isSubmitted) {
    return (
      <section id="application" className="py-24 bg-soft-white">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="bg-pure-white rounded-2xl shadow-elevated p-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flame-gradient flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="font-display text-3xl font-bold text-deep-black mb-4">
              Application Received!
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Thank you for applying to Pitch 2 Angels. Our team will review your submission and contact you within 7-10 business days.
            </p>
            <p className="text-sm text-muted-foreground">
              Keep an eye on your email (<span className="text-primary font-medium">{formData.email}</span>) for updates.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="application" className="py-24 bg-soft-white">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Ready to Pitch?</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-deep-black mt-3 mb-6">
            Apply Now
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Complete the application form below for your chance to pitch to our panel of angel investors
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <button
                onClick={() => setStep(s)}
                className={`w-10 h-10 rounded-full font-bold flex items-center justify-center transition-all ${
                  step === s 
                    ? 'flame-gradient text-primary-foreground shadow-flame' 
                    : step > s 
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {step > s ? <CheckCircle className="w-5 h-5" /> : s}
              </button>
              {s < 3 && <div className={`w-12 h-1 rounded ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-pure-white rounded-2xl shadow-elevated p-8 md:p-12">
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="font-display text-2xl font-bold text-deep-black mb-6">Personal Information</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      required
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      required
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guardianName">Guardian Name (if applicant is under 18)</Label>
                  <Input
                    id="guardianName"
                    value={formData.guardianName}
                    onChange={(e) => updateField("guardianName", e.target.value)}
                    placeholder="Parent or legal guardian's name"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      required
                      placeholder="+233 XX XXX XXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      required
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      required
                      placeholder="Your city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Region *</Label>
                    <Select value={formData.region} onValueChange={(v) => updateField("region", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your region" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region} value={region}>{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Pronouns *</Label>
                    <Select value={formData.pronouns} onValueChange={(v) => updateField("pronouns", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pronouns" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="he/him">He/Him</SelectItem>
                        <SelectItem value="she/her">She/Her</SelectItem>
                        <SelectItem value="they/them">They/Them</SelectItem>
                        <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation *</Label>
                    <Input
                      id="occupation"
                      value={formData.occupation}
                      onChange={(e) => updateField("occupation", e.target.value)}
                      required
                      placeholder="e.g., Engineer, Teacher, Full-time Entrepreneur"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <Button type="button" variant="flame" size="lg" onClick={() => setStep(2)}>
                    Next Step
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Business Information */}
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="font-display text-2xl font-bold text-deep-black mb-6">Business Information</h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business / Product Name *</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => updateField("businessName", e.target.value)}
                      required
                      placeholder="Your business name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Company Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => updateField("website", e.target.value)}
                      placeholder="https://yourbusiness.com"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Business Category (select all that apply) *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {businessCategories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className={`p-3 rounded-lg text-sm font-medium transition-all border ${
                          formData.categories.includes(category)
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border bg-muted/50 text-muted-foreground hover:border-primary/50'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Current Business Phase *</Label>
                  <Select value={formData.phase} onValueChange={(v) => updateField("phase", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your business phase" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessPhases.map((phase) => (
                        <SelectItem key={phase.value} value={phase.value}>{phase.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Are you applying with collaborators? *</Label>
                    <Select value={formData.hasCollaborators} onValueChange={(v) => updateField("hasCollaborators", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No, I'm applying alone</SelectItem>
                        <SelectItem value="yes">Yes, with co-founders</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.hasCollaborators === "yes" && (
                    <div className="space-y-2">
                      <Label htmlFor="collaboratorNames">Collaborator Names</Label>
                      <Input
                        id="collaboratorNames"
                        value={formData.collaboratorNames}
                        onChange={(e) => updateField("collaboratorNames", e.target.value)}
                        placeholder="Names of co-founders"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-6">
                  <Button type="button" variant="darkOutline" size="lg" onClick={() => setStep(1)}>
                    <ArrowLeft className="w-5 h-5" />
                    Previous
                  </Button>
                  <Button type="button" variant="flame" size="lg" onClick={() => setStep(3)}>
                    Next Step
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Pitch Details & Submit */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="font-display text-2xl font-bold text-deep-black mb-6">Pitch Details</h3>

                <div className="space-y-2">
                  <Label htmlFor="description">Describe Your Business / Product *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    required
                    placeholder="Provide a brief, non-confidential description of your business or product. What problem does it solve? Who is your target market? (Max 500 words)"
                    className="min-h-[150px]"
                  />
                  <p className="text-sm text-muted-foreground">
                    {formData.description.split(/\s+/).filter(Boolean).length} / 500 words
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Product / Business Photo</Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="productImage"
                    />
                    <label htmlFor="productImage" className="cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      {formData.productImage ? (
                        <p className="text-primary font-medium">{formData.productImage.name}</p>
                      ) : (
                        <>
                          <p className="text-muted-foreground mb-1">Drop image here or click to upload</p>
                          <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                  <h4 className="font-display font-bold text-deep-black">Terms & Acknowledgment</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    By submitting this application, you acknowledge that your submission is not confidential and no fiduciary relationship is created. Duapa Werkspace may possess similar information and reserves the right to modify eligibility requirements. You release Duapa Werkspace and partners from claims related to your submission.
                  </p>
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={formData.agreedToTerms}
                      onCheckedChange={(checked) => updateField("agreedToTerms", checked === true)}
                    />
                    <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                      I have read and agree to the terms above and confirm that I meet all eligibility requirements. *
                    </label>
                  </div>
                </div>

                {/* Digital Signature */}
                <div className="space-y-2">
                  <Label htmlFor="signature">Digital Signature (Type Your Full Name) *</Label>
                  <Input
                    id="signature"
                    value={formData.signature}
                    onChange={(e) => updateField("signature", e.target.value)}
                    required
                    placeholder="Type your full legal name"
                    className="font-medium"
                  />
                </div>

                <div className="flex justify-between pt-6">
                  <Button type="button" variant="darkOutline" size="lg" onClick={() => setStep(2)}>
                    <ArrowLeft className="w-5 h-5" />
                    Previous
                  </Button>
                  <Button 
                    type="submit" 
                    variant="flame" 
                    size="lg"
                    disabled={!formData.agreedToTerms || !formData.signature || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default ApplicationForm;
