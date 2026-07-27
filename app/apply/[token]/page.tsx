"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertCircle, Upload, File } from "lucide-react";
import api from "@/lib/api-client";

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [leadId, setLeadId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    nationality: "",
    current_address: "",
    marital_status: "",
    occupation: "",
    emergency_name: "",
    emergency_relationship: "",
    emergency_phone: "",
    emergency_email: "",
    medical_conditions: "",
    medications: "",
    allergies: "",
    doctor_name: "",
    doctor_phone: "",
    preferred_move_date: "",
    preferred_country: "",
    preferred_facility: "",
    special_requirements: "",
  });

  const [documents, setDocuments] = useState<Record<string, File | null>>({
    passport: null,
    id_card: null,
    medical: null,
    insurance: null,
  });

  // Fetch lead info from token
  useEffect(() => {
    const fetchLeadInfo = async () => {
      try {
        // In a real implementation, you'd have an endpoint to validate the token
        // For now, we'll simulate by extracting lead_id from the token
        // This is a placeholder — you'll need to implement token validation
        console.log("Token:", token);
        // For testing: set a default lead_id
        // In production, you'd call: /api/applications/token/{token}
        setLeadId(1); // Placeholder
      } catch (err) {
        setError("Invalid or expired application link");
      }
    };
    fetchLeadInfo();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (type: string, file: File | null) => {
    setDocuments({ ...documents, [type]: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Submit application
      const applicationData = {
        ...formData,
        lead_id: leadId,
      };

      const response = await api.post("/api/applications/public/submit", applicationData);
      const applicationId = response.application_id;

      // Upload documents
      for (const [type, file] of Object.entries(documents)) {
        if (file) {
          const formData = new FormData();
          formData.append("document_type", type);
          formData.append("file", file);
          
          await fetch(`http://localhost:8000/api/applications/public/upload/${applicationId}`, {
            method: "POST",
            body: formData,
          });
        }
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-12 pb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Application Submitted!</h2>
            <p className="text-gray-600 mt-2">
              Thank you for your application. Our team will review it and get back to you soon.
            </p>
            <Button className="mt-6" onClick={() => router.push("/")}>
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-12 pb-8">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Invalid Link</h2>
            <p className="text-gray-600 mt-2">{error}</p>
            <Button className="mt-6" onClick={() => router.push("/")}>
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Application for Residency</h1>
          <p className="text-gray-600 mt-2">Please fill out this form to complete your application.</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input id="full_name" required value={formData.full_name} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" required value={formData.email} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input id="phone" required value={formData.phone} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input id="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input id="nationality" value={formData.nationality} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="marital_status">Marital Status</Label>
                    <Input id="marital_status" placeholder="Single, Married, Divorced, Widowed" value={formData.marital_status} onChange={handleChange} />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="current_address">Current Address</Label>
                    <Input id="current_address" value={formData.current_address} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input id="occupation" value={formData.occupation} onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergency_name">Emergency Contact Name</Label>
                    <Input id="emergency_name" value={formData.emergency_name} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="emergency_relationship">Relationship</Label>
                    <Input id="emergency_relationship" value={formData.emergency_relationship} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="emergency_phone">Emergency Phone</Label>
                    <Input id="emergency_phone" value={formData.emergency_phone} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="emergency_email">Emergency Email</Label>
                    <Input id="emergency_email" type="email" value={formData.emergency_email} onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="medical_conditions">Medical Conditions</Label>
                    <Textarea id="medical_conditions" rows={2} value={formData.medical_conditions} onChange={handleChange} />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="medications">Current Medications</Label>
                    <Textarea id="medications" rows={2} value={formData.medications} onChange={handleChange} />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    <Textarea id="allergies" rows={2} value={formData.allergies} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="doctor_name">Primary Doctor</Label>
                    <Input id="doctor_name" value={formData.doctor_name} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="doctor_phone">Doctor's Phone</Label>
                    <Input id="doctor_phone" value={formData.doctor_phone} onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="preferred_move_date">Preferred Move Date</Label>
                    <Input id="preferred_move_date" type="date" value={formData.preferred_move_date} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="preferred_country">Preferred Country</Label>
                    <Input id="preferred_country" value={formData.preferred_country} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="preferred_facility">Preferred Facility</Label>
                    <Input id="preferred_facility" value={formData.preferred_facility} onChange={handleChange} />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="special_requirements">Special Requirements</Label>
                    <Textarea id="special_requirements" rows={2} value={formData.special_requirements} onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* Document Upload */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { type: "passport", label: "Passport" },
                    { type: "id_card", label: "ID Card" },
                    { type: "medical", label: "Medical Records" },
                    { type: "insurance", label: "Insurance" },
                  ].map((doc) => (
                    <div key={doc.type} className="border rounded-lg p-4">
                      <Label>{doc.label}</Label>
                      <div className="mt-2">
                        <input
                          type="file"
                          id={`doc_${doc.type}`}
                          onChange={(e) => handleFileChange(doc.type, e.target.files?.[0] || null)}
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <label
                          htmlFor={`doc_${doc.type}`}
                          className="flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          {documents[doc.type] ? (
                            <>
                              <File className="h-5 w-5 text-green-500" />
                              <span className="text-sm text-gray-600 truncate max-w-[150px]">
                                {documents[doc.type]?.name}
                              </span>
                            </>
                          ) : (
                            <>
                              <Upload className="h-5 w-5 text-gray-400" />
                              <span className="text-sm text-gray-500">Upload {doc.label}</span>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  {error}
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}