"use client";

import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Calendar as CalendarIcon, List, Phone, Video, Building2, X } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api-client";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

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
  meeting_id: string | null;
}

const typeLabels: Record<string, string> = {
  phone: "Phone Call",
  zoom: "Zoom Meeting",
  facility_tour: "Facility Tour",
};

const typeIcons: Record<string, any> = {
  phone: Phone,
  zoom: Video,
  facility_tour: Building2,
};

const typeColors: Record<string, string> = {
  phone: "#8B5CF6",
  zoom: "#3B82F6",
  facility_tour: "#10B981",
};

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  no_show: "bg-gray-100 text-gray-700",
};

const getDateContext = (date: string) => {
  const today = new Date();
  const consultDate = new Date(date);
  
  // Reset time to compare only dates
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const consultDateObj = new Date(consultDate.getFullYear(), consultDate.getMonth(), consultDate.getDate());
  
  if (consultDateObj < todayDate) return "past";
  if (consultDateObj.getTime() === todayDate.getTime()) return "today";
  return "future";
};


export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState<Consultation[]>([]);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      //  Remove upcoming filter to get ALL consultations
      const data = await api.get("/api/consultations?upcoming=false");
      setConsultations(data);
    } catch (error) {
      console.error("Failed to fetch consultations:", error);
    } finally {
      setLoading(false);
    }
  };
   useEffect(() => {
    if (consultations.length > 0) {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      
      console.log("📅 Today's date:", todayStr);
      console.log("📋 Consultation dates (raw):", consultations.map(c => c.scheduled_date));
      console.log("📋 Consultation dates (extracted):", consultations.map(c => c.scheduled_date.split('T')[0]));
      
      const todayEvents = getEventsForDate(today);
      console.log("📊 Events for today:", todayEvents.length);
    }
  }, [consultations]);

  const getEventsForDate = (date: Date) => {
    // Format the selected date as YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return consultations.filter((c) => {
      // Extract just the date part from the consultation (YYYY-MM-DD)
      const consultDateStr = c.scheduled_date.split('T')[0];
      return consultDateStr === dateStr;
    });
  };

  // const handleDateClick = (date: Date) => {
  //   const events = getEventsForDate(date);
  //   if (events.length > 0) {
  //     setSelectedDate(date);
  //     setSelectedDayEvents(events);
  //     setShowDayModal(true);
  //   }
  // };
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  //  Updated tileContent with dynamic dot colors
const tileContent = ({ date, view }: { date: Date; view: string }) => {
  if (view === "month") {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const dayEvents = consultations.filter((c) => {
      return c.scheduled_date.split('T')[0] === dateStr;
    });
    
    if (dayEvents.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-0.5 mt-1 justify-center">
        {dayEvents.slice(0, 3).map((e) => {
          const dotColor = getDateContext(e.scheduled_date) === "past" 
            ? "#9CA3AF" 
            : getDateContext(e.scheduled_date) === "today" 
            ? "#3B82F6" 
            : "#10B981";
          return (
            <div
              key={e.id}
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: dotColor }}
            />
          );
        })}
        {dayEvents.length > 3 && (
          <span className="text-[8px] text-gray-400">+{dayEvents.length - 3}</span>
        )}
      </div>
    );
  }
  return null;
};

const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const hasEvents = consultations.some((c) => {
        return c.scheduled_date.split('T')[0] === dateStr;
      });
      
      if (hasEvents) {
        return "hover:bg-blue-50 cursor-pointer transition-colors rounded-lg";
      }
    }
    return "";
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Consultations</h1>
          <p className="text-gray-500">View and manage all scheduled consultations</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === "calendar" ? "default" : "outline"}
            onClick={() => setView("calendar")}
            size="sm"
            className="gap-2"
          >
            <CalendarIcon className="h-4 w-4" />
            Calendar
          </Button>
          <Button
            variant={view === "list" ? "default" : "outline"}
            onClick={() => setView("list")}
            size="sm"
            className="gap-2"
          >
            <List className="h-4 w-4" />
            List
          </Button>
        </div>
      </div>

      {view === "calendar" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2">
            <CardContent className="pt-6">
              <style jsx global>{`
                .react-calendar {
                  border: none !important;
                  width: 100% !important;
                  font-family: inherit !important;
                }
                .react-calendar__navigation {
                  margin-bottom: 1rem !important;
                }
                .react-calendar__navigation button {
                  font-size: 1rem !important;
                  font-weight: 600 !important;
                  color: #1f2937 !important;
                  padding: 0.5rem 1rem !important;
                  border-radius: 0.5rem !important;
                  transition: all 0.2s !important;
                }
                .react-calendar__navigation button:hover {
                  background-color: #f3f4f6 !important;
                }
                .react-calendar__navigation button:disabled {
                  opacity: 0.5 !important;
                }
                .react-calendar__month-view__weekdays {
                  font-weight: 600 !important;
                  color: #6b7280 !important;
                  text-transform: uppercase !important;
                  font-size: 0.75rem !important;
                }
                .react-calendar__month-view__weekdays__weekday {
                  padding: 0.5rem !important;
                }
                .react-calendar__month-view__weekdays abbr {
                  text-decoration: none !important;
                }
                .react-calendar__tile {
                  padding: 0.75rem 0.5rem !important;
                  border-radius: 0.5rem !important;
                  transition: all 0.2s !important;
                  aspect-ratio: 1;
                  display: flex !important;
                  flex-direction: column !important;
                  align-items: center !important;
                  justify-content: flex-start !important;
                  font-size: 0.9rem !important;
                }
                .react-calendar__tile:hover {
                  background-color: #f3f4f6 !important;
                }
                .react-calendar__tile--active {
                  background-color: #3b82f6 !important;
                  color: white !important;
                }
                .react-calendar__tile--active:hover {
                  background-color: #2563eb !important;
                }
                .react-calendar__tile--now {
                  background-color: #eff6ff !important;
                  font-weight: 600 !important;
                }
                .react-calendar__tile--now:hover {
                  background-color: #dbeafe !important;
                }
                .react-calendar__tile--hasActive {
                  background-color: #3b82f6 !important;
                  color: white !important;
                }
                .react-calendar__month-view__days__day--weekend {
                  color: #ef4444 !important;
                }
                .react-calendar__month-view__days__day--neighboringMonth {
                  color: #d1d5db !important;
                }
              `}</style>
              <Calendar
                onChange={(value) => {
                  if (value instanceof Date) {
                    handleDateClick(value);
                  }
                }}
                value={selectedDate}
                tileContent={tileContent}
                tileClassName={tileClassName}
                className="w-full border-none shadow-none"
                nextLabel="▶"
                prevLabel="◀"
                next2Label=">>"
                prev2Label="<<"
                showNeighboringMonth={true}
                minDetail="month"
              />
            </CardContent>
          </Card>

          {/* Sidebar — Today's Events */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-lg">📅</span>
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              //  Updated sidebar rendering with labels (replace the existing sidebar map)
                {getEventsForDate(selectedDate).length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📭</div>
                    <p className="text-gray-500 text-sm">No consultations on this day</p>
                  </div>
                ) : (
                  getEventsForDate(selectedDate).map((c) => {
                    const Icon = typeIcons[c.consultation_type] || CalendarIcon;
                    const dateContext = getDateContext(c.scheduled_date);
                    const label = dateContext === "past" ? "Past" : dateContext === "today" ? "Today" : "Upcoming";
                    const labelColor = dateContext === "past" 
                      ? "bg-gray-100 text-gray-500" 
                      : dateContext === "today" 
                      ? "bg-blue-100 text-blue-600" 
                      : "bg-green-100 text-green-600";

                    return (
                      <Link key={c.id} href={`/leads/${c.lead_id}`}>
                        <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-all hover:shadow-sm">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                                style={{ backgroundColor: typeColors[c.consultation_type] }}
                              />
                              <div>
                                <div className="font-medium text-gray-900 text-sm">
                                  {c.lead_name}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                  <Icon className="h-3 w-3" />
                                  {typeLabels[c.consultation_type]}
                                  <span className="text-gray-300">•</span>
                                  {c.scheduled_time}
                                  <span className={`text-xs px-1.5 py-0.5 rounded ${labelColor}`}>
                                    {label}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Badge className={statusColors[c.status] || "bg-gray-100"}>
                              {c.status}
                            </Badge>
                          </div>
                          {c.meeting_link && (
                            <div className="text-xs text-blue-600 truncate mt-1">
                              🔗 {c.consultation_type === "phone" ? "Phone Call" : "Meeting Link"}
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {consultations.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="text-center py-12">
                <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No consultations scheduled</p>
              </CardContent>
            </Card>
          ) : (
            consultations.map((consultation) => {
              const Icon = typeIcons[consultation.consultation_type] || CalendarIcon;
              return (
                <Link key={consultation.id} href={`/leads/${consultation.lead_id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <div className="p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900">{consultation.lead_name}</h3>
                        <Badge className={statusColors[consultation.status] || "bg-gray-100"}>
                          {consultation.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Icon className="h-4 w-4" />
                        {typeLabels[consultation.consultation_type] || consultation.consultation_type}
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(consultation.scheduled_date).toLocaleDateString()} at {consultation.scheduled_time}
                      </div>
                      {consultation.meeting_link && (
                        <div className="text-sm text-blue-600 truncate">
                          🔗 {consultation.consultation_type === "phone" ? "Phone Call" : "Meeting Link"}
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}