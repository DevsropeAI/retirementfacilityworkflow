"use client";

import { useState } from "react";
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
import { Loader2, Calendar, Clock, Phone, Video, Building2 } from "lucide-react";
import api from "@/lib/api-client";

interface ConsultationModalProps {
  open: boolean;
  onClose: () => void;
  leadId: number;
  leadName: string;
  onSuccess: () => void;
}

export default function ConsultationModal({
  open,
  onClose,
  leadId,
  leadName,
  onSuccess,
}: ConsultationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    consultation_type: "phone",
    scheduled_date: "",
    scheduled_time: "",
    duration: "60",
    notes: "",
    meeting_link: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, consultation_type: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/api/consultations", {
        lead_id: leadId,
        consultation_type: formData.consultation_type,
        scheduled_date: formData.scheduled_date,
        scheduled_time: formData.scheduled_time,
        duration: parseInt(formData.duration),
        notes: formData.notes || null,
        meeting_link: formData.meeting_link || null,
      });
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to book consultation");
    } finally {
      setLoading(false);
    }
  };

  const consultationTypes = [
    { value: "phone", label: "Phone Call", icon: Phone },
    { value: "zoom", label: "Zoom Meeting", icon: Video },
    { value: "facility_tour", label: "Facility Tour", icon: Building2 },
  ];

  // Generate time slots (9 AM - 6 PM)
  const timeSlots = [];
  for (let hour = 9; hour <= 17; hour++) {
    for (let minute of [0, 30]) {
      const h = hour > 12 ? hour - 12 : hour;
      const ampm = hour >= 12 ? "PM" : "AM";
      const time = `${h}:${minute === 0 ? "00" : minute} ${ampm}`;
      timeSlots.push(time);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Book Consultation</DialogTitle>
          <DialogDescription>
            Schedule a consultation for <strong>{leadName}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Consultation Type */}
          <div>
            <Label>Consultation Type *</Label>
            <Select value={formData.consultation_type} onValueChange={handleSelectChange}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {consultationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="h-4 w-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div>
            <Label htmlFor="scheduled_date">Date *</Label>
            <Input
              id="scheduled_date"
              type="date"
              value={formData.scheduled_date}
              onChange={handleChange}
              required
              className="mt-1"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Time */}
          <div>
            <Label htmlFor="scheduled_time">Time *</Label>
            <Select 
              value={formData.scheduled_time} 
              onValueChange={(value) => setFormData({ ...formData, scheduled_time: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {time}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Select 
              value={formData.duration} 
              onValueChange={(value) => setFormData({ ...formData, duration: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Meeting Link (for Zoom) */}
          {formData.consultation_type === "zoom" && (
            <div>
              <Label htmlFor="meeting_link">Zoom Meeting Link (Optional)</Label>
              <Input
                id="meeting_link"
                placeholder="https://zoom.us/j/123456789"
                value={formData.meeting_link}
                onChange={handleChange}
                className="mt-1"
              />
              <p className="text-xs text-gray-400 mt-1">
                If left blank, the system will generate a placeholder link.
              </p>
            </div>
          )}

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special notes for this consultation..."
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 min-h-[80px]"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Booking...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4" /> Book Consultation
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}