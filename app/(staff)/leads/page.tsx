"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, User, Eye, Loader2 } from "lucide-react";
import api from "@/lib/api-client";
import { Lead } from "@/types";

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

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await api.get("/api/leads");
      setLeads(data);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = lead.name.toLowerCase().includes(search.toLowerCase()) ||
                         lead.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? lead.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  // Get unique statuses for filter
  const statuses = [...new Set(leads.map((l) => l.status))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-500">Manage and track all your prospective residents.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Lead
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search leads by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={statusFilter === "" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("")}
              >
                All
              </Button>
              {statuses.map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No leads found</p>
              <p className="text-sm text-gray-400">Start capturing leads from the landing page.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{lead.name}</p>
                      <p className="text-sm text-gray-500 truncate">{lead.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs text-gray-400 hidden sm:block">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </span>
                    <Badge className={statusColors[lead.status] || "bg-gray-100 text-gray-700"}>
                      {lead.status}
                    </Badge>
                    {lead.qualification_score && (
                      <Badge className={scoreColors[lead.qualification_score] || "bg-gray-100 text-gray-700"}>
                        {lead.qualification_score}
                      </Badge>
                    )}
                    <Link href={`/leads/${lead.id}`}>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Eye className="h-3 w-3" /> View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}