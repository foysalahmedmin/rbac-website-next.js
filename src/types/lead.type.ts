export interface ILead {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  source: string | null;
  status: "new" | "contacted" | "qualified" | "lost" | "won";
  created_at: string;
  updated_at: string;
}
