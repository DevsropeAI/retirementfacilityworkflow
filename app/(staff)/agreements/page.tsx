"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, FileText, Eye, Download, CheckCircle, Clock, XCircle, Trash2 } from "lucide-react";
import api from "@/lib/api-client";

interface Agreement {
  id: number;
  lead_id: number;
  agreement_number: string;
  facility: string;
  room_number: string | null;
  move_in_date: string;
  monthly_fee: number;
  status: string;
  created_at: string;
  sent_at: string | null;
  signed_at: string | null;
  lead_name: string;
  lead_email: string;
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  pending: "bg-yellow-100 text-yellow-700",
  signed: "bg-green-100 text-green-700",
  expired: "bg-red-100 text-red-700",
  cancelled: "bg-red-100 text-red-700",
};

const statusIcons: Record<string, any> = {
  draft: FileText,
  pending: Clock,
  signed: CheckCircle,
  expired: XCircle,
  cancelled: XCircle,
};

const statusLabels: Record<string, string> = {
  draft: "Draft",
  pending: "Pending",
  signed: "Signed",
  expired: "Expired",
  cancelled: "Cancelled",
};

export default function AgreementsPage() {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchAgreements();
  }, []);

  const fetchAgreements = async () => {
    try {
      setLoading(true);
      const data = await api.get("/api/agreements");
      setAgreements(data);
    } catch (error) {
      console.error("Failed to fetch agreements:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setDeleteLoading(id);
      await api.delete(`/api/agreements/${id}`);
      fetchAgreements();
    } catch (error) {
      console.error("Failed to delete agreement:", error);
      alert("Failed to delete agreement. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredAgreements = agreements.filter(
    (a) => !filter || a.status === filter
  );

  const statuses = [...new Set(agreements.map((a) => a.status))];

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
        <h1 className="text-3xl font-bold text-gray-900">Agreements</h1>
        <p className="text-gray-500">Manage residency agreements</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filter === "" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("")}
        >
          All ({agreements.length})
        </Button>
        {statuses.map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(status)}
          >
            {statusLabels[status] || status} (
            {agreements.filter((a) => a.status === status).length})
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAgreements.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No agreements found</p>
            </CardContent>
          </Card>
        ) : (
          filteredAgreements.map((agreement) => {
            const Icon = statusIcons[agreement.status] || FileText;
            return (
              <Card key={agreement.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      {agreement.agreement_number}
                    </CardTitle>
                    <Badge className={statusColors[agreement.status] || "bg-gray-100"}>
                      <Icon className="h-3 w-3 mr-1" />
                      {statusLabels[agreement.status] || agreement.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <h3 className="font-semibold text-gray-900">{agreement.lead_name}</h3>
                  <p className="text-sm text-gray-600">{agreement.facility}</p>
                  {agreement.room_number && (
                    <p className="text-sm text-gray-600">Room: {agreement.room_number}</p>
                  )}
                  <p className="text-sm text-gray-600">
                    Monthly Fee: ${agreement.monthly_fee.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    Created: {new Date(agreement.created_at).toLocaleDateString()}
                  </p>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Link href={`/agreements/${agreement.id}`}>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Eye className="h-3 w-3" /> View
                      </Button>
                    </Link>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1 text-red-500 hover:text-red-600 hover:bg-red-50">
                          <Trash2 className="h-3 w-3" /> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the agreement for <strong>{agreement.lead_name}</strong>.
                            {agreement.status === "signed" && (
                              <span className="block text-red-500 mt-2">
                                ⚠️ This is a signed agreement. Deleting it will remove the signed document.
                              </span>
                            )}
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(agreement.id)}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={deleteLoading === agreement.id}
                          >
                            {deleteLoading === agreement.id ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Deleting...
                              </>
                            ) : (
                              "Delete"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}