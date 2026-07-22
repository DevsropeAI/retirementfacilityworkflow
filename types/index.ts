export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: number | null;
  current_location: string | null;
  retirement_status: string | null;
  monthly_income: number | null;
  desired_move_date: string | null;
  desired_country: string | null;
  budget: string | null;
  timeline: string | null;
  medical_requirements: string | null;
  family_info: string | null;
  lead_source: string;
  status: string;
  assigned_to: number | null;
  notes: string | null;
  communication_history: CommunicationEntry[];
  qualification_score: string | null;
  qualification_reasoning: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface CommunicationEntry {
  date: string;
  type: string;
  message: string;
  by: number;
}

export interface LeadCreate {
  name: string;
  email: string;
  phone: string;
  age?: number | null;
  current_location?: string | null;
  retirement_status?: string | null;
  monthly_income?: number | null;
  desired_move_date?: string | null;
  desired_country?: string | null;
  budget?: string | null;
  timeline?: string | null;
  medical_requirements?: string | null;
  family_info?: string | null;
  lead_source?: string;
}