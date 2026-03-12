export interface ITask {
  id: number;
  title: string;
  description: string | null;
  status: "pending" | "in-progress" | "completed" | "on-hold";
  priority: "low" | "medium" | "high" | "critical";
  due_date: string | null;
  assignee_id: number | null;
  assignee?: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}
