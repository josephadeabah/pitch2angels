import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  User,
  Building,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  FileText,
  RefreshCw,
  Trash2,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Types
interface Application {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  region: string;
  business_name: string;
  categories: string[];
  phase: string;
  description: string;
  product_image: string;
  payment_receipt: string;
  amount_paid: number | string;
  transaction_reference: string;
  bank_name: string;
  payment_date: string;
  created_at: string;
  reviewed: boolean;
  review_status: string | null;
  review_notes?: string | null;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
}

interface Statistics {
  total: number;
  today: number;
  byRegion: Array<{ region: string; count: number }>;
  byStatus: {
    pending: number;
    approved: number;
    rejected: number;
    shortlisted: number;
  };
  recent: Array<{ date: string; count: number }>;
}

interface AdminDashboardProps {
  onViewApplication?: (id: number) => void;
}

const AdminDashboard = ({ onViewApplication }: AdminDashboardProps) => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApplications, setTotalApplications] = useState(0);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [reviewStatus, setReviewStatus] = useState("pending");
  const [reviewNotes, setReviewNotes] = useState("");

  // Helper function to convert amount to number
  const formatAmount = (amount: number | string): number => {
    if (typeof amount === 'number') return amount;
    if (typeof amount === 'string') {
      const parsed = parseFloat(amount);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  // Fetch applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...(search && { search }),
        ...(regionFilter && regionFilter !== "all" && { region: regionFilter }),
        ...(statusFilter && statusFilter !== "all" && { status: statusFilter }),
        sortBy: "created_at",
        sortOrder: "desc"
      });

      const response = await fetch(`pitch2angels-production.up.railway.app/api/admin/applications?${params}`);
      const data = await response.json();

      if (data.success) {
        console.log("Fetched applications:", data.data.applications.length);
        
        // Ensure amount_paid is converted to number
        const processedApplications = data.data.applications.map((app: Application) => ({
          ...app,
          amount_paid: formatAmount(app.amount_paid)
        }));
        
        setApplications(processedApplications);
        setTotalPages(data.data.pagination.pages);
        setTotalApplications(data.data.pagination.total);
      } else {
        throw new Error(data.error || "Failed to fetch applications");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load applications";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      const response = await fetch("pitch2angels-production.up.railway.app/api/admin/statistics");
      const data = await response.json();

      if (data.success) {
        console.log("Fetched statistics:", data.data);
        setStatistics(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
    }
  };

  // Initial load
  useEffect(() => {
    console.log("AdminDashboard mounted, fetching data...");
    fetchApplications();
    fetchStatistics();
  }, [page, regionFilter, statusFilter]);

  // Refresh when search changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) setPage(1);
      else fetchApplications();
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Handle review submission
  const handleReview = async () => {
    if (!selectedApp || !reviewStatus || reviewStatus.trim() === "") {
      toast({
        title: "Error",
        description: "Please select a review status",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`pitch2angels-production.up.railway.app/api/admin/applications/${selectedApp.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewed: true,
          review_status: reviewStatus,
          review_notes: reviewNotes,
          reviewed_by: "admin"
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Application reviewed successfully",
        });
        setReviewDialog(false);
        fetchApplications();
        fetchStatistics();
      } else {
        throw new Error(data.error || "Review failed");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to review application";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedApp) return;

    try {
      const response = await fetch(`pitch2angels-production.up.railway.app/api/admin/applications/${selectedApp.id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Application deleted successfully",
        });
        setDeleteDialog(false);
        fetchApplications();
        fetchStatistics();
      } else {
        throw new Error(data.error || "Delete failed");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete application";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Export to CSV
  const handleExport = async () => {
    try {
      const response = await fetch("pitch2angels-production.up.railway.app/api/admin/export");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "applications.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Exported",
        description: "Applications exported to CSV successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export applications",
        variant: "destructive",
      });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Get status badge
  const getStatusBadge = (app: Application) => {
    if (!app.reviewed) {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" /> Pending
        </Badge>
      );
    }

    switch (app.review_status) {
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
            <Eye className="w-3 h-3 mr-1" /> Shortlisted
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Get regions from existing applications
  const regions = Array.from(new Set(applications.map(app => app.region).filter(Boolean))) as string[];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Applications Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage and review all pitch applications
          </p>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <FileText className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.total}</div>
                <p className="text-xs text-gray-500">
                  {statistics.today} submitted today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.byStatus.pending}</div>
                <p className="text-xs text-gray-500">
                  Awaiting review
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.byStatus.approved}</div>
                <p className="text-xs text-gray-500">
                  Ready for pitching
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
                <Eye className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.byStatus.shortlisted}</div>
                <p className="text-xs text-gray-500">
                  Under consideration
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Actions */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, email, or business..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>

                <Button onClick={() => { fetchApplications(); fetchStatistics(); }}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Applications ({totalApplications})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                <p className="mt-2 text-gray-500">Loading applications...</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-semibold">No applications found</h3>
                <p className="text-gray-500 mt-2">
                  {search ? "Try a different search term" : "No applications have been submitted yet"}
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Business</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">{app.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <User className="h-4 w-4 text-gray-600" />
                              </div>
                              <div>
                                <div className="font-medium">{app.first_name} {app.last_name}</div>
                                <div className="text-sm text-gray-500">{app.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{app.business_name}</div>
                            <div className="text-sm text-gray-500">
                              {app.categories?.slice(0, 2).join(", ")}
                              {app.categories && app.categories.length > 2 && "..."}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{app.region}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
                              <span className="font-medium">
                                {formatAmount(app.amount_paid).toFixed(2)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                              <span className="text-sm">{formatDate(app.created_at)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(app)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedApp(app);
                                    if (onViewApplication) {
                                      onViewApplication(app.id);
                                    } else {
                                      toast({
                                        title: "View Details",
                                        description: `Opening details for ${app.business_name}`,
                                      });
                                    }
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedApp(app);
                                    setReviewStatus(app.review_status || "pending");
                                    setReviewNotes(app.review_notes || "");
                                    setReviewDialog(true);
                                  }}
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  {app.reviewed ? "Update Review" : "Review"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setSelectedApp(app);
                                    setDeleteDialog(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setPage(Math.max(1, page - 1))}
                            className={page === 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (page <= 3) {
                            pageNum = i + 1;
                          } else if (page >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = page - 2 + i;
                          }

                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink
                                onClick={() => setPage(pageNum)}
                                isActive={pageNum === page}
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}

                        {totalPages > 5 && page < totalPages - 2 && (
                          <>
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink onClick={() => setPage(totalPages)}>
                                {totalPages}
                              </PaginationLink>
                            </PaginationItem>
                          </>
                        )}

                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                            className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewDialog} onOpenChange={setReviewDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Review Application</DialogTitle>
            <DialogDescription>
              Update the review status for {selectedApp?.business_name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="status">Review Status *</Label>
              <Select value={reviewStatus} onValueChange={setReviewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Review Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes or comments about this application..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={4}
              />
            </div>

            {selectedApp && (
              <div className="rounded-lg border p-4 space-y-2">
                <h4 className="font-semibold">Application Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Applicant:</span>
                    <div>{selectedApp.first_name} {selectedApp.last_name}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Business:</span>
                    <div>{selectedApp.business_name}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Region:</span>
                    <div>{selectedApp.region}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Amount Paid:</span>
                    <div>GHS {formatAmount(selectedApp.amount_paid).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleReview} disabled={!reviewStatus}>
              Save Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the application for {selectedApp?.business_name}? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This will permanently delete the application and all associated data.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;