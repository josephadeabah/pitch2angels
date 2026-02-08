import React, { useState } from "react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import ApplicationDetail from "@/components/admin/ApplicationDetail";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const AdminPage = () => {
  const [view, setView] = useState<'dashboard' | 'detail'>('dashboard');
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);

  const handleViewApplication = (id: number) => {
    console.log("Viewing application:", id);
    setSelectedAppId(id);
    setView('detail');
  };

  const handleBackToDashboard = () => {
    console.log("Back to dashboard");
    setView('dashboard');
    setSelectedAppId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Site
                </Button>
              </Link>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">
                Pitch 2 Angels Admin
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {view === 'dashboard' ? 'Dashboard' : 'Application Details'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {view === 'dashboard' ? (
          <AdminDashboard onViewApplication={handleViewApplication} />
        ) : selectedAppId ? (
          <ApplicationDetail 
            applicationId={selectedAppId} 
            onBack={handleBackToDashboard}
          />
        ) : null}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Pitch 2 Angels. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminPage;