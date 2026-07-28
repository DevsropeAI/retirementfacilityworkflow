"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

import {
  ArrowLeft,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Download,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  FileCheck,
  Building2,
  RefreshCw,
  Save,
} from "lucide-react";

import api from "@/lib/api-client";

interface Application {
  id: number;
  lead_id: number;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string | null;
  nationality: string | null;
  current_address: string | null;
  marital_status: string | null;
  occupation: string | null;
  emergency_name: string | null;
  emergency_relationship: string | null;
  emergency_phone: string | null;
  emergency_email: string | null;
  medical_conditions: string | null;
  medications: string | null;
  allergies: string | null;
  doctor_name: string | null;
  doctor_phone: string | null;
  preferred_move_date: string | null;
  preferred_country: string | null;
  preferred_facility: string | null;
  special_requirements: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  submitted_at: string | null;
  documents: Document[];
  lead_name: string;
  lead_email: string;
}

interface Document {
  id: number;
  application_id: number;
  document_type: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  file_type: string | null;
  uploaded_at: string;
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  submitted: "bg-yellow-100 text-yellow-700",
  under_review: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  completed: "bg-purple-100 text-purple-700",
};

const documentLabels: Record<string, string> = {
  passport: "Passport",
  id_card: "ID Card",
  medical: "Medical Records",
  insurance: "Insurance",
};

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/api/applications/${id}`);
      setApplication(data);
      setNotes(data.notes || "");
    } catch (error) {
      console.error("Failed to fetch application:", error);
      setError("Failed to load application");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Save Notes
  const handleSaveNotes = async () => {
    try {
      setSaving(true);
      await api.put(`/api/applications/${id}`, { notes });
      await fetchApplication();
    } catch (error) {
      console.error("Failed to save notes:", error);
      setError("Failed to save notes");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Approve
  const handleApprove = async () => {
    try {
      setSaving(true);
      await api.post(`/api/applications/${id}/approve`, { notes });
      await fetchApplication();
    } catch (error) {
      console.error("Failed to approve:", error);
      setError("Failed to approve application");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Reject
  const handleReject = async () => {
    try {
      setSaving(true);
      await api.post(`/api/applications/${id}/reject`, { notes });
      await fetchApplication();
    } catch (error) {
      console.error("Failed to reject:", error);
      setError("Failed to reject application");
    } finally {
      setSaving(false);
    }
  };

  //  Reopen
  const handleReopen = async () => {
    try {
      setSaving(true);
      await api.post(`/api/applications/${id}/reopen`);
      await fetchApplication();
    } catch (error) {
      console.error("Failed to reopen:", error);
      setError("Failed to reopen application");
    } finally {
      setSaving(false);
    }
  };

  //  Download Document
const handleDownload = async (documentId: number) => {
  console.log("🟢 Download clicked for document:", documentId);
  
  try {
    const token = localStorage.getItem("token");
    console.log("🔑 Token exists?", !!token);
    console.log("🔑 Token being sent:", token);
    console.log("🔑 Token starts with:", token ? token.substring(0, 20) + "..." : "null");
    
    if (!token) {
      console.error("❌ No token found in localStorage");
      alert("You must be logged in to download documents.");
      return;
    }
    
    const url = `http://localhost:8000/api/applications/${id}/documents/${documentId}/download`;
    console.log("📡 Fetching URL:", url);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    
    console.log("📡 Response status:", response.status);
    console.log("📡 Response headers:", [...response.headers.entries()]);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error response:", errorText);
      throw new Error(`Download failed: ${response.status} ${response.statusText}`);
    }
    
    const contentType = response.headers.get("Content-Type");
    console.log("📡 Content-Type:", contentType);
    
    // If the response is JSON, it's likely an error
    if (contentType && contentType.includes("application/json")) {
      const error = await response.json();
      console.error("❌ Server returned JSON error:", error);
      alert(error.detail || "Server error");
      return;
    }
    
    const blob = await response.blob();
    console.log("📦 Blob size:", blob.size, "bytes");
    console.log("📦 Blob type:", blob.type);
    
    if (blob.size === 0) {
      console.error("❌ Downloaded file is empty (0 bytes)");
      alert("Downloaded file is empty");
      return;
    }
    
    const contentDisposition = response.headers.get("Content-Disposition");
    console.log("📎 Content-Disposition:", contentDisposition);
    
    let filename = `document_${documentId}`;
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match) filename = match[1];
    }
    console.log("📎 Filename:", filename);
    
    const urlBlob = window.URL.createObjectURL(blob);
    console.log("🔗 Blob URL created:", urlBlob.substring(0, 50) + "...");
    
    const a = document.createElement("a");
    a.href = urlBlob;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      window.URL.revokeObjectURL(urlBlob);
      a.remove();
    }, 100);
    
    console.log("✅ Download initiated");
    
  } catch (error: any) {
    console.error("❌ Download error:", error);
    alert(error.message || "Failed to download document. Please try again.");
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error || "Application not found"}</p>
        <Link href="/applications">
          <Button className="mt-4">Back to Applications</Button>
        </Link>
      </div>
    );
  }

  const isApproved = application.status === "approved";
  const isRejected = application.status === "rejected";
  const canReview = ["submitted", "under_review"].includes(application.status);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <Link href="/applications">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{application.full_name}</h1>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <Badge className={statusColors[application.status] || "bg-gray-100"}>
                {application.status}
              </Badge>
              <span className="text-sm text-gray-500">
                Lead: {application.lead_name}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {canReview && (
            <>
              <Button
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50"
                onClick={handleApprove}
                disabled={saving}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                Approve
              </Button>
              <Button
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-50"
                onClick={handleReject}
                disabled={saving}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                Reject
              </Button>
            </>
          )}
          {(isApproved || isRejected) && (
            <Button
              variant="outline"
              className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
              onClick={handleReopen}
              disabled={saving}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Reopen
            </Button>
          )}
          {isApproved && (
            <Button variant="outline" className="border-green-500 text-green-600" disabled>
              <CheckCircle className="h-4 w-4 mr-2" /> Approved
            </Button>
          )}
          {isRejected && (
            <Button variant="outline" className="border-red-500 text-red-600" disabled>
              <XCircle className="h-4 w-4 mr-2" /> Rejected
            </Button>
          )}
        </div>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-gray-400" /> Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Name:</span>
              <span className="font-medium">{application.full_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Email:</span>
              <span className="font-medium">{application.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Phone:</span>
              <span className="font-medium">{application.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Date of Birth:</span>
              <span className="font-medium">{application.date_of_birth || "Not provided"}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Nationality:</span>
              <span className="font-medium">{application.nationality || "Not provided"}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Address:</span>
              <span className="font-medium">{application.current_address || "Not provided"}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Marital Status:</span>
              <span className="font-medium">{application.marital_status || "Not provided"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Occupation:</span>
              <span className="font-medium">{application.occupation || "Not provided"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Phone className="h-5 w-5 text-gray-400" /> Emergency Contact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Name:</span>
              <span className="font-medium">{application.emergency_name || "Not provided"}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Relationship:</span>
              <span className="font-medium">{application.emergency_relationship || "Not provided"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Phone:</span>
              <span className="font-medium">{application.emergency_phone || "Not provided"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Email:</span>
              <span className="font-medium">{application.emergency_email || "Not provided"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="h-5 w-5 text-gray-400" /> Medical Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <span className="text-sm text-gray-500">Medical Conditions:</span>
              <p className="font-medium">{application.medical_conditions || "None provided"}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Medications:</span>
              <p className="font-medium">{application.medications || "None provided"}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Allergies:</span>
              <p className="font-medium">{application.allergies || "None provided"}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Primary Doctor:</span>
                <p className="font-medium">{application.doctor_name || "Not provided"}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Doctor's Phone:</span>
                <p className="font-medium">{application.doctor_phone || "Not provided"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-gray-400" /> Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Preferred Move Date:</span>
              <p className="font-medium">{application.preferred_move_date || "Not provided"}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Preferred Country:</span>
              <p className="font-medium">{application.preferred_country || "Not provided"}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Preferred Facility:</span>
              <p className="font-medium">{application.preferred_facility || "Not provided"}</p>
            </div>
            <div className="md:col-span-2">
              <span className="text-sm text-gray-500">Special Requirements:</span>
              <p className="font-medium">{application.special_requirements || "None"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-400" /> Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          {application.documents && application.documents.length > 0 ? (
            <div className="space-y-3">
              {application.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium">{documentLabels[doc.document_type] || doc.document_type}</div>
                      <div className="text-sm text-gray-500">{doc.file_name}</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleDownload(doc.id)}
                  >
                    <Download className="h-4 w-4" /> Download
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No documents uploaded yet</p>
          )}
        </CardContent>
      </Card>

      {/* Notes + Save Button */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-400" /> Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Add internal notes about this application..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-end">
            <Button onClick={handleSaveNotes} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Notes
            </Button>
          </div>
          <p className="text-xs text-gray-400">
            These notes are only visible to staff members.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}