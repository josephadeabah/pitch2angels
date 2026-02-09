import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  Send, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  CreditCard, 
  Receipt,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Types
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
  bankName: string;
  accountHolderName: string;
  transactionReference: string;
  amountPaid: string;
  paymentDate: string;
  paymentReceipt: File | null;
  agreedToTerms: boolean;
  signature: string;
}

interface ValidationErrors {
  [key: string]: string;
}

// Constants
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

const pronounsOptions = [
  { value: "he/him", label: "He/Him" },
  { value: "she/her", label: "She/Her" },
  { value: "they/them", label: "They/Them" },
  { value: "prefer-not", label: "Prefer not to say" },
  { value: "other", label: "Other" },
];

const collaboratorOptions = [
  { value: "no", label: "No, I'm applying alone" },
  { value: "yes", label: "Yes, with co-founders" },
];

const ApplicationForm = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [serverError, setServerError] = useState<string>("");
  
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
    hasCollaborators: "no",
    collaboratorNames: "",
    description: "",
    productImage: null,
    bankName: "",
    accountHolderName: "",
    transactionReference: "",
    amountPaid: "",
    paymentDate: "",
    paymentReceipt: null,
    agreedToTerms: false,
    signature: "",
  });

  // Reset validation errors when step changes
  useEffect(() => {
    setValidationErrors({});
    setServerError("");
  }, [step]);

  // Validation functions
  const validateStep1 = (): boolean => {
    const errors: ValidationErrors = {};
    
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) 
      errors.email = "Invalid email format";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.region) errors.region = "Region is required";
    if (!formData.pronouns) errors.pronouns = "Pronouns are required";
    if (!formData.occupation.trim()) errors.occupation = "Occupation is required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: ValidationErrors = {};
    
    if (!formData.businessName.trim()) errors.businessName = "Business name is required";
    if (formData.categories.length === 0) errors.categories = "Select at least one category";
    if (!formData.phase) errors.phase = "Business phase is required";
    if (!formData.hasCollaborators) errors.hasCollaborators = "This field is required";
    if (formData.hasCollaborators === "yes" && !formData.collaboratorNames.trim()) 
      errors.collaboratorNames = "Collaborator names are required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errors: ValidationErrors = {};
    
    if (!formData.description.trim()) errors.description = "Description is required";
    else if (formData.description.split(/\s+/).filter(Boolean).length < 10)
      errors.description = "Description should be at least 10 words";
    
    if (!formData.productImage) errors.productImage = "Product image is required";
    else if (formData.productImage.size > 10 * 1024 * 1024)
      errors.productImage = "Image size should not exceed 10MB";
    
    if (!formData.bankName.trim()) errors.bankName = "Bank name is required";
    if (!formData.accountHolderName.trim()) errors.accountHolderName = "Account holder name is required";
    if (!formData.transactionReference.trim()) errors.transactionReference = "Transaction reference is required";
    if (!formData.amountPaid) errors.amountPaid = "Amount paid is required";
    else if (parseFloat(formData.amountPaid) <= 0)
      errors.amountPaid = "Amount must be greater than 0";
    
    if (!formData.paymentDate) errors.paymentDate = "Payment date is required";
    
    if (!formData.paymentReceipt) errors.paymentReceipt = "Payment receipt is required";
    else if (formData.paymentReceipt.size > 10 * 1024 * 1024)
      errors.paymentReceipt = "File size should not exceed 10MB";
    
    if (!formData.agreedToTerms) errors.agreedToTerms = "You must agree to the terms";
    if (!formData.signature.trim()) errors.signature = "Digital signature is required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Field update handler
  const updateField = (field: keyof FormData, value: FormData[keyof FormData]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Category toggle
  const toggleCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
    if (validationErrors.categories) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.categories;
        return newErrors;
      });
    }
  };

  // File handlers
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image size should not exceed 10MB",
          variant: "destructive",
        });
        return;
      }
      updateField("productImage", file);
    }
  };

  const handleReceiptChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "File size should not exceed 10MB",
          variant: "destructive",
        });
        return;
      }
      updateField("paymentReceipt", file);
    }
  };

  // Step navigation
  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  // Form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validateStep3()) {
      toast({
        title: "Validation Error",
        description: "Please fix all errors before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const form = new FormData();

      // Append all fields
      for (const key in formData) {
        const value = formData[key as keyof FormData];
        if (value !== null && value !== undefined && value !== "") {
          if (key === "categories") {
            form.append(key, JSON.stringify(value));
          } else if (value instanceof File) {
            form.append(key, value);
          } else if (key === "agreedToTerms") {
            form.append(key, value.toString());
          } else {
            form.append(key, value as string);
          }
        }
      }

      // API endpoint (adjust for production)
      const API_URL = process.env.NODE_ENV === 'production' 
        ? 'https://pitch2angels-production.up.railway.app/api/applications'
        : 'https://pitch2angels-production.up.railway.app/api/applications';

      const response = await fetch(API_URL, {
        method: "POST",
        body: form,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Submission failed with status ${response.status}`);
      }

      // Success
      setIsSubmitted(true);
      toast({
        title: "🎉 Application Submitted!",
        description: `Your application ID is ${data.id}. We'll contact you soon.`,
      });

      // Log success (remove in production)
      console.log("Application submitted successfully:", data);

    } catch (error: Error | unknown) {
      console.error("Submission error:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      setServerError(errorMessage);
      
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success screen
  if (isSubmitted) {
    return (
      <section id="application" className="py-24 bg-gradient-to-b from-soft-white to-white">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
              Application Received!
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              Thank you for applying to Pitch 2 Angels. Our team will review your submission and contact you within 7-10 business days.
            </p>
            <div className="bg-emerald-50 rounded-xl p-6 mb-8">
              <p className="text-sm text-emerald-800">
                Keep an eye on your email (<span className="font-semibold">{formData.email}</span>) for updates regarding your application status.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsSubmitted(false);
                  setStep(1);
                  setFormData({
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
                    hasCollaborators: "no",
                    collaboratorNames: "",
                    description: "",
                    productImage: null,
                    bankName: "",
                    accountHolderName: "",
                    transactionReference: "",
                    amountPaid: "",
                    paymentDate: "",
                    paymentReceipt: null,
                    agreedToTerms: false,
                    signature: "",
                  });
                }}
              >
                Submit Another Application
              </Button>
              <Button onClick={() => window.print()}>
                Print Confirmation
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Main form
  return (
    <section id="application" className="py-12 md:py-24 bg-gradient-to-b from-soft-white to-white">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold rounded-full uppercase tracking-wider mb-4">
            Ready to Pitch?
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-6">
            Apply Now
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Complete the application form below for your chance to pitch to our panel of angel investors
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (s < step) setStep(s);
                }}
                className={`w-10 h-10 rounded-full font-bold flex items-center justify-center transition-all ${
                  step === s 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
                    : step > s 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white bg-opacity-20'
                      : 'bg-gray-200 text-gray-400'
                } ${s < step ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
              >
                {step > s ? <CheckCircle className="w-5 h-5" /> : s}
              </button>
              {s < 3 && (
                <div className={`w-12 h-1 rounded ${
                  step > s ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-gray-900">Personal Information</h3>
                    <p className="text-gray-600 text-sm">Tell us about yourself</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      required
                      placeholder="Enter your first name"
                      className={validationErrors.firstName ? "border-red-500" : ""}
                    />
                    {validationErrors.firstName && (
                      <p className="text-red-500 text-sm">{validationErrors.firstName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      required
                      placeholder="Enter your last name"
                      className={validationErrors.lastName ? "border-red-500" : ""}
                    />
                    {validationErrors.lastName && (
                      <p className="text-red-500 text-sm">{validationErrors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guardianName" className="text-gray-700">
                    Guardian Name (if applicant is under 18)
                  </Label>
                  <Input
                    id="guardianName"
                    value={formData.guardianName}
                    onChange={(e) => updateField("guardianName", e.target.value)}
                    placeholder="Parent or legal guardian's name"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      required
                      placeholder="+233 XX XXX XXXX"
                      className={validationErrors.phone ? "border-red-500" : ""}
                    />
                    {validationErrors.phone && (
                      <p className="text-red-500 text-sm">{validationErrors.phone}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      required
                      placeholder="you@example.com"
                      className={validationErrors.email ? "border-red-500" : ""}
                    />
                    {validationErrors.email && (
                      <p className="text-red-500 text-sm">{validationErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-gray-700">
                      City *
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      required
                      placeholder="Your city"
                      className={validationErrors.city ? "border-red-500" : ""}
                    />
                    {validationErrors.city && (
                      <p className="text-red-500 text-sm">{validationErrors.city}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Region *</Label>
                    <Select 
                      value={formData.region} 
                      onValueChange={(v) => updateField("region", v)}
                    >
                      <SelectTrigger className={validationErrors.region ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select your region" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region} value={region}>{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.region && (
                      <p className="text-red-500 text-sm">{validationErrors.region}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Pronouns *</Label>
                    <Select 
                      value={formData.pronouns} 
                      onValueChange={(v) => updateField("pronouns", v)}
                    >
                      <SelectTrigger className={validationErrors.pronouns ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select pronouns" />
                      </SelectTrigger>
                      <SelectContent>
                        {pronounsOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.pronouns && (
                      <p className="text-red-500 text-sm">{validationErrors.pronouns}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occupation" className="text-gray-700">
                      Occupation *
                    </Label>
                    <Input
                      id="occupation"
                      value={formData.occupation}
                      onChange={(e) => updateField("occupation", e.target.value)}
                      required
                      placeholder="e.g., Engineer, Teacher, Full-time Entrepreneur"
                      className={validationErrors.occupation ? "border-red-500" : ""}
                    />
                    {validationErrors.occupation && (
                      <p className="text-red-500 text-sm">{validationErrors.occupation}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-lg font-semibold"
                  >
                    Next Step
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Business Information */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-gray-900">Business Information</h3>
                    <p className="text-gray-600 text-sm">Tell us about your business</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName" className="text-gray-700">
                      Business / Product Name *
                    </Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => updateField("businessName", e.target.value)}
                      required
                      placeholder="Your business name"
                      className={validationErrors.businessName ? "border-red-500" : ""}
                    />
                    {validationErrors.businessName && (
                      <p className="text-red-500 text-sm">{validationErrors.businessName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-gray-700">
                      Company Website
                    </Label>
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
                  <Label className="text-gray-700">
                    Business Category (select all that apply) *
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {businessCategories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className={`p-3 rounded-lg text-sm font-medium transition-all border ${
                          formData.categories.includes(category)
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  {validationErrors.categories && (
                    <p className="text-red-500 text-sm">{validationErrors.categories}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Current Business Phase *</Label>
                  <Select 
                    value={formData.phase} 
                    onValueChange={(v) => updateField("phase", v)}
                  >
                    <SelectTrigger className={validationErrors.phase ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select your business phase" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessPhases.map((phase) => (
                        <SelectItem key={phase.value} value={phase.value}>
                          {phase.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.phase && (
                    <p className="text-red-500 text-sm">{validationErrors.phase}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Are you applying with collaborators? *</Label>
                    <Select 
                      value={formData.hasCollaborators} 
                      onValueChange={(v) => updateField("hasCollaborators", v)}
                    >
                      <SelectTrigger className={validationErrors.hasCollaborators ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {collaboratorOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.hasCollaborators && (
                      <p className="text-red-500 text-sm">{validationErrors.hasCollaborators}</p>
                    )}
                  </div>
                  {formData.hasCollaborators === "yes" && (
                    <div className="space-y-2">
                      <Label htmlFor="collaboratorNames" className="text-gray-700">
                        Collaborator Names
                      </Label>
                      <Input
                        id="collaboratorNames"
                        value={formData.collaboratorNames}
                        onChange={(e) => updateField("collaboratorNames", e.target.value)}
                        placeholder="Names of co-founders"
                        className={validationErrors.collaboratorNames ? "border-red-500" : ""}
                      />
                      {validationErrors.collaboratorNames && (
                        <p className="text-red-500 text-sm">{validationErrors.collaboratorNames}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={prevStep}
                    className="px-8 py-3"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Previous
                  </Button>
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-lg font-semibold"
                  >
                    Next Step
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Pitch Details & Submit */}
            {step === 3 && (
              <div className="space-y-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-gray-900">Pitch Details</h3>
                    <p className="text-gray-600 text-sm">Finalize your application</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-700">
                    Describe Your Business / Product *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    required
                    placeholder="Provide a brief, non-confidential description of your business or product. What problem does it solve? Who is your target market? (Max 500 words)"
                    className={`min-h-[150px] ${validationErrors.description ? "border-red-500" : ""}`}
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      {formData.description.split(/\s+/).filter(Boolean).length} / 500 words
                    </p>
                    {validationErrors.description && (
                      <p className="text-red-500 text-sm">{validationErrors.description}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Product / Business Photo *</Label>
                  <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    validationErrors.productImage 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="productImage"
                    />
                    <label htmlFor="productImage" className="cursor-pointer block">
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      {formData.productImage ? (
                        <div className="space-y-2">
                          <p className="text-green-600 font-medium">{formData.productImage.name}</p>
                          <p className="text-sm text-gray-500">
                            {(formData.productImage.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-600 mb-1">Drop image here or click to upload</p>
                          <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                        </>
                      )}
                    </label>
                  </div>
                  {validationErrors.productImage && (
                    <p className="text-red-500 text-sm">{validationErrors.productImage}</p>
                  )}
                </div>

                {/* Payment Evidence Section */}
                <div className="border-t border-gray-200 pt-8 mt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-gray-900">Payment Evidence</h4>
                      <p className="text-sm text-gray-600">Please provide details of your application fee payment</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="bankName" className="text-gray-700">
                        Bank Name *
                      </Label>
                      <Input
                        id="bankName"
                        value={formData.bankName}
                        onChange={(e) => updateField("bankName", e.target.value)}
                        required
                        placeholder="e.g., GCB Bank, Ecobank, MTN MoMo"
                        className={validationErrors.bankName ? "border-red-500" : ""}
                      />
                      {validationErrors.bankName && (
                        <p className="text-red-500 text-sm">{validationErrors.bankName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountHolderName" className="text-gray-700">
                        Account Holder Name *
                      </Label>
                      <Input
                        id="accountHolderName"
                        value={formData.accountHolderName}
                        onChange={(e) => updateField("accountHolderName", e.target.value)}
                        required
                        placeholder="Name on the payment account"
                        className={validationErrors.accountHolderName ? "border-red-500" : ""}
                      />
                      {validationErrors.accountHolderName && (
                        <p className="text-red-500 text-sm">{validationErrors.accountHolderName}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="transactionReference" className="text-gray-700">
                        Transaction/Reference Number *
                      </Label>
                      <Input
                        id="transactionReference"
                        value={formData.transactionReference}
                        onChange={(e) => updateField("transactionReference", e.target.value)}
                        required
                        placeholder="e.g., TXN123456789"
                        className={validationErrors.transactionReference ? "border-red-500" : ""}
                      />
                      {validationErrors.transactionReference && (
                        <p className="text-red-500 text-sm">{validationErrors.transactionReference}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amountPaid" className="text-gray-700">
                        Amount Paid (GHS) *
                      </Label>
                      <Input
                        id="amountPaid"
                        type="number"
                        step="0.01"
                        value={formData.amountPaid}
                        onChange={(e) => updateField("amountPaid", e.target.value)}
                        required
                        placeholder="e.g., 100.00"
                        className={validationErrors.amountPaid ? "border-red-500" : ""}
                      />
                      {validationErrors.amountPaid && (
                        <p className="text-red-500 text-sm">{validationErrors.amountPaid}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentDate" className="text-gray-700">
                        Payment Date *
                      </Label>
                      <Input
                        id="paymentDate"
                        type="date"
                        value={formData.paymentDate}
                        onChange={(e) => updateField("paymentDate", e.target.value)}
                        required
                        max={new Date().toISOString().split('T')[0]}
                        className={validationErrors.paymentDate ? "border-red-500" : ""}
                      />
                      {validationErrors.paymentDate && (
                        <p className="text-red-500 text-sm">{validationErrors.paymentDate}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mt-6">
                    <Label className="text-gray-700">Payment Receipt / Screenshot *</Label>
                    <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                      validationErrors.paymentReceipt 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-blue-300 hover:border-blue-400 bg-blue-50'
                    }`}>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleReceiptChange}
                        className="hidden"
                        id="paymentReceipt"
                        required
                      />
                      <label htmlFor="paymentReceipt" className="cursor-pointer block">
                        <Receipt className="w-12 h-12 mx-auto text-blue-500 mb-4" />
                        {formData.paymentReceipt ? (
                          <div className="space-y-2">
                            <p className="text-green-600 font-medium">{formData.paymentReceipt.name}</p>
                            <p className="text-sm text-gray-500">
                              {(formData.paymentReceipt.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <>
                            <p className="text-gray-900 font-medium mb-1">Upload Payment Proof</p>
                            <p className="text-sm text-gray-600">Bank receipt, MoMo screenshot, or transfer confirmation</p>
                            <p className="text-xs text-gray-500 mt-2">PNG, JPG, or PDF up to 10MB</p>
                          </>
                        )}
                      </label>
                    </div>
                    {validationErrors.paymentReceipt && (
                      <p className="text-red-500 text-sm">{validationErrors.paymentReceipt}</p>
                    )}
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <h4 className="font-display font-bold text-gray-900">Terms & Acknowledgment</h4>
                  <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                    <p>
                      By submitting this application, you acknowledge that your submission is not confidential and no fiduciary relationship is created. Duapa Werkspace may possess similar information and reserves the right to modify eligibility requirements.
                    </p>
                    <p>
                      You release Duapa Werkspace and partners from claims related to your submission. All information provided must be accurate and truthful. Submission does not guarantee selection for pitching.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={formData.agreedToTerms}
                      onCheckedChange={(checked) => updateField("agreedToTerms", checked === true)}
                      className={validationErrors.agreedToTerms ? "border-red-500" : ""}
                    />
                    <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                      I have read and agree to the terms above and confirm that I meet all eligibility requirements. *
                    </label>
                  </div>
                  {validationErrors.agreedToTerms && (
                    <p className="text-red-500 text-sm">{validationErrors.agreedToTerms}</p>
                  )}
                </div>

                {/* Digital Signature */}
                <div className="space-y-2">
                  <Label htmlFor="signature" className="text-gray-700">
                    Digital Signature (Type Your Full Name) *
                  </Label>
                  <Input
                    id="signature"
                    value={formData.signature}
                    onChange={(e) => updateField("signature", e.target.value)}
                    required
                    placeholder="Type your full legal name"
                    className={`font-medium ${validationErrors.signature ? "border-red-500" : ""}`}
                  />
                  {validationErrors.signature && (
                    <p className="text-red-500 text-sm">{validationErrors.signature}</p>
                  )}
                </div>

                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={prevStep}
                    className="px-8 py-3"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Previous
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isSubmitting || !formData.agreedToTerms || !formData.signature}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <Send className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Form Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Fields marked with * are required</p>
          <p className="mt-2">Need help? Contact support@duapawerkspace.com</p>
        </div>
      </div>
    </section>
  );
};

export default ApplicationForm;