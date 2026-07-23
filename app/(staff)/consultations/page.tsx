"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Phone, Video, Building2, Loader2, Mail } from "lucide-react";
import api from "@/lib/api-client";

interface Consultation {
  id: number;
  lead_id: number;
  lead_name: string;
  lead_email: string;
  lead_phone: string;
  consultation_type: string;
  scheduled_date: string;
  scheduled_time: string;
  duration: number;
  notes: string | null;
  status: string;
  meeting_link: string | null;
}

const typeIcons: Record<string, any> = {
  phone: Phone,
  zoom: Video,
  facility_tour: Building2,
};

const typeLabels: Record<string, string> = {
  phone: "Phone Call",
  zoom: "Zoom Meeting",
  facility_tour: "Facility Tour",
};

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  no_show: "bg-gray-100 text-gray-700",
};

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const data = await api.get("/api/consultations?upcoming=true");
      setConsultations(data);
    } catch (error) {
      console.error("Failed to fetch consultations:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Consultations</h1>
        <p className="text-gray-500">Upcoming scheduled consultations</p>
      </div>

      {consultations.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No upcoming consultations</p>
            <p className="text-sm text-gray-400">Schedule consultations from the lead detail page.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {consultations.map((consultation) => {
            const Icon = typeIcons[consultation.consultation_type] || Calendar;
            return (
              <Link key={consultation.id} href={`/leads/${consultation.lead_id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{consultation.lead_name}</CardTitle>
                      <Badge className={statusColors[consultation.status] || "bg-gray-100"}>
                        {consultation.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Icon className="h-4 w-4" />
                      {typeLabels[consultation.consultation_type] || consultation.consultation_type}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {formatDate(consultation.scheduled_date)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      {consultation.scheduled_time} ({consultation.duration} min)
                    </div>
                    {consultation.meeting_link && (
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">Zoom link available</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}