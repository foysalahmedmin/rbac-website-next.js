export interface IReport {
  id: number;
  name: string;
  type: "leads" | "tasks" | "audit" | "performance";
  data: Record<string, unknown>; // Flexible JSON data
  created_at: string;
  updated_at: string;
}
