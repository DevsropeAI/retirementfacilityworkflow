"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FileText,
  Calendar,
  UserCheck,
  TrendingUp,
  TrendingDown,
  User,
  Loader2,
  ArrowRight,
} from "lucide-react";
import api from "@/lib/api-client";

interface DashboardStats {
  total_leads: number;
  qualified_leads: {
    hot: number;
    warm: number;
    cold: number;
  };
  status_counts: {
    consultation: number;
    application: number;
    approved: number;
    enrolled: number;
  };
  recent_leads: Array<{
    id: number;
    name: string;
    email: string;
    status: string;
    qualification_score: string | null;
    created_at: string;
  }>;
  growth: {
    current_period: number;
    previous_period: number;
    percentage: number;
  };
}

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  qualified: "bg-green-100 text-green-700",
  consultation: "bg-purple-100 text-purple-700",
  application: "bg-indigo-100 text-indigo-700",
  approved: "bg-emerald-100 text-emerald-700",
  enrolled: "bg-teal-100 text-teal-700",
  rejected: "bg-red-100 text-red-700",
};

const scoreColors: Record<string, string> = {
  Hot: "bg-red-100 text-red-700",
  Warm: "bg-yellow-100 text-yellow-700",
  Cold: "bg-blue-100 text-blue-700",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await api.get("/api/dashboard/stats");
      setStats(data);
    } catch (error: any) {
      console.error("Failed to fetch dashboard stats:", error);
      setError("Failed to load dashboard. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error || "Failed to load dashboard"}</p>
        <button onClick={fetchStats} className="mt-4 text-blue-500 hover:underline">
          Retry
        </button>
      </div>
    );
  }

  const totalQualified = stats.qualified_leads.hot + stats.qualified_leads.warm + stats.qualified_leads.cold;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening with your leads.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_leads}</div>
            <div className="flex items-center gap-1 text-xs mt-1">
              {stats.growth.percentage >= 0 ? (
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3" /> +{stats.growth.percentage}%
                </span>
              ) : (
                <span className="text-red-600 flex items-center">
                  <TrendingDown className="h-3 w-3" /> {stats.growth.percentage}%
                </span>
              )}
              <span className="text-gray-400">from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Qualified Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Qualified Leads</CardTitle>
            <UserCheck className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQualified}</div>
            <div className="flex gap-2 text-xs mt-1">
              <span className="text-red-600">Hot: {stats.qualified_leads.hot}</span>
              <span className="text-yellow-600">Warm: {stats.qualified_leads.warm}</span>
              <span className="text-blue-600">Cold: {stats.qualified_leads.cold}</span>
            </div>
          </CardContent>
        </Card>

        {/* Consultations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Consultations</CardTitle>
            <Calendar className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.status_counts.consultation}</div>
            <p className="text-xs text-gray-500 mt-1">Scheduled this week</p>
          </CardContent>
        </Card>

        {/* Applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Applications</CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.status_counts.application + stats.status_counts.approved + stats.status_counts.enrolled}</div>
            <p className="text-xs text-gray-500 mt-1">Pending review: {stats.status_counts.application}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Leads + Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Leads */}
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Leads</CardTitle>
            <Link href="/leads">
              <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats.recent_leads.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No leads yet</p>
                <p className="text-xs text-gray-400">Start capturing leads from the landing page.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recent_leads.map((lead) => (
                  <Link key={lead.id} href={`/leads/${lead.id}`}>
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-medium flex-shrink-0">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{lead.name}</p>
                          <p className="text-xs text-gray-500 truncate">{lead.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge className={statusColors[lead.status] || "bg-gray-100 text-gray-700"}>
                          {lead.status}
                        </Badge>
                        {lead.qualification_score && (
                          <Badge className={scoreColors[lead.qualification_score] || "bg-gray-100 text-gray-700"}>
                            {lead.qualification_score}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Total Leads</span>
              <span className="font-bold">{stats.total_leads}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Hot Leads</span>
              <span className="font-bold text-red-600">{stats.qualified_leads.hot}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Warm Leads</span>
              <span className="font-bold text-yellow-600">{stats.qualified_leads.warm}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Cold Leads</span>
              <span className="font-bold text-blue-600">{stats.qualified_leads.cold}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-green-600">Enrolled</span>
              <span className="font-bold text-green-600">{stats.status_counts.enrolled}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-sm text-purple-600">Approved</span>
              <span className="font-bold text-purple-600">{stats.status_counts.approved}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}