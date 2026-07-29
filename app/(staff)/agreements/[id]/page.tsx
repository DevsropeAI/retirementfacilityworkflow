"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Download, Mail, FileText, CheckCircle, Clock } from "lucide-react";
import api from "@/lib/api-client";

interface Agreement {
  id: number;
  lead_id: number;
  application_id: number | null;
  agreement_number: string;
  facility: string;
  room_number: string | null;
  move_in_date: string;
  monthly_fee: number;
  security_deposit: number | null;
  terms_conditions: string | null;
  status: string;
  token: string | null;
  signed_at: string | null;
  signed_pdf_path: string | null;
  created_at: string;
  sent_at: string | null;
  lead_name: string;
  lead_email: string;
  lead_phone: string;
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  pending: "bg-yellow-100 text-yellow-700",
  signed: "bg-green-100 text-green-700",
  expired: "bg-red-100 text-red-700",
  cancelled: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  draft: "Draft",
  pending: "Pending Signature",
  signed: "Signed",
  expired: "Expired",
  cancelled: "Cancelled",
};

export default function AgreementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchAgreement();
  }, [id]);

  const fetchAgreement = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/api/agreements/${id}`);
      setAgreement(data);
    } catch (error) {
      console.error("Failed to fetch agreement:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!agreement) return;
    try {
      setSending(true);
      await api.post(`/api/agreements/${agreement.id}/send`);
      await fetchAgreement();
    } catch (error) {
      console.error("Failed to send agreement:", error);
    } finally {
      setSending(false);
    }
  };

  const handleDownload = async () => {
    if (!agreement) return;
    try {
      window.open(
        `http://localhost:8000/api/agreements/${agreement.id}/download`,
        "_blank"
      );
    } catch (error) {
      console.error("Failed to download:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!agreement) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Agreement not found</p>
        <Link href="/agreements">
          <Button className="mt-4">Back to Agreements</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/agreements">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {agreement.agreement_number}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <Badge className={statusColors[agreement.status] || "bg-gray-100"}>
                {statusLabels[agreement.status] || agreement.status}
              </Badge>
              <span className="text-sm text-gray-500">
                Lead: {agreement.lead_name}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {agreement.status === "draft" && (
            <Button onClick={handleSend} disabled={sending} className="gap-2">
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
              Send to Lead
            </Button>
          )}
          {agreement.status === "signed" && agreement.signed_pdf_path && (
            <Button onClick={handleDownload} variant="outline" className="gap-2">
              <Download className="h-4 w-4" /> Download PDF
            </Button>
          )}
        </div>
      </div>

      {/* Lead Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lead Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Name:</span>
              <p className="font-medium">{agreement.lead_name}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Email:</span>
              <p className="font-medium">{agreement.lead_email}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Phone:</span>
              <p className="font-medium">{agreement.lead_phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agreement Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Agreement Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Facility:</span>
              <p className="font-medium">{agreement.facility}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Room Number:</span>
              <p className="font-medium">{agreement.room_number || "Not specified"}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Move-in Date:</span>
              <p className="font-medium">
                {new Date(agreement.move_in_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Monthly Fee:</span>
              <p className="font-medium">${agreement.monthly_fee.toLocaleString()}</p>
            </div>
            {agreement.security_deposit && (
              <div>
                <span className="text-sm text-gray-500">Security Deposit:</span>
                <p className="font-medium">${agreement.security_deposit.toLocaleString()}</p>
              </div>
            )}
            <div>
              <span className="text-sm text-gray-500">Status:</span>
              <p className="font-medium">{statusLabels[agreement.status] || agreement.status}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Created:</span>
              <p className="font-medium">
                {new Date(agreement.created_at).toLocaleString()}
              </p>
            </div>
            {agreement.sent_at && (
              <div>
                <span className="text-sm text-gray-500">Sent:</span>
                <p className="font-medium">
                  {new Date(agreement.sent_at).toLocaleString()}
                </p>
              </div>
            )}
            {agreement.signed_at && (
              <div>
                <span className="text-sm text-gray-500">Signed:</span>
                <p className="font-medium">
                  {new Date(agreement.signed_at).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Terms & Conditions */}
      {agreement.terms_conditions && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Terms & Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap text-sm">
              {agreement.terms_conditions}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}