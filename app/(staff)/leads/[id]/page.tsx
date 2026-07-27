"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Globe,
  Clock,
  FileText,
  Users,
  MessageSquare,
  Loader2,
  Brain,
  RotateCcw,
  Calendar as CalendarIcon,
  Send,
  CheckCircle,
} from "lucide-react";
import api from "@/lib/api-client";
import { Lead } from "@/types";
import ConsultationModal from "@/components/ConsultationModal";

const statusOptions = [
  "new",
  "contacted",
  "qualified",
  "consultation",
  "application",
  "approved",
  "enrolled",
  "rejected",
];

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

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  const [requalifying, setRequalifying] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [sendingApplication, setSendingApplication] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(
    null
  );

  useEffect(() => {
    fetchLead();
  }, [leadId]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/api/leads/${leadId}`);
      setLead(data);
      setNotes(data.notes || "");
      setStatus(data.status);
      // Check if application was sent
      if (data.application_status) {
        setApplicationStatus(data.application_status);
      }
    } catch (error) {
      console.error("Failed to fetch lead:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequalify = async () => {
    try {
      setRequalifying(true);
      await api.post(`/api/leads/${leadId}/requalify`, {});
      await fetchLead();
    } catch (error) {
      console.error("Failed to re-qualify:", error);
    } finally {
      setRequalifying(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put(`/api/leads/${leadId}`, {
        status,
        notes,
      });
      await fetchLead();
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setSaving(false);
    }
  };

  // ✅ Send Application Handler
  const handleSendApplication = async () => {
    try {
      setSendingApplication(true);
      const response = await api.post(`/api/leads/${leadId}/send-application`);
      setApplicationStatus("sent");
      alert(
        `✅ Application link sent to ${lead?.email}\n\nLink: ${response.link}`
      );
      await fetchLead();
    } catch (error: any) {
      console.error("Failed to send application:", error);
      alert(error.message || "Failed to send application");
    } finally {
      setSendingApplication(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Lead not found</p>
        <Link href="/leads">
          <Button className="mt-4">Back to Leads</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/leads">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <Badge className={statusColors[lead.status] || "bg-gray-100"}>
                {lead.status}
              </Badge>
              {lead.qualification_score && (
                <Badge className="bg-gray-100 text-gray-700">
                  Score: {lead.qualification_score}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* ✅ Send Application Button */}
          <Button
            variant="outline"
            className="gap-2 border-blue-500 text-blue-600 hover:bg-blue-50"
            onClick={handleSendApplication}
            disabled={sendingApplication || applicationStatus === "sent"}
          >
            {sendingApplication ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : applicationStatus === "sent" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {applicationStatus === "sent" ? "Sent" : "Send Application"}
          </Button>

          <Button
            className="gap-2"
            onClick={() => setShowBookingModal(true)}
          >
            <CalendarIcon className="h-4 w-4" /> Book Consultation
          </Button>

          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </Button>
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
              <span className="font-medium">{lead.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Email:</span>
              <span className="font-medium">{lead.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Phone:</span>
              <span className="font-medium">{lead.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Location:</span>
              <span className="font-medium">
                {lead.current_location || "Not set"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Age:</span>
              <span className="font-medium">{lead.age || "Not set"}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Monthly Income:</span>
              <span className="font-medium">
                {lead.monthly_income
                  ? `$${lead.monthly_income.toLocaleString()}`
                  : "Not set"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Desired Country:</span>
              <span className="font-medium">
                {lead.desired_country || "Not set"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Move Date:</span>
              <span className="font-medium">
                {lead.desired_move_date || "Not set"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Qualification */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-gray-400" /> AI Qualification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-sm text-gray-500">Score:</span>
                {lead.qualification_score ? (
                  <Badge
                    className={`text-lg px-4 py-1 ${
                      lead.qualification_score === "Hot"
                        ? "bg-red-100 text-red-700"
                        : lead.qualification_score === "Warm"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {lead.qualification_score}
                  </Badge>
                ) : (
                  <span className="text-gray-400">Not yet scored</span>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleRequalify}
                disabled={requalifying}
              >
                {requalifying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RotateCcw className="h-4 w-4" />
                )}
                Re-qualify
              </Button>
            </div>

            {lead.qualification_reasoning && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  {lead.qualification_reasoning}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lead Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-400" /> Lead Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      <div className="flex items-center gap-2">
                        <Badge className={statusColors[s]}>{s}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Lead Source</Label>
              <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">
                {lead.lead_source || "landing_page"}
              </div>
            </div>
            <div>
              <Label>Created At</Label>
              <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">
                {new Date(lead.created_at).toLocaleString()}
              </div>
            </div>
            <div>
              <Label>Assigned Team Member</Label>
              <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">
                {lead.assigned_to ? `Staff ID: ${lead.assigned_to}` : "Not assigned"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-gray-400" /> Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add internal notes about this lead..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[120px]"
          />
          <p className="text-xs text-gray-400 mt-2">
            These notes are only visible to staff members.
          </p>
        </CardContent>
      </Card>

      {/* Communication History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-gray-400" /> Communication History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lead.communication_history && lead.communication_history.length > 0 ? (
            <div className="space-y-4">
              {lead.communication_history.map((entry, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm">
                    <div className="font-medium">{entry.type || "Note"}</div>
                    <div className="text-gray-600">{entry.message}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {entry.date ? new Date(entry.date).toLocaleString() : "Unknown time"}
                      {entry.by && ` • Staff ID: ${entry.by}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No communication history yet</p>
              <p className="text-sm text-gray-400">Communications will appear here as they happen.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Consultation Modal */}
      <ConsultationModal
        open={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        leadId={lead.id}
        leadName={lead.name}
        onSuccess={() => {
          fetchLead();
        }}
      />
    </div>
  );
}