"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Loader2, AlertCircle, Mail, CheckCircle } from "lucide-react";
import api from "@/lib/api-client";

interface GenerateAgreementModalProps {
  open: boolean;
  onClose: () => void;
  leadId: number;
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  applicationId?: number;
  onSuccess: () => void;
}

const FACILITIES = [
  "Thailand Beach Resort",
  "Vietnam Mountain Retreat",
  "Philippines Island Paradise",
  "Costa Rica Rainforest Lodge",
  "Ecuador Coastal Village",
  "Peru Andean Sanctuary",
];

export default function GenerateAgreementModal({
  open,
  onClose,
  leadId,
  leadName,
  leadEmail,
  leadPhone,
  applicationId,
  onSuccess,
}: GenerateAgreementModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"form" | "generated" | "sent">("form");
  const [agreementId, setAgreementId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    facility: FACILITIES[0],
    room_number: "",
    move_in_date: "",
    monthly_fee: "",
    security_deposit: "",
    terms_conditions: `1. Payment of monthly fee is due on the 1st of each month.
2. A security deposit is required at move-in.
3. The resident agrees to follow all facility rules and regulations.
4. The facility provides meals, housekeeping, and basic healthcare services.
5. The resident may terminate this agreement with 30 days written notice.
6. The facility reserves the right to update terms with 30 days notice.`,
  });

  useEffect(() => {
    if (open) {
      const date = new Date();
      date.setDate(date.getDate() + 30);
      setFormData((prev) => ({
        ...prev,
        move_in_date: date.toISOString().split("T")[0],
      }));
      setStep("form");
      setAgreementId(null);
    }
  }, [open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, facility: value });
  };

  const handleGenerate = async () => {
  console.log("🔄 Generating agreement...");
  setLoading(true);
  setError("");

  try {
    const response = await api.post("/api/agreements/generate", {
      lead_id: leadId,
      application_id: applicationId || null,
      facility: formData.facility,
      room_number: formData.room_number || null,
      move_in_date: formData.move_in_date,
      monthly_fee: parseFloat(formData.monthly_fee) || 0,
      security_deposit: parseFloat(formData.security_deposit) || null,
      terms_conditions: formData.terms_conditions || null,
    });

    console.log("📥 Response:", response);
    setAgreementId(response.id);
    setStep("generated");
    // ✅ REMOVED onSuccess() to prevent parent from closing modal
  } catch (err: any) {
    console.error("❌ Error:", err);
    setError(err.message || "Failed to generate agreement");
  } finally {
    setLoading(false);
  }
};

  const handleSend = async () => {
    if (!agreementId) return;

    setLoading(true);
    setError("");

    try {
      await api.post(`/api/agreements/${agreementId}/send`);
      setStep("sent");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to send agreement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {step === "form" && "Generate Agreement"}
            {step === "generated" && "Send Agreement to Lead"}
            {step === "sent" && "Agreement Sent!"}
          </DialogTitle>
          <DialogDescription>
            {step === "form" && `Create a residency agreement for ${leadName}`}
            {step === "generated" && `The agreement has been created. Send it to ${leadName} for signature.`}
            {step === "sent" && "The agreement link has been sent to the lead."}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {step === "form" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerate();
            }}
            className="space-y-6"
          >
            {/* Lead Info */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Lead Information</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-500">Name:</span>
                <span className="font-medium">{leadName}</span>
                <span className="text-gray-500">Email:</span>
                <span className="font-medium">{leadEmail}</span>
                <span className="text-gray-500">Phone:</span>
                <span className="font-medium">{leadPhone}</span>
              </div>
            </div>

            {/* Facility */}
            <div>
              <Label htmlFor="facility">Facility *</Label>
              <Select value={formData.facility} onValueChange={handleSelectChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select facility" />
                </SelectTrigger>
                <SelectContent>
                  {FACILITIES.map((facility) => (
                    <SelectItem key={facility} value={facility}>
                      {facility}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="room_number">Room Number</Label>
              <Input
                id="room_number"
                placeholder="e.g., Suite 101, Villa 5"
                value={formData.room_number}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="move_in_date">Move-in Date *</Label>
              <Input
                id="move_in_date"
                type="date"
                value={formData.move_in_date}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="monthly_fee">Monthly Fee ($) *</Label>
              <Input
                id="monthly_fee"
                type="number"
                placeholder="3500"
                value={formData.monthly_fee}
                onChange={handleChange}
                required
                className="mt-1"
                min="0"
                step="100"
              />
            </div>

            <div>
              <Label htmlFor="security_deposit">Security Deposit ($)</Label>
              <Input
                id="security_deposit"
                type="number"
                placeholder="2000"
                value={formData.security_deposit}
                onChange={handleChange}
                className="mt-1"
                min="0"
                step="100"
              />
            </div>

            <div>
              <Label htmlFor="terms_conditions">Terms & Conditions</Label>
              <Textarea
                id="terms_conditions"
                rows={6}
                value={formData.terms_conditions}
                onChange={handleChange}
                className="mt-1 font-mono text-sm"
              />
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Generating...
                  </>
                ) : (
                  "Generate Agreement"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === "generated" && (
          <div className="space-y-6 py-4">
            <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
              <div className="text-4xl mb-2">📄</div>
              <h3 className="text-lg font-semibold text-green-800">Agreement Generated!</h3>
              <p className="text-green-600 text-sm">
                Agreement #{agreementId} created successfully.
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Next step:</strong> Send the agreement to the lead so they can sign it.
              </p>
            </div>

            <DialogFooter className="gap-2 flex-col sm:flex-row">
              <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                Close
              </Button>
              <Button
                onClick={handleSend}
                disabled={loading}
                className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" /> Send to Lead
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "sent" && (
          <div className="space-y-6 py-4 text-center">
            <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-4xl mb-2">✅</div>
              <h3 className="text-lg font-semibold text-green-800">Agreement Sent!</h3>
              <p className="text-green-600 text-sm">
                The agreement link has been sent to {leadEmail}.
              </p>
              <p className="text-green-500 text-xs mt-2">
                The lead will receive an email with a link to sign the agreement.
              </p>
            </div>
            <Button variant="outline" onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}