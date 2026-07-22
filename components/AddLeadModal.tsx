"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, X, CheckCircle, AlertCircle } from "lucide-react";
import api from "@/lib/api-client";

interface AddLeadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  age: "",
  current_location: "",
  retirement_status: "",
  monthly_income: "",
  desired_move_date: "",
  desired_country: "",
  budget: "",
  timeline: "",
  medical_requirements: "",
  family_info: "",
};

export default function AddLeadModal({ open, onClose, onSuccess }: AddLeadModalProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Convert string values to proper types
      const leadData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        age: formData.age ? parseInt(formData.age) : null,
        current_location: formData.current_location || null,
        retirement_status: formData.retirement_status || null,
        monthly_income: formData.monthly_income ? parseFloat(formData.monthly_income) : null,
        desired_move_date: formData.desired_move_date || null,
        desired_country: formData.desired_country || null,
        budget: formData.budget || null,
        timeline: formData.timeline || null,
        medical_requirements: formData.medical_requirements || null,
        family_info: formData.family_info || null,
        lead_source: "manual", // ✅ Important: Set source to manual
      };

      await api.post("/api/leads", leadData);
      setSuccess(true);
      setFormData(initialFormData);
      
      // Close modal after 1.5 seconds and refresh the list
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to add lead. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData(initialFormData);
      setError("");
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="!max-w-[900px] w-[95vw] max-h-[90vh] overflow-y-auto p-6 border-4 border-black-300">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Lead</DialogTitle>
          <DialogDescription>
            Manually add a lead to the CRM. They will be automatically qualified by AI.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900">Lead Added Successfully!</h3>
            <p className="text-gray-500 mt-2">The lead has been saved and qualified.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="required">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="email" className="required">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="required">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="+1 234 567 890"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="65"
                  value={formData.age}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="current_location">Current Location</Label>
                <Input
                  id="current_location"
                  placeholder="New York, USA"
                  value={formData.current_location}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="retirement_status">Retirement Status</Label>
                <Input
                  id="retirement_status"
                  placeholder="Retired / Planning / Considering"
                  value={formData.retirement_status}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monthly_income">Monthly Retirement Income ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="monthly_income"
                    type="number"
                    placeholder="5000"
                    className="pl-7"
                    min="0"
                    step="100"
                    value={formData.monthly_income}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="desired_move_date">Desired Move Date</Label>
                <Input
                  id="desired_move_date"
                  placeholder="January 2026"
                  value={formData.desired_move_date}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="desired_country">Desired Country</Label>
                <Input
                  id="desired_country"
                  placeholder="Thailand, Vietnam, Costa Rica..."
                  value={formData.desired_country}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="budget">Budget Range</Label>
                <Input
                  id="budget"
                  placeholder="e.g., $50,000 - $100,000"
                  value={formData.budget}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timeline">Timeline</Label>
                <Input
                  id="timeline"
                  placeholder="e.g., 6 months, 1 year, flexible"
                  value={formData.timeline}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="medical_requirements">Medical/Health Requirements</Label>
                <Input
                  id="medical_requirements"
                  placeholder="Any specific medical needs"
                  value={formData.medical_requirements}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="family_info">Family Information</Label>
              <Input
                id="family_info"
                placeholder="Will you be relocating with family members?"
                value={formData.family_info}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Adding...
                  </>
                ) : (
                  "Add Lead"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}