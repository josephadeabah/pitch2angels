import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  User, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Application {
  id: number;
  business_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  region: string;
  guardian_name?: string;
  description: string;
  phase: string;
  categories?: string[];
  website?: string;
  created_at: string;
  payment_date?: string;
  amount_paid: number;
  reviewed_at?: string;
  reviewed_by?: string;
  review_notes?: string;
  reviewed: boolean;
  review_status?: string;
  bank_name: string;
  account_holder_name: string;
  transaction_reference: string;
  payment_receipt?: string;
  product_image?: string;
}

interface ApplicationDetailProps {
  applicationId: number;
  onBack: () => void;
}

const ApplicationDetail = ({ applicationId, onBack }: ApplicationDetailProps) => {
  const { toast } = useToast();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplication();
  }, [applicationId]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://pitch2angels-production.up.railway.app/api/applications/${applicationId}`);
      const data = await response.json();

      if (data.success) {
        setApplication(data.data);
      } else {
        throw new Error(data.error || "Failed to fetch application");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load application";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Application not found</h3>
          <Button onClick={onBack} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = () => {
    if (!application.reviewed) {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" /> Pending Review
        </Badge>
      );
    }

    switch (application.review_status) {
      case "approved":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" /> Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" /> Rejected
          </Badge>
        );
      case "shortlisted":
        return (
          <Badge className="bg-blue-500">
            <FileText className="w-3 h-3 mr-1" /> Shortlisted
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{application.business_name}</h1>
              <div className="flex items-center gap-4 mt-2">
                {getStatusBadge()}
                <span className="text-gray-600">Application #{application.id}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="business">Business Details</TabsTrigger>
            <TabsTrigger value="payment">Payment Details</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Applicant Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Applicant Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="mt-1">{application.first_name} {application.last_name}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <p>{application.email}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <p>{application.phone}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Location</label>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <p>{application.city}, {application.region}</p>
                    </div>
                  </div>
                  
                  {application.guardian_name && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Guardian</label>
                      <p className="mt-1">{application.guardian_name}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Business Overview */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Business Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-gray-700 whitespace-pre-line">{application.description}</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Business Phase</label>
                      <p className="mt-1">{application.phase}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Categories</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {application.categories?.map((cat: string) => (
                          <Badge key={cat} variant="secondary">{cat}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    {application.website && (
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-gray-500">Website</label>
                        <div className="flex items-center gap-2 mt-1">
                          <ExternalLink className="h-4 w-4" />
                          <a 
                            href={application.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {application.website}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 rounded-full bg-green-500 mt-2"></div>
                      <div>
                        <p className="font-medium">Application Submitted</p>
                        <p className="text-sm text-gray-500">{formatDate(application.created_at)}</p>
                      </div>
                    </div>
                    
                    {application.payment_date && (
                      <div className="flex items-start gap-4">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mt-2"></div>
                        <div>
                          <p className="font-medium">Payment Received</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(application.payment_date)} • GHS {application.amount_paid.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {application.reviewed_at && (
                      <div className="flex items-start gap-4">
                        <div className="w-3 h-3 rounded-full bg-purple-500 mt-2"></div>
                        <div>
                          <p className="font-medium">Application Reviewed</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(application.reviewed_at)} • By {application.reviewed_by}
                          </p>
                          {application.review_notes && (
                            <p className="mt-2 text-gray-700">{application.review_notes}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Bank Name</label>
                      <p className="mt-1">{application.bank_name}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Account Holder</label>
                      <p className="mt-1">{application.account_holder_name}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Transaction Reference</label>
                      <p className="mt-1 font-mono">{application.transaction_reference}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Amount Paid</label>
                      <p className="mt-1 text-2xl font-bold">GHS {application.amount_paid.toFixed(2)}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Payment Date</label>
                      <p className="mt-1">{formatDate(application.payment_date || "")}</p>
                    </div>
                    
                    {application.payment_receipt && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Payment Receipt</label>
                        <div className="mt-2">
                          <Button variant="outline" asChild>
                            <a 
                              href={`https://pitch2angels-production.up.railway.app${application.payment_receipt}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              View Receipt
                            </a>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {application.product_image && (
                <Card>
                  <CardHeader>
                    <CardTitle>Product Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={`https://pitch2angels-production.up.railway.app${application.product_image}`}
                        alt="Product"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="mt-4">
                      <Button asChild variant="outline">
                        <a 
                          href={`https://pitch2angels-production.up.railway.app${application.product_image}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Full Image
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {application.payment_receipt && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Receipt</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-16 w-16 text-gray-400" />
                    </div>
                    <div className="mt-4">
                      <Button asChild>
                        <a 
                          href={`https://pitch2angels-production.up.railway.app${application.payment_receipt}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Receipt
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ApplicationDetail;