export interface IAuditLog {
  id: number;
  user_id: number | null;
  action: string;
  resource: string;
  resource_id: number | null;
  details: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  user?: {
    name: string;
    email: string;
  };
}
