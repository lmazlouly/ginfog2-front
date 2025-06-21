"use client";

import { useState, useEffect } from "react";
import { useBreadcrumbs } from "@/contexts/breadcrumb-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar, Camera, AlertTriangle, Plus } from "lucide-react";

// API imports
import { useGetWasteReports } from "@/lib/api/generated/waste-reports/waste-reports";
import type { WasteReportListItem } from "@/lib/api/models/wasteReportListItem";
import { WasteType } from "@/lib/api/models/wasteType";
import { UrgencyLevel } from "@/lib/api/models/urgencyLevel";
import { ReportStatus } from "@/lib/api/models/reportStatus";

// Helper functions for display
const getWasteTypeLabel = (wasteType: WasteType): string => {
  const labels: Record<WasteType, string> = {
    [WasteType.household]: "Household Waste",
    [WasteType.recyclable]: "Recyclable Materials",
    [WasteType.organic]: "Organic/Compost",
    [WasteType.electronic]: "Electronic Waste",
    [WasteType.hazardous]: "Hazardous Materials",
    [WasteType.construction]: "Construction Debris",
    [WasteType.illegal_dumping]: "Illegal Dumping",
    [WasteType.other]: "Other",
  };
  return labels[wasteType] || wasteType;
};

const getUrgencyLabel = (urgency: UrgencyLevel): string => {
  const labels: Record<UrgencyLevel, string> = {
    [UrgencyLevel.low]: "Low Priority",
    [UrgencyLevel.medium]: "Medium Priority", 
    [UrgencyLevel.high]: "High Priority",
    [UrgencyLevel.critical]: "Critical",
  };
  return labels[urgency] || urgency;
};

const getStatusColor = (status: ReportStatus): string => {
  const colors: Record<ReportStatus, string> = {
    [ReportStatus.pending]: "bg-yellow-100 text-yellow-800",
    [ReportStatus.approved]: "bg-blue-100 text-blue-800",
    [ReportStatus.rejected]: "bg-red-100 text-red-800", 
    [ReportStatus.completed]: "bg-green-100 text-green-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

const getUrgencyColor = (urgency: UrgencyLevel): string => {
  const colors: Record<UrgencyLevel, string> = {
    [UrgencyLevel.low]: "bg-green-100 text-green-800",
    [UrgencyLevel.medium]: "bg-yellow-100 text-yellow-800",
    [UrgencyLevel.high]: "bg-orange-100 text-orange-800",
    [UrgencyLevel.critical]: "bg-red-100 text-red-800",
  };
  return colors[urgency] || "bg-gray-100 text-gray-800";
};

export default function WasteEntries() {
  const { setBreadcrumbs } = useBreadcrumbs();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [wasteTypeFilter, setWasteTypeFilter] = useState<WasteType | undefined>();
  const [statusFilter, setStatusFilter] = useState<ReportStatus | undefined>();

  // Fetch waste reports from API
  const { data: wasteReportsData, isLoading, error, refetch } = useGetWasteReports({
    page,
    size: 10,
    waste_type: wasteTypeFilter as WasteType | undefined,
    status: statusFilter as ReportStatus | undefined,
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "My Waste Reports", href: "/client/waste-entries" },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter entries based on active tab and search - all client-side filtering
  const filteredEntries = wasteReportsData?.items?.filter((entry: WasteReportListItem) => {
    // Tab filtering
    if (activeTab !== "all") {
      if (activeTab === "recyclable" && entry.waste_type !== WasteType.recyclable) return false;
      if (activeTab === "hazardous" && entry.waste_type !== WasteType.hazardous) return false;
      if (activeTab === "organic" && entry.waste_type !== WasteType.organic) return false;
    }

    // Search filtering (client-side)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        getWasteTypeLabel(entry.waste_type).toLowerCase().includes(searchLower) ||
        entry.street_address.toLowerCase().includes(searchLower) ||
        entry.city.toLowerCase().includes(searchLower)
      );
    }

    return true;
  }) || [];

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Error Loading Waste Reports
            </CardTitle>
            <CardDescription className="text-red-600">
              There was an error fetching your waste reports. Please try again.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Waste Reports</h1>
          <p className="text-muted-foreground">
            View and manage your submitted waste reports
          </p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700" asChild>
          <a href="/client/report-waste">
            <Plus className="h-4 w-4 mr-2" />
            Report New Waste
          </a>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="recyclable">Recyclable</TabsTrigger>
            <TabsTrigger value="hazardous">Hazardous</TabsTrigger>
            <TabsTrigger value="organic">Organic</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="w-full md:w-80">
          <Input 
            placeholder="Search reports..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Reports List */}
      <div className="space-y-4">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry: WasteReportListItem) => (
            <Card key={entry.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getWasteTypeLabel(entry.waste_type)}
                      {entry.photo_count && entry.photo_count > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          <Camera className="h-3 w-3 mr-1" />
                          {entry.photo_count}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(entry.created_at).toLocaleDateString()}
                      <MapPin className="h-4 w-4 ml-2" />
                      {entry.street_address}, {entry.city}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className={getStatusColor(entry.status)}>
                      {entry.status}
                    </Badge>
                    <Badge variant="outline" className={getUrgencyColor(entry.urgency_level)}>
                      {getUrgencyLabel(entry.urgency_level)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Waste Type</p>
                    <p className="font-medium">{getWasteTypeLabel(entry.waste_type)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Urgency Level</p>
                    <p className="font-medium">{getUrgencyLabel(entry.urgency_level)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium capitalize">{entry.status}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm">View Details</Button>
                {entry.status === ReportStatus.pending && (
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    Cancel
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Waste Reports Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "No reports match your search criteria." : "You haven't submitted any waste reports yet."}
            </p>
            <Button className="bg-green-600 hover:bg-green-700" asChild>
              <a href="/client/report-waste">
                <Plus className="h-4 w-4 mr-2" />
                Submit Your First Report
              </a>
            </Button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {wasteReportsData && wasteReportsData.pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {wasteReportsData.page} of {wasteReportsData.pages} 
            ({wasteReportsData.total} total reports)
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.min(wasteReportsData.pages, page + 1))}
            disabled={page === wasteReportsData.pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
