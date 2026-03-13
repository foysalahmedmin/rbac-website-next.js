export interface IAuditLog {
  id: number;
  user_id: number;
  action: string;
  resource: string;
  resource_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
  user?: {
    name: string;
    email: string;
  };
}
