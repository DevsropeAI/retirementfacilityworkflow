"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import api from "@/lib/api-client";

interface Application {
  id: number;
  lead_id: number;
  full_name: string;
  email: string;
  phone: string;
  status: string;
  notes: string | null;
  created_at: string;
  submitted_at: string | null;
  lead_name: string;
  lead_email: string;
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  submitted: "bg-yellow-100 text-yellow-700",
  under_review: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  completed: "bg-purple-100 text-purple-700",
};

const statusIcons: Record<string, any> = {
  submitted: Clock,
  approved: CheckCircle,
  rejected: XCircle,
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await api.get("/api/applications");
      setApplications(data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(
    (app) => !filter || app.status === filter
  );

  const statuses = [...new Set(applications.map((a) => a.status))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
        <p className="text-gray-500">Review and manage client applications</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filter === "" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("")}
        >
          All ({applications.length})
        </Button>
        {statuses.map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(status)}
          >
            {status} ({applications.filter((a) => a.status === status).length})
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredApplications.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No applications found</p>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((app) => {
            const Icon = statusIcons[app.status] || FileText;
            return (
              <Link key={app.id} href={`/applications/${app.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{app.full_name}</CardTitle>
                      <Badge className={statusColors[app.status] || "bg-gray-100"}>
                        <Icon className="h-3 w-3 mr-1" />
                        {app.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <p className="text-sm text-gray-600">{app.email}</p>
                    <p className="text-sm text-gray-600">{app.phone}</p>
                    <p className="text-xs text-gray-400">
                      Submitted: {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : "Not submitted"}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Eye className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-blue-600">View Application</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}